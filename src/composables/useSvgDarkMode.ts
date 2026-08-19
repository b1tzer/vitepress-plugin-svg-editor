/**
 * 展示层暗色派生 composable — 主题监听与 DOM 生命周期管理
 *
 * 配合 svgDarkMode.ts 纯函数模块：
 *   - 用 MutationObserver 监听 <html> 的 class 变化（VitePress 用 .dark 切换主题）
 *   - 由组件在 v-html 渲染完成后调用 refresh() 重新收集并应用
 */

import { onMounted, onUnmounted } from 'vue'
import { collectSvgColorEntries, applySvgTheme, type SvgColorEntry } from '../core/shared/svgDarkMode'

export function useSvgDarkMode(getRoot: () => Element | null): {
  /** v-html 内容更新后调用：重新收集颜色入口并应用当前主题 */
  refresh: () => void
} {
  let entries: SvgColorEntry[] = []
  let observer: MutationObserver | null = null

  const isDark = (): boolean =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  function refresh(): void {
    const root = getRoot()
    entries = root ? collectSvgColorEntries(root) : []
    applySvgTheme(entries, isDark())
  }

  function handleThemeChange(): void {
    applySvgTheme(entries, isDark())
  }

  onMounted(() => {
    if (typeof document === 'undefined') return
    // 监听 <html> class 变化（VitePress 主题切换通过增删 .dark 实现）
    observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { refresh }
}
