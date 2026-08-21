/**
 * SVG 编辑器 — 颜色转换纯函数
 *
 * 全面转入 OKLCH 算法变色后，本模块只保留两个纯函数：
 *   - resolveCssVarsToHex: 将带 fallback 的 CSS 变量解析为 hex 色值
 *   - lightHexToDark: 亮色 hex → 暗色 hex（OKLCH 亮度翻转，唯一算法）
 *
 * 静态色板常量表（LIGHT_HEX / DARK_HEX / THEME_VAR_TO_HEX / LIGHT_TO_DARK /
 * THEME_HEX_TO_VAR / COLLISION_HEXES / UNIQUE_HEX_TO_VAR）已全部移除，
 * 明暗色一律由 adaptiveColor.adaptColorLuminance 单向派生，不再配置任何静态变量。
 */

import { adaptColorLuminance } from './adaptiveColor'

// 重新导出 hex 识别函数：统一「识别裸 hex」的 API 出口，
// 供 svgDarkMode / SvgObjectMounter 复用，避免各处散落口径不一的 hex 正则。
export { isHexColor } from './adaptiveColor'

/**
 * 将 SVG 中带 fallback 的 var() 替换为 fallback 值。
 *
 * 仅处理 var(--任意, fallback) 形式：Fabric.js 无法理解 CSS 变量，
 * 带兜底的外部变量（如 var(--vp-c-brand-1, #2563eb)）取 fallback 值，
 * 避免 var() 字符串被 Fabric 当作非法颜色渲染为透明。
 *
 * 不再依赖任何 var→hex 映射表（静态色板已删除）；
 * 不带 fallback 的 var(--xxx) 保持原样（项目产物已无此写法）。
 *
 * @param svg 待替换的 SVG 文本
 */
export function resolveCssVarsToHex(svg: string): string {
  // 带 fallback 的外部变量（如 var(--vp-c-brand-1, #2563eb)）→ fallback
  return svg.replace(/var\(--[^,)]+,\s*([^)]+)\)/g, (_full, fallback: string) =>
    fallback.trim()
  )
}

/**
 * 亮色 hex → 暗色 hex（编辑器与展示层共用的唯一算法）
 *
 * 全面转入算法变色后，本函数恒走 OKLCH 亮度翻转（保色相、保饱和度），
 * 不再有「语义色板精确映射」分支。由于「保存强制存亮色真值」，
 * 暗色一律由本函数从亮色真值单向派生，切回亮色时直接恢复原始值。
 *
 * @param hex 亮色真值 hex（#RRGGBB）
 */
export function lightHexToDark(hex: string): string {
  return adaptColorLuminance(hex)
}
