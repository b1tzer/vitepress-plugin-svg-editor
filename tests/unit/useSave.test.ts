/**
 * useSave 单元测试 — 覆盖保存序列化与「强制存亮色真值」归一化行为
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSave } from '../../src/composables/useSave'
import type { UseSaveDeps } from '../../src/composables/useSave'

function createMockDeps(overrides: Partial<UseSaveDeps> = {}) {
  const serialize = vi.fn().mockReturnValue('<svg/>')
  const storageSave = vi.fn().mockResolvedValue({ success: true })
  return {
    deps: {
      getCanvas: vi.fn().mockReturnValue({}),
      serializer: { serialize } as any,
      storageAdapter: { save: storageSave } as any,
      src: '/test.svg',
      getOriginalViewBox: vi.fn().mockReturnValue('0 0 800 600'),
      getThemeMode: vi.fn().mockReturnValue('light'),
      getDarkToLightMap: vi.fn().mockReturnValue(new Map([['#779CC4', '#123456']])),
      onSaved: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    } as UseSaveDeps,
    serialize,
    storageSave,
  }
}

describe('useSave', () => {
  let ctx: ReturnType<typeof createMockDeps>

  beforeEach(() => {
    ctx = createMockDeps()
  })

  it('亮色模式下保存不传 darkToLightMap', async () => {
    ctx.deps.getThemeMode = vi.fn().mockReturnValue('light')
    const { save } = useSave(ctx.deps)
    await save()

    const opts = ctx.serialize.mock.calls[0][1]
    expect(opts.darkToLightMap).toBeUndefined()
    expect(ctx.deps.getDarkToLightMap).not.toHaveBeenCalled()
    expect(ctx.storageSave).toHaveBeenCalled()
  })

  it('暗色模式下保存传入 darkToLightMap（归一化到亮色真值）', async () => {
    ctx.deps.getThemeMode = vi.fn().mockReturnValue('dark')
    const { save } = useSave(ctx.deps)
    await save()

    const opts = ctx.serialize.mock.calls[0][1]
    expect(opts.theme).toBe('dark')
    expect(opts.darkToLightMap).toBeInstanceOf(Map)
    expect(opts.darkToLightMap.get('#779CC4')).toBe('#123456')
    expect(ctx.deps.getDarkToLightMap).toHaveBeenCalled()
  })

  it('保存成功后触发 onSaved 与 onClose', async () => {
    const { save } = useSave(ctx.deps)
    await save()
    expect(ctx.deps.onSaved).toHaveBeenCalled()
    expect(ctx.deps.onClose).toHaveBeenCalled()
  })
})
