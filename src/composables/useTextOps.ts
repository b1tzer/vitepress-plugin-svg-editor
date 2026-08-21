/**
 * 文本操作 composable — 字号/粗体/斜体/下划线/对齐/文字颜色（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「文本格式」职责，注入 commit 与 selection 状态。
 */

import type { Canvas } from 'fabric'
import * as TextFormatPlugin from '../plugins/text-format'
import type { SelectionState } from './useSelection'

export interface UseTextOpsDeps {
  /** 选中对象属性状态（来自 useSelection 的 reactive state） */
  selection: SelectionState
  /** 变更事务（来自 useMutation） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useTextOps(deps: UseTextOpsDeps) {
  const { selection, commit } = deps

  function applyFontSize(size: number) {
    commit((fc) => {
      TextFormatPlugin.applyFontSize(fc, size)
      selection.currentFontSize = size
    })
  }

  function toggleBold() {
    commit((fc) => {
      selection.currentFontWeight = TextFormatPlugin.toggleBold(fc) || 'normal'
    })
  }

  function toggleItalic() {
    commit((fc) => {
      selection.currentFontStyle = TextFormatPlugin.toggleItalic(fc) || 'normal'
    })
  }

  function toggleUnderline() {
    commit((fc) => {
      selection.currentUnderline = TextFormatPlugin.toggleUnderline(fc) ?? false
    })
  }

  function applyTextAlign(align: string) {
    commit((fc) => {
      selection.currentTextAlign = TextFormatPlugin.applyTextAlign(fc, align)
    })
  }

  function applyTextFill(hex: string) {
    commit((fc) => {
      TextFormatPlugin.applyTextFill(fc, hex)
      selection.currentTextFill = hex
    })
  }

  return { applyFontSize, toggleBold, toggleItalic, toggleUnderline, applyTextAlign, applyTextFill }
}
