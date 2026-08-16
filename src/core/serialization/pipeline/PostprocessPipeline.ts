/**
 * 后处理管道 — 组装 SVG 后处理步骤（Group展开、rgb→hex、hex→CSS变量等）
 *
 * 使用 Pipeline 责任链模式，替代原来硬编码的 SvgSerializer.serialize 中的步骤顺序。
 */

// @ts-nocheck — String.replace 回调参数因正则动态性无法严格类型化

import { Pipeline } from './Pipeline'
import {
  cleanFabricSvg,
  rgbToHex,
  hexToCssVars,
  restoreViewBox,
  removeCanvasBg,
} from '../postprocessor'

// ═══════════════════════════════════════════════════════════════
// 各处理步骤函数统一定义在 ../postprocessor.ts，此处仅负责按顺序组装 Pipeline
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 管道工厂
// ═══════════════════════════════════════════════════════════════

/** 创建标准后处理管道 */
export function createPostprocessPipeline(originalViewBox?: string): Pipeline<string> {
  const pipeline = new Pipeline<string>()
    .use({ name: 'rgbToHex', process: rgbToHex })
    .use({ name: 'cleanFabricSvg', process: cleanFabricSvg })

  if (originalViewBox) {
    pipeline.use({ name: 'restoreViewBox', process: (svg: string) => restoreViewBox(svg, originalViewBox) })
  }

  pipeline
    .use({ name: 'hexToCssVars', process: hexToCssVars })
    .use({ name: 'removeCanvasBg', process: removeCanvasBg })

  return pipeline
}