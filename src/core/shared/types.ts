/**
 * 内核层公共类型定义
 *
 * 所有 src/core/ 模块共享的类型接口，零外部依赖。
 * 设计原则：
 *   - 只定义接口，不引入具体实现（避免循环依赖）
 *   - 所有类型对框架无关（不引用 vue / vitepress）
 *   - I* 前缀表示抽象接口
 */

import type { Canvas } from 'fabric'
import type { ICommand } from '../history/Command'

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

/** SVG 预处理选项（preprocessSvg / SvgLoader 共用） */
export interface SvgPreprocessOptions {
  /**
   * 是否开启「hex 精确匹配 → 语义 token」（第二步能力，默认 false）。
   *
   * 开启后，对色板中「精确命中」的裸 hex（fill/stroke）自动打上语义标记，
   * 使普通 hex SVG 也能获得明暗自适应能力；跨主题撞色 hex 会被跳过。
   * 只做精确匹配，绝不做近似匹配（避免猜错色）。
   */
  mapHexToVar?: boolean
}

// ═══════════════════════════════════════════════════════════════
// CanvasManager 事件映射
// ═══════════════════════════════════════════════════════════════

export interface CanvasEvents {
  zoomChange: (zoomLevel: number) => void
  selectionChange: () => void
  /** 对象交互修改完成（拖拽/缩放/旋转松手）。单对象变换时携带增量 Command，否则为 undefined（回退全量快照） */
  modified: (command?: ICommand) => void
  /** viewportTransform 已变化（平移等不改变 zoom 的场景），通知 UI 重新投影手柄等 */
  viewportChange: () => void
}

// ═══════════════════════════════════════════════════════════════
// 抽象接口（避免循环 import）
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
  offStateChange(fn: () => void): void
  reset(): void
}

// ═══════════════════════════════════════════════════════════════
// CanvasManager 初始化选项
// ═══════════════════════════════════════════════════════════════

export interface CanvasManagerOptions {
  width: number
  height: number
  backgroundColor?: string
}
