/**
 * 历史操作 composable — undo / redo / 删除对象（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「历史与删除」职责，注入 withSave（来自 useMutation），
 * 与样式/文本/结构操作解耦，保持依赖单向流动。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'
import { FABRIC_TYPE } from '../core/shared/FabricTypes'

export interface UseHistoryOpsDeps {
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  /** 获取当前 SVG 逻辑尺寸（undo/redo 重建 workspace 用） */
  getSvgSize: () => { w: number; h: number }
  /** 图层列表刷新 */
  refreshLayerList: () => void
  /** 变更事务（来自 useMutation） */
  withSave: (fn: (fc: Canvas) => void) => void
}

export function useHistoryOps(deps: UseHistoryOpsDeps) {
  const { canvasMgr, historyMgr, getSvgSize, refreshLayerList, withSave } = deps

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
    if (a.type === FABRIC_TYPE.ACTIVE_SELECTION) {
      ;(a as any).forEachObject((o: any) => fc!.remove(o))
      fc!.discardActiveObject()
    } else {
      fc!.remove(a)
    }
    fc!.renderAll()
    withSave(() => {})
  }

  return { undo, redo, deleteObj }
}
