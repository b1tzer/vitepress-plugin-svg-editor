/**
 * 命令式历史管理器 — 基于 Command 模式的撤销/重做
 *
 * 与 HistoryManager（基于 canvas.toJSON 快照）的区别：
 *   - 存储 Command 对象（增量操作）而非完整画布快照，内存占用更低
 *   - 每个 Command 自行管理 execute/undo 逻辑
 *   - 不限 Canvas 实例，适用于任何实现 Command 接口的操作
 *
 * 使用方式：
 *   const history = new CommandHistory()
 *   history.execute(new MoveCommand(obj, 10, 20))
 *   history.undo()  // 回退移动
 *   history.redo()  // 重新移动
 */

import type { ICommandHistory } from './types'
import type { ICommand } from './Command'

const MAX_STACK = 50

export class CommandHistory implements ICommandHistory {
  private _undoStack: ICommand[] = []
  private _redoStack: ICommand[] = []
  private _onStateChange: (() => void) | null = null

  /**
   * 执行命令并推入撤销栈
   * 新操作会清空重做栈（标准行为：不能"重做"到已被覆盖的分支）
   */
  execute(cmd: ICommand): void {
    cmd.execute()
    this._undoStack.push(cmd)
    if (this._undoStack.length > MAX_STACK) {
      this._undoStack.shift()
    }
    // 新操作清空重做栈
    this._redoStack = []
    this._notify()
  }

  /**
   * 撤销：弹出最后一个命令，调用其 undo()
   */
  undo(): void {
    if (!this._undoStack.length) return
    const cmd = this._undoStack.pop()!
    try {
      cmd.undo()
      this._redoStack.push(cmd)
    } catch (e) {
      // 撤销失败：undo() 未执行 → cmd 未被 push 到 redoStack → 只需放回 undoStack
      console.error(`[CommandHistory] 撤销 "${cmd.getLabel()}" 失败:`, e)
      this._undoStack.push(cmd)
      return
    }
    this._notify()
  }

  /**
   * 重做：弹出重做栈中最后一个命令，调用其 execute()
   */
  redo(): void {
    if (!this._redoStack.length) return
    const cmd = this._redoStack.pop()!
    try {
      cmd.execute()
      this._undoStack.push(cmd)
      if (this._undoStack.length > MAX_STACK) {
        this._undoStack.shift()
      }
    } catch (e) {
      // 重做失败：execute() 未执行 → cmd 未被 push 到 undoStack → 只需放回 redoStack
      console.error(`[CommandHistory] 重做 "${cmd.getLabel()}" 失败:`, e)
      this._redoStack.push(cmd)
      return
    }
    this._notify()
  }

  canUndo(): boolean {
    return this._undoStack.length > 0
  }

  canRedo(): boolean {
    return this._redoStack.length > 0
  }

  onStateChange(fn: () => void): void {
    this._onStateChange = fn
  }

  reset(): void {
    this._undoStack = []
    this._redoStack = []
    this._onStateChange = null
  }

  /** 获取撤销栈大小（供测试使用） */
  getUndoStackSize(): number {
    return this._undoStack.length
  }

  /** 获取重做栈大小（供测试使用） */
  getRedoStackSize(): number {
    return this._redoStack.length
  }

  private _notify(): void {
    if (this._onStateChange) this._onStateChange()
  }
}
