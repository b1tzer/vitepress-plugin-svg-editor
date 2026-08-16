/**
 * 编辑器状态桥接 composable — 将 CanvasManager / HistoryManager 的
 * 命令式事件桥接为 Vue 响应式状态
 *
 * 聚焦「编辑器整体状态」的同步：
 *   - zoomLevel / viewportVersion（缩放与视口变化）
 *   - canUndo / canRedo（撤销重做可用性）
 *
 * 选中对象属性（fill/stroke/gradient 等）与图层面板的同步仍由
 * SvgEditor 通过 onSelectionChange / onModified 回调处理，避免本
 * composable 演变为 god composable。
 */

import { ref, onScopeDispose, type Ref } from 'vue'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { HistoryManager } from '../core/history/HistoryManager'
import type { ICommand } from '../core/history/Command'

export interface UseEditorStateOptions {
  /** 选中状态变化回调（由调用方同步选中对象属性） */
  onSelectionChange?: () => void
  /** 对象修改完成回调（由调用方记录历史/刷新图层） */
  onModified?: (command?: ICommand) => void
}

export interface EditorState {
  zoomLevel: Ref<number>
  viewportVersion: Ref<number>
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  /** 手动解绑所有事件监听（组件卸载时已由 effect scope 自动调用） */
  dispose: () => void
}

/**
 * 桥接核心管理器的命令式事件与 Vue 响应式状态
 * @param canvasMgr  CanvasManager 实例
 * @param historyMgr HistoryManager 实例
 * @param options    选中/修改回调
 */
export function useEditorState(
  canvasMgr: CanvasManager,
  historyMgr: HistoryManager,
  options: UseEditorStateOptions = {}
): EditorState {
  const zoomLevel = ref(100)
  const viewportVersion = ref(0)
  const canUndo = ref(false)
  const canRedo = ref(false)

  const onZoom = (z: number) => {
    zoomLevel.value = z
  }
  const onViewport = () => {
    viewportVersion.value++
  }
  const onSelection = () => {
    options.onSelectionChange?.()
  }
  const onModify = (command?: ICommand) => {
    options.onModified?.(command)
  }
  const onHistory = () => {
    canUndo.value = historyMgr.canUndo()
    canRedo.value = historyMgr.canRedo()
  }

  canvasMgr.onZoomChange(onZoom)
  canvasMgr.onViewportChange(onViewport)
  canvasMgr.onSelectionChange(onSelection)
  canvasMgr.onModified(onModify)
  historyMgr.onStateChange(onHistory)

  /** 解绑全部监听，避免 HMR / 组件复用场景下回调叠加 */
  const dispose = () => {
    canvasMgr.offZoomChange(onZoom)
    canvasMgr.offViewportChange(onViewport)
    canvasMgr.offSelectionChange(onSelection)
    canvasMgr.offModified(onModify)
    historyMgr.offStateChange(onHistory)
  }

  // 组件卸载时自动清理，无需调用方手动处理
  onScopeDispose(dispose)

  return { zoomLevel, viewportVersion, canUndo, canRedo, dispose }
}
