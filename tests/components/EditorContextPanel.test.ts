import { describe, it, expect, vi } from 'vitest'
import { reactive, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import EditorContextPanel from '../../src/components/sub/EditorContextPanel.vue'
import { EditorStoreKey } from '../../src/composables/useEditorStore'
import type { SelectionState } from '../../src/composables/useSelection'

/** 构造默认 selection 状态（reactive） */
function makeSelection(overrides: Partial<SelectionState> = {}) {
  return reactive<SelectionState>({
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
    hasTextInSelection: false,
    ...overrides,
  })
}

/** 构造 mock store（selection reactive + 各操作 vi.fn） */
function makeStore(selectionOverrides: Partial<SelectionState> = {}) {
  return {
    selection: makeSelection(selectionOverrides),
    updateSelectionInfo: vi.fn(),
    commit: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    deleteObj: vi.fn(),
    align: vi.fn(),
    applyFill: vi.fn(),
    applyStroke: vi.fn(),
    applyTextFill: vi.fn(),
    applyStrokeWidth: vi.fn(),
    toggleStrokeDash: vi.fn(),
    applyFontSize: vi.fn(),
    toggleBold: vi.fn(),
    toggleItalic: vi.fn(),
    toggleUnderline: vi.fn(),
    applyTextAlign: vi.fn(),
    applyRotation: vi.fn(),
    groupSelected: vi.fn(),
    ungroupSelected: vi.fn(),
    selectAll: vi.fn(),
    applyOpacity: vi.fn(),
    applyGradientUI: vi.fn(),
    toggleShadowUI: vi.fn(),
    applyShadowUI: vi.fn(),
    layerForward: vi.fn(),
    layerBackward: vi.fn(),
    layerToFront: vi.fn(),
    layerToBack: vi.fn(),
    distribute: vi.fn(),
  }
}

type Store = ReturnType<typeof makeStore>

function mountPanel(store: Store) {
  return mount(EditorContextPanel, {
    props: { themeMode: 'dark', collapsed: false },
    global: { provide: { [EditorStoreKey as symbol]: store } },
  })
}

describe('EditorContextPanel', () => {
  // ══════════════════════════════════════════════════════
  // 1. 防 CLS：面板始终渲染，内部切换
  // ══════════════════════════════════════════════════════
  it('面板容器始终存在于 DOM，内部内容随选中状态切换而非 v-if', async () => {
    const store = makeStore()
    const w = mountPanel(store)
    expect(w.find('.context-panel').exists()).toBe(true)
    expect(w.find('.context-empty').exists()).toBe(true)

    store.selection.selectionInfo = 'rect'
    await nextTick()
    expect(w.find('.context-panel').exists()).toBe(true)
    expect(w.find('.context-content').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 2. 空状态 vs 有选中
  // ══════════════════════════════════════════════════════
  it('无选中时显示空状态，有选中时显示属性工具区', () => {
    let w = mountPanel(makeStore())
    expect(w.find('.empty-title').text()).toBe('属性面板')
    expect(w.find('.empty-hint').text()).toContain('选中画布上的对象')
    expect(w.find('.context-content').exists()).toBe(false)

    w = mountPanel(makeStore({ selectionInfo: 'rect' }))
    expect(w.find('.context-empty').exists()).toBe(false)
    expect(w.find('.context-content').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 3. 通用工具按钮（选中后始终存在）
  // ══════════════════════════════════════════════════════
  it('选中后应包含对齐、分布、层级、组合等通用工具按钮', () => {
    const w = mountPanel(makeStore({ selectionInfo: 'rect' }))
    const btns = ['左对齐', '水平居中', '上移一层', '置顶', '水平等间距分布']
    btns.forEach((t) => expect(w.find(`[data-tip="${t}"]`).exists()).toBe(true))
    expect(w.find(`[data-tip*="组合 ("]`).exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 4. 形状 vs 文字属性互斥
  // ══════════════════════════════════════════════════════
  it('选中形状时显示填充/边框/旋转/渐变/阴影，不显示文字工具', () => {
    const w = mountPanel(makeStore({ selectionInfo: 'rect' }))
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="旋转角度"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变类型"]').exists()).toBe(true)
    expect(w.find('[aria-label="切换阴影"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(false)
  })

  it('选中文字时显示字号/加粗/斜体/下划线/对齐/颜色，不显示形状工具', () => {
    const w = mountPanel(makeStore({ selectionInfo: 'textbox', hasTextInSelection: true }))
    expect(w.find('[aria-label="字号"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(true)
    expect(w.find('[data-tip="斜体"]').exists()).toBe(true)
    expect(w.find('[data-tip="文字左对齐"]').exists()).toBe(true)
    expect(w.find('[aria-label="文字颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(false)
  })

  it('切换选中类型时内容实时更新（无 CLS）', async () => {
    const store = makeStore({ selectionInfo: 'rect' })
    const w = mountPanel(store)
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(true)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(false)

    store.selection.selectionInfo = 'textbox'
    store.selection.hasTextInSelection = true
    await nextTick()
    expect(w.find('[aria-label="填充颜色"]').exists()).toBe(false)
    expect(w.find('[data-tip="加粗"]').exists()).toBe(true)
    expect(w.find('.context-panel').exists()).toBe(true)
  })

  // ══════════════════════════════════════════════════════
  // 5. 渐变控件条件展示
  // ══════════════════════════════════════════════════════
  it('渐变类型切换时应正确显示/隐藏颜色和角度输入', () => {
    let w = mountPanel(makeStore({ selectionInfo: 'rect', gradientType: 'none' }))
    expect(w.find('[aria-label="渐变颜色1"]').exists()).toBe(false)

    w = mountPanel(makeStore({ selectionInfo: 'rect', gradientType: 'linear' }))
    expect(w.find('[aria-label="渐变颜色1"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变颜色2"]').exists()).toBe(true)
    expect(w.find('[aria-label="渐变角度"]').exists()).toBe(true)

    w = mountPanel(makeStore({ selectionInfo: 'rect', gradientType: 'radial' }))
    expect(w.find('[aria-label="渐变角度"]').exists()).toBe(false)
  })

  // ══════════════════════════════════════════════════════
  // 6. 阴影控件条件展示
  // ══════════════════════════════════════════════════════
  it('阴影开关控制配置项显隐，点击触发 toggleShadowUI', async () => {
    let w = mountPanel(makeStore({ selectionInfo: 'rect', shadowEnabled: false }))
    expect(w.find('[aria-label="阴影颜色"]').exists()).toBe(false)

    const store = makeStore({ selectionInfo: 'rect', shadowEnabled: true })
    w = mountPanel(store)
    expect(w.find('[aria-label="阴影颜色"]').exists()).toBe(true)
    expect(w.find('[aria-label="阴影模糊"]').exists()).toBe(true)

    await w.find('[aria-label="切换阴影"]').trigger('click')
    expect(store.toggleShadowUI).toHaveBeenCalled()
  })

  // ══════════════════════════════════════════════════════
  // 7. 布尔态 .active 类
  // ══════════════════════════════════════════════════════
  it('激活状态的工具按钮应有 .active 类', () => {
    const cases: Array<[string, string, Partial<SelectionState>]> = [
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
      const w = mountPanel(makeStore(overrides))
      expect(w.find(sel).classes(), `${name} 应有 .active`).toContain('active')
    })
  })

  // ══════════════════════════════════════════════════════
  // 8. 核心操作触发对应 store 方法
  // ══════════════════════════════════════════════════════
  it('点击对齐/层级/分布/组合按钮应调用对应 store 方法', async () => {
    const store = makeStore({ selectionInfo: 'rect' })
    const w = mountPanel(store)

    await w.find('[data-tip="左对齐"]').trigger('click')
    expect(store.align).toHaveBeenCalledWith('left')

    await w.find('[data-tip="上移一层"]').trigger('click')
    expect(store.layerForward).toHaveBeenCalled()

    await w.find('[aria-label="水平等间距分布"]').trigger('click')
    expect(store.distribute).toHaveBeenCalledWith('horizontal')

    await w.find('[data-tip*="组合 ("]').trigger('click')
    expect(store.groupSelected).toHaveBeenCalled()
  })

  it('填充/边框颜色变更应调用 applyFill/applyStroke', async () => {
    const store = makeStore({ selectionInfo: 'rect' })
    const w = mountPanel(store)
    await w.find('[aria-label="填充颜色"]').trigger('input')
    expect(store.applyFill).toHaveBeenCalled()
    await w.find('[aria-label="边框颜色"]').trigger('input')
    expect(store.applyStroke).toHaveBeenCalled()
  })

  it('旋转/透明度变更应调用 applyRotation/applyOpacity', async () => {
    const store = makeStore({ selectionInfo: 'rect' })
    const w = mountPanel(store)
    const rot = w.find('[aria-label="旋转角度"]')
    await rot.setValue('90')
    await rot.trigger('change')
    expect(store.applyRotation).toHaveBeenCalled()

    const op = w.find('[aria-label="透明度"]')
    await op.setValue(50)
    await op.trigger('input')
    expect(store.applyOpacity).toHaveBeenCalled()
  })

  it('字号/加粗/下划线变更应调用对应 store 方法', async () => {
    const store = makeStore({ selectionInfo: 'textbox', hasTextInSelection: true })
    const w = mountPanel(store)
    await w.find('[aria-label="字号"]').setValue('18')
    await w.find('[aria-label="字号"]').trigger('change')
    expect(store.applyFontSize).toHaveBeenCalled()

    await w.find('[data-tip="加粗"]').trigger('click')
    expect(store.toggleBold).toHaveBeenCalled()

    await w.find('[data-tip="下划线"]').trigger('click')
    expect(store.toggleUnderline).toHaveBeenCalled()
  })
})
