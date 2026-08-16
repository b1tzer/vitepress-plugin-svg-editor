/**
 * 文字格式插件 — 字号/B/I/U/对齐/颜色
 * 支持单选 Textbox 和多选文字批量操作
 */
import type { Canvas, FabricObject, FabricText } from 'fabric'
import { FABRIC_TYPE, TEXT_TYPES } from '../core/shared/FabricTypes'

export function getTextObjects(canvas: Canvas): FabricText[] {
  const a = canvas.getActiveObject()
  if (!a) return []
  if ((TEXT_TYPES as readonly string[]).includes(a.type)) return [a as unknown as FabricText]
  if (a.type === FABRIC_TYPE.ACTIVE_SELECTION || a.type === FABRIC_TYPE.GROUP) {
    const objects = (a as { _objects?: FabricObject[] })._objects || []
    return objects.filter((o) => (TEXT_TYPES as readonly string[]).includes(o.type)) as FabricText[]
  }
  return []
}
export function applyFontSize(canvas: Canvas, size: number): void {
  const texts = getTextObjects(canvas)
  texts.forEach((t) => t.set('fontSize', size))
  canvas.renderAll()
}

export function toggleBold(canvas: Canvas): string | undefined {
  const texts = getTextObjects(canvas)
  if (!texts.length) return
  const next = texts[0].fontWeight === 'bold' ? 'normal' : 'bold'
  texts.forEach((t) => t.set('fontWeight', next))
  canvas.renderAll()
  return next
}

export function toggleItalic(canvas: Canvas): string | undefined {
  const texts = getTextObjects(canvas)
  if (!texts.length) return
  const next = texts[0].fontStyle === 'italic' ? 'normal' : 'italic'
  texts.forEach((t) => t.set('fontStyle', next))
  canvas.renderAll()
  return next
}

export function toggleUnderline(canvas: Canvas): boolean | undefined {
  const texts = getTextObjects(canvas)
  if (!texts.length) return
  const next = !texts[0].underline
  texts.forEach((t) => t.set('underline', next))
  canvas.renderAll()
  return next
}

export function applyTextAlign(canvas: Canvas, align: string): string {
  const texts = getTextObjects(canvas)
  texts.forEach((t) => t.set('textAlign', align))
  canvas.renderAll()
  return align
}

export function applyTextFill(canvas: Canvas, hex: string): string {
  const texts = getTextObjects(canvas)
  texts.forEach((t) => t.set('fill', hex))
  canvas.renderAll()
  return hex
}
