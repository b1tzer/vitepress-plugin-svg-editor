/**
 * InteractionManager 单元测试
 * 覆盖：object:added、mouse:over/out、selection 事件、textbox 缩放
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InteractionManager } from '../../src/core/canvas/InteractionManager'
import { EventBus } from '../../src/core/shared/EventBus'

describe('InteractionManager', () => {
  let eventBus: EventBus
  let interaction: InteractionManager
  let canvas: any
  let eventCallbacks: Record<string, (...args: unknown[]) => void>

  beforeEach(() => {
    eventBus = new EventBus()
    interaction = new InteractionManager(eventBus)
    eventCallbacks = {}

    canvas = {
      requestRenderAll: vi.fn(),
      getActiveObject: vi.fn(() => null),
      setCursor: vi.fn(),
      on: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
        eventCallbacks[event] = callback
      }),
    }
  })

  it('setupEvents 应注册 7 个画布事件', () => {
    interaction.setupEvents(canvas as any)
    // object:added, mouse:over, mouse:out,
    // selection:created, selection:updated, selection:cleared,
    // object:scaling, object:modified
    expect(canvas.on).toHaveBeenCalledTimes(8)
  })

  // ── object:added ──
  it('object:added 应设置对象为可交互', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['object:added']?.({
      target: { type: 'rect', fill: '#ff0000', set: setMock },
    })
    expect(setMock).toHaveBeenCalledWith({ selectable: true, evented: true })
  })

  it('object:added 应对无填充图形设置透明填充', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['object:added']?.({
      target: { type: 'rect', fill: 'none', set: setMock },
    })
    // 第一次 set: { selectable: true, evented: true }
    // 第二次 set: { fill: 'rgba(0,0,0,0.001)' }
    expect(setMock).toHaveBeenCalledWith(expect.objectContaining({ fill: 'rgba(0,0,0,0.001)' }))
  })

  it('object:added 应对 text 不设置透明填充（文本自身可点击）', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['object:added']?.({
      target: { type: 'text', fill: 'none', set: setMock },
    })
    // 只调用一次（selectable + evented），不调用第二次（fill）
    expect(setMock).toHaveBeenCalledTimes(1)
  })

  // ── mouse:over ──
  it('mouse:over 应对可选中对象设置指针光标和高亮边框', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['mouse:over']?.({
      target: { selectable: true, set: setMock, borderColor: '#333' },
    })
    expect(canvas.setCursor).toHaveBeenCalledWith('pointer')
    expect(setMock).toHaveBeenCalledWith({ borderColor: '#0078d4' })
  })

  // ── mouse:out ──
  it('mouse:out 应恢复默认光标', () => {
    interaction.setupEvents(canvas as any)
    eventCallbacks['mouse:out']?.({
      target: { set: vi.fn(), _origBorderColor: '#0078d4' },
    })
    expect(canvas.setCursor).toHaveBeenCalledWith('default')
  })

  // ── 选择事件 ──
  it('selection:created 应发出 selectionChange 事件', () => {
    const handler = vi.fn()
    eventBus.on('selectionChange', handler)
    interaction.setupEvents(canvas as any)
    eventCallbacks['selection:created']?.()
    expect(handler).toHaveBeenCalled()
  })

  it('selection:cleared 应发出 selectionChange 事件', () => {
    const handler = vi.fn()
    eventBus.on('selectionChange', handler)
    interaction.setupEvents(canvas as any)
    eventCallbacks['selection:cleared']?.()
    expect(handler).toHaveBeenCalled()
  })

  // ── textbox 缩放 ──
  it('object:scaling 对 textbox 应保持字号不变', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['object:scaling']?.({
      target: { type: 'textbox', fontSize: 16, scaleY: 2, set: setMock },
    })
    expect(setMock).toHaveBeenCalledWith({ fontSize: expect.any(Number) })
  })

  it('object:scaling 对 rect 不应干预', () => {
    interaction.setupEvents(canvas as any)
    const setMock = vi.fn()
    eventCallbacks['object:scaling']?.({
      target: { type: 'rect', set: setMock },
    })
    // rect 不是 textbox，不应修改 fontSize
    expect(setMock).not.toHaveBeenCalled()
  })
})
