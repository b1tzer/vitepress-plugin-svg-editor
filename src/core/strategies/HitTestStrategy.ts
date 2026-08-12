/**
 * 命中检测策略 — 定义对象点击检测行为
 */

import type { FabricObject } from 'fabric'

/** 命中检测策略接口 */
export interface IHitTestStrategy {
  /**
   * 判断点是否命中了某个对象
   * @param obj   候选对象
   * @param point 鼠标点坐标
   * @param canvas 画布实例（可选，用于某些需要上下文的策略）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hitTest(obj: FabricObject, point: { x: number; y: number }, canvas?: any): boolean
}

/**
 * 默认命中策略：使用对象边界矩形检测
 */
export class DefaultHitTestStrategy implements IHitTestStrategy {
  hitTest(obj: FabricObject, point: { x: number; y: number }): boolean {
    const bounds = obj.getBoundingRect()
    return (
      point.x >= bounds.left &&
      point.x <= bounds.left + bounds.width &&
      point.y >= bounds.top &&
      point.y <= bounds.top + bounds.height
    )
  }
}

/**
 * 扩展命中策略：对无填充对象使用透明填充区域检测
 * 与 Fabric.js 的 perPixelTargetFind 行为互补
 */
export class ExtendedHitTestStrategy extends DefaultHitTestStrategy {
  hitTest(
    obj: FabricObject,
    point: { x: number; y: number },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas?: any,
  ): boolean {
    // 先做矩形检测
    if (!super.hitTest(obj, point)) return false

    // 对有填充的对象直接返回命中
    if (obj.fill && obj.fill !== 'none' && obj.fill !== 'transparent') {
      return true
    }

    // 对无填充对象返回命中（因为它们已设置了透明填充）
    return true
  }
}

// ═══════════════════════════════════════════════════════════════
// Export 策略
// ═══════════════════════════════════════════════════════════════

import type { Canvas } from 'fabric'

/** 导出策略接口 */
export interface IExportStrategy {
  /**
   * 序列化画布为字符串
   * @param canvas         Fabric 画布实例
   * @param originalViewBox 原始 SVG 的 viewBox（可选）
   * @returns 导出的字符串
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize(canvas: any, originalViewBox?: string): string
}

/**
 * SVG 导出策略：使用 Fabric 的 toSVG 方法
 */
export class SvgExportStrategy implements IExportStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize(canvas: any, originalViewBox?: string): string {
    // 使用 Fabric 6 的 toSVG() 方法
    const svg = canvas.toSVG()
    // 如果提供了原始 viewBox，确保输出 SVG 包含它
    if (originalViewBox) {
      return svg.replace(
        /(<svg[^>]*)>/,
        `$1 viewBox="${originalViewBox}">`,
      )
    }
    return svg
  }
}
