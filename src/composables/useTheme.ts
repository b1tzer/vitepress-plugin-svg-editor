/**
 * 主题切换 composable — 明暗主题状态与颜色映射（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取主题切换逻辑，独立为可复用 composable。
 */

import { ref, type Ref } from 'vue'
import type { FabricObject } from 'fabric'
import { LIGHT_TO_DARK, DARK_TO_LIGHT, THEME_VAR_TO_HEX } from '../core/shared/colors'
import type { SvgSemanticColors } from '../core/shared/fabricTypes'
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
    const hexMapping: Record<string, string> = from === 'light' ? LIGHT_TO_DARK : DARK_TO_LIGHT
    const targetHexMap = THEME_VAR_TO_HEX[to] || THEME_VAR_TO_HEX.light
    if (!hexMapping || !Object.keys(hexMapping).length) return
    themeMode.value = to

    function swapColor(hex: string): string {
      if (!hex) return hex
      return hexMapping[hex.toUpperCase()] || hex
    }

    // 语义化颜色 ID 优先：有 fillVar/strokeVar 则按变量名从目标主题精确取色（消除撞色歧义），
    // 否则回退到 hex 双向映射（针对无语义的自定义色）。
    fc.getObjects().forEach((obj: FabricObject) => {
      if (obj.excludeFromExport) return
      const processObject = (o: FabricObject & SvgSemanticColors): void => {
        if (typeof o.fill === 'string') {
          const varName = o.fillVar
          o.set('fill', varName && targetHexMap[varName] ? targetHexMap[varName] : swapColor(o.fill))
        }
        if (typeof o.stroke === 'string') {
          const varName = o.strokeVar
          o.set(
            'stroke',
            varName && targetHexMap[varName] ? targetHexMap[varName] : swapColor(o.stroke)
          )
        }
        // 阴影颜色暂无语义 ID，沿用 hex 双向映射（如 --diagram-ghost 亮 #999999 ↔ 暗 #666666）
        const shadow = (o as FabricObject & { shadow?: { color?: string } }).shadow
        if (shadow?.color) shadow.color = swapColor(shadow.color)
        const children = (o as FabricObject & { _objects?: FabricObject[] })._objects
        if (children) {
          children.forEach((c) => processObject(c as FabricObject & SvgSemanticColors))
        }
      }
      processObject(obj as FabricObject & SvgSemanticColors)
    })
    canvasMgr.updateWorkspaceTheme(to === 'light')
    fc.requestRenderAll()
  }

  return { themeMode, toggleTheme }
}
