import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorToolbar from '../../src/components/sub/EditorToolbar.vue'

// 构造最小 props
const defaultProps = {
  src: '/diagrams/test.svg',
  zoomLevel: 100,
  svgWidth: 800,
  svgHeight: 600,
  selectionInfo: '',
  currentFill: '#ff0000',
  currentStroke: '#000000',
  currentFontSize: 12,
  currentFontWeight: 'normal',
  currentFontStyle: 'normal',
  currentUnderline: false,
  currentTextAlign: 'left',
  currentTextFill: '#000000',
  currentStrokeWidth: 1,
  currentStrokeDash: false,
  currentRotation: 0,
  currentOpacity: 100,
  gradientType: 'none',
  gradientAngle: 0,
  gradientColor1: '#1565C0',
  gradientColor2: '#E3F2FD',
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 5,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  showThemeToggle: true,
  themeMode: 'light',
  saving: false,
  canUndo: false,
  canRedo: false,
}

describe('EditorToolbar', () => {
  it('应渲染工具栏容器', () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    expect(wrapper.find('.editor-toolbar').exists()).toBe(true)
  })

  it('应渲染保存按钮', () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const saveBtn = wrapper.find('button[data-tip*="保存"]')
    expect(saveBtn.exists()).toBe(true)
  })

  it('应渲染关闭按钮', () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const closeBtn = wrapper.find('button[data-tip="关闭"]')
    expect(closeBtn.exists()).toBe(true)
  })

  it('saving=true 时保存按钮应 disabled', () => {
    const wrapper = mount(EditorToolbar, {
      props: { ...defaultProps, saving: true },
    })
    const saveBtn = wrapper.find('button[data-tip*="保存"]')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('应显示缩放级别', () => {
    const wrapper = mount(EditorToolbar, {
      props: { ...defaultProps, zoomLevel: 150 },
    })
    expect(wrapper.text()).toContain('150%')
  })

  it('应显示 SVG 画布尺寸', () => {
    const wrapper = mount(EditorToolbar, {
      props: { ...defaultProps, svgWidth: 800, svgHeight: 600 },
    })
    expect(wrapper.text()).toContain('800')
    expect(wrapper.text()).toContain('600')
  })

  it('canUndo=false 时撤销按钮应 disabled', () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const undoBtn = wrapper.find('button[data-tip="撤销"]')
    expect(undoBtn.attributes('disabled')).toBeDefined()
  })

  it('canRedo=false 时重做按钮应 disabled', () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const redoBtn = wrapper.find('button[data-tip="重做"]')
    expect(redoBtn.attributes('disabled')).toBeDefined()
  })

  it('点击保存按钮应触发 save 事件', async () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const saveBtn = wrapper.find('button[data-tip*="保存"]')
    await saveBtn.trigger('click')
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('点击关闭按钮应触发 close 事件', async () => {
    const wrapper = mount(EditorToolbar, { props: defaultProps })
    const closeBtn = wrapper.find('button[data-tip="关闭"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})