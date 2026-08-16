import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorContextPanel from '../../src/components/sub/EditorContextPanel.vue'

const makeProps = (overrides: Record<string, any> = {}) => ({
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
  themeMode: 'dark',
  collapsed: false,
  hasTextInSelection: false,
  ...overrides,
})

describe('EditorContextPanel', () => {
  // ══════════════════════════════════════════════════════
  // 1. 防 CLS：面板始终渲染，内部切换
  // ══════════════════════════════════════════════════════
  it('面板容器始终存在于 DOM，内部内容随选中状态切换而非 v-if', async () => {
    const w = mount(EditorContextPanel, { props: makeProps() })
    const panel = w.find('.context-panel')
    expect(panel.exists()).toBe(true)
    expect(w.find('.context-empty').exists()).toBe(true)

    await w.setProps({ selectionInfo: 'rect' })
    expect(panel.exists()).toBe(true)
    expect(w.find('.context-content').exists()).toBe(true)

    // 各种 selectionInfo 下都不消失
    for (const info of ['', 'rect', 'textbox', 'group', '3 个选中']) {
      await w.setProps({ selectionInfo: info })
      expect(w.find('.context-panel').exists()).toBe(true)
    }
  })

  // ══════════════════════════════════════════════════════
  // 2. 空状态 vs 有选中
  // ══════════════════════════════════════════════════════
  it('无选中时显示空状态，有选中时显示属性工具区', () => {
    let w = mount(EditorContextPanel, { props: makeProps() })
    expect(w.find('.empty-title').text()).toBe('属性面板')
    expect(w.find('.empty-hint').text()).toContain('选中画布上的对象')
    expect(w.find('.context-content').exists()).toBe(false)

    w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    expect(w.find('.context-empty').exists()).toBe(false)
    expect(w.find('.context-content').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 3. 通用工具按钮（选中后始终存在）
  // ══════════════════════════════════════════════════════
  it('选中后应包含对齐、分布、层级、组合等通用工具按钮', () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    const btns = ['左对齐', '水平居中', '上移一层', '置顶', '水平等间距分布']
    const combo = ['组合 (']
    btns.forEach((t) => expect(w.find(`[data-tip="${t}"]`).exists()).toBe(true))
    combo.forEach((t) => expect(w.find(`[data-tip*="${t}"]`).exists()).toBe(true))
  })

  // ══════════════════════════════════════════════════════
  // 4. 形状 vs 文字属性互斥
  // ══════════════════════════════════════════════════════
  it('选中形状时显示填充/边框/旋转/渐变/阴影，不显示文字工具', () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="旋转角度"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变类型"]').exists()).toBe(true)
    expect(w.find('[aria-label="切换阴影"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(false)
  })

  it('选中文字时显示字号/加粗/斜体/下划线/对齐/颜色，不显示形状工具', () => {
    const w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'textbox', hasTextInSelection: true }),
    })
    expect(w.find('[aria-label="字号"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(true)
    expect(w.find('[data-tip="斜体"]').exists()).toBe(true)
    expect(w.find('[data-tip="文字左对齐"]').exists()).toBe(true)
    expect(w.find('[aria-label="文字颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(false)
  })

  it('切换选中类型时内容实时更新（无 CLS）', async () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(false)

    await w.setProps({ selectionInfo: 'textbox', hasTextInSelection: true })
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(false)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(true)
    expect(w.find('.context-panel').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 5. 渐变控件条件展示
  // ══════════════════════════════════════════════════════
  it('渐变类型切换时应正确显示/隐藏颜色和角度输入', () => {
    let w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'rect', gradientType: 'none' }),
    })
    expect(w.find('[aria-label="渐变颜色1"]').exists()).toBe(false)

    w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'rect', gradientType: 'linear' }),
    })
    expect(w.find('[aria-label="渐变颜色1"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变颜色2"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变角度"]').exists()).toBe(true)

    w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'rect', gradientType: 'radial' }),
    })
    expect(w.find('[aria-label="渐变角度"]').exists()).toBe(false)
  })

  // ══════════════════════════════════════════════════════
  // 6. 阴影控件条件展示
  // ══════════════════════════════════════════════════════
  it('阴影开关控制配置项显隐，点击触发 toggleShadow', async () => {
    let w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'rect', shadowEnabled: false }),
    })
    expect(w.find('[aria-label="阴影颜色"]').exists()).toBe(false)

    w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'rect', shadowEnabled: true }),
    })
    expect(w.find('[aria-label="阴影颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="阴影模糊"]').exists()).toBe(true)

    await w.find('[aria-label="切换阴影"]').trigger('click')
    expect(w.emitted('toggleShadow')).toBeTruthy()
  })

  // ══════════════════════════════════════════════════════
  // 7. 布尔态 .active 类
  // ══════════════════════════════════════════════════════
  it('激活状态的工具按钮应有 .active 类', () => {
    const cases: Array<[string, string, Record<string, any>]> = [
      [
        'bold',
        '[data-tip="加粗"]',
        { selectionInfo: 'textbox', hasTextInSelection: true, currentFontWeight: 'bold' },
      ],
      [
        'italic',
        '[data-tip="斜体"]',
        { selectionInfo: 'textbox', hasTextInSelection: true, currentFontStyle: 'italic' },
      ],
      [
        'underline',
        '[data-tip="下划线"]',
        { selectionInfo: 'textbox', hasTextInSelection: true, currentUnderline: true },
      ],
      ['dash', '[aria-label="切换虚线"]', { selectionInfo: 'rect', currentStrokeDash: true }],
      ['shadow', '[aria-label="切换阴影"]', { selectionInfo: 'rect', shadowEnabled: true }],
    ]
    cases.forEach(([name, sel, overrides]) => {
      const w = mount(EditorContextPanel, { props: makeProps(overrides) })
      expect(w.find(sel).classes(), `${name} 应有 .active`).toContain('active')
    })
  })

  // ══════════════════════════════════════════════════════
  // 8. 核心 Emit 事件
  // ══════════════════════════════════════════════════════
  it('点击对齐/层级/分布/组合按钮应触发相应 emit', async () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })

    await w.find('[data-tip="左对齐"]').trigger('click')
    expect(w.emitted('align')?.[0]).toEqual(['left'])

    await w.find('[data-tip="上移一层"]').trigger('click')
    expect(w.emitted('layerForward')).toBeTruthy()

    await w.find('[aria-label="水平等间距分布"]').trigger('click')
    expect(w.emitted('distribute')?.[0]).toEqual(['horizontal'])

    await w.find('[data-tip*="组合 ("]').trigger('click')
    expect(w.emitted('group')).toBeTruthy()
  })

  it('填充/边框颜色变更应触发 fill/stroke emit', async () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    await w.find('[aria-label="填充颜色"]').trigger('input')
    expect(w.emitted('fill')).toBeTruthy()
    await w.find('[aria-label="边框颜色"]').trigger('input')
    expect(w.emitted('stroke')).toBeTruthy()
  })

  it('旋转/透明度变更应触发 rotation/opacity emit', async () => {
    const w = mount(EditorContextPanel, { props: makeProps({ selectionInfo: 'rect' }) })
    const rot = w.find('[aria-label="旋转角度"]')
    await rot.setValue('90')
    await rot.trigger('change')
    expect(w.emitted('rotation')).toBeTruthy()

    const op = w.find('[aria-label="透明度"]')
    await op.setValue(50)
    await op.trigger('input')
    expect(w.emitted('opacity')).toBeTruthy()
  })

  it('字号/加粗/下划线变更应触发对应 emit', async () => {
    const w = mount(EditorContextPanel, {
      props: makeProps({ selectionInfo: 'textbox', hasTextInSelection: true }),
    })
    await w.find('[aria-label="字号"]').setValue('18')
    await w.find('[aria-label="字号"]').trigger('change')
    expect(w.emitted('fontSize')).toBeTruthy()

    await w.find('[data-tip="加粗"]').trigger('click')
    expect(w.emitted('bold')).toBeTruthy()

    await w.find('[data-tip="下划线"]').trigger('click')
    expect(w.emitted('underline')).toBeTruthy()
  })
})
