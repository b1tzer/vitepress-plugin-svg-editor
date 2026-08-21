/**
 * 主题切换集成测试（对齐 design/10-test-strategy.md 2.3「ThemeAdapter 集成」）
 *
 * 覆盖 useTheme + CanvasManager + OKLCH 算法变色的跨模块协同：
 *   按住预览切暗时，画布对象的 fill/stroke 应经 OKLCH 亮度翻转；
 *   松手恢复时直接写回亮色真值。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fabric from 'fabric'
import { CanvasManager } from '../../src/core/canvas/CanvasManager'
import { useTheme } from '../../src/composables/useTheme'
import { lightHexToDark } from '../../src/core/shared/colors'

describe('主题切换集成测试', () => {
  let canvasEl: HTMLCanvasElement
  let canvasMgr: CanvasManager

  beforeEach(() => {
    canvasEl = document.createElement('canvas')
    canvasEl.width = 800
    canvasEl.height = 600
    document.body.appendChild(canvasEl)

    canvasMgr = new CanvasManager()
    canvasMgr.canvas = new fabric.Canvas(canvasEl, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false,
    })
  })

  afterEach(() => {
    canvasMgr.dispose()
    document.body.removeChild(canvasEl)
  })

  it('按住预览切暗时，对象 fill/stroke 应做 OKLCH 亮度翻转', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#1565C0',
      stroke: '#BDBDBD',
    })
    canvas.add(rect)
    canvas.renderAll()

    const { svgDark, setSvgDark } = useTheme(canvasMgr)
    expect(svgDark.value).toBe(false)

    setSvgDark(true)

    expect(svgDark.value).toBe(true)
    expect(String(rect.fill).toUpperCase()).toBe(lightHexToDark('#1565C0').toUpperCase())
    expect(String(rect.stroke).toUpperCase()).toBe(lightHexToDark('#BDBDBD').toUpperCase())
  })

  it('松手恢复时应从暗色恢复亮色真值', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#1565C0',
    })
    canvas.add(rect)
    canvas.renderAll()

    const { setSvgDark } = useTheme(canvasMgr)
    setSvgDark(true) // 按住切暗
    setSvgDark(false) // 松手恢复亮色

    expect(String(rect.fill).toUpperCase()).toBe('#1565C0')
  })

  it('任意颜色都应做自适应亮度翻转（而非保持不变）', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#123456',
    })
    canvas.add(rect)
    canvas.renderAll()

    const { setSvgDark } = useTheme(canvasMgr)
    setSvgDark(true)

    const flipped = String(rect.fill).toUpperCase()
    expect(flipped).not.toBe('#123456')

    // 亮度方向：#123456 是暗蓝，翻转后应变亮（RGB 总和增大）
    const sum = (hex: string) => {
      const v = parseInt(hex.replace('#', ''), 16)
      return ((v >> 16) & 0xff) + ((v >> 8) & 0xff) + (v & 0xff)
    }
    expect(sum(flipped)).toBeGreaterThan(sum('#123456'))
  })

  it('颜色往返切换应精确恢复（亮色真值锚定保证等幂）', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#FF0000', // 高饱和边界色：OKLCH 翻转会触 sRGB 色域裁剪
    })
    canvas.add(rect)
    canvas.renderAll()

    const { setSvgDark } = useTheme(canvasMgr)
    setSvgDark(true) // 按住切暗
    const darkFill = String(rect.fill).toUpperCase()
    expect(darkFill).not.toBe('#FF0000')

    setSvgDark(false) // 松手恢复
    expect(String(rect.fill).toUpperCase()).toBe('#FF0000')
  })

  it('渐变填充的 colorStops 应做 OKLCH 亮度翻转', () => {
    const canvas = canvasMgr.canvas!
    const grad = new fabric.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 100, y2: 0 },
      colorStops: [
        { offset: 0, color: '#1565C0' },
        { offset: 1, color: '#FF0000' },
      ],
    })
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: grad,
    })
    canvas.add(rect)
    canvas.renderAll()

    const { setSvgDark } = useTheme(canvasMgr)
    setSvgDark(true)

    const stops = (rect.fill as fabric.Gradient).colorStops
    // 纯算法：一律 OKLCH 翻转（不再是语义色板精确映射）
    expect(String(stops[0].color).toUpperCase()).toBe(lightHexToDark('#1565C0').toUpperCase())
    expect(String(stops[1].color).toUpperCase()).not.toBe('#FF0000')
  })
})
