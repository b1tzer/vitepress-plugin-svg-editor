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
import type { SvgLightColors } from '../shared/fabricTypes'
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
 * 非语义色「暗 → 亮」归一化（保存时强制存亮色真值的核心步骤）
 *
 * 背景：编辑器内主题切换把「无语义 ID 的自定义色」从亮色真值单向派生为暗色
 * （对象 fillLight/strokeLight 记录亮色真值）。若用户在暗色模式下保存，画布上
 * 的非语义色已是暗色 hex，直接落盘会把「暗色快照」当真值，导致展示层切换明暗
 * 时无法恢复。
 *
 * 本步骤必须在 hexToCssVars（语义色还原 var）之后执行：此时 SVG 里剩余的 hex
 * 均为非语义色，按 darkToLightMap 把暗色 hex 还原为亮色真值，使文件永远保存
 * 亮色语义，展示层即可在暗色下由运行时派生暗色，实现「所见即所得」闭环。
 *
 * @param svg            待归一化的 SVG 文本
 * @param darkToLightMap 暗色 hex → 亮色 hex 映射（由 collectNonSemanticLightMap
 *                       从对象 fillLight/strokeLight 收集）
 */
export function normalizeNonSemanticToLight(
  svg: string,
  darkToLightMap: Map<string, string> | Record<string, string> | undefined
): string {
  if (!darkToLightMap) return svg
  const entries =
    darkToLightMap instanceof Map ? [...darkToLightMap.entries()] : Object.entries(darkToLightMap)
  if (!entries.length) return svg

  let result = svg
  for (const [darkHex, lightHex] of entries) {
    if (!darkHex || !lightHex) continue
    // 大小写不敏感替换；lightHex 保持原始亮色 hex 的大小写（不强行统一）
    result = result.replace(new RegExp(darkHex, 'gi'), lightHex)
  }
  return result
}

/**
 * 收集「非语义色」的 暗色hex → 亮色真值 归一化映射（保存时强制存亮色真值的依据）
 *
 * 对象以 fillLight / strokeLight 直接持有亮色真值。保存时若对象当前处于暗色态
 * （fill ≠ fillLight），本函数收集「当前暗色 hex → 亮色真值」，
 * 供 normalizeNonSemanticToLight 做文本替换，使落盘 SVG 永远保存亮色真值。
 *
 * @returns 暗色 hex（大写）→ 亮色真值 hex 映射
 */
export function collectNonSemanticLightMap(canvas: Canvas): Map<string, string> {
  const map = new Map<string, string>()

  type LightObject = SvgLightColors & {
    fill?: unknown
    stroke?: unknown
    _objects?: LightObject[]
  }

  const visit = (obj: LightObject): void => {
    if (!obj) return
    // 有 fillLight 真值且当前 fill 为 hex 字符串
    if (typeof obj.fill === 'string' && obj.fillLight) {
      map.set(obj.fill.toUpperCase(), obj.fillLight)
    }
    if (typeof obj.stroke === 'string' && obj.strokeLight) {
      map.set(obj.stroke.toUpperCase(), obj.strokeLight)
    }
    if (obj._objects) obj._objects.forEach(visit)
  }

  const objects = canvas?.getObjects?.()
  if (objects) objects.forEach((o) => visit(o as LightObject))
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
