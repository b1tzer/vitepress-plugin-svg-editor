/**
 * preprocessor 单元测试 — 覆盖各步骤函数
 */
import { describe, it, expect } from 'vitest'
import { preprocessSvg } from '../../src/core/preprocessor'

const baseSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#FF0000"/></svg>'

describe('preprocessSvg', () => {
  it('应正确提取 viewBox 和尺寸', () => {
    const result = preprocessSvg(baseSvg, 'light')
    expect(result.originalViewBox).toBe('0 0 200 200')
    expect(result.svgWidth).toBe(200)
    expect(result.svgHeight).toBe(200)
  })

  it('应移除 <?xml?> 声明', () => {
    const svg = '<?xml version="1.0"?>\n' + baseSvg
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('<?xml')
  })

  it('应转换 CSS 变量为 hex（亮色主题）', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-surface-1)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('var(--diagram-surface-1)')
    expect(result.svg).toContain('#FFFFFF')
  })

  it('应转换 CSS 变量为 hex（暗色主题）', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-surface-1)"/></svg>'
    const result = preprocessSvg(svg, 'dark')
    expect(result.svg).toContain('#1a1a1a')
  })

  it('应处理 <stop style="stop-color:...">', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g"><stop offset="0%" style="stop-color:#ff0000;stop-opacity:1"/></linearGradient></defs><rect fill="url(#g)" width="100" height="100"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('stop-color="#ff0000"')
  })

  it('应处理无 viewBox 的 SVG', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('<circle')
    expect(result.originalViewBox).toBe('')
  })

  it('viewBox 含逗号分隔符时应正确解析', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="10,20,300,400"><rect/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svgWidth).toBe(300)
    expect(result.svgHeight).toBe(400)
  })

  it('应处理带 marker-end 的 <line>（注入箭头三角形）', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="4" refY="4"><polygon points="0,0 10,4 0,8" fill="#000"/></marker></defs><line x1="0" y1="0" x2="100" y2="100" stroke="#000" marker-end="url(#arrow)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    // 应该生成了 <polygon> 箭头
    expect(result.svg).toContain('<polygon')
    // 原始 line 的 marker-end 已被移除
    expect(result.svg).not.toContain('marker-end')
  })
})