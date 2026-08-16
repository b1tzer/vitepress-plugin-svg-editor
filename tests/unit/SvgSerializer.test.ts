import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fabric.Canvas
const mockToSVG = vi.fn(
  () =>
    '<svg xmlns="http://www.w3.org/2000/svg">\n<g>\n<rect fill="#ff0000" data-fabric-object="true"/>\n</g>\n</svg>'
)
const createMockCanvas = () => ({ toSVG: mockToSVG }) as any

vi.mock('fabric', () => ({}))

import { SvgSerializer } from '../../src/core/serialization/SvgSerializer'

describe('SvgSerializer', () => {
  let serializer: SvgSerializer
  let canvas: any

  beforeEach(() => {
    serializer = new SvgSerializer()
    canvas = createMockCanvas()
    vi.clearAllMocks()
    // 默认返回一个带 Fabric 私有属性的 SVG
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n' +
        '  <g>\n' +
        '    <rect fill="#ff0000" stroke="#000000" data-fabric-object="true"/>\n' +
        '  </g>\n' +
        '</svg>'
    )
  })

  it('serialize 应调用 canvas.toSVG()', () => {
    const result = serializer.serialize(canvas)
    expect(mockToSVG).toHaveBeenCalled()
    expect(result).toBeTruthy()
  })

  it('serialize 应移除 XML 声明和多余头部信息', () => {
    mockToSVG.mockReturnValue(
      '<?xml version="1.0"?>\n' +
        '<!DOCTYPE svg>\n' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n' +
        '  <rect fill="#ff0000"/>\n' +
        '</svg>'
    )
    const result = serializer.serialize(canvas)
    expect(result).not.toContain('<?xml')
    expect(result).not.toContain('<!DOCTYPE')
  })

  it('serialize 应将 rgb 转换为 hex', () => {
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg">' +
        '<rect fill="rgb(255,0,0)" stroke="rgb(0,0,0)"/>' +
        '</svg>'
    )
    const result = serializer.serialize(canvas)
    expect(result).not.toContain('rgb(')
  })

  it('serialize 应恢复 viewBox', () => {
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
        '<rect fill="#ff0000"/>' +
        '</svg>'
    )
    const result = serializer.serialize(canvas, { originalViewBox: '0 0 1000 800' })
    expect(result).toContain('viewBox="0 0 1000 800"')
  })

  it('serialize 应支持关闭 CSS 变量还原', () => {
    const result = serializer.serialize(canvas, { restoreCssVars: false })
    expect(result).toBeTruthy()
  })

  it('serialize 应移除外层空白', () => {
    const result = serializer.serialize(canvas)
    // trim() 后不应以空白开头或结尾
    expect(result).toBe(result.trim())
    expect(result.startsWith('<svg')).toBe(true)
  })

  it('serialize 应处理空 viewBox 的情况', () => {
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg">' + '<rect fill="#ff0000"/>' + '</svg>'
    )
    const result = serializer.serialize(canvas)
    expect(result).toContain('<svg')
    expect(result).toContain('<rect')
  })
})
