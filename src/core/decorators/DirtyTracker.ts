/**
 * 装饰器模块 — 给 Fabric.js 对象动态附加行为
 *
 * 使用高阶函数模式（非 TypeScript decorator 语法），
 * 不侵入对象原始逻辑，动态添加能力。
 *
 * 使用方式：
 *   const rect = withDirtyTracking(new fabric.Rect({...}), (obj) => onDirty(obj))
 *   const obj = withSnapToGrid(new fabric.Rect({...}), 10)
 */

import type { FabricObject } from 'fabric'

/**
 * 脏标记追踪：监听对象的 modified / moving / scaling / rotating 事件
 * 当对象被修改时调用回调
 *
 * @param obj     目标 Fabric 对象
 * @param onDirty 脏标记回调
 * @returns 增强后的对象（同一引用）
 */
export function withDirtyTracking(
  obj: FabricObject,
  onDirty: (obj: FabricObject) => void,
): FabricObject {
  obj.on('modified', () => onDirty(obj))
  obj.on('moving', () => onDirty(obj))
  obj.on('scaling', () => onDirty(obj))
  obj.on('rotating', () => onDirty(obj))
  return obj
}

/**
 * 自动保存：在对象修改后延迟触发保存回调
 *
 * @param obj        目标 Fabric 对象
 * @param saveFn     保存回调
 * @param debounceMs 防抖毫秒数（默认 1000）
 * @returns 增强后的对象
 */
export function withAutoSave(
  obj: FabricObject,
  saveFn: () => void,
  debounceMs: number = 1000,
): FabricObject {
  let timer: ReturnType<typeof setTimeout> | null = null

  const scheduleSave = (): void => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      saveFn()
      timer = null
    }, debounceMs)
  }

  obj.on('modified', scheduleSave)
  obj.on('moving', scheduleSave)
  obj.on('scaling', scheduleSave)
  obj.on('rotating', scheduleSave)
  return obj
}

/**
 * 网格吸附：对象移动时吸附到网格
 *
 * @param obj      目标 Fabric 对象
 * @param gridSize 网格大小（像素）
 * @returns 增强后的对象
 */
export function withSnapToGrid(
  obj: FabricObject,
  gridSize: number,
): FabricObject {
  obj.on('modified', () => {
    const left = obj.left || 0
    const top = obj.top || 0
    const snappedLeft = Math.round(left / gridSize) * gridSize
    const snappedTop = Math.round(top / gridSize) * gridSize

    if (snappedLeft !== left || snappedTop !== top) {
      obj.set({ left: snappedLeft, top: snappedTop })
      obj.setCoords()
    }
  })
  return obj
}

/**
 * 组合装饰器：一次性应用多个装饰器
 *
 * @param obj        目标 Fabric 对象
 * @param decorators 装饰器函数数组
 * @returns 增强后的对象
 */
export function applyDecorators(
  obj: FabricObject,
  decorators: Array<(obj: FabricObject) => FabricObject>,
): FabricObject {
  for (const decorator of decorators) {
    decorator(obj)
  }
  return obj
}
