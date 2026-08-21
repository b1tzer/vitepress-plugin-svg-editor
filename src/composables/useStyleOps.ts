/**
 * 样式操作 composable — 填充/描边/透明度/旋转/渐变/阴影（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「样式」职责，注入 commit 与 selection 状态。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import { applyGradient } from '../plugins/gradient'
import { toggleShadow, applyShadow } from '../plugins/shadow'
import { setFillHex, setStrokeHex } from '../core/shared/colorIdentity'
import type { SelectionState } from './useSelection'

export interface UseStyleOpsDeps {
  canvasMgr: CanvasManager
  /** 选中对象属性状态（来自 useSelection 的 reactive state） */
  selection: SelectionState
  /** 变更事务（来自 useMutation） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useStyleOps(deps: UseStyleOpsDeps) {
  const { canvasMgr, selection, commit } = deps

  function applyFill(hex: string) {
    commit((fc) => {
      const a = fc.getActiveObject()
      if (a) setFillHex(a, hex)
    })
  }

  function applyStroke(hex: string) {
    commit((fc) => {
      const a = fc.getActiveObject()
      if (a) setStrokeHex(a, hex)
    })
  }

  function applyStrokeWidth(w: number) {
    commit((fc) => {
      const a = fc.getActiveObject()
      if (a) a.set('strokeWidth', w)
      selection.currentStrokeWidth = w
    })
  }

  function toggleStrokeDash() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!a) return
    const next = !selection.currentStrokeDash
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (active) {
        active.set('strokeDashArray', next ? [6, 3] : null)
        selection.currentStrokeDash = next
      }
      canvas.renderAll()
    })
  }

  function applyOpacity(value: number) {
    const a = canvasMgr.canvas?.getActiveObject()
    if (!a) return
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (active) {
        active.set('opacity', value / 100)
        selection.currentOpacity = value
      }
      canvas.renderAll()
    })
  }

  function applyRotation(angle: number) {
    const a = canvasMgr.canvas?.getActiveObject()
    if (!a) return
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (active) {
        active.rotate(angle)
        selection.currentRotation = angle
      }
      canvas.renderAll()
    })
  }

  function applyGradientUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    commit((canvas) => {
      applyGradient(canvas, {
        type: selection.gradientType as 'none' | 'linear' | 'radial',
        angle: selection.gradientAngle,
        color1: selection.gradientColor1,
        color2: selection.gradientColor2,
      })
    })
  }

  function toggleShadowUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    commit((canvas) => {
      selection.shadowEnabled = toggleShadow(canvas)
    })
  }

  function applyShadowUI() {
    const fc = canvasMgr.canvas
    if (!fc) return
    commit((canvas) => {
      applyShadow(canvas, {
        color: selection.shadowColor,
        blur: selection.shadowBlur,
        offsetX: selection.shadowOffsetX,
        offsetY: selection.shadowOffsetY,
      })
    })
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
