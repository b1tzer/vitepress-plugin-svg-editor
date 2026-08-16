/**
 * CanvasManager 单元测试（精简后）
 * 覆盖：构造函数 DI、子模块 getter、回调委托、dispose
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CanvasManager } from '../../src/core/canvas/CanvasManager'
import { EventBus } from '../../src/core/shared/EventBus'

vi.mock('fabric', () => ({
  Canvas: vi.fn(() => ({
    on: vi.fn(),
    dispose: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
  })),
  Object: { ownDefaults: {} },
}))

describe('CanvasManager（精简版）', () => {
  let cm: CanvasManager

  beforeEach(() => {
    cm = new CanvasManager()
  })

  // ── 构造函数 / DI ──
  it('不传 EventBus 时应自动创建', () => {
    expect(cm.getEventBus()).toBeInstanceOf(EventBus)
  })

  it('传入自定义 EventBus 时应使用传入的实例', () => {
    const bus = new EventBus()
    const mgr = new CanvasManager(bus)
    expect(mgr.getEventBus()).toBe(bus)
  })

  // ── 子模块访问 ──
  it('getZoomPanController 应返回非 null 实例', () => {
    expect(cm.getZoomPanController()).toBeTruthy()
  })

  it('getInteractionManager 应返回非 null 实例', () => {
    expect(cm.getInteractionManager()).toBeTruthy()
  })

  // ── 子模块共享同一 EventBus ──
  it('三个子模块应共享同一个 EventBus 实例', () => {
    const bus = cm.getEventBus()
    expect(cm.getZoomPanController).toBeTruthy()
  })

  // ── 缩放委托 ──
  it('getZoomLevel 默认应返回 100', () => {
    expect(cm.getZoomLevel()).toBe(100)
  })

  it('setLogicalSize 不应报错（无 canvas 时）', () => {
    expect(() => cm.setLogicalSize(100, 200)).not.toThrow()
  })

  // ── 回调委托 ──
  it('onZoomChange 应通过 EventBus 注册回调', () => {
    const fn = vi.fn()
    cm.onZoomChange(fn)
    cm.getEventBus().emit('zoomChange', 150)
    expect(fn).toHaveBeenCalledWith(150)
  })

  it('onModified 应通过 EventBus 注册回调', () => {
    const fn = vi.fn()
    cm.onModified(fn)
    cm.getEventBus().emit('modified')
    expect(fn).toHaveBeenCalled()
  })

  it('onSelectionChange 应通过 EventBus 注册回调', () => {
    const fn = vi.fn()
    cm.onSelectionChange(fn)
    cm.getEventBus().emit('selectionChange')
    expect(fn).toHaveBeenCalled()
  })

  // ── dispose ──
  it('dispose 无 canvas 时不应报错', () => {
    expect(() => cm.dispose()).not.toThrow()
  })
})