/**
 * SVG 加载器 — 从原始 SVG 文本到可用于 Canvas 的数据
 *
 * 职责：
 *   - 封装预处理链（CSS 变量 → hex、marker → polygon、清洗非法属性）
 *   - 返回标准化结果，供 CanvasManager 消费
 *   - 框架无关（不依赖 Vue / VitePress；清洗依赖 DOMPurify，需 DOM 环境）
 *
 * 使用方式：
 *   const loader = new SvgLoader()
 *   const result = loader.load(rawSvgText, 'light')
 *   canvasMgr.loadSvgFromString(result.svg)
 */

import { preprocessSvg } from './preprocessor'
import type { SvgLoadResult, SvgPreprocessOptions, ThemeMode } from '../shared/types'
import DOMPurify from 'dompurify'

/** 安全配置 */
const SECURITY = {
  /** 最大 SVG 文件大小（字节），超过此大小的文件将被拒绝 */
  maxFileSize: 10 * 1024 * 1024, // 10MB
}

/**
 * 移除 SVG 中的危险内容。
 *
 * 基于 DOMPurify（Cure53 维护）做白名单清洗，替代早期的手写正则。
 * 正则无法覆盖 javascript:/data: URL、<foreignObject> 内嵌 HTML、
 * 无引号/大小写/编码混淆的事件属性等注入向量；DOMPurify 通过浏览器
 * 原生 DOM 解析 + 白名单机制，能可靠拦截这些攻击面。
 *
 * 配置说明：
 *   - USE_PROFILES: { svg: true, svgFilters: true } 仅保留安全 SVG 元素
 *     与 SVG 滤镜，不保留 HTML / MathML，避免 <foreignObject> 内嵌 HTML。
 *   - 默认配置即会移除 <script>、on* 事件属性、javascript: 伪协议、
 *     以及 CSS 中的 @import 外部引用。
 */
function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
  })
}

export class SvgLoader {
  /**
   * 加载并预处理 SVG 文本
   * @param rawSvg  — 原始 SVG 字符串（可含 <?xml> 声明）
   * @param theme   — 目标主题模式（决定 CSS 变量映射到哪套 hex）
   * @returns 标准化结果，包含预处理后的 SVG、原始 viewBox、宽高
   */
  load(
    rawSvg: string,
    theme: ThemeMode = 'light',
    options: SvgPreprocessOptions = {}
  ): SvgLoadResult {
    // 🔒 安全校验：拒绝超大文件
    if (rawSvg.length > SECURITY.maxFileSize) {
      throw new Error(
        `SVG 文件过大（${(rawSvg.length / 1024 / 1024).toFixed(1)}MB），超过上限 ` +
          `${SECURITY.maxFileSize / 1024 / 1024}MB。请检查文件是否包含过多数据。`
      )
    }
    // 🔒 安全清洗：移除 XSS / CSS 注入向量
    const cleaned = sanitizeSvg(rawSvg)
    return preprocessSvg(cleaned, theme, options)
  }

  /**
   * 从 URL 拉取并加载 SVG（封装 fetch + 清洗 + 预处理，issue #19 P1）
   * @param url   目标 SVG 地址（相对或绝对）
   * @param theme 目标主题模式
   * @returns 标准化结果；HTTP 非 2xx 时抛出错误
   */
  async loadFromUrl(
    url: string,
    theme: ThemeMode = 'light',
    options: SvgPreprocessOptions = {}
  ): Promise<SvgLoadResult> {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const rawSvg = await resp.text()
    return this.load(rawSvg, theme, options)
  }
}
