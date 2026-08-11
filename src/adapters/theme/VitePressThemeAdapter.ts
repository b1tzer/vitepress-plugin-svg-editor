/**
 * VitePress 主题适配器
 *
 * 实现 ThemeAdapter 接口，通过 MutationObserver 监听
 * document.documentElement.classList 中的 'dark' 类名变化，
 * 与 VitePress 内置的暗色模式切换保持同步。
 */

import type { ThemeAdapter } from './ThemeAdapter'

export class VitePressThemeAdapter implements ThemeAdapter {
  private observer: MutationObserver | null = null

  isDark(): boolean {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  }

  onChange(callback: (isDark: boolean) => void): () => void {
    // 防止重复注册
    if (this.observer) this.observer.disconnect()

    this.observer = new MutationObserver(() => {
      callback(this.isDark())
    })

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // 返回取消监听函数
    return () => {
      this.observer?.disconnect()
      this.observer = null
    }
  }
}
