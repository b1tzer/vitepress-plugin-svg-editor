/**
 * 缩放/平移控制器 — 从 CanvasManager 中提取的缩放/平移职责
 *
 * 职责：
 *   - 缩放控制（zoomIn / zoomOut / zoomFit）
 *   - 画布平移（空格 + 拖拽）
 *   - 画布逻辑尺寸管理（setLogicalSize / _syncCanvasSize）
 *
 * 通过构造函数注入 EventBus 实现 DIP
 */

import type { Canvas } from 'fabric'
import type { IEventBus } from '../types'

export class ZoomPanController {
  /** Canvas 物理像素安全天花板 — 超过此值浏览器 GPU 纹理可能溢出导致 Aw Snap */
  private static readonly CANVAS_MAX = 4096

  private _eventBus: IEventBus
  private _canvas: Canvas | null = null
  private _zoomLevel: number = 100
  private _spacePressed: boolean = false
  private _isPanning: boolean = false
  private _lastPanPoint: { x: number; y: number } = { x: 0, y: 0 }
  /** 画布逻辑尺寸（100% 缩放比下的宽高） */
  private _baseW: number = 800
  private _baseH: number = 600
  /** 最近一次 zoomFit 计算出的居中偏移（用于通过 scroll 定位而非 viewportTransform 平移） */
  private _zoomFitPan: { x: number; y: number } = { x: 0, y: 0 }
  /** rAF 节流：待写入的缩放级别 */
  private _pendingZoom: number | null = null
  /** rAF 节流：当前排期的 requestAnimationFrame id */
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

  /** 解绑画布实例 */
  unbindCanvas(): void {
    this._canvas = null
  }

  /**
   * 设置画布逻辑尺寸（用于缩放计算）
   * 调用时机：SVG 加载完成 / 用户拖拽 resize 手柄后
   */
  setLogicalSize(w: number, h: number): void {
    this._baseW = w
    this._baseH = h
    this._syncCanvasSize()
  }

  getBaseWidth(): number { return this._baseW }
  getBaseHeight(): number { return this._baseH }

  /**
   * 核心：Fabric 画布物理尺寸 = 逻辑尺寸 × 缩放比
   * viewport transform = [z, 0, 0, z, tx, ty]
   * 保留已有的平移量 tx/ty，避免 zoomFit 后的首次缩放跳变
   */
  private _syncCanvasSize(): void {
    const fc = this._canvas
    if (!fc) return
    const z = this._zoomLevel / 100
    // P0: Canvas 物理尺寸天花板，超出 → GPU 纹理溢出 / Aw Snap
    const nw = Math.min(Math.round(this._baseW * z), ZoomPanController.CANVAS_MAX)
    const nh = Math.min(Math.round(this._baseH * z), ZoomPanController.CANVAS_MAX)
    fc.setWidth(nw)
    fc.setHeight(nh)
    // 保留已有的平移偏移量（如 zoomFit 设置的居中平移）
    const vt = (fc as any).viewportTransform
    const tx = (vt && vt.length >= 6) ? vt[4] : 0
    const ty = (vt && vt.length >= 6) ? vt[5] : 0
    ;(fc as any).viewportTransform = [z, 0, 0, z, tx, ty]
    // P3: 仅刷新当前选中对象的 oCoords，其余对象在下次被选中时 Fabric 自动计算
    const active = fc.getActiveObject()
    if (active) (active as any).setCoords()
    fc.requestRenderAll()
  }

  /** 滚轮缩放处理（rAF 节流 — 同一帧内多次 wheel 只执行一次 syncCanvasSize） */
  handleWheel(deltaY: number): void {
    this._pendingZoom = Math.round(this._zoomLevel * (0.999 ** deltaY))
    this._pendingZoom = Math.min(Math.max(10, this._pendingZoom), 2000)
    if (this._zoomRafId === null) {
      this._zoomRafId = requestAnimationFrame(() => {
        this._zoomLevel = this._pendingZoom!
        this._pendingZoom = null
        this._zoomRafId = null
        this._syncCanvasSize()
        this._eventBus.emit('zoomChange', this._zoomLevel)
      })
    }
  }

  // ── 缩放操作 ──
  zoomIn(): void {
    this._zoomLevel = Math.round(Math.min(this._zoomLevel * 1.2, 2000))
    this._syncCanvasSize()
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  zoomOut(): void {
    this._zoomLevel = Math.round(Math.max(this._zoomLevel / 1.2, 10))
    this._syncCanvasSize()
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  zoomFit(): void {
    const fc = this._canvas
    if (!fc) return
    const objects = fc.getObjects().filter((o: any) => !o.excludeFromExport)
    if (!objects.length) {
      this._zoomLevel = 100
      this._syncCanvasSize()
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
    const z = Math.min((this._baseW - 60) / bw, (this._baseH - 60) / bh, 2)
    this._zoomLevel = Math.round(z * 100)
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const tx = (this._baseW / 2 - cx) * z
    const ty = (this._baseH / 2 - cy) * z
    const nw = Math.min(Math.round(this._baseW * z), ZoomPanController.CANVAS_MAX)
    const nh = Math.min(Math.round(this._baseH * z), ZoomPanController.CANVAS_MAX)
    fc.setWidth(nw)
    fc.setHeight(nh)
    ;(fc as any).viewportTransform = [z, 0, 0, z, 0, 0]
    const active2 = fc.getActiveObject()
    if (active2) (active2 as any).setCoords()
    fc.requestRenderAll()
    this._zoomFitPan = { x: tx, y: ty }
    this._eventBus.emit('zoomChange', this._zoomLevel)
  }

  /** 获取最近一次 zoomFit 的居中偏移量（供外部通过 scroll 定位，避免 viewportTransform 坐标漂移） */
  getZoomFitPan(): { x: number; y: number } { return this._zoomFitPan }

  getZoomLevel(): number { return this._zoomLevel }

  // ── 空格拖拽平移 ──
  setSpacePressed(pressed: boolean): void {
    this._spacePressed = pressed
    if (!pressed && !this._isPanning) this._canvas?.setCursor('default')
  }

  isSpacePressed(): boolean { return this._spacePressed }
  isPanning(): boolean { return this._isPanning }

  /** 处理鼠标按下：判断是否开始平移 */
  handlePanMouseDown(e: MouseEvent, canvas: Canvas): boolean {
    if (!this._spacePressed) return false
    this._isPanning = true
    this._lastPanPoint = { x: e.clientX, y: e.clientY }
    canvas.selection = false
    canvas.setCursor('grabbing')
    return true
  }

  /** 处理鼠标移动：执行平移 */
  handlePanMouseMove(e: MouseEvent, canvas: Canvas): boolean {
    if (!this._isPanning) return false
    const dx = e.clientX - this._lastPanPoint.x
    const dy = e.clientY - this._lastPanPoint.y
    canvas.relativePan({ x: dx, y: dy })
    this._lastPanPoint = { x: e.clientX, y: e.clientY }
    return true
  }

  /** 处理鼠标松开：结束平移 */
  handlePanMouseUp(canvas: Canvas): boolean {
    if (!this._isPanning) return false
    this._isPanning = false
    canvas.selection = true
    canvas.setCursor('default')
    return true
  }
}