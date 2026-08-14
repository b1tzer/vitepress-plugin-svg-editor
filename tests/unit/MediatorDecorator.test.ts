/**
 * 中介者 + 装饰器模式单元测试
 * 覆盖 EditorMediator / DirtyTracker
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fabric from 'fabric'
import { EditorMediator, type IToolbarComponent, type ICanvasComponent, type IPropertyPanel } from '../../src/core/EditorMediator'
import { withDirtyTracking, withAutoSave, withSnapToGrid, applyDecorators } from '../../src/core/decorators/DirtyTracker'

// ── Canvas mock ──
function setupCanvasMock() {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement, contextId: string,
  ) {
    if (contextId === '2d') {
      return {
        canvas: this, fillRect: vi.fn(), clearRect: vi.fn(), scale: vi.fn(),
        translate: vi.fn(), save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(),
        closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), arc: vi.fn(),
        fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(), measureText: () => ({ width: 50 }),
        setLineDash: vi.fn(), getLineDash: () => [], createLinearGradient: () => ({}),
        rect: vi.fn(), isPointInPath: () => false, drawImage: vi.fn(),
        transform: vi.fn(), setTransform: vi.fn(),
        getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
      } as any
    }
    return null as any
  })
}

function createCanvas() {
  setupCanvasMock()
  const el = document.createElement('canvas'); el.width = 800; el.height = 600
  return new fabric.Canvas(el, { width: 800, height: 600, backgroundColor: 'transparent' })
}

// ═══════════════════════════════════════════════════════════════
// EditorMediator
// ═══════════════════════════════════════════════════════════════

describe('EditorMediator', () => {
  let mediator: EditorMediator
  let mockToolbar: IToolbarComponent
  let mockPanel: IPropertyPanel
  let mockCanvas: ICanvasComponent

  beforeEach(() => {
    mediator = new EditorMediator()
    mockToolbar = {
      setActiveTool: vi.fn(),
      updateUndoRedoState: vi.fn(),
    }
    mockPanel = {
      setSelectedObject: vi.fn(),
      refreshProperties: vi.fn(),
    }
    mockCanvas = {
      setToolMode: vi.fn(),
      getActiveObject: vi.fn(() => null),
    }
  })

  it('初始状态 currentTool 为 select', () => {
    expect(mediator.getCurrentTool()).toBe('select')
  })

  it('onToolSelected 应更新状态并通知 toolbar 和 canvas', () => {
    mediator.registerToolbar(mockToolbar)
    mediator.registerCanvas(mockCanvas)

    mediator.onToolSelected('rect')

    expect(mediator.getCurrentTool()).toBe('rect')
    expect(mockToolbar.setActiveTool).toHaveBeenCalledWith('rect')
    expect(mockCanvas.setToolMode).toHaveBeenCalledWith('rect')
  })

  it('onSelectionChanged 应通知 propertyPanel', () => {
    mediator.registerPropertyPanel(mockPanel)

    mediator.onSelectionChanged({ type: 'rect' } as any)
    expect(mockPanel.setSelectedObject).toHaveBeenCalled()
  })

  it('onSelectionChanged(null) 应清空选中', () => {
    mediator.registerPropertyPanel(mockPanel)

    mediator.onSelectionChanged(null)
    expect(mockPanel.setSelectedObject).toHaveBeenCalledWith(null)
  })

  it('onUndoRedoStateChanged 应更新 toolbar', () => {
    mediator.registerToolbar(mockToolbar)

    mediator.onUndoRedoStateChanged(true, false)
    expect(mockToolbar.updateUndoRedoState).toHaveBeenCalledWith(true, false)
    expect(mediator.getCanUndo()).toBe(true)
    expect(mediator.getCanRedo()).toBe(false)
  })

  it('onSaveRequested 应触发所有监听者', async () => {
    const save1 = vi.fn()
    const save2 = vi.fn()
    mediator.onSaveRequest(save1)
    mediator.onSaveRequest(save2)

    await mediator.onSaveRequested()
    expect(save1).toHaveBeenCalled()
    expect(save2).toHaveBeenCalled()
  })

  it('onThemeToggled 应触发监听者', () => {
    const fn = vi.fn()
    mediator.onThemeToggle(fn)

    mediator.onThemeToggled()
    expect(fn).toHaveBeenCalled()
  })

  it('destroy 应清空所有状态', () => {
    mediator.registerToolbar(mockToolbar)
    mediator.onSaveRequest(vi.fn())

    mediator.destroy()

    // 验证不会抛错（内部状态为 null 了）
    expect(() => mediator.onToolSelected('pan')).not.toThrow()
    expect(mediator.getCurrentTool()).toBe('pan') // 状态还在但组件未通知
  })
})

// ═══════════════════════════════════════════════════════════════
// DirtyTracker 装饰器
// ═══════════════════════════════════════════════════════════════

describe('DirtyTracker 装饰器', () => {
  beforeEach(() => { setupCanvasMock() })

  describe('withDirtyTracking', () => {
    it('移动对象应触发 onDirty 回调', () => {
      const canvas = createCanvas()
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      canvas.add(rect)
      const onDirty = vi.fn()

      withDirtyTracking(rect, onDirty)
      rect.fire('moving', {})  // 触发 'moving' 事件等同于拖拽中

      expect(onDirty).toHaveBeenCalledWith(rect)
    })

    it('缩放对象应触发 onDirty 回调', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const onDirty = vi.fn()

      withDirtyTracking(rect, onDirty)
      rect.fire('scaling', {})

      expect(onDirty).toHaveBeenCalled()
    })

    it('modified 事件应触发 onDirty 回调', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const onDirty = vi.fn()

      withDirtyTracking(rect, onDirty)
      rect.fire('modified', {})

      expect(onDirty).toHaveBeenCalled()
    })

    it('返回的应是同一对象引用', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const result = withDirtyTracking(rect, vi.fn())
      expect(result).toBe(rect)
    })
  })

  describe('withAutoSave', () => {
    it('modified 后应延迟触发保存', async () => {
      vi.useFakeTimers()
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const saveFn = vi.fn()

      withAutoSave(rect, saveFn, 500)
      rect.fire('modified', {})

      // 不应立即触发
      expect(saveFn).not.toHaveBeenCalled()

      // 500ms 后应触发
      vi.advanceTimersByTime(500)
      expect(saveFn).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('连续修改应防抖（只触发一次）', async () => {
      vi.useFakeTimers()
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const saveFn = vi.fn()

      withAutoSave(rect, saveFn, 500)

      // 快速连续触发 3 次
      rect.fire('moving', {})
      rect.fire('scaling', {})
      rect.fire('modified', {})

      vi.advanceTimersByTime(500)
      expect(saveFn).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })
  })

  describe('withSnapToGrid', () => {
    it('移动后应吸附到网格', () => {
      const rect = new fabric.Rect({ left: 13, top: 27, width: 50, height: 50, fill: 'red' })
      const canvas = createCanvas()
      canvas.add(rect)

      withSnapToGrid(rect, 10)

      // 模拟用户拖拽到 13,27 后松手
      rect.set({ left: 13, top: 27 })
      rect.fire('modified', {})

      // 应吸附到 10,30（最近网格点）
      expect(rect.left).toBe(10)
      expect(rect.top).toBe(30)
    })

    it('已在网格点上时不移动', () => {
      const rect = new fabric.Rect({ left: 20, top: 30, width: 50, height: 50, fill: 'red' })
      const canvas = createCanvas()
      canvas.add(rect)

      withSnapToGrid(rect, 10)

      rect.fire('modified', {})
      expect(rect.left).toBe(20)
      expect(rect.top).toBe(30)
    })
  })

  describe('applyDecorators', () => {
    it('应依次应用所有装饰器', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      const fn1 = vi.fn()
      const fn2 = vi.fn()

      const deco1 = (o: fabric.FabricObject) => { fn1(); return o }
      const deco2 = (o: fabric.FabricObject) => { fn2(); return o }

      applyDecorators(rect, [deco1, deco2])
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
    })
  })
})
