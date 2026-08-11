/**
 * 渲染适配器接口 — 定义画布渲染引擎的抽象契约
 *
 * 使用者可实现此接口来替换默认的 Fabric.js 渲染引擎，
 * 例如切换为 Konva.js 或原生 SVG DOM 操作。
 */

import type { Canvas } from 'fabric'
import type { SvgLoadResult, ThemeMode } from '../../core/types'

export interface RenderAdapter {
  /** 初始化画布 */
  init(canvasEl: HTMLCanvasElement, width: number, height: number): Canvas | Promise<Canvas>

  /** 加载 SVG 到画布 */
  loadSvg(canvas: Canvas, svgResult: SvgLoadResult): Promise<void>

  /** 序列化画布为 SVG 字符串 */
  serialize(canvas: Canvas, originalViewBox?: string): string

  /** 销毁画布 */
  dispose(canvas: Canvas): void
}
