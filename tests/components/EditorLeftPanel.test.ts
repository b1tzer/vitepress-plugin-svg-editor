import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorLeftPanel from '../../src/components/sub/EditorLeftPanel.vue'

const defaultProps = {
  canvasObjects: [],
  collapsed: false,
  themeMode: 'dark',
}

describe('EditorLeftPanel 左侧面板', () => {
  // ══════════════════════════════════════════════════════
  // 1. 结构：展开/折叠状态
  // ══════════════════════════════════════════════════════
  it('展开态应渲染标签导航和内容区', () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    expect(wrapper.find('.tab-nav').exists()).toBe(true)
    expect(wrapper.find('.tab-content').exists()).toBe(true)
  })

  it('折叠态应隐藏标签导航和内容区，仅显示展开按钮', () => {
    const wrapper = mount(EditorLeftPanel, { props: { ...defaultProps, collapsed: true } })
    expect(wrapper.find('.tab-nav').exists()).toBe(false)
    expect(wrapper.find('.tab-content').exists()).toBe(false)
    expect(wrapper.find('.left-panel.collapsed').exists()).toBe(true)
  })

  it('点击折叠按钮应触发 toggleCollapse 事件', async () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    await wrapper.find('.floating-toggle').trigger('click')
    expect(wrapper.emitted('toggleCollapse')).toBeTruthy()
  })

  // ══════════════════════════════════════════════════════
  // 2. 元素清单：卡片渲染与事件
  // ══════════════════════════════════════════════════════
  it('元素标签应显示基础形状和文本分组', () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    const text = wrapper.text()
    expect(text).toContain('基础形状')
    expect(text).toContain('矩形')
    expect(text).toContain('圆形')
    expect(text).toContain('文本')
    expect(text).toContain('文本框')
  })

  it('点击元素卡片应发射 addElement 事件并携带类型参数', async () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    // 点击"矩形"卡片
    const rectBtn = wrapper.find('[aria-label="添加矩形"]')
    expect(rectBtn.exists()).toBe(true)
    await rectBtn.trigger('click')
    expect(wrapper.emitted('addElement')).toBeTruthy()
    expect(wrapper.emitted('addElement')?.[0]).toEqual(['rect'])
  })

  it('点击"圆形"和"文本框"应发射正确类型', async () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    
    await wrapper.find('[aria-label="添加圆形"]').trigger('click')
    expect(wrapper.emitted('addElement')?.[0]).toEqual(['circle'])

    await wrapper.find('[aria-label="添加文本框"]').trigger('click')
    expect(wrapper.emitted('addElement')?.[1]).toEqual(['textbox'])
  })

  // ══════════════════════════════════════════════════════
  // 3. 图层面板
  // ══════════════════════════════════════════════════════
  it('切换到图层标签应显示图层面板', async () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    await wrapper.find('[aria-label="图层"]').trigger('click')
    expect(wrapper.find('.layers-view').exists()).toBe(true)
    expect(wrapper.find('.layers-empty').exists()).toBe(true)
  })

  it('无对象时应显示"画布上还没有元素"', async () => {
    const wrapper = mount(EditorLeftPanel, { props: defaultProps })
    await wrapper.find('[aria-label="图层"]').trigger('click')
    expect(wrapper.text()).toContain('画布上还没有元素')
  })

  it('有对象时应渲染图层项并显示数量', async () => {
    const objs = [
      { id: 'layer-0', type: 'rect', name: '矩形', visible: true },
      { id: 'layer-1', type: 'textbox', name: '文本框', visible: false },
    ]
    const wrapper = mount(EditorLeftPanel, { props: { ...defaultProps, canvasObjects: objs } })
    await wrapper.find('[aria-label="图层"]').trigger('click')
    
    expect(wrapper.find('.layers-empty').exists()).toBe(false)
    expect(wrapper.text()).toContain('2 个图层')
    expect(wrapper.text()).toContain('矩形')
    expect(wrapper.text()).toContain('文本框')
  })

  it('点击图层项应发射 selectLayer 事件', async () => {
    const objs = [{ id: 'layer-0', type: 'rect', name: '矩形', visible: true }]
    const wrapper = mount(EditorLeftPanel, { props: { ...defaultProps, canvasObjects: objs } })
    await wrapper.find('[aria-label="图层"]').trigger('click')
    
    await wrapper.find('.layer-item').trigger('click')
    expect(wrapper.emitted('selectLayer')).toBeTruthy()
    expect(wrapper.emitted('selectLayer')?.[0]).toEqual(['layer-0'])
  })

  it('点击可见性按钮应发射 toggleLayerVisibility 事件', async () => {
    const objs = [{ id: 'layer-0', type: 'rect', name: '矩形', visible: true }]
    const wrapper = mount(EditorLeftPanel, { props: { ...defaultProps, canvasObjects: objs } })
    await wrapper.find('[aria-label="图层"]').trigger('click')
    
    await wrapper.find('[aria-label="隐藏图层"]').trigger('click')
    expect(wrapper.emitted('toggleLayerVisibility')).toBeTruthy()
    expect(wrapper.emitted('toggleLayerVisibility')?.[0]).toEqual(['layer-0'])
  })
})