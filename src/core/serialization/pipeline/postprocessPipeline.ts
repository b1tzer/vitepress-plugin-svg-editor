/**
 * 后处理管道 — 组装 SVG 后处理步骤（Group展开、rgb→hex、hex→CSS变量等）
 *
 * 使用 Pipeline 责任链模式，替代原来硬编码的 SvgSerializer.serialize 中的步骤顺序。
 */

import { Pipeline } from './Pipeline'
import {
  cleanFabricSvg,
  rgbToHex,
  hexToCssVars,
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
  semanticHexToVar: Record<string, string> = {},
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

  pipeline
    .use({
      name: 'hexToCssVars',
      // 语义化颜色 ID：仅用「对象级精确映射」还原，未命中则保留 hex（不猜语义）
      process: (svg: string) => hexToCssVars(svg, semanticHexToVar),
    })

  // 非语义色暗→亮归一化（保存时强制存亮色真值）。
  // 必须在 hexToCssVars 之后执行，避免与语义色 var() 还原产生撞色歧义。
  if (darkToLightMap && darkToLightMap.size > 0) {
    pipeline.use({
      name: 'normalizeNonSemanticToLight',
      process: (svg: string) => normalizeNonSemanticToLight(svg, darkToLightMap),
    })
  }

  pipeline.use({ name: 'removeCanvasBg', process: removeCanvasBg })

  return pipeline
}
