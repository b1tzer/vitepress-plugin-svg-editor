import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorCanvas from '../../src/components/sub/EditorCanvas.vue'

const d = { loading: false, zoomLevel: 100, canvasWidth: 800, canvasHeight: 600 }

describe('EditorCanvas', () => {
  // ── 基础渲染 ──
  it('应渲染 canvas 元素 + 棋盘格背景', () => {
    const w = mount(EditorCanvas, { props: d })
    expect(w.find('canvas').exists()).toBe(true)
    expect(w.find('.editor-canvas').exists()).toBe(true)
  })

  it('loading=true 时应显示加载提示含 spinner', () => {
    const w = mount(EditorCanvas, { props: { ...d, loading: true } })
    expect(w.find('.loading').exists()).toBe(true)
    expect(w.find('.loading-spinner').exists()).toBe(true)
    expect(w.text()).toContain('加载中')
  })

  it('loading=false 时不应显示加载提示', () => {
    const w = mount(EditorCanvas, { props: d })
    expect(w.find('.loading').exists()).toBe(false)
  })

  // ── 画布尺寸 ──
  it('canvas-area 尺寸应等于传入的 canvasWidth/canvasHeight', () => {
    const w = mount(EditorCanvas, { props: d })
    const area = w.find('.canvas-area')
    expect(area.exists()).toBe(true)
    expect(area.attributes('style')).toContain('800px')
    expect(area.attributes('style')).toContain('600px')
  })

  // ── resize 手柄 ──
  const handles = ['n','s','w','e','nw','ne','sw','se']
  handles.forEach(h => {
    it(`应渲染 resize 手柄 .rh-${h}`, () => {
      const w = mount(EditorCanvas, { props: d })
      expect(w.find(`.rh-${h}`).exists()).toBe(true)
    })
  })

  it('拖拽 resize 手柄应触发 resize 事件', async () => {
    const w = mount(EditorCanvas, { props: d })
    const handle = w.find('.rh-e')
    await handle.trigger('mousedown', { clientX: 100, clientY: 200 })
    // 模拟拖拽
    const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 200, bubbles: true })
    document.dispatchEvent(moveEvent)
    // 释放
    const upEvent = new MouseEvent('mouseup', { bubbles: true })
    document.dispatchEvent(upEvent)
    // resize 事件应当已发出
    expect(w.emitted('resize')).toBeTruthy()
  })

  // ── 滚动容器 ──
  it('应渲染滚动容器 .canvas-scroll', () => {
    const w = mount(EditorCanvas, { props: d })
    expect(w.find('.canvas-scroll').exists()).toBe(true)
  })

  // ── 暴露 ref ──
  it('应暴露 canvasAreaRef 和 scrollRef', () => {
    const w = mount(EditorCanvas, { props: d })
    expect(w.vm.canvasAreaRef).toBeDefined()
    expect(w.vm.scrollRef).toBeDefined()
  })
})