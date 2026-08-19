/**
 * SVG 预处理模块 — 将原始 SVG 转为 Fabric.js 可渲染格式
 *
 * 处理链：
 *   1. CSS 变量 → hex 色值
 *   2. <stop style="stop-color:..."> → 直接属性
 *   3. <marker> 解析 → 合成 <polygon> 箭头
 *   4. 提取 viewBox / 宽高
 */

import { THEME_VAR_TO_HEX, UNIQUE_HEX_TO_VAR } from '../shared/colors'
import { SVG_FILL_VAR_ATTR, SVG_STROKE_VAR_ATTR } from '../shared/fabricTypes'
import type { ThemeMode, SvgLoadResult, SvgPreprocessOptions, MarkerInfo } from '../shared/types'

/**
 * 用 DOMParser 将 SVG 解析为 DOM 文档（仅用于只读结构化信息提取）
 *
 * - 返回 null 表示当前环境无 DOMParser 或解析失败（含 <parsererror>）
 * - 不用于整体序列化回字符串，避免破坏原始输出格式与 Fabric 解析行为
 */
function parseSvgDom(svg: string): Document | null {
  if (typeof DOMParser === 'undefined') return null
  try {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
    if (doc.querySelector('parsererror')) return null
    return doc
  } catch {
    return null
  }
}

/**
 * 将 CSS 变量替换为 hex 色值
 *
 * 处理两类变量：
 *   1. 主题映射表内的变量（--diagram-* 系列）→ 按主题替换为对应 hex
 *   2. 带 fallback 的外部变量（如 VitePress 的 var(--vp-c-brand-1, #2563eb)）→ 取 fallback 值
 *
 * 第 2 类变量不在主题映射表中（其实际值取决于 VitePress 运行时主题），
 * 但 SVG 作者已显式提供 fallback 兜底色，直接取 fallback 即可。
 * 若不处理，var() 字符串会被 Fabric 当作非法颜色，渲染为透明。
 */
function replaceCssVars(svg: string, theme: ThemeMode = 'light'): string {
  const mapping = THEME_VAR_TO_HEX[theme] || THEME_VAR_TO_HEX.light
  let result = svg
  // 1. 替换已知主题变量（--diagram-* 系列）
  //    语义化颜色 ID：在 fill/stroke 属性上同时打上 data-fill-var / data-stroke-var 标记，
  //    供 SvgObjectMounter 的 reviver 挂载到 Fabric 对象（身份 = 变量名，而非 hex）。
  for (const [varName, hex] of Object.entries(mapping)) {
    // fill 属性：保留变量名标记
    result = result.replaceAll(
      `fill="var(${varName})"`,
      `fill="${hex}" ${SVG_FILL_VAR_ATTR}="${varName}"`
    )
    // stroke 属性：保留变量名标记
    result = result.replaceAll(
      `stroke="var(${varName})"`,
      `stroke="${hex}" ${SVG_STROKE_VAR_ATTR}="${varName}"`
    )
    // 兜底：其余形式（style 内联、stop-color 等）仅替换 hex，不带标记
    result = result.replaceAll(`var(${varName})`, hex)
  }
  // 2. 处理带 fallback 的 var(--xxx, fallback)，例如 var(--vp-c-brand-1, #2563eb) → #2563eb
  //    注意必须在步骤 1 之后执行，避免误匹配已替换的 --diagram-* 变量
  result = result.replace(/var\(--[^,)]+,\s*([^)]+)\)/g, (_full, fallback: string) =>
    fallback.trim()
  )
  return result
}

/**
 * 第二步能力（可选）：hex 精确匹配 → 语义 token
 *
 * 对「色板中精确命中」的裸 hex 打上语义标记，使普通 hex SVG 也能获得明暗能力。
 * 约束（严格遵循用户方案，绝不做近似匹配）：
 *   - 只匹配 6 位 hex（#RRGGBB）
 *   - 必须精确命中「明暗两套色板的无歧义并集」（UNIQUE_HEX_TO_VAR）
 *   - 跨主题撞色 hex 已在 UNIQUE_HEX_TO_VAR 中剔除，避免歧义
 *
 * 不依赖当前主题：一个写死色板色的 hex 无论当前明暗主题，只要在明/暗任一
 * 主题中无歧义地命中某变量，都会被识别并升级。
 */
