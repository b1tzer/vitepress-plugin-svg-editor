/**
 * 变更事务 composable — 统一「执行变更 → 保存历史快照 → 刷新图层列表」的编排
 *
 * 背景：`commit` 此前以 `withSave` 之名锁死在 useToolbar 内部，导致 useClipboard
 * 与 SvgEditor.vue 的 addElement 被迫反向依赖 useToolbar（issue #19 P0）。
 *
 * 方案：将变更事务抽为独立可注入单元，供 useToolbar / useClipboard / addElement
 * 各自注入，消除隐式耦合，保持依赖单向流动。
 *
 * 命名：`commit`（提交一次变更事务）而非 `withSave`，避免与「保存文件到磁盘」
 * 的 save 混淆。约定：所有画布变更逻辑一律放进传入的 fn 内执行，确保
 * 「变更 + 快照 + 图层刷新」三者原子提交，杜绝「变更在事务外」的不一致模式。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'

export interface UseMutationDeps {
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  /** 图层列表刷新（由 useLayer 提供） */
  refreshLayerList: () => void
}

export function useMutation(deps: UseMutationDeps): {
  /** 提交一次变更事务：执行变更 fn → 保存历史快照 → 刷新图层列表 */
  commit: (fn: (fc: Canvas) => void) => void
} {
  const { canvasMgr, historyMgr, refreshLayerList } = deps

  function commit(fn: (fc: Canvas) => void): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    fn(fc)
    historyMgr.save(fc)
    refreshLayerList()
  }

  return { commit }
}
