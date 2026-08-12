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

  constructor(eventBus?: EventBus) {
    this._eventBus = eventBus || new EventBus()
    this._zoomPan = new ZoomPanController(this._eventBus)
    this._interaction = new InteractionManager(this._eventBus)
  }

  /** 初始化：canvas 尺寸 = viewport 容器，同步创建 workspace Rect + clipPath */
  init(canvasEl: HTMLCanvasElement, logicalW: number, logicalH: number): Canvas {
    const parent = canvasEl.parentElement
    const vpW = parent?.clientWidth || 800
    const vpH = parent?.clientHeight || 600

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
    return fc
  }

  getWorkspaceRect(): fabric.Rect | null { return this._workspaceRect }

  updateWorkspaceSize(w: number, h: number): void {
    const fc = this.canvas
    const ws = this._workspaceRect
    if (!fc || !ws) return
    ws.set({ width: w, height: h, left: (fc.getWidth() - w) / 2, top: (fc.getHeight() - h) / 2 })
    fc.clipPath = new fabric.Rect({
      left: ws.left, top: ws.top, width: w, height: h,
      absolutePositioned: true, selectable: false, evented: false, excludeFromExport: true,
    })
    fc.requestRenderAll()
    this._zoomPan.setLogicalSize(w, h)
  }

  private _createWorkspace(fc: Canvas, w: number, h: number): void {
    const ws = new fabric.Rect({
      id: 'workspace',
      left: (fc.getWidth() - w) / 2, top: (fc.getHeight() - h) / 2,
      width: w, height: h,
      fill: '#ffffff', stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1,
      selectable: false, evented: false, excludeFromExport: true,
    })
    fc.add(ws)
    fc.sendObjectToBack(ws)
    this._workspaceRect = ws
    fc.clipPath = new fabric.Rect({
      left: ws.left, top: ws.top, width: w, height: h,
      absolutePositioned: true, selectable: false, evented: false, excludeFromExport: true,
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
      objectCaching: false,
    } as any)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupCanvasEvents(fc: any): void {
    fc.on('mouse:wheel', (opt: any) => {
      opt.e.preventDefault(); opt.e.stopPropagation()
      this._zoomPan.handleWheel(opt.e.deltaY)
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
}
