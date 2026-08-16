/**
 * useTheme 单元测试
 * 覆盖：初始主题、主题切换、颜色映射替换、workspace 主题更新
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
  })

  it('无 dark class 时初始主题应为 light', () => {
    const { themeMode } = useTheme(canvasMgr as any)
    expect(themeMode.value).toBe('light')
  })

  it('toggleTheme 应切换主题模式', () => {
    const { themeMode, toggleTheme } = useTheme(canvasMgr as any)
    toggleTheme()
    expect(themeMode.value).toBe('dark')
    toggleTheme()
    expect(themeMode.value).toBe('light')
  })

  it('toggleTheme 应调用 updateWorkspaceTheme（light→dark 传 false）', () => {
    const { toggleTheme } = useTheme(canvasMgr as any)
    toggleTheme()
    expect(canvasMgr.updateWorkspaceTheme).toHaveBeenCalledWith(false)
  })

  it('toggleTheme 应遍历对象替换颜色', () => {
    const obj = {
      type: 'rect',
      fill: '#FFFFFF',
      stroke: '#333333',
      excludeFromExport: false,
      set: vi.fn(),
    }
    canvasMgr.canvas.getObjects.mockReturnValue([obj])

    const { toggleTheme } = useTheme(canvasMgr as any)
    toggleTheme()

    // fill 与 stroke 均为字符串颜色，应触发 set 替换
    expect(obj.set).toHaveBeenCalled()
  })

  it('toggleTheme 应跳过 excludeFromExport 对象', () => {
    const obj = { type: 'rect', fill: '#FFFFFF', stroke: '', excludeFromExport: true, set: vi.fn() }
    canvasMgr.canvas.getObjects.mockReturnValue([obj])

    const { toggleTheme } = useTheme(canvasMgr as any)
    toggleTheme()

    expect(obj.set).not.toHaveBeenCalled()
  })
})
