/**
 * 文本操作 composable — 字号/粗体/斜体/下划线/对齐/文字颜色（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「文本格式」职责，注入 withSave 与 selection 状态。
 */

import type { Canvas } from 'fabric'
import * as TextFormatPlugin from '../plugins/text-format'
import type { useSelection } from './useSelection'

type SelectionState = ReturnType<typeof useSelection>

export interface UseTextOpsDeps {
  /** 选中对象属性状态（来自 useSelection） */
  selection: SelectionState
  /** 变更事务（来自 useMutation） */
  withSave: (fn: (fc: Canvas) => void) => void
}

export function useTextOps(deps: UseTextOpsDeps) {
  const { selection, withSave } = deps

  function applyFontSize(size: number) {
    withSave((fc) => TextFormatPlugin.applyFontSize(fc, size))
    selection.currentFontSize.value = size
  }

  function toggleBold() {
    withSave((fc) => {
      selection.currentFontWeight.value = TextFormatPlugin.toggleBold(fc) || 'normal'
    })
  }

  function toggleItalic() {
    withSave((fc) => {
      selection.currentFontStyle.value = TextFormatPlugin.toggleItalic(fc) || 'normal'
    })
  }

  function toggleUnderline() {
    withSave((fc) => {
      selection.currentUnderline.value = TextFormatPlugin.toggleUnderline(fc) ?? false
    })
  }

  function applyTextAlign(align: string) {
    withSave((fc) => {
      selection.currentTextAlign.value = TextFormatPlugin.applyTextAlign(fc, align)
    })
  }

  function applyTextFill(hex: string) {
    withSave((fc) => {
      TextFormatPlugin.applyTextFill(fc, hex)
      selection.currentTextFill.value = hex
    })
  }

  return { applyFontSize, toggleBold, toggleItalic, toggleUnderline, applyTextAlign, applyTextFill }
}
