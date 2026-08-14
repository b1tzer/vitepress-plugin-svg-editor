/**
 * 键盘快捷键映射表 — 声明式配置编辑器快捷键
 *
 * 将原本散落在 SvgEditor.vue 中的 30+ 个 if 判断收敛为数据表，
 * 新增/修改快捷键只需改此文件，无需触碰组件逻辑。
 *
 * 纯数据 + 纯匹配函数，零 Vue 依赖，可单测。
 */

/** 快捷键绑定 */
export interface ShortcutBinding {
  /** 主键（e.key，匹配时统一转小写） */
  key: string
  /** 是否要求 Ctrl 或 Meta（Cmd） */
  mod?: boolean
  /**
   * Shift 三态：
   *   - true      → 要求按下 Shift
   *   - false     → 要求未按下 Shift
   *   - undefined → 不关心 Shift 状态
   */
  shift?: boolean
  /** 触发的 action 名 */
  action: string
}

/** 编辑器快捷键绑定表（顺序敏感：先精确匹配，后宽松匹配） */
export const SHORTCUT_BINDINGS: ShortcutBinding[] = [
  { key: 'z', mod: true, shift: false, action: 'undo' },
  { key: 'z', mod: true, shift: true, action: 'redo' },
  { key: 'y', mod: true, action: 'redo' },
  { key: 'c', mod: true, action: 'copy' },
  { key: 'v', mod: true, action: 'paste' },
  { key: 's', mod: true, action: 'save' },
  { key: 'a', mod: true, action: 'selectAll' },
  { key: 'b', mod: true, action: 'bold' },
  { key: 'i', mod: true, action: 'italic' },
  { key: 'u', mod: true, action: 'underline' },
  { key: '=', mod: true, action: 'zoomIn' },
  { key: '+', mod: true, action: 'zoomIn' },
  { key: '-', mod: true, action: 'zoomOut' },
  { key: '0', mod: true, action: 'zoomFit' },
  { key: 'g', mod: true, shift: false, action: 'group' },
  { key: 'g', mod: true, shift: true, action: 'ungroup' },
]

/**
 * 根据键盘事件匹配快捷键，返回触发的 action 名
 * @param e KeyboardEvent
 * @returns action 名，未匹配返回 undefined
 */
export function matchShortcut(e: KeyboardEvent): string | undefined {
  const key = e.key.toLowerCase()
  const mod = e.ctrlKey || e.metaKey
  for (const binding of SHORTCUT_BINDINGS) {
    if (binding.key !== key) continue
    if (!!binding.mod !== mod) continue
    if (binding.shift !== undefined && binding.shift !== e.shiftKey) continue
    return binding.action
  }
  return undefined
}

/** Ctrl/Cmd 组合键的 action 处理器映射 */
export interface KeyboardActions {
  [action: string]: () => void
}

/** 特殊键（空格平移 / Escape / 删除）处理器 */
export interface KeyboardSpecialHandlers {
  /** 空格按下（启动平移） */
  onSpaceDown: () => void
  /** 空格抬起（停止平移） */
  onSpaceUp: () => void
  /** Escape 键 */
  onEscape: () => void
  /** Delete / Backspace（非输入框场景） */
  onDelete: () => void
  /** 当前焦点是否在可编辑元素（INPUT/TEXTAREA）上 */
  isEditableFocused: () => boolean
}

/**
 * 创建键盘事件处理器（keydown / keyup）
 *
 * 将「空格平移 → Ctrl/Cmd 快捷键 → 删除 → Escape」的分发顺序与边界
 * （如空格命中即 return、删除需避开输入框）封装为纯工厂，供组件在画布
 * 初始化完成后注册。
 *
 * @param actions Ctrl/Cmd 组合键 action 处理器
 * @param special 特殊键处理器
 * @returns onKeyDown / onKeyUp 处理函数
 */
export function createKeyboardHandlers(
  actions: KeyboardActions,
  special: KeyboardSpecialHandlers,
): { onKeyDown: (e: KeyboardEvent) => void; onKeyUp: (e: KeyboardEvent) => void } {
  const onKeyDown = (e: KeyboardEvent): void => {
    // 空格平移：命中即返回，不再走后续分支
    if (e.key === ' ' && !e.repeat) {
      e.preventDefault()
      special.onSpaceDown()
      return
    }

    // Ctrl/Cmd 组合快捷键
    if (e.ctrlKey || e.metaKey) {
      const action = matchShortcut(e)
      if (action && actions[action]) {
        e.preventDefault()
        actions[action]()
        return
      }
    }

    // 删除（避免误删输入框内容）
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!special.isEditableFocused()) {
        e.preventDefault()
        special.onDelete()
      }
    }

    // Escape
    if (e.key === 'Escape') {
      special.onEscape()
    }
  }

  const onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === ' ') special.onSpaceUp()
  }

  return { onKeyDown, onKeyUp }
}

