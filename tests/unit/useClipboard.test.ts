/**
 * useClipboard 单元测试
 * 覆盖：复制单个对象、复制多选、粘贴单个对象、粘贴多对象
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useClipboard } from '../../src/composables/useClipboard'

vi.mock('fabric', () => ({
  ActiveSelection: vi.fn((objs: any[]) => ({ type: 'activeselection', _objects: objs })),
}))

function createMockCanvas() {
  return {
    getActiveObject: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    add: vi.fn(),
    setActiveObject: vi.fn(),
    renderAll: vi.fn(),
  }
}

describe('useClipboard', () => {
  let canvas: ReturnType<typeof createMockCanvas>
  let afterChange: ReturnType<typeof vi.fn>
  let cb: ReturnType<typeof useClipboard>

  beforeEach(() => {
    canvas = createMockCanvas()
    afterChange = vi.fn()
    cb = useClipboard({ getCanvas: () => canvas as any, afterChange })
  })

  it('copy 无选中对象时不应报错', () => {
    canvas.getActiveObject.mockReturnValue(null)
    expect(() => cb.copy()).not.toThrow()
  })

  it('copy 单个对象时应调用 clone', () => {
    const obj = { type: 'rect', clone: vi.fn((fn: any) => fn({ type: 'rect' })) }
    canvas.getActiveObject.mockReturnValue(obj)
    cb.copy()
    expect(obj.clone).toHaveBeenCalled()
  })

  it('copy 多选时应保存子对象', () => {
    const sel = { type: 'activeselection', getObjects: vi.fn().mockReturnValue([{ type: 'rect' }]) }
    canvas.getActiveObject.mockReturnValue(sel)
    cb.copy()
    expect(sel.getObjects).toHaveBeenCalled()
  })

  it('paste 单个对象时应 add + setActiveObject + afterChange', () => {
    const cloneResult = {
      type: 'rect', left: 10, top: 10, set: vi.fn(),
      clone: vi.fn((fn: any) => fn({ type: 'rect', left: 10, top: 10, set: vi.fn() })),
    }
    canvas.getActiveObject.mockReturnValue({ type: 'rect', clone: vi.fn((fn: any) => fn(cloneResult)) })
    cb.copy()

    canvas.add.mockClear()
    canvas.setActiveObject.mockClear()

    cb.paste()
    expect(canvas.add).toHaveBeenCalled()
    expect(canvas.setActiveObject).toHaveBeenCalled()
    expect(afterChange).toHaveBeenCalled()
  })

  it('paste 多对象时应创建 ActiveSelection', () => {
    const cloneResult1 = { type: 'rect', left: 0, top: 0, set: vi.fn(), clone: vi.fn((fn: any) => fn({ type: 'rect', left: 0, top: 0, set: vi.fn() })) }
    const cloneResult2 = { type: 'circle', left: 0, top: 0, set: vi.fn(), clone: vi.fn((fn: any) => fn({ type: 'circle', left: 0, top: 0, set: vi.fn() })) }
    const sel = { type: 'activeselection', getObjects: vi.fn().mockReturnValue([cloneResult1, cloneResult2]) }
    canvas.getActiveObject.mockReturnValue(sel)
    cb.copy()

    canvas.add.mockClear()
    canvas.setActiveObject.mockClear()

    cb.paste()
    expect(canvas.add).toHaveBeenCalledTimes(2)
    const active = canvas.setActiveObject.mock.calls[0][0]
    expect(active.type).toBe('activeselection')
  })
})
