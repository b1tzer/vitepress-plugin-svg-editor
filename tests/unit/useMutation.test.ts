/**
 * useMutation 单元测试 — 覆盖 withSave 事务编排（issue #19 P0）
 *
 * 聚焦验证：执行变更 fn → 保存历史快照 → 刷新图层列表 的顺序与短路逻辑。
 */

import { describe, it, expect, vi } from 'vitest'
import { useMutation } from '../../src/composables/useMutation'

describe('useMutation', () => {
  it('withSave 应执行 fn、保存历史快照、刷新图层列表', () => {
    const canvas = {}
    const canvasMgr = { canvas } as any
    const historyMgr = { save: vi.fn() } as any
    const refreshLayerList = vi.fn()

    const { withSave } = useMutation({ canvasMgr, historyMgr, refreshLayerList })
    const fn = vi.fn()
    withSave(fn)

    expect(fn).toHaveBeenCalledWith(canvas)
    expect(historyMgr.save).toHaveBeenCalledWith(canvas, expect.any(Function), expect.any(Function))
    expect(refreshLayerList).toHaveBeenCalled()
  })

  it('canvas 为 null 时应短路：不执行 fn、不保存、不刷新', () => {
    const canvasMgr = { canvas: null } as any
    const historyMgr = { save: vi.fn() } as any
    const refreshLayerList = vi.fn()

    const { withSave } = useMutation({ canvasMgr, historyMgr, refreshLayerList })
    const fn = vi.fn()

    expect(() => withSave(fn)).not.toThrow()
    expect(fn).not.toHaveBeenCalled()
    expect(historyMgr.save).not.toHaveBeenCalled()
    expect(refreshLayerList).not.toHaveBeenCalled()
  })
})
