/**
 * 编辑器 store — 聚合「选中状态 + 编辑操作」，经 provide/inject 提供给子组件
 *
 * 背景（issue #19 架构评审 P2-5）：SvgEditor.vue 曾将 useSelection 的 20+ 状态
 * 与 useToolbar 的 20+ 操作以 props/events 形式透传给 EditorContextPanel，
 * 导致模板大量样板转发。本 store 将它们收敛为单一对象，由 SvgEditor provide、
 * 属性面板 inject 直接消费，消除 prop drilling。
 *
 * 仅承载「属性面板消费的编辑状态与操作」；theme / layer / size / save / clipboard /
 * keyboard 仍由 SvgEditor 按需管理，避免 store 膨胀为 god store。
 */

import type { InjectionKey } from 'vue'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'
import { useSelection } from './useSelection'
import { useToolbar } from './useToolbar'
import { useMutation } from './useMutation'

export interface EditorStoreDeps {
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  /** 图层列表刷新（由 useLayer 提供） */
  refreshLayerList: () => void
  /** 获取当前 SVG 逻辑尺寸（undo/redo 重建 workspace 用） */
  getSvgSize: () => { w: number; h: number }
}

export type EditorStore = ReturnType<typeof useEditorStore>

/** store 注入键（provide/inject 用） */
export const EditorStoreKey: InjectionKey<EditorStore> = Symbol('svg-editor-store')

export function useEditorStore(deps: EditorStoreDeps) {
  const { canvasMgr, historyMgr, refreshLayerList, getSvgSize } = deps

  const selection = useSelection(canvasMgr)
  const { commit } = useMutation({ canvasMgr, historyMgr, refreshLayerList })
  const toolbar = useToolbar({
    canvasMgr,
    historyMgr,
    refreshLayerList,
    getSvgSize,
    selection: selection.state,
    updateSelectionInfo: selection.updateSelectionInfo,
    commit,
  })

  return {
    /** 选中对象属性状态（reactive） */
    selection: selection.state,
    /** 同步选中对象属性到 selection */
    updateSelectionInfo: selection.updateSelectionInfo,
    /** 变更事务（addElement / clipboard 等复用） */
    commit,
    ...toolbar,
  }
}
