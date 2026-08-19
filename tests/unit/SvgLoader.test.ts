import { describe, it, expect, vi, afterEach } from 'vitest'
import { SvgLoader } from '../../src/core/serialization/SvgLoader'

// DOMPurify 依赖浏览器原生 DOM 解析器做 SVG 命名空间解析；happy-dom 的
// DOM 解析器对 SVG 支持不完整，DOMPurify 官方明确不建议与 happy-dom 组合。
// 因此单测中 mock DOMPurify，聚焦验证 SvgLoader 的编排逻辑（大小校验 →
// 清洗 → 预处理链）。DOMPurify 的真实清洗效果由 E2E（真实浏览器）验证。
vi.mock('dompurify', () => {
  return {
    default: {
      sanitize: (dirty: string) =>
        dirty
          // 模拟 DOMPurify 在真实浏览器中对 SVG 的清洗结果
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '')
          .replace(/\s+on\w+\s*=\s*'[^']*'/gi, '')
          .replace(/@import\s+url\s*\([^)]*\)\s*;?/gi, ''),
    },
  }
})

// 最小合法 SVG
const baseSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FF0000"/></svg>'

describe('SvgLoader', () => {
  const loader = new SvgLoader()

  it('应正确加载合法 SVG', () => {
    const result = loader.load(baseSvg, 'light')
    expect(result.svg).toContain('<svg')
    expect(result.svg).toContain('<rect')
    expect(result.svgWidth).toBe(100)
    expect(result.svgHeight).toBe(100)
    expect(result.originalViewBox).toBe('0 0 100 100')
  })

  it('应支持含 <?xml?> 声明的 SVG', () => {
    const withXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + baseSvg
    const result = loader.load(withXml, 'light')
    // <?xml?> 应被移除
    expect(result.svg).not.toContain('<?xml')
    expect(result.svg).toContain('<svg')
  })

  it('应正确解析 viewBox', () => {
    const result = loader.load(baseSvg, 'light')
    expect(result.originalViewBox).toBe('0 0 100 100')
  })

  it('应处理无 viewBox 的 SVG', () => {
    const noViewBox =
      '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>'
    const result = loader.load(noViewBox, 'dark')
    expect(result.svg).toContain('<circle')
  })

  it('应正确传递 theme 参数', () => {
    // 暗色模式：CSS 变量应映射为暗色 hex 值
    const lightResult = loader.load(baseSvg, 'light')
    const darkResult = loader.load(baseSvg, 'dark')
    // 两者都应返回 SVG 字符串
    expect(lightResult.svg).toBeTruthy()
    expect(darkResult.svg).toBeTruthy()
  })

  it('应保持 SVG 结构完整性', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><g><path d="M10 10 L90 90"/><text x="20" y="50">Hello</text></g></svg>'
    const result = loader.load(svg, 'light')
    expect(result.svg).toContain('<path')
    expect(result.svg).toContain('<text')
    expect(result.svgWidth).toBe(200)
    expect(result.svgHeight).toBe(300)
  })

  // 🔒 安全测试（验证 SvgLoader 将清洗结果用于预处理链）
  it('应移除 <script> 标签防止 XSS', () => {
    const malicious =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><script>alert("xss")</script><rect/></svg>'
    const result = loader.load(malicious, 'light')
    expect(result.svg).not.toContain('<script')
    expect(result.svg).not.toContain('alert')
  })

  it('应移除内联事件处理器（onclick/onload 等）', () => {
    const malicious =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect onclick="alert(1)" onload="bad()"/></svg>'
    const result = loader.load(malicious, 'light')
    expect(result.svg).not.toContain('onclick')
    expect(result.svg).not.toContain('onload')
  })

  it('应移除 CSS @import 外部引用防止 CSS 注入', () => {
    const malicious =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>@import url(http://evil.com/bad.css);</style><rect/></svg>'
    const result = loader.load(malicious, 'light')
    expect(result.svg).not.toContain('@import')
  })

  it('应拒绝超过 10MB 的 SVG 文件', () => {
    const hugeSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      'A'.repeat(11 * 1024 * 1024) +
      '</svg>'
    expect(() => loader.load(hugeSvg, 'light')).toThrow(/过大/)
  })
})

// ── loadFromUrl：封装 fetch + 清洗 + 预处理（issue #19 P1）──
describe('SvgLoader.loadFromUrl', () => {
  const loader = new SvgLoader()

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('应从 URL 拉取并加载 SVG', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(baseSvg),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await loader.loadFromUrl('/diagrams/foo.svg', 'light')
    expect(fetchMock).toHaveBeenCalledWith('/diagrams/foo.svg')
    expect(result.svg).toContain('<svg')
    expect(result.svgWidth).toBe(100)
    expect(result.svgHeight).toBe(100)
  })

  it('HTTP 非 2xx 时应抛出错误', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(loader.loadFromUrl('/missing.svg', 'light')).rejects.toThrow(/404/)
  })

  it('应将 theme 参数透传给 load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: vi.fn().mockResolvedValue(baseSvg) })
    )
    const loadSpy = vi.spyOn(loader, 'load')
    await loader.loadFromUrl('/diagrams/foo.svg', 'dark')
    expect(loadSpy).toHaveBeenCalledWith(baseSvg, 'dark', {})
    loadSpy.mockRestore()
  })
})
