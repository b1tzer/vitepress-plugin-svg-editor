/**
 * SVG 序列化器 — 从 Fabric.js Canvas 到干净 SVG 文本
 *
 * 职责：
 *   - 调用 canvas.toSVG() 获取原始输出
 *   - 执行后处理链：展开 Group → rgb→hex → hex→CSS变量 → 恢复viewBox → 清理冗余
 *   - 返回可保存的最终 SVG 文本
 *   - 框架无关（不依赖 Vue / VitePress / DOM）
 *
 * 使用方式：
 *   const serializer = new SvgSerializer()
 *   const cleanSvg = serializer.serialize(canvas, originalViewBox)
 */

import type { Canvas } from 'fabric'
import {
  cleanFabricSvg,
  rgbToHex,
  hexToCssVars,
  restoreViewBox,
  removeCanvasBg,
} from './postprocessor'

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
   * @param originalViewBox  — 原始 viewBox 值（如 "0 0 800 600"），用于恢复
   * @returns 可保存的最终 SVG 文本
   */
  serialize(canvas: Canvas, options: SerializeOptions = {}): string {
    let svg = canvas.toSVG()

    // 处理链：顺序重要
    svg = rgbToHex(svg)
    svg = cleanFabricSvg(svg)

    if (options.originalViewBox) {
      svg = restoreViewBox(svg, options.originalViewBox)
    }

    if (options.restoreCssVars !== false) {
      svg = hexToCssVars(svg)
    }

    if (options.removeCanvasBg !== false) {
      svg = removeCanvasBg(svg)
    }

    return svg.trim()
  }
}
