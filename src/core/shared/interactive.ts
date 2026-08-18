/**
 * 交互性工具 — 确保 Fabric 对象可交互
 *
 * 统一「确保对象可交互」逻辑（此前散落在 SvgEditor / InteractionManager / HistoryManager 三处，
 * 存在漂移风险）。核心职责：
 *   - 设置 selectable / evented
 *   - 对无填充的镂空形状补透明填充（Fabric 默认不响应 fill=none 的点击）
 *   - 递归处理 Group 的子对象
 *
 * 纯函数，零 Vue 依赖，可单测。
 */

import type { FabricObject } from 'fabric'
import { HOLLOW_SHAPE_TYPES } from './fabricTypes'

/**
 * 确保单个 Fabric 对象（及其子对象）可交互
 * @param obj Fabric 对象实例（含 Group 等可递归结构）
 */
export function ensureObjectInteractive(obj: FabricObject | null | undefined): void {
  if (!obj) return
  obj.set({ selectable: true, evented: true })
  if (!obj.fill || obj.fill === 'none' || obj.fill === 'transparent') {
    if ((HOLLOW_SHAPE_TYPES as readonly string[]).includes(obj.type)) {
      obj.set({ fill: 'rgba(0,0,0,0.001)' })
    }
  }
  const children = (obj as FabricObject & { _objects?: FabricObject[] })._objects
  if (children) children.forEach(ensureObjectInteractive)
}
