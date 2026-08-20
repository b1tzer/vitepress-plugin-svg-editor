/**
 * SVG 编辑器 — 主题色彩常量
 *
 * 定义亮色/暗色主题的 CSS 变量与 hex 值映射，包含：
 *   - THEME_VAR_TO_HEX: 按主题导出 VAR→HEX，供 preprocessor 导入时替换 CSS 变量
 *   - LIGHT_TO_DARK: 亮→暗单向 hex 映射，供 lightHexToDark 语义色板精确命中
 *   - THEME_HEX_TO_VAR: 按主题的单向 hex→VAR，供 COLLISION_HEXES 计算撞色集合
 *   - COLLISION_HEXES: 跨主题撞色 hex 集合，供第二步精确匹配排除
 *   - UNIQUE_HEX_TO_VAR: 跨主题无歧义的 hex→VAR 并集，供第二步精确匹配
 */

import { adaptColorLuminance } from './adaptiveColor'

// ═══════════════════════════════════════════════════════════════
// 原始数据
// ═══════════════════════════════════════════════════════════════

/** 亮色主题 hex 值（与 custom.css :root 保持一致） */
export const LIGHT_HEX: Record<string, string> = {
  '--diagram-surface-1': '#FFFFFF',
  '--diagram-surface-2': '#F8F9FA',
  '--diagram-surface-3': '#ECEFF1',
  '--diagram-stroke-1': '#BDBDBD',
  '--diagram-stroke-2': '#E0E0E0',
  '--diagram-text-1': '#333333',
  '--diagram-text-2': '#666666',
  '--diagram-text-3': '#888888',
  '--diagram-accent-1': '#1565C0',
  '--diagram-accent-bg-1': '#E3F2FD',
  '--diagram-accent-bg-1b': '#BBDEFB',
  '--diagram-accent-text-1': '#0D47A1',
  '--diagram-accent-2': '#2E7D32',
  '--diagram-accent-bg-2': '#E8F5E9',
  '--diagram-accent-bg-2b': '#C8E6C9',
  '--diagram-accent-text-2': '#1B5E20',
  '--diagram-accent-3': '#7B1FA2',
  '--diagram-accent-bg-3': '#F3E5F5',
  '--diagram-accent-bg-3b': '#E1BEE7',
  '--diagram-accent-text-3': '#4A148C',
  '--diagram-accent-4': '#E65100',
  '--diagram-accent-bg-4': '#FFF3E0',
  '--diagram-accent-text-4': '#BF360C',
  '--diagram-accent-5': '#C62828',
  '--diagram-accent-bg-5': '#FFCDD2',
  '--diagram-accent-text-5': '#B71C1C',
  '--diagram-arrow': '#555555',
  '--diagram-ghost': '#999999',
}

/** 暗色主题 hex 值（与 custom.css .dark 保持一致） */
export const DARK_HEX: Record<string, string> = {
  '--diagram-surface-1': '#1a1a1a',
  '--diagram-surface-2': '#222222',
  '--diagram-surface-3': '#2a2a2a',
  '--diagram-stroke-1': '#444444',
  '--diagram-stroke-2': '#333333',
  '--diagram-text-1': '#e0e0e0',
  '--diagram-text-2': '#b0b0b0',
  '--diagram-text-3': '#808080',
  '--diagram-accent-1': '#5C9CE6',
  '--diagram-accent-bg-1': '#0d2137',
  '--diagram-accent-bg-1b': '#1a3a5c',
  '--diagram-accent-text-1': '#90CAF9',
  '--diagram-accent-2': '#66BB6A',
  '--diagram-accent-bg-2': '#0d2818',
  '--diagram-accent-bg-2b': '#1b4332',
  '--diagram-accent-text-2': '#A5D6A7',
  '--diagram-accent-3': '#CE93D8',
  '--diagram-accent-bg-3': '#2d1b3d',
  '--diagram-accent-bg-3b': '#3d2550',
  '--diagram-accent-text-3': '#E1BEE7',
  '--diagram-accent-4': '#FFB74D',
  '--diagram-accent-bg-4': '#3d2d15',
  '--diagram-accent-text-4': '#FFCC80',
  '--diagram-accent-5': '#EF9A9A',
  '--diagram-accent-bg-5': '#3d1520',
  '--diagram-accent-text-5': '#FFCDD2',
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

/** 亮→暗 单向 hex 映射（供 lightHexToDark 语义色板精确命中）
 *  所有键值统一大写，确保 hex.toUpperCase() 能正确匹配 */
export const LIGHT_TO_DARK: Record<string, string> = {}
for (const v of Object.keys(LIGHT_HEX)) {
  LIGHT_TO_DARK[LIGHT_HEX[v].toUpperCase()] = DARK_HEX[v].toUpperCase()
}

/**
 * 将 var→hex 映射倒置为 hex→var 映射
 * @param hexMap 变量名 → hex 值（如 LIGHT_HEX / DARK_HEX）
 * @returns hex 值 → 变量名（key 保留原始大小写，配合 gi 标志匹配）
 */
function invertHexMap(hexMap: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [varName, hex] of Object.entries(hexMap)) {
    result[hex.toUpperCase()] = varName
  }
  return result
}

