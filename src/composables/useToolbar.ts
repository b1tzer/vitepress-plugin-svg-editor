/**
 * 工具栏操作聚合层（Facade）— 组合四个领域子 ops（issue #19 P2）
 *
 * 职责：仅做聚合，把 history / style / text / structure 四个子 composable
 * 的返回结果扁平化导出，保持对 SvgEditor.vue 的调用接口不变。
 *
 * 实际实现已下沉到：
 *   - useHistoryOps   → undo / redo / deleteObj
 *   - useStyleOps     → 填充 / 描边 / 透明度 / 旋转 / 渐变 / 阴影
 *   - useTextOps      → 字号 / 粗体 / 斜体 / 下划线 / 对齐 / 文字颜色
 *   - useStructureOps → 对齐 / 组合 / 图层 / 分布 / 全选
 *
 * 公共事务 commit 由 useMutation 独立提供（本层不再定义），由 SvgEditor 注入。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'
import { useHistoryOps } from './useHistoryOps'
import { useStyleOps } from './useStyleOps'
import { useTextOps } from './useTextOps'
import { useStructureOps } from './useStructureOps'
import type { SelectionState } from './useSelection'

export interface UseToolbarDeps {
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  /** 图层列表刷新 */
  refreshLayerList: () => void
  /** 获取当前 SVG 逻辑尺寸（undo/redo 重建 workspace 用） */
  getSvgSize: () => { w: number; h: number }
  /** 选中对象属性状态（来自 useSelection 的 reactive state） */
  selection: SelectionState
  /** 选中对象属性同步回调（来自 useSelection） */
  updateSelectionInfo: () => void
  /** 变更事务（来自 useMutation） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useToolbar(deps: UseToolbarDeps) {
  const {
    canvasMgr,
    historyMgr,
    refreshLayerList,
    getSvgSize,
    selection,
    updateSelectionInfo,
    commit,
  } = deps

  const history = useHistoryOps({ canvasMgr, historyMgr, getSvgSize, refreshLayerList, commit })
  const style = useStyleOps({ canvasMgr, selection, commit })
  const text = useTextOps({ selection, commit })
  const structure = useStructureOps({ canvasMgr, updateSelectionInfo, commit })

  return {
    ...history,
    ...style,
    ...text,
    ...structure,
  }
}
