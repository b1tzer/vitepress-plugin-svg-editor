/**
 * svgDarkMode 纯函数单元测试
 * 覆盖：lightHexToDark 映射、颜色入口收集、主题应用与恢复
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  lightHexToDark,
  collectSvgColorEntries,
  applySvgTheme,
  type SvgColorEntry,
} from '../../src/core/shared/svgDarkMode'

/** 用 innerHTML 构造含 SVG 的容器，供 collectSvgColorEntries 遍历 */
function makeRoot(inner: string): Element {
  const div = document.createElement('div')
  div.innerHTML = inner
  return div
}

describe('lightHexToDark', () => {
  it('语义色板 hex 应走 LIGHT_TO_DARK 精确映射', () => {
    // #FFFFFF → #1A1A1A（surface-1）
    expect(lightHexToDark('#FFFFFF')).toBe('#1A1A1A')
    // #1565C0 → #5C9CE6（accent-1）
    expect(lightHexToDark('#1565C0')).toBe('#5C9CE6')
  })

  it('非语义裸 hex 应做 OKLCH 亮度翻转（变暗）', () => {
    const dark = lightHexToDark('#FF7F50') // 珊瑚橙，非语义色
    expect(dark).not.toBe('#FF7F50')
  })
})

describe('collectSvgColorEntries', () => {
  it('应收集 fill/stroke 属性与 inline style 的颜色', () => {
    const root = makeRoot(
      '<svg>' +
        '<rect fill="#FF0000"/>' +
        '<circle stroke="#1565C0"/>' +
        '<path style="fill: #00FF00; stroke: #0000FF"/>' +
        '</svg>'
    )
    const entries = collectSvgColorEntries(root)
    const originals = entries.map((e) => e.original.toUpperCase())
    expect(originals).toContain('#FF0000')
    expect(originals).toContain('#1565C0')
    expect(originals).toContain('#00FF00')
    expect(originals).toContain('#0000FF')
  })

  it('应收集渐变 stop 的 stop-color', () => {
    const root = makeRoot(
      '<svg><defs><linearGradient><stop offset="0%" stop-color="#2563EB"/></linearGradient></defs></svg>'
    )
    const entries = collectSvgColorEntries(root)
    expect(entries.length).toBe(1)
    expect(entries[0].original.toUpperCase()).toBe('#2563EB')
  })

  it('应跳过 var()、none、transparent、url()', () => {
    const root = makeRoot(
      '<svg>' +
        '<rect fill="var(--diagram-accent-1)"/>' +
        '<rect fill="none"/>' +
        '<rect fill="transparent"/>' +
        '<rect fill="url(#grad)"/>' +
        '<rect fill="#FF0000"/>' +
        '</svg>'
    )
    const entries = collectSvgColorEntries(root)
    // 只有 #FF0000 会被收集
    expect(entries.length).toBe(1)
    expect(entries[0].original.toUpperCase()).toBe('#FF0000')
  })

  it('inline style 与同名属性同时存在时应只收集 style 一份', () => {
    const root = makeRoot('<svg><rect fill="#111111" style="fill: #FF0000"/></svg>')
    const entries = collectSvgColorEntries(root)
    expect(entries.length).toBe(1)
    expect(entries[0].original.toUpperCase()).toBe('#FF0000')
  })
})

describe('applySvgTheme', () => {
  it('暗色应写入派生值，亮色应恢复原始值', () => {
    let current = '#FF7F50'
    const entry: SvgColorEntry = {
      original: '#FF7F50',
      dark: lightHexToDark('#FF7F50'),
      apply(value: string) {
        current = value
      },
    }
    const entries = [entry]

    applySvgTheme(entries, true) // 暗色
    expect(current).toBe(entry.dark)
    expect(current).not.toBe('#FF7F50')

    applySvgTheme(entries, false) // 亮色恢复
    expect(current).toBe('#FF7F50')
  })
})
