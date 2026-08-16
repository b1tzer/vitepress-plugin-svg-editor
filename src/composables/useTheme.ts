/**
 * 主题切换 composable — 明暗主题状态与颜色映射（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取主题切换逻辑，独立为可复用 composable。
 */

import { ref, type Ref } from 'vue'
import { LIGHT_TO_DARK, DARK_TO_LIGHT } from '../core/shared/colors'
import type { CanvasManager } from '../core/canvas/CanvasManager'

export function useTheme(canvasMgr: CanvasManager): {
  themeMode: Ref<'light' | 'dark'>
  toggleTheme: () => void
} {
  const themeMode = ref<'light' | 'dark'>(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  function toggleTheme(): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const from = themeMode.value
    const to = from === 'light' ? 'dark' : 'light'
    const mapping: any = from === 'light' ? LIGHT_TO_DARK : DARK_TO_LIGHT
    if (!mapping || !Object.keys(mapping).length) return
    themeMode.value = to

    function swapColor(hex: any): string {
      if (!hex || typeof hex !== 'string') return hex
      return mapping[hex.toUpperCase()] || hex
    }

    fc.getObjects().forEach((obj: any) => {
      if (obj.excludeFromExport) return
      ;(function processObject(o: any) {
        if (o.fill && typeof o.fill === 'string') o.set('fill', swapColor(o.fill))
        if (o.stroke && typeof o.stroke === 'string') o.set('stroke', swapColor(o.stroke))
        if (o._objects) o._objects.forEach(processObject)
      })(obj)
    })
    canvasMgr.updateWorkspaceTheme(to === 'light')
    fc.requestRenderAll()
  }

  return { themeMode, toggleTheme }
}
