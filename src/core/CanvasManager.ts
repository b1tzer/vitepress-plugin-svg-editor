/**
 * Canvas 管理器 — 封装 Fabric.js 画布生命周期
 *
 * 方案 C：逻辑画布（workspace Rect）模式
 *   - Fabric canvas 物理尺寸 = viewport 容器尺寸（自适应）
 *   - workspace Rect（id='workspace'）表示逻辑画布，有 fill/stroke（边界线自动跟随 zoom）
 *   - canvas.clipPath = workspace → 溢出内容被裁剪，但控制条仍可见
 *
 * DIP：构造函数支持注入 EventBus
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import { EventBus } from './EventBus'
import { ZoomPanController } from './canvas/ZoomPanController'
import { InteractionManager } from './canvas/InteractionManager'
import type { ModeManager } from './editor-mode/ModeManager'

export class CanvasManager {
  canvas: Canvas | null = null
  private _eventBus: EventBus
  private _zoomPan: ZoomPanController
  private _interaction: InteractionManager
  private _modeManager: ModeManager | null = null
  private _workspaceRect: fabric.Rect | null = null
  private _themeMode: 'light' | 'dark' = 'light'

  constructor(eventBus?: EventBus) {
    this._eventBus = eventBus || new EventBus()
    this._zoomPan = new ZoomPanController(this._eventBus)
    this._interaction = new InteractionManager(this._eventBus)
  }

  /** 初始化：canvas 尺寸 = viewport 容器，同步创建 workspace Rect + clipPath */
  init(canvasEl: HTMLCanvasElement, logicalW: number, logicalH: number, themeMode?: 'light' | 'dark'): Canvas {
    if (themeMode) this._themeMode = themeMode
    const parent = canvasEl.parentElement
    const vpW = parent?.clientWidth || window.innerWidth - 320 || 800
    const vpH = parent?.clientHeight || window.innerHeight - 100 || 600

    const fc = new fabric.Canvas(canvasEl as any, {
      width: vpW, height: vpH,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
      perPixelTargetFind: false,
      targetFindTolerance: 8,
      controlsAboveOverlay: true,
    })

    this._setupControls()
    this._setupCanvasEvents(fc)
    this._zoomPan.bindCanvas(fc)
    this._zoomPan.setLogicalSize(logicalW, logicalH)
    this._interaction.setupEvents(fc)
    this._createWorkspace(fc, logicalW, logicalH)

    this.canvas = fc
    ;(window as any).__fabricCanvas = fc
    ;(window as any).__canvasMgr = this
    ;(window as any).fabric = fabric
    return fc
  }

  getWorkspaceRect(): fabric.Rect | null { return this._workspaceRect }

  updateWorkspaceSize(w: number, h: number): void {
    const fc = this.canvas
    const ws = this._workspaceRect
    if (!fc || !ws) return
    ws.set({ width: w, height: h, left: 0, top: 0 })
    // 复用 clipPath 对象，避免 resize 拖拽时高频创建新对象导致性能浪费
    const cp = fc.clipPath
    if (cp) {
      cp.set({ width: w, height: h })
    } else {
      fc.clipPath = new fabric.Rect({
        left: 0, top: 0, width: w, height: h,
        selectable: false, evented: false, excludeFromExport: true,
      })
    }
    fc.requestRenderAll()
    this._zoomPan.setLogicalSize(w, h)
  }

  /** 更新 workspace Rect 主题色（fill/stroke），适配亮/暗模式切换 */
  updateWorkspaceTheme(light: boolean): void {
    const ws = this._workspaceRect
    if (!ws) return
    this._themeMode = light ? 'light' : 'dark'
    ws.set({
      fill: light ? '#ffffff' : '#1e1e1e',
      stroke: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)',
    })
    this.canvas?.requestRenderAll()
  }

  /**
   * 重建 workspace 背景 Rect 和 clipPath。
   * Fabric 的 canvas.toJSON() 会过滤 excludeFromExport 对象，undo/redo 的
   * loadFromJSON 恢复后会丢失 workspace 与 clipPath，需在恢复后重新创建。
   */
  rebuildWorkspace(w: number, h: number): void {
    const fc = this.canvas
    if (!fc) return
    // 移除残留的旧 workspace（loadFromJSON 后通常已不存在，但保留兜底）
    if (this._workspaceRect) {
      fc.remove(this._workspaceRect)
      this._workspaceRect = null
    }
    this._createWorkspace(fc, w, h)
  }

  private _createWorkspace(fc: Canvas, w: number, h: number): void {
    const isLight = this._themeMode === 'light'
    // workspace Rect 固定位于 (0,0)，与 SVG 逻辑坐标原点一致
    // 视觉居中由 viewportTransform（zoomFit / zoom / pan）负责 — vue-fabric-editor 做法
    const ws = new fabric.Rect({
      id: 'workspace',
      left: 0, top: 0,
      width: w, height: h,
      fill: isLight ? '#ffffff' : '#1e1e1e',
      stroke: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)',
      strokeWidth: 1,
      selectable: false, evented: false, excludeFromExport: true,
    })
    fc.add(ws)
    fc.sendObjectToBack(ws)
    this._workspaceRect = ws
    // canvas.clipPath 同样位于 (0,0)，与 workspace 完全重合
    // Fabric 官方文档：canvas.clipPath 受 zoom/pan 影响，从左上角定位
    fc.clipPath = new fabric.Rect({
      left: 0, top: 0, width: w, height: h,
      selectable: false, evented: false, excludeFromExport: true,
    })
    fc.requestRenderAll()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // 开启对象缓存（Fabric 默认 true）：拖拽/旋转/缩放时用离屏缓存图 drawImage 贴图，
      // 避免每次移动都重新光栅化复杂 Path/SVG 节点，显著消除拖拽抖动。
      // 缩放过程中的短暂模糊会在 mouseup 时由 noScaleCache 机制自动重新生成高清缓存。
      objectCaching: true,
    } as any)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupCanvasEvents(fc: any): void {
    fc.on('mouse:wheel', (opt: any) => {
      opt.e.preventDefault(); opt.e.stopPropagation()
      // 以鼠标指针位置为缩放锚点（对齐浏览器/地图/Figma 的滚轮缩放直觉）
      // 注意：不能用 fc.getPointer（返回逻辑坐标），需手动换算为相对 canvas 左上角的物理坐标
      const el = fc.upperCanvasEl || fc.lowerCanvasEl
      const rect = el.getBoundingClientRect()
      this._zoomPan.handleWheel(opt.e.deltaY, {
        x: opt.e.clientX - rect.left,
        y: opt.e.clientY - rect.top,
      })
    })
    fc.on('mouse:down', (opt: any) => { this._zoomPan.handlePanMouseDown(opt.e, fc) })
    fc.on('mouse:move', (opt: any) => { this._zoomPan.handlePanMouseMove(opt.e, fc) })
    fc.on('mouse:up', () => { this._zoomPan.handlePanMouseUp(fc) })
  }

  // ── 委托 ──
  setLogicalSize(w: number, h: number): void { this.updateWorkspaceSize(w, h) }
  getBaseWidth(): number { return this._zoomPan.getBaseWidth() }
  getBaseHeight(): number { return this._zoomPan.getBaseHeight() }
  zoomIn(): void { this._zoomPan.zoomIn() }
  zoomOut(): void { this._zoomPan.zoomOut() }
  zoomFit(): void { this._zoomPan.zoomFit() }
  getZoomLevel(): number { return this._zoomPan.getZoomLevel() }
  setSpacePressed(pressed: boolean): void { this._zoomPan.setSpacePressed(pressed) }
  onZoomChange(fn: (z: number) => void): void { this._eventBus.on('zoomChange', fn) }
  onViewportChange(fn: () => void): void { this._eventBus.on('viewportChange', fn) }
  onSelectionChange(fn: () => void): void { this._eventBus.on('selectionChange', fn) }
  onModified(fn: () => void): void { this._eventBus.on('modified', fn) }
  getEventBus(): EventBus { return this._eventBus }
  getZoomPanController(): ZoomPanController { return this._zoomPan }
  getInteractionManager(): InteractionManager { return this._interaction }
  setModeManager(mm: ModeManager): void { this._modeManager = mm; if (this.canvas) mm.setCanvas(this.canvas) }

  translateAllObjects(dx: number, dy: number): void {
    if (!this.canvas) return
    this.canvas.getObjects().forEach((obj: any) => {
      if (obj.excludeFromExport) return
      obj.set({ left: (obj.left || 0) + dx, top: (obj.top || 0) + dy })
      obj.setCoords()
    })
    this.canvas.renderAll()
  }

  dispose(): void {
    if (this.canvas) { this.canvas.dispose(); this.canvas = null }
    this._zoomPan.unbindCanvas()
    this._workspaceRect = null
    this._eventBus.clear()
  }

  injectWheel(deltaY: number): void {
    if (!this.canvas) return
    this._zoomPan.handleWheel(deltaY)
  }

  injectMouseEvent(clientX: number, clientY: number, type: 'mousedown' | 'mousemove' | 'mouseup'): void {
    if (!this.canvas) return
    const el = (this.canvas as any).upperCanvasEl || (this.canvas as any).lowerCanvasEl
    if (!el) return
    const ev = new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: true })
    el.dispatchEvent(ev)
  }

  /**
   * 注入中键平移事件（DOM 层驱动）
   * Fabric 对中键（button===1）的 mouse:down 不触发，因此中键平移需由 DOM 层
   * 捕获原生 mousedown/mousemove/mouseup 后，通过此方法转发给 ZoomPanController。
   */
  injectMiddlePan(type: 'mousedown' | 'mousemove' | 'mouseup', clientX: number, clientY: number): void {
    const fc = this.canvas
    if (!fc) return
    const e = { clientX, clientY, button: 1 } as MouseEvent
    if (type === 'mousedown') this._zoomPan.handlePanMouseDown(e, fc)
    else if (type === 'mousemove') this._zoomPan.handlePanMouseMove(e, fc)
    else this._zoomPan.handlePanMouseUp(fc)
  }
}
