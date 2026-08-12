/**
 * 策略模式单元测试
 * 覆盖 SnappingStrategy / HitTestStrategy / ExportStrategy
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fabric from 'fabric'
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
