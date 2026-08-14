/**
 * SVG 序列化器 — 从 Fabric.js Canvas 到干净 SVG 文本
 *
 * 职责：
 *   - 调用 canvas.toSVG() 获取原始输出
 *   - 通过 PostprocessPipeline 执行后处理链
 *   - 返回可保存的最终 SVG 文本
 *   - 框架无关（不依赖 Vue / VitePress / DOM）
 *
 * 使用方式：
 *   const serializer = new SvgSerializer()
 *   const cleanSvg = serializer.serialize(canvas, { originalViewBox: '0 0 800 600' })
 */

import type { Canvas } from 'fabric'
import { createPostprocessPipeline } from './pipeline/PostprocessPipeline'

export interface SerializeOptions {
  /** 原始 SVG 的 viewBox（如 "0 0 800 600"），用于恢复 */
  originalViewBox?: string
  /** 是否还原 hex → CSS 变量（默认 true） */
  restoreCssVars?: boolean
  /** 是否移除 Fabric.js 自动添加的画布背景 rect */
  removeCanvasBg?: boolean
}

export class SvgSerializer {
  /**
   * 从 Fabric.js Canvas 序列化为干净 SVG 字符串
   * @param canvas           — Fabric.js Canvas 实例
   * @param options          — 序列化选项
   * @returns 可保存的最终 SVG 文本
   */
  serialize(canvas: Canvas, options: SerializeOptions = {}): string {
    const svg = canvas.toSVG()

    // 使用 Pipeline 处理链
    const pipeline = createPostprocessPipeline(options.originalViewBox)

    // 如果不需要 CSS 变量还原，移除 hexToCssVars 步骤
    if (options.restoreCssVars === false) {
      pipeline.remove('hexToCssVars')
    }

    // 如果不需要移除画布背景，移除 removeCanvasBg 步骤
    if (options.removeCanvasBg === false) {
      pipeline.remove('removeCanvasBg')
    }

    return pipeline.run(svg).trim()
  }
}
