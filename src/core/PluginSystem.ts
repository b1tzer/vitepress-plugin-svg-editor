/**
 * 插件系统 — 编辑器插件的注册、注销与调度
 *
 * 职责：
 *   - 管理插件注册表（Map<name, EditorPlugin>）
 *   - install(context) 注入 canvas / eventBus / historyManager
 *   - 支持按名称查询、注销
 *
 * 使用方式：
 *   const ps = new PluginSystem()
 *   ps.register({ name: 'align', install(ctx) { ... } })
 *   ps.installAll(ctx)
 */

import type { IEditorPlugin, PluginContext } from './types'

export class PluginSystem {
  private _plugins: Map<string, IEditorPlugin> = new Map()

  /** 注册插件（同名插件会被覆盖） */
  register(plugin: IEditorPlugin): void {
    this._plugins.set(plugin.name, plugin)
  }

  /** 注销插件 */
  unregister(name: string): boolean {
    return this._plugins.delete(name)
  }

  /** 按名字获取插件 */
  get(name: string): IEditorPlugin | undefined {
    return this._plugins.get(name)
  }

  /** 是否已注册 */
  has(name: string): boolean {
    return this._plugins.has(name)
  }

  /** 获取所有已注册插件名称 */
  names(): string[] {
    return Array.from(this._plugins.keys())
  }

  /** 批量安装所有已注册插件 */
  installAll(context: PluginContext): void {
    for (const plugin of this._plugins.values()) {
      try {
        plugin.install(context)
      } catch (e) {
        console.error(`[PluginSystem] 插件 "${plugin.name}" 安装失败:`, e)
      }
    }
  }

  /** 清空所有插件 */
  clear(): void {
    this._plugins.clear()
  }
}
