/**
 * 结构操作 composable — 对齐/组合/图层/分布/全选（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「结构」职责，注入 commit 与 selection 状态。
 */

import * as fabric from 'fabric'
import type { ActiveSelection, Canvas, Group } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import * as AlignPlugin from '../plugins/align'
import * as LayerPlugin from '../plugins/layer'
import * as DistributePlugin from '../plugins/distribute'
import { FABRIC_TYPE } from '../core/shared/fabricTypes'

export interface UseStructureOpsDeps {
  canvasMgr: CanvasManager
  /** 选中对象属性同步回调（来自 useSelection） */
  updateSelectionInfo: () => void
  /** 变更事务（来自 useMutation） */
  commit: (fn: (fc: Canvas) => void) => void
}

export function useStructureOps(deps: UseStructureOpsDeps) {
  const { canvasMgr, updateSelectionInfo, commit } = deps

  function align(type: string) {
    const alignFns: Record<string, (canvas: Canvas) => void> = {
      alignLeft: AlignPlugin.alignLeft,
      alignRight: AlignPlugin.alignRight,
      alignCenterH: AlignPlugin.alignCenterH,
      alignTop: AlignPlugin.alignTop,
      alignBottom: AlignPlugin.alignBottom,
      alignCenterV: AlignPlugin.alignCenterV,
    }
    const fn = alignFns[`align${type.charAt(0).toUpperCase() + type.slice(1)}`]
    if (fn) commit(fn)
  }

  function groupSelected() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!fc || !a || a.type !== FABRIC_TYPE.ACTIVE_SELECTION) return
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (!active || active.type !== FABRIC_TYPE.ACTIVE_SELECTION) return
      // Fabric v6 已移除 ActiveSelection#toGroup()，需手动：取子对象 → 移除 → 建 Group → 添加。
      // issue #8034 未合入前，需先 canvas.remove 再入组，避免对象仍挂在 canvas 上导致重复引用。
      const objects = (active as ActiveSelection).getObjects()
      canvas.discardActiveObject()
      canvas.remove(...objects)
      const group = new fabric.Group(objects)
      canvas.add(group)
      canvas.setActiveObject(group)
      canvas.renderAll()
    })
  }

  function ungroupSelected() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!fc || !a || a.type !== FABRIC_TYPE.GROUP) return
    commit((canvas) => {
      const active = canvas.getActiveObject()
      if (!active || active.type !== FABRIC_TYPE.GROUP) return
      // Fabric v6 已移除 Group#toActiveSelection()，需手动：removeAll 取子对象 → 移除 Group → 建 ActiveSelection。
      const objects = (active as Group).removeAll()
      canvas.remove(active)
      const sel = new fabric.ActiveSelection(objects, { canvas })
      canvas.setActiveObject(sel)
      canvas.renderAll()
    })
  }

  function selectAll() {
    const fc = canvasMgr.canvas
    if (!fc) return
    // 排除 workspace 背景 / clipPath 等 excludeFromExport 的内部对象，只全选用户可见元素
    const objs = fc.getObjects().filter((o) => !o.excludeFromExport)
    if (!objs.length) return
    fc.discardActiveObject()
    const sel = new fabric.ActiveSelection(objs, { canvas: fc })
    fc.setActiveObject(sel)
    fc.renderAll()
    updateSelectionInfo()
  }

  function layerForward() {
    commit((fc) => LayerPlugin.forward(fc))
  }
  function layerBackward() {
    commit((fc) => LayerPlugin.backward(fc))
  }
  function layerToFront() {
    commit((fc) => LayerPlugin.toFront(fc))
  }
  function layerToBack() {
    commit((fc) => LayerPlugin.toBack(fc))
  }

  function distribute(dir: string) {
    commit((fc) =>
      dir === 'horizontal'
        ? DistributePlugin.distributeHorizontal(fc)
        : DistributePlugin.distributeVertical(fc)
    )
  }

  return {
    align,
    groupSelected,
    ungroupSelected,
    selectAll,
    layerForward,
    layerBackward,
    layerToFront,
    layerToBack,
    distribute,
  }
}
