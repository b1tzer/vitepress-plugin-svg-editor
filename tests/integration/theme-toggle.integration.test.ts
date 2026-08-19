/**
 * 主题切换集成测试（对齐 design/10-test-strategy.md 2.3「ThemeAdapter 集成」）
 *
 * 覆盖 useTheme + CanvasManager + colors 映射的跨模块协同：
 *   亮色 → 暗色切换时，画布对象的 fill/stroke 应按 LIGHT_TO_DARK 映射替换。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fabric from 'fabric'
import { CanvasManager } from '../../src/core/canvas/CanvasManager'
import { useTheme } from '../../src/composables/useTheme'
import { LIGHT_HEX, DARK_HEX } from '../../src/core/shared/colors'

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

  it('亮色 → 暗色切换时，对象 fill/stroke 应映射到暗色 hex', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: LIGHT_HEX['--diagram-accent-1'], // #1565C0
      stroke: LIGHT_HEX['--diagram-stroke-1'], // #BDBDBD
    })
    canvas.add(rect)
    canvas.renderAll()

    const { toggleTheme, themeMode } = useTheme(canvasMgr)
    expect(themeMode.value).toBe('light')

    toggleTheme()

    expect(themeMode.value).toBe('dark')
    expect(String(rect.fill).toUpperCase()).toBe(DARK_HEX['--diagram-accent-1'].toUpperCase())
    expect(String(rect.stroke).toUpperCase()).toBe(DARK_HEX['--diagram-stroke-1'].toUpperCase())
  })

  it('再次切换应从暗色恢复亮色 hex', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: LIGHT_HEX['--diagram-accent-1'],
    })
    canvas.add(rect)
    canvas.renderAll()

    const { toggleTheme } = useTheme(canvasMgr)
    toggleTheme() // light → dark
    toggleTheme() // dark → light

    expect(String(rect.fill).toUpperCase()).toBe(LIGHT_HEX['--diagram-accent-1'].toUpperCase())
  })

  it('无映射的颜色应做自适应亮度翻转（而非保持不变）', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#123456', // 不在映射表中
    })
    canvas.add(rect)
    canvas.renderAll()

    const { toggleTheme } = useTheme(canvasMgr)
    toggleTheme()

    const flipped = String(rect.fill).toUpperCase()
    // 不再是「保持不变」，而是被自适应翻转为另一个色
    expect(flipped).not.toBe('#123456')

    // 亮度方向：#123456 是暗蓝，翻转后应变亮（RGB 总和增大）
    const sum = (hex: string) => {
      const v = parseInt(hex.replace('#', ''), 16)
      return ((v >> 16) & 0xff) + ((v >> 8) & 0xff) + (v & 0xff)
    }
    expect(sum(flipped)).toBeGreaterThan(sum('#123456'))
  })

  it('无映射颜色往返切换应精确恢复（记忆化缓存保证等幂）', () => {
    const canvas = canvasMgr.canvas!
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 80,
      fill: '#FF0000', // 高饱和边界色：OKLCH 翻转会触 sRGB 色域裁剪，需靠缓存恢复
    })
    canvas.add(rect)
    canvas.renderAll()

    const { toggleTheme } = useTheme(canvasMgr)
    toggleTheme() // light → dark
    const darkFill = String(rect.fill).toUpperCase()
    expect(darkFill).not.toBe('#FF0000')

    toggleTheme() // dark → light
    expect(String(rect.fill).toUpperCase()).toBe('#FF0000')
  })

  it('渐变填充的 colorStops 应被映射（语义色精确 + 自定义色自适应）', () => {
    const canvas = canvasMgr.canvas!
    const grad = new fabric.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 100, y2: 0 },
      colorStops: [
        { offset: 0, color: '#1565C0' }, // diagram 语义色
        { offset: 1, color: '#FF0000' }, // 自定义色
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

    const { toggleTheme } = useTheme(canvasMgr)
    toggleTheme()

    const stops = (rect.fill as fabric.Gradient).colorStops
    // 语义色 #1565C0 → 暗色 #5C9CE6（精确映射）
    expect(String(stops[0].color).toUpperCase()).toBe(
      DARK_HEX['--diagram-accent-1'].toUpperCase()
    )
    // 自定义色 #FF0000 被自适应翻转（不再是 #FF0000）
    expect(String(stops[1].color).toUpperCase()).not.toBe('#FF0000')
  })
})
