/**
 * 画布尺寸 composable — SVG 逻辑尺寸与 viewBox 管理（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取画布宽高、originalViewBox 状态及其调整逻辑，
 * 集中管理「resize 手柄 → 画布逻辑尺寸 → viewBox」的同步。
 */

import { ref, type Ref } from 'vue'
import type { CanvasManager } from '../core/canvas/CanvasManager'

export function useCanvasSize(canvasMgr: CanvasManager): {
  svgWidth: Ref<number>
  svgHeight: Ref<number>
  originalViewBox: Ref<string>
  applyCanvasSize: (w: number, h: number) => void
  handleResize: (w: number, h: number) => void
  onResizePreview: (w: number, h: number) => void
  onResizeCommit: (w: number, h: number) => void
  updateViewBox: (w: number, h: number) => void
} {
  const svgWidth = ref(0)
  const svgHeight = ref(0)
  const originalViewBox = ref('')

  /** 同步更新 originalViewBox 的宽高（保留 minX/minY） */
  function updateViewBox(w: number, h: number): void {
    const vb = originalViewBox.value
    const ww = Math.max(1, Math.round(w))
    const hh = Math.max(1, Math.round(h))
    if (!vb) {
      originalViewBox.value = `0 0 ${ww} ${hh}`
      return
    }
    const parts = vb.split(/[\s,]+/).map(Number)
    const minX = parts.length >= 2 && !isNaN(parts[0]) ? parts[0] : 0
    const minY = parts.length >= 2 && !isNaN(parts[1]) ? parts[1] : 0
    originalViewBox.value = `${minX} ${minY} ${ww} ${hh}`
  }

  function applyCanvasSize(w: number, h: number): void {
    svgWidth.value = w
    svgHeight.value = h
    canvasMgr.setLogicalSize(w, h)
  }

  function handleResize(w: number, h: number): void {
    applyCanvasSize(w, h)
    updateViewBox(w, h)
  }

  /** resize handle 拖拽过程中实时预览（只改视觉，不改 viewBox） */
  function onResizePreview(w: number, h: number): void {
    applyCanvasSize(w, h)
  }

  /** resize handle 拖拽结束提交（同步 viewBox） */
  function onResizeCommit(w: number, h: number): void {
    applyCanvasSize(w, h)
    updateViewBox(w, h)
  }

  return { svgWidth, svgHeight, originalViewBox, applyCanvasSize, handleResize, onResizePreview, onResizeCommit, updateViewBox }
}
