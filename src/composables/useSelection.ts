/**
 * 选择状态 composable — 选中对象的属性状态同步（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取 20+ 个选中属性 ref 与 updateSelectionInfo，
 * 集中管理「选中对象 → 属性面板」的状态同步，独立为可复用 composable。
 *
 * 重构（issue #19 P2）：将 20+ 个独立 ref 收敛为单一 reactive 对象 state，
 * 消除散装 ref 样板；对外仅暴露 { state, updateSelectionInfo }，
 * 供 editor store 聚合后注入属性面板，替代此前的 prop drilling。
 */

import { reactive } from 'vue'
import type { ActiveSelection } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import { FABRIC_TYPE, TEXT_TYPES } from '../core/shared/fabricTypes'
import * as TextFormatPlugin from '../plugins/text-format'

/** 渐变填充对象的运行时结构（fill 为 Gradient 实例时） */
interface FillGradient {
  type: 'linear' | 'radial'
  coords: { x1: number; y1: number; x2: number; y2: number }
  colorStops?: { color: string }[]
}

/** 选中对象的属性状态（单一 reactive 对象，面板与操作直接读写） */
export interface SelectionState {
  selectionInfo: string
  currentFill: string
  currentStroke: string
  currentFontSize: number
  currentFontWeight: string
  currentFontStyle: string
  currentUnderline: boolean
  currentTextAlign: string
  currentTextFill: string
  currentStrokeWidth: number
  currentStrokeDash: boolean
  currentRotation: number
  currentOpacity: number
  gradientType: 'none' | 'linear' | 'radial'
  gradientAngle: number
  gradientColor1: string
  gradientColor2: string
  shadowEnabled: boolean
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  hasTextInSelection: boolean
}

export function useSelection(canvasMgr: CanvasManager): {
  /** 选中对象属性状态（reactive） */
  state: SelectionState
  /** 同步选中对象属性到 state */
  updateSelectionInfo: () => void
} {
  const state = reactive<SelectionState>({
    selectionInfo: '',
    currentFill: '',
    currentStroke: '',
    currentFontSize: 12,
    currentFontWeight: 'normal',
    currentFontStyle: 'normal',
    currentUnderline: false,
    currentTextAlign: 'left',
    currentTextFill: '',
    currentStrokeWidth: 1,
    currentStrokeDash: false,
    currentRotation: 0,
    currentOpacity: 100,
    gradientType: 'none',
    gradientAngle: 0,
    gradientColor1: '#1565C0',
    gradientColor2: '#E3F2FD',
    shadowEnabled: false,
    shadowColor: '#000000',
    shadowBlur: 5,
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    hasTextInSelection: false,
  })

  function updateSelectionInfo(): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const active = fc.getActiveObject()
    if (!active) {
      state.selectionInfo = ''
      return
    }
    const isMulti = active.type === FABRIC_TYPE.ACTIVE_SELECTION
    state.selectionInfo = isMulti
      ? `${(active as ActiveSelection)._objects.length} 个选中`
      : active.type

    // 判断选中集合中是否包含文本对象（支持多选时显示文字对齐按钮）
    if (isMulti) {
      state.hasTextInSelection = (active as ActiveSelection)._objects.some((o) =>
        (TEXT_TYPES as readonly string[]).includes(o.type)
      )
    } else {
      state.hasTextInSelection = (TEXT_TYPES as readonly string[]).includes(active.type)
    }

    if (active.fill && typeof active.fill === 'string') state.currentFill = active.fill
    if (active.stroke && typeof active.stroke === 'string') state.currentStroke = active.stroke
    if (active.strokeWidth != null) state.currentStrokeWidth = active.strokeWidth
    state.currentStrokeDash = !!active.strokeDashArray
    state.currentRotation = Math.round(active.angle || 0)
    state.currentOpacity = Math.round((active.opacity != null ? active.opacity : 1) * 100)

    const f = active.fill as unknown as FillGradient | null
    if (f && f.type) {
      state.gradientType = f.type
      state.gradientAngle =
        f.type === 'linear'
          ? Math.round(
              (Math.atan2(f.coords.y2 - f.coords.y1, f.coords.x2 - f.coords.x1) * 180) / Math.PI
            )
          : 0
      const stops = f.colorStops || []
      if (stops[0]) state.gradientColor1 = stops[0].color
      if (stops[1]) state.gradientColor2 = stops[1].color
    } else {
      state.gradientType = 'none'
    }

    const s = active.shadow
    if (s) {
      state.shadowEnabled = true
      state.shadowColor = s.color || '#000'
      state.shadowBlur = s.blur || 5
      state.shadowOffsetX = s.offsetX || 3
      state.shadowOffsetY = s.offsetY || 3
    } else {
      state.shadowEnabled = false
    }

    const textObj = TextFormatPlugin.getTextObjects(fc)[0]
    if (textObj) {
      if (textObj.fontSize) state.currentFontSize = textObj.fontSize
      if (textObj.fontWeight) state.currentFontWeight = String(textObj.fontWeight)
      if (textObj.fontStyle) state.currentFontStyle = textObj.fontStyle
      if (textObj.underline !== undefined) state.currentUnderline = textObj.underline
      if (textObj.textAlign) state.currentTextAlign = textObj.textAlign
      if (textObj.fill && typeof textObj.fill === 'string') state.currentTextFill = textObj.fill
    }
  }

  return { state, updateSelectionInfo }
}
