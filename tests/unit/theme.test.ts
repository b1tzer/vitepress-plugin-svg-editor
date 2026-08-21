/**
 * theme 常量回归护栏（issue #19 P2-7）
 *
 * 这些色值此前散落在 CanvasManager / InteractionManager 的硬编码字符串中，
 * 现已收敛到 theme.ts 作为单一事实来源。此处用断言锁住色值，防止后续
 * 误改导致明暗主题 / 选中强调色与 CSS 侧（EditorCanvas.vue）不一致。
 */

import { describe, it, expect } from 'vitest'
import { ACCENT_COLOR, CORNER_COLOR, WORKSPACE_THEME } from '../../src/core/shared/theme'

describe('theme 常量', () => {
  it('ACCENT_COLOR 应与 CSS 侧选中/悬停强调色一致', () => {
    expect(ACCENT_COLOR).toBe('#0078d4')
  })

  it('CORNER_COLOR 应为白色圆角控制点填充色', () => {
    expect(CORNER_COLOR).toBe('#ffffff')
  })

  it('WORKSPACE_THEME.light 应为白底浅描边', () => {
    expect(WORKSPACE_THEME.light.fill).toBe('#ffffff')
    expect(WORKSPACE_THEME.light.stroke).toBe('rgba(0,0,0,0.12)')
  })

  it('WORKSPACE_THEME.dark 应为深底浅描边', () => {
    expect(WORKSPACE_THEME.dark.fill).toBe('#1e1e1e')
    expect(WORKSPACE_THEME.dark.stroke).toBe('rgba(255,255,255,0.10)')
  })
})
