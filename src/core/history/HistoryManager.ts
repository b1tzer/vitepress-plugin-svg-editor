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
import type { IHistoryManager } from '../shared/types'
import type { ICommand } from './Command'
import { ensureObjectInteractive } from '../shared/Interactive'
import { timed } from '../../utils/perf'

const MAX_STACK = 50

/** 历史条目：全量快照或增量命令（渐进替换 Command 模式） */
type HistoryEntry =
  | { type: 'snapshot'; json: Record<string, unknown> }
  | { type: 'command'; cmd: ICommand }

export class HistoryManager implements IHistoryManager {
  private _undoStack: HistoryEntry[] = []
  private _redoStack: HistoryEntry[] = []
  private _stateChangeListeners = new Set<() => void>()
  /** 异步快照恢复队列：串行化 loadFromJSON，避免并发恢复读写栈导致状态错乱 */
  private _restoreQueue: Promise<void> = Promise.resolve()

  /**
   * 保存当前画布状态
   */
  save(canvas: Canvas, beforeSave?: () => void, afterSave?: () => void): void {
    if (!canvas) return
    if (beforeSave) beforeSave()
    // Fabric 6: toJSON() 不再接受参数
    // 全量快照：作为复杂操作/初始锚点的兜底。
    // 记录快照时折叠栈顶已有的增量命令（其效果已包含在新快照中），
    // 保证快照条目在栈底连续、命令条目在栈顶连续，快照撤销语义自洽。
    while (
      this._undoStack.length &&
      this._undoStack[this._undoStack.length - 1].type === 'command'
    ) {
      this._undoStack.pop()
    }
    const snapshot: HistoryEntry = {
      type: 'snapshot',
      json: timed('history:save', () => canvas.toJSON() as Record<string, unknown>),
    }
    this._undoStack.push(snapshot)
    if (this._undoStack.length > MAX_STACK) this._undoStack.shift()
    this._redoStack = []
    if (afterSave) afterSave()
    this._notify()
  }

  /**
   * 记录增量命令（对象拖拽/缩放/旋转等可精确还原的操作），
   * 避免 canvas.toJSON() 全量序列化带来的性能开销。
   */
  record(cmd: ICommand): void {
    this._undoStack.push({ type: 'command', cmd })
    if (this._undoStack.length > MAX_STACK) this._undoStack.shift()
    this._redoStack = []
    this._notify()
  }

  /**
   * 撤销
   */
  undo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || this._undoStack.length < 2) return

    const entry = this._undoStack.pop()!
    this._redoStack.push(entry)

    if (entry.type === 'command') {
      // 增量命令：同步撤销，无需 loadFromJSON
      entry.cmd.undo()
      canvas.requestRenderAll()
      if (afterLoad) afterLoad()
      this._notify()
      return
    }

    // 快照：恢复到前一个快照（栈底连续，prevEntry 必为 snapshot）
    const prevEntry = this._undoStack[this._undoStack.length - 1]
    if (prevEntry && prevEntry.type === 'snapshot') {
      this._enqueueRestore(canvas, prevEntry.json, afterLoad, entry, false)
    } else {
      // 理论不可达（栈底始终保留初始快照锚点）；兜底放回
      this._redoStack.pop()
      this._undoStack.push(entry)
      this._notify()
    }
  }

  /**
   * 重做
   */
  redo(canvas: Canvas, afterLoad?: () => void): void {
    if (!canvas || !this._redoStack.length) return

    const entry = this._redoStack.pop()!
    this._undoStack.push(entry)

    if (entry.type === 'command') {
      // 增量命令：同步重做，无需 loadFromJSON
      entry.cmd.execute()
      canvas.requestRenderAll()
      if (afterLoad) afterLoad()
      this._notify()
      return
    }

    // 快照：loadFromJSON 恢复
    this._enqueueRestore(canvas, entry.json, afterLoad, entry, true)
  }

  canUndo(): boolean {
    return this._undoStack.length >= 2
  }
  canRedo(): boolean {
    return this._redoStack.length > 0
  }

  onStateChange(fn: () => void): void {
    this._stateChangeListeners.add(fn)
  }
  offStateChange(fn: () => void): void {
    this._stateChangeListeners.delete(fn)
  }

  reset(): void {
    this._undoStack = []
    this._redoStack = []
  }

  /**
   * 将快照恢复操作加入串行队列。
   * 快速连续 undo/redo 时，多个 loadFromJSON 会并发读写栈；
   * 通过 Promise 链保证每次恢复在前一次完成后再执行，消除竞态。
   */
  private _enqueueRestore(
    canvas: Canvas,
    json: Record<string, unknown>,
    afterLoad: (() => void) | undefined,
    entry: HistoryEntry,
    isRedo: boolean
  ): void {
    this._restoreQueue = this._restoreQueue.then(() =>
      this._restoreSnapshot(canvas, json, afterLoad, entry, isRedo)
    )
  }

  /**
   * 异步恢复快照（Fabric loadFromJSON 返回 Promise）。
   * 失败时把已弹出的条目放回原栈，保证历史栈一致性。
   */
  private _restoreSnapshot(
    canvas: Canvas,
    json: Record<string, unknown>,
    afterLoad: (() => void) | undefined,
    entry: HistoryEntry,
    isRedo: boolean
  ): Promise<void> {
    canvas.clear()
    return canvas
      .loadFromJSON(json)
      .then(() => {
        this._restoreInteractivity(canvas)
        if (afterLoad) afterLoad()
        this._notify()
      })
      .catch((err: unknown) => {
        console.error(`[HistoryManager] ${isRedo ? 'redo' : 'undo'} 加载状态失败，恢复`, err)
        if (isRedo) {
          this._undoStack.pop()
          this._redoStack.push(entry)
        } else {
          this._redoStack.pop()
          this._undoStack.push(entry)
        }
        canvas.renderAll()
        this._notify()
      })
  }

  private _notify(): void {
    this._stateChangeListeners.forEach((fn) => fn())
  }

  /**
   * 恢复所有 canvas 对象的可交互性
   * undo/redo 后 loadFromJSON 会重置对象属性，需要重新设置
   */
  private _restoreInteractivity(canvas: Canvas): void {
    canvas.getObjects().forEach((o) => {
      if (o.excludeFromExport) return
      ensureObjectInteractive(o)
      o.setCoords()
    })
    canvas.renderAll()
  }
}
