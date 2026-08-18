/**
 * SVG 后处理模块 — 将 Fabric.js toSVG() 输出还原为原始 SVG 格式
 *
 * 处理链：
 *   1. 展开 Group transform → 绝对坐标
 *   2. rgb() → hex
 *   3. hex → CSS 变量
 *   4. 恢复 viewBox，移除 width/height
 *   5. 清理 Fabric.js 冗余头部信息
 */

import type { Canvas } from 'fabric'
import { THEME_VAR_TO_HEX } from '../shared/colors'
import type { SvgSemanticColors } from '../shared/fabricTypes'
import type { ThemeMode } from '../shared/types'
/**
 * 主入口：清理 Fabric.js 输出的 SVG
 */
export function cleanFabricSvg(svg: string): string {
  let s = svg

  // 1. 移除 Fabric.js 冗余头部
  s = s.replace(/<\?xml[^?]*\?>\s*/g, '')
  s = s.replace(/<!DOCTYPE[^>]*>\s*/g, '')
  s = s.replace(/<desc>[^<]*<\/desc>\s*/g, '')
  s = s.replace(/<defs>\s*<\/defs>\s*/g, '')
  s = s.replace(/ xmlns:xlink="[^"]*"/g, '')
  s = s.replace(/ version="[^"]*"/g, '')
  s = s.replace(/ xml:space="preserve"/g, '')

  // 2. 展开 Group transform → 绝对坐标
  s = unwrapGroups(s)

  // 3. 清理多余空白
  s = s.replace(/\n\s*\n/g, '\n')

  return s.trim()
}

/**
 * 展开 Fabric.js Group 的矩阵平移
 * Fabric.js 将每个元素包裹在 <g transform="matrix(1 0 0 1 tx ty)"> 中
 */
