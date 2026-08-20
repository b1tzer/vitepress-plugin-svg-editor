/**
 * SVG 序列化器 — 从 Fabric.js Canvas 到干净 SVG 文本
 *
 * 职责：
 *   - 调用 canvas.toSVG() 获取原始输出
 *   - 通过 postprocessPipeline 执行后处理链
 *   - 返回可保存的最终 SVG 文本
 *   - 框架无关（不依赖 Vue / VitePress / DOM）
 *
 * 使用方式：
 *   const serializer = new SvgSerializer()
 *   const cleanSvg = serializer.serialize(canvas, { originalViewBox: '0 0 800 600' })
 */

import type { Canvas } from 'fabric'
import { createPostprocessPipeline } from './pipeline/postprocessPipeline'
import { collectSemanticHexToVar, collectNonSemanticLightMap } from './postprocessor'
import type { ThemeMode } from '../shared/types'

export interface SerializeOptions {
  /** 原始 SVG 的 viewBox（如 "0 0 800 600"），用于恢复 */
  originalViewBox?: string
  /** 是否还原 hex → CSS 变量（默认 true） */
  restoreCssVars?: boolean
  /** 是否移除 Fabric.js 自动添加的画布背景 rect */
  removeCanvasBg?: boolean
  /** @deprecated 语义还原已改用对象级语义 ID（不依赖主题），此字段保留仅为兼容旧调用 */
  theme?: ThemeMode
}

export class SvgSerializer {
  /**
   * 从 Fabric.js Canvas 序列化为干净 SVG 字符串
   * @param canvas           — Fabric.js Canvas 实例
   * @param options          — 序列化选项
   * @returns 可保存的最终 SVG 文本
   */
  serialize(canvas: Canvas, options: SerializeOptions = {}): string {
    // 语义化颜色 ID：从画布对象收集「仍保持语义」的 hex→var 精确映射。
    // 只有带 fillVar/strokeVar 且颜色未被用户改动的对象才会被还原成 var()，
    // 其余（用户自定义色、无语义裸 hex）保留 hex，避免全局表撞色与猜语义。
    const semanticHexToVar = collectSemanticHexToVar(canvas)

    // 非语义色暗→亮归一化：从对象 fillLight/strokeLight 收集「当前暗色 hex → 亮色真值」。
    // 保证落盘 SVG 永远保存亮色真值（暗色由展示层运行时派生），不再依赖 useTheme 的运行时缓存。
    const darkToLightMap = collectNonSemanticLightMap(canvas)

    const svg = canvas.toSVG()

    // 使用 Pipeline 处理链
    const pipeline = createPostprocessPipeline(
      options.originalViewBox,
      semanticHexToVar,
      darkToLightMap
    )

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
