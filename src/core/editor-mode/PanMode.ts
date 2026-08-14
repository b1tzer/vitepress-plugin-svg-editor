/**
 * 平移模式 — 空格 + 鼠标拖拽进行画布平移
 *
 * 职责：
 *   - 进入时禁用选择、光标变为 grab
 *   - 记录鼠标起始点
 *   - 鼠标拖拽时调用 relativePan 平移画布
 *   - 退出时恢复 selection 和光标
 */

import type { Canvas } from 'fabric'
import type { IEditorMode } from './EditorMode'

export class PanMode implements IEditorMode {
  readonly name = 'pan'

  private _isPanning = false
  private _lastPoint = { x: 0, y: 0 }

  onEnter(canvas: Canvas): void {
    canvas.selection = false
    canvas.setCursor('grab')
    this._isPanning = false
  }

  onExit(canvas: Canvas): void {
    canvas.selection = true
    canvas.setCursor('default')
    this._isPanning = false
  }

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    this._isPanning = true
    this._lastPoint = { x: e.clientX, y: e.clientY }
    canvas.setCursor('grabbing')
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    if (!this._isPanning) return
    const dx = e.clientX - this._lastPoint.x
    const dy = e.clientY - this._lastPoint.y
    canvas.relativePan({ x: dx, y: dy } as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
    this._lastPoint = { x: e.clientX, y: e.clientY }
  }

  onMouseUp(_e: MouseEvent, canvas: Canvas): void {
    if (!this._isPanning) return
    this._isPanning = false
    canvas.setCursor('grab')
  }

  isPanning(): boolean {
    return this._isPanning
  }
}
