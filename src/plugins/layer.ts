/**
 * 层级控制插件 — 上移/下移/置顶/置底
 */
import type { Canvas } from 'fabric'

export function forward(canvas: Canvas): void {
  const a = canvas.getActiveObject()
  if (a) {
    canvas.bringObjectForward(a)
    canvas.renderAll()
  }
}

export function backward(canvas: Canvas): void {
  const a = canvas.getActiveObject()
  if (a) {
    canvas.sendObjectBackwards(a)
    canvas.renderAll()
  }
}

export function toFront(canvas: Canvas): void {
  const a = canvas.getActiveObject()
  if (a) {
    canvas.bringObjectToFront(a)
    canvas.renderAll()
  }
}

export function toBack(canvas: Canvas): void {
  const a = canvas.getActiveObject()
  if (a) {
    canvas.sendObjectToBack(a)
    canvas.renderAll()
  }
}
