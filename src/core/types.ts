/**
 * 内核层公共类型定义
 *
 * 所有 src/core/ 模块共享的类型接口，零外部依赖。
 * 设计原则：
 *   - 只定义接口，不引入具体实现（避免循环依赖）
 *   - 所有类型对框架无关（不引用 vue / vitepress）
 *   - I* 前缀表示抽象接口，供 PluginContext 注入使用
 */

import type { Canvas } from 'fabric'
import type { ICommand } from './Command'

/** 解析后的 marker 参数 */
export interface MarkerInfo {
  fill: string
  refX: number
  tipOffset: number
  markerW: number
  markerH: number
}

// ═══════════════════════════════════════════════════════════════
// 基础类型
// ═══════════════════════════════════════════════════════════════

/** 主题模式 */
export type ThemeMode = 'light' | 'dark'

/** SVG 预处理结果 */
export interface SvgLoadResult {
  svg: string
  originalViewBox: string
  svgWidth: number
  svgHeight: number
}

// ═══════════════════════════════════════════════════════════════
// CanvasManager 事件映射
// ═══════════════════════════════════════════════════════════════

export interface CanvasEvents {
  zoomChange: (zoomLevel: number) => void
  selectionChange: () => void
  modified: () => void
  /** viewportTransform 已变化（平移等不改变 zoom 的场景），通知 UI 重新投影手柄等 */
  viewportChange: () => void
}

// ═══════════════════════════════════════════════════════════════
// 抽象接口（供 PluginContext 注入，避免循环 import）
// ═══════════════════════════════════════════════════════════════

/** 事件总线抽象接口 */
export interface IEventBus {
  on<K extends keyof CanvasEvents>(event: K, handler: CanvasEvents[K]): void
  off<K extends keyof CanvasEvents>(event: K, handler: CanvasEvents[K]): void
  emit<K extends keyof CanvasEvents>(event: K, ...args: Parameters<CanvasEvents[K]>): void
}

/** 历史管理器抽象接口 */
export interface IHistoryManager {
  save(canvas: Canvas, beforeSave?: () => void, afterSave?: () => void): void
  undo(canvas: Canvas, afterLoad?: () => void): void
  redo(canvas: Canvas, afterLoad?: () => void): void
  canUndo(): boolean
  canRedo(): boolean
  onStateChange(fn: () => void): void
  reset(): void
}

/** 命令式历史管理器抽象接口（基于 ICommand 模式） */
export interface ICommandHistory {
  execute(cmd: ICommand): void
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
  onStateChange(fn: () => void): void
  reset(): void
}

// ═══════════════════════════════════════════════════════════════
// 插件系统类型
// ═══════════════════════════════════════════════════════════════

/** 插件安装上下文 */
export interface PluginContext {
  canvas: Canvas | null
  eventBus: IEventBus
  historyManager: IHistoryManager
}

/** 编辑器插件接口 */
export interface IEditorPlugin {
  /** 插件唯一标识名 */
  name: string
  /** 安装钩子：在 CanvasManager 初始化后调用 */
  install(context: PluginContext): void
  /** 卸载钩子（可选） */
  uninstall?(): void
}

// ═══════════════════════════════════════════════════════════════
// CanvasManager 初始化选项
// ═══════════════════════════════════════════════════════════════

export interface CanvasManagerOptions {
  width: number
  height: number
  backgroundColor?: string
}

// ═══════════════════════════════════════════════════════════════
// 适配器接口类型
// ═══════════════════════════════════════════════════════════════

/** 保存结果 */
export interface SaveResult {
  success: boolean
  path?: string
  error?: string
}

/** 存储适配器接口 */
export interface IStorageAdapter {
  save(svgText: string, sourcePath: string): Promise<SaveResult>
  load(sourcePath: string): Promise<string>
}

/** 主题适配器接口 */
export interface IThemeAdapter {
  isDark(): boolean
  onChange(callback: (isDark: boolean) => void): void
}
