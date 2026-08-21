/**
 * 后处理管道 — 组装 SVG 后处理步骤（Group展开、rgb→hex、hex→CSS变量等）
 *
 * 使用 Pipeline 责任链模式，替代原来硬编码的 SvgSerializer.serialize 中的步骤顺序。
 */

import { Pipeline } from './Pipeline'
import {
  cleanFabricSvg,
  rgbToHex,
  restoreViewBox,
  removeCanvasBg,
  normalizeNonSemanticToLight,
} from '../postprocessor'

// ═══════════════════════════════════════════════════════════════
// 各处理步骤函数统一定义在 ../postprocessor.ts，此处仅负责按顺序组装 Pipeline
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 管道工厂
// ═══════════════════════════════════════════════════════════════

/** 创建标准后处理管道 */
export function createPostprocessPipeline(
  originalViewBox?: string,
  darkToLightMap?: Map<string, string>
): Pipeline<string> {
  const pipeline = new Pipeline<string>()
    .use({ name: 'rgbToHex', process: rgbToHex })
    .use({ name: 'cleanFabricSvg', process: cleanFabricSvg })

  if (originalViewBox) {
    pipeline.use({
      name: 'restoreViewBox',
      process: (svg: string) => restoreViewBox(svg, originalViewBox),
    })
  }

  // 非语义色暗→亮归一化（保存时强制存亮色真值）。
  if (darkToLightMap && darkToLightMap.size > 0) {
    pipeline.use({
      name: 'normalizeNonSemanticToLight',
      process: (svg: string) => normalizeNonSemanticToLight(svg, darkToLightMap),
    })
  }

  pipeline.use({ name: 'removeCanvasBg', process: removeCanvasBg })

  return pipeline
}
