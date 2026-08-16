/**
 * Fabric.js v6 实例级类型常量
 *
 * 背景：Fabric.js class registry 会将静态 "type" 转为实例级全小写字符串，
 * 如 ActiveSelection.type = 'ActiveSelection' → 实例 .type = 'activeselection'。
 * 项目中原有 36+ 处硬编码字符串分散在 6 个文件中，一个字母的大小写差异
 * 就导致 5 处功能（多选检测/删除/组合/文字对齐按钮）静默失效。
 *
 * 维护规则：
 *   1. 所有 Fabric 对象 .type 比对必须使用本文件导出的常量
 *   2. Fabric.js 升级（v6→v7→v8）时只需修改此文件
 *   3. TEXT_TYPES / HOLLOW_SHAPE_TYPES 用于批量判断，替代 || 链
 */

import type { FabricObject } from 'fabric'

// ── 单类型常量 ──
export const FABRIC_TYPE = {
  // 文本
  TEXT: 'text',
  TEXTBOX: 'textbox',
  I_TEXT: 'i-text',
  ITEXT: 'itext',
  // 多选 / 组合
  ACTIVE_SELECTION: 'activeselection',
  GROUP: 'group',
  // 形状
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  TRIANGLE: 'triangle',
  LINE: 'line',
  PATH: 'path',
  POLYGON: 'polygon',
} as const

/** 需要文字格式操作（加粗/斜体/对齐/字号等）的文本类型 */
export const TEXT_TYPES = [
  FABRIC_TYPE.TEXT,
  FABRIC_TYPE.TEXTBOX,
  FABRIC_TYPE.I_TEXT,
  FABRIC_TYPE.ITEXT,
] as const

/** 无填充时需补透明填充（rgba(0,0,0,0.001)）使其可点击的形状类型 */
export const HOLLOW_SHAPE_TYPES = [
  FABRIC_TYPE.RECT,
  FABRIC_TYPE.PATH,
  FABRIC_TYPE.POLYGON,
  FABRIC_TYPE.CIRCLE,
  FABRIC_TYPE.ELLIPSE,
] as const

// ═══════════════════════════════════════════════════════════════
// 统一 Fabric 类型别名（issue #13 第 5 条「any 泛滥」处理方案）
// ═══════════════════════════════════════════════════════════════

/** Fabric 对象基类类型（统一替代散落的 any） */
export type { FabricObject }

/**
 * Fabric 对象可设置属性集合。
 * 用于 Command（PropertyChangeCommand）记录/回放样式变更，
 * 值类型因属性而异（string / number / boolean / null 等），故用 unknown。
 * 兼容 FabricObject.set(key: string | Record<string, any>, ...)。
 */
export type FabricObjectProps = Record<string, unknown>
