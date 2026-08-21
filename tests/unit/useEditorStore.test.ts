/**
 * useEditorStore 单元测试 — 覆盖编辑器 store 聚合（issue #19 P2-5）
 *
 * 聚焦验证：
 *   - store 正确聚合 selection（reactive state）、updateSelectionInfo、commit
 *   - toolbar 四个子 ops 的操作被扁平化导出（供属性面板 inject 直接调用）
 *   - commit 事务：执行变更 fn → 保存历史快照 → 刷新图层列表
 *   - EditorStoreKey 注入键为唯一 Symbol
 */

import { describe, it, expect, vi } from 'vitest'
import { isReactive } from 'vue'
import { useEditorStore, EditorStoreKey } from '../../src/composables/useEditorStore'

function makeDeps() {
  const canvas = {
    getActiveObject: vi.fn().mockReturnValue(null),
    renderAll: vi.fn(),
  }
  return {
    canvasMgr: {
      canvas,
      rebuildWorkspace: vi.fn(),
    } as any,
    historyMgr: {
      save: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
    } as any,
    refreshLayerList: vi.fn(),
    getSvgSize: vi.fn().mockReturnValue({ w: 800, h: 500 }),
  }
}

describe('useEditorStore', () => {
  it('应聚合 selection（reactive）、updateSelectionInfo、commit', () => {
    const store = useEditorStore(makeDeps())

    expect(store.selection).toBeDefined()
    expect(isReactive(store.selection)).toBe(true)
    expect(typeof store.updateSelectionInfo).toBe('function')
    expect(typeof store.commit).toBe('function')
  })

  it('应扁平化导出 toolbar 四个子 ops 的操作', () => {
    const store = useEditorStore(makeDeps())

    // useHistoryOps
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
    expect(typeof store.deleteObj).toBe('function')
    // useStyleOps
    expect(typeof store.applyFill).toBe('function')
    expect(typeof store.applyStroke).toBe('function')
    expect(typeof store.applyGradientUI).toBe('function')
    expect(typeof store.toggleShadowUI).toBe('function')
    // useTextOps
    expect(typeof store.applyFontSize).toBe('function')
    expect(typeof store.toggleBold).toBe('function')
    expect(typeof store.applyTextFill).toBe('function')
    // useStructureOps
    expect(typeof store.align).toBe('function')
    expect(typeof store.groupSelected).toBe('function')
    expect(typeof store.layerToFront).toBe('function')
    expect(typeof store.distribute).toBe('function')
  })

  it('commit 应执行变更 fn、保存历史快照、刷新图层列表', () => {
    const deps = makeDeps()
    const store = useEditorStore(deps)

    const fn = vi.fn()
    store.commit(fn)

    expect(fn).toHaveBeenCalledWith(deps.canvasMgr.canvas)
    expect(deps.historyMgr.save).toHaveBeenCalledWith(deps.canvasMgr.canvas)
    expect(deps.refreshLayerList).toHaveBeenCalled()
  })

  it('EditorStoreKey 应为唯一 Symbol 注入键', () => {
    expect(typeof EditorStoreKey).toBe('symbol')
    expect(EditorStoreKey).not.toBe(Symbol('svg-editor-store'))
  })
})
