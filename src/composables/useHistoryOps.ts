/**
 * 历史操作 composable — undo / redo / 删除对象（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「历史与删除」职责，注入 commit（来自 useMutation），
 * 与样式/文本/结构操作解耦，保持依赖单向流动。
 */

import type { ActiveSelection, Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'
import { FABRIC_TYPE } from '../core/shared/fabricTypes'

export interface UseHistoryOpsDeps {
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  /** 获取当前 SVG 逻辑尺寸（undo/redo 重建 workspace 用） */
  getSvgSize: () => { w: number; h: number }
  /** 图层列表刷新 */
  refreshLayerList: () => void
  /** 变更事务（来自 useMutation） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useHistoryOps(deps: UseHistoryOpsDeps) {
  const { canvasMgr, historyMgr, getSvgSize, refreshLayerList, commit } = deps

  function undo() {
    historyMgr.undo(canvasMgr.canvas!, () => {
      const { w, h } = getSvgSize()
      canvasMgr.rebuildWorkspace(w, h)
      refreshLayerList()
    })
  }

  function redo() {
    historyMgr.redo(canvasMgr.canvas!, () => {
      const { w, h } = getSvgSize()
      canvasMgr.rebuildWorkspace(w, h)
      refreshLayerList()
    })
  }

  function deleteObj() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!a) return
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (!active) return
      if (active.type === FABRIC_TYPE.ACTIVE_SELECTION) {
        ;(active as ActiveSelection).forEachObject((o) => canvas.remove(o))
        canvas.discardActiveObject()
      } else {
        canvas.remove(active)
      }
      canvas.renderAll()
    })
  }

  return { undo, redo, deleteObj }
}
