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
import type { Canvas } from 'fabric'
import { convertTextToTextbox } from './ObjectFactory'
import { ensureObjectInteractive } from '../shared/Interactive'

export interface SvgObjectMounterOptions {
  /** 装载前对对象数组做转换（如箭头合并），默认透传 */
  transform?: (objects: any[]) => any[]
}

/**
 * 将 SVG 文本装载为 Fabric 画布对象
 * @param canvas 目标 Fabric 画布实例
 * @param svg    已预处理（清洗 + 主题变量替换）后的 SVG 字符串
 * @param options 可选对象级转换（如 mergeArrows）
 * @returns 装载完成后的 Promise（不含 zoomFit / 历史快照，这些属编排层职责）
 */
export function mountSvgObjects(canvas: Canvas, svg: string, options: SvgObjectMounterOptions = {}): Promise<void> {
  const transform = options.transform

  return fabric.loadSVGFromString(svg).then(({ objects }: any) => {
    // 1. 对象级转换（默认透传；由调用方注入 mergeArrows 等）
    const processed = transform ? transform(objects) : objects
    // 2. Text → Textbox（文本支持自动换行）
    const converted = processed.map(convertTextToTextbox)
    // 3. 添加到画布并确保可交互
    converted.forEach((obj: any) => {
      ensureObjectInteractive(obj)
      canvas.add(obj)
    })
    // 4. 对画布上所有用户对象兜底确保可交互（跳过 workspace 等内部对象）
    canvas.getObjects().forEach((o: any) => {
      if (o.excludeFromExport) return
      ensureObjectInteractive(o)
    })
    canvas.requestRenderAll()
  })
}
