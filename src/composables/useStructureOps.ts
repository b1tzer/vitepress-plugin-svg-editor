/**
 * 结构操作 composable — 对齐/组合/图层/分布/全选（issue #19 P2）
 *
 * 从 useToolbar 中拆出的「结构」职责，注入 withSave 与 selection 状态。
 */

import * as fabric from 'fabric'
import type { Canvas } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import * as AlignPlugin from '../plugins/align'
import * as LayerPlugin from '../plugins/layer'
import * as DistributePlugin from '../plugins/distribute'
import { FABRIC_TYPE } from '../core/shared/FabricTypes'
import type { useSelection } from './useSelection'

type SelectionState = ReturnType<typeof useSelection>

export interface UseStructureOpsDeps {
  canvasMgr: CanvasManager
  /** 选中对象属性状态（来自 useSelection） */
  selection: SelectionState
  /** 变更事务（来自 useMutation） */
  withSave: (fn: (fc: Canvas) => void) => void
}

export function useStructureOps(deps: UseStructureOpsDeps) {
  const { canvasMgr, selection, withSave } = deps

  function align(type: string) {
    withSave((fc: any) =>
      (AlignPlugin as any)[`align${type.charAt(0).toUpperCase() + type.slice(1)}`](fc)
    )
  }

  function groupSelected() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!a || a.type !== FABRIC_TYPE.ACTIVE_SELECTION) return
    ;(a as any).toGroup()
    fc!.renderAll()
    withSave(() => {})
  }

  function ungroupSelected() {
    const fc = canvasMgr.canvas
    const a = fc?.getActiveObject()
    if (!a || a.type !== FABRIC_TYPE.GROUP) return
    ;(a as any).toActiveSelection()
    fc!.renderAll()
    withSave(() => {})
  }

  function selectAll() {
    const fc = canvasMgr.canvas
    if (!fc) return
    // 排除 workspace 背景 / clipPath 等 excludeFromExport 的内部对象，只全选用户可见元素
    const objs = fc.getObjects().filter((o: any) => !o.excludeFromExport)
    if (!objs.length) return
    fc.discardActiveObject()
    const sel = new fabric.ActiveSelection(objs, { canvas: fc })
    fc.setActiveObject(sel)
    fc.renderAll()
    selection.updateSelectionInfo()
  }

  function layerForward() {
    withSave((fc: any) => LayerPlugin.forward(fc))
  }
  function layerBackward() {
    withSave((fc: any) => LayerPlugin.backward(fc))
  }
  function layerToFront() {
    withSave((fc: any) => LayerPlugin.toFront(fc))
  }
  function layerToBack() {
    withSave((fc: any) => LayerPlugin.toBack(fc))
  }

  function distribute(dir: string) {
    withSave((fc: any) =>
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
