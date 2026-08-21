/**
 * useTheme 单元测试
 * 覆盖：uiTheme 初始跟随网页 .dark、svgDark 默认亮色、
 * setSvgDark 按住预览 OKLCH 翻转 / 松手恢复亮色真值、workspace 主题更新
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTheme } from '../../src/composables/useTheme'

function createMockCanvasMgr() {
  return {
    canvas: {
      getObjects: vi.fn().mockReturnValue([]),
      requestRenderAll: vi.fn(),
    },
    updateWorkspaceTheme: vi.fn(),
  }
}

describe('useTheme', () => {
  let canvasMgr: ReturnType<typeof createMockCanvasMgr>

  beforeEach(() => {
    canvasMgr = createMockCanvasMgr()
    // 确保干净环境：移除 .dark
    document.documentElement.classList.remove('dark')
  })

  it('无 dark class 时 uiTheme 初始应为 light，svgDark 默认 false', () => {
    const { uiTheme, svgDark } = useTheme(canvasMgr as any)
    expect(uiTheme.value).toBe('light')
    expect(svgDark.value).toBe(false)
  })

  it('setSvgDark(true) 应调用 updateWorkspaceTheme(false)', () => {
    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)
    expect(canvasMgr.updateWorkspaceTheme).toHaveBeenCalledWith(false)
  })

  it('setSvgDark(false) 应调用 updateWorkspaceTheme(true) 恢复亮色', () => {
    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)
    setSvgDark(false)
    expect(canvasMgr.updateWorkspaceTheme).toHaveBeenCalledWith(true)
  })

  it('setSvgDark 相同状态应等幂（不重复触发）', () => {
    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)
    setSvgDark(true)
    expect(canvasMgr.updateWorkspaceTheme).toHaveBeenCalledTimes(1)
  })

  it('setSvgDark(true) 应遍历对象将 fill 做 OKLCH 亮度翻转', () => {
    const obj = {
      type: 'rect',
      fill: '#FFFFFF',
      stroke: '',
      excludeFromExport: false,
      set: vi.fn(),
    }
    canvasMgr.canvas.getObjects.mockReturnValue([obj])

    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)

    // #FFFFFF 经 OKLCH 亮度翻转 → #000000（不再走语义色板映射）
    expect(obj.set).toHaveBeenCalledWith('fill', '#000000')
  })

  it('setSvgDark 往返后应恢复亮色真值', () => {
    const obj = {
      type: 'rect',
      fill: '#FFFFFF',
      stroke: '',
      excludeFromExport: false,
      set: vi.fn(),
    }
    canvasMgr.canvas.getObjects.mockReturnValue([obj])

    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)
    obj.set.mockClear()
    setSvgDark(false)

    // 松手恢复：直接写回 fillLight 亮色真值 #FFFFFF
    expect(obj.set).toHaveBeenCalledWith('fill', '#FFFFFF')
  })

  it('setSvgDark 应跳过 excludeFromExport 对象', () => {
    const obj = { type: 'rect', fill: '#FFFFFF', stroke: '', excludeFromExport: true, set: vi.fn() }
    canvasMgr.canvas.getObjects.mockReturnValue([obj])

    const { setSvgDark } = useTheme(canvasMgr as any)
    setSvgDark(true)

    expect(obj.set).not.toHaveBeenCalled()
  })

  it('syncUiTheme 应根据当前 .dark class 同步 uiTheme', () => {
    const { uiTheme, syncUiTheme } = useTheme(canvasMgr as any)
    expect(uiTheme.value).toBe('light')

    document.documentElement.classList.add('dark')
    syncUiTheme()
    expect(uiTheme.value).toBe('dark')

    document.documentElement.classList.remove('dark')
    syncUiTheme()
    expect(uiTheme.value).toBe('light')
  })

  it('mountUiThemeSync 后，网页 .dark class 变化应自动同步 uiTheme', async () => {
    const { uiTheme, mountUiThemeSync, unmountUiThemeSync } = useTheme(canvasMgr as any)
    mountUiThemeSync()

    document.documentElement.classList.add('dark')
    await vi.waitFor(() => {
      expect(uiTheme.value).toBe('dark')
    })

    document.documentElement.classList.remove('dark')
    await vi.waitFor(() => {
      expect(uiTheme.value).toBe('light')
    })

    unmountUiThemeSync()
  })

  it('unmountUiThemeSync 后，class 变化不再触发 uiTheme 同步', async () => {
    const { uiTheme, mountUiThemeSync, unmountUiThemeSync } = useTheme(canvasMgr as any)
    mountUiThemeSync()
    unmountUiThemeSync()

    document.documentElement.classList.add('dark')
    // 等待足够的异步周期，确保即便有残留 observer 也已触发完毕
    await new Promise((r) => setTimeout(r, 20))
    expect(uiTheme.value).toBe('light')
  })
})
