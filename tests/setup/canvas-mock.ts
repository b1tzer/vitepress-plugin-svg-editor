/**
 * 全局 Canvas 2D mock（happy-dom 环境适配）
 *
 * happy-dom 的 Canvas 2D context 不完整，缺少 Fabric.js 渲染所需的
 * transform / setTransform / getTransform 等方法，导致
 * `_renderBackgroundOrOverlay` 报 `t.transform is not a function`。
 *
 * 本文件在 vitest.config.ts 的 setupFiles 中全局注入，补齐完整 2D 上下文。
 */
import { vi } from 'vitest'

function create2DContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return {
    canvas,
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    createPattern: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    measureText: vi.fn(() => ({ width: 0 })),
    setTransform: vi.fn(),
    transform: vi.fn(),
    getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),
    isPointInPath: vi.fn(() => false),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    font: '12px sans-serif',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'top' as CanvasTextBaseline,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    shadowBlur: 0,
    shadowColor: 'rgba(0,0,0,0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  } as unknown as CanvasRenderingContext2D
}

const origGetContext = HTMLCanvasElement.prototype.getContext

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
  this: HTMLCanvasElement,
  contextId: string,
  ...args: any[]
) {
  if (contextId === '2d') {
    return create2DContext(this)
  }
  return origGetContext.call(this, contextId, ...args) as any
})
