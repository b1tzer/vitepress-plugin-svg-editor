/**
 * ZoomPanController 单元测试
 * 覆盖：缩放、平移、逻辑尺寸、EventBus 集成、方法委托
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZoomPanController } from '../../src/core/canvas/ZoomPanController'
import { EventBus } from '../../src/core/EventBus'

/** 创建最小 mock fabric Canvas */
function createMockCanvas(overrides: Record<string, any> = {}) {
  return {
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    requestRenderAll: vi.fn(),
    getObjects: vi.fn(() => []),
    setCursor: vi.fn(),
    relativePan: vi.fn(),
    selection: true,
    ...overrides,
  }
}

describe('ZoomPanController', () => {
  let eventBus: EventBus
  let controller: ZoomPanController

  beforeEach(() => {
    eventBus = new EventBus()
    controller = new ZoomPanController(eventBus)
  })

  // ═══ 基础属性 ═══
  it('初始缩放级别应为 100', () => {
    expect(controller.getZoomLevel()).toBe(100)
  })

  it('初始逻辑尺寸应为 800×600', () => {
    expect(controller.getBaseWidth()).toBe(800)
    expect(controller.getBaseHeight()).toBe(600)
  })

  it('初始不应处于平移状态', () => {
    expect(controller.isPanning()).toBe(false)
    expect(controller.isSpacePressed()).toBe(false)
  })

  // ═══ bindCanvas ═══
  it('bindCanvas 后逻辑尺寸应更新为容器尺寸', () => {
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 1200, 900)
    expect(controller.getBaseWidth()).toBe(1200)
    expect(controller.getBaseHeight()).toBe(900)
  })

  // ═══ setLogicalSize ═══
  it('setLogicalSize 应更新逻辑尺寸并触发 _syncCanvasSize', () => {
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.setLogicalSize(1000, 800)
    expect(controller.getBaseWidth()).toBe(1000)
    expect(controller.getBaseHeight()).toBe(800)
    expect(canvas.setWidth).toHaveBeenCalled()
    expect(canvas.setHeight).toHaveBeenCalled()
  })

  // ═══ zoomIn / zoomOut ═══
  it('zoomIn 应增大缩放级别', () => {
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.zoomIn()
    expect(controller.getZoomLevel()).toBe(120) // 100 × 1.2
  })

  it('zoomOut 应减小缩放级别', () => {
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.zoomOut()
    // 100 / 1.2 ≈ 83
    expect(controller.getZoomLevel()).toBeLessThan(100)
    expect(controller.getZoomLevel()).toBeGreaterThan(80)
  })

  it('zoomIn 应通过 EventBus 发出 zoomChange 事件', () => {
    const handler = vi.fn()
    eventBus.on('zoomChange', handler)
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.zoomIn()
    expect(handler).toHaveBeenCalledWith(expect.any(Number))
  })

  // ═══ 空格平移 ═══
  it('setSpacePressed(true) 应设置空格状态', () => {
    controller.setSpacePressed(true)
    expect(controller.isSpacePressed()).toBe(true)
  })

  it('空格未按下时 handlePanMouseDown 应返回 false', () => {
    const canvas = createMockCanvas()
    const result = controller.handlePanMouseDown(
      { clientX: 100, clientY: 200 } as MouseEvent,
      canvas as any,
    )
    expect(result).toBe(false)
  })

  it('空格按下时 handlePanMouseDown 应返回 true', () => {
    const canvas = createMockCanvas()
    controller.setSpacePressed(true)
    const result = controller.handlePanMouseDown(
      { clientX: 100, clientY: 200 } as MouseEvent,
      canvas as any,
    )
    expect(result).toBe(true)
    expect(controller.isPanning()).toBe(true)
    expect(canvas.selection).toBe(false)
  })

  it('平移中 handlePanMouseMove 应返回 true', () => {
    const canvas = createMockCanvas()
    controller.setSpacePressed(true)
    controller.handlePanMouseDown({ clientX: 100, clientY: 200 } as MouseEvent, canvas as any)
    const result = controller.handlePanMouseMove(
      { clientX: 120, clientY: 210 } as MouseEvent,
      canvas as any,
    )
    expect(result).toBe(true)
    expect(canvas.relativePan).toHaveBeenCalled()
  })

  it('handlePanMouseUp 应结束平移并恢复选择', () => {
    const canvas = createMockCanvas()
    controller.setSpacePressed(true)
    controller.handlePanMouseDown({ clientX: 100, clientY: 200 } as MouseEvent, canvas as any)
    const result = controller.handlePanMouseUp(canvas as any)
    expect(result).toBe(true)
    expect(controller.isPanning()).toBe(false)
    expect(canvas.selection).toBe(true)
  })

  // ═══ unbindCanvas ═══
  it('unbindCanvas 后 setLogicalSize 不应崩溃', () => {
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.unbindCanvas()
    // 不应抛出异常
    expect(() => controller.setLogicalSize(100, 100)).not.toThrow()
  })

  // ═══ handleWheel ═══
  it('handleWheel 应调整缩放级别并发送事件', () => {
    const handler = vi.fn()
    eventBus.on('zoomChange', handler)
    const canvas = createMockCanvas()
    controller.bindCanvas(canvas as any, 800, 600)
    controller.handleWheel(100) // 向下滚
    expect(controller.getZoomLevel()).toBeLessThan(100)
    expect(handler).toHaveBeenCalled()
  })
})