/**
 * 按主题的 hex→CSS 变量「单向」映射
 *
 * 用途：
 *   1. 供 COLLISION_HEXES 动态计算跨主题撞色集合（比对 light / dark 两套映射）。
 *      （第二步「hex 精确匹配 → 语义 token」已改用跨主题无歧义并集
 *      UNIQUE_HEX_TO_VAR，不再依赖本表。）
 *
 * 注意：导出时还原 var() 已不再依赖本表，而是改用 postprocessor 的
 * collectSemanticHexToVar（基于对象级 fillVar/strokeVar 语义 ID 收集映射）。
 *
 * 单向映射保证「同一主题内 hex 唯一对应变量」，配合 COLLISION_HEXES
 * 排除跨主题撞色 hex，彻底消除撞色歧义。
 */
export const THEME_HEX_TO_VAR: Record<'light' | 'dark', Record<string, string>> = {
  light: invertHexMap(LIGHT_HEX),
  dark: invertHexMap(DARK_HEX),
}

/**
 * 跨主题撞色 hex 集合（动态计算，避免硬编码遗漏）
 *
 * 「撞色」定义：同一个 hex 在亮色与暗色主题中同时存在，但映射到「不同」的 CSS 变量。
 * 这类 hex 无法在导入时无歧义地反推语义 token（例如 #E1BEE7 既是亮色 accent-bg-3b、
 * 又是暗色 accent-text-3），因此第二步的「hex 精确匹配 → 语义 token」必须排除它们。
 *
 * 供「hex 精确匹配」步骤使用；普通的 var→hex / hex→var 往返不受影响。
 */
function computeCollisionHexes(): Set<string> {
  const result = new Set<string>()
  // THEME_HEX_TO_VAR 的 key 已统一大写（见 invertHexMap），可直接跨主题比对
  const lightHexToVar = THEME_HEX_TO_VAR.light
  const darkHexToVar = THEME_HEX_TO_VAR.dark
  for (const [hex, lightVar] of Object.entries(lightHexToVar)) {
    const darkVar = darkHexToVar[hex]
    if (darkVar && darkVar !== lightVar) {
      result.add(hex)
    }
  }
  return result
}

export const COLLISION_HEXES = computeCollisionHexes()

/**
 * 跨主题无歧义的 hex→CSS 变量「并集」映射（供第二步 mapHexToVar 使用）
 *
 * 合并亮色 + 暗色两套单向映射，但排除跨主题撞色 hex（COLLISION_HEXES）。
 * 这样无论当前主题，一个「写死色板色」的裸 hex 只要在明/暗任一主题中无歧义地
 * 命中某变量，就能被识别并升级为语义 token，使普通 hex SVG 一致地获得明暗能力。
 *
 * 撞色 hex 在明暗两套里映射到不同变量，已从并集中剔除，避免「猜错语义」。
 */
export const UNIQUE_HEX_TO_VAR: Record<string, string> = {}
for (const [varName, hex] of Object.entries(LIGHT_HEX)) {
  const upper = hex.toUpperCase()
  if (!COLLISION_HEXES.has(upper)) UNIQUE_HEX_TO_VAR[upper] = varName
}
for (const [varName, hex] of Object.entries(DARK_HEX)) {
  const upper = hex.toUpperCase()
  if (!COLLISION_HEXES.has(upper)) UNIQUE_HEX_TO_VAR[upper] = varName
}

// ═══════════════════════════════════════════════════════════════
// 纯函数工具
// ═══════════════════════════════════════════════════════════════

/**
 * 将 SVG 中的 var() 替换为 hex（含带 fallback 的 var(--xxx, fallback)）。
 *
 * 只做纯文本替换，不打语义标记（data-fill-var / data-stroke-var）。
 * 供两处复用，消除「var→hex + fallback」逻辑的重复维护：
 *   1. preprocessor.replaceCssVars 的「纯算法模式」（skipSemanticIds=true）
 *   2. svgDarkMode.resolveVarsToLightHex（展示层纯算法派生）
 *
 * @param svg      待替换的 SVG 文本
 * @param varToHex CSS 变量名 → hex 映射（如 THEME_VAR_TO_HEX.light）
 */
export function resolveCssVarsToHex(svg: string, varToHex: Record<string, string>): string {
  let result = svg
  for (const [varName, hex] of Object.entries(varToHex)) {
    result = result.replaceAll(`var(${varName})`, hex)
  }
  // 带 fallback 的外部变量（如 var(--vp-c-brand-1, #2563eb)）→ fallback
  result = result.replace(/var\(--[^,)]+,\s*([^)]+)\)/g, (_full, fallback: string) =>
    fallback.trim()
  )
  return result
}

/**
 * 亮色 hex → 暗色 hex（单向派生，编辑器与展示层共用的唯一算法）
 *
 * 优先级：语义色板精确映射（LIGHT_TO_DARK）→ 未命中走 OKLCH 亮度翻转。
 * 由于「保存强制存亮色真值」，暗色一律由本函数从亮色真值单向派生，
 * 切回亮色时直接恢复原始值，无需反向计算、无需记忆化往返缓存。
 *
 * @param hex           亮色真值 hex（#RRGGBB）
 * @param algorithmOnly 纯算法模式：跳过色板精确映射，一律走 OKLCH 亮度翻转
 */
export function lightHexToDark(hex: string, algorithmOnly = false): string {
  if (!algorithmOnly) {
    const mapped = LIGHT_TO_DARK[hex.toUpperCase()]
    if (mapped) return mapped
  }
  return adaptColorLuminance(hex)
}