function mapHexToVar(svg: string): string {
  const hexToVar = UNIQUE_HEX_TO_VAR
  let result = svg

  // fill 属性精确匹配（避免把已带 data-fill-var 标记的重复处理）
  result = result.replace(
    /fill="(#[0-9A-Fa-f]{6})"/g,
    (full: string, hex: string) => {
      const varName = hexToVar[hex.toUpperCase()]
      if (varName) {
        return `fill="${hex}" ${SVG_FILL_VAR_ATTR}="${varName}"`
      }
      return full
    }
  )

  // stroke 属性精确匹配
  result = result.replace(
    /stroke="(#[0-9A-Fa-f]{6})"/g,
    (full: string, hex: string) => {
      const varName = hexToVar[hex.toUpperCase()]
      if (varName) {
        return `stroke="${hex}" ${SVG_STROKE_VAR_ATTR}="${varName}"`
      }
      return full
    }
  )

  return result
}

/**
 * 将 <stop style="stop-color:..."> 转为直接属性
 * Fabric.js 解析器对 style 属性中的 stop-color 支持有限
 */
function fixStopColors(svg: string): string {
  return svg.replace(
    /<stop(\s[^>]*?)style="stop-color:\s*([^;"]+);\s*stop-opacity:\s*([^"]+)"([^>]*?)>/g,
    '<stop$1stop-color="$2" stop-opacity="$3"$4>'
  )
}

/**
 * 移除设计工具（Figma / Fabric 导出）生成的无用背景/占位 rect：
 *   - 全画布背景占位：width 与 height 均为 "100%"
 *   - fill="transparent" / fill="none" 的不可见占位（无可见描边）
 *   - style 中 stroke:none 且 fill-opacity≈0 的不可见占位
 *
 * 背景：这些 rect 是设计工具为「透明画布 / 命中区域」生成的占位元素。
 * Fabric.js 无法正确解析 width="100%" 这类百分比尺寸（会被 parseFloat 截断为 100px），
 * 且它们在 SvgEditor 中被 ensureInteractive 转成 selectable 后，会变成可拖拽的
 * 「幽灵」背景对象，干扰画布背景交互。编辑器已由 workspace Rect 统一提供背景，
 * 因此在此直接剔除这些冗余占位。
 */
function removeBackgroundRects(svg: string): string {
  let result = svg

  // 1) 全画布背景占位：width / height 均为 100%（兼容自闭合与成对标签）
  result = result.replace(
    /<rect\b(?=[^>]*\bwidth\s*=\s*"100%")(?=[^>]*\bheight\s*=\s*"100%")[^>]*?\/?>\s*(?:<\/rect>)?/gi,
    ''
  )

  // 2) fill 属性为 transparent / none 的不可见占位（排除带可见描边的形状）
  result = result.replace(
    /<rect\b(?=[^>]*\bfill\s*=\s*"(?:transparent|none)")(?![^>]*\bstroke\s*=\s*"(?!none)[^"]*")[^>]*?\/?>\s*(?:<\/rect>)?/gi,
    ''
  )

  // 3) style 中 stroke:none 且 fill-opacity 精确为 0（含 0.0）的不可见占位
  //    用 (?![.\d]) 防止把 fill-opacity:0.5 / 0.02 等可见透明度误判为 0 而误删
  result = result.replace(
    /<rect\b(?=[^>]*style\s*=\s*"[^"]*stroke\s*:\s*none[^"]*")(?=[^>]*style\s*=\s*"[^"]*fill-opacity\s*:\s*0(?:\.0+)?(?![.\d])[^"]*")[^>]*?\/?>\s*(?:<\/rect>)?/gi,
    ''
  )

  return result
}

/**
 * 提取原始 viewBox
 *
 * 优先用 DOMParser 结构化读取（兼容单引号/双引号、属性顺序变化），
 * 解析失败或无 DOMParser 环境时回退正则（仅兜底，覆盖常见双引号/单引号写法）。
 */
