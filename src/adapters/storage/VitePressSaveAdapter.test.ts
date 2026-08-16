import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VitePressSaveAdapter } from './VitePressSaveAdapter'

describe('VitePressSaveAdapter', () => {
  let adapter: VitePressSaveAdapter

  beforeEach(() => {
    adapter = new VitePressSaveAdapter('/__svg-save__')
    vi.restoreAllMocks()
  })

  it('save 成功时应返回 success: true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ok: true, file: '/diagrams/test.svg' }),
        })
      )
    )
    const result = await adapter.save('<svg></svg>', '/diagrams/test.svg')
    expect(result.success).toBe(true)
    expect(result.path).toBe('/diagrams/test.svg')
  })

  it('save 失败时应返回 success: false + error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          text: () => Promise.resolve('Forbidden'),
        })
      )
    )
    const result = await adapter.save('<svg></svg>', '/diagrams/test.svg')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Forbidden')
  })

  it('save 网络异常时应捕获 error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error')))
    )
    const result = await adapter.save('<svg></svg>', '/diagrams/test.svg')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Network error')
  })

  it('load 成功时应返回 SVG 文本', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<svg>loaded</svg>'),
        })
      )
    )
    const result = await adapter.load('/diagrams/test.svg')
    expect(result).toBe('<svg>loaded</svg>')
  })

  it('load 失败时应抛出错误', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      )
    )
    await expect(adapter.load('/diagrams/missing.svg')).rejects.toThrow('HTTP 404')
  })

  it('应使用构造时传入的 endpoint', async () => {
    const custom = new VitePressSaveAdapter('/custom-endpoint')
    const fetchSpy = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) })
    )
    vi.stubGlobal('fetch', fetchSpy)
    await custom.save('<svg></svg>', '/foo.svg')
    expect(fetchSpy).toHaveBeenCalledWith('/custom-endpoint', expect.any(Object))
  })
})
