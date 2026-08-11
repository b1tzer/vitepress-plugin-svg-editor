/**
 * 事件总线 — 类型安全的事件发布/订阅
 *
 * 职责：
 *   - 提供 on / off / emit 标准事件接口
 *   - 类型安全：事件名和回调参数由 CanvasEvents 约束
 *   - 零外部依赖
 *
 * 使用方式：
 *   const bus = new EventBus()
 *   bus.on('zoomChange', (level) => { ... })
 *   bus.emit('zoomChange', 150)
 */

import type { CanvasEvents } from './types'

export class EventBus {
  private _handlers: Map<keyof CanvasEvents, Set<Function>> = new Map()

  /** 注册事件监听 */
  on<K extends keyof CanvasEvents>(event: K, handler: CanvasEvents[K]): void {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, new Set())
    }
    this._handlers.get(event)!.add(handler)
  }

  /** 注销事件监听 */
  off<K extends keyof CanvasEvents>(event: K, handler: CanvasEvents[K]): void {
    this._handlers.get(event)?.delete(handler)
  }

  /** 触发事件 */
  emit<K extends keyof CanvasEvents>(event: K, ...args: Parameters<CanvasEvents[K]>): void {
    this._handlers.get(event)?.forEach((fn) => {
      try {
        ;(fn as (...a: Parameters<CanvasEvents[K]>) => void)(...args)
      } catch (e) {
        console.error(`[EventBus] 事件 "${event}" 处理器异常:`, e)
      }
    })
  }

  /** 清除所有监听器 */
  clear(): void {
    this._handlers.clear()
  }
}