function extractViewBox(svg: string): { viewBox: string; width: number; height: number } {
  const doc = parseSvgDom(svg)
  const vb = doc?.documentElement?.getAttribute('viewBox')
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number)
    return {
      viewBox: vb,
      width: parts.length >= 4 ? Math.round(parts[2]) : 0,
      height: parts.length >= 4 ? Math.round(parts[3]) : 0,
    }
  }

  // 回退正则（无 DOMParser 环境，如极少数 Node 构建场景）
  const match = svg.match(/viewBox\s*=\s*["']([^"']+)["']/)
  if (!match) return { viewBox: '', width: 0, height: 0 }
  const parts = match[1].split(/[\s,]+/).map(Number)
  return {
    viewBox: match[1],
    width: parts.length >= 4 ? Math.round(parts[2]) : 0,
    height: parts.length >= 4 ? Math.round(parts[3]) : 0,
  }
}

/**
 * 从 marker 定义中提取关键参数
 *
 * 优先用 DOMParser 遍历 <marker> 元素（getAttribute 兼容任意属性顺序），
 * 解析失败或无 DOMParser 环境时回退正则。
 */
function parseMarkers(svg: string): Record<string, MarkerInfo> {
  const markers: Record<string, MarkerInfo> = {}

  const doc = parseSvgDom(svg)
  if (doc) {
    doc.querySelectorAll('marker').forEach((m) => {
      const id = m.getAttribute('id')
      if (!id) return
      const mw = parseFloat(m.getAttribute('markerWidth') || '0')
      const mh = parseFloat(m.getAttribute('markerHeight') || '0')
      const refX = parseFloat(m.getAttribute('refX') || '0')

      // marker 内可能是 <polygon> 或 <path>，分别提取「箭头尖端最远 x」与填充色
      const poly = m.querySelector('polygon')
      const path = m.querySelector('path')
      let fill = '#000'
      let tipX = 0
      if (poly) {
        fill = poly.getAttribute('fill') || '#000'
        const xs = (poly.getAttribute('points') || '')
          .split(/[\s,]+/)
          .filter((_, i) => i % 2 === 0)
          .map(Number)
        if (xs.length) tipX = Math.max(...xs)
      } else if (path) {
        fill = path.getAttribute('fill') || '#000'
        const nums = (path.getAttribute('d') || '').match(/[\d.]+/g)?.map(Number) || []
        const xs = nums.filter((_, i) => i % 2 === 0)
        if (xs.length) tipX = Math.max(...xs)
      }

      markers[id] = { fill, refX, tipOffset: tipX - refX, markerW: mw, markerH: mh }
    })
    return markers
  }

  // ── 回退正则（无 DOMParser 环境）──
  // polygon 形式
  const polyRe =
    /<marker\s+id="([^"]+)"[^>]*markerWidth="([^"]+)"[^>]*markerHeight="([^"]+)"[^>]*refX="([^"]+)"[^>]*refY="([^"]+)"[^>]*>\s*<polygon\s+[^>]*points="([^"]+)"[^>]*fill="([^"]+)"[^>]*\/>\s*<\/marker>/g
  let m
  while ((m = polyRe.exec(svg)) !== null) {
    const [, id, mw, mh, refX, , pts, fill] = m
    const tipX = Math.max(
      ...pts
        .split(/[\s,]+/)
        .filter((_, i) => i % 2 === 0)
        .map(Number)
    )
    markers[id] = {
      fill,
      refX: parseFloat(refX),
      tipOffset: tipX - parseFloat(refX),
      markerW: parseFloat(mw),
      markerH: parseFloat(mh),
    }
  }

  // path 形式
  const pathRe =
    /<marker\s+id="([^"]+)"[^>]*markerWidth="([^"]+)"[^>]*markerHeight="([^"]+)"[^>]*refX="([^"]+)"[^>]*refY="([^"]+)"[^>]*>\s*<path\s+[^>]*d="([^"]+)"[^>]*fill="([^"]+)"[^>]*\/>\s*<\/marker>/g
  while ((m = pathRe.exec(svg)) !== null) {
    const [, id, mw, mh, refX, , d, fill] = m
    const nums = d.match(/[\d.]+/g)?.map(Number) || []
    const tipX = Math.max(...nums.filter((_, i) => i % 2 === 0))
    markers[id] = {
      fill,
      refX: parseFloat(refX),
      tipOffset: tipX - parseFloat(refX),
      markerW: parseFloat(mw),
      markerH: parseFloat(mh),
    }
  }

  return markers
}

