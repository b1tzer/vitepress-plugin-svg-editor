/**
 * 编辑器 UI 主题常量 — 集中管理跨模块复用的魔法色值
 *
 * 背景（issue #19 架构评审 P2）：workspace 主题色与选中/悬停强调色
 * 此前散落在 CanvasManager / InteractionManager 的硬编码字符串中，
 * 修改时需多处同步且易遗漏。统一收敛到此模块，作为单一事实来源。
 */

/** 选中/悬停强调色（对象边框、圆角控制点描边）。CSS 侧对应 EditorCanvas.vue 中的 #0078d4 */
export const ACCENT_COLOR = '#0078d4'

/** 圆角控制点填充色（选中框四角白色圆点） */
export const CORNER_COLOR = '#ffffff'

/**
 * workspace 背景 Rect 明暗主题色（画布底色 + 边界线），与编辑器 chrome 主题解耦：
 * 亮色为白底浅描边，暗色为深底浅描边。
 */
export const WORKSPACE_THEME = {
  light: {
    fill: '#ffffff',
    stroke: 'rgba(0,0,0,0.12)',
  },
  dark: {
    fill: '#1e1e1e',
    stroke: 'rgba(255,255,255,0.10)',
  },
} as const
