/**
 * 缩放/平移控制器 — 纯 viewportTransform 驱动
 *
 * canvas 物理尺寸固定 = 逻辑尺寸，zoom/pan 全部由 viewportTransform 矩阵完成。
 * 对比旧「物理 resize × viewport 双通道」模型：
 *   - 不再 setWidth/setHeight → 零 GPU 位图重分配，无 Aw Snap 风险
 *   - 无需 CANVAS_MAX 天花板
 *   - zoomFit 居中直接写 viewportTransform，无需 _zoomFitPan → scroll 绕路
 *
 * DIP：通过构造函数注入 IEventBus
 */

import type { Canvas } from 'fabric'
import { Point } from 'fabric'
import type { IEventBus } from '../types'

export class ZoomPanController {
  private _eventBus: IEventBus
  private _canvas: Canvas | null = null
  private _zoomLevel: number = 100
  private _spacePressed: boolean = false
  private _isPanning: boolean = false
  private _lastPanPoint: { x: number; y: number } = { x: 0, y: 0 }
  /** 画布逻辑尺寸（100% 时宽高，同时 = canvas 物理像素尺寸） */
  private _baseW: number = 800
  private _baseH: number = 600
  /** rAF 节流：待写入的缩放级别 */
  private _pendingZoom: number | null = null
  private _zoomRafId: number | null = null

  constructor(eventBus: IEventBus) {
    this._eventBus = eventBus
  }

  /** 绑定画布实例（在 CanvasManager.init 中调用） */
  bindCanvas(canvas: Canvas, containerW: number, containerH: number): void {
    this._canvas = canvas
    this._baseW = containerW
    this._baseH = containerH
  }

  unbindCanvas(): void { this._canvas = null }

  /**
   * 设置画布逻辑尺寸（SVG 加载 / resize 手柄拖拽后调用）
   * canvas 物理像素 = 逻辑尺寸（固定），zoom 仅改 viewportTransform
   */
  setLogicalSize(w: number, h: number): void {
    this._baseW = w
    this._baseH = h
    const fc = this._canvas
    if (!fc) return
    fc.setWidth(w)
    fc.setHeight(h)
    this._applyZoom()
  }

  getBaseWidth(): number { return this._baseW }
  getBaseHeight(): number { return this._baseH }

  /**
   * 应用当前 zoom 到 viewportTransform
   * canvas 物理尺寸不变 — 纯 viewport zoom 模型的核心
   */
  private _applyZoom(): void {
    const fc = this._canvas
    if (!fc) return
    const z = this._zoomLevel / 100
    // 保留已有平移分量，防止 zoom 时画面跳变
    const vt = (fc as any).viewportTransform
    const tx = (vt && vt.length >= 6) ? vt[4] : 0
    const ty = (vt && vt.length >= 6) ? vt[5] : 0
    ;(fc as any).viewportTransform = [z, 0, 0, z, tx, ty]
    // 仅刷新选中对象的 oCoords，其余惰性计算
    const active = fc.getActiveObject()
    if (active) (active as any).setCoords()
    fc.requestRenderAll()
  }

  /** 滚轮缩放（rAF 节流 — 同一帧内多次 wheel 只执行一次 _applyZoom） */
  handleWheel(deltaY: number): void {
    this._pendingZoom = Math.round(this._zoomLevel * (0.999 ** deltaY))
    this._pendingZoom = Math.min(Math.max(10, this._pendingZoom), 2000)
    if (this._zoomRafId === null) {
      this._zoomRafId = requestAnimationFrame(() => {
        this._zoomLevel = this._pendingZoom!
        this._pendingZoom = null
        this._zoomRafId = null
        this._applyZoom()
        this._eventBus.emit('zoomChange', this._zoomLevel)
      })
    }
  }

  zoomIn(): void {
    this._zoomLevel = Math.round(Math.min(this._zoomLevel * 1.2, 2000))
    this._applyZoom()
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  zoomOut(): void {
    this._zoomLevel = Math.round(Math.max(this._zoomLevel / 1.2, 10))
    this._applyZoom()
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  /**
   * 自适应缩放：计算 zoom 使所有对象落入视口并居中
   * @param viewportW viewport 可用宽度（不含标尺）；不传则用画布逻辑宽度
   * @param viewportH viewport 可用高度（不含标尺）；不传则用画布逻辑高度
   */
  zoomFit(viewportW?: number, viewportH?: number): void {
    const fc = this._canvas
    if (!fc) return
    const objects = fc.getObjects().filter((o: any) => !o.excludeFromExport)
    if (!objects.length) {
      this._zoomLevel = 100
      this._applyZoom()
      this._eventBus.emit('zoomChange', this._zoomLevel)
      return
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    objects.forEach((o: any) => {
      const b = o.getBoundingRect()
      minX = Math.min(minX, b.left); minY = Math.min(minY, b.top)
      maxX = Math.max(maxX, b.left + b.width); maxY = Math.max(maxY, b.top + b.height)
    })
    const bw = maxX - minX, bh = maxY - minY
    if (bw <= 0 || bh <= 0) return
    // 可用视口空间：canvas-scroll 区域 - canvas-area margin 48px × 2
    const targetW = (viewportW && viewportW > 0) ? viewportW - 96 : this._baseW
    const targetH = (viewportH && viewportH > 0) ? viewportH - 96 : this._baseH
    const z = Math.min((targetW - 60) / bw, (targetH - 60) / bh, 2)
    this._zoomLevel = Math.round(z * 100)

    // 居中偏移直接写入 viewportTransform，无需 _zoomFitPan → scroll 绕路
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const tx = (this._baseW / 2 - cx) * z
    const ty = (this._baseH / 2 - cy) * z
    ;(fc as any).viewportTransform = [z, 0, 0, z, tx, ty]
    const active = fc.getActiveObject()
    if (active) (active as any).setCoords()
    fc.requestRenderAll()
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  getZoomLevel(): number { return this._zoomLevel }

  // ── 空格拖拽平移 ──
  setSpacePressed(pressed: boolean): void {
    this._spacePressed = pressed
    if (!pressed && !this._isPanning) this._canvas?.setCursor('default')
  }

  isSpacePressed(): boolean { return this._spacePressed }
  isPanning(): boolean { return this._isPanning }

  handlePanMouseDown(e: MouseEvent, canvas: Canvas): boolean {
    if (!this._spacePressed) return false
    this._isPanning = true
    this._lastPanPoint = { x: e.clientX, y: e.clientY }
    canvas.selection = false
    canvas.setCursor('grabbing')
    return true
  }

  handlePanMouseMove(e: MouseEvent, canvas: Canvas): boolean {
    if (!this._isPanning) return false
    const dx = e.clientX - this._lastPanPoint.x
    const dy = e.clientY - this._lastPanPoint.y
    canvas.relativePan(new Point(dx, dy))
    this._lastPanPoint = { x: e.clientX, y: e.clientY }
    return true
  }

  handlePanMouseUp(canvas: Canvas): boolean {
    if (!this._isPanning) return false
    this._isPanning = false
    canvas.selection = true
    canvas.setCursor('default')
    return true
  }
}