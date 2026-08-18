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
} from '../postprocessor'
import { THEME_HEX_TO_VAR } from '../../shared/colors'
import type { ThemeMode } from '../../shared/types'

// ═══════════════════════════════════════════════════════════════
// 各处理步骤函数统一定义在 ../postprocessor.ts，此处仅负责按顺序组装 Pipeline
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 管道工厂
// ═══════════════════════════════════════════════════════════════

/** 创建标准后处理管道 */
export function createPostprocessPipeline(
  originalViewBox?: string,
  theme: ThemeMode = 'light'
): Pipeline<string> {
  // 使用「当前主题」的单向 hex→var 映射，避免亮/暗 hex 撞色导致的还原串色
  const hexToVarMap = THEME_HEX_TO_VAR[theme] || THEME_HEX_TO_VAR.light

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
      process: (svg: string) => hexToCssVars(svg, hexToVarMap),
    })
    .use({ name: 'removeCanvasBg', process: removeCanvasBg })

  return pipeline
}
