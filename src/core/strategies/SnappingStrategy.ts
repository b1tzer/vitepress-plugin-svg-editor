/**
 * 吸附策略 — 定义对象拖拽时的对齐吸附行为
 */

import type { FabricObject } from 'fabric'
import type { ObjectBounds, GuideLine } from '../types'
import { getObjBounds } from '../../plugins/selection'

const DEFAULT_SNAP_THRESHOLD = 8

/** 吸附结果 */
export interface SnapResult {
  snapX: number | null
  snapY: number | null
  guidelines: GuideLine[]
}

/** 吸附策略接口 */
export interface ISnappingStrategy {
  /**
   * 计算吸附位置
   * @param objBounds      正在拖拽对象的边界
   * @param otherObjects   画布上其他对象
   * @param threshold      吸附阈值（像素）
   * @returns 吸附结果，含建议的 snapX/snapY 和辅助线
   */
  calculateSnap(
    objBounds: ObjectBounds,
    otherObjects: FabricObject[],
    threshold?: number,
  ): SnapResult
}

/**
 * 默认吸附策略：中心/边缘对齐 + 吸附
 */
export class DefaultSnappingStrategy implements ISnappingStrategy {
  calculateSnap(
    objBounds: ObjectBounds,
    otherObjects: FabricObject[],
    threshold: number = DEFAULT_SNAP_THRESHOLD,
  ): SnapResult {
    const guidelines: GuideLine[] = []
    let snapX: number | null = null
    let snapY: number | null = null

    for (const other of otherObjects) {
      const ob = getObjBounds(other)

      // 垂直对齐检测
      for (const check of [
        { objX: objBounds.centerX, otherX: ob.centerX },
        { objX: objBounds.left, otherX: ob.left },
        { objX: objBounds.right, otherX: ob.right },
      ]) {
        if (Math.abs(check.objX - check.otherX) < threshold) {
          guidelines.push({ type: 'vertical', x: check.otherX })
          if (snapX === null) snapX = check.otherX - objBounds.centerX
        }
      }

      // 水平对齐检测
      for (const check of [
        { objY: objBounds.centerY, otherY: ob.centerY },
        { objY: objBounds.top, otherY: ob.top },
        { objY: objBounds.bottom, otherY: ob.bottom },
      ]) {
        if (Math.abs(check.objY - check.otherY) < threshold) {
          guidelines.push({ type: 'horizontal', y: check.otherY })
          if (snapY === null) snapY = check.otherY - objBounds.centerY
        }
      }
    }

    return { snapX, snapY, guidelines }
  }
}
