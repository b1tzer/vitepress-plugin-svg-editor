/**
 * 图层管理 composable — 图层列表刷新与选中/可见性切换（issue #15 第 2、5 条）
 *
 * 从 SvgEditor.vue 中抽取图层面板逻辑；同时配合 ObjectId 使用稳定 ID，
 * 替代此前的数组索引 ID（`layer-${i}`），避免对象删除/重排后索引错位。
 */

import { ref, type Ref } from 'vue'
import type { FabricObject, FabricText } from 'fabric'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import { getObjectId, findObjectById } from '../core/editor/ObjectId'
import { FABRIC_TYPE, TEXT_TYPES } from '../core/shared/fabricTypes'

export interface LayerItem {
  id: string
  type: string
  name: string
  visible: boolean
}

export function useLayer(canvasMgr: CanvasManager): {
  canvasObjects: Ref<LayerItem[]>
  refreshLayerList: () => void
  selectLayer: (id: string) => void
  toggleLayerVisibility: (id: string) => void
} {
  const canvasObjects = ref<LayerItem[]>([])

  function getObjectName(obj: FabricObject): string {
    if ((TEXT_TYPES as readonly string[]).includes(obj.type)) {
      return ((obj as FabricText).text || '').substring(0, 15) || '文本'
    }
    const typeMap: Record<string, string> = {
      [FABRIC_TYPE.RECT]: '矩形',
      [FABRIC_TYPE.CIRCLE]: '圆',
      [FABRIC_TYPE.TRIANGLE]: '三角',
      [FABRIC_TYPE.ELLIPSE]: '椭圆',
      [FABRIC_TYPE.LINE]: '线条',
      [FABRIC_TYPE.PATH]: '路径',
      [FABRIC_TYPE.POLYGON]: '多边形',
      [FABRIC_TYPE.GROUP]: '组合',
    }
    return typeMap[obj.type] || obj.type || '元素'
  }

  function refreshLayerList(): void {
    const fc = canvasMgr.canvas
    if (!fc) {
      canvasObjects.value = []
      return
    }
    canvasObjects.value = fc.getObjects().map((obj: FabricObject) => ({
      id: getObjectId(obj),
      type: obj.type || 'unknown',
      name: getObjectName(obj),
      visible: obj.visible !== false,
    }))
  }

  function selectLayer(id: string): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const obj = findObjectById(fc.getObjects(), id)
    if (obj) {
      fc.setActiveObject(obj)
      fc.renderAll()
    }
  }

  function toggleLayerVisibility(id: string): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const obj = findObjectById(fc.getObjects(), id)
    if (obj) {
      obj.set('visible', !obj.visible)
      fc.renderAll()
      refreshLayerList()
    }
  }

  return { canvasObjects, refreshLayerList, selectLayer, toggleLayerVisibility }
}
