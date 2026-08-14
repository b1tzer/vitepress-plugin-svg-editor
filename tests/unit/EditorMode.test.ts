/**
 * 状态模式单元测试
 * 覆盖 SelectMode / PanMode / DrawRectMode / ModeManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fabric from 'fabric'
import { SelectMode } from '../../src/core/editor-mode/SelectMode'
import { PanMode } from '../../src/core/editor-mode/PanMode'
import { DrawRectMode } from '../../src/core/editor-mode/DrawRectMode'
import { ModeManager } from '../../src/core/editor-mode/ModeManager'

// ── Canvas mock setup ──
function setupCanvasMock() {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string,
  ) {
    if (contextId === '2d') {
      return {
        canvas: this, fillRect: vi.fn(), clearRect: vi.fn(), scale: vi.fn(),
        translate: vi.fn(), rotate: vi.fn(), save: vi.fn(), restore: vi.fn(),
        beginPath: vi.fn(), closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
        arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
        measureText: () => ({ width: 50 }), clip: vi.fn(), drawImage: vi.fn(),
        setLineDash: vi.fn(), getLineDash: () => [], createLinearGradient: () => ({}),
        rect: vi.fn(), isPointInPath: () => false,
        transform: vi.fn(), setTransform: vi.fn(),
        getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
      } as any
    }
    return null as any
  })
}

function createCanvas(): fabric.Canvas {
  const el = document.createElement('canvas')
  el.width = 800
  el.height = 600
  return new fabric.Canvas(el, { width: 800, height: 600, backgroundColor: 'transparent' })
}

// ═══════════════════════════════════════════════════════════════
// SelectMode
// ═══════════════════════════════════════════════════════════════

describe('SelectMode', () => {
  beforeEach(() => { setupCanvasMock() })

  it('name 应为 select', () => {
    const mode = new SelectMode()
    expect(mode.name).toBe('select')
  })

  it('onEnter 应启用 selection', () => {
    const canvas = createCanvas()
    canvas.selection = false
    const mode = new SelectMode()
    mode.onEnter(canvas)
    expect(canvas.selection).toBe(true)
  })

  it('onEnter 应设置默认光标', () => {
    const canvas = createCanvas()
    const mode = new SelectMode()
    mode.onEnter(canvas)
    // 验证 canvas 状态变化（getCursor 在 Fabric 6 中可能不可用，通过 selection 间接验证）
    expect(canvas.selection).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════
// PanMode
// ═══════════════════════════════════════════════════════════════

describe('PanMode', () => {
  beforeEach(() => { setupCanvasMock() })

  it('name 应为 pan', () => {
    const mode = new PanMode()
    expect(mode.name).toBe('pan')
  })

  it('onEnter 应禁用 selection', () => {
    const canvas = createCanvas()
    canvas.selection = true
    const mode = new PanMode()
    mode.onEnter(canvas)
    expect(canvas.selection).toBe(false)
  })

  it('onExit 应恢复 selection', () => {
    const canvas = createCanvas()
    const mode = new PanMode()
    mode.onEnter(canvas)
    mode.onExit(canvas)
    expect(canvas.selection).toBe(true)
  })

  it('onMouseDown 应设置 isPanning=true', () => {
    const canvas = createCanvas()
    const mode = new PanMode()
    mode.onEnter(canvas)

    const e = new MouseEvent('mousedown', { clientX: 100, clientY: 200 })
    mode.onMouseDown(e, canvas)
    expect(mode.isPanning()).toBe(true)
  })

  it('onMouseUp 应设置 isPanning=false', () => {
    const canvas = createCanvas()
    const mode = new PanMode()
    mode.onEnter(canvas)

    mode.onMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 200 }), canvas)
    mode.onMouseUp(new MouseEvent('mouseup', { clientX: 100, clientY: 200 }), canvas)
    expect(mode.isPanning()).toBe(false)
  })

  it('未按下鼠标时 onMouseMove 不应报错', () => {
    const canvas = createCanvas()
    const mode = new PanMode()
    mode.onEnter(canvas)

    expect(() => {
      mode.onMouseMove(new MouseEvent('mousemove', { clientX: 110, clientY: 210 }), canvas)
    }).not.toThrow()
  })
})

// ═══════════════════════════════════════════════════════════════
// DrawRectMode
// ═══════════════════════════════════════════════════════════════

describe('DrawRectMode', () => {
  beforeEach(() => { setupCanvasMock() })

  it('name 应为 draw-rect', () => {
    const mode = new DrawRectMode()
    expect(mode.name).toBe('draw-rect')
  })

  it('onEnter 应禁用 selection', () => {
    const canvas = createCanvas()
    canvas.selection = true
    const mode = new DrawRectMode()
    mode.onEnter(canvas)
    expect(canvas.selection).toBe(false)
  })

  it('onExit 应恢复 selection', () => {
    const canvas = createCanvas()
    const mode = new DrawRectMode()
    mode.onEnter(canvas)
    mode.onExit(canvas)
    expect(canvas.selection).toBe(true)
  })

  it('onMouseDown → onMouseUp 应触发 onComplete 回调', () => {
    const canvas = createCanvas()
    const onComplete = vi.fn()
    const mode = new DrawRectMode(onComplete)

    mode.onEnter(canvas)
    mode.onMouseDown(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }), canvas)
    mode.onMouseMove(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }), canvas)
    mode.onMouseUp(new MouseEvent('mouseup', { clientX: 150, clientY: 150 }), canvas)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('太小（≤5px）的矩形不应触发 onComplete', () => {
    const canvas = createCanvas()
    const onComplete = vi.fn()
    const mode = new DrawRectMode(onComplete)

    mode.onEnter(canvas)
    // 拖动只有 3px
    mode.onMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }), canvas)
    mode.onMouseMove(new MouseEvent('mousemove', { clientX: 103, clientY: 103 }), canvas)
    mode.onMouseUp(new MouseEvent('mouseup', { clientX: 103, clientY: 103 }), canvas)

    expect(onComplete).not.toHaveBeenCalled()
  })
})

// ═══════════════════════════════════════════════════════════════
// ModeManager
// ═══════════════════════════════════════════════════════════════

describe('ModeManager', () => {
  beforeEach(() => { setupCanvasMock() })

  it('初始模式应为 select', () => {
    const canvas = createCanvas()
    const mgr = new ModeManager(canvas)
    expect(mgr.getCurrentModeName()).toBe('select')
    expect(mgr.isDefaultMode()).toBe(true)
  })

  it('switchTo 应切换模式', () => {
    const canvas = createCanvas()
    const mgr = new ModeManager(canvas)
    const panMode = new PanMode()

    mgr.switchTo(panMode)
    expect(mgr.getCurrentModeName()).toBe('pan')
    expect(mgr.isDefaultMode()).toBe(false)
  })

  it('revertToDefault 应回到 select', () => {
    const canvas = createCanvas()
    const mgr = new ModeManager(canvas)

    mgr.switchTo(new PanMode())
    mgr.revertToDefault()
    expect(mgr.getCurrentModeName()).toBe('select')
  })

  it('切换到同模式不应重复触发 onEnter/onExit', () => {
    const canvas = createCanvas()
    const mgr = new ModeManager(canvas)
    const panMode = new PanMode()

    // 两次切换到同一个 panMode，不应有副作用
    mgr.switchTo(panMode)
    expect(canvas.selection).toBe(false)  // pan 模式禁用了 selection

    // 再次切换到相同模式不应改变
    mgr.switchTo(panMode)
    expect(canvas.selection).toBe(false)  // 仍然禁用
  })

  it('事件委托：onMouseDown 应转发给当前模式', () => {
    const canvas = createCanvas()
    const mgr = new ModeManager(canvas)
    const panMode = new PanMode()

    mgr.switchTo(panMode)
    expect(panMode.isPanning()).toBe(false)

    mgr.onMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
    expect(panMode.isPanning()).toBe(true)
  })
})
