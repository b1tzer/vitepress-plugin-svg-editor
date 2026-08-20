/**
 * SVG 展示层暗色派生模块 — 框架无关的纯函数
 *
 * 职责：让「保存时强制存亮色真值」的 SVG 在页面切换暗色模式时，
 * 通过运行时派生暗色，实现「编辑器所见 = 页面所得」的闭环。
 *
 * 与编辑器内 useTheme 的区别：
 *   - 编辑器：遍历 Fabric 对象，双向明暗切换（用户可在任意主题下编辑）
 *   - 展示层：遍历 SVG DOM，单向派生（文件永远是亮色真值，暗色由运行时生成）
 *
 * 颜色处理分轨（与保存侧对称）：
 *   - var(--diagram-*) → 跳过，交给已注入的 diagram-vars.css 随 .dark 自动切换
 *   - 裸 hex → 命中语义色板走 LIGHT_TO_DARK 精确映射，未命中走 OKLCH 亮度翻转
 *
 * 关键设计：收集阶段记录「原始亮色值」，应用阶段按主题写回原始值或派生暗色值，
 * 因此切回亮色时直接恢复原始值，无需反向计算，也无需记忆化往返缓存。
 */

import { THEME_VAR_TO_HEX, resolveCssVarsToHex, lightHexToDark } from './colors'

/** 6 位 hex（#RRGGBB，大小写不敏感） */
const HEX_COLOR_RE = /^#([0-9a-f]{6})$/i

/**
 * 纯算法模式专用：把 SVG 中的 var(--diagram-*) 解析为亮色 hex（不保留语义 ID）。
 *
 * 展示层直接 v-html 渲染原始 SVG，`var()` 会被浏览器交给 CSS 变量切换；
 * 纯算法模式要「忽略变量、只走 OKLCH」，必须先在此把 var() 换成亮色 hex，
 * 后续 collectSvgColorEntries 才能收集这些 hex 并做 OKLCH 亮度翻转。
 * 带 fallback 的外部变量（如 var(--vp-c-brand-1, #2563eb)）取 fallback。
 */
export function resolveVarsToLightHex(svg: string): string {
  return resolveCssVarsToHex(svg, THEME_VAR_TO_HEX.light)
}

/** 需要跳过、交由 CSS/浏览器处理的颜色值 */
function isProcessableColor(value: string): boolean {
  if (!value) return false
  const v = value.trim()
  if (!v) return false
  if (v.includes('var(')) return false // 语义变量 → CSS 自动切换
  if (v.includes('url(')) return false // 渐变/图案引用
  if (v === 'none' || v === 'transparent' || v === 'currentColor' || v === 'inherit') return false
  return HEX_COLOR_RE.test(v)
}

/** 单个颜色入口：记录原始亮色值 + 派生暗色值 + 写回函数（闭包） */
export interface SvgColorEntry {
  /** 原始亮色真值（切回亮色时恢复） */
  original: string
  /** 派生暗色值（切暗色时写入） */
  dark: string
  /** 写回函数：把给定值写到元素对应位置 */
  apply: (value: string) => void
}

/** 支持处理的可变颜色通道（含渐变 stop 的 stop-color） */
const COLOR_PROPS = ['fill', 'stroke', 'stop-color'] as const

/**
 * 从 inline style 原始字符串中提取 fill/stroke/stop-color 的 hex 值
 *
 * 必须读 `getAttribute('style')` 的原始字符串而非 `el.style.getPropertyValue`，
 * 因为真实浏览器会把 `#FFFFFF` 规范化为 `rgb(255, 255, 255)`，导致 hex 正则
 * 匹配失败、颜色被漏收集（happy-dom 无此规范化，单测无法暴露该差异）。
 *
 * @returns prop → hex 映射（同一 prop 出现多次取第一个）
 */
function collectStyleColors(styleAttr: string): Map<string, string> {
  const map = new Map<string, string>()
  // 精确匹配 fill/stroke/stop-color 后紧跟冒号（排除 fill-rule/stroke-width 等）
  const re = /(fill|stroke|stop-color)\s*:\s*(#[0-9a-fA-F]{6})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(styleAttr)) !== null) {
    if (!map.has(m[1])) {
      map.set(m[1], m[2])
    }
  }
  return map
}

/**
 * 收集 SVG DOM 中所有可处理的裸 hex 颜色入口
 *
 * 每个通道（fill/stroke/stop-color）优先取 inline style（CSS 层叠优先级更高），
 * 若 style 无该颜色再回退到同名属性，避免重复收集与优先级错乱。
 *
 * @param root 包含 <svg> 的容器元素（或 <svg> 自身）
 */
export function collectSvgColorEntries(root: Element, algorithmOnly = false): SvgColorEntry[] {
  const entries: SvgColorEntry[] = []
  const elements = root.querySelectorAll('*')
  elements.forEach((el) => {
    const svgEl = el as SVGElement
    const styleAttr = el.getAttribute('style')
    const styleColors = styleAttr ? collectStyleColors(styleAttr) : new Map<string, string>()

    // style 来源
    for (const [prop, hex] of styleColors) {
      entries.push(makeEntry(svgEl, 'style', prop, hex, algorithmOnly))
    }

    // 属性来源：仅当 style 中无该 prop 时回退
    for (const prop of COLOR_PROPS) {
      if (styleColors.has(prop)) continue
      const attr = el.getAttribute(prop)
      if (attr && isProcessableColor(attr)) {
        entries.push(makeEntry(svgEl, 'attr', prop, attr.trim(), algorithmOnly))
      }
    }
  })
  return entries
}

/** 构造颜色入口：根据来源（style 或 attr）生成对应写回函数 */
function makeEntry(
  el: SVGElement,
  kind: 'style' | 'attr',
  prop: string,
  original: string,
  algorithmOnly = false
): SvgColorEntry {
  return {
    original,
    dark: lightHexToDark(original, algorithmOnly),
    apply(value: string) {
      if (kind === 'style') {
        el.style.setProperty(prop, value)
      } else {
        el.setAttribute(prop, value)
      }
    },
  }
}

/**
 * 按主题应用颜色：暗色写入派生暗色值，亮色恢复原始亮色值
 *
 * @param entries 收集到的颜色入口
 * @param isDark  当前是否为暗色模式
 */
export function applySvgTheme(entries: SvgColorEntry[], isDark: boolean): void {
  for (const entry of entries) {
    entry.apply(isDark ? entry.dark : entry.original)
  }
}
