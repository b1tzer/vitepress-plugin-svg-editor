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

  it('serialize 无语义对象时保留 hex 不还原（语义化 ID：不猜语义）', () => {
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<rect fill="#E1BEE7"/>' +
        '</svg>'
    )
    const result = serializer.serialize(canvas, { theme: 'light' })
    expect(result).toContain('#E1BEE7')
    expect(result).not.toContain('var(--diagram-')
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

  it('serialize 应基于对象 fillLight/strokeLight 将非语义暗色 hex 归一化回亮色真值', () => {
    // 模拟用户在暗色模式下保存：toSVG 输出的是暗色 hex（非语义色）
    mockToSVG.mockReturnValue(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<rect fill="#779CC4" stroke="#0D2137"/>' +
        '</svg>'
    )
    // 暗色态画布对象：当前值为暗色 hex，fillLight/strokeLight 记录亮色真值
    canvas.getObjects = () => [
      { fill: '#779CC4', fillLight: '#123456', stroke: '#0D2137', strokeLight: '#E3F2FD' },
    ]
    const result = serializer.serialize(canvas)

    // 落盘应为亮色真值，而非暗色快照
    expect(result).toContain('#123456')
    expect(result).toContain('#E3F2FD')
    expect(result).not.toContain('#779CC4')
    expect(result).not.toContain('#0D2137')
  })
})
