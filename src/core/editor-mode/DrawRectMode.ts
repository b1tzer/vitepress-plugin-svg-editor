/**
 * 矩形绘制模式 — 鼠标拖拽绘制矩形
 *
 * 职责：
 *   - 鼠标按下时记录起始点
 *   - 拖拽时实时绘制预览矩形
 *   - 松手时创建最终矩形并切换到选择模式
 */

import type { Canvas } from 'fabric'
import * as fabric from 'fabric'
import type { IEditorMode } from './EditorMode'

export class DrawRectMode implements IEditorMode {
  readonly name = 'draw-rect'

  private _isDrawing = false
  private _startX = 0
  private _startY = 0
  private _preview: fabric.Rect | null = null
  /**
   * 绘制完成后回调：传递新创建的矩形对象，外部决定是否添加到画布和记录命令
   */
  private _onComplete: ((rect: fabric.Rect) => void) | null = null

  constructor(onComplete?: (rect: fabric.Rect) => void) {
    this._onComplete = onComplete || null
  }

  onEnter(canvas: Canvas): void {
    canvas.selection = false
    canvas.setCursor('crosshair')
    this._isDrawing = false
  }

  onExit(canvas: Canvas): void {
    canvas.selection = true
    canvas.setCursor('default')
    this._clearPreview(canvas)
    this._isDrawing = false
  }

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    this._isDrawing = true
    const pointer = canvas.getPointer(e)
    this._startX = pointer.x
    this._startY = pointer.y

    // 创建起始点预览矩形（1px 大小，带虚线边框）
    this._preview = new fabric.Rect({
      left: this._startX,
      top: this._startY,
      width: 1,
      height: 1,
      fill: 'rgba(0, 120, 212, 0.1)',
      stroke: '#0078d4',
      strokeWidth: 1.5,
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
    })
    canvas.add(this._preview as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
    canvas.requestRenderAll()
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    if (!this._isDrawing || !this._preview) return
    const pointer = canvas.getPointer(e)
    const left = Math.min(this._startX, pointer.x)
    const top = Math.min(this._startY, pointer.y)
    const width = Math.abs(pointer.x - this._startX)
    const height = Math.abs(pointer.y - this._startY)

    this._preview.set({ left, top, width, height })
    canvas.requestRenderAll()
  }

  onMouseUp(_e: MouseEvent, canvas: Canvas): void {
    if (!this._isDrawing) return
    this._isDrawing = false

    if (this._preview && this._preview.width! > 5 && this._preview.height! > 5) {
      // 创建最终矩形（去掉虚线预览样式）
      const finalRect = new fabric.Rect({
        left: this._preview.left,
        top: this._preview.top,
        width: this._preview.width,
        height: this._preview.height,
        fill: '#0078d4',
        stroke: '#000000',
        strokeWidth: 1,
        selectable: true,
        evented: true,
      })
      canvas.remove(this._preview as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
      this._preview = null
      canvas.add(finalRect as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
      canvas.requestRenderAll()

      if (this._onComplete) {
        this._onComplete(finalRect)
      }
    } else {
      this._clearPreview(canvas)
    }

    // 绘制完成自动切回选择模式（由 ModeManager 管理）
  }

  private _clearPreview(canvas: Canvas): void {
    if (this._preview && canvas) {
      canvas.remove(this._preview as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
      this._preview = null
      canvas.requestRenderAll()
    }
  }
}
