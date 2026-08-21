/**
 * 颜色身份维护模块 — 改色时同步维护「亮色真值」
 *
 * 全面转入算法变色后，对象以 fillLight / strokeLight 记录「亮色真值」，
 * 明暗切换退化为「单向派生」：
 *   - 按住预览切暗：fill = lightHexToDark(fillLight)（OKLCH 亮度翻转）
 *   - 松手 / 切回亮色：fill = fillLight（直接写回真值）
 *
 * 因此任何「用户改色」入口都必须同步更新真值，
 * 否则切回亮色时会把用户刚改的色覆盖回旧值。
 * 这些 helper 统一封装「set + 身份维护」，供 useStyleOps / text-format / gradient 复用。
 */

import type { FabricObject } from 'fabric'
import type { SvgLightColors } from './fabricTypes'

type ColorIdentityObject = FabricObject & SvgLightColors

/**
 * 设置对象填充色为「新的亮色真值」：把亮色真值锚定为新色。
 */
export function setFillHex(obj: FabricObject, hex: string): void {
  obj.set('fill', hex)
  const o = obj as ColorIdentityObject
  o.fillLight = hex
}

/**
 * 设置对象描边色为「新的亮色真值」。
 */
export function setStrokeHex(obj: FabricObject, hex: string): void {
  obj.set('stroke', hex)
  const o = obj as ColorIdentityObject
  o.strokeLight = hex
}

/**
 * 清空填充的颜色身份（用于渐变等非 hex 填充）：
 * 渐变不是单一 hex，无法记录亮色真值，其明暗由 useTheme 在 colorStops 级单独派生。
 */
export function clearFillIdentity(obj: FabricObject): void {
  const o = obj as ColorIdentityObject
  o.fillLight = undefined
}
