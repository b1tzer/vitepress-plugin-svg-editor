/**
 * postprocessor 单元测试 — 覆盖各步骤函数
 */
import { describe, it, expect } from 'vitest'
import {
  cleanFabricSvg,
  rgbToHex,
  restoreViewBox,
  removeCanvasBg,
  collectNonSemanticLightMap,
  normalizeNonSemanticToLight,
} from '../../src/core/serialization/postprocessor'

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

  // ── collectNonSemanticLightMap ──
  it('collectNonSemanticLightMap 应收集非语义色的 暗hex → 亮真值 映射', () => {
    // 模拟暗色态画布：当前 fill/stroke 为暗色 hex，fillLight/strokeLight 记录亮色真值
    const canvas = {
      getObjects: () => [
        { fill: '#779CC4', fillLight: '#123456', stroke: '#0D2137', strokeLight: '#E3F2FD' },
      ],
    } as any
    const map = collectNonSemanticLightMap(canvas)
    expect(map.get('#779CC4')).toBe('#123456')
    expect(map.get('#0D2137')).toBe('#E3F2FD')
  })

  it('collectNonSemanticLightMap 无 fillLight 真值时不收集', () => {
    const canvas = {
      getObjects: () => [{ fill: '#1565C0' }],
    } as any
    const map = collectNonSemanticLightMap(canvas)
    expect(map.size).toBe(0)
  })

  it('collectNonSemanticLightMap 应递归收集 Group 子对象', () => {
    const canvas = {
      getObjects: () => [{ _objects: [{ fill: '#779CC4', fillLight: '#123456' }] }],
    } as any
    const map = collectNonSemanticLightMap(canvas)
    expect(map.get('#779CC4')).toBe('#123456')
  })

  it('collectNonSemanticLightMap 无 getObjects 时返回空映射', () => {
    const map = collectNonSemanticLightMap({} as any)
    expect(map.size).toBe(0)
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

  // ── normalizeNonSemanticToLight ──
  it('normalizeNonSemanticToLight 应将暗色 hex 还原为亮色真值', () => {
    const svg = '<rect fill="#779CC4" stroke="#0D2137"/>'
    const map = new Map<string, string>([
      ['#779CC4', '#123456'],
      ['#0D2137', '#E3F2FD'],
    ])
    const result = normalizeNonSemanticToLight(svg, map)
    expect(result).toContain('#123456')
    expect(result).toContain('#E3F2FD')
    expect(result).not.toContain('#779CC4')
    expect(result).not.toContain('#0D2137')
  })

  it('normalizeNonSemanticToLight 大小写不敏感匹配', () => {
    const svg = '<rect fill="#779cc4"/>'
    const map = new Map<string, string>([['#779CC4', '#123456']])
    const result = normalizeNonSemanticToLight(svg, map)
    expect(result).toContain('#123456')
    expect(result).not.toContain('#779cc4')
  })

  it('normalizeNonSemanticToLight 空映射或 undefined 时原样返回', () => {
    const svg = '<rect fill="#123456"/>'
    expect(normalizeNonSemanticToLight(svg, undefined)).toBe(svg)
    expect(normalizeNonSemanticToLight(svg, new Map())).toBe(svg)
  })

  it('normalizeNonSemanticToLight 兼容 Record 形式入参', () => {
    const svg = '<rect fill="#779CC4"/>'
    const result = normalizeNonSemanticToLight(svg, { '#779CC4': '#123456' })
    expect(result).toContain('#123456')
  })
})
