/**
 * 历史管理器 — 撤销/重做栈
 *
 * 职责：
 *   - 保存/恢复画布状态（基于 toJSON / loadFromJSON）
 *   - 撤销（undo）/ 重做（redo）
 *   - 限制栈深度防止内存溢出
 *
 * Fabric 6 变更：
 *   - canvas.toJSON() 不再接受参数
 *   - canvas.loadFromJSON() 返回 Promise（仍支持 callback 兼容）
 */

import type { Canvas } from 'fabric'
import type { IHistoryManager } from './types'
import { timed } from '../utils/perf'

const MAX_STACK = 50

export class HistoryManager implements IHistoryManager {
  private _undoStack: object[] = []
  private _redoStack: object[] = []
  private _onStateChange: (() => void) | null = null

  /**
   * 保存当前画布状态
   */
  save(canvas: Canvas, beforeSave?: () => void, afterSave?: () => void): void {
    if (!canvas) return
    if (beforeSave) beforeSave()
    // Fabric 6: toJSON() 不再接受参数
    // 全量快照：对象越多，toJSON 序列化耗时越高（撤销/重做卡顿的主要来源）
    this._undoStack.push(timed('history:save', () => canvas.toJSON() as unknown as object))
    if (this._undoStack.length > MAX_STACK) this._undoStack.shift()
    this._redoStack = []
    if (afterSave) afterSave()
    this._notify()
  }

  /**
   * 撤销
   */
  undo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || this._undoStack.length < 2) return

    const currentState = this._undoStack.pop()!
    this._redoStack.push(currentState)
    const prevState = this._undoStack[this._undoStack.length - 1]

    // Fabric 6: loadFromJSON 返回 Promise
    canvas.clear()
    ;(canvas as any)
      .loadFromJSON(prevState)
      .then(() => {
        this._restoreInteractivity(canvas)
        if (afterLoad) afterLoad()
      })
      .catch((err: any) => {
        console.error('[HistoryManager] undo 加载状态失败，恢复当前状态', err)
        // 失败兜底：把弹出状态重新放回
        this._redoStack.pop()
        this._undoStack.push(currentState)
        canvas.renderAll()
      })
    this._notify()
  }

  /**
   * 重做
   */
  redo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || !this._redoStack.length) return

    const nextState = this._redoStack.pop()!
    this._undoStack.push(nextState)

    canvas.clear()
    ;(canvas as any)
      .loadFromJSON(nextState)
      .then(() => {
        this._restoreInteractivity(canvas)
        if (afterLoad) afterLoad()
      })
      .catch((err: any) => {
        console.error('[HistoryManager] redo 加载状态失败，恢复', err)
        this._undoStack.pop()
        this._redoStack.push(nextState)
        canvas.renderAll()
      })
    this._notify()
  }

  canUndo(): boolean { return this._undoStack.length >= 2 }
  canRedo(): boolean { return this._redoStack.length > 0 }

  onStateChange(fn: () => void): void { this._onStateChange = fn }

  reset(): void {
    this._undoStack = []
    this._redoStack = []
  }

  private _notify(): void { if (this._onStateChange) this._onStateChange() }

  /**
   * 恢复所有 canvas 对象的可交互性
   * undo/redo 后 loadFromJSON 会重置对象属性，需要重新设置
   */
  private _restoreInteractivity(canvas: Canvas): void {
    canvas.getObjects().forEach((o: any) => {
      if (o.excludeFromExport) return
      o.set({ selectable: true, evented: true })
      if (!o.fill || o.fill === 'none' || o.fill === 'transparent') {
        if (['rect', 'path', 'polygon', 'circle', 'ellipse'].includes(o.type)) {
          o.set({ fill: 'rgba(0,0,0,0.001)' })
        }
      }
      o.setCoords()
    })
    canvas.renderAll()
  }
}
