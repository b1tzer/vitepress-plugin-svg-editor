/**
 * arrow-merger.ts 单元测试
 *
 * 覆盖：
 *   1. 相邻 line + polygon 距离 < 30 → 合并为 Group
 *   2. 相邻 line + polygon 距离 ≥ 30 → 不合并
 *   3. 非相邻 line + polygon → 不合并
 *   4. 边界条件：空数组、单对象、没有 line、没有 polygon
 *   5. Group 属性验证（selectable/evented 等）
 */

import { describe, it, expect, vi } from 'vitest'

// ── 模拟 Fabric Group：记录构造函数参数，不调用真实 Group ──
const mockGroupCtor = vi.fn((objects: any[], options: any) => ({
  type: 'group',
  _objects: objects,
  ...options,
}))

vi.mock('fabric', () => ({
  Group: vi.fn((objects: any[], options: any) => mockGroupCtor(objects, options)),
}))

import { mergeArrows } from '../../src/plugins/arrow-merger'

// ── 模拟 Fabric 对象工厂 ──

function makeLine(overrides: Record<string, any> = {}) {
  return {
    type: 'line',
    left: 0,
    top: 0,
    width: 100,
    height: 0,
    x2: 100,
    y2: 0,
    scaleX: 1,
    scaleY: 1,
    ...overrides,
  } as any
}

function makePolygon(overrides: Record<string, any> = {}) {
  return {
    type: 'polygon',
    left: 120,
    top: -5,
    width: 10,
    height: 10,
    scaleX: 1,
    scaleY: 1,
    fill: '#333',
    ...overrides,
  } as any
}

function makeRect(overrides: Record<string, any> = {}) {
  return {
    type: 'rect',
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    scaleX: 1,
    scaleY: 1,
    fill: '#f00',
    ...overrides,
  } as any
}

