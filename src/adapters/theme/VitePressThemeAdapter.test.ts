/**
 * ThemeAdapter 单元测试
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { VitePressThemeAdapter } from '../theme/VitePressThemeAdapter'

describe('VitePressThemeAdapter', () => {
  let adapter: VitePressThemeAdapter

  beforeEach(() => {
    adapter = new VitePressThemeAdapter()
    document.documentElement.classList.remove('dark')
  })

  it('默认返回非暗色模式', () => {
    expect(adapter.isDark()).toBe(false)
  })

  it('当 document.documentElement 含 .dark 时返回 true', () => {
    document.documentElement.classList.add('dark')
    expect(adapter.isDark()).toBe(true)
  })

  it('onChange 回调在 class 变化时触发', async () => {
    let lastValue: boolean | null = null
    const unsub = adapter.onChange((isDark) => {
      lastValue = isDark
    })

    document.documentElement.classList.add('dark')

    // MutationObserver 是异步的
    await new Promise((r) => setTimeout(r, 50))

    expect(lastValue).toBe(true)

    unsub()
  })

  it('取消监听后不再触发回调', async () => {
    let callCount = 0
    const unsub = adapter.onChange(() => {
      callCount++
    })
    unsub()

    document.documentElement.classList.add('dark')
    await new Promise((r) => setTimeout(r, 50))

    expect(callCount).toBe(0)
  })
})
