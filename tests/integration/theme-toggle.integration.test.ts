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

  it('无映射的颜色应保持不变', () => {
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

    expect(String(rect.fill).toUpperCase()).toBe('#123456')
  })
})
