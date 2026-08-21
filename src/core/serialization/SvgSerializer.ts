/**
 * SVG 序列化器 — 从 Fabric.js Canvas 到干净 SVG 文本
 *
 * 职责：
 *   - 调用 canvas.toSVG() 获取原始输出
 *   - 通过 postprocessPipeline 执行后处理链
 *   - 返回可保存的最终 SVG 文本（永远保存亮色真值，暗色由展示层运行时派生）
 *   - 框架无关（不依赖 Vue / VitePress / DOM）
 *
 * 使用方式：
 *   const serializer = new SvgSerializer()
 *   const cleanSvg = serializer.serialize(canvas, { originalViewBox: '0 0 800 600' })
 */

import type { Canvas } from 'fabric'
import { createPostprocessPipeline } from './pipeline/postprocessPipeline'
import { collectNonSemanticLightMap } from './postprocessor'

export interface SerializeOptions {
  /** 原始 SVG 的 viewBox（如 "0 0 800 600"），用于恢复 */
  originalViewBox?: string
  /** 是否移除 Fabric.js 自动添加的画布背景 rect */
  removeCanvasBg?: boolean
}

export class SvgSerializer {
  /**
   * 从 Fabric.js Canvas 序列化为干净 SVG 字符串
   * @param canvas  — Fabric.js Canvas 实例
   * @param options — 序列化选项
   * @returns 可保存的最终 SVG 文本
   */
  serialize(canvas: Canvas, options: SerializeOptions = {}): string {
    // 非语义色暗→亮归一化：从对象 fillLight/strokeLight 收集「当前暗色 hex → 亮色真值」。
    // 保证落盘 SVG 永远保存亮色真值（暗色由展示层运行时派生）。
    const darkToLightMap = collectNonSemanticLightMap(canvas)

    const svg = canvas.toSVG()

    // 使用 Pipeline 处理链
    const pipeline = createPostprocessPipeline(options.originalViewBox, darkToLightMap)

    // 如果不需要移除画布背景，移除 removeCanvasBg 步骤
    if (options.removeCanvasBg === false) {
      pipeline.remove('removeCanvasBg')
    }

    return pipeline.run(svg).trim()
  }
}
