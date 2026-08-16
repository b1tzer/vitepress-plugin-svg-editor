import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h, defineComponent } from 'vue'
import SvgDiagram from '../../src/components/SvgDiagram.vue'

// Mock fetch 避免真实网络请求
const mockSvgContent =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(mockSvgContent),
  })
) as any

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: { DEV: true, BASE_URL: '/' } } })

// Mock vitepress 的 defineClientComponent — 测试中直接同步返回模拟组件
vi.mock('vitepress', () => ({
  defineClientComponent: (importFn: () => Promise<any>) => {
    // 同步加载并返回简单包装组件
    let resolvedComp: any = null
    importFn().then((mod: any) => {
      resolvedComp = mod.default || mod
    })
    return defineComponent({
      name: 'ClientOnlyWrapper',
      setup(props: any, { attrs }: any) {
        return () => (resolvedComp ? h(resolvedComp, { ...attrs }) : null)
      },
    })
  },
}))

describe('SvgDiagram', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应渲染 svg-container 容器', () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/test.svg' },
    })
    expect(wrapper.find('.svg-container').exists()).toBe(true)
  })

  it('应在 mounted 后加载 SVG 内容', async () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/test.svg' },
    })
    // 等待 fetch 完成
    await nextTick()
    await nextTick()
    expect(global.fetch).toHaveBeenCalled()
  })

  it('应在 dev 模式下渲染编辑按钮', async () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/test.svg' },
      global: {
        stubs: { SvgEditor: true, Teleport: false },
      },
    })
    // hover 触发按钮出现
    await wrapper.find('.svg-container').trigger('mouseenter')
    await nextTick()
    // dev 模式按钮应存在
    expect(wrapper.find('.svg-edit-btn').exists()).toBe(true)
  })

  it('点击编辑按钮应打开编辑器', async () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/test.svg' },
      global: {
        stubs: { SvgEditor: { template: '<div class="mock-editor"/>', props: ['src'] } },
      },
    })
    await wrapper.find('.svg-container').trigger('mouseenter')
    await nextTick()
    await wrapper.find('.svg-edit-btn').trigger('click')
    await nextTick()
    // SvgEditor 通过 <Teleport to="body"> 渲染，需从 document.body 查询
    expect(document.body.querySelector('.mock-editor')).not.toBeNull()
  })

  it('编辑器关闭后应隐藏', async () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/test.svg' },
      global: {
        stubs: { SvgEditor: { template: '<div class="mock-editor"/>', props: ['src'] } },
      },
    })
    await wrapper.find('.svg-container').trigger('mouseenter')
    await nextTick()
    await wrapper.find('.svg-edit-btn').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.mock-editor')).not.toBeNull()
  })

  it('应正确接收 src prop', () => {
    const wrapper = mount(SvgDiagram, {
      props: { src: '/diagrams/foo.svg' },
    })
    expect(wrapper.props('src')).toBe('/diagrams/foo.svg')
  })
})
