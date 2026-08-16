/**
 * 变更事务 composable — 统一「执行变更 → 保存历史快照 → 刷新图层列表」的编排
 *
 * 背景：`withSave` 此前锁死在 useToolbar 内部，导致 useClipboard 与
 * SvgEditor.vue 的 addElement 被迫反向依赖 useToolbar（issue #19 P0）。
 *
 * 方案：将 `withSave` 抽为独立可注入单元，供 useToolbar / useClipboard /
 * addElement 各自注入，消除隐式耦合，保持依赖单向流动。
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
  /** 执行画布变更，并保存历史快照、刷新图层列表 */
  withSave: (fn: (fc: Canvas) => void) => void
} {
  const { canvasMgr, historyMgr, refreshLayerList } = deps

  function withSave(fn: (fc: Canvas) => void): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    fn(fc)
    historyMgr.save(
      fc,
      () => {},
      () => {}
    )
    refreshLayerList()
  }

  return { withSave }
}
