/**
 * SVG 编辑器 — 主题色彩常量
 *
 * 定义亮色/暗色主题的 CSS 变量与 hex 值映射，包含：
 *   - THEME_VAR_TO_HEX: 按主题导出 VAR→HEX，供 preprocessor 使用
 *   - LIGHT_TO_DARK / DARK_TO_LIGHT: 亮↔暗双向映射，供编辑器内主题切换
 *   - CSS_COLORS (alias ALL_HEX_TO_VAR): hex→CSS 变量还原，供 postprocessor 使用
 */

// ═══════════════════════════════════════════════════════════════
// 原始数据
// ═══════════════════════════════════════════════════════════════

/** 亮色主题 hex 值（与 custom.css :root 保持一致） */
export const LIGHT_HEX: Record<string, string> = {
  '--diagram-surface-1': '#FFFFFF', '--diagram-surface-2': '#F8F9FA', '--diagram-surface-3': '#ECEFF1',
  '--diagram-stroke-1': '#BDBDBD', '--diagram-stroke-2': '#E0E0E0',
  '--diagram-text-1': '#333333', '--diagram-text-2': '#666666', '--diagram-text-3': '#888888',
  '--diagram-accent-1': '#1565C0', '--diagram-accent-bg-1': '#E3F2FD', '--diagram-accent-bg-1b': '#BBDEFB', '--diagram-accent-text-1': '#0D47A1',
  '--diagram-accent-2': '#2E7D32', '--diagram-accent-bg-2': '#E8F5E9', '--diagram-accent-bg-2b': '#C8E6C9', '--diagram-accent-text-2': '#1B5E20',
  '--diagram-accent-3': '#7B1FA2', '--diagram-accent-bg-3': '#F3E5F5', '--diagram-accent-bg-3b': '#E1BEE7', '--diagram-accent-text-3': '#4A148C',
  '--diagram-accent-4': '#E65100', '--diagram-accent-bg-4': '#FFF3E0', '--diagram-accent-text-4': '#BF360C',
  '--diagram-accent-5': '#C62828', '--diagram-accent-bg-5': '#FFCDD2', '--diagram-accent-text-5': '#B71C1C',
  '--diagram-arrow': '#555555',
  '--diagram-ghost': '#999999',
}

/** 暗色主题 hex 值（与 custom.css .dark 保持一致） */
export const DARK_HEX: Record<string, string> = {
  '--diagram-surface-1': '#1a1a1a', '--diagram-surface-2': '#222222', '--diagram-surface-3': '#2a2a2a',
  '--diagram-stroke-1': '#444444', '--diagram-stroke-2': '#333333',
  '--diagram-text-1': '#e0e0e0', '--diagram-text-2': '#b0b0b0', '--diagram-text-3': '#808080',
  '--diagram-accent-1': '#5C9CE6', '--diagram-accent-bg-1': '#0d2137', '--diagram-accent-bg-1b': '#1a3a5c', '--diagram-accent-text-1': '#90CAF9',
  '--diagram-accent-2': '#66BB6A', '--diagram-accent-bg-2': '#0d2818', '--diagram-accent-bg-2b': '#1b4332', '--diagram-accent-text-2': '#A5D6A7',
  '--diagram-accent-3': '#CE93D8', '--diagram-accent-bg-3': '#2d1b3d', '--diagram-accent-bg-3b': '#3d2550', '--diagram-accent-text-3': '#E1BEE7',
  '--diagram-accent-4': '#FFB74D', '--diagram-accent-bg-4': '#3d2d15', '--diagram-accent-text-4': '#FFCC80',
  '--diagram-accent-5': '#EF9A9A', '--diagram-accent-bg-5': '#3d1520', '--diagram-accent-text-5': '#FFCDD2',
  '--diagram-arrow': '#b0b0b0',
  '--diagram-ghost': '#666666',
}

// ═══════════════════════════════════════════════════════════════
// 派生映射
// ═══════════════════════════════════════════════════════════════

/** 按主题导出 VAR→HEX 映射（用于 preprocessor：CSS 变量 → hex 色值） */
export const THEME_VAR_TO_HEX: Record<'light' | 'dark', Record<string, string>> = {
  light: LIGHT_HEX,
  dark: DARK_HEX,
}

/** 亮↔暗 双向 hex 映射（用于编辑器内主题切换：遍历 canvas 对象替换颜色）
 *  所有键值统一大写，确保 swapColor 的 .toUpperCase() 能正确匹配 */
export const LIGHT_TO_DARK: Record<string, string> = {}
export const DARK_TO_LIGHT: Record<string, string> = {}
for (const v of Object.keys(LIGHT_HEX)) {
  LIGHT_TO_DARK[LIGHT_HEX[v].toUpperCase()] = DARK_HEX[v].toUpperCase()
  DARK_TO_LIGHT[DARK_HEX[v].toUpperCase()] = LIGHT_HEX[v].toUpperCase()
}

/** 合并映射 hex→CSS 变量（用于 postprocessor：保存时 hex→var(--xxx) 还原）
 *  同一个 CSS 变量在亮/暗下有不同的 hex 值，还原时都映射到同一个变量名 */
export const ALL_HEX_TO_VAR: Record<string, string> = {}
for (const v of Object.keys(LIGHT_HEX)) {
  ALL_HEX_TO_VAR[LIGHT_HEX[v]] = v
  ALL_HEX_TO_VAR[DARK_HEX[v]] = v
}

/** 兼容别名：CSS_COLORS = ALL_HEX_TO_VAR（用于 postprocessor 中的 hexToCssVars） */
export const CSS_COLORS: Record<string, string> = ALL_HEX_TO_VAR

/** 兼容别名：VAR_TO_HEX = LIGHT_HEX（用于 preprocessor 中的 replaceCssVars 默认值） */
export const VAR_TO_HEX: Record<string, string> = LIGHT_HEX