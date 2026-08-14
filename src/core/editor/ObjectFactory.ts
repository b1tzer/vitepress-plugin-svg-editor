/**
 * 对象工厂 — 创建编辑器内置图形对象与文本转换
 *
 * 从 SvgEditor.vue 中抽取的纯函数，负责：
 *   - createShape：根据类型创建 Fabric 图形对象（矩形/圆/三角/椭圆/线/文本/文本框）
 *   - convertTextToTextbox：将 Fabric 的 Text 转为 Textbox（加载 SVG 时文本可自动换行）
 *
 * 纯函数，零 Vue 依赖，可单测。
 */

import * as fabric from 'fabric'
import { FABRIC_TYPE } from '../FabricTypes'

/**
 * 创建内置图形对象（以画布逻辑中心为基准）
 * @param type    图形类型：rect | circle | triangle | ellipse | line | text | textbox
 * @param centerX 画布逻辑中心 X
 * @param centerY 画布逻辑中心 Y
 * @returns Fabric 对象，未知类型返回 null
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createShape(type: string, centerX: number, centerY: number): any {
  switch (type) {
    case 'rect':
      return new fabric.Rect({ left: centerX - 40, top: centerY - 30, width: 80, height: 60, fill: '#3b82f6', stroke: '', strokeWidth: 0, rx: 4, ry: 4 })
    case 'circle':
      return new fabric.Circle({ left: centerX, top: centerY, radius: 35, fill: '#10b981', stroke: '', strokeWidth: 0 })
    case 'triangle':
      return new fabric.Triangle({ left: centerX, top: centerY - 30, width: 70, height: 60, fill: '#f59e0b', stroke: '', strokeWidth: 0 })
    case 'ellipse':
      return new fabric.Ellipse({ left: centerX, top: centerY, rx: 45, ry: 30, fill: '#8b5cf6', stroke: '', strokeWidth: 0 })
    case 'line': {
      const points: [number, number, number, number] = [centerX - 40, centerY, centerX + 40, centerY]
      return new fabric.Line(points, { stroke: '#ef4444', strokeWidth: 2 })
    }
    case 'text':
      return new fabric.Text('文本', { left: centerX - 20, top: centerY - 10, fontSize: 24, fill: '#000', fontFamily: 'sans-serif' })
    case 'textbox':
      return new fabric.Textbox('文本框', { left: centerX - 40, top: centerY - 15, width: 120, fontSize: 16, fill: '#000', fontFamily: 'sans-serif' })
    default:
      return null
  }
}

/**
 * 将 Fabric 的 Text 对象转为 Textbox（加载 SVG 后文本支持自动换行）
 * 递归处理 Group 的子对象。
 * @param obj Fabric 对象
 * @returns 转换后的对象（非 Text 类型原样返回）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertTextToTextbox(obj: any): any {
  if (!obj) return obj
  if (obj.type === FABRIC_TYPE.TEXT) {
    try {
      return new fabric.Textbox(obj.text || '', {
        left: obj.left || 0, top: obj.top || 0,
        width: Math.max((obj.width || 80) + 20, 40),
        fontSize: obj.fontSize || 12, fontFamily: obj.fontFamily || 'sans-serif',
        fontWeight: obj.fontWeight || 'normal', fontStyle: obj.fontStyle || 'normal',
        fill: obj.fill || '#000', stroke: obj.stroke || '', strokeWidth: obj.strokeWidth || 0,
        textAlign: obj.textAlign || 'left', lineHeight: obj.lineHeight || 1.16,
        charSpacing: obj.charSpacing || 0, opacity: obj.opacity ?? 1,
        angle: obj.angle || 0, originX: obj.originX || 'left', originY: obj.originY || 'top',
        selectable: true, evented: true, editable: true, splitByGrapheme: true,
      })
    } catch (e) {
      return obj
    }
  }
  if (obj._objects) obj._objects = obj._objects.map(convertTextToTextbox)
  return obj
}
