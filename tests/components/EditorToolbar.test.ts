import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorToolbar from '../../src/components/sub/EditorToolbar.vue'

const defaultProps = {
  src: '/diagrams/test.svg', zoomLevel: 100, svgWidth: 800, svgHeight: 600,
  selectionInfo: '', showThemeToggle: true, themeMode: 'light',
  saving: false, canUndo: false, canRedo: false,
}

describe('EditorToolbar', () => {
  // ══════════════════════════════════════════════════════
  // 1. 布局：三栏结构 + 防 CLS
  // ══════════════════════════════════════════════════════
  it('应渲染三栏布局且状态变化不影响结构', () => {
    const w = mount(EditorToolbar, { props: defaultProps })
    expect(w.find('.toolbar-left').exists()).toBe(true)
    expect(w.find('.toolbar-center').exists()).toBe(true)
    expect(w.find('.toolbar-right').exists()).toBe(true)
    // 防 CLS：状态变化不应移除栏
    w.setProps({ selectionInfo: 'rect', saving: true })
    expect(w.find('.toolbar-left').exists()).toBe(true)
    expect(w.find('.toolbar-center').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 2. 信息显示：文件名、缩放、尺寸、选中状态
  // ══════════════════════════════════════════════════════
  it('应正确显示文件名、缩放比例、画布尺寸和选中信息', () => {
    const w = mount(EditorToolbar, { props: { ...defaultProps, zoomLevel: 150, selectionInfo: 'rect' } })
    expect(w.find('.title').text()).toContain('/diagrams/test.svg')
    expect(w.text()).toContain('150%')
    expect((w.find('input[aria-label="画布宽度"]').element as HTMLInputElement).value).toBe('800')
    expect((w.find('input[aria-label="画布高度"]').element as HTMLInputElement).value).toBe('600')
    expect(w.find('.info-selection').text()).toBe('rect')
  })

  it('无选中时应显示"未选中"', () => {
    const w = mount(EditorToolbar, { props: defaultProps })
    expect(w.text()).toContain('未选中')
  })

  // ══════════════════════════════════════════════════════
  // 3. 按钮 disabled 态
  // ══════════════════════════════════════════════════════
  it('canUndo/canRedo/saving 为 false 时对应按钮应 disabled', () => {
    const w = mount(EditorToolbar, { props: defaultProps })
    expect(w.find('button[aria-label="撤销 Ctrl+Z"]').attributes('disabled')).toBeDefined()
    expect(w.find('button[aria-label="重做 Ctrl+Y"]').attributes('disabled')).toBeDefined()
  })

  it('saving=true 时保存按钮应 disabled 且文案为"保存中…"', () => {
    const w = mount(EditorToolbar, { props: { ...defaultProps, saving: true } })
    const btn = w.find('button[data-tip*="保存"]')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.text()).toContain('保存中')
  })

  // ══════════════════════════════════════════════════════
  // 4. 按钮 emit 验证（参数化）
  // ══════════════════════════════════════════════════════
  const emitCases: Array<{ name: string; selector: string; event: string; props?: Record<string, any> }> = [
    { name: '撤销', selector: '[aria-label="撤销 Ctrl+Z"]', event: 'undo', props: { canUndo: true } },
    { name: '重做', selector: '[aria-label="重做 Ctrl+Y"]', event: 'redo', props: { canRedo: true } },
    { name: '复制', selector: '[aria-label="复制 Ctrl+C"]', event: 'copy' },
    { name: '粘贴', selector: '[aria-label="粘贴 Ctrl+V"]', event: 'paste' },
    { name: '删除', selector: '[aria-label="删除 Delete"]', event: 'delete' },
    { name: '放大', selector: '[aria-label*="放大"]', event: 'zoomIn' },
    { name: '缩小', selector: '[aria-label*="缩小"]', event: 'zoomOut' },
    { name: '适应画布', selector: '[aria-label="适应画布 Ctrl+0"]', event: 'zoomFit' },
    { name: '保存', selector: '[data-tip*="保存"]', event: 'save' },
    { name: '关闭', selector: '[data-tip*="关闭"]', event: 'close' },
  ]

  emitCases.forEach(({ name, selector, event, props: extraProps }) => {
    it(`点击${name}按钮应触发 ${event} 事件`, async () => {
      const w = mount(EditorToolbar, { props: { ...defaultProps, ...extraProps } })
      await w.find(selector).trigger('click')
      expect(w.emitted(event)).toBeTruthy()
    })
  })

  // ══════════════════════════════════════════════════════
  // 5. 主题切换
  // ══════════════════════════════════════════════════════
  it('showThemeToggle 控制主题按钮显隐，点击触发 toggleTheme', async () => {
    let w = mount(EditorToolbar, { props: { ...defaultProps, showThemeToggle: true } })
    expect(w.find('.theme-btn').exists()).toBe(true)
    await w.find('.theme-btn').trigger('click')
    expect(w.emitted('toggleTheme')).toBeTruthy()

    w = mount(EditorToolbar, { props: { ...defaultProps, showThemeToggle: false } })
    expect(w.find('.theme-btn').exists()).toBe(false)
  })
})