function unwrapGroups(svg: string): string {
  return svg.replace(
    /<g\s+transform="matrix\(1\s+0\s+0\s+1\s+([\d.-]+)\s+([\d.-]+)\)"[^>]*>\s*([\s\S]*?)<\/g>/g,
    (full: string, txStr: string, tyStr: string, inner: string) => {
      const tx = parseFloat(txStr)
      const ty = parseFloat(tyStr)
      const trimmed = inner.trim()

      // <text><tspan> 结构
      const textMatch = trimmed.match(
        /^(<text[^>]*>)\s*<tspan\s+x="([\d.-]+)"\s+y="([\d.-]+)"[^>]*>([\s\S]*?)<\/tspan>\s*<\/text>$/
      )
      if (textMatch) {
        const [, origAttrs, lx, ly, content] = textMatch
        const absX = tx + parseFloat(lx),
          absY = ty + parseFloat(ly)
        const attrs = origAttrs
          .replace(/\s+xml:space="preserve"/g, '')
          .replace(/^<text/, `<text x="${absX.toFixed(1)}" y="${absY.toFixed(1)}"`)
          .replace(/>$/, '')
        return `${attrs}>${content}</text>`
      }

      // <rect> 结构
      const rectMatch = trimmed.match(/^(<rect[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (rectMatch) {
        return trimmed
          .replace(/ x="([\d.-]+)"/, (m, v) => ` x="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y="([\d.-]+)"/, (m, v) => ` y="${(ty + parseFloat(v)).toFixed(1)}"`)
      }

      // <line> 结构
      const lineMatch = trimmed.match(/^(<line[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (lineMatch) {
        return trimmed
          .replace(/ x1="([\d.-]+)"/, (m, v) => ` x1="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y1="([\d.-]+)"/, (m, v) => ` y1="${(ty + parseFloat(v)).toFixed(1)}"`)
          .replace(/ x2="([\d.-]+)"/, (m, v) => ` x2="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y2="([\d.-]+)"/, (m, v) => ` y2="${(ty + parseFloat(v)).toFixed(1)}"`)
      }

      // <polygon> 结构
      const polyMatch = trimmed.match(/^(<polygon[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (polyMatch) {
        return trimmed.replace(/ points="([^"]+)"/, (m: string, pts: string) => {
          const newPts = pts
            .trim()
            .split(/\s+/)
            .map((pair: string) => {
              const [x, y] = pair.split(',').map(Number)
              return `${(tx + x).toFixed(1)},${(ty + y).toFixed(1)}`
            })
            .join(' ')
          return ` points="${newPts}"`
        })
      }

      return full
    }
  )
}

/**
 * rgb() → hex 转换
 */
export function rgbToHex(svg: string): string {
  return svg.replace(
    /rgb\((\d+),\s*(\d+),\s*(\d+)\)/gi,
    (_, r, g, b) =>
      '#' +
      [r, g, b].map((x: string) => parseInt(x).toString(16).padStart(2, '0').toUpperCase()).join('')
  )
}

/**
 * hex → CSS 变量还原
 * @param svg  待还原的 SVG 文本
 * @param map  hex→变量名 映射（必传；语义化导出时应传入
 *             collectSemanticHexToVar 的对象级精确映射，避免全局表撞色）
 */
export function hexToCssVars(svg: string, map: Record<string, string>): string {
  let result = svg
  for (const [hex, info] of Object.entries(map)) {
    result = result.replace(new RegExp(hex, 'gi'), `var(${info})`)
  }
  return result
}

/**
 * 收集「对象级」语义 hex→var 精确映射（语义化颜色 ID 的导出依据）
 *
 * 遍历画布上所有对象（含 Group 子对象），仅收集「仍保持语义」的颜色：
 *   - 对象带有 fillVar / strokeVar（导入时挂载的变量名）
 *   - 且当前 fill / stroke 的 hex 精确等于该变量在当前主题下的 hex（即用户未改色）
 *
 * 返回映射 key 统一大写 hex（与 rgbToHex 输出一致，配合 gi 匹配）。
 * 只还原「有语义且未改色」的对象，其余（用户自定义色、无语义裸 hex）保留 hex，
 * 从而彻底避免基于全局表的 hex 撞色串色与「猜语义」。
 */
export function collectSemanticHexToVar(
  canvas: Canvas,
  theme: ThemeMode = 'light'
): Record<string, string> {
  const map: Record<string, string> = {}
  const themeVarToHex = THEME_VAR_TO_HEX[theme] || THEME_VAR_TO_HEX.light

  type SemanticObject = SvgSemanticColors & {
    fill?: unknown
    stroke?: unknown
    _objects?: SemanticObject[]
  }

  const visit = (obj: SemanticObject): void => {
    if (!obj) return
    // fill：有语义 ID 且当前值仍等于语义 hex 时才还原
    if (typeof obj.fill === 'string' && obj.fillVar) {
      const semanticHex = themeVarToHex[obj.fillVar]
      if (semanticHex && semanticHex.toUpperCase() === obj.fill.toUpperCase()) {
        map[obj.fill.toUpperCase()] = obj.fillVar
      }
    }
    // stroke：同理
    if (typeof obj.stroke === 'string' && obj.strokeVar) {
      const semanticHex = themeVarToHex[obj.strokeVar]
      if (semanticHex && semanticHex.toUpperCase() === obj.stroke.toUpperCase()) {
        map[obj.stroke.toUpperCase()] = obj.strokeVar
      }
    }
    // 递归 Group 子对象
    if (obj._objects) {
      obj._objects.forEach(visit)
    }
  }

  // 兼容无 getObjects 的 mock canvas（单测场景），优雅降级为空映射
  const objects = canvas?.getObjects?.()
  if (objects) {
    objects.forEach((o) => visit(o as SemanticObject))
  }
  return map
}

/**
 * 恢复原始 viewBox 并移除 Fabric.js 添加的 width/height
 */
export function restoreViewBox(svg: string, originalViewBox: string): string {
  if (!originalViewBox) return svg
  let result = svg.replace(/viewBox="[^"]*"/, `viewBox="${originalViewBox}"`)
  result = result.replace(/\s+width="[^"]*"/, '').replace(/\s+height="[^"]*"/, '')
  return result
}

/**
 * 移除 Fabric.js 自动添加的画布背景 rect
 */
export function removeCanvasBg(svg: string): string {
  return svg.replace(
    /<rect\s+x="0"\s+y="0"\s+width="100%"\s+height="100%"\s+fill="#F5F5F5"\s*\/?>\s*(?:<\/rect>)?\s*/gi,
    ''
  )
}
