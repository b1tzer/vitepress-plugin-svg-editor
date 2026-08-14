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
import { FABRIC_TYPE, HOLLOW_SHAPE_TYPES } from '../FabricTypes'

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
      if (e.target) {
        if (e.target.excludeFromExport) return
        e.target.set({ selectable: true, evented: true })
        // ⚠️ 关键：对于无填充的对象设置透明填充，使其可点击（Fabric.js 默认不处理 fill=none 的点击）
        if (!e.target.fill || e.target.fill === 'none' || e.target.fill === 'transparent') {
          if (HOLLOW_SHAPE_TYPES.includes(e.target.type)) {
            e.target.set({ fill: 'rgba(0,0,0,0.001)' })
          }
        }
        if (e.target._objects) e.target._objects.forEach((o: any) => {
          o.set({ selectable: true, evented: true })
          if (!o.fill || o.fill === 'none' || o.fill === 'transparent') {
            if (HOLLOW_SHAPE_TYPES.includes(o.type)) {
              o.set({ fill: 'rgba(0,0,0,0.001)' })
            }
          }
        })
      }
    })

    // ── 悬停高亮 ──
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
    })
  }
}