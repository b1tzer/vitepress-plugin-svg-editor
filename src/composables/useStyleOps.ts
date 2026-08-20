/**
 * 样式操作 composable — 填充/描边/透明度/旋转/渐变/阴影（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「样式」职责，注入 withSave 与 selection 状态。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import { applyGradient } from '../plugins/gradient'
import { toggleShadow, applyShadow } from '../plugins/shadow'
import { setFillHex, setStrokeHex } from '../core/shared/colorIdentity'
import type { useSelection } from './useSelection'

type SelectionState = ReturnType<typeof useSelection>

export interface UseStyleOpsDeps {
  canvasMgr: CanvasManager
  /** 选中对象属性状态（来自 useSelection） */
  selection: SelectionState
  /** 变更事务（来自 useMutation） */
  withSave: (fn: (fc: Canvas) => void) => void
}

export function useStyleOps(deps: UseStyleOpsDeps) {
  const { canvasMgr, selection, withSave } = deps

  function applyFill(hex: string) {
    withSave((fc) => {
      const a = fc.getActiveObject()
      if (a) setFillHex(a, hex)
    })
  }

  function applyStroke(hex: string) {
    withSave((fc) => {
      const a = fc.getActiveObject()
      if (a) setStrokeHex(a, hex)
    })
  }

  function applyStrokeWidth(w: number) {
    withSave((fc) => {
      const a = fc.getActiveObject()
      if (a) a.set('strokeWidth', w)
      selection.currentStrokeWidth.value = w
    })
  }

  function toggleStrokeDash() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!a) return
    const next = !selection.currentStrokeDash.value
    a.set('strokeDashArray', next ? [6, 3] : null)
    selection.currentStrokeDash.value = next
    fc!.renderAll()
    withSave(() => {})
  }

  function applyOpacity(value: number) {
    const a = canvasMgr.canvas?.getActiveObject()
    if (!a) return
    a.set('opacity', value / 100)
    selection.currentOpacity.value = value
    canvasMgr.canvas!.renderAll()
    withSave(() => {})
  }

  function applyRotation(angle: number) {
    const a = canvasMgr.canvas?.getActiveObject()
    if (!a) return
    a.rotate(angle)
    selection.currentRotation.value = angle
    canvasMgr.canvas!.renderAll()
    withSave(() => {})
  }

  function applyGradientUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    applyGradient(fc, {
      type: selection.gradientType.value as 'none' | 'linear' | 'radial',
      angle: selection.gradientAngle.value,
      color1: selection.gradientColor1.value,
      color2: selection.gradientColor2.value,
    })
    withSave(() => {})
  }

  function toggleShadowUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    selection.shadowEnabled.value = toggleShadow(fc)
    withSave(() => {})
  }

  function applyShadowUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    applyShadow(fc, {
      color: selection.shadowColor.value,
      blur: selection.shadowBlur.value,
      offsetX: selection.shadowOffsetX.value,
      offsetY: selection.shadowOffsetY.value,
    })
    withSave(() => {})
  }

  return {
    applyFill,
    applyStroke,
    applyStrokeWidth,
    toggleStrokeDash,
    applyOpacity,
    applyRotation,
    applyGradientUI,
    toggleShadowUI,
    applyShadowUI,
  }
}