describe('mergeArrows', () => {
  beforeEach(() => {
    mockGroupCtor.mockClear()
  })

  // ═══════════ 正常合并场景 ═══════════

  it('相邻 line + polygon 且距离 < 30 时应合并为 Group', () => {
    const line = makeLine({ x2: 100, y2: 0 })
    const poly = makePolygon({ left: 105, top: -5 }) // polyCenterX ≈ 110
    const result = mergeArrows([line, poly])

    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('group')
    expect(result[0].selectable).toBe(true)
    expect(result[0].evented).toBe(true)
    expect(mockGroupCtor).toHaveBeenCalledTimes(1)
  })

  it('水平线 + 右端箭头应合并', () => {
    const line = makeLine({
      left: 0,
      top: 0,
      width: 200,
      height: 0,
      x2: 200,
      y2: 0,
    })
    const poly = makePolygon({
      left: 205,
      top: -6,
      width: 10,
      height: 12,
    }) // 中心 (210, 0), 距离 ≈ 10 < 30
    const result = mergeArrows([line, poly])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('group')
  })

  it('垂直线 + 下端箭头应合并', () => {
    const line = makeLine({
      left: 0,
      top: 0,
      width: 0,
      height: 200,
      x2: 0,
      y2: 200,
    })
    const poly = makePolygon({
      left: -5,
      top: 205,
      width: 10,
      height: 10,
      x2: undefined,
    })
    const result = mergeArrows([line, poly])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('group')
  })

  // ═══════════ 不应合并的场景 ═══════════

  it('相邻 line + polygon 但距离 ≥ 30 时应不合并', () => {
    const line = makeLine({ x2: 100, y2: 0 })
    const poly = makePolygon({ left: 300, top: -5 }) // 距离 >> 30
    const result = mergeArrows([line, poly])

    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('line')
    expect(result[1].type).toBe('polygon')
    expect(mockGroupCtor).not.toHaveBeenCalled()
  })

  it('line 后不是 polygon 时应不合并', () => {
    const line = makeLine()
    const rect = makeRect({ left: 120 })
    const result = mergeArrows([line, rect])

    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('line')
    expect(result[1].type).toBe('rect')
  })

  it('polygon 前不是 line 时应不合并', () => {
    const rect = makeRect()
    const poly = makePolygon({ left: 120 })
    const result = mergeArrows([rect, poly])

    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('rect')
    expect(result[1].type).toBe('polygon')
  })

  it('line 和 polygon 不相邻（中间有其他对象）时应不合并', () => {
    const line = makeLine({ x2: 100, y2: 0 })
    const rect = makeRect()
    const poly = makePolygon({ left: 105 }) // 距离近但不相邻
    const result = mergeArrows([line, rect, poly])

    expect(result).toHaveLength(3)
  })

  // ═══════════ 边界条件 ═══════════

  it('空数组应返回空数组', () => {
    expect(mergeArrows([])).toEqual([])
  })

  it('单个 line 对象应原样返回', () => {
    const line = makeLine()
    const result = mergeArrows([line])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('line')
  })

  it('单个 polygon 对象应原样返回', () => {
    const poly = makePolygon()
    const result = mergeArrows([poly])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('polygon')
  })

  it('多个对象中包含多对可合并的 line+polygon', () => {
    // line1: left=0, width=100 → centerX=50; x2=100 → useAbsX2=true → absX2=100
    // poly1 中心应在 (100, 0) 附近 → left=95, top=-5, w=10,h=10 → center (100, 0)
    const line1 = makeLine({ x2: 100, y2: 0 })
    const poly1 = makePolygon({ left: 95, top: -5 })
    // line2: left=200, top=200, width=100 → centerX=250,centerY=200; x2=100 → absX2=100; y2=0 → absY2=200
    // poly2 中心应在 (100, 200) 附近 → left=95, top=195, w=10,h=10 → center (100, 200)
    const line2 = makeLine({ left: 200, top: 200, width: 100, height: 0, x2: 100, y2: 0 })
    const poly2 = makePolygon({ left: 95, top: 195 })
    const result = mergeArrows([line1, poly1, line2, poly2])

    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('group')
    expect(result[1].type).toBe('group')
    expect(mockGroupCtor).toHaveBeenCalledTimes(2)
  })

  it('原始数组中包含非 line/polygon 对象时应保持不动', () => {
    const text = { type: 'text', left: 400, top: 400, text: 'hello' } as any
    const circle = { type: 'circle', left: 500, top: 500, radius: 30 } as any
    const line = makeLine({ x2: 100, y2: 0 })
    const poly = makePolygon({ left: 105, top: -5 })
    const result = mergeArrows([text, circle, line, poly])

    expect(result).toHaveLength(3) // text + circle + group(line+poly)
    expect(result[0].type).toBe('text')
    expect(result[1].type).toBe('circle')
    expect(result[2].type).toBe('group')
  })

  // ═══════════ Group 属性验证 ═══════════

  it('合并后的 Group 应包含正确的 subTargetCheck 和 perPixelTargetFind', () => {
    const line = makeLine({ x2: 100, y2: 0 })
    const poly = makePolygon({ left: 105, top: -5 })
    const result = mergeArrows([line, poly])
    expect(result[0].subTargetCheck).toBe(true)
    expect(result[0].perPixelTargetFind).toBe(false)
  })

  it('Group 构造函数应被传入正确的两个子对象', () => {
    const line = makeLine({ x2: 100, y2: 0 })
    const poly = makePolygon({ left: 105, top: -5 })
    mergeArrows([line, poly])

    expect(mockGroupCtor).toHaveBeenCalledWith(
      [line, poly],
      expect.objectContaining({ selectable: true, evented: true })
    )
  })

  it('3对相邻的 (line, polygon) 应合并为 3 个 group', () => {
    // pair 1: absX2=100, poly center ~ (100, 0)
    const line1 = makeLine({ x2: 100, y2: 0 })
    const poly1 = makePolygon({ left: 95, top: -5 })
    // pair 2: absX2=200, absY2=0, poly center ~ (200, 0)
    const line2 = makeLine({ left: 200, x2: 200, y2: 0 })
    const poly2 = makePolygon({ left: 195, top: -5 })
    // pair 3: absX2=300, absY2=0, poly center ~ (300, 0)
    const line3 = makeLine({ left: 400, x2: 300, y2: 0 })
    const poly3 = makePolygon({ left: 295, top: -5 })
    const result = mergeArrows([line1, poly1, line2, poly2, line3, poly3])

    expect(result).toHaveLength(3)
    expect(mockGroupCtor).toHaveBeenCalledTimes(3)
  })
})
