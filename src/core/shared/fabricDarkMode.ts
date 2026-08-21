/**
 * Fabric 对象层明暗派生模块 — 框架无关的纯函数
 *
 * 与 svgDarkMode.ts（DOM 层）互补：本模块处理 Fabric 画布对象。
 * 全面转入算法变色后，对象以「亮色真值 + 单向派生」模型工作：
 *   - 切暗：由亮色真值经 OKLCH 亮度翻转派生暗色
 *   - 切亮：直接写回亮色真值
 *
 * 真值载体（统一命名，无魔法字符串属性）：
 *   - 对象 fill/stroke：fillLight / strokeLight（见 fabricTypes.SvgLightColors）
 *   - 渐变 stop：lightColor（记录该 stop 的亮色真值）
 *   - 阴影：lightColor（记录阴影颜色的亮色真值）
 *
 * 单向派生的等幂性依赖「首次切暗时惰性锚定真值」：
 * 切暗时若尚未锚定，则把当前色记录为亮色真值再派生暗色；
 * 切亮时直接写回真值，无需反向计算，也无需全局缓存。
 */

import type { FabricObject } from 'fabric'
import { lightHexToDark } from './colors'
import type { SvgLightColors } from './fabricTypes'

/** 可承载亮色真值的渐变 stop（fabric.Gradient.colorStops 元素） */
export interface GradientStopWithLight {
  offset: number
  color: string
  /** 该 stop 的亮色真值（首次切暗时惰性锚定，切亮恢复） */
  lightColor?: string
}

/** 可承载亮色真值的阴影（fabric.Shadow） */
export interface ShadowWithLight {
  color?: string
  /** 阴影颜色的亮色真值（首次切暗时惰性锚定，切亮恢复） */
  lightColor?: string
}

/** 渐变填充（fabric.Gradient）的可派生视图 */
interface GradientWithLight {
  colorStops?: GradientStopWithLight[]
}

/** 参与明暗派生的 Fabric 对象扩展视图 */
type ThemeableObject = FabricObject &
  SvgLightColors & {
    shadow?: ShadowWithLight
    _objects?: FabricObject[]
    dirty?: boolean
  }

/** fill 通道单向派生：切暗从 fillLight 真值派生暗色，切亮恢复真值 */
function resolveFill(o: ThemeableObject, isDark: boolean, current: string): string {
  if (!isDark) return o.fillLight ?? current
  if (o.fillLight === undefined) o.fillLight = current
  return lightHexToDark(o.fillLight)
}

/** stroke 通道单向派生：切暗从 strokeLight 真值派生暗色，切亮恢复真值 */
function resolveStroke(o: ThemeableObject, isDark: boolean, current: string): string {
  if (!isDark) return o.strokeLight ?? current
  if (o.strokeLight === undefined) o.strokeLight = current
  return lightHexToDark(o.strokeLight)
}

/** 渐变 stop 单向派生 */
function resolveGradientStop(stop: GradientStopWithLight, isDark: boolean): void {
  if (isDark) {
    if (stop.lightColor === undefined) stop.lightColor = stop.color
    stop.color = lightHexToDark(stop.lightColor)
  } else {
    stop.color = stop.lightColor ?? stop.color
  }
}

/** 阴影颜色单向派生 */
function resolveShadow(shadow: ShadowWithLight, isDark: boolean): void {
  if (!shadow.color) return
  if (isDark) {
    if (shadow.lightColor === undefined) shadow.lightColor = shadow.color
    shadow.color = lightHexToDark(shadow.lightColor)
  } else {
    shadow.color = shadow.lightColor ?? shadow.color
  }
}

/**
 * 对单个 Fabric 对象（含 Group 子对象）应用明暗主题。
 *
 * 覆盖 fill（纯色 / 渐变 colorStops）、stroke、shadow 四类颜色载体，
 * 递归处理 Group 子对象。是否跳过 excludeFromExport 由调用方负责。
 *
 * @param obj    目标对象
 * @param isDark 是否切暗（false 表示恢复亮色）
 */
export function applyObjectTheme(obj: FabricObject, isDark: boolean): void {
  const o = obj as ThemeableObject

  // fill：纯色走 fillLight 真值；渐变走 colorStops 各自的 lightColor 真值
  const fill = o.fill
  if (typeof fill === 'string') {
    o.set('fill', resolveFill(o, isDark, fill))
  } else if (fill && typeof fill === 'object') {
    const stops = (fill as GradientWithLight).colorStops
    if (stops) {
      stops.forEach((stop) => resolveGradientStop(stop, isDark))
      // colorStops 是渐变对象的内部可变属性，直接改不会触发对象 dirty，
      // 若 objectCaching 开启会继续用旧缓存位图；手动标记 dirty 强制重光栅化。
      o.dirty = true
    }
  }

  // stroke：纯色走 strokeLight 真值
  if (typeof o.stroke === 'string') {
    o.set('stroke', resolveStroke(o, isDark, o.stroke))
  }

  // shadow：阴影颜色走 lightColor 真值
  if (o.shadow?.color) {
    resolveShadow(o.shadow, isDark)
  }

  // 递归 Group 子对象
  if (o._objects) {
    o._objects.forEach((c) => applyObjectTheme(c, isDark))
  }
}
