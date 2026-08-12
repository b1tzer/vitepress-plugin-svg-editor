/**
 * 模式管理器 — 管理编辑器交互模式的切换
 *
 * 职责：
 *   - 持有当前 EditorMode
 *   - switchTo(mode) 时调用旧模式的 onExit、新模式的 onEnter
 *   - revertToDefault() 回到默认模式（SelectMode）
 *   - 将所有 mouse 事件委托给当前模式
 *
 * 使用方式：
 *   const mgr = new ModeManager(canvas)
 *   mgr.switchTo(new PanMode())
 *   // ... 在 CanvasManager 事件处理中 ...
 *   mgr.onMouseDown(e, canvas)
 */

import type { Canvas } from 'fabric'
import type { IEditorMode } from './EditorMode'
import { SelectMode } from './SelectMode'

export class ModeManager {
  private _currentMode: IEditorMode
  private _defaultMode: IEditorMode
  private _canvas: Canvas | null = null

  constructor(canvas: Canvas) {
    this._canvas = canvas
    this._defaultMode = new SelectMode()
    this._currentMode = this._defaultMode
  }

  /** 更新绑定的 Canvas 实例 */
  setCanvas(canvas: Canvas): void {
    this._canvas = canvas
  }

  /**
   * 切换到指定模式
   * @param mode 目标模式实例
   */
  switchTo(mode: IEditorMode): void {
    if (!this._canvas) return
    if (this._currentMode === mode) return

    this._currentMode.onExit(this._canvas)
    this._currentMode = mode
    this._currentMode.onEnter(this._canvas)
  }

  /**
   * 恢复到默认模式（SelectMode）
   */
  revertToDefault(): void {
    if (this._currentMode === this._defaultMode) return
    this.switchTo(this._defaultMode)
  }

  /** 获取当前模式信息 */
  getCurrentMode(): IEditorMode {
    return this._currentMode
  }

  /** 获取当前模式名称 */
  getCurrentModeName(): string {
    return this._currentMode.name
  }

  /** 是否在默认模式 */
  isDefaultMode(): boolean {
    return this._currentMode === this._defaultMode
  }

  // ── 事件委托 ──

  onMouseDown(e: MouseEvent): void {
    if (!this._canvas) return
    this._currentMode.onMouseDown(e, this._canvas)
  }

  onMouseMove(e: MouseEvent): void {
    if (!this._canvas) return
    this._currentMode.onMouseMove(e, this._canvas)
  }

  onMouseUp(e: MouseEvent): void {
    if (!this._canvas) return
    this._currentMode.onMouseUp(e, this._canvas)
  }
}
