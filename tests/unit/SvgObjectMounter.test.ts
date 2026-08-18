/**
 * SvgObjectMounter 单元测试 — 覆盖 SVG 文本 → Fabric 对象装载链（issue #19 P1）
 *
 * 聚焦验证编排逻辑：
 *   1. loadSVGFromString 返回的对象被 add 到画布
 *   2. transform 回调被注入并应用（对象级转换）
 *   3. excludeFromExport 的内部对象被跳过
 *   4. 空对象数组不报错
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fabric from 'fabric'
import { mountSvgObjects } from '../../src/core/editor/SvgObjectMounter'

// 仅 mock loadSVGFromString；ObjectFactory 中 new fabric.Textbox 仅在
// 传入 type='text' 对象时触发，本测试用例均使用非 text 对象，无需 mock。
vi.mock('fabric', () => ({
  loadSVGFromString: vi.fn(),
}))

function makeObj(type = 'rect', overrides: Record<string, any> = {}) {
  return { type, set: vi.fn(), fill: '#ffffff', ...overrides }
}

function createMockCanvas() {
  return {
    add: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    requestRenderAll: vi.fn(),
  }
}

describe('mountSvgObjects', () => {
  let canvas: ReturnType<typeof createMockCanvas>

  beforeEach(() => {
    canvas = createMockCanvas()
    ;(fabric.loadSVGFromString as any).mockReset()
  })

  it('应将 loadSVGFromString 返回的对象 add 到画布并 requestRenderAll', async () => {
    const obj = makeObj('rect')
    ;(fabric.loadSVGFromString as any).mockResolvedValue({ objects: [obj] })
    canvas.getObjects.mockReturnValue([obj])

    await mountSvgObjects(canvas as any, '<svg/>')

    expect(fabric.loadSVGFromString).toHaveBeenCalledWith('<svg/>', expect.any(Function))
    expect(canvas.add).toHaveBeenCalledWith(obj)
    expect(canvas.requestRenderAll).toHaveBeenCalled()
  })

  it('注入 transform 时应先应用转换再 add', async () => {
    const obj = makeObj('rect')
    const transformed = makeObj('circle')
    const transform = vi.fn().mockReturnValue([transformed])
    ;(fabric.loadSVGFromString as any).mockResolvedValue({ objects: [obj] })
    canvas.getObjects.mockReturnValue([transformed])

    await mountSvgObjects(canvas as any, '<svg/>', { transform })

    expect(transform).toHaveBeenCalledWith([obj])
    expect(canvas.add).toHaveBeenCalledWith(transformed)
  })

  it('应跳过 excludeFromExport 的内部对象', async () => {
    const workspace = makeObj('rect', { excludeFromExport: true })
    const userObj = makeObj('rect')
    ;(fabric.loadSVGFromString as any).mockResolvedValue({ objects: [] })
    canvas.getObjects.mockReturnValue([workspace, userObj])

    await mountSvgObjects(canvas as any, '<svg/>')

    // workspace 被跳过，不应被 ensureObjectInteractive 处理（即 set 不被调用）
    expect(workspace.set).not.toHaveBeenCalled()
    // 用户对象被兜底确保可交互
    expect(userObj.set).toHaveBeenCalled()
  })

  it('空对象数组不应报错且不 add 任何对象', async () => {
    ;(fabric.loadSVGFromString as any).mockResolvedValue({ objects: [] })
    canvas.getObjects.mockReturnValue([])

    await expect(mountSvgObjects(canvas as any, '<svg/>')).resolves.toBeUndefined()
    expect(canvas.add).not.toHaveBeenCalled()
  })
})
