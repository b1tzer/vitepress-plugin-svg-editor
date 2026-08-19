/**
 * 主题切换 composable — 明暗主题状态与颜色映射（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取主题切换逻辑，独立为可复用 composable。
 *
 * 颜色映射采用三级策略（swapColor）：
 *   1. hex 精确映射（LIGHT_TO_DARK / DARK_TO_LIGHT 语义色板双向表）
 *   2. 双向记忆化缓存（保证「亮→暗→亮」精确等幂恢复；高饱和边界色靠它兜底）
 *   3. OKLCH 亮度翻转计算（adaptColorLuminance，首次命中时计算并写入缓存）
 *
 * 同时通过 getDarkToLightMap() 暴露「暗色 hex → 亮色 hex」反向映射，
 * 供保存链路（useSave → SvgSerializer）在暗色模式下把非语义色归一化回亮色真值。
 */

import { ref, type Ref } from 'vue'
import type { FabricObject } from 'fabric'
import { LIGHT_TO_DARK, DARK_TO_LIGHT, THEME_VAR_TO_HEX } from '../core/shared/colors'
import { adaptColorLuminance } from '../core/shared/adaptiveColor'
import type { SvgSemanticColors } from '../core/shared/fabricTypes'
import type { CanvasManager } from '../core/canvas/CanvasManager'

export function useTheme(canvasMgr: CanvasManager): {
  themeMode: Ref<'light' | 'dark'>
  toggleTheme: () => void
  /** 暗色 hex → 亮色 hex 反向映射（供保存时归一化非语义色到亮色真值） */
  getDarkToLightMap: () => Map<string, string>
} {
  const themeMode = ref<'light' | 'dark'>(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  // 自适应颜色映射缓存（跨 toggleTheme 调用持久）：
  // OKLCH 亮度翻转对高饱和边界色（如 #FF0000）会因 sRGB 色域裁剪而丢失信息，
  // 单纯靠自逆函数无法保证「亮→暗→亮」精确恢复。这里用双向记忆化把
  // 「计算出的对应关系」记住，往返时查表恢复——即「先计算、再记住」。
  const lightToDarkCache = new Map<string, string>()
  const darkToLightCache = new Map<string, string>()

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
      const upper = hex.toUpperCase()
      // 1) hex 精确映射（语义色板双向表）
      const mapped = hexMapping[upper]
      if (mapped) return mapped
      // 2) 自适应兜底 + 双向记忆化（保证「亮→暗→亮」精确等幂恢复）
      if (from === 'light') {
        const cached = lightToDarkCache.get(upper)
        if (cached) return cached
        const adapted = adaptColorLuminance(hex)
        lightToDarkCache.set(upper, adapted)
        // value 存原始 hex（保持大小写），避免往返后大小写被规范化
        darkToLightCache.set(adapted.toUpperCase(), hex)
        return adapted
      }
      const cached = darkToLightCache.get(upper)
      if (cached) return cached
      const adapted = adaptColorLuminance(hex)
      darkToLightCache.set(upper, adapted)
      lightToDarkCache.set(adapted.toUpperCase(), hex)
      return adapted
    }

    // 语义化颜色 ID 优先：有 fillVar/strokeVar 则按变量名从目标主题精确取色（消除撞色歧义），
    // 否则回退到 hex 双向映射（针对无语义的自定义色）。
    fc.getObjects().forEach((obj: FabricObject) => {
      if (obj.excludeFromExport) return
      const processObject = (o: FabricObject & SvgSemanticColors): void => {
        const fill = o.fill
        if (typeof fill === 'string') {
          const varName = o.fillVar
          o.set('fill', varName && targetHexMap[varName] ? targetHexMap[varName] : swapColor(fill))
        } else if (fill && typeof fill === 'object') {
          // 渐变填充（fabric.Gradient）：遍历 colorStops，对每个色标做映射
          const stops = (fill as { colorStops?: { offset: number; color: string }[] }).colorStops
          if (stops) {
            stops.forEach((stop) => {
              stop.color = swapColor(stop.color)
            })
            // colorStops 是渐变对象的内部可变属性，直接改不会触发对象 dirty，
            // 若 objectCaching 开启会继续用旧缓存位图；手动标记 dirty 强制重光栅化。
            ;(o as FabricObject & { dirty?: boolean }).dirty = true
          }
        }
        if (typeof o.stroke === 'string') {
          const varName = o.strokeVar
          o.set(
            'stroke',
            varName && targetHexMap[varName] ? targetHexMap[varName] : swapColor(o.stroke)
          )
        }
        // 阴影颜色暂无语义 ID，沿用 swapColor（先精确映射、未命中则自适应亮度翻转）
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

  return { themeMode, toggleTheme, getDarkToLightMap: () => darkToLightCache }
}
