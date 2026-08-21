/**
 * 剪贴板 composable — 复制/粘贴选中对象（issue #15 第 1、2 条）
 *
 * 背景：剪贴板此前挂载在 `window._clipboard` 上，污染全局命名空间；
 * 复制/粘贴逻辑内嵌在 SvgEditor.vue 中，加剧 god component。
 *
 * 方案：剪贴板改为实例级闭包（不挂 window、不污染模块作用域），
 * 复制/粘贴逻辑独立为 composable；粘贴变更统一走 commit 事务。
 */

import * as fabric from 'fabric'
import type { ActiveSelection, Canvas, FabricObject } from 'fabric'
import { FABRIC_TYPE } from '../core/shared/fabricTypes'

export interface UseClipboardDeps {
  /** 获取当前 Fabric 画布实例 */
  getCanvas: () => Canvas | null
  /** 变更事务（执行变更 + 保存历史快照 + 刷新图层列表） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useClipboard(deps: UseClipboardDeps) {
  /** 实例级剪贴板：避免多编辑器实例间串扰（issue #19 架构评审 P2） */
  let clipboard: FabricObject | FabricObject[] | null = null

  async function copy(): Promise<void> {
    const a = deps.getCanvas()?.getActiveObject()
    if (!a) return
    if (a.type === FABRIC_TYPE.ACTIVE_SELECTION) {
      // 多选（ActiveSelection）：保存子对象引用（粘贴时逐个 clone），
      // 避免对 ActiveSelection 本身二次 clone 触发 t2 is not iterable
      clipboard = (a as ActiveSelection).getObjects()
    } else {
      clipboard = await a.clone()
    }
  }

  async function paste(): Promise<void> {
    if (!clipboard) return
    const fc = deps.getCanvas()
    if (!fc) return
    const data = clipboard

    const addAndSelect = (objs: FabricObject[]): void => {
      if (!objs.length) return
      deps.commit((canvas) => {
        canvas.discardActiveObject()
        objs.forEach((c) => {
          c.set({ left: (c.left || 0) + 20, top: (c.top || 0) + 20 })
          canvas.add(c)
        })
        if (objs.length > 1) {
          canvas.setActiveObject(new fabric.ActiveSelection(objs, { canvas }))
        } else {
          canvas.setActiveObject(objs[0])
        }
        canvas.renderAll()
      })
    }

    if (Array.isArray(data)) {
      const sources = data.filter((o) => !!o)
      if (!sources.length) return
      const clones = await Promise.all(sources.map((o) => o.clone()))
      addAndSelect(clones)
    } else {
      const clone = await data.clone()
      addAndSelect([clone])
    }
  }

  return { copy, paste }
}
