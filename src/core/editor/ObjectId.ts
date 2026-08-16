/**
 * 对象稳定 ID 工具
 *
 * 背景：图层面板此前用 `layer-${i}`（数组索引）作为图层 ID，
 * 一旦对象被删除或重排，索引错位会导致选中/可见性切换作用到错误对象（issue #15 第 5 条）。
 *
 * 方案：用 WeakMap + 自增计数器为每个 Fabric 对象分配「进程内稳定唯一」的 ID，
 * 图层面板携带该 ID，操作时通过 ID 反查对象，彻底摆脱数组索引。
 *
 * 设计取舍：
 *   - 用 WeakMap 而非直接写 obj.id：避免污染 toJSON 序列化（导出 SVG 不带内部 ID），
 *     且不阻止对象被 GC。
 *   - 同一对象引用始终返回同一 ID；undo/redo 后 loadFromJSON 会创建新对象（新引用），
 *     此时重新分配 ID 无妨——因为恢复后必然刷新图层列表。
 */

const _idMap = new WeakMap<object, string>()
let _seq = 0

/**
 * 获取对象的稳定唯一 ID（首次访问时分配，之后缓存）
 * @param obj Fabric 对象（任意 object）
 * @returns 稳定 ID，非对象入参返回空串
 */
export function getObjectId(obj: unknown): string {
  if (!obj || typeof obj !== 'object') return ''
  let id = _idMap.get(obj)
  if (!id) {
    id = `obj-${++_seq}`
    _idMap.set(obj, id)
  }
  return id
}

/**
 * 在对象列表中按稳定 ID 查找目标对象
 * @param objects Fabric 对象列表
 * @param id      目标稳定 ID
 * @returns 命中的对象，未找到返回 undefined
 */
export function findObjectById<T extends object>(objects: T[], id: string): T | undefined {
  return objects.find((o) => getObjectId(o) === id)
}
