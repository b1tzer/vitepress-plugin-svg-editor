/**
 * SVG 预处理模块 — 将原始 SVG 转为 Fabric.js 可渲染格式
 *
 * 处理链：
 *   1. CSS 变量 → hex 色值
 *   2. <stop style="stop-color:..."> → 直接属性
 *   3. <marker> 解析 → 合成 <polygon> 箭头
 *   4. 提取 viewBox / 宽高
 */

import { THEME_VAR_TO_HEX } from './colors'
import type { ThemeMode, SvgLoadResult, MarkerInfo } from './types'

/**
 * 将 CSS 变量替换为 hex 色值
 */
function replaceCssVars(svg: string, theme: ThemeMode = 'light'): string {
  const mapping = THEME_VAR_TO_HEX[theme] || THEME_VAR_TO_HEX.light
  let result = svg
  for (const [varName, hex] of Object.entries(mapping)) {
    result = result.replaceAll(`var(${varName})`, hex)
  }
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

  // 3) style 中 stroke:none 且 fill-opacity≈0 的不可见占位
  result = result.replace(
    /<rect\b(?=[^>]*style\s*=\s*"[^"]*stroke\s*:\s*none[^"]*")(?=[^>]*style\s*=\s*"[^"]*fill-opacity\s*:\s*0(?:\.0+1)?[^"]*")[^>]*?\/?>\s*(?:<\/rect>)?/gi,
    ''
  )

  return result
}

/**
 * 提取原始 viewBox
 */
function extractViewBox(svg: string): { viewBox: string; width: number; height: number } {
  const match = svg.match(/viewBox="([^"]+)"/)
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
 */
function parseMarkers(svg: string): Record<string, MarkerInfo> {
  const markers: Record<string, MarkerInfo> = {}

  // polygon 形式
  const polyRe = /<marker\s+id="([^"]+)"[^>]*markerWidth="([^"]+)"[^>]*markerHeight="([^"]+)"[^>]*refX="([^"]+)"[^>]*refY="([^"]+)"[^>]*>\s*<polygon\s+[^>]*points="([^"]+)"[^>]*fill="([^"]+)"[^>]*\/>\s*<\/marker>/g
  let m
  while ((m = polyRe.exec(svg)) !== null) {
    const [, id, mw, mh, refX, , pts, fill] = m
    const tipX = Math.max(...pts.split(/[\s,]+/).filter((_, i) => i % 2 === 0).map(Number))
    markers[id] = { fill, refX: parseFloat(refX), tipOffset: tipX - parseFloat(refX), markerW: parseFloat(mw), markerH: parseFloat(mh) }
  }

  // path 形式
  const pathRe = /<marker\s+id="([^"]+)"[^>]*markerWidth="([^"]+)"[^>]*markerHeight="([^"]+)"[^>]*refX="([^"]+)"[^>]*refY="([^"]+)"[^>]*>\s*<path\s+[^>]*d="([^"]+)"[^>]*fill="([^"]+)"[^>]*\/>\s*<\/marker>/g
  while ((m = pathRe.exec(svg)) !== null) {
    const [, id, mw, mh, refX, , d, fill] = m
    const nums = d.match(/[\d.]+/g)?.map(Number) || []
    const tipX = Math.max(...nums.filter((_, i) => i % 2 === 0))
    markers[id] = { fill, refX: parseFloat(refX), tipOffset: tipX - parseFloat(refX), markerW: parseFloat(mw), markerH: parseFloat(mh) }
  }

  return markers
}

/**
 * 从 <style> 中解析 CSS 类级 marker-end 规则
 */
function parseClassMarkers(svg: string): Record<string, string> {
  const classMarkers: Record<string, string> = {}
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let sm
  while ((sm = styleRe.exec(svg)) !== null) {
    const ruleRe = /\.([\w-]+)\s*\{[^}]*marker-end:\s*url\(#([^)]+)\)[^}]*\}/g
    let rm
    while ((rm = ruleRe.exec(sm[1])) !== null) {
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
function computeArrowPoints(x2: number, y2: number, angle: number, marker: MarkerInfo, prevX: number, prevY: number): string {
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
function injectLineArrows(svg: string, markers: Record<string, MarkerInfo>, classMarkers: Record<string, string>): string {
  return svg.replace(
    /<line\s+([^>]*?)\s*\/>/g,
    (full, attrs) => {
      let markerId = ''
      const inlineMe = attrs.match(/marker-end="url\(#([^)]+)\)"/)
      if (inlineMe) {
        markerId = inlineMe[1]
      } else {
        const classMatch = attrs.match(/class="([^"]+)"/)
        if (classMatch) {
          for (const cls of classMatch[1].split(/\s+/)) {
            if (classMarkers[cls]) { markerId = classMarkers[cls]; break }
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
    }
  )
}

/**
 * 为 <path> 注入箭头三角形
 */
function injectPathArrows(svg: string, markers: Record<string, MarkerInfo>): string {
  return svg.replace(
    /<path\s+([^>]*?)marker-end="url\(#([^)]+)\)"\s*([^>]*?)\s*\/>/g,
    (full, before, markerId, after) => {
      if (!markers[markerId]) return full.replace(/\s*marker-end="[^"]*"/, '')
      const dMatch = (before + ' ' + after).match(/d="([^"]+)"/)
      if (!dMatch) return full
      const nums = dMatch[1].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
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
export function preprocessSvg(rawSvg: string, theme: ThemeMode = 'light'): SvgLoadResult {
  let svg = rawSvg.replace(/<\?xml[^?]*\?>\s*/g, '')

  const { viewBox, width, height } = extractViewBox(svg)

  // 1. CSS 变量 → hex（按当前主题）
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
