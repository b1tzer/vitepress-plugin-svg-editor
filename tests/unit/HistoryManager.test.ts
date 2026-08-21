import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HistoryManager } from '../../src/core/history/HistoryManager'

vi.mock('fabric', () => ({}))

/** 创建 mock Fabric.js Canvas 实例 */
function createMockCanvas() {
  return {
    toJSON: vi.fn().mockReturnValue({ version: '6.0.0', objects: [] }),
    loadFromJSON: vi.fn().mockResolvedValue(undefined),
    renderAll: vi.fn(),
    clear: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
  }
}

/** 重置 mock canvas 的所有 spy */
function resetMockCanvas(c: ReturnType<typeof createMockCanvas>) {
  vi.clearAllMocks()
}

describe('HistoryManager', () => {
  let hm: HistoryManager
  let canvas: ReturnType<typeof createMockCanvas>

  beforeEach(() => {
    hm = new HistoryManager()
    canvas = createMockCanvas()
    resetMockCanvas(canvas)
  })

  // ══════════════════════════════════════════════════════
  // 基础 save/undo/redo
  // ══════════════════════════════════════════════════════
  it('save 应将画布状态推入撤销栈', () => {
    hm.save(canvas as any)
    expect(canvas.toJSON).toHaveBeenCalled()
    expect(hm.canUndo()).toBe(false) // 仅 1 个状态时不可撤销
  })

  it('save 两次后 canUndo 应为 true', () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    expect(hm.canUndo()).toBe(true)
  })

  it('undo 应恢复到上一个状态（Fabric 6 async 模式）', async () => {
    canvas.toJSON.mockReturnValueOnce({ version: '6.0.0', objects: ['obj1'] })
    hm.save(canvas as any)
    canvas.toJSON.mockReturnValueOnce({ version: '6.0.0', objects: ['obj2'] })
    hm.save(canvas as any)

    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    expect(canvas.renderAll).toHaveBeenCalled()
  })

  it('undo 前应调用 canvas.clear()', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.clear).toHaveBeenCalled()
    })
  })

  it('undo 后应对无填充对象设置透明填充', async () => {
    const mockSetCoords = vi.fn()
    const mockSet = vi.fn()
    canvas.getObjects.mockReturnValue([
      { type: 'rect', set: mockSet, setCoords: mockSetCoords, fill: 'none' },
    ])

    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)

    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ fill: 'rgba(0,0,0,0.001)' }))
    expect(mockSetCoords).toHaveBeenCalled()
  })

  it('undo 后 canRedo 应为 true', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    expect(hm.canRedo()).toBe(true)
  })

  it('redo 应恢复到撤销前的状态', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })

    const callsBefore = canvas.loadFromJSON.mock.calls.length
    hm.redo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON.mock.calls.length).toBeGreaterThan(callsBefore)
    })
  })

  it('redo 后 canRedo 应为 false', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    hm.redo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON.mock.calls.length).toBe(2)
    })
    expect(hm.canRedo()).toBe(false)
  })

  // ══════════════════════════════════════════════════════
  // 边界条件
  // ══════════════════════════════════════════════════════
  it('空栈时 undo 不应崩溃', () => {
    expect(() => hm.undo(canvas as any)).not.toThrow()
    expect(hm.canUndo()).toBe(false)
  })

  it('空栈时 redo 不应崩溃', () => {
    expect(() => hm.redo(canvas as any)).not.toThrow()
    expect(hm.canRedo()).toBe(false)
  })

  it('save 超过 50 步应移除最旧的状态', () => {
    for (let i = 0; i < 60; i++) {
      hm.save(canvas as any)
    }
    expect(hm.canUndo()).toBe(true)
  })

  it('save 后 redo 栈应被清空', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.undo(canvas as any)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    expect(hm.canRedo()).toBe(true)
    hm.save(canvas as any)
    expect(hm.canRedo()).toBe(false)
  })

  // ══════════════════════════════════════════════════════
  // 回调 & 兜底
  // ══════════════════════════════════════════════════════
  it('afterLoad 回调应在 undo 时被调用', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    const after = vi.fn()
    hm.undo(canvas as any, after)
    await vi.waitFor(() => {
      expect(canvas.loadFromJSON).toHaveBeenCalled()
    })
    expect(after).toHaveBeenCalled()
  })

  it('undo 失败时 loadFromJSON 抛异常应触发兜底恢复', async () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    expect(hm.canUndo()).toBe(true)

    canvas.loadFromJSON.mockRejectedValueOnce(new Error('simulated failure'))
    hm.undo(canvas as any)

    await vi.waitFor(() => {
      // 兜底：应至少调用了 renderAll
      expect(canvas.renderAll).toHaveBeenCalled()
    })
  })

  // ══════════════════════════════════════════════════════
  // 生命周期
  // ══════════════════════════════════════════════════════
  it('onStateChange 应在状态变更时被调用', () => {
    const fn = vi.fn()
    hm.onStateChange(fn)
    hm.save(canvas as any)
    expect(fn).toHaveBeenCalled()
  })

  it('reset 应清空所有栈', () => {
    hm.save(canvas as any)
    hm.save(canvas as any)
    hm.reset()
    expect(hm.canUndo()).toBe(false)
    expect(hm.canRedo()).toBe(false)
  })

  it('canvas 为 null 时不应崩溃', () => {
    expect(() => hm.save(null as any)).not.toThrow()
    hm.save(canvas as any)
    hm.save(canvas as any)
    expect(() => hm.undo(null as any)).not.toThrow()
  })
})
