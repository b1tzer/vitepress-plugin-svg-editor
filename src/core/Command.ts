/**
 * 命令模式 — 将用户操作封装为可撤销/重做的 Command 对象
 *
 * 设计目标：
 *   - 替代 HistoryManager 中的 canvas.toJSON() 完整快照，降低内存开销
 *   - 每个 Command 独立管理自己的 execute/undo 逻辑
 *   - 与 HistoryManager（Memento 模式）并行存在，可渐进替换
 *
 * 使用方式：
 *   const cmd = new MoveCommand(obj, 10, 20)
 *   history.execute(cmd)   // 执行并记录
 *   history.undo()         // 撤销最后一个命令
 */

import type { FabricObject } from 'fabric'

/**
 * 命令接口 — 所有编辑器操作都必须实现此接口
 */
export interface ICommand {
  /** 执行命令 */
  execute(): void
  /** 撤销命令（恢复到执行前状态） */
  undo(): void
  /** 用于 UI 展示的命令描述 */
  getLabel(): string
}

// ═══════════════════════════════════════════════════════════════
// MoveCommand — 移动对象
// ═══════════════════════════════════════════════════════════════

export class MoveCommand implements ICommand {
  private _obj: FabricObject
  private _dx: number
  private _dy: number

  /**
   * @param obj 要移动的 Fabric 对象
   * @param dx  水平位移量
   * @param dy  垂直位移量
   */
  constructor(obj: FabricObject, dx: number, dy: number) {
    this._obj = obj
    this._dx = dx
    this._dy = dy
  }

  execute(): void {
    this._obj.set({
      left: (this._obj.left || 0) + this._dx,
      top: (this._obj.top || 0) + this._dy,
    })
    this._obj.setCoords()
  }

  undo(): void {
    this._obj.set({
      left: (this._obj.left || 0) - this._dx,
      top: (this._obj.top || 0) - this._dy,
    })
    this._obj.setCoords()
  }

  getLabel(): string {
    return `移动 ${this._getTypeName()}`
  }

  private _getTypeName(): string {
    const typeMap: Record<string, string> = {
      rect: '矩形', circle: '圆形', triangle: '三角形',
      ellipse: '椭圆', line: '线条', path: '路径',
      'i-text': '文本', text: '文本', textbox: '文本框',
      group: '组合',
    }
    return typeMap[this._obj.type || ''] || this._obj.type || '元素'
  }
}

// ═══════════════════════════════════════════════════════════════
// ResizeCommand — 缩放/调整对象尺寸
// ═══════════════════════════════════════════════════════════════

export class ResizeCommand implements ICommand {
  private _obj: FabricObject
  private _oldLeft: number
  private _oldTop: number
  private _oldScaleX: number
  private _oldScaleY: number
  private _oldWidth: number
  private _oldHeight: number
  private _newLeft: number
  private _newTop: number
  private _newScaleX: number
  private _newScaleY: number
  private _newWidth: number
  private _newHeight: number

  constructor(
    obj: FabricObject,
    oldState: { left: number; top: number; scaleX: number; scaleY: number; width: number; height: number },
    newState: { left: number; top: number; scaleX: number; scaleY: number; width: number; height: number },
  ) {
    this._obj = obj
    this._oldLeft = oldState.left
    this._oldTop = oldState.top
    this._oldScaleX = oldState.scaleX
    this._oldScaleY = oldState.scaleY
    this._oldWidth = oldState.width
    this._oldHeight = oldState.height
    this._newLeft = newState.left
    this._newTop = newState.top
    this._newScaleX = newState.scaleX
    this._newScaleY = newState.scaleY
    this._newWidth = newState.width
    this._newHeight = newState.height
  }

  execute(): void {
    this._apply(this._newLeft, this._newTop, this._newScaleX, this._newScaleY, this._newWidth, this._newHeight)
  }

  undo(): void {
    this._apply(this._oldLeft, this._oldTop, this._oldScaleX, this._oldScaleY, this._oldWidth, this._oldHeight)
  }

  getLabel(): string {
    return '缩放元素'
  }

  private _apply(left: number, top: number, sx: number, sy: number, w: number, h: number): void {
    this._obj.set({ left, top, scaleX: sx, scaleY: sy, width: w, height: h })
    this._obj.setCoords()
  }
}

// ═══════════════════════════════════════════════════════════════
// PropertyChangeCommand — 修改对象样式属性（颜色/透明度/字体等）
// ═══════════════════════════════════════════════════════════════

export class PropertyChangeCommand implements ICommand {
  private _obj: FabricObject
  private _oldProps: Record<string, any>
  private _newProps: Record<string, any>

  /**
   * @param obj      目标 Fabric 对象
   * @param oldProps 修改前的属性集合
   * @param newProps 修改后的属性集合
   */
  constructor(obj: FabricObject, oldProps: Record<string, any>, newProps: Record<string, any>) {
    this._obj = obj
    this._oldProps = { ...oldProps }
    this._newProps = { ...newProps }
  }

  execute(): void {
    this._obj.set(this._newProps)
    this._obj.setCoords()
  }

  undo(): void {
    this._obj.set(this._oldProps)
    this._obj.setCoords()
  }

  getLabel(): string {
    // 从属性名推断操作描述
    const keys = Object.keys(this._newProps)
    if (keys.includes('fill')) return '修改填充色'
    if (keys.includes('stroke')) return '修改边框色'
    if (keys.includes('fontSize')) return '修改字号'
    if (keys.includes('fontWeight')) return '修改字重'
    if (keys.includes('opacity')) return '修改透明度'
    return `修改属性 (${keys.join(', ')})`
  }
}
