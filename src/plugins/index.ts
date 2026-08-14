/**
 * 内置编辑器插件 — 统一导出
 *
 * 各插件为纯函数式工具模块，直接操作 Fabric.js 画布对象，无 install/uninstall 生命周期：
 *   - align / layer / distribute / textFormat：命名空间导出
 *   - gradient / shadow / arrow-merger：具名函数导出
 *
 * 使用方式：
 *   import { align, layer, textFormat, distribute, gradient, shadow, arrowMerger } from 'vitepress-plugin-svg-editor/plugins'
 */

// 对齐（六方向）
export * as align from './align'

// 层级（前移/后移/置顶/置底）
export * as layer from './layer'

// 文字格式（字号/粗体/斜体/下划线/对齐/颜色）
export * as textFormat from './text-format'

// 等距分布（水平/垂直）
export * as distribute from './distribute'

// 渐变填充（纯色/线性/径向）
export { applyGradient } from './gradient'

// 阴影效果（开关 + 参数）
export { toggleShadow, applyShadow } from './shadow'

// 箭头合并（line + polygon → Group）
export { mergeArrows } from './arrow-merger'
