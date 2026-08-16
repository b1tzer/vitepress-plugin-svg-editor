/**
 * 阴影效果插件 — 开/关 + 参数调整
 */
import * as fabric from 'fabric'
import type { Canvas } from 'fabric'

interface ShadowOptions {
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

export function toggleShadow(canvas: Canvas): boolean {
  const a = canvas.getActiveObject()
  if (!a) return false
  if (a.shadow) {
    a.set('shadow', null)
    canvas.renderAll()
    return false
  }
  a.set(
    'shadow',
    new fabric.Shadow({
      color: '#000000',
      blur: 5,
      offsetX: 3,
      offsetY: 3,
    })
  )
  canvas.renderAll()
  return true
}

export function applyShadow(
  canvas: Canvas,
  { color, blur, offsetX, offsetY }: ShadowOptions
): void {
  const a = canvas.getActiveObject()
  if (!a || !a.shadow) return
  a.set('shadow', new fabric.Shadow({ color, blur, offsetX, offsetY }))
  canvas.renderAll()
}
