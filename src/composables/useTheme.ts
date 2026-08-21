/**
 * 主题切换 composable — 编辑器 chrome 明暗 + SVG 画布按住预览暗色
 *
 * 全面转入算法变色后，将「编辑器界面明暗」与「SVG 画布明暗」彻底解耦：
 *   - uiTheme：编辑器工具栏/菜单/面板等 chrome 的明暗，跟随网页 <html> 的 .dark class
 *   - svgDark：SVG 画布颜色的暗色预览，仅由「按住预览」按钮控制
 *
 * 颜色采用「亮色真值 + 单向派生」模型（对象级派生逻辑见 fabricDarkMode.ts）：
 *   - 导入时对象挂载 fillLight / strokeLight（亮色真值）
 *   - 按住预览切暗：applyObjectTheme 做 OKLCH 亮度翻转
 *   - 松手切回亮色：直接写回真值
 *
 * 本 composable 不依赖 Vue 生命周期钩子：网页明暗监听的 MutationObserver 由
 * mountUiThemeSync / unmountUiThemeSync 提供（观察逻辑下沉至此），但挂载/卸载
 * 的时机仍由组件层（SvgEditor）在 onMounted/onUnmounted 中控制，从而避免在
 * 非组件环境（单测直接调用 useTheme）触发 onMounted/onUnmounted 警告。
 */

import { ref, type Ref } from 'vue'
import type { FabricObject } from 'fabric'
import { applyObjectTheme } from '../core/shared/fabricDarkMode'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { ThemeMode } from '../core/shared/types'

/** 读取当前网页明暗（<html> 是否含 .dark class） */
function readUiTheme(): ThemeMode {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
}

export function useTheme(canvasMgr: CanvasManager): {
  uiTheme: Ref<ThemeMode>
  svgDark: Ref<boolean>
  setSvgDark: (dark: boolean) => void
  syncUiTheme: () => void
  /** 挂载网页明暗监听（组件 onMounted 调用）：创建 MutationObserver 监听 <html> class */
  mountUiThemeSync: () => void
  /** 卸载网页明暗监听（组件 onUnmounted 调用） */
  unmountUiThemeSync: () => void
} {
  // 编辑器 chrome 明暗：跟随网页 <html> 的 .dark class
  const uiTheme = ref<ThemeMode>(readUiTheme())
  // SVG 画布暗色预览：默认 false（亮色原始色）
  const svgDark = ref(false)
  /** 网页明暗监听器（闭包持有；挂载/卸载由组件层控制，保持本 composable 不依赖 Vue 生命周期钩子） */
  let observer: MutationObserver | null = null

  /** 由 MutationObserver 调用：同步 uiTheme 到当前网页明暗 */
  function syncUiTheme(): void {
    uiTheme.value = readUiTheme()
  }

  /** 挂载网页明暗监听：监听 <html> class 变化（VitePress 通过增删 .dark 切换明暗） */
  function mountUiThemeSync(): void {
    if (typeof document === 'undefined') return
    observer = new MutationObserver(() => syncUiTheme())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }

  /** 卸载网页明暗监听 */
  function unmountUiThemeSync(): void {
    observer?.disconnect()
    observer = null
  }

  function setSvgDark(dark: boolean): void {
    if (svgDark.value === dark) return
    svgDark.value = dark

    const fc = canvasMgr.canvas
    if (!fc) return

    // 单向派生：切暗做 OKLCH 翻转，切亮写回真值（逻辑收敛于 fabricDarkMode.applyObjectTheme）
    fc.getObjects().forEach((obj: FabricObject) => {
      if (obj.excludeFromExport) return
      applyObjectTheme(obj, dark)
    })
    // workspace 背景（画布底色）跟随 SVG 暗色预览，而非编辑器 chrome 主题
    canvasMgr.updateWorkspaceTheme(!dark)
    fc.requestRenderAll()
  }

  return {
    uiTheme,
    svgDark,
    setSvgDark,
    syncUiTheme,
    mountUiThemeSync,
    unmountUiThemeSync,
  }
}
