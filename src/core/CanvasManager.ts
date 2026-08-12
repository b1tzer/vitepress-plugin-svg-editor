/**
 * Canvas 管理器 — 封装 Fabric.js 画布生命周期与缩放/平移/辅助线
 *
 * 职责：
 *   - 初始化/销毁 Fabric.js 画布
 *   - 缩放控制（zoomIn/zoomOut/zoomFit）
 *   - 画布平移（空格+拖拽）
 *   - 对齐辅助线（移动时参考线 + 松手吸附）
 *   - 对象交互配置（控制点、悬停、选择事件）
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import { EventBus } from './EventBus'
import { getObjBounds } from '../plugins/selection'
import type { GuideLine } from './types'

const SNAP_THRESHOLD = 8
const GUIDE_LINE_STYLE = 'rgba(0, 120, 212, 0.5)'
const GUIDE_LINE_DASH = [4, 4]

export class CanvasManager {
  // ── 公共属性 ──
  canvas: Canvas | null = null

  // ── 私有状态 ──
  private _eventBus: EventBus = new EventBus()
  private _zoomLevel: number = 100
  private _guideLines: GuideLine[] = []
  private _spacePressed: boolean = false
  private _isPanning: boolean = false
  private _lastPanPoint: { x: number; y: number } = { x: 0, y: 0 }
  /** 画布逻辑尺寸（100% 缩放比下的宽高） */
  private _baseW: number = 800
  private _baseH: number = 600

  /**
   * 设置画布逻辑尺寸（用于缩放计算）
   * 调用时机：SVG 加载完成 / 用户拖拽 resize 手柄后
   */
  setLogicalSize(w: number, h: number): void {
    this._baseW = w
    this._baseH = h
    this._syncCanvasSize()
  }

  /**
   * 核心：Fabric 画布物理尺寸 = 逻辑尺寸 × 缩放比
   * viewport transform = [z, 0, 0, z, 0, 0] 缩放渲染内容
   * — 物理 resize 让 .canvas-area 随 zoom 变，viewport transform 让内部元素等比例变。
   */
  private _syncCanvasSize(): void {
    const fc = this.canvas
    if (!fc) return
    const z = this._zoomLevel / 100
    const nw = Math.round(this._baseW * z)
    const nh = Math.round(this._baseH * z)
    fc.setWidth(nw)
    fc.setHeight(nh)
    ;(fc as any).viewportTransform = [z, 0, 0, z, 0, 0]
    fc.requestRenderAll()
  }

  /** 暴露逻辑宽度（供 addElement 等使用物理 resize 后的坐标体系） */
  getBaseWidth(): number { return this._baseW }
  getBaseHeight(): number { return this._baseH }

  /**
   * 初始化画布
   */
  init(canvasEl: HTMLCanvasElement, containerW: number, containerH: number): Canvas {
    this._baseW = containerW
    this._baseH = containerH
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = new fabric.Canvas(canvasEl as any, {
      width: containerW,
      height: containerH,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
      perPixelTargetFind: false,
      targetFindTolerance: 8,
      controlsAboveOverlay: true,
    })

    this._setupControls()
    this._setupCanvasEvents(fc)
    this._setupGuideLines(fc)
    this._setupInteractionEvents(fc)

    this.canvas = fc
    // 暴露实例到 window（便于测试和调试）
    ;(window as any).__fabricCanvas = fc
    ;(window as any).__canvasMgr = this
    return fc
  }

  /**
   * 配置控制点样式 — 使用 Fabric 6 的 ownDefaults 静态属性
   */
  _setupControls(): void {
    Object.assign(fabric.Object.ownDefaults, {
      transparentCorners: false,
      cornerSize: 10,
      cornerStrokeColor: '#0078d4',
      cornerColor: '#ffffff',
      cornerStyle: 'circle',
      borderColor: '#0078d4',
      borderScaleFactor: 1.5,
      borderDashArray: [4, 2],
      padding: 8,
      perPixelTargetFind: false,
    } as any)
  }

  /**
   * 缩放/平移事件
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupCanvasEvents(fc: any) {
    // 滚轮缩放（无需 Ctrl）— 调整 _zoomLevel → _syncCanvasSize 会物理 resize + 设置 viewport transform
    fc.on('mouse:wheel', (opt: any) => {
      opt.e.preventDefault()
      opt.e.stopPropagation()
      const delta = opt.e.deltaY
      this._zoomLevel = Math.round(this._zoomLevel * (0.999 ** delta))
      this._zoomLevel = Math.min(Math.max(10, this._zoomLevel), 2000)
      this._syncCanvasSize()
      this._notifyZoom()
    })

    // 空格+拖拽平移
    fc.on('mouse:down', (opt: any) => {
      if (!this._spacePressed) return
      this._isPanning = true
      this._lastPanPoint = { x: opt.e.clientX, y: opt.e.clientY }
      fc.selection = false
      fc.setCursor('grabbing')
    })

    fc.on('mouse:move', (opt: any) => {
      if (!this._isPanning) return
      const dx = opt.e.clientX - this._lastPanPoint.x
      const dy = opt.e.clientY - this._lastPanPoint.y
      fc.relativePan({ x: dx, y: dy })
      this._lastPanPoint = { x: opt.e.clientX, y: opt.e.clientY }
    })

    fc.on('mouse:up', () => {
      if (this._isPanning) {
        this._isPanning = false
        fc.selection = true
        fc.setCursor('default')
      }
    })
  }

  /**
   * 对齐辅助线
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupGuideLines(fc: any) {
    // 移动时：显示参考线
    fc.on('object:moving', (opt: any) => {
      const obj = opt.target
      if (!obj) return
      const lines: GuideLine[] = []
      const objBounds = getObjBounds(obj)
      const objects = fc.getObjects().filter((o: any) => o !== obj && o.visible)

      for (const other of objects) {
        const ob = getObjBounds(other)
        const vChecks = [
          { objX: objBounds.centerX, otherX: ob.centerX },
          { objX: objBounds.left, otherX: ob.left },
          { objX: objBounds.right, otherX: ob.right },
        ]
        for (const check of vChecks) {
          if (Math.abs(check.objX - check.otherX) < SNAP_THRESHOLD) {
            lines.push({ type: 'vertical', x: check.otherX })
          }
        }
        const hChecks = [
          { objY: objBounds.centerY, otherY: ob.centerY },
          { objY: objBounds.top, otherY: ob.top },
          { objY: objBounds.bottom, otherY: ob.bottom },
        ]
        for (const check of hChecks) {
          if (Math.abs(check.objY - check.otherY) < SNAP_THRESHOLD) {
            lines.push({ type: 'horizontal', y: check.otherY })
          }
        }
      }
      this._guideLines = lines
      this._notifyGuideLines()
      fc.requestRenderAll()
    })

    // 松手时：吸附
    fc.on('object:modified', (opt: any) => {
      const obj = opt.target
      if (obj && this._guideLines.length) {
        const z = fc.getZoom()
        const bounds = getObjBounds(obj)
        for (const line of this._guideLines) {
          if (line.type === 'vertical') {
            const diff = line.x - bounds.centerX
            if (Math.abs(diff) < SNAP_THRESHOLD) obj.set('left', obj.left + diff / z)
          } else {
            const diff = line.y - bounds.centerY
            if (Math.abs(diff) < SNAP_THRESHOLD) obj.set('top', obj.top + diff / z)
          }
        }
        obj.setCoords()
      }
      this._guideLines = []
      this._notifyGuideLines()
      fc.requestRenderAll()
      this._eventBus.emit('modified')
    })

    fc.on('selection:cleared', () => { this._guideLines = []; this._notifyGuideLines() })

    // 自定义渲染参考线
    fc.on('after:render', () => {
      if (!this._guideLines.length) return
      const ctx = fc.getContext()
      ctx.save()
      ctx.strokeStyle = GUIDE_LINE_STYLE
      ctx.lineWidth = 1
      ctx.setLineDash(GUIDE_LINE_DASH)
      const vpt = fc.viewportTransform!
      for (const line of this._guideLines) {
        ctx.beginPath()
        if (line.type === 'vertical') {
          const x = line.x * vpt[0] + vpt[4]
          ctx.moveTo(x, 0); ctx.lineTo(x, fc.height)
        } else {
          const y = line.y * vpt[3] + vpt[5]
          ctx.moveTo(0, y); ctx.lineTo(fc.width, y)
        }
        ctx.stroke()
      }
      ctx.restore()
    })
  }

  /**
   * 交互事件（悬停、选择、文字缩放）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupInteractionEvents(fc: any) {
    fc.on('object:added', (e: any) => {
      if (e.target) {
        e.target.set({ selectable: true, evented: true })
        // ⚠️ 关键：对于无填充的对象设置透明填充，使其可点击（Fabric.js 默认不处理 fill=none 的点击）
        if (!e.target.fill || e.target.fill === 'none' || e.target.fill === 'transparent') {
          if (['rect', 'path', 'polygon', 'circle', 'ellipse'].includes(e.target.type)) {
            e.target.set({ fill: 'rgba(0,0,0,0.001)' })
          }
        }
        if (e.target._objects) e.target._objects.forEach((o: any) => {
          o.set({ selectable: true, evented: true })
          if (!o.fill || o.fill === 'none' || o.fill === 'transparent') {
            if (['rect', 'path', 'polygon', 'circle', 'ellipse'].includes(o.type)) {
              o.set({ fill: 'rgba(0,0,0,0.001)' })
            }
          }
        })
      }
    })

    fc.on('mouse:over', (e: any) => {
      if (e.target && e.target.selectable) {
        fc.setCursor('pointer')
        if (!fc.getActiveObject()) {
          e.target._origBorderColor = e.target.borderColor
          e.target.set({ borderColor: '#0078d4' })
          fc.requestRenderAll()
        }
      }
    })

    fc.on('mouse:out', (e: any) => {
      fc.setCursor('default')
      if (e.target && !fc.getActiveObject()) {
        e.target.set({ borderColor: e.target._origBorderColor || '#0078d4' })
        fc.requestRenderAll()
      }
    })

    fc.on('selection:created', () => this._notifySelection())
    fc.on('selection:updated', () => this._notifySelection())
    fc.on('selection:cleared', () => this._notifySelection())

    // Textbox 缩放时保持字号不变（Office 行为）
    fc.on('object:scaling', (e: any) => {
      const obj = e.target
      if (!obj || (obj.type !== 'textbox' && obj.type !== 'i-text')) return
      if (obj.__scalingFontSize == null) obj.__scalingFontSize = obj.fontSize
      obj.set({ fontSize: obj.__scalingFontSize / Math.max(obj.scaleY, 0.1) })
    })

    fc.on('object:modified', (e: any) => {
      const obj = e.target
      if (obj && (obj.type === 'textbox' || obj.type === 'i-text')) {
        if (obj.__scalingFontSize != null) {
          const origFontSize = obj.__scalingFontSize
          const newWidth = Math.max(obj.width * obj.scaleX, 30)
          obj.set({ width: newWidth, scaleX: 1, scaleY: 1, fontSize: origFontSize })
          delete obj.__scalingFontSize
          obj.setCoords()
          fc.requestRenderAll()
        }
      }
    })
  }

  /**
   * 设置空格键状态（由外部 keydown/keyup 控制）
   */
  setSpacePressed(pressed: boolean): void { this._spacePressed = pressed; if (!pressed && !this._isPanning) this.canvas?.setCursor('default') }

  // ── 缩放（物理 resize + viewport transform [z,0,0,z,0,0] 整体缩放）──
  zoomIn(): void {
    this._zoomLevel = Math.round(Math.min(this._zoomLevel * 1.2, 2000))
    this._syncCanvasSize()
    this._notifyZoom()
  }

  zoomOut(): void {
    this._zoomLevel = Math.round(Math.max(this._zoomLevel / 1.2, 10))
    this._syncCanvasSize()
    this._notifyZoom()
  }

  zoomFit(): void {
    const fc = this.canvas
    if (!fc) return
    const objects = fc.getObjects().filter((o: any) => !o.excludeFromExport)
    if (!objects.length) {
      this._zoomLevel = 100
      this._syncCanvasSize()
      this._notifyZoom()
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
    // 居中：内容的逻辑中心 → 物理画布中心
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const tx = (this._baseW / 2 - cx) * z
    const ty = (this._baseH / 2 - cy) * z
    const nw = Math.round(this._baseW * z)
    const nh = Math.round(this._baseH * z)
    fc.setWidth(nw)
    fc.setHeight(nh)
    ;(fc as any).viewportTransform = [z, 0, 0, z, tx, ty]
    fc.requestRenderAll()
    this._notifyZoom()
  }

  getZoomLevel(): number { return this._zoomLevel }

  // ── 回调注册（委托给 EventBus，保持 API 兼容）──
  onZoomChange(fn: (zoomLevel: number) => void): void { this._eventBus.on('zoomChange', fn) }
  onGuideLinesChange(fn: (lines: GuideLine[]) => void): void { this._eventBus.on('guideLinesChange', fn) }
  onSelectionChange(fn: () => void): void { this._eventBus.on('selectionChange', fn) }
  onModified(fn: () => void): void { this._eventBus.on('modified', fn) }

  /** 获取内部 EventBus（供高级使用者直接订阅事件） */
  getEventBus(): EventBus { return this._eventBus }

  // ── 内部通知（通过 EventBus 派发）──
  private _notifyZoom(): void { this._eventBus.emit('zoomChange', this._zoomLevel) }
  private _notifyGuideLines(): void { this._eventBus.emit('guideLinesChange', this._guideLines) }
  private _notifySelection(): void { this._eventBus.emit('selectionChange') }

  // ── 生命周期 ──
  dispose(): void {
    if (this.canvas) {
      this.canvas.dispose()
      this.canvas = null
    }
    this._eventBus.clear()
  }
}
