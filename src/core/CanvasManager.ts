/**
 * Canvas 管理器 — 封装 Fabric.js 画布生命周期
 *
 * 职责（精简后）：
 *   - 初始化/销毁 Fabric.js 画布
 *   - 配置控制点样式
 *   - 缩放/平移事件 → 委托给 ZoomPanController
 *   - 对齐辅助线 → 委托给 GuideLineManager
 *   - 交互事件 → 委托给 InteractionManager
 *
 * 构造函数支持注入 EventBus（DIP），不传则自动创建（向后兼容）
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import { EventBus } from './EventBus'
import type { GuideLine } from '../types'
import { ZoomPanController } from './canvas/ZoomPanController'
import { GuideLineManager } from './canvas/GuideLineManager'
import { InteractionManager } from './canvas/InteractionManager'
import type { ModeManager } from './editor-mode/ModeManager'

export class CanvasManager {
  // ── 公共属性 ──
  canvas: Canvas | null = null

  // ── 子模块 ──
  private _eventBus: EventBus
  private _zoomPan: ZoomPanController
  private _guideLine: GuideLineManager
  private _interaction: InteractionManager
  private _modeManager: ModeManager | null = null

  constructor(eventBus?: EventBus) {
    this._eventBus = eventBus || new EventBus()
    this._zoomPan = new ZoomPanController(this._eventBus)
    this._guideLine = new GuideLineManager(this._eventBus)
    this._interaction = new InteractionManager(this._eventBus)
  }

  /**
   * 初始化画布
   */
  init(canvasEl: HTMLCanvasElement, containerW: number, containerH: number): Canvas {
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

    // 子模块绑定
    this._zoomPan.bindCanvas(fc, containerW, containerH)
    this._guideLine.setupEvents(fc)
    this._interaction.setupEvents(fc)

    this.canvas = fc
    // 暴露实例到 window（便于测试和调试）
    ;(window as any).__fabricCanvas = fc
    ;(window as any).__canvasMgr = this
    return fc
  }

  /**
   * 配置控制点样式 — 使用 Fabric 6 的 ownDefaults 静态属性
   */
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
    } as any)
  }

  /**
   * 缩放/平移事件 — 委托给 ZoomPanController
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setupCanvasEvents(fc: any): void {
    // 滚轮缩放
    fc.on('mouse:wheel', (opt: any) => {
      opt.e.preventDefault()
      opt.e.stopPropagation()
      this._zoomPan.handleWheel(opt.e.deltaY)
    })

    // 空格 + 拖拽平移
    fc.on('mouse:down', (opt: any) => {
      this._zoomPan.handlePanMouseDown(opt.e, fc)
    })
    fc.on('mouse:move', (opt: any) => {
      this._zoomPan.handlePanMouseMove(opt.e, fc)
    })
    fc.on('mouse:up', () => {
      this._zoomPan.handlePanMouseUp(fc)
    })
  }

  // ── 委托给 ZoomPanController ──
  setLogicalSize(w: number, h: number): void { this._zoomPan.setLogicalSize(w, h) }
  getBaseWidth(): number { return this._zoomPan.getBaseWidth() }
  getBaseHeight(): number { return this._zoomPan.getBaseHeight() }
  zoomIn(): void { this._zoomPan.zoomIn() }
  zoomOut(): void { this._zoomPan.zoomOut() }
  zoomFit(): void { this._zoomPan.zoomFit() }
  getZoomLevel(): number { return this._zoomPan.getZoomLevel() }
  setSpacePressed(pressed: boolean): void { this._zoomPan.setSpacePressed(pressed) }

  // ── 回调注册（委托给 EventBus，保持 API 兼容）──
  onZoomChange(fn: (zoomLevel: number) => void): void { this._eventBus.on('zoomChange', fn) }
  onGuideLinesChange(fn: (lines: GuideLine[]) => void): void { this._eventBus.on('guideLinesChange', fn) }
  onSelectionChange(fn: () => void): void { this._eventBus.on('selectionChange', fn) }
  onModified(fn: () => void): void { this._eventBus.on('modified', fn) }

  /** 获取内部 EventBus（供高级使用者直接订阅事件） */
  getEventBus(): EventBus { return this._eventBus }

  /** 获取子模块（供测试和高级使用） */
  getZoomPanController(): ZoomPanController { return this._zoomPan }
  getGuideLineManager(): GuideLineManager { return this._guideLine }
  getInteractionManager(): InteractionManager { return this._interaction }

  /** 设置 ModeManager（可选，用于状态模式切换） */
  setModeManager(mm: ModeManager): void {
    this._modeManager = mm
    if (this.canvas) {
      mm.setCanvas(this.canvas)
    }
  }

  /** 获取最近一次 zoomFit 的居中偏移（供外部通过 scroll 定位） */
  getZoomFitPan(): { x: number; y: number } { return this._zoomPan.getZoomFitPan() }

  /**
   * 平移所有 Fabric 对象（用于 resize 北边/西边时保持元素与对边相对位置不变）
   * @param dx 逻辑坐标 X 偏移
   * @param dy 逻辑坐标 Y 偏移
   */
  translateAllObjects(dx: number, dy: number): void {
    if (!this.canvas) return
    this.canvas.getObjects().forEach((obj: any) => {
      obj.set({ left: (obj.left || 0) + dx, top: (obj.top || 0) + dy })
      obj.setCoords()
    })
    this.canvas.renderAll()
  }

  // ── 生命周期 ──
  dispose(): void {
    if (this.canvas) {
      this.canvas.dispose()
      this.canvas = null
    }
    this._zoomPan.unbindCanvas()
    this._eventBus.clear()
  }
}
