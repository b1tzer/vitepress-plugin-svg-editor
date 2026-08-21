/**
 * 工具栏结构操作集成测试（对齐 design/10-test-strategy.md 2.3「插件加载 → 工具栏渲染」）
 *
 * 实际架构：插件为纯函数工具模块，useStructureOps（工具栏 facade）聚合
 * align / distribute / layer 插件并作用于真实 Fabric 画布。
 * 本文件验证「工具栏操作 → 插件 → 画布对象状态」的完整链路。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fabric from 'fabric'
import { CanvasManager } from '../../src/core/canvas/CanvasManager'
import { HistoryManager } from '../../src/core/history/HistoryManager'
import { useSelection } from '../../src/composables/useSelection'
import { useStructureOps } from '../../src/composables/useStructureOps'

describe('工具栏结构操作集成测试', () => {
  let canvasEl: HTMLCanvasElement
  let canvasMgr: CanvasManager
  let history: HistoryManager
  let selection: ReturnType<typeof useSelection>
  let structure: ReturnType<typeof useStructureOps>

  beforeEach(() => {
    canvasEl = document.createElement('canvas')
    canvasEl.width = 800
    canvasEl.height = 600
    document.body.appendChild(canvasEl)

    canvasMgr = new CanvasManager()
    canvasMgr.canvas = new fabric.Canvas(canvasEl, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false,
    })
    history = new HistoryManager()
    selection = useSelection(canvasMgr)
    const commit = (fn: (fc: fabric.Canvas) => void) => {
      const fc = canvasMgr.canvas!
      fn(fc)
      history.save(fc)
    }
    structure = useStructureOps({
      canvasMgr,
      updateSelectionInfo: selection.updateSelectionInfo,
      commit,
    })
  })

  afterEach(() => {
    canvasMgr.dispose()
    document.body.removeChild(canvasEl)
  })

  function makeActiveSelection(objects: fabric.FabricObject[]) {
    const canvas = canvasMgr.canvas!
    canvas.discardActiveObject()
    const sel = new fabric.ActiveSelection(objects, { canvas })
    canvas.setActiveObject(sel)
    canvas.renderAll()
    return sel
  }

  it('align("left") 应使多选对象左对齐', () => {
    const canvas = canvasMgr.canvas!
    const a = new fabric.Rect({ left: 10, top: 10, width: 50, height: 40, fill: '#000' })
    const b = new fabric.Rect({ left: 60, top: 60, width: 50, height: 40, fill: '#000' })
    canvas.add(a, b)
    canvas.renderAll()

    makeActiveSelection([a, b])
    structure.align('left')

    // 左对齐后，两个对象的 left 坐标应一致（ActiveSelection 下为相对坐标）
    expect(a.left).toBe(b.left)
  })

  it('distribute("horizontal") 应使多选对象水平等距', () => {
    const canvas = canvasMgr.canvas!
    const a = new fabric.Rect({ left: 0, top: 0, width: 10, height: 10, fill: '#000' })
    const b = new fabric.Rect({ left: 10, top: 0, width: 10, height: 10, fill: '#000' })
    const c = new fabric.Rect({ left: 30, top: 0, width: 10, height: 10, fill: '#000' })
    canvas.add(a, b, c)
    canvas.renderAll()

    makeActiveSelection([a, b, c])
    structure.distribute('horizontal')

    // 分布后相邻对象 left 差应相等
    const sorted = [a, b, c].sort((x, y) => x.left! - y.left!)
    const gap1 = sorted[1].left! - sorted[0].left!
    const gap2 = sorted[2].left! - sorted[1].left!
    expect(gap1).toBeCloseTo(gap2)
  })

  it('layerToFront 应将被选对象置顶', () => {
    const canvas = canvasMgr.canvas!
    const a = new fabric.Rect({ left: 10, top: 10, width: 50, height: 40, fill: '#000' })
    const b = new fabric.Rect({ left: 20, top: 20, width: 50, height: 40, fill: '#000' })
    canvas.add(a, b)
    canvas.renderAll()
    // 初始顺序 [a, b]
    expect(canvas.getObjects()[0]).toBe(a)

    canvas.setActiveObject(a)
    structure.layerToFront()

    expect(canvas.getObjects()[canvas.getObjects().length - 1]).toBe(a)
  })
})
