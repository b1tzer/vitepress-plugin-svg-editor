import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PluginSystem } from '../../src/core/PluginSystem'
import type { IEditorPlugin, PluginContext } from '../../src/core/types'

describe('PluginSystem', () => {
  let ps: PluginSystem

  beforeEach(() => {
    ps = new PluginSystem()
  })

  const makePlugin = (name: string, install = vi.fn()): IEditorPlugin => ({ name, install })

  it('register 应注册插件', () => {
    ps.register(makePlugin('align'))
    expect(ps.has('align')).toBe(true)
  })

  it('同名插件注册应覆盖旧插件', () => {
    const p1 = makePlugin('align', vi.fn())
    const p2 = makePlugin('align', vi.fn())
    ps.register(p1)
    ps.register(p2)
    expect(ps.get('align')).toBe(p2)
  })

  it('unregister 应注销插件并返回 true', () => {
    ps.register(makePlugin('align'))
    expect(ps.unregister('align')).toBe(true)
    expect(ps.has('align')).toBe(false)
  })

  it('unregister 未注册插件应返回 false', () => {
    expect(ps.unregister('nope')).toBe(false)
  })

  it('get 应返回正确的插件', () => {
    const plugin = makePlugin('align')
    ps.register(plugin)
    expect(ps.get('align')).toBe(plugin)
  })

  it('get 未注册插件应返回 undefined', () => {
    expect(ps.get('nope')).toBeUndefined()
  })

  it('names 应返回所有已注册插件名称', () => {
    ps.register(makePlugin('align'))
    ps.register(makePlugin('layer'))
    ps.register(makePlugin('text-format'))
    expect(ps.names()).toEqual(expect.arrayContaining(['align', 'layer', 'text-format']))
    expect(ps.names()).toHaveLength(3)
  })

  it('installAll 应按序调用所有插件的 install', () => {
    const ctx: PluginContext = {} as any
    const p1 = makePlugin('align', vi.fn())
    const p2 = makePlugin('layer', vi.fn())
    ps.register(p1)
    ps.register(p2)
    ps.installAll(ctx)
    expect(p1.install).toHaveBeenCalledWith(ctx)
    expect(p2.install).toHaveBeenCalledWith(ctx)
  })

  it('installAll 中某个插件抛异常不应影响其他插件', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ok = makePlugin('ok', vi.fn())
    const bad = makePlugin('bad', () => { throw new Error('oops') })
    ps.register(bad)
    ps.register(ok)
    ps.installAll({} as any)
    expect(ok.install).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('clear 应清空所有插件', () => {
    ps.register(makePlugin('a'))
    ps.register(makePlugin('b'))
    ps.clear()
    expect(ps.names()).toHaveLength(0)
  })
})