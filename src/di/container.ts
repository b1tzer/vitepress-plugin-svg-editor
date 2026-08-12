/**
 * 依赖注入容器 — 集中创建和管理核心服务实例
 *
 * 使用 Vue 3 provide/inject 模式：
 *   1. 在 SvgEditor setup 中调用 createContainer() 构建服务图
 *   2. 通过 provide() 将服务注入子组件树
 *   3. Composables 通过 inject() 获取所需服务
 */

import type { InjectionKey } from 'vue'
import { CanvasManager } from '../core/CanvasManager'
import { HistoryManager } from '../core/HistoryManager'
import { CommandHistory } from '../core/CommandHistory'
import { EventBus } from '../core/EventBus'
import { ModeManager } from '../core/editor-mode/ModeManager'
import type { IStorageAdapter } from '../adapters/storage/StorageAdapter'
import { VitePressSaveAdapter } from '../adapters/storage/VitePressSaveAdapter'

/** 注入键定义 */
export const DI_KEYS = {
  CanvasManager: Symbol('CanvasManager') as InjectionKey<CanvasManager>,
  HistoryManager: Symbol('HistoryManager') as InjectionKey<HistoryManager>,
  CommandHistory: Symbol('CommandHistory') as InjectionKey<CommandHistory>,
  ModeManager: Symbol('ModeManager') as InjectionKey<ModeManager>,
  EventBus: Symbol('EventBus') as InjectionKey<EventBus>,
  StorageAdapter: Symbol('StorageAdapter') as InjectionKey<IStorageAdapter>,
} as const

/** 容器返回的服务集合 */
export interface DIContainer {
  eventBus: EventBus
  canvasMgr: CanvasManager
  historyMgr: HistoryManager
  commandHistory: CommandHistory
  storageAdapter: IStorageAdapter
}

/**
 * 创建默认 DI 容器
 * 工厂函数 — 不依赖 Vue，可在测试中独立调用
 */
export function createContainer(
  storageAdapter?: IStorageAdapter
): DIContainer {
  const eventBus = new EventBus()
  const canvasMgr = new CanvasManager(eventBus)
  const historyMgr = new HistoryManager()
  const commandHistory = new CommandHistory()
  const adapter = storageAdapter || new VitePressSaveAdapter()

  return { eventBus, canvasMgr, historyMgr, commandHistory, storageAdapter: adapter }
}