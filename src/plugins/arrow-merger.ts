/**
 * 箭头合并插件 — 将相邻 line + polygon 合并为 Group
 * Fabric.js 加载 SVG 时可能不自动识别 <g> 包裹的箭头对，需要手动合并
 */

import * as fabric from 'fabric'
import type { FabricObject, Line } from 'fabric'
import { FABRIC_TYPE } from '../core/shared/fabricTypes'

export function mergeArrows(objects: FabricObject[]): FabricObject[] {
  const result: FabricObject[] = []
  const used = new Set<number>()
  for (let i = 0; i < objects.length; i++) {
    if (used.has(i)) continue
    const obj = objects[i]
    if (obj.type === FABRIC_TYPE.LINE && i + 1 < objects.length) {
      const line = obj as Line
      const next = objects[i + 1]
      if (next.type === FABRIC_TYPE.POLYGON && !used.has(i + 1)) {
        // Fabric v6 的 Line 中 x1/y1/x2/y2 是绝对 SVG 坐标（见 fabric 源码 _setWidthHeight：
        // width = |x2 - x1|、height = |y2 - y1|，left/top 为包围盒左上角）。
        // 终点绝对坐标直接取 line.x2 / line.y2，无需按数值大小猜测坐标约定。
        // 早期按 |x2| 与 width/2 比较的猜测逻辑会误判「终点在 left/top 边」的斜线
        // （例如从右到左的箭头），导致箭头无法合并。
        const absX2 = line.x2 || 0
        const absY2 = line.y2 || 0
        const polyW = (next.width || 0) * (next.scaleX || 1)
        const polyH = (next.height || 0) * (next.scaleY || 1)
        const polyCenterX = (next.left || 0) + polyW / 2
        const polyCenterY = (next.top || 0) + polyH / 2
        const dist = Math.sqrt((absX2 - polyCenterX) ** 2 + (absY2 - polyCenterY) ** 2)
        if (dist < 30) {
          result.push(
            new fabric.Group([obj, next], {
              selectable: true,
              evented: true,
              perPixelTargetFind: false,
              subTargetCheck: true,
            })
          )
          used.add(i)
          used.add(i + 1)
          continue
        }
      }
    }
    result.push(obj)
    used.add(i)
  }
  return result
}
