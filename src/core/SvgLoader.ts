/**
 * SVG 加载器 — 从原始 SVG 文本到可用于 Canvas 的数据
 *
 * 职责：
 *   - 封装预处理链（CSS 变量 → hex、marker → polygon、清洗非法属性）
 *   - 返回标准化结果，供 CanvasManager 消费
 *   - 框架无关（不依赖 Vue / VitePress / DOM）
 *
 * 使用方式：
 *   const loader = new SvgLoader()
 *   const result = loader.load(rawSvgText, 'light')
 *   canvasMgr.loadSvgFromString(result.svg)
 */

import { preprocessSvg } from './preprocessor'
import type { SvgLoadResult, ThemeMode } from './types'

export class SvgLoader {
  /**
   * 加载并预处理 SVG 文本
   * @param rawSvg  — 原始 SVG 字符串（可含 <?xml> 声明）
   * @param theme   — 目标主题模式（决定 CSS 变量映射到哪套 hex）
   * @returns 标准化结果，包含预处理后的 SVG、原始 viewBox、宽高
   */
  load(rawSvg: string, theme: ThemeMode = 'light'): SvgLoadResult {
    return preprocessSvg(rawSvg, theme)
  }
}
