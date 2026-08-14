import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorCanvas from '../../src/components/sub/EditorCanvas.vue'

const d = { loading: false, zoomLevel: 100, canvasWidth: 800, canvasHeight: 600, themeMode: 'light', viewportVersion: 0 }

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

  // ── 画布区域 ──
  it('应渲染画布区域 .canvas-area', () => {
    const w = mount(EditorCanvas, { props: d })
    expect(w.find('.canvas-area').exists()).toBe(true)
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