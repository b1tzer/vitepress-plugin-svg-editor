/**
 * vitepress-plugin-svg-editor — Client 端统一入口
 *
 * 提供：
 *   1. enhanceApp() — 自动注册 SvgDiagram、SvgEditor 全局组件
 *   2. SvgDiagram / SvgEditor — 独立组件导出（按需使用）
 *
 * 使用方式（推荐，一行配置）：
 *   // .vitepress/theme/index.ts
 *   import { enhanceApp } from 'vitepress-plugin-svg-editor/client'
 *   export default { extends: DefaultTheme, enhanceApp }
 */

import type { EnhanceAppContext } from 'vitepress'
import { defineClientComponent } from 'vitepress'

// SvgDiagram 是纯展示组件，不依赖浏览器 API，可直接 SSR
import _SvgDiagram from '../components/SvgDiagram.vue'
export const SvgDiagram = _SvgDiagram

// SvgEditor 依赖 Fabric.js（Canvas API），必须 defineClientComponent 包裹确保 SSR 安全
export const SvgEditor = defineClientComponent(() => import('../components/SvgEditor.vue'))

/**
 * 自动注册全局组件
 * 在 .vitepress/theme/index.ts 中调用：
 *   enhanceApp({ app }) { enhanceAppWithSvgEditor({ app }) }
 */
export function enhanceAppWithSvgEditor({ app }: EnhanceAppContext): void {
  if (!import.meta.env.SSR) {
    app.component('SvgDiagram', _SvgDiagram)
    app.component('SvgEditor', SvgEditor)
  }
}

// 别名导出，兼容 import { enhanceApp } 写法
export { enhanceAppWithSvgEditor as enhanceApp }
