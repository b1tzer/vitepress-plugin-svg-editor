/**
 * 历史管理器 — 撤销/重做栈
 *
 * 职责：
 *   - 保存/恢复画布状态（基于 toJSON）
 *   - 撤销（undo）/ 重做（redo）
 *   - 限制栈深度防止内存溢出
 */

import type { Canvas } from 'fabric'
import type { IHistoryManager } from './types'

const MAX_STACK = 50

export class HistoryManager implements IHistoryManager {
  private _undoStack: object[] = []
  private _redoStack: object[] = []
  private _onStateChange: (() => void) | null = null

  /**
   * 保存当前画布状态
   * @param canvas    — Fabric.js Canvas 实例
   * @param beforeSave — 保存前回调（用于移除背景等）
   * @param afterSave  — 保存后回调（用于恢复背景等）
   */
  save(canvas: Canvas, beforeSave?: () => void, afterSave?: () => void): void {
    if (!canvas) return
    if (beforeSave) beforeSave()
    this._undoStack.push(canvas.toJSON(['selectable', 'evented']))
    if (this._undoStack.length > MAX_STACK) this._undoStack.shift()
    this._redoStack = []
    if (afterSave) afterSave()
    this._notify()
  }

  /**
   * 撤销
   * @param canvas    — Fabric.js Canvas 实例
   * @param afterLoad — loadFromJSON 完成后的回调
   */
  undo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || this._undoStack.length < 2) return
    this._redoStack.push(this._undoStack.pop()!)
    const state = this._undoStack[this._undoStack.length - 1]
    canvas.loadFromJSON(state, () => {
      if (afterLoad) afterLoad()
      canvas.renderAll()
    })
    this._notify()
  }

  /**
   * 重做
   * @param canvas    — Fabric.js Canvas 实例
   * @param afterLoad — loadFromJSON 完成后的回调
   */
  redo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || !this._redoStack.length) return
    const state = this._redoStack.pop()!
    this._undoStack.push(state)
    canvas.loadFromJSON(state, () => {
      if (afterLoad) afterLoad()
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
}
