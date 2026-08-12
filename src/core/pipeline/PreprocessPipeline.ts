/**
 * 预处理管道 — 组装 SVG 预处理步骤（CSS变量→hex、marker→箭头等）
 *
 * 使用 Pipeline 责任链模式，替代原来硬编码的 preprocessSvg 函数中的步骤顺序。
 * 新增/删除预处理步骤只需修改此工厂函数，无需改动 preprocessSvg 内部代码。
 */

import { Pipeline, type IPipelineStep } from './Pipeline'
import type { ThemeMode, MarkerInfo } from '../types'
import { THEME_VAR_TO_HEX } from '../colors'

// ═══════════════════════════════════════════════════════════════
// 各处理步骤
// ═══════════════════════════════════════════════════════════════

/** CSS 变量 → hex 色值 */
function replaceCssVars(svg: string, theme: ThemeMode = 'light'): string {
  const mapping = THEME_VAR_TO_HEX[theme] || THEME_VAR_TO_HEX.light
  let result = svg
  for (const [varName, hex] of Object.entries(mapping)) {
    result = result.replaceAll(`var(${varName})`, hex)
  }
  return result
}

/** <stop style="stop-color:..."> → 直接属性 */
function fixStopColors(svg: string): string {
  return svg.replace(
    /<stop(\s[^>]*?)style="stop-color:\s*([^;"]+);\s*stop-opacity:\s*([^"]+)"([^>]*?)>/g,
    '<stop$1stop-color="$2" stop-opacity="$3"$4>'
  )
}

/** 为 <line> 注入箭头三角形 */
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
      const points = computeArrowPoints(x2, y2, angle, markers[markerId])
      const cleanAttrs = attrs.replace(/\s*marker-end="[^"]*"/, '')
      return `<line ${cleanAttrs}/><polygon points="${points}" fill="${markers[markerId].fill}"/>`
    }
  )
}

/** 为 <path> 注入箭头三角形 */
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
      const points = computeArrowPoints(x2, y2, angle, markers[markerId])
      const combined = (before + ' ' + after).replace(/\s*marker-end="[^"]*"/, '')
      return `<path ${combined}/><polygon points="${points}" fill="${markers[markerId].fill}"/>`
    }
  )
}

/** 计算箭头三角的 3 个顶点坐标 */
function computeArrowPoints(x2: number, y2: number, angle: number, marker: MarkerInfo): string {
  const refX = marker.refX || 0
  const tipOffset = marker.tipOffset || 0
  const halfH = (marker.markerH || 8) / 2
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  const sx = halfH * sinA
  const sy = -halfH * cosA
  const tipX = x2 + tipOffset * cosA
  const tipY = y2 + tipOffset * sinA
  const baseX = x2 - refX * cosA
  const baseY = y2 - refX * sinA
  return `${tipX.toFixed(1)},${tipY.toFixed(1)} ${(baseX + sx).toFixed(1)},${(baseY + sy).toFixed(1)} ${(baseX - sx).toFixed(1)},${(baseY - sy).toFixed(1)}`
}

// ═══════════════════════════════════════════════════════════════
// 管道工厂
// ═══════════════════════════════════════════════════════════════

/** 创建标准预处理管道 */
export function createPreprocessPipeline(
  theme: ThemeMode = 'light',
  markers: Record<string, MarkerInfo> = {},
  classMarkers: Record<string, string> = {}
): Pipeline<string> {
  return new Pipeline<string>()
    .use({ name: 'replaceCssVars', process: (svg) => replaceCssVars(svg, theme) })
    .use({ name: 'fixStopColors', process: fixStopColors })
    .use({ name: 'injectLineArrows', process: (svg) => injectLineArrows(svg, markers, classMarkers) })
    .use({ name: 'injectPathArrows', process: (svg) => injectPathArrows(svg, markers) })
}