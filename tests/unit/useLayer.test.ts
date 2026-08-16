/**
 * useLayer 单元测试
 * 覆盖：图层列表刷新（稳定 ID）、选中图层、切换可见性
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLayer } from '../../src/composables/useLayer'

function createMockCanvas() {
  return {
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    renderAll: vi.fn(),
  }
}

describe('useLayer', () => {
  let canvas: ReturnType<typeof createMockCanvas>

  beforeEach(() => {
    canvas = createMockCanvas()
  })

  it('canvas 为 null 时 refreshLayerList 应返回空数组', () => {
    const l = useLayer({ canvas: null } as any)
    l.refreshLayerList()
    expect(l.canvasObjects.value).toEqual([])
  })

  it('refreshLayerList 应为对象生成稳定 ID 与中文名称', () => {
    const rect = { type: 'rect', visible: true }
    const text = { type: 'text', text: 'Hello World', visible: true }
    canvas.getObjects.mockReturnValue([rect, text])

    const l = useLayer({ canvas } as any)
    l.refreshLayerList()

    expect(l.canvasObjects.value.length).toBe(2)
    expect(l.canvasObjects.value[0].name).toBe('矩形')
    expect(l.canvasObjects.value[1].name).toBe('Hello World')
    expect(l.canvasObjects.value[0].id).toBeTruthy()

    // 同一对象引用多次刷新应保持 ID 稳定
    const firstId = l.canvasObjects.value[0].id
    l.refreshLayerList()
    expect(l.canvasObjects.value[0].id).toBe(firstId)
  })

  it('selectLayer 应通过稳定 ID 找到对象并选中', () => {
    const rect = { type: 'rect', visible: true }
    canvas.getObjects.mockReturnValue([rect])

    const l = useLayer({ canvas } as any)
    l.refreshLayerList()
    const id = l.canvasObjects.value[0].id
    l.selectLayer(id)

    expect(canvas.setActiveObject).toHaveBeenCalledWith(rect)
  })

  it('toggleLayerVisibility 应切换 visible 并刷新', () => {
    const rect = { type: 'rect', visible: true, set: vi.fn() }
    canvas.getObjects.mockReturnValue([rect])

    const l = useLayer({ canvas } as any)
    l.refreshLayerList()
    const id = l.canvasObjects.value[0].id
    l.toggleLayerVisibility(id)

    expect(rect.set).toHaveBeenCalledWith('visible', false)
    expect(canvas.renderAll).toHaveBeenCalled()
  })
})
