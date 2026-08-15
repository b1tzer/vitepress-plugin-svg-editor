/**
 * 交互管理器 — 从 CanvasManager 中提取的交互事件职责
 *
 * 职责：
 *   - 对象添加时确保可交互（无填充对象设置透明填充）
 *   - 鼠标悬停高亮（hover 时显示 borderColor）
 *   - 选择事件转发（selection:created/updated/cleared）
 *   - Textbox 缩放时保持字号不变（Office 行为）
 *
 * 通过构造函数注入 EventBus 实现 DIP
 */

import type { Canvas } from 'fabric'
import type { IEventBus } from '../types'
import { FABRIC_TYPE } from '../FabricTypes'
import { ensureObjectInteractive } from '../editor/Interactive'
import { MoveCommand, ResizeCommand, PropertyChangeCommand } from '../Command'
import type { ICommand } from '../Command'

export class InteractionManager {
  private _eventBus: IEventBus

  constructor(eventBus: IEventBus) {
    this._eventBus = eventBus
  }

  /** 注册画布交互事件（在 CanvasManager 中调用） */
  setupEvents(canvas: Canvas): void {
    const fc = canvas as any

    // ── object:added — 确保所有对象可交互（跳过编辑器内部对象，如 workspace 背景）──
    fc.on('object:added', (e: any) => {
      if (e.target && !e.target.excludeFromExport) {
        ensureObjectInteractive(e.target)
      }
    })

    // ── 悬停高亮（rAF 节流合并连续 over/out，避免快速移动时多次全量重绘） ──
    let _hoverRafId: number | null = null
    const scheduleHoverRender = () => {
      if (_hoverRafId !== null) return
      _hoverRafId = requestAnimationFrame(() => {
        _hoverRafId = null
        fc.requestRenderAll()
      })
    }

    fc.on('mouse:over', (e: any) => {
      if (e.target && e.target.selectable) {
        fc.setCursor('pointer')
        if (!fc.getActiveObject()) {
          e.target._origBorderColor = e.target.borderColor
          e.target.set({ borderColor: '#0078d4' })
          scheduleHoverRender()
        }
      }
    })

    fc.on('mouse:out', (e: any) => {
      fc.setCursor('default')
      if (e.target && !fc.getActiveObject()) {
        e.target.set({ borderColor: e.target._origBorderColor || '#0078d4' })
        scheduleHoverRender()
      }
    })

    // ── 选择事件 ──
    fc.on('selection:created', () => this._eventBus.emit('selectionChange'))
    fc.on('selection:updated', () => this._eventBus.emit('selectionChange'))
    fc.on('selection:cleared', () => this._eventBus.emit('selectionChange'))

    // ── Textbox 缩放时保持字号不变（Office 行为）──
    fc.on('object:scaling', (e: any) => {
      const obj = e.target
      if (!obj || (obj.type !== FABRIC_TYPE.TEXTBOX && obj.type !== FABRIC_TYPE.I_TEXT)) return
      if (obj.__scalingFontSize == null) obj.__scalingFontSize = obj.fontSize
      obj.set({ fontSize: obj.__scalingFontSize / Math.max(obj.scaleY, 0.1) })
    })

    fc.on('object:modified', (e: any) => {
      const obj = e.target
      if (obj && (obj.type === FABRIC_TYPE.TEXTBOX || obj.type === FABRIC_TYPE.I_TEXT)) {
        if (obj.__scalingFontSize != null) {
          const origFontSize = obj.__scalingFontSize
          const newWidth = Math.max(obj.width * obj.scaleX, 30)
          obj.set({ width: newWidth, scaleX: 1, scaleY: 1, fontSize: origFontSize })
          delete obj.__scalingFontSize
          obj.setCoords()
          fc.requestRenderAll()
        }
      }
      // 对象交互修改完成（拖拽/缩放/旋转松手）后：
      // 单对象变换构造增量 Command（避免全量 toJSON），否则回退全量快照。
      // Fabric 的 object:modified 仅在交互松手时触发一次，不会在 mousemove 期间高频触发。
      const command = this._buildTransformCommand(obj, e)
      this._eventBus.emit('modified', command)
    })
  }

  /**
   * 根据 Fabric 的 object:modified 事件构造增量命令。
   *
   * 仅处理单对象（非 ActiveSelection / Group）的变换，将拖拽/缩放/旋转
   * 分别映射为 MoveCommand / ResizeCommand / PropertyChangeCommand，从而避免
   * 每次松手都执行 canvas.toJSON() 全量快照（撤销/重做性能瓶颈）。
   *
   * 无法识别（多选、缺失 transform.original、或属性无变化）时返回 undefined，
   * 由调用方回退到全量快照兜底。
   */
  private _buildTransformCommand(obj: any, e: any): ICommand | undefined {
    if (!obj || obj.type === FABRIC_TYPE.ACTIVE_SELECTION || obj.type === FABRIC_TYPE.GROUP) return undefined
    const orig = e?.transform?.original
    if (!orig) return undefined

    const scaleChanged =
      (orig.scaleX ?? 1) !== (obj.scaleX ?? 1) ||
      (orig.scaleY ?? 1) !== (obj.scaleY ?? 1) ||
      (orig.width ?? 0) !== (obj.width ?? 0) ||
      (orig.height ?? 0) !== (obj.height ?? 0)

    if (scaleChanged) {
      const oldState = {
        left: orig.left || 0, top: orig.top || 0,
        scaleX: orig.scaleX ?? 1, scaleY: orig.scaleY ?? 1,
        width: orig.width || 0, height: orig.height || 0,
      }
      const newState = {
        left: obj.left || 0, top: obj.top || 0,
        scaleX: obj.scaleX ?? 1, scaleY: obj.scaleY ?? 1,
        width: obj.width || 0, height: obj.height || 0,
      }
      return new ResizeCommand(obj, oldState, newState)
    }

    const leftChanged = (orig.left || 0) !== (obj.left || 0)
    const topChanged = (orig.top || 0) !== (obj.top || 0)
    if (leftChanged || topChanged) {
      const dx = (obj.left || 0) - (orig.left || 0)
      const dy = (obj.top || 0) - (orig.top || 0)
      return new MoveCommand(obj, dx, dy)
    }

    const angleChanged = (orig.angle ?? 0) !== (obj.angle ?? 0)
    if (angleChanged) {
      return new PropertyChangeCommand(obj, { angle: orig.angle ?? 0 }, { angle: obj.angle ?? 0 })
    }

    return undefined
  }
}