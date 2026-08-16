/**
 * 测试钩子集中管理 — 收敛散落的 window 全局变量（issue #15 第 1 条）
 *
 * 背景：`__fabricCanvas` / `__canvasMgr` / `__historyMgr` / `fabric` 此前分别
 * 散落在 CanvasManager.init 与 SvgEditor.vue 中直接写入 window，污染全局命名空间，
 * 且暴露/清理生命周期不清晰。
 *
 * 方案：
 *   - 集中到本模块，由 SvgEditor 在画布初始化完成后统一暴露、在组件卸载时统一清理。
 *   - 默认仅在 dev 环境暴露；生产构建通过 `SVG_EDITOR_E2E=1` 注入 `__SVG_EDITOR_E2E__`
 *     显式开启，以支持 vitepress preview 跑 E2E。真正的发布产物不设置该开关，钩子保持关闭，
 *     tree-shaking 后彻底不写入 window，从源头消除全局命名空间污染。
 *
 * 前置解耦：`EditorCanvas.vue` 对画布实例的依赖已改为通过 `fabricCanvas` prop 传入，
 * 不再读取 `window.__fabricCanvas`，因此生产构建移除该全局变量不影响 resize 手柄等运行时功能。
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import type { CanvasManager } from '../canvas/CanvasManager'
import type { HistoryManager } from '../history/HistoryManager'

/**
 * 暴露测试钩子到 window（dev 环境或显式开启测试开关时）
 * @param canvas     Fabric 画布实例
 * @param canvasMgr  CanvasManager 实例
 * @param historyMgr HistoryManager 实例
 */
export function exposeTestHooks(
  canvas: Canvas,
  canvasMgr: CanvasManager,
  historyMgr: HistoryManager
): void {
  if (!import.meta.env.DEV && __SVG_EDITOR_E2E__ !== true) return
  window.__fabricCanvas = canvas
  window.__canvasMgr = canvasMgr
  window.__historyMgr = historyMgr
  window.fabric = fabric
}

/** 清理测试钩子引用（dev 环境或显式开启测试开关时，组件卸载时调用，释放实例引用） */
export function clearTestHooks(): void {
  if (!import.meta.env.DEV && __SVG_EDITOR_E2E__ !== true) return
  window.__fabricCanvas = null
  window.__canvasMgr = null
  window.__historyMgr = null
}
