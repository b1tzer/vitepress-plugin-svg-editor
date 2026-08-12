/**
 * 策略模式单元测试
 * 覆盖 SnappingStrategy / HitTestStrategy / ExportStrategy
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fabric from 'fabric'
import {
  DefaultSnappingStrategy,
  type ISnappingStrategy,
} from '../../src/core/strategies/SnappingStrategy'
import {
  DefaultHitTestStrategy,
  ExtendedHitTestStrategy,
  SvgExportStrategy,
  type IExportStrategy,
} from '../../src/core/strategies/HitTestStrategy'

// ── Canvas mock ──
function setupCanvasMock() {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string,
  ) {
    if (contextId === '2d') {
      return {
        canvas: this, fillRect: vi.fn(), clearRect: vi.fn(), scale: vi.fn(),
        translate: vi.fn(), rotate: vi.fn(), save: vi.fn(), restore: vi.fn(),
        beginPath: vi.fn(), closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
        arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
        measureText: () => ({ width: 50 }), clip: vi.fn(), drawImage: vi.fn(),
        setLineDash: vi.fn(), getLineDash: () => [], createLinearGradient: () => ({}),
        rect: vi.fn(), isPointInPath: () => false,
      } as any
    }
    return null as any
  })
}

// ═══════════════════════════════════════════════════════════════
// SnappingStrategy
// ═══════════════════════════════════════════════════════════════

describe('DefaultSnappingStrategy', () => {
  const strategy = new DefaultSnappingStrategy()

  it('中心对齐 → 应返回垂直辅助线', () => {
    const guidlines = strategy.calculateSnap(
      { left: 100, top: 50, right: 150, bottom: 100, centerX: 125, centerY: 75 },
      [makeMockOther(125, 200)],
    )
    expect(guidlines.guidelines.some(g => g.type === 'vertical')).toBe(true)
  })

  it('边缘对齐（left=left）→ 应返回垂直辅助线', () => {
    // makeMockOther(125, 50) → left=100 (125-25), 与 objBounds.left 对齐
    const result = strategy.calculateSnap(
      { left: 100, top: 50, right: 150, bottom: 100, centerX: 125, centerY: 75 },
      [makeMockOther(125, 50)],
    )
    expect(result.guidelines.length).toBeGreaterThan(0)
  })

  it('距离超过阈值 → 不吸附', () => {
    const result = strategy.calculateSnap(
      { left: 100, top: 50, right: 150, bottom: 100, centerX: 125, centerY: 75 },
      [makeMockOther(500, 500)],
      5,
    )
    expect(result.guidelines).toHaveLength(0)
    expect(result.snapX).toBeNull()
    expect(result.snapY).toBeNull()
  })

  it('同时水平和垂直吸附', () => {
    const result = strategy.calculateSnap(
      { left: 100, top: 50, right: 150, bottom: 100, centerX: 125, centerY: 75 },
      [makeMockOther(125, 75)],
    )
    // 中心对齐：水平和垂直都有
    const hasVertical = result.guidelines.some(g => g.type === 'vertical')
    const hasHorizontal = result.guidelines.some(g => g.type === 'horizontal')
    expect(hasVertical).toBe(true)
    expect(hasHorizontal).toBe(true)
  })

  it('空对象列表 → 无辅助线', () => {
    const result = strategy.calculateSnap(
      { left: 0, top: 0, right: 10, bottom: 10, centerX: 5, centerY: 5 },
      [],
    )
    expect(result.guidelines).toHaveLength(0)
  })
})

// ── 辅助函数：创建 mock other 对象 ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeMockOther(centerX: number, centerY: number): any {
  const w = 50
  const h = 50
  return {
    left: centerX - w / 2,
    top: centerY - h / 2,
    width: w,
    height: h,
    scaleX: 1,
    scaleY: 1,
    getBoundingRect() {
      return {
        left: this.left * this.scaleX,
        top: this.top * this.scaleY,
        width: this.width * this.scaleX,
        height: this.height * this.scaleY,
      }
    },
  }
}

// ═══════════════════════════════════════════════════════════════
// HitTestStrategy
// ═══════════════════════════════════════════════════════════════

describe('DefaultHitTestStrategy', () => {
  it('点击在对象内部 → 命中', () => {
    const s = new DefaultHitTestStrategy()
    const obj = { getBoundingRect: () => ({ left: 100, top: 100, width: 50, height: 50 }) } as any
    expect(s.hitTest(obj, { x: 120, y: 120 })).toBe(true)
  })

  it('点击在对象外部 → 未命中', () => {
    const s = new DefaultHitTestStrategy()
    const obj = { getBoundingRect: () => ({ left: 100, top: 100, width: 50, height: 50 }) } as any
    expect(s.hitTest(obj, { x: 10, y: 10 })).toBe(false)
  })

  it('点击在边缘 → 命中', () => {
    const s = new DefaultHitTestStrategy()
    const obj = { getBoundingRect: () => ({ left: 100, top: 100, width: 50, height: 50 }) } as any
    expect(s.hitTest(obj, { x: 100, y: 100 })).toBe(true)
  })
})

describe('ExtendedHitTestStrategy', () => {
  it('无填充对象也应命中', () => {
    const s = new ExtendedHitTestStrategy()
    const obj = {
      fill: 'none' as any,
      getBoundingRect: () => ({ left: 100, top: 100, width: 50, height: 50 }),
    } as any
    expect(s.hitTest(obj, { x: 120, y: 120 })).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════
// ExportStrategy
// ═══════════════════════════════════════════════════════════════

describe('SvgExportStrategy', () => {
  const strategy = new SvgExportStrategy()

  it('应调用 canvas.toSVG()', () => {
    const mockCanvas = {
      toSVG: vi.fn(() => '<svg>content</svg>'),
    }
    const result = strategy.serialize(mockCanvas)
    expect(mockCanvas.toSVG).toHaveBeenCalled()
    expect(result).toBe('<svg>content</svg>')
  })

  it('有 viewBox 时应注入', () => {
    const mockCanvas = {
      toSVG: vi.fn(() => '<svg width="100" height="100">content</svg>'),
    }
    const result = strategy.serialize(mockCanvas, '0 0 100 100')
    expect(result).toContain('viewBox="0 0 100 100"')
  })

  it('无 viewBox 时不应注入', () => {
    const mockCanvas = {
      toSVG: vi.fn(() => '<svg>content</svg>'),
    }
    const result = strategy.serialize(mockCanvas)
    expect(result).toBe('<svg>content</svg>')
  })
})
