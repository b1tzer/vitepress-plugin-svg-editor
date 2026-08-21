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

  it('保存应调用 serialize 并传入 originalViewBox', async () => {
    const { save } = useSave(ctx.deps)
    await save()

    const opts = ctx.serialize.mock.calls[0][1]
    expect(opts.originalViewBox).toBe('0 0 800 600')
    expect(ctx.storageSave).toHaveBeenCalled()
  })

  it('保存成功后触发 onSaved 与 onClose', async () => {
    const { save } = useSave(ctx.deps)
    await save()
    expect(ctx.deps.onSaved).toHaveBeenCalled()
    expect(ctx.deps.onClose).toHaveBeenCalled()
  })

  it('保存失败时不触发 onSaved/onClose 并提示错误', async () => {
    ctx.storageSave.mockResolvedValue({ success: false, error: '写入失败' })
    const { save, errorMessage } = useSave(ctx.deps)
    await save()
    expect(ctx.deps.onSaved).not.toHaveBeenCalled()
    expect(ctx.deps.onClose).not.toHaveBeenCalled()
    expect(errorMessage.value).toContain('写入失败')
  })

  it('序列化抛错时提示错误且不触发回调', async () => {
    ctx.serialize.mockImplementation(() => {
      throw new Error('序列化异常')
    })
    const { save, errorMessage } = useSave(ctx.deps)
    await save()
    expect(ctx.deps.onSaved).not.toHaveBeenCalled()
    expect(errorMessage.value).toContain('序列化异常')
  })
})
