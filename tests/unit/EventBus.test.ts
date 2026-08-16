import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventBus } from '../../src/core/shared/EventBus'

describe('EventBus', () => {
  let bus: EventBus

  beforeEach(() => {
    bus = new EventBus()
  })

  it('应正确注册并触发事件', () => {
    const handler = vi.fn()
    bus.on('zoomChange', handler)
    bus.emit('zoomChange', 150)
    expect(handler).toHaveBeenCalledWith(150)
  })

  it('同一事件应支持多个监听器', () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on('zoomChange', h1)
    bus.on('zoomChange', h2)
    bus.emit('zoomChange', 200)
    expect(h1).toHaveBeenCalledWith(200)
    expect(h2).toHaveBeenCalledWith(200)
  })

  it('多监听器应按注册顺序触发', () => {
    const order: number[] = []
    bus.on('zoomChange', () => order.push(1))
    bus.on('zoomChange', () => order.push(2))
    bus.on('zoomChange', () => order.push(3))
    bus.emit('zoomChange', 100)
    expect(order).toEqual([1, 2, 3])
  })

  it('off 应正确注销监听器', () => {
    const handler = vi.fn()
    bus.on('zoomChange', handler)
    bus.off('zoomChange', handler)
    bus.emit('zoomChange', 100)
    expect(handler).not.toHaveBeenCalled()
  })

  it('off 未注册的 handler 不应报错', () => {
    const handler = vi.fn()
    expect(() => bus.off('zoomChange', handler)).not.toThrow()
  })

  it('emit 未注册的事件不应报错', () => {
    expect(() => bus.emit('selectionChange' as any, null)).not.toThrow()
  })

  it('一个 handler 抛异常不应影响其他 handler', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ok = vi.fn()
    bus.on('zoomChange', () => { throw new Error('bang') })
    bus.on('zoomChange', ok)
    bus.emit('zoomChange', 100)
    expect(ok).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('clear 应清除所有监听器', () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on('zoomChange', h1)
    bus.on('selectionChange' as any, h2 as any)
    bus.clear()
    bus.emit('zoomChange', 100)
    bus.emit('selectionChange' as any, null)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('不同类型事件应独立触发', () => {
    const zoomHandler = vi.fn()
    const guideHandler = vi.fn()
    bus.on('zoomChange', zoomHandler)
    bus.on('guideLinesChange', guideHandler)
    bus.emit('zoomChange', 150)
    expect(zoomHandler).toHaveBeenCalled()
    expect(guideHandler).not.toHaveBeenCalled()
  })
})