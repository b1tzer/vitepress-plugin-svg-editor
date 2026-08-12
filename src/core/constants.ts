/**
 * SVG 编辑器 — 常量兼容导出层
 *
 * 为保持向后兼容，从 icons.ts 和 colors.ts 重导出所有符号。
 * 新代码建议直接从 icons.ts 或 colors.ts 导入。
 *
 * 历史导出清单：
 *   icons.ts  → ICONS
 *   colors.ts → THEME_VAR_TO_HEX, LIGHT_TO_DARK, DARK_TO_LIGHT, ALL_HEX_TO_VAR,
 *               CSS_COLORS, VAR_TO_HEX, LIGHT_HEX, DARK_HEX
 */

export { ICONS } from './icons'
export {
  THEME_VAR_TO_HEX,
  LIGHT_TO_DARK,
  DARK_TO_LIGHT,
  ALL_HEX_TO_VAR,
  CSS_COLORS,
  VAR_TO_HEX,
  LIGHT_HEX,
  DARK_HEX,
} from './colors'
