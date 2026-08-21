/**
 * useSelection 单元测试 — 覆盖 reactive 收敛后的选中属性状态同步（issue #19 P2）
 *
 * 聚焦验证 updateSelectionInfo 将 Fabric 选中对象属性同步到单一 reactive state：
 *   - 空态 / 单对象 / 多选（ActiveSelection）的 selectionInfo 文案
 *   - hasTextInSelection（单文本 / 多选含文本）
 *   - 填充 / 描边 / 线宽 / 虚线 / 旋转 / 透明度
 *   - 渐变（linear/radial）与无渐变
 *   - 阴影存在 / 不存在
 *   - 文本对象的字号 / 字重 / 斜体 / 下划线 / 对齐 / 颜色
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSelection } from '../../src/composables/useSelection'

// mock text-format 插件：useSelection 依赖 getTextObjects 提取文本属性
vi.mock('../../src/plugins/text-format', () => ({
  getTextObjects: vi.fn(() => []),
}))

import * as TextFormatPlugin from '../../src/plugins/text-format'

/** 构造带 getActiveObject 的 mock canvas */
function createMockCanvas(active: unknown = null) {
  return {
    getActiveObject: vi.fn().mockReturnValue(active),
  }
}

/** 构造 mock canvasMgr */
function createMockCanvasMgr(active: unknown = null) {
  return { canvas: createMockCanvas(active) }
}

describe('useSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 默认：无文本对象
    ;(TextFormatPlugin.getTextObjects as any).mockReturnValue([])
  })

  it('canvas 为 null 时 updateSelectionInfo 不应抛错', () => {
    const { updateSelectionInfo } = useSelection({ canvas: null } as any)
    expect(() => updateSelectionInfo()).not.toThrow()
  })

  it('无选中对象时 selectionInfo 应为空字符串', () => {
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(null) as any)
    updateSelectionInfo()
    expect(state.selectionInfo).toBe('')
  })

  it('选中单个 rect 时应同步类型文案且 hasTextInSelection 为 false', () => {
    const active = {
      type: 'rect',
      fill: '#ff0000',
      stroke: '#000000',
      strokeWidth: 2,
      angle: 45,
      opacity: 0.5,
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()

    expect(state.selectionInfo).toBe('rect')
    expect(state.hasTextInSelection).toBe(false)
    expect(state.currentFill).toBe('#ff0000')
    expect(state.currentStroke).toBe('#000000')
    expect(state.currentStrokeWidth).toBe(2)
    expect(state.currentRotation).toBe(45)
    expect(state.currentOpacity).toBe(50)
  })

  it('选中多选（ActiveSelection）时 selectionInfo 应为「N 个选中」', () => {
    const active = {
      type: 'activeselection',
      _objects: [{ type: 'rect' }, { type: 'circle' }, { type: 'rect' }],
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.selectionInfo).toBe('3 个选中')
  })

  it('多选中包含文本对象时 hasTextInSelection 应为 true', () => {
    const active = {
      type: 'activeselection',
      _objects: [{ type: 'rect' }, { type: 'textbox' }],
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.hasTextInSelection).toBe(true)
  })

  it('选中 textbox 时 hasTextInSelection 应为 true', () => {
    const active = { type: 'textbox' }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.hasTextInSelection).toBe(true)
  })

  it('strokeDashArray 存在时 currentStrokeDash 应为 true', () => {
    const active = { type: 'rect', strokeDashArray: [6, 3] }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.currentStrokeDash).toBe(true)
  })

  it('fill 为 linear 渐变时应同步渐变类型/角度/颜色', () => {
    const active = {
      type: 'rect',
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 100, y2: 0 },
        colorStops: [{ color: '#111111' }, { color: '#222222' }],
      },
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()

    expect(state.gradientType).toBe('linear')
    expect(state.gradientAngle).toBe(0) // 水平方向 atan2(0,100)=0°
    expect(state.gradientColor1).toBe('#111111')
    expect(state.gradientColor2).toBe('#222222')
  })

  it('fill 为 radial 渐变时 angle 应为 0', () => {
    const active = {
      type: 'rect',
      fill: {
        type: 'radial',
        coords: { x1: 0, y1: 0, x2: 0, y2: 0 },
        colorStops: [{ color: '#111111' }, { color: '#222222' }],
      },
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.gradientType).toBe('radial')
    expect(state.gradientAngle).toBe(0)
  })

  it('无渐变（纯色 fill）时 gradientType 应为 none', () => {
    const active = { type: 'rect', fill: '#ff0000' }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.gradientType).toBe('none')
  })

  it('shadow 存在时应同步阴影属性', () => {
    const active = {
      type: 'rect',
      shadow: { color: '#333333', blur: 8, offsetX: 5, offsetY: 6 },
    }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()

    expect(state.shadowEnabled).toBe(true)
    expect(state.shadowColor).toBe('#333333')
    expect(state.shadowBlur).toBe(8)
    expect(state.shadowOffsetX).toBe(5)
    expect(state.shadowOffsetY).toBe(6)
  })

  it('无 shadow 时 shadowEnabled 应为 false', () => {
    const active = { type: 'rect', shadow: null }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()
    expect(state.shadowEnabled).toBe(false)
  })

  it('选中文本对象时应同步字号/字重/斜体/下划线/对齐/颜色', () => {
    const textObj = {
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'italic',
      underline: true,
      textAlign: 'center',
      fill: '#444444',
    }
    ;(TextFormatPlugin.getTextObjects as any).mockReturnValue([textObj])

    const active = { type: 'textbox' }
    const { state, updateSelectionInfo } = useSelection(createMockCanvasMgr(active) as any)
    updateSelectionInfo()

    expect(state.currentFontSize).toBe(24)
    expect(state.currentFontWeight).toBe('bold')
    expect(state.currentFontStyle).toBe('italic')
    expect(state.currentUnderline).toBe(true)
    expect(state.currentTextAlign).toBe('center')
    expect(state.currentTextFill).toBe('#444444')
  })
})
