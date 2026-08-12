/**
 * Command + Canvas 集成测试 — 使用真实 Fabric.js 验证 Command 模式的 undo/redo
 *
 * 设计理念：
 *   单元测试（mock）能测「逻辑正确」，但无法验证「真实行为正确」
 *   本文件使用真实 Fabric.js + happy-dom，验证 Command 在画布上的实际效果
 *
 * 测试内容：
 *   - MoveCommand 在真实画布上移动对象 → undo 恢复到原位
 *   - AddCommand / RemoveCommand 的添加/移除循环
 *   - PropertyChangeCommand 修改样式属性后 undo 恢复
 *   - CommandHistory 连续 undo/redo 后对象状态一致
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fabric from 'fabric'
import { CommandHistory } from '../../src/core/CommandHistory'
import { MoveCommand, AddCommand, RemoveCommand, PropertyChangeCommand } from '../../src/core/Command'

// ── happy-dom Canvas mock ──
function setupCanvasMock() {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string,
    ...args: any[]
  ) {
    if (contextId === '2d') {
      return {
        canvas: this,
        fillRect: vi.fn(), clearRect: vi.fn(), scale: vi.fn(), translate: vi.fn(),
        rotate: vi.fn(), save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(),
        closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), arc: vi.fn(),
        arcTo: vi.fn(), bezierCurveTo: vi.fn(), quadraticCurveTo: vi.fn(),
        rect: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
        strokeText: vi.fn(), measureText: () => ({ width: 50 }),
        clip: vi.fn(), drawImage: vi.fn(), setLineDash: vi.fn(),
        getLineDash: () => [], createLinearGradient: () => ({}),
        createRadialGradient: () => ({}), createPattern: () => ({}),
        putImageData: vi.fn(), getImageData: () => ({ data: [] }),
        setTransform: vi.fn(), transform: vi.fn(), isPointInPath: () => false,
        isPointInStroke: () => false, globalAlpha: 1,
      } as any
    }
    return null as any
  })
}

// ═══════════════════════════════════════════════════════════════

describe('CommandHistory + Fabric.js 集成', () => {
  let canvas: fabric.Canvas
  let history: CommandHistory
  let canvasEl: HTMLCanvasElement

  beforeEach(() => {
    setupCanvasMock()
    canvasEl = document.createElement('canvas')
    canvasEl.width = 800
    canvasEl.height = 600

    canvas = new fabric.Canvas(canvasEl, {
      width: 800,
      height: 600,
      backgroundColor: 'transparent',
    })
    history = new CommandHistory()
  })

  // ═══════════════════════════════════════════════════════════════
  // MoveCommand 集成
  // ═══════════════════════════════════════════════════════════════

  describe('MoveCommand', () => {
    it('execute → undo 后对象位置应精确恢复', () => {
      const rect = new fabric.Rect({ left: 100, top: 200, width: 50, height: 50, fill: 'red' })
      canvas.add(rect)

      const cmd = new MoveCommand(rect, 50, -30)
      history.execute(cmd)

      expect(rect.left).toBe(150)
      expect(rect.top).toBe(170)

      history.undo()
      expect(rect.left).toBe(100)
      expect(rect.top).toBe(200)
    })

    it('连续多次 execute/undo 不应累积误差', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      canvas.add(rect)

      // 5 次移动 → 5 次撤销 → 应回到原点
      for (let i = 0; i < 5; i++) {
        history.execute(new MoveCommand(rect, 10, 10))
      }
      expect(rect.left).toBe(50)
      expect(rect.top).toBe(50)

      for (let i = 0; i < 5; i++) {
        history.undo()
      }
      expect(rect.left).toBe(0)
      expect(rect.top).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // AddCommand / RemoveCommand 集成
  // ═══════════════════════════════════════════════════════════════

  describe('AddCommand / RemoveCommand', () => {
    it('AddCommand undo 后对象应从画布移除', () => {
      const rect = new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: 'blue' })

      history.execute(new AddCommand(rect, canvas))
      expect(canvas.getObjects()).toHaveLength(1)

      history.undo()
      expect(canvas.getObjects()).toHaveLength(0)
    })

    it('RemoveCommand undo 后对象应恢复', () => {
      const rect = new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: 'blue' })
      canvas.add(rect)
      expect(canvas.getObjects()).toHaveLength(1)

      history.execute(new RemoveCommand(rect, canvas))
      expect(canvas.getObjects()).toHaveLength(0)

      history.undo()
      expect(canvas.getObjects()).toHaveLength(1)
      expect(canvas.getObjects()[0]).toBe(rect)
    })

    it('添加 → 删除 → undo 删除 → 对象恢复', () => {
      const rect = new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: 'green' })

      history.execute(new AddCommand(rect, canvas))
      history.execute(new RemoveCommand(rect, canvas))
      expect(canvas.getObjects()).toHaveLength(0)

      history.undo()  // 撤销删除 → rect 恢复
      expect(canvas.getObjects()).toHaveLength(1)

      history.undo()  // 撤销添加 → rect 移除
      expect(canvas.getObjects()).toHaveLength(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // PropertyChangeCommand 集成
  // ═══════════════════════════════════════════════════════════════

  describe('PropertyChangeCommand', () => {
    it('修改填充色后 undo 应恢复原色', () => {
      const rect = new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: '#ff0000' })
      canvas.add(rect)

      const cmd = new PropertyChangeCommand(rect, { fill: '#ff0000' }, { fill: '#00ff00' })
      history.execute(cmd)
      expect(rect.fill).toBe('#00ff00')

      history.undo()
      expect(rect.fill).toBe('#ff0000')
    })

    it('修改多个属性后 undo 应全部恢复', () => {
      const rect = new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: '#ff0000', opacity: 1 })
      canvas.add(rect)

      const cmd = new PropertyChangeCommand(
        rect,
        { fill: '#ff0000', opacity: 1 },
        { fill: '#0000ff', opacity: 0.5 },
      )
      history.execute(cmd)
      expect(rect.fill).toBe('#0000ff')
      expect(rect.opacity).toBe(0.5)

      history.undo()
      expect(rect.fill).toBe('#ff0000')
      expect(rect.opacity).toBe(1)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // 混合操作
  // ═══════════════════════════════════════════════════════════════

  describe('混合操作', () => {
    it('移动 + 改色 + 删除 → 全部 undo 恢复原状', () => {
      const rect = new fabric.Rect({ left: 100, top: 100, width: 50, height: 50, fill: 'red' })
      canvas.add(rect)

      // 1. 移动
      history.execute(new MoveCommand(rect, 50, 0))
      // 2. 改色
      history.execute(new PropertyChangeCommand(rect, { fill: 'red' }, { fill: 'blue' }))
      // 3. 删除
      history.execute(new RemoveCommand(rect, canvas))

      expect(canvas.getObjects()).toHaveLength(0)

      // undo 删除
      history.undo()
      expect(canvas.getObjects()).toHaveLength(1)
      const restored = canvas.getObjects()[0]
      expect(restored.fill).toBe('blue')
      expect(restored.left).toBe(150)

      // undo 改色
      history.undo()
      expect(canvas.getObjects()[0].fill).toBe('red')

      // undo 移动
      history.undo()
      expect(canvas.getObjects()[0].left).toBe(100)
    })

    it('undo → 新操作 → redo 栈清空', () => {
      const rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, fill: 'red' })
      canvas.add(rect)

      history.execute(new MoveCommand(rect, 30, 0))
      history.execute(new MoveCommand(rect, 30, 0))

      history.undo()  // redo 栈中应有 1 个 MoveCommand
      expect(history.canRedo()).toBe(true)

      // 新的移动 → redo 栈清空
      history.execute(new MoveCommand(rect, 10, 10))
      expect(history.canRedo()).toBe(false)
    })
  })
})
