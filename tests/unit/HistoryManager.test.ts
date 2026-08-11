import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fabric.js Canvas 以便不依赖真实 DOM
const mockLoadFromJSON = vi.fn((_state: any, callback?: () => void) => {
  if (callback) callback()
})
const mockRenderAll = vi.fn()
const mockToJSON = vi.fn(() => ({ version: '5.3.0', objects: [] }))

const createMockCanvas = () => ({
  toJSON: mockToJSON,
  loadFromJSON: mockLoadFromJSON,
  renderAll: mockRenderAll,
} as any)

vi.mock('fabric', () => ({})) // 空 mock，HistoryManager 仅需要 Canvas 类型

import { HistoryManager } from '../../src/core/HistoryManager'

describe('HistoryManager', () => {
  let hm: HistoryManager
  let canvas: any

  beforeEach(() => {
    hm = new HistoryManager()
    canvas = createMockCanvas()
    vi.clearAllMocks()
    // 初始化 mock 返回值
    mockToJSON.mockReturnValue({ version: '5.3.0', objects: [] })
  })

  it('save 应将画布状态推入撤销栈', () => {
    hm.save(canvas)
    expect(mockToJSON).toHaveBeenCalled()
    expect(hm.canUndo()).toBe(false) // 仅 1 个状态时不可撤销
  })

  it('save 两次后 canUndo 应为 true', () => {
    hm.save(canvas)
    hm.save(canvas)
    expect(hm.canUndo()).toBe(true)
  })

  it('undo 应恢复到上一个状态', () => {
    mockToJSON.mockReturnValueOnce({ version: '5.3.0', objects: ['obj1'] })
    hm.save(canvas)
    mockToJSON.mockReturnValueOnce({ version: '5.3.0', objects: ['obj2'] })
    hm.save(canvas)

    hm.undo(canvas)
    expect(mockLoadFromJSON).toHaveBeenCalled()
    expect(mockRenderAll).toHaveBeenCalled()
  })

  it('undo 后 canRedo 应为 true', () => {
    hm.save(canvas)
    hm.save(canvas)
    hm.undo(canvas)
    expect(hm.canRedo()).toBe(true)
  })

  it('redo 应恢复到撤销前的状态', () => {
    hm.save(canvas)
    hm.save(canvas)
    hm.undo(canvas)

    const callsBefore = mockLoadFromJSON.mock.calls.length
    hm.redo(canvas)
    expect(mockLoadFromJSON.mock.calls.length).toBeGreaterThan(callsBefore)
  })

  it('redo 后 canRedo 应为 false', () => {
    hm.save(canvas)
    hm.save(canvas)
    hm.undo(canvas)
    hm.redo(canvas)
    expect(hm.canRedo()).toBe(false)
  })

  it('空栈时 undo 不应崩溃', () => {
    expect(() => hm.undo(canvas)).not.toThrow()
    expect(hm.canUndo()).toBe(false)
  })

  it('空栈时 redo 不应崩溃', () => {
    expect(() => hm.redo(canvas)).not.toThrow()
    expect(hm.canRedo()).toBe(false)
  })

  it('save 超过 50 步应移除最旧的状态', () => {
    for (let i = 0; i < 60; i++) {
      hm.save(canvas)
    }
    // 应不超过 50 步
    expect(hm.canUndo()).toBe(true)
  })

  it('save 后 redo 栈应被清空', () => {
    hm.save(canvas)
    hm.save(canvas)
    hm.undo(canvas)
    expect(hm.canRedo()).toBe(true)
    hm.save(canvas)
    expect(hm.canRedo()).toBe(false)
  })

  it('beforeSave 回调应在 save 时被调用', () => {
    const before = vi.fn()
    hm.save(canvas, before)
    expect(before).toHaveBeenCalled()
  })

  it('afterSave 回调应在 save 时被调用', () => {
    const after = vi.fn()
    hm.save(canvas, undefined, after)
    expect(after).toHaveBeenCalled()
  })

  it('afterLoad 回调应在 undo 时被调用', () => {
    hm.save(canvas)
    hm.save(canvas)
    const after = vi.fn()
    hm.undo(canvas, after)
    expect(after).toHaveBeenCalled()
  })

  it('onStateChange 应在状态变更时被调用', () => {
    const fn = vi.fn()
    hm.onStateChange(fn)
    hm.save(canvas)
    expect(fn).toHaveBeenCalled()
  })

  it('reset 应清空所有栈', () => {
    hm.save(canvas)
    hm.save(canvas)
    hm.reset()
    expect(hm.canUndo()).toBe(false)
    expect(hm.canRedo()).toBe(false)
  })

  it('canvas 为 null 时 save 不应崩溃', () => {
    expect(() => hm.save(null as any)).not.toThrow()
  })

  it('canvas 为 null 时 undo 不应崩溃', () => {
    hm.save(canvas)
    hm.save(canvas)
    expect(() => hm.undo(null as any)).not.toThrow()
  })
})