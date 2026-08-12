/**
 * 辅助线管理器 — 从 CanvasManager 中提取的辅助线职责
 *
 * 职责：
 *   - 移动时显示对齐参考线
 *   - 松手时执行吸附对齐
 *   - 自定义渲染辅助线（after:render 钩子）
 *
 * 通过构造函数注入 EventBus 实现 DIP
 */

import type { Canvas } from 'fabric'
import type { IEventBus, GuideLine } from '../types'
import { getObjBounds } from '../../plugins/selection'
import type { ISnappingStrategy } from '../strategies/SnappingStrategy'
import { DefaultSnappingStrategy } from '../strategies/SnappingStrategy'

const SNAP_THRESHOLD = 8
const GUIDE_LINE_STYLE = 'rgba(0, 120, 212, 0.5)'
const GUIDE_LINE_DASH = [4, 4]

export class GuideLineManager {
  private _eventBus: IEventBus
  private _guideLines: GuideLine[] = []
  private _snappingStrategy: ISnappingStrategy
  private _enabled = true

  constructor(eventBus: IEventBus, snappingStrategy?: ISnappingStrategy) {
    this._eventBus = eventBus
    this._snappingStrategy = snappingStrategy || new DefaultSnappingStrategy()
  }

  /** 启用/禁用辅助线与吸附功能 */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled
    if (!enabled) {
      this._guideLines = []
      this._eventBus.emit('guideLinesChange', this._guideLines)
    }
  }

  isEnabled(): boolean { return this._enabled }

  /** 替换吸附策略（运行时切换） */
  setSnappingStrategy(strategy: ISnappingStrategy): void {
    this._snappingStrategy = strategy
  }

  getGuideLines(): GuideLine[] { return this._guideLines }

  /** 注册画布事件（在 CanvasManager 中调用） */
  setupEvents(canvas: Canvas): void {
    const fc = canvas as any

    // 移动时：显示参考线
    fc.on('object:moving', (opt: any) => {
      if (!this._enabled) return
      const obj = opt.target
      if (!obj) return
      const lines: GuideLine[] = []
      const objBounds = getObjBounds(obj)
      const objects = fc.getObjects().filter((o: any) => o !== obj && o.visible)

      for (const other of objects) {
        const ob = getObjBounds(other)
        // 垂直对齐检测
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
        // 水平对齐检测
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
      // 去重：相同位置（type + position）的辅助线只保留一条，避免产生大量重叠虚线
      const seen = new Set<string>()
      const deduped: GuideLine[] = []
      for (const line of lines) {
        const key = `${line.type}:${line.type === 'vertical' ? line.x : line.y}`
        if (!seen.has(key)) {
          seen.add(key)
          deduped.push(line)
        }
      }
      this._guideLines = deduped
      this._eventBus.emit('guideLinesChange', this._guideLines)
      fc.requestRenderAll()
    })

    // 松手时：吸附
    fc.on('object:modified', (opt: any) => {
      if (!this._enabled) return
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
      this._eventBus.emit('guideLinesChange', this._guideLines)
      fc.requestRenderAll()
      this._eventBus.emit('modified')
    })

    fc.on('selection:cleared', () => {
      if (!this._enabled) return
      this._guideLines = []
      this._eventBus.emit('guideLinesChange', this._guideLines)
    })

    // 自定义渲染参考线
    fc.on('after:render', () => {
      if (!this._enabled || !this._guideLines.length) return
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
}