// @ts-nocheck — fabric@5.5.2 无官方类型声明
/**
 * 阴影效果插件 — 开/关 + 参数调整
 */

import * as fabric from 'fabric'

export function toggleShadow(canvas: any) {
  const a = canvas.getActiveObject()
  if (!a) return false
  if (a.shadow) {
    a.set('shadow', null)
    canvas.renderAll()
    return false
  }
  a.set('shadow', new fabric.Shadow({
    color: '#000000', blur: 5, offsetX: 3, offsetY: 3,
  }))
  canvas.renderAll()
  return true
}

export function applyShadow(canvas: any, { color, blur, offsetX, offsetY }: any) {
  const a = canvas.getActiveObject()
  if (!a || !a.shadow) return
  a.set('shadow', new fabric.Shadow({ color, blur, offsetX, offsetY }))
  canvas.renderAll()
}
