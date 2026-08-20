/**
 * 主题切换 composable — 明暗主题状态与颜色映射（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取主题切换逻辑，独立为可复用 composable。
 *
 * 颜色采用「亮色真值 + 单向派生」模型（档位 2 重构）：
 *   - 导入时对象挂载 fillLight / strokeLight（亮色真值）
 *   - 切暗：语义色查暗色语义表，非语义色 lightHexToDark(fillLight) 单向派生
 *   - 切亮：直接写回 fillLight / strokeLight 真值
 *
 * 因此无需双向映射表、无需记忆化往返缓存，也无需向保存链路暴露反向映射。
 * 保存时的「非语义色暗→亮归一化」由 SvgSerializer 直接从对象 fillLight 收集。
 */

import { ref, type Ref } from 'vue'
import type { FabricObject } from 'fabric'
import { THEME_VAR_TO_HEX, lightHexToDark } from '../core/shared/colors'
import type { SvgSemanticColors } from '../core/shared/fabricTypes'
import type { CanvasManager } from '../core/canvas/CanvasManager'
import type { ColorMode } from '../core/shared/types'

/** 填充色单向派生：切暗从真值派生暗色，切亮恢复亮色真值。
 *  非语义色首次切暗时惰性锚定 fillLight = 当前值（即亮色真值），
 *  兼容直接 new 的裸对象（未经过 reviver 挂载 fillLight）。 */
function resolveFill(
  o: FabricObject & SvgSemanticColors,
  isDark: boolean,
  algorithmOnly: boolean,
  targetHexMap: Record<string, string>,
  current: string
): string {
  if (!isDark) return o.fillLight ?? current
  const varName = o.fillVar
  if (varName && targetHexMap[varName]) return targetHexMap[varName]
  if (o.fillLight === undefined) o.fillLight = current
  return lightHexToDark(o.fillLight, algorithmOnly)
}

/** 描边色单向派生：切暗从真值派生暗色，切亮恢复亮色真值。 */
function resolveStroke(
  o: FabricObject & SvgSemanticColors,
  isDark: boolean,
  algorithmOnly: boolean,
  targetHexMap: Record<string, string>,
  current: string
): string {
  if (!isDark) return o.strokeLight ?? current
  const varName = o.strokeVar
  if (varName && targetHexMap[varName]) return targetHexMap[varName]
  if (o.strokeLight === undefined) o.strokeLight = current
  return lightHexToDark(o.strokeLight, algorithmOnly)
}

export function useTheme(
  canvasMgr: CanvasManager,
  options: { colorMode?: ColorMode } = {}
): {
  themeMode: Ref<'light' | 'dark'>
  toggleTheme: () => void
} {
  // 纯算法模式：跳过色板精确映射，所有颜色一律走 OKLCH 亮度翻转。
  const algorithmOnly = options.colorMode === 'algorithm'

  const themeMode = ref<'light' | 'dark'>(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  function toggleTheme(): void {
    const fc = canvasMgr.canvas
    if (!fc) return
    const to = themeMode.value === 'light' ? 'dark' : 'light'
    const targetHexMap = THEME_VAR_TO_HEX[to] || THEME_VAR_TO_HEX.light
    const isDark = to === 'dark'
    themeMode.value = to

    // 单向派生：
    //  - 切暗：语义色按变量名取暗色语义 hex；非语义色从亮色真值 lightHexToDark 派生
    //  - 切亮：直接写回亮色真值（fillLight / strokeLight）
    fc.getObjects().forEach((obj: FabricObject) => {
      if (obj.excludeFromExport) return
      const processObject = (o: FabricObject & SvgSemanticColors): void => {
        const fill = o.fill
        if (typeof fill === 'string') {
          o.set('fill', resolveFill(o, isDark, algorithmOnly, targetHexMap, fill))
        } else if (fill && typeof fill === 'object') {
          // 渐变填充（fabric.Gradient）：每个 colorStops 用「记录真值 + 单向派生」。
          // 真值记在 stop._lightColor，切亮恢复，保证等幂且无需全局缓存。
          const stops = (
            fill as {
              colorStops?: { offset: number; color: string; _lightColor?: string }[]
            }
          ).colorStops
          if (stops) {
            stops.forEach((stop) => {
              if (isDark) {
                if (stop._lightColor === undefined) stop._lightColor = stop.color
                stop.color = lightHexToDark(stop._lightColor, algorithmOnly)
              } else {
                stop.color = stop._lightColor ?? stop.color
              }
            })
            // colorStops 是渐变对象的内部可变属性，直接改不会触发对象 dirty，
            // 若 objectCaching 开启会继续用旧缓存位图；手动标记 dirty 强制重光栅化。
            ;(o as FabricObject & { dirty?: boolean }).dirty = true
          }
        }
        if (typeof o.stroke === 'string') {
          o.set('stroke', resolveStroke(o, isDark, algorithmOnly, targetHexMap, o.stroke))
        }
        // 阴影颜色：同样用 _lightColor 记录真值 + 单向派生（无语义 ID）
        const shadow = (o as FabricObject & { shadow?: { color?: string; _lightColor?: string } })
          .shadow
        if (shadow?.color) {
          if (isDark) {
            if (shadow._lightColor === undefined) shadow._lightColor = shadow.color
            shadow.color = lightHexToDark(shadow._lightColor, algorithmOnly)
          } else {
            shadow.color = shadow._lightColor ?? shadow.color
          }
        }
        const children = (o as FabricObject & { _objects?: FabricObject[] })._objects
        if (children) {
          children.forEach((c) => processObject(c as FabricObject & SvgSemanticColors))
        }
      }
      processObject(obj as FabricObject & SvgSemanticColors)
    })
    canvasMgr.updateWorkspaceTheme(!isDark)
    fc.requestRenderAll()
  }

  return { themeMode, toggleTheme }
}
