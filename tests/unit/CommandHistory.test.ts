/**
 * CommandHistory 单元测试
 * 覆盖 execute / undo / redo / 栈深度限制 / 异常恢复
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommandHistory } from '../../src/core/CommandHistory'
import type { Command } from '../../src/core/Command'

function makeMockCommand(label: string): Command {
  const cmd: Command = {
    execute: vi.fn(),
    undo: vi.fn(),
    getLabel: vi.fn(() => label),
  }
  return cmd
}

/** 创建一个 execute 正常但 undo 会失败的命令 */
function makeFailingUndoCommand(label: string): Command {
  return {
    execute: vi.fn(),
    undo: vi.fn(() => { throw new Error(`mock undo failure: ${label}`) }),
    getLabel: vi.fn(() => label),
  }
}

/** 创建一个首次 execute 正常、undo 正常，但 redo（第二次 execute）会失败的命令 */
function makeFailingRedoCommand(label: string): Command {
  let callCount = 0
  return {
    execute: vi.fn(() => {
      callCount++
      if (callCount > 1) throw new Error(`mock redo failure: ${label}`)
    }),
    undo: vi.fn(),
    getLabel: vi.fn(() => label),
  }
}

// ═══════════════════════════════════════════════════════════════

describe('CommandHistory', () => {
  let history: CommandHistory

  beforeEach(() => {
    history = new CommandHistory()
  })

  // ── 基本操作 ──

  it('初始状态 canUndo=false, canRedo=false', () => {
    expect(history.canUndo()).toBe(false)
    expect(history.canRedo()).toBe(false)
  })

  it('execute 后 canUndo=true', () => {
    const cmd = makeMockCommand('test')
    history.execute(cmd)
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false)
  })

  it('execute 应调用 cmd.execute()', () => {
    const cmd = makeMockCommand('test')
    history.execute(cmd)
    expect(cmd.execute).toHaveBeenCalledTimes(1)
  })

  // ── undo / redo ──

  it('undo 应调用 cmd.undo() 并 canRedo=true', () => {
    const cmd = makeMockCommand('test')
    history.execute(cmd)
    history.undo()

    expect(cmd.undo).toHaveBeenCalledTimes(1)
    expect(history.canUndo()).toBe(false)
    expect(history.canRedo()).toBe(true)
  })

  it('redo 应调用 cmd.execute() 并 canUndo=true', () => {
    const cmd = makeMockCommand('test')
    history.execute(cmd)
    history.undo()
    history.redo()

    expect(cmd.execute).toHaveBeenCalledTimes(2) // 首次 + redo
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false)
  })

  it('连续多次 execute → undo → redo 应正常工作', () => {
    const cmd1 = makeMockCommand('move 1')
    const cmd2 = makeMockCommand('move 2')
    const cmd3 = makeMockCommand('move 3')

    history.execute(cmd1)
    history.execute(cmd2)
    history.execute(cmd3)

    expect(history.getUndoStackSize()).toBe(3)

    history.undo()
    expect(cmd3.undo).toHaveBeenCalledTimes(1)
    expect(history.getUndoStackSize()).toBe(2)
    expect(history.getRedoStackSize()).toBe(1)

    history.undo()
    expect(cmd2.undo).toHaveBeenCalledTimes(1)
    expect(history.getUndoStackSize()).toBe(1)
    expect(history.getRedoStackSize()).toBe(2)

    history.redo()
    expect(cmd2.execute).toHaveBeenCalledTimes(2)
    expect(history.getUndoStackSize()).toBe(2)
    expect(history.getRedoStackSize()).toBe(1)
  })

  // ── 空栈边界 ──

  it('空栈 undo 不应报错', () => {
    expect(() => history.undo()).not.toThrow()
  })

  it('空栈 redo 不应报错', () => {
    expect(() => history.redo()).not.toThrow()
  })

  // ── 新操作清空 redo 栈 ──

  it('undo 后执行新操作应清空 redo 栈', () => {
    const cmd1 = makeMockCommand('cmd1')
    const cmd2 = makeMockCommand('cmd2')
    const cmd3 = makeMockCommand('cmd3')

    history.execute(cmd1)
    history.execute(cmd2)
    history.undo()  // cmd2 进入 redo

    expect(history.getRedoStackSize()).toBe(1)

    history.execute(cmd3)  // 新操作 → redo 栈清空

    expect(history.getRedoStackSize()).toBe(0)
    expect(history.getUndoStackSize()).toBe(2) // cmd1 + cmd3
  })

  // ── 栈深度限制 ──

  it('超过 MAX_STACK(50) 时应移除最旧命令', () => {
    // 执行 55 个命令
    for (let i = 0; i < 55; i++) {
      history.execute(makeMockCommand(`cmd-${i}`))
    }

    expect(history.getUndoStackSize()).toBe(50)
  })

  // ── onStateChange 回调 ──

  it('execute/undo/redo 应触发 onStateChange', () => {
    const callback = vi.fn()
    history.onStateChange(callback)

    const cmd = makeMockCommand('test')
    history.execute(cmd)
    expect(callback).toHaveBeenCalledTimes(1)

    history.undo()
    expect(callback).toHaveBeenCalledTimes(2)

    history.redo()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  // ── reset ──

  it('reset 应清空所有栈和回调', () => {
    const callback = vi.fn()
    history.onStateChange(callback)
    history.execute(makeMockCommand('test1'))
    history.execute(makeMockCommand('test2'))

    history.reset()

    expect(history.canUndo()).toBe(false)
    expect(history.canRedo()).toBe(false)
    expect(history.getUndoStackSize()).toBe(0)
    expect(history.getRedoStackSize()).toBe(0)
    // reset 后不应触发回调
    expect(callback).toHaveBeenCalledTimes(2) // 仅 2 次 execute
  })

  // ── 异常恢复 ──

  it('undo 失败时不应丢失命令（回退到执行状态）', () => {
    const cmd1 = makeMockCommand('ok')
    const cmd2 = makeFailingUndoCommand('fail-undo')

    history.execute(cmd1)
    history.execute(cmd2)

    // cmd2 undo 会抛异常 → CommandHistory 应回退
    expect(() => history.undo()).not.toThrow()
    expect(history.getUndoStackSize()).toBe(2) // cmd2 仍然在撤销栈
    expect(history.getRedoStackSize()).toBe(0) // 未入重做栈
  })

  it('redo 失败时不应丢失命令', () => {
    const cmd1 = makeMockCommand('ok')
    const redoCmd = makeFailingRedoCommand('fail-redo')

    // 先搞一个 undo
    history.execute(cmd1)
    history.execute(redoCmd)
    history.undo()
    expect(history.getRedoStackSize()).toBe(1)

    // redo 会抛异常 → CommandHistory 应回退
    expect(() => history.redo()).not.toThrow()
    expect(history.getRedoStackSize()).toBe(1) // 仍然在重做栈
    expect(history.getUndoStackSize()).toBe(1) // 未新增到撤销栈
  })
})
