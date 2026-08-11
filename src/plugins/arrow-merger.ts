/**
 * 箭头合并插件 — 将相邻 line + polygon 合并为 Group
 * Fabric.js 加载 SVG 时可能不自动识别 <g> 包裹的箭头对，需要手动合并
 */

import * as fabric from 'fabric'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeArrows(objects: any[]) {
  const result: any[] = []
  const used = new Set<number>()
  for (let i = 0; i < objects.length; i++) {
    if (used.has(i)) continue
    const obj = objects[i]
    if (obj.type === 'line' && i + 1 < objects.length) {
      const next = objects[i + 1]
      if (next.type === 'polygon' && !used.has(i + 1)) {
        const lineCenterX = (obj.left || 0) + (obj.width || 0) / 2
        const lineCenterY = (obj.top || 0) + (obj.height || 0) / 2
        const useAbsX2 = Math.abs(obj.x2 || 0) > Math.max((obj.width || 0) / 2 + 5, 15)
        const useAbsY2 = Math.abs(obj.y2 || 0) > Math.max((obj.height || 0) / 2 + 5, 15)
        const absX2 = useAbsX2 ? (obj.x2 || 0) : lineCenterX + (obj.x2 || 0)
        const absY2 = useAbsY2 ? (obj.y2 || 0) : lineCenterY + (obj.y2 || 0)
        const polyW = (next.width || 0) * (next.scaleX || 1)
        const polyH = (next.height || 0) * (next.scaleY || 1)
        const polyCenterX = (next.left || 0) + polyW / 2
        const polyCenterY = (next.top || 0) + polyH / 2
        const dist = Math.sqrt((absX2 - polyCenterX) ** 2 + (absY2 - polyCenterY) ** 2)
        if (dist < 30) {
          result.push(new fabric.Group([obj, next], {
            selectable: true,
            evented: true,
            perPixelTargetFind: false,
            subTargetCheck: true,
          }))
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
