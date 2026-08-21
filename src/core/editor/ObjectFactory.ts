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
import type { FabricObject, FabricText } from 'fabric'
import { FABRIC_TYPE } from '../shared/fabricTypes'
import type { SvgLightColors } from '../shared/fabricTypes'

/**
 * 创建内置图形对象（以画布逻辑中心为基准）
 * @param type    图形类型：rect | circle | triangle | ellipse | line | text | textbox
 * @param centerX 画布逻辑中心 X
 * @param centerY 画布逻辑中心 Y
 * @returns Fabric 对象，未知类型返回 null
 */
export function createShape(type: string, centerX: number, centerY: number): FabricObject | null {
  switch (type) {
    case 'rect':
      return new fabric.Rect({
        left: centerX - 40,
        top: centerY - 30,
        width: 80,
        height: 60,
        fill: '#3b82f6',
        stroke: '',
        strokeWidth: 0,
        rx: 4,
        ry: 4,
      })
    case 'circle':
      return new fabric.Circle({
        left: centerX,
        top: centerY,
        radius: 35,
        fill: '#10b981',
        stroke: '',
        strokeWidth: 0,
      })
    case 'triangle':
      return new fabric.Triangle({
        left: centerX,
        top: centerY - 30,
        width: 70,
        height: 60,
        fill: '#f59e0b',
        stroke: '',
        strokeWidth: 0,
      })
    case 'ellipse':
      return new fabric.Ellipse({
        left: centerX,
        top: centerY,
        rx: 45,
        ry: 30,
        fill: '#8b5cf6',
        stroke: '',
        strokeWidth: 0,
      })
    case 'line': {
      const points: [number, number, number, number] = [
        centerX - 40,
        centerY,
        centerX + 40,
        centerY,
      ]
      return new fabric.Line(points, { stroke: '#ef4444', strokeWidth: 2 })
    }
    case 'text':
      return new fabric.Text('文本', {
        left: centerX - 20,
        top: centerY - 10,
        fontSize: 24,
        fill: '#000',
        fontFamily: 'sans-serif',
      })
    case 'textbox':
      return new fabric.Textbox('文本框', {
        left: centerX - 40,
        top: centerY - 15,
        width: 120,
        fontSize: 16,
        fill: '#000',
        fontFamily: 'sans-serif',
      })
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
export function convertTextToTextbox(obj: FabricObject): FabricObject {
  if (!obj) return obj
  if (obj.type === FABRIC_TYPE.TEXT) {
    try {
      const text = obj as FabricText & SvgLightColors
      const textbox = new fabric.Textbox(text.text || '', {
        left: text.left || 0,
        top: text.top || 0,
        width: Math.max((text.width || 80) + 20, 40),
        fontSize: text.fontSize || 12,
        fontFamily: text.fontFamily || 'sans-serif',
        fontWeight: text.fontWeight || 'normal',
        fontStyle: text.fontStyle || 'normal',
        fill: text.fill || '#000',
        stroke: text.stroke || '',
        strokeWidth: text.strokeWidth || 0,
        textAlign: text.textAlign || 'left',
        lineHeight: text.lineHeight || 1.16,
        charSpacing: text.charSpacing || 0,
        opacity: text.opacity ?? 1,
        angle: text.angle || 0,
        originX: text.originX || 'left',
        originY: text.originY || 'top',
        selectable: true,
        evented: true,
        editable: true,
        splitByGrapheme: true,
      })
      // 亮色真值：Text → Textbox 会创建全新对象，需手动透传 fillLight/strokeLight
      const t = textbox as FabricObject & SvgLightColors
      if (text.fillLight) t.fillLight = text.fillLight
      if (text.strokeLight) t.strokeLight = text.strokeLight
      return textbox
    } catch (e) {
      return obj
    }
  }
  const group = obj as FabricObject & { _objects?: FabricObject[] }
  if (group._objects) {
    group._objects = group._objects.map(convertTextToTextbox)
  }
  return obj
}
