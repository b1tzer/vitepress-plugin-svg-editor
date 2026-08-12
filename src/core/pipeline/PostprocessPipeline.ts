/**
 * 后处理管道 — 组装 SVG 后处理步骤（Group展开、rgb→hex、hex→CSS变量等）
 *
 * 使用 Pipeline 责任链模式，替代原来硬编码的 SvgSerializer.serialize 中的步骤顺序。
 */

// @ts-nocheck — String.replace 回调参数因正则动态性无法严格类型化

import { Pipeline, type IPipelineStep } from './Pipeline'
import { CSS_COLORS } from '../colors'

// ═══════════════════════════════════════════════════════════════
// 各处理步骤
// ═══════════════════════════════════════════════════════════════

/** 清理 Fabric.js 输出的冗余头部 */
function cleanFabricSvg(svg: string): string {
  let s = svg
  s = s.replace(/<\?xml[^?]*\?>\s*/g, '')
  s = s.replace(/<!DOCTYPE[^>]*>\s*/g, '')
  s = s.replace(/<desc>[^<]*<\/desc>\s*/g, '')
  s = s.replace(/<defs>\s*<\/defs>\s*/g, '')
  s = s.replace(/ xmlns:xlink="[^"]*"/g, '')
  s = s.replace(/ version="[^"]*"/g, '')
  s = s.replace(/ xml:space="preserve"/g, '')
  s = unwrapGroups(s)
  s = s.replace(/\n\s*\n/g, '\n')
  return s.trim()
}

/** 展开 Fabric.js Group 的矩阵平移 */
function unwrapGroups(svg: string): string {
  return svg.replace(
    /<g\s+transform="matrix\(1\s+0\s+0\s+1\s+([\d.\-]+)\s+([\d.\-]+)\)"[^>]*>\s*([\s\S]*?)<\/g>/g,
    (full, txStr, tyStr, inner) => {
      const tx = parseFloat(txStr)
      const ty = parseFloat(tyStr)
      const trimmed = inner.trim()

      const textMatch = trimmed.match(
        /^(<text[^>]*>)\s*<tspan\s+x="([\d.\-]+)"\s+y="([\d.\-]+)"[^>]*>([\s\S]*?)<\/tspan>\s*<\/text>$/
      )
      if (textMatch) {
        const [, origAttrs, lx, ly, content] = textMatch
        const absX = tx + parseFloat(lx), absY = ty + parseFloat(ly)
        let attrs = origAttrs
          .replace(/\s+xml:space="preserve"/g, '')
          .replace(/^<text/, `<text x="${absX.toFixed(1)}" y="${absY.toFixed(1)}"`)
          .replace(/>$/, '')
        return `${attrs}>${content}</text>`
      }

      const rectMatch = trimmed.match(/^(<rect[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (rectMatch) {
        return trimmed
          .replace(/ x="([\d.\-]+)"/, (m, v) => ` x="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y="([\d.\-]+)"/, (m, v) => ` y="${(ty + parseFloat(v)).toFixed(1)}"`)
      }

      const lineMatch = trimmed.match(/^(<line[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (lineMatch) {
        return trimmed
          .replace(/ x1="([\d.\-]+)"/, (m, v) => ` x1="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y1="([\d.\-]+)"/, (m, v) => ` y1="${(ty + parseFloat(v)).toFixed(1)}"`)
          .replace(/ x2="([\d.\-]+)"/, (m, v) => ` x2="${(tx + parseFloat(v)).toFixed(1)}"`)
          .replace(/ y2="([\d.\-]+)"/, (m, v) => ` y2="${(ty + parseFloat(v)).toFixed(1)}"`)
      }

      const polyMatch = trimmed.match(/^(<polygon[^>]*?)\s+style="[^"]*"([^>]*\/>)\s*$/)
      if (polyMatch) {
        return trimmed.replace(/ points="([^"]+)"/, (m, pts) => {
          const newPts = pts.trim().split(/\s+/).map(pair => {
            const [x, y] = pair.split(',').map(Number)
            return `${(tx + x).toFixed(1)},${(ty + y).toFixed(1)}`
          }).join(' ')
          return ` points="${newPts}"`
        })
      }

      return full
    }
  )
}

/** rgb() → hex 转换 */
function rgbToHex(svg: string): string {
  return svg.replace(
    /rgb\((\d+),\s*(\d+),\s*(\d+)\)/gi,
    (_, r, g, b) => '#' + [r, g, b].map((x: string) => parseInt(x).toString(16).padStart(2, '0').toUpperCase()).join('')
  )
}

/** hex → CSS 变量还原 */
function hexToCssVars(svg: string): string {
  let result = svg
  for (const [hex, info] of Object.entries(CSS_COLORS)) {
    result = result.replace(new RegExp(hex, 'gi'), `var(${info})`)
  }
  return result
}

/** 恢复原始 viewBox 并移除 Fabric.js 添加的 width/height */
function restoreViewBox(svg: string, originalViewBox: string): string {
  if (!originalViewBox) return svg
  let result = svg.replace(/viewBox="[^"]*"/, `viewBox="${originalViewBox}"`)
  result = result.replace(/\s+width="[^"]*"/, '').replace(/\s+height="[^"]*"/, '')
  return result
}

/** 移除 Fabric.js 自动添加的画布背景 rect */
function removeCanvasBg(svg: string): string {
  return svg.replace(/<rect\s+x="0"\s+y="0"\s+width="100%"\s+height="100%"\s+fill="#F5F5F5"\s*\/?>\s*(?:<\/rect>)?\s*/gi, '')
}

// ═══════════════════════════════════════════════════════════════
// 管道工厂
// ═══════════════════════════════════════════════════════════════

/** 创建标准后处理管道 */
export function createPostprocessPipeline(originalViewBox?: string): Pipeline<string> {
  const pipeline = new Pipeline<string>()
    .use({ name: 'rgbToHex', process: rgbToHex })
    .use({ name: 'cleanFabricSvg', process: cleanFabricSvg })

  if (originalViewBox) {
    pipeline.use({ name: 'restoreViewBox', process: (svg: string) => restoreViewBox(svg, originalViewBox) })
  }

  pipeline
    .use({ name: 'hexToCssVars', process: hexToCssVars })
    .use({ name: 'removeCanvasBg', process: removeCanvasBg })

  return pipeline
}