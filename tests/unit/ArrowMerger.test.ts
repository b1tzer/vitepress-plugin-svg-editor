/**
 * 箭头合并插件单元测试 — mergeArrows
 *
 * 覆盖 line + polygon 合并为 group 的核心逻辑，尤其是「从右到左斜线」
 * （终点在 left/top 边）的坐标换算——该场景曾因按 |x2| 与 width/2 比较的
 * 猜测逻辑被误判为「相对坐标」，导致箭头无法合并。
 */
import { describe, it, expect } from 'vitest'
import { mergeArrows } from '../../src/plugins/arrow-merger'
import * as fabric from 'fabric'

/** 构造一条 fabric Line（x1/y1/x2/y2 为绝对 SVG 坐标） */
function makeLine(x1: number, y1: number, x2: number, y2: number) {
  return new fabric.Line([x1, y1, x2, y2], { stroke: '#000', strokeWidth: 2 })
}

/** 构造一个中心位于 (cx, cy) 的箭头三角形 polygon */
function makeArrowPolygon(cx: number, cy: number) {
  return new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: 8, y: 4 },
      { x: 0, y: 8 },
    ],
    { left: cx - 4, top: cy - 4, fill: '#000' }
  )
}

/** 构造一个普通 rect 对象（非 line/polygon，用于验证不合并场景） */
function makeRect(left: number, top: number) {
  return new fabric.Rect({ left, top, width: 50, height: 50, fill: '#f00' })
}

describe('mergeArrows', () => {
  it('从左到右的水平箭头应合并为 group', () => {
    const line = makeLine(100, 100, 200, 100)
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([line as any, polygon as any])
    expect(result.length).toBe(1)
    expect((result[0] as any).type).toBe('group')
  })

  it('从右到左的斜线箭头（终点在 left 边）应合并为 group', () => {
    // 根→条件A：480,72 → 160,180，终点 x=160 小于起点 x=480。
    // 曾因 |x2|=160 不大于 width/2+5=165 而被误判为「相对坐标」，
    // 导致 absX2 被错误计算为 centerX + x2，箭头无法合并。
    const line = makeLine(480, 72, 160, 180)
    const polygon = makeArrowPolygon(160, 180)
    const result = mergeArrows([line as any, polygon as any])
    expect(result.length).toBe(1)
    expect((result[0] as any).type).toBe('group')
  })

  it('从上到下的竖线箭头应合并为 group', () => {
    const line = makeLine(480, 72, 480, 180)
    const polygon = makeArrowPolygon(480, 180)
    const result = mergeArrows([line as any, polygon as any])
    expect(result.length).toBe(1)
    expect((result[0] as any).type).toBe('group')
  })

  it('line 与 polygon 相距过远（>30px）不应合并', () => {
    const line = makeLine(100, 100, 200, 100)
    const polygon = makeArrowPolygon(400, 100)
    const result = mergeArrows([line as any, polygon as any])
    expect(result.length).toBe(2)
  })

  it('line 后不是 polygon 时不应合并', () => {
    const line = makeLine(100, 100, 200, 100)
    const rect = makeRect(200, 100)
    const result = mergeArrows([line as any, rect as any])
    expect(result.length).toBe(2)
    expect((result[0] as any).type).toBe('line')
    expect((result[1] as any).type).toBe('rect')
  })

  it('polygon 前不是 line 时不应合并', () => {
    const rect = makeRect(100, 100)
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([rect as any, polygon as any])
    expect(result.length).toBe(2)
  })

  it('line 和 polygon 不相邻（中间有其他对象）时不应合并', () => {
    const line = makeLine(100, 100, 200, 100)
    const mid = makeRect(200, 100)
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([line as any, mid as any, polygon as any])
    // line 与 mid(rect) 不合并，mid 与 polygon 也不合并（mid 非 line）
    expect(result.length).toBe(3)
  })

  it('空数组应返回空数组', () => {
    const result = mergeArrows([])
    expect(result.length).toBe(0)
  })

  it('单个 line 对象应原样返回', () => {
    const line = makeLine(100, 100, 200, 100)
    const result = mergeArrows([line as any])
    expect(result.length).toBe(1)
    expect((result[0] as any).type).toBe('line')
  })

  it('单个 polygon 对象应原样返回', () => {
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([polygon as any])
    expect(result.length).toBe(1)
    expect((result[0] as any).type).toBe('polygon')
  })

  it('3 对相邻的 line+polygon 应合并为 3 个 group', () => {
    const l1 = makeLine(100, 100, 200, 100)
    const p1 = makeArrowPolygon(200, 100)
    const l2 = makeLine(100, 200, 200, 200)
    const p2 = makeArrowPolygon(200, 200)
    const l3 = makeLine(100, 300, 200, 300)
    const p3 = makeArrowPolygon(200, 300)
    const result = mergeArrows([
      l1 as any,
      p1 as any,
      l2 as any,
      p2 as any,
      l3 as any,
      p3 as any,
    ])
    expect(result.length).toBe(3)
    expect(result.every((o: any) => o.type === 'group')).toBe(true)
  })

  it('合并后的 group 应设置 selectable/evented/subTargetCheck/perPixelTargetFind', () => {
    const line = makeLine(100, 100, 200, 100)
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([line as any, polygon as any])
    const group = result[0] as any
    expect(group.type).toBe('group')
    expect(group.selectable).toBe(true)
    expect(group.evented).toBe(true)
    expect(group.perPixelTargetFind).toBe(false)
    expect(group.subTargetCheck).toBe(true)
  })

  it('非 line 开头的对象序列保持原样', () => {
    const rect = makeRect(0, 0)
    const polygon = makeArrowPolygon(200, 100)
    const result = mergeArrows([rect as any, polygon as any])
    expect(result.length).toBe(2)
    expect(result[0]).toBe(rect)
  })
})
