/**
 * postprocessor 单元测试 — 覆盖各步骤函数
 */
import { describe, it, expect } from 'vitest'
import {
  cleanFabricSvg,
  rgbToHex,
  hexToCssVars,
  restoreViewBox,
  removeCanvasBg,
} from '../../src/core/serialization/postprocessor'
import { THEME_HEX_TO_VAR } from '../../src/core/shared/colors'

describe('postprocessor', () => {
  // ── rgbToHex ──
  it('rgbToHex 应将 rgb() 转为 hex', () => {
    const result = rgbToHex('fill="rgb(255,0,0)"')
    expect(result).toContain('#FF0000')
    expect(result).not.toContain('rgb(')
  })

  it('rgbToHex 应处理多个 rgb 值', () => {
    const result = rgbToHex('fill="rgb(0,255,0)" stroke="rgb(0,0,255)"')
    expect(result).toContain('#00FF00')
    expect(result).toContain('#0000FF')
  })

  // ── cleanFabricSvg ──
  it('cleanFabricSvg 应移除 XML 声明和 DOCTYPE', () => {
    const result = cleanFabricSvg(
      '<?xml version="1.0"?><!DOCTYPE svg><svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'
    )
    expect(result).not.toContain('<?xml')
    expect(result).not.toContain('<!DOCTYPE')
  })

  it('cleanFabricSvg 应移除冗余头信息', () => {
    const result = cleanFabricSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://xlink" version="1.1" xml:space="preserve"><rect/></svg>'
    )
    expect(result).not.toContain('xmlns:xlink')
    expect(result).not.toContain('version=')
    expect(result).not.toContain('xml:space="preserve"')
  })

  it('cleanFabricSvg 应展开 Group transform', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<g transform="matrix(1 0 0 1 10 20)">' +
      '<rect x="5" y="5" style="test"/></g></svg>'
    const result = cleanFabricSvg(svg)
    expect(result).toContain('x="15.0"')
    expect(result).toContain('y="25.0"')
  })

  it('cleanFabricSvg 应移除空 <defs>', () => {
    const result = cleanFabricSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><defs></defs><rect/></svg>'
    )
    expect(result).not.toContain('<defs>')
  })

  // ── hexToCssVars ──
  it('hexToCssVars 应还原 CSS 变量', () => {
    const result = hexToCssVars('fill="#FFFFFF"')
    expect(result).toContain('var(--diagram-surface-1)')
    expect(result).not.toContain('#FFFFFF')
  })

  it('hexToCssVars 亮色单向映射应将 #E1BEE7 还原为 accent-bg-3b 而非 accent-text-3', () => {
    // 回归：合并映射 ALL_HEX_TO_VAR 中 #E1BEE7 被暗色 accent-text-3 覆盖，导致串色
    const result = hexToCssVars('fill="#E1BEE7"', THEME_HEX_TO_VAR.light)
    expect(result).toContain('var(--diagram-accent-bg-3b)')
    expect(result).not.toContain('var(--diagram-accent-text-3)')
    expect(result).not.toContain('#E1BEE7')
  })

  it('hexToCssVars 暗色单向映射应将 #E1BEE7 还原为 accent-text-3', () => {
    const result = hexToCssVars('fill="#E1BEE7"', THEME_HEX_TO_VAR.dark)
    expect(result).toContain('var(--diagram-accent-text-3)')
    expect(result).not.toContain('var(--diagram-accent-bg-3b)')
  })

  it('hexToCssVars 亮色单向映射应将 #FFCDD2 还原为 accent-bg-5', () => {
    const result = hexToCssVars('fill="#FFCDD2"', THEME_HEX_TO_VAR.light)
    expect(result).toContain('var(--diagram-accent-bg-5)')
    expect(result).not.toContain('var(--diagram-accent-text-5)')
  })

  it('hexToCssVars 亮色单向映射应将 #666666 还原为 text-2 而非 ghost', () => {
    const result = hexToCssVars('stroke="#666666"', THEME_HEX_TO_VAR.light)
    expect(result).toContain('var(--diagram-text-2)')
    expect(result).not.toContain('var(--diagram-ghost)')
  })

  // ── restoreViewBox ──
  it('restoreViewBox 应恢复原始 viewBox', () => {
    const result = restoreViewBox(
      '<svg viewBox="0 0 800 600" width="800" height="600"><rect/></svg>',
      '0 0 1000 800'
    )
    expect(result).toContain('viewBox="0 0 1000 800"')
    expect(result).not.toContain('width=')
    expect(result).not.toContain('height=')
  })

  it('restoreViewBox 空字符串时返回原值', () => {
    const svg = '<svg viewBox="0 0 800 600"><rect/></svg>'
    expect(restoreViewBox(svg, '')).toBe(svg)
  })

  // ── removeCanvasBg ──
  it('removeCanvasBg 应移除 Fabric.js 画布背景 rect', () => {
    const result = removeCanvasBg(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="#F5F5F5"/><rect fill="#ff0000"/></svg>'
    )
    expect(result).not.toContain('#F5F5F5')
    expect(result).toContain('#ff0000')
  })

  it('removeCanvasBg 无背景 rect 时保持原样', () => {
    const svg = '<svg><rect fill="#ff0000"/></svg>'
    expect(removeCanvasBg(svg)).toBe(svg)
  })
})
