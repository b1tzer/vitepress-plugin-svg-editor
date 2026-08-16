/**
 * 剪贴板 composable — 复制/粘贴选中对象（issue #15 第 1、2 条）
 *
 * 背景：剪贴板此前挂载在 `window._clipboard` 上，污染全局命名空间；
 * 复制/粘贴逻辑内嵌在 SvgEditor.vue 中，加剧 god component。
 *
 * 方案：剪贴板改为模块级变量（不挂 window），复制/粘贴逻辑独立为 composable。
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import { FABRIC_TYPE } from '../core/shared/FabricTypes'

/** 模块级剪贴板：单个对象或多对象数组（ActiveSelection 复制时保存子对象引用） */
let _clipboard: any = null

export interface UseClipboardDeps {
  /** 获取当前 Fabric 画布实例 */
  getCanvas: () => Canvas | null
  /** 变更后回调（保存历史快照 + 刷新图层列表） */
  afterChange: () => void
}

export function useClipboard(deps: UseClipboardDeps) {
  function copy(): void {
    const a = deps.getCanvas()?.getActiveObject()
    if (!a) return
    if (a.type === FABRIC_TYPE.ACTIVE_SELECTION) {
      // 多选（ActiveSelection）：保存子对象引用（粘贴时逐个 clone），
      // 避免对 ActiveSelection 本身二次 clone 触发 t2 is not iterable
      _clipboard = (a as any).getObjects()
    } else {
      ;(a as any).clone((c: any) => {
        _clipboard = c
      })
    }
  }

  function paste(): void {
    if (!_clipboard) return
    const fc = deps.getCanvas()
    if (!fc) return
    const clipboard = _clipboard

    const addAndSelect = (objs: any[]) => {
      if (!objs.length) return
      fc.discardActiveObject()
      objs.forEach((c: any) => {
        c.set({ left: (c.left || 0) + 20, top: (c.top || 0) + 20 })
        fc.add(c)
      })
      if (objs.length > 1) {
        fc.setActiveObject(new fabric.ActiveSelection(objs, { canvas: fc }))
      } else {
        fc.setActiveObject(objs[0])
      }
      fc.renderAll()
      deps.afterChange()
    }

    if (Array.isArray(clipboard)) {
      const sources = clipboard.filter((o: any) => !!o)
      if (!sources.length) return
      const clones: any[] = []
      let pending = sources.length
      sources.forEach((o: any) => {
        ;(o as any).clone((c: any) => {
          clones.push(c)
          pending -= 1
          if (pending === 0) addAndSelect(clones)
        })
      })
    } else {
      ;(clipboard as any).clone((c: any) => addAndSelect([c]))
    }
  }

  return { copy, paste }
}
