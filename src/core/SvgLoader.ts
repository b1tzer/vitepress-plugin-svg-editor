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

/** 安全配置 */
const SECURITY = {
  /** 最大 SVG 文件大小（字节），超过此大小的文件将被拒绝 */
  maxFileSize: 10 * 1024 * 1024, // 10MB
}

/**
 * 移除 SVG 中的危险内容：
 *   - <script> 标签及其内容
 *   - 事件处理器属性（onclick, onload 等）
 *   - CSS @import url() 外部资源引用
 */
function sanitizeSvg(svg: string): string {
  let s = svg
  // 移除 <script>...</script> 标签
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  // 移除内联事件处理器
  s = s.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '')
  s = s.replace(/\s+on\w+\s*=\s*'[^']*'/gi, '')
  // 移除 CSS @import 外部引用
  s = s.replace(/@import\s+url\s*\([^)]*\)\s*;?/gi, '')
  return s
}

export class SvgLoader {
  /**
   * 加载并预处理 SVG 文本
   * @param rawSvg  — 原始 SVG 字符串（可含 <?xml> 声明）
   * @param theme   — 目标主题模式（决定 CSS 变量映射到哪套 hex）
   * @returns 标准化结果，包含预处理后的 SVG、原始 viewBox、宽高
   */
  load(rawSvg: string, theme: ThemeMode = 'light'): SvgLoadResult {
    // 🔒 安全校验：拒绝超大文件
    if (rawSvg.length > SECURITY.maxFileSize) {
      throw new Error(
        `SVG 文件过大（${(rawSvg.length / 1024 / 1024).toFixed(1)}MB），超过上限 ` +
        `${SECURITY.maxFileSize / 1024 / 1024}MB。请检查文件是否包含过多数据。`
      )
    }
    // 🔒 安全清洗：移除 XSS / CSS 注入向量
    const cleaned = sanitizeSvg(rawSvg)
    return preprocessSvg(cleaned, theme)
  }
}
