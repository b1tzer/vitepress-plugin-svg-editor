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

import { ref, type Ref } from 'vue'
import type { CanvasManager } from '../core/CanvasManager'
import type { HistoryManager } from '../core/HistoryManager'
import type { ICommand } from '../core/Command'

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
  options: UseEditorStateOptions = {},
): EditorState {
  const zoomLevel = ref(100)
  const viewportVersion = ref(0)
  const canUndo = ref(false)
  const canRedo = ref(false)

  canvasMgr.onZoomChange((z: number) => { zoomLevel.value = z })
  canvasMgr.onViewportChange(() => { viewportVersion.value++ })
  canvasMgr.onSelectionChange(() => { options.onSelectionChange?.() })
  canvasMgr.onModified((command) => { options.onModified?.(command) })
  historyMgr.onStateChange(() => {
    canUndo.value = historyMgr.canUndo()
    canRedo.value = historyMgr.canRedo()
  })

  return { zoomLevel, viewportVersion, canUndo, canRedo }
}
