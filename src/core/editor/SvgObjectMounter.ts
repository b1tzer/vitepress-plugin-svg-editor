/**
 * SVG 对象装载器 — 将 SVG 文本装载为 Fabric 画布对象（framework-free，可单测）
 *
 * 背景：`loadSVGFromString → mergeArrows → convertTextToTextbox →
 * ensureObjectInteractive → canvas.add → zoomFit` 整条装载链此前写死在
 * SvgEditor.vue 的 loadAndInit 中（issue #19 P1）。
 *
 * 方案：下沉为内核纯函数，供 SvgEditor 复用。
 *
 * 依赖方向约束：`mergeArrows` 属于 plugins 层，而 core 不得反向依赖 plugins。
 * 因此这里通过 `transform` 回调参数注入对象级转换（由调用方 SvgEditor 传入
 * mergeArrows），保持 core → plugins 的单向依赖不变。
 */

import * as fabric from 'fabric'
import type { Canvas, FabricObject } from 'fabric'
import { convertTextToTextbox } from './ObjectFactory'
import { ensureObjectInteractive } from '../shared/interactive'
import { SVG_FILL_VAR_ATTR, SVG_STROKE_VAR_ATTR, type SvgSemanticColors } from '../shared/fabricTypes'

export interface SvgObjectMounterOptions {
  /** 装载前对对象数组做转换（如箭头合并），默认透传 */
  transform?: (objects: FabricObject[]) => FabricObject[]
}

/**
 * 将 SVG 文本装载为 Fabric 画布对象
 * @param canvas 目标 Fabric 画布实例
 * @param svg    已预处理（清洗 + 主题变量替换）后的 SVG 字符串
 * @param options 可选对象级转换（如 mergeArrows）
 * @returns 装载完成后的 Promise（不含 zoomFit / 历史快照，这些属编排层职责）
 */
export function mountSvgObjects(
  canvas: Canvas,
  svg: string,
  options: SvgObjectMounterOptions = {}
): Promise<void> {
  const transform = options.transform

  // reviver：在每个 Fabric 对象创建后读取原始 SVG 元素上的 data-fill-var / data-stroke-var，
  // 挂载语义化颜色 ID（变量名），作为颜色的一等身份。
  const reviver = (element: Element, obj: FabricObject): void => {
    const fillVar = element.getAttribute(SVG_FILL_VAR_ATTR)
    const strokeVar = element.getAttribute(SVG_STROKE_VAR_ATTR)
    if (fillVar) (obj as FabricObject & SvgSemanticColors).fillVar = fillVar
    if (strokeVar) (obj as FabricObject & SvgSemanticColors).strokeVar = strokeVar
  }

  return fabric.loadSVGFromString(svg, reviver).then(({ objects }) => {
    const validObjects = objects.filter((o): o is FabricObject => o !== null)
    // 1. 对象级转换（默认透传；由调用方注入 mergeArrows 等）
    const processed = transform ? transform(validObjects) : validObjects
    // 2. Text → Textbox（文本支持自动换行，需保留 fillVar/strokeVar 语义标记）
    const converted = processed.map(convertTextToTextbox)
    // 3. 添加到画布并确保可交互
    converted.forEach((obj) => {
      ensureObjectInteractive(obj)
      canvas.add(obj)
    })
    // 4. 对画布上所有用户对象兜底确保可交互（跳过 workspace 等内部对象）
    canvas.getObjects().forEach((o) => {
      if (o.excludeFromExport) return
      ensureObjectInteractive(o)
    })
    canvas.requestRenderAll()
  })
}
