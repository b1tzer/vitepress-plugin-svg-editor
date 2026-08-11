import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorCanvas from '../../src/components/sub/EditorCanvas.vue'

describe('EditorCanvas', () => {
  it('应渲染 canvas 元素', () => {
    const wrapper = mount(EditorCanvas, {
      props: { loading: false },
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('loading=true 时应显示加载提示', () => {
    const wrapper = mount(EditorCanvas, {
      props: { loading: true },
    })
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载中')
  })

  it('loading=false 时不应显示加载提示', () => {
    const wrapper = mount(EditorCanvas, {
      props: { loading: false },
    })
    expect(wrapper.find('.loading').exists()).toBe(false)
  })

  it('应暴露 canvasContainerRef', () => {
    const wrapper = mount(EditorCanvas, {
      props: { loading: false },
    })
    expect(wrapper.vm.canvasContainerRef).toBeDefined()
    expect(wrapper.vm.canvasContainerRef).toBeInstanceOf(HTMLElement)
  })
})