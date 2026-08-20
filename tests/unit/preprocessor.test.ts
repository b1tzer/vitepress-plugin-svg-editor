/**
 * preprocessor 单元测试 — 覆盖各步骤函数
 */
import { describe, it, expect } from 'vitest'
import { preprocessSvg } from '../../src/core/serialization/preprocessor'

const baseSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#FF0000"/></svg>'

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
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-surface-1)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('var(--diagram-surface-1)')
    expect(result.svg).toContain('#FFFFFF')
  })

  it('应转换 CSS 变量为 hex（暗色主题）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-surface-1)"/></svg>'
    const result = preprocessSvg(svg, 'dark')
    expect(result.svg).toContain('#1a1a1a')
  })

  it('应解析带 fallback 的外部 CSS 变量为 fallback 值', () => {
    // 例如 VitePress 的 var(--vp-c-brand-1, #2563eb)，不在 --diagram-* 映射表中，
    // 应取 fallback #2563eb，避免 var() 字符串被 Fabric 当作非法颜色渲染为透明
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--vp-c-brand-1, #2563eb)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('var(')
    expect(result.svg).toContain('#2563eb')
  })

  it('应处理 <stop style="stop-color:...">', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g"><stop offset="0%" style="stop-color:#ff0000;stop-opacity:1"/></linearGradient></defs><rect fill="url(#g)" width="100" height="100"/></svg>'
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
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="4" refY="4"><polygon points="0,0 10,4 0,8" fill="#000"/></marker></defs><line x1="0" y1="0" x2="100" y2="100" stroke="#000" marker-end="url(#arrow)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    // 应该生成了 <polygon> 箭头
    expect(result.svg).toContain('<polygon')
    // 原始 line 的 marker-end 已被移除
    expect(result.svg).not.toContain('marker-end')
  })

  it('应处理 DOMPurify 清洗后的成对 <line></line> 标签（注入箭头三角形）', () => {
    // DOMPurify 会把自闭合 <line/> 序列化为成对 <line></line>，
    // injectLineArrows 必须兼容这种形式，否则 marker 箭头会在真实浏览器中丢失。
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="4" refY="4"><polygon points="0,0 10,4 0,8" fill="#000"/></marker></defs><line x1="0" y1="0" x2="100" y2="100" stroke="#000" marker-end="url(#arrow)"></line></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('<polygon')
    expect(result.svg).not.toContain('marker-end')
  })

  it('应处理 DOMPurify 清洗后的成对 <path></path> 标签（注入箭头三角形）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="4" refY="4"><polygon points="0,0 10,4 0,8" fill="#000"/></marker></defs><path d="M0 0 L100 100" stroke="#000" marker-end="url(#arrow)"></path></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('<polygon')
    expect(result.svg).not.toContain('marker-end')
  })

  it('应移除全画布透明背景占位 rect（width/height=100%）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 442 408"><g><rect x="0" y="0" width="100%" height="100%" fill="transparent"></rect><rect x="10" y="10" width="100" height="50" fill="#FF0000"/></g></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('width="100%"')
    expect(result.svg).toContain('fill="#FF0000"')
  })

  it('应移除 fill="none" 的不可见占位 rect', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 289"><rect x="484" y="187" width="24" height="68" fill="none"/><rect x="51" y="41" width="85" height="31" fill="#333333" rx="3"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('fill="none"')
    expect(result.svg).toContain('fill="#333333"')
  })

  it('应解析单引号 viewBox', () => {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'><rect/></svg>"
    const result = preprocessSvg(svg, 'light')
    expect(result.originalViewBox).toBe('0 0 320 240')
    expect(result.svgWidth).toBe(320)
    expect(result.svgHeight).toBe(240)
  })

  it('应解析 viewBox 属性在 xmlns 之前的情况', () => {
    const svg = '<svg viewBox="0 0 128 64" xmlns="http://www.w3.org/2000/svg"><rect/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.originalViewBox).toBe('0 0 128 64')
  })

  it('应解析 marker 属性顺序打乱的 SVG', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><marker refY="4" id="arrow" refX="4" markerHeight="8" markerWidth="10"><polygon fill="#000" points="0,0 10,4 0,8"/></marker></defs><line x1="0" y1="0" x2="100" y2="0" stroke="#000" marker-end="url(#arrow)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('<polygon')
    expect(result.svg).not.toContain('marker-end')
  })

  it('不应误删 fill-opacity 非 0 的 rect', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" style="stroke:none;fill-opacity:0.5" fill="#FF0000"/></svg>'
    const result = preprocessSvg(svg, 'light')
    // fill-opacity 为 0.5（半透明可见），不应被当作不可见占位移除
    expect(result.svg).toContain('fill-opacity:0.5')
  })

  it('应移除 fill-opacity 精确为 0 的不可见占位 rect', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" style="stroke:none;fill-opacity:0"/><rect x="10" y="10" width="20" height="20" fill="#00FF00"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('fill-opacity:0')
    expect(result.svg).toContain('fill="#00FF00"')
  })

  // ── 语义化颜色 ID：打标记 ──
  it('应保留语义标记：fill 属性打 data-fill-var', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-accent-1)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('fill="#1565C0" data-fill-var="--diagram-accent-1"')
  })

  it('应保留语义标记：stroke 属性打 data-stroke-var', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect stroke="var(--diagram-accent-1)"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).toContain('stroke="#1565C0" data-stroke-var="--diagram-accent-1"')
  })

  // ── 第二步（可选）：hex 精确匹配 → 语义 token ──
  it('第二步开关关闭时（默认）不对裸 hex 打语义标记', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#1565C0"/></svg>'
    const result = preprocessSvg(svg, 'light')
    expect(result.svg).not.toContain('data-fill-var')
  })

  it('第二步开关开启时对精确命中的裸 hex 打语义标记', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#1565C0"/></svg>'
    const result = preprocessSvg(svg, 'light', { mapHexToVar: true })
    expect(result.svg).toContain('fill="#1565C0" data-fill-var="--diagram-accent-1"')
  })

  it('第二步开关开启时跨主题升级：暗色 hex 在亮色主题下也能命中', () => {
    // 边界 2 修复：写死色板色无论当前主题，只要无歧义命中明/暗任一色板即升级
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#5C9CE6"/></svg>'
    const result = preprocessSvg(svg, 'light', { mapHexToVar: true })
    expect(result.svg).toContain('fill="#5C9CE6" data-fill-var="--diagram-accent-1"')
  })

  it('第二步开关开启时跳过撞色 hex（#E1BEE7）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#E1BEE7"/></svg>'
    const result = preprocessSvg(svg, 'light', { mapHexToVar: true })
    expect(result.svg).not.toContain('data-fill-var')
  })

  it('第二步开关开启时不做近似匹配（非色板 hex 不打标记）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#123456"/></svg>'
    const result = preprocessSvg(svg, 'light', { mapHexToVar: true })
    expect(result.svg).not.toContain('data-fill-var')
  })

  // ── 纯算法模式（colorMode: 'algorithm'）──
  it('纯算法模式：var() 应替换为 hex 但不打语义标记', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="var(--diagram-accent-1)"/></svg>'
    const result = preprocessSvg(svg, 'light', { colorMode: 'algorithm' })
    expect(result.svg).not.toContain('var(--diagram-accent-1)')
    expect(result.svg).toContain('fill="#1565C0"')
    expect(result.svg).not.toContain('data-fill-var')
  })

  it('纯算法模式：stroke var() 也不打语义标记', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect stroke="var(--diagram-accent-1)"/></svg>'
    const result = preprocessSvg(svg, 'light', { colorMode: 'algorithm' })
    expect(result.svg).toContain('stroke="#1565C0"')
    expect(result.svg).not.toContain('data-stroke-var')
  })

  it('纯算法模式：mapHexToVar 应被忽略（裸 hex 不打语义标记）', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#1565C0"/></svg>'
    const result = preprocessSvg(svg, 'light', { mapHexToVar: true, colorMode: 'algorithm' })
    expect(result.svg).toContain('fill="#1565C0"')
    expect(result.svg).not.toContain('data-fill-var')
  })
})
