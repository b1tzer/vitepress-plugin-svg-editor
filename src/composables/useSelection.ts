/**
 * 选择状态 composable — 选中对象的属性状态同步（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取 20+ 个选中属性 ref 与 updateSelectionInfo，
 * 集中管理「选中对象 → 属性面板」的状态同步，独立为可复用 composable。
 */

import { ref, type Ref } from 'vue'
import type { ActiveSelection, Shadow } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import { FABRIC_TYPE, TEXT_TYPES } from '../core/shared/FabricTypes'
import * as TextFormatPlugin from '../plugins/text-format'

/** 渐变填充对象的运行时结构（fill 为 Gradient 实例时） */
interface FillGradient {
  type: 'linear' | 'radial'
  coords: { x1: number; y1: number; x2: number; y2: number }
  colorStops?: { color: string }[]
}

export function useSelection(canvasMgr: CanvasManager) {
  const selectionInfo = ref('')
  const currentFill = ref('')
  const currentStroke = ref('')
  const currentFontSize = ref(12)
  const currentFontWeight = ref('normal')
  const currentFontStyle = ref('normal')
  const currentUnderline = ref(false)
  const currentTextAlign = ref('left')
  const currentTextFill = ref('')
  const currentStrokeWidth = ref(1)
  const currentStrokeDash = ref(false)
  const currentRotation = ref(0)
  const currentOpacity = ref(100)
  const gradientType = ref<'none' | 'linear' | 'radial'>('none')
  const gradientAngle = ref(0)
  const gradientColor1 = ref('#1565C0')
  const gradientColor2 = ref('#E3F2FD')
  const shadowEnabled = ref(false)
  const shadowColor = ref('#000000')
  const shadowBlur = ref(5)
  const shadowOffsetX = ref(3)
  const shadowOffsetY = ref(3)
  const hasTextInSelection = ref(false)

  function updateSelectionInfo(): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const active = fc.getActiveObject()
    if (!active) {
      selectionInfo.value = ''
      return
    }
    const isMulti = active.type === FABRIC_TYPE.ACTIVE_SELECTION
    selectionInfo.value = isMulti ? `${(active as ActiveSelection)._objects.length} 个选中` : active.type

    // 判断选中集合中是否包含文本对象（支持多选时显示文字对齐按钮）
    if (isMulti) {
      hasTextInSelection.value = (active as ActiveSelection)._objects.some((o) =>
        (TEXT_TYPES as readonly string[]).includes(o.type)
      )
    } else {
      hasTextInSelection.value = (TEXT_TYPES as readonly string[]).includes(active.type)
    }

    if (active.fill && typeof active.fill === 'string') currentFill.value = active.fill
    if (active.stroke && typeof active.stroke === 'string') currentStroke.value = active.stroke
    if (active.strokeWidth != null) currentStrokeWidth.value = active.strokeWidth
    currentStrokeDash.value = !!active.strokeDashArray
    currentRotation.value = Math.round(active.angle || 0)
    currentOpacity.value = Math.round((active.opacity != null ? active.opacity : 1) * 100)

    const f = active.fill as unknown as FillGradient | null
    if (f && f.type) {
      gradientType.value = f.type
      gradientAngle.value =
        f.type === 'linear'
          ? Math.round(
              (Math.atan2(f.coords.y2 - f.coords.y1, f.coords.x2 - f.coords.x1) * 180) / Math.PI
            )
          : 0
      const stops = f.colorStops || []
      if (stops[0]) gradientColor1.value = stops[0].color
      if (stops[1]) gradientColor2.value = stops[1].color
    } else {
      gradientType.value = 'none'
    }

    const s = active.shadow
    if (s) {
      shadowEnabled.value = true
      shadowColor.value = s.color || '#000'
      shadowBlur.value = s.blur || 5
      shadowOffsetX.value = s.offsetX || 3
      shadowOffsetY.value = s.offsetY || 3
    } else {
      shadowEnabled.value = false
    }

    const textObj = TextFormatPlugin.getTextObjects(fc)[0]
    if (textObj) {
      if (textObj.fontSize) currentFontSize.value = textObj.fontSize
      if (textObj.fontWeight) currentFontWeight.value = String(textObj.fontWeight)
      if (textObj.fontStyle) currentFontStyle.value = textObj.fontStyle
      if (textObj.underline !== undefined) currentUnderline.value = textObj.underline
      if (textObj.textAlign) currentTextAlign.value = textObj.textAlign
      if (textObj.fill && typeof textObj.fill === 'string') currentTextFill.value = textObj.fill
    }
  }

  return {
    selectionInfo,
    currentFill,
    currentStroke,
    currentFontSize,
    currentFontWeight,
    currentFontStyle,
    currentUnderline,
    currentTextAlign,
    currentTextFill,
    currentStrokeWidth,
    currentStrokeDash,
    currentRotation,
    currentOpacity,
    gradientType,
    gradientAngle,
    gradientColor1,
    gradientColor2,
    shadowEnabled,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    hasTextInSelection,
    updateSelectionInfo,
  }
}
