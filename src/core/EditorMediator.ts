/**
 * 编辑器中介者 — 集中管理组件间通信
 *
 * 职责：
 *   - 协调工具栏 ↔ 画布 ↔ 属性面板之间的交互
 *   - 替代散落在各处的 emit 广播
 *   - 提供清晰的组件间通信接口
 *
 * 使用方式：
 *   const mediator = new EditorMediator()
 *   mediator.onToolSelected('rect')       // 工具栏选择矩形
 *   mediator.onSelectionChanged(obj)      // 画布选中对象变化
 */

import type { FabricObject } from 'fabric'

/** 工具栏工具类型 */
export type ToolType = 'select' | 'rect' | 'circle' | 'triangle' | 'ellipse' | 'line' | 'text' | 'pan'

/** 工具栏组件接口 */
export interface IToolbarComponent {
  setActiveTool(tool: ToolType): void
  updateUndoRedoState(canUndo: boolean, canRedo: boolean): void
}

/** 属性面板组件接口 */
export interface IPropertyPanel {
  setSelectedObject(obj: FabricObject | null): void
  refreshProperties(): void
}

/** 画布组件接口 */
export interface ICanvasComponent {
  setToolMode(tool: ToolType): void
  getActiveObject(): FabricObject | null
}

/** 中介者回调类型 */
export type ToolChangeCallback = (tool: ToolType) => void
export type SelectionChangeCallback = (obj: FabricObject | null) => void
export type ColorChangeCallback = (color: string) => void
export type SaveRequestCallback = () => Promise<void>
export type ThemeToggleCallback = () => void

export class EditorMediator {
  // ── 组件注册 ──
  private _toolbar: IToolbarComponent | null = null
  private _propertyPanel: IPropertyPanel | null = null
  private _canvas: ICanvasComponent | null = null

  // ── 事件监听器 ──
  private _toolChangeListeners: ToolChangeCallback[] = []
  private _selectionChangeListeners: SelectionChangeCallback[] = []
  private _colorChangeListeners: ColorChangeCallback[] = []
  private _saveRequestListeners: SaveRequestCallback[] = []
  private _themeToggleListeners: ThemeToggleCallback[] = []

  // ── 当前状态 ──
  private _currentTool: ToolType = 'select'
  private _selectedObject: FabricObject | null = null
  private _canUndo = false
  private _canRedo = false

  // ── 组件注册 ──

  registerToolbar(toolbar: IToolbarComponent): void {
    this._toolbar = toolbar
  }

  registerPropertyPanel(panel: IPropertyPanel): void {
    this._propertyPanel = panel
  }

  registerCanvas(canvas: ICanvasComponent): void {
    this._canvas = canvas
  }

  // ── 工具栏 → 画布 ──

  /** 工具栏选择了某个工具 */
  onToolSelected(tool: ToolType): void {
    this._currentTool = tool
    if (this._toolbar) this._toolbar.setActiveTool(tool)
    if (this._canvas) this._canvas.setToolMode(tool)

    // 通知监听者
    for (const fn of this._toolChangeListeners) {
      fn(tool)
    }
  }

  /** 工具栏选择了颜色 */
  onColorSelected(color: string): void {
    for (const fn of this._colorChangeListeners) {
      fn(color)
    }
  }

  // ── 画布 → 属性面板 ──

  /** 画布选中对象发生变化 */
  onSelectionChanged(obj: FabricObject | null): void {
    this._selectedObject = obj
    if (this._propertyPanel) this._propertyPanel.setSelectedObject(obj)

    for (const fn of this._selectionChangeListeners) {
      fn(obj)
    }
  }

  /** undo/redo 状态变更 */
  onUndoRedoStateChanged(canUndo: boolean, canRedo: boolean): void {
    this._canUndo = canUndo
    this._canRedo = canRedo
    if (this._toolbar) this._toolbar.updateUndoRedoState(canUndo, canRedo)
  }

  // ── 保存流程协调 ──

  /** 请求保存 */
  async onSaveRequested(): Promise<void> {
    for (const fn of this._saveRequestListeners) {
      await fn()
    }
  }

  // ── 主题切换 ──

  /** 主题切换 */
  onThemeToggled(): void {
    for (const fn of this._themeToggleListeners) {
      fn()
    }
  }

  // ── 事件订阅 ──

  onToolChange(fn: ToolChangeCallback): void {
    this._toolChangeListeners.push(fn)
  }

  onSelectionChange(fn: SelectionChangeCallback): void {
    this._selectionChangeListeners.push(fn)
  }

  onColorChange(fn: ColorChangeCallback): void {
    this._colorChangeListeners.push(fn)
  }

  onSaveRequest(fn: SaveRequestCallback): void {
    this._saveRequestListeners.push(fn)
  }

  onThemeToggle(fn: ThemeToggleCallback): void {
    this._themeToggleListeners.push(fn)
  }

  // ── 状态查询 ──

  getCurrentTool(): ToolType { return this._currentTool }
  getSelectedObject(): FabricObject | null { return this._selectedObject }
  getCanUndo(): boolean { return this._canUndo }
  getCanRedo(): boolean { return this._canRedo }

  // ── 清理 ──

  destroy(): void {
    this._toolbar = null
    this._propertyPanel = null
    this._canvas = null
    this._toolChangeListeners = []
    this._selectionChangeListeners = []
    this._colorChangeListeners = []
    this._saveRequestListeners = []
    this._themeToggleListeners = []
  }
}
