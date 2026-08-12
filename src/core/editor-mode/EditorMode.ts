/**
 * 编辑器模式接口 — 状态模式的核心抽象
 *
 * 每种编辑器交互模式（选择、平移、绘制形状等）封装为独立的状态类。
 * ModeManager 持有当前模式，将 mouse/key 事件委托给当前模式处理。
 *
 * 使用方式：
 *   modeManager.switchTo(new PanMode())
 *   modeManager.onMouseDown(e, canvas)
 */

import type { Canvas } from 'fabric'

/**
 * 编辑器交互模式接口
 */
export interface IEditorMode {
  /** 模式唯一标识名 */
  readonly name: string

  /** 进入此模式时的回调 */
  onEnter(canvas: Canvas): void

  /** 离开此模式时的回调 */
  onExit(canvas: Canvas): void

  /** 鼠标按下事件 */
  onMouseDown(e: MouseEvent, canvas: Canvas): void

  /** 鼠标移动事件 */
  onMouseMove(e: MouseEvent, canvas: Canvas): void

  /** 鼠标松开事件 */
  onMouseUp(e: MouseEvent, canvas: Canvas): void
}
