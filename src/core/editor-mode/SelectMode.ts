/**
 * 选择模式 — 默认编辑器交互模式
 *
 * 职责：
 *   - 点击选中对象
 *   - 拖拽移动对象
 *   - 框选多个对象
 *   - 恢复默认光标和 selection 行为
 */

import type { Canvas } from 'fabric'
import type { IEditorMode } from './EditorMode'

export class SelectMode implements IEditorMode {
  readonly name = 'select'

  onEnter(canvas: Canvas): void {
    canvas.selection = true
    canvas.setCursor('default')
  }

  onExit(_canvas: Canvas): void {
    // SelectMode 是默认模式，退出时不需要特殊清理
  }

  onMouseDown(_e: MouseEvent, _canvas: Canvas): void {
    // Fabric.js 内置的选择和拖拽行为已通过 canvas.selection=true 启用
    // 无需额外处理
  }

  onMouseMove(_e: MouseEvent, _canvas: Canvas): void {
    // Fabric.js 内置
  }

  onMouseUp(_e: MouseEvent, _canvas: Canvas): void {
    // Fabric.js 内置
  }
}
