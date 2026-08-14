/**
 * 缩放/平移控制器 — 纯 viewportTransform 驱动
 *
 * 配合「逻辑画布 Rect」方案：canvas 物理尺寸 = viewport 容器尺寸（自适应），
 * 逻辑画布由 Fabric Rect（workspace）表示，zoom/pan 全部由 viewportTransform 矩阵完成。
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
  /** 逻辑画布尺寸（workspace Rect 的宽高，100% 时的逻辑 SVG 尺寸） */
  private _baseW: number = 800
  private _baseH: number = 600
  /** rAF 节流 */
  private _pendingZoom: number | null = null
  private _pendingPoint: { x: number; y: number } | null = null
  private _zoomRafId: number | null = null

  constructor(eventBus: IEventBus) {
    this._eventBus = eventBus
  }

  /** 绑定画布实例 */
  bindCanvas(canvas: Canvas): void {
    this._canvas = canvas
  }

  unbindCanvas(): void { this._canvas = null }

  /**
   * 设置逻辑画布尺寸（workspace Rect 目标宽高）
   * 仅存储，不修改 canvas 物理尺寸。workspace Rect 的 resize 由 CanvasManager 负责。
   */
  setLogicalSize(w: number, h: number): void {
    this._baseW = w
    this._baseH = h
  }

  getBaseWidth(): number { return this._baseW }
  getBaseHeight(): number { return this._baseH }

  /**
   * 应用当前 zoom 到 viewportTransform
   * 支持以任意锚点（canvas 物理坐标，相对 canvas 左上角）缩放：
   * 保持缩放前后「锚点对应的逻辑坐标」不变，使锚点下方的内容被"钉"在指针下。
   * - 未传 anchor → 以视口中心为锚点（工具栏 zoomIn/zoomOut 按钮场景）
   * - 传入 anchor → 以鼠标所在位置为锚点（滚轮缩放场景，对齐浏览器/地图/Figma 直觉）
   */
  private _applyZoom(anchor?: { x: number; y: number }): void {
    const fc = this._canvas
    if (!fc) return
    const z = this._zoomLevel / 100
    const vt = (fc as any).viewportTransform
    const oldZ = (vt && vt.length >= 6 && vt[0]) ? vt[0] : 1
    const tx = (vt && vt.length >= 6) ? vt[4] : 0
    const ty = (vt && vt.length >= 6) ? vt[5] : 0
    const ax = anchor ? anchor.x : fc.getWidth() / 2
    const ay = anchor ? anchor.y : fc.getHeight() / 2
    const logicX = (ax - tx) / oldZ
    const logicY = (ay - ty) / oldZ
    const newTx = ax - logicX * z
    const newTy = ay - logicY * z
    ;(fc as any).viewportTransform = [z, 0, 0, z, newTx, newTy]
    const active = fc.getActiveObject()
    if (active) (active as any).setCoords()
    fc.requestRenderAll()
  }

  /** 滚轮缩放（rAF 节流，以鼠标位置为锚点；无锚点时回退为视口中心） */
  handleWheel(deltaY: number, point?: { x: number; y: number }): void {
    this._pendingZoom = Math.round(this._zoomLevel * (0.999 ** deltaY))
    this._pendingZoom = Math.min(Math.max(10, this._pendingZoom), 2000)
    this._pendingPoint = point || null
    if (this._zoomRafId === null) {
      this._zoomRafId = requestAnimationFrame(() => {
        this._zoomLevel = this._pendingZoom!
        this._pendingZoom = null
        const p = this._pendingPoint
        this._pendingPoint = null
        this._zoomRafId = null
        this._applyZoom(p || undefined)
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
   * 自适应缩放：使 workspace Rect 内容居中于 viewport
   */
  zoomFit(): void {
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
    // viewport = canvas 物理尺寸（即 EditorCanvas 容器尺寸）
    const vpW = fc.getWidth() - 120
    const vpH = fc.getHeight() - 120
    const z = Math.min(vpW / bw, vpH / bh, 2)
    this._zoomLevel = Math.round(z * 100)

    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const tx = fc.getWidth() / 2 - cx * z
    const ty = fc.getHeight() / 2 - cy * z
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
    // 两种平移触发方式（行业通识）：
    //   1. 空格键 + 左键拖拽
    //   2. 鼠标中键拖拽（button === 1）
    const isMiddle = e.button === 1
    const isSpaceDrag = this._spacePressed && e.button === 0
    if (!isMiddle && !isSpaceDrag) return false
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
    // 平移期间持续保持「抓取」光标，防止被 Fabric 的 hover/over 逻辑覆盖回 default/move
    canvas.setCursor('grabbing')
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