/**
 * 从 <style> 中解析 CSS 类级 marker-end 规则
 *
 * <style> 文本用 DOMParser 提取（兼容 <style> 标签的属性顺序/引号变化）；
 * CSS 规则本身仍用正则解析（CSS 非 XML 结构，DOMParser 无法解析声明块），
 * 但放宽到支持 marker-end 冒号/url 两侧的空格（如 url( #id ) / url(#id)）。
 */
function parseClassMarkers(svg: string): Record<string, string> {
  const classMarkers: Record<string, string> = {}

  // 提取 <style> 文本：优先 DOMParser，回退正则
  const styleTexts: string[] = []
  const doc = parseSvgDom(svg)
  if (doc) {
    doc.querySelectorAll('style').forEach((s) => {
      const t = s.textContent
      if (t) styleTexts.push(t)
    })
  } else {
    const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi
    let sm
    while ((sm = styleRe.exec(svg)) !== null) styleTexts.push(sm[1])
  }

  // 解析 CSS 规则：.cls { ... marker-end: url(#id) ... }
  // 支持 marker-end 冒号/url 两侧的空格（如 url( #id ) / url(#id)）
  for (const css of styleTexts) {
    const ruleRe = /\.([\w-]+)\s*\{[^}]*marker-end\s*:\s*url\(\s*#([^)\s]+)\s*\)[^}]*\}/g
    let rm
    while ((rm = ruleRe.exec(css)) !== null) {
      classMarkers[rm[1]] = rm[2]
    }
  }

  return classMarkers
}

/**
 * 计算箭头三角的 3 个顶点坐标
 *
 * 核心公式：
 *   tip     = 线终点 + tipOffset（沿箭头方向延伸）
 *   base中心 = 线终点 - refX（沿箭头反方向回退，marker 的 base 到 ref 距离）
 *   base两点 = base中心 ± (halfH * sin(angle), -halfH * cos(angle))（垂直方向展开）
 */
function computeArrowPoints(
  x2: number,
  y2: number,
  angle: number,
  marker: MarkerInfo,
  prevX: number,
  prevY: number
): string {
  const refX = marker.refX || 0
  const tipOffset = marker.tipOffset || 0
  const halfH = (marker.markerH || 8) / 2
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  // 垂直偏移量（箭头的宽度/厚度方向）
  const sx = halfH * sinA
  const sy = -halfH * cosA
  // 箭头尖：线终点 + tipOffset 沿箭头方向
  const tipX = x2 + tipOffset * cosA
  const tipY = y2 + tipOffset * sinA
  // 箭头基底中心：线终点 - refX 沿箭头反方向
  const baseX = x2 - refX * cosA
  const baseY = y2 - refX * sinA
  return `${tipX.toFixed(1)},${tipY.toFixed(1)} ${(baseX + sx).toFixed(1)},${(baseY + sy).toFixed(1)} ${(baseX - sx).toFixed(1)},${(baseY - sy).toFixed(1)}`
}

/**
 * 为 <line> 注入箭头三角形
 */
function injectLineArrows(
  svg: string,
  markers: Record<string, MarkerInfo>,
  classMarkers: Record<string, string>
): string {
  return svg.replace(/<line\s+([^>]*?)\s*(?:\/>|><\/line>)/g, (full, attrs) => {
    let markerId = ''
    const inlineMe = attrs.match(/marker-end="url\(#([^)]+)\)"/)
    if (inlineMe) {
      markerId = inlineMe[1]
    } else {
      const classMatch = attrs.match(/class="([^"]+)"/)
      if (classMatch) {
        for (const cls of classMatch[1].split(/\s+/)) {
          if (classMarkers[cls]) {
            markerId = classMarkers[cls]
            break
          }
        }
      }
    }
    if (!markerId || !markers[markerId]) {
      return full.replace(/\s*marker-end="[^"]*"/, '')
    }

    const x1 = parseFloat((attrs.match(/x1="([^"]+)"/) || [])[1] || '0')
    const y1 = parseFloat((attrs.match(/y1="([^"]+)"/) || [])[1] || '0')
    const x2 = parseFloat((attrs.match(/x2="([^"]+)"/) || [])[1] || '0')
    const y2 = parseFloat((attrs.match(/y2="([^"]+)"/) || [])[1] || '0')
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const points = computeArrowPoints(x2, y2, angle, markers[markerId], x1, y1)
    const cleanAttrs = attrs.replace(/\s*marker-end="[^"]*"/, '')
    return `<line ${cleanAttrs}/><polygon points="${points}" fill="${markers[markerId].fill}"/>`
  })
}

/**
 * 为 <path> 注入箭头三角形
 */
function injectPathArrows(svg: string, markers: Record<string, MarkerInfo>): string {
  return svg.replace(
    /<path\s+([^>]*?)marker-end="url\(#([^)]+)\)"\s*([^>]*?)\s*(?:\/>|><\/path>)/g,
    (full, before, markerId, after) => {
      if (!markers[markerId]) return full.replace(/\s*marker-end="[^"]*"/, '')
      const dMatch = (before + ' ' + after).match(/d="([^"]+)"/)
      if (!dMatch) return full
      const nums = dMatch[1]
        .trim()
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => !isNaN(n))
      if (nums.length < 2) return full
      const x2 = nums[nums.length - 2]
      const y2 = nums[nums.length - 1]
      const x1 = nums.length >= 4 ? nums[nums.length - 4] : x2 - 10
      const y1 = nums.length >= 4 ? nums[nums.length - 3] : y2
      const angle = Math.atan2(y2 - y1, x2 - x1)
      const points = computeArrowPoints(x2, y2, angle, markers[markerId], x1, y1)
      const combined = (before + ' ' + after).replace(/\s*marker-end="[^"]*"/, '')
      return `<path ${combined}/><polygon points="${points}" fill="${markers[markerId].fill}"/>`
    }
  )
}

/**
 * 主入口：预处理 SVG 文本，返回 Fabric.js 可直接加载的 SVG
 * @param rawSvg — 原始 SVG 文本
 * @param theme  — 主题模式（默认 light）
 */
export function preprocessSvg(
  rawSvg: string,
  theme: ThemeMode = 'light',
  options: SvgPreprocessOptions = {}
): SvgLoadResult {
  let svg = rawSvg.replace(/<\?xml[^?]*\?>\s*/g, '')

  const { viewBox, width, height } = extractViewBox(svg)

  // 第二步（可选）：hex 精确匹配 → 语义 token。
  // 必须在 var→hex 之前执行：此时 var 形式的 fill/stroke 尚未替换为 hex，
  // 裸 hex 正则不会误匹配到它们，也避免对已带 data-*-var 标记的元素重复打标。
  if (options.mapHexToVar) {
    svg = mapHexToVar(svg)
  }

  // 1. CSS 变量 → hex（按当前主题，并打上语义标记）
  svg = replaceCssVars(svg, theme)

  // 2. <stop style="stop-color:..."> → 直接属性
  svg = fixStopColors(svg)

  // 移除设计工具生成的背景/占位 rect（全画布背景、透明填充占位）
  svg = removeBackgroundRects(svg)

  // 3. Marker 解析 → 合成箭头三角形
  const markers = parseMarkers(svg)
  const classMarkers = parseClassMarkers(svg)
  svg = injectLineArrows(svg, markers, classMarkers)
  svg = injectPathArrows(svg, markers)

  return { svg, originalViewBox: viewBox, svgWidth: width, svgHeight: height }
}
