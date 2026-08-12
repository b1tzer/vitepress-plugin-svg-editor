/**
 * GuideLineManager 单元测试
 * 覆盖：getGuideLines、setupEvents 注册、EventBus 集成
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GuideLineManager } from '../../src/core/canvas/GuideLineManager'
import { EventBus } from '../../src/core/EventBus'

function createMockCanvas(onHandler: string, handlerFn: (opt: any) => void) {
  const mock = {
    requestRenderAll: vi.fn(),
    getObjects: vi.fn(() => []),
    getZoom: vi.fn(() => 1),
    getContext: vi.fn(() => ({
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      setLineDash: vi.fn(),
    })),
    on: vi.fn((event: string, fn: any) => {
      if (event === onHandler) handlerFn(fn)
    }),
    height: 600,
    width: 800,
    viewportTransform: [1, 0, 0, 1, 0, 0],
  }
  return mock
}

describe('GuideLineManager', () => {
  let eventBus: EventBus
  let manager: GuideLineManager

  beforeEach(() => {
    eventBus = new EventBus()
    manager = new GuideLineManager(eventBus)
  })

  it('初始引导线应为空数组', () => {
    expect(manager.getGuideLines()).toEqual([])
  })

  it('setupEvents 应注册 4 个画布事件', () => {
    const canvas = createMockCanvas('object:moving', vi.fn())
    manager.setupEvents(canvas as any)
    // object:moving, object:modified, selection:cleared, after:render
    expect(canvas.on).toHaveBeenCalledTimes(4)
  })

  it('object:moving 事件应通过 EventBus 发出 guideLinesChange', () => {
    const guideHandler = vi.fn()
    eventBus.on('guideLinesChange', guideHandler)

    const canvas = createMockCanvas('object:moving', (fn: any) => {})
    // 模拟 getObjects 返回两个对象触发引导线
    vi.spyOn(canvas, 'getObjects').mockReturnValue([
      {
        left: 0, top: 0, width: 100, height: 100, scaleX: 1, scaleY: 1, visible: true,
        getBoundingRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
      },
      {
        left: 100, top: 0, width: 100, height: 100, scaleX: 1, scaleY: 1, visible: true,
        getBoundingRect: () => ({ left: 100, top: 0, width: 100, height: 100 }),
      },
    ])

    manager.setupEvents(canvas as any)
    // 触发 object:moving
    const movingHandler = (canvas.on as any).mock.calls.find(
      (c: any) => c[0] === 'object:moving'
    )?.[1]
    if (movingHandler) {
      movingHandler({
        target: {
          left: 0, top: 0, width: 100, height: 100, scaleX: 1, scaleY: 1,
          getBoundingRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
        },
      })
    }
    expect(guideHandler).toHaveBeenCalled()
  })

  it('object:modified 应发出 modified 事件', () => {
    const modifiedHandler = vi.fn()
    eventBus.on('modified', modifiedHandler)

    const canvas = createMockCanvas('object:modified', (fn: any) => {})

    manager.setupEvents(canvas as any)
    const modifiedFn = (canvas.on as any).mock.calls.find(
      (c: any) => c[0] === 'object:modified'
    )?.[1]
    if (modifiedFn) {
      modifiedFn({ target: null })
    }
    expect(modifiedHandler).toHaveBeenCalled()
  })

  it('selection:cleared 应清空引导线', () => {
    const guidHandler = vi.fn()
    eventBus.on('guideLinesChange', guidHandler)

    const canvas = createMockCanvas('selection:cleared', (fn: any) => {})
    manager.setupEvents(canvas as any)
    const clearedFn = (canvas.on as any).mock.calls.find(
      (c: any) => c[0] === 'selection:cleared'
    )?.[1]
    if (clearedFn) {
      clearedFn()
    }
    expect(guidHandler).toHaveBeenCalledWith([])
  })

  it('after:render 无引导线时不应操作 canvas 上下文', () => {
    const canvas = createMockCanvas('after:render', (fn: any) => {})
    manager.setupEvents(canvas as any)
    const renderFn = (canvas.on as any).mock.calls.find(
      (c: any) => c[0] === 'after:render'
    )?.[1]
    // getContext 不应被调用
    const getContextSpy = vi.spyOn(canvas, 'getContext')
    if (renderFn) renderFn()
    expect(getContextSpy).not.toHaveBeenCalled()
  })

  it('getGuideLines 应返回当前引导线状态', () => {
    expect(manager.getGuideLines()).toEqual([])
  })
})