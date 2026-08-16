/**
 * 键盘监听 composable — 键盘快捷键的注册与清理（issue #15 第 2、3 条）
 *
 * 从 SvgEditor.vue 中抽取键盘监听生命周期，集中注册/清理，
 * 避免此前 `_keyHandlerFn`/`_keyUpHandler` 散落 + 非空断言带来的遗留风险。
 */

import { createKeyboardHandlers, type KeyboardActions, type KeyboardSpecialHandlers } from '../core/editor/KeyboardMap'

export function useKeyboard(): {
  register: (actions: KeyboardActions, special: KeyboardSpecialHandlers) => void
  cleanup: () => void
} {
  let _keyHandlerFn: ((e: KeyboardEvent) => void) | null = null
  let _keyUpHandler: ((e: KeyboardEvent) => void) | null = null

  function register(actions: KeyboardActions, special: KeyboardSpecialHandlers): void {
    cleanup()
    const handlers = createKeyboardHandlers(actions, special)
    _keyHandlerFn = handlers.onKeyDown
    _keyUpHandler = handlers.onKeyUp
    document.addEventListener('keydown', _keyHandlerFn)
    document.addEventListener('keyup', _keyUpHandler)
  }

  function cleanup(): void {
    if (_keyHandlerFn) document.removeEventListener('keydown', _keyHandlerFn)
    if (_keyUpHandler) document.removeEventListener('keyup', _keyUpHandler)
    _keyHandlerFn = null
    _keyUpHandler = null
  }

  return { register, cleanup }
}
