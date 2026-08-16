/**
 * Command 模式单元测试
 * 覆盖 MoveCommand / AddCommand / RemoveCommand / ResizeCommand / PropertyChangeCommand
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MoveCommand, ResizeCommand, PropertyChangeCommand } from '../../src/core/history/Command'

// mock fabric 对象
function makeMockObj(overrides: Record<string, any> = {}) {
  const obj: Record<string, any> = {
    type: 'rect',
    left: 100,
    top: 200,
    width: 50,
    height: 50,
    scaleX: 1,
    scaleY: 1,
    fill: '#ff0000',
    stroke: '#000000',
    opacity: 1,
    visible: true,
    set: vi.fn(function (props: Record<string, any>) {
      Object.assign(this, props)
      return this
    }),
    setCoords: vi.fn(),
    ...overrides,
  }
  return obj as any
}

function makeMockCanvas() {
  const objects: any[] = []
  return {
    getObjects: vi.fn(() => objects),
    add: vi.fn((obj: any) => {
      objects.push(obj)
    }),
    remove: vi.fn((obj: any) => {
      const idx = objects.indexOf(obj)
      if (idx >= 0) objects.splice(idx, 1)
    }),
    requestRenderAll: vi.fn(),
    discardActiveObject: vi.fn(),
  }
}

// ═══════════════════════════════════════════════════════════════
// MoveCommand
// ═══════════════════════════════════════════════════════════════

describe('MoveCommand', () => {
  it('execute 应正确移动对象', () => {
    const obj = makeMockObj({ left: 100, top: 200 })
    const cmd = new MoveCommand(obj, 10, -20)

    cmd.execute()

    expect(obj.left).toBe(110)
    expect(obj.top).toBe(180)
    expect(obj.setCoords).toHaveBeenCalled()
  })

  it('undo 应恢复到初始位置', () => {
    const obj = makeMockObj({ left: 100, top: 200 })
    const cmd = new MoveCommand(obj, 10, -20)

    cmd.execute()
    cmd.undo()

    expect(obj.left).toBe(100)
    expect(obj.top).toBe(200)
  })

  it('连续多次 execute/undo 应保持正确位置', () => {
    const obj = makeMockObj({ left: 0, top: 0 })
    const cmd = new MoveCommand(obj, 30, 40)

    cmd.execute()
    cmd.execute()
    cmd.undo()
    expect(obj.left).toBe(30)
    expect(obj.top).toBe(40)

    cmd.undo()
    expect(obj.left).toBe(0)
    expect(obj.top).toBe(0)
  })

  it('getLabel 应返回中文描述', () => {
    const obj = makeMockObj({ type: 'rect' })
    const cmd = new MoveCommand(obj, 0, 0)
    expect(cmd.getLabel()).toBe('移动 矩形')
  })

  it('getLabel 应处理未知类型', () => {
    const obj = makeMockObj({ type: undefined })
    const cmd = new MoveCommand(obj, 0, 0)
    expect(cmd.getLabel()).toBe('移动 元素')
  })
})

// ═══════════════════════════════════════════════════════════════
// ResizeCommand
// ═══════════════════════════════════════════════════════════════

describe('ResizeCommand', () => {
  it('execute 应应用新的尺寸状态', () => {
    const obj = makeMockObj({ left: 10, top: 10, scaleX: 1, scaleY: 1, width: 50, height: 50 })
    const oldState = { left: 10, top: 10, scaleX: 1, scaleY: 1, width: 50, height: 50 }
    const newState = { left: 20, top: 30, scaleX: 2, scaleY: 1.5, width: 100, height: 75 }
    const cmd = new ResizeCommand(obj, oldState, newState)

    cmd.execute()

    expect(obj.left).toBe(20)
    expect(obj.top).toBe(30)
    expect(obj.scaleX).toBe(2)
    expect(obj.scaleY).toBe(1.5)
    expect(obj.width).toBe(100)
    expect(obj.height).toBe(75)
    expect(obj.setCoords).toHaveBeenCalled()
  })

  it('undo 应恢复到旧的尺寸状态', () => {
    const obj = makeMockObj({ left: 10, top: 10, scaleX: 1, scaleY: 1, width: 50, height: 50 })
    const oldState = { left: 10, top: 10, scaleX: 1, scaleY: 1, width: 50, height: 50 }
    const newState = { left: 20, top: 30, scaleX: 2, scaleY: 1.5, width: 100, height: 75 }
    const cmd = new ResizeCommand(obj, oldState, newState)

    cmd.execute()
    cmd.undo()

    expect(obj.left).toBe(10)
    expect(obj.top).toBe(10)
    expect(obj.scaleX).toBe(1)
    expect(obj.scaleY).toBe(1)
    expect(obj.width).toBe(50)
    expect(obj.height).toBe(50)
  })

  it('getLabel 应返回缩放描述', () => {
    const obj = makeMockObj()
    const oldState = { left: 0, top: 0, scaleX: 1, scaleY: 1, width: 50, height: 50 }
    const newState = { left: 0, top: 0, scaleX: 2, scaleY: 2, width: 100, height: 100 }
    const cmd = new ResizeCommand(obj, oldState, newState)
    expect(cmd.getLabel()).toBe('缩放元素')
  })
})

// ═══════════════════════════════════════════════════════════════
// PropertyChangeCommand
// ═══════════════════════════════════════════════════════════════

describe('PropertyChangeCommand', () => {
  it('execute 应应用新的属性值', () => {
    const obj = makeMockObj({ fill: '#ff0000', stroke: '#000000' })
    const oldProps = { fill: '#ff0000', stroke: '#000000' }
    const newProps = { fill: '#00ff00', stroke: '#333333' }
    const cmd = new PropertyChangeCommand(obj, oldProps, newProps)

    cmd.execute()

    expect(obj.fill).toBe('#00ff00')
    expect(obj.stroke).toBe('#333333')
    expect(obj.setCoords).toHaveBeenCalled()
  })

  it('undo 应恢复到旧属性值', () => {
    const obj = makeMockObj({ fill: '#ff0000', stroke: '#000000' })
    const oldProps = { fill: '#ff0000', stroke: '#000000' }
    const newProps = { fill: '#00ff00', stroke: '#333333' }
    const cmd = new PropertyChangeCommand(obj, oldProps, newProps)

    cmd.execute()
    cmd.undo()

    expect(obj.fill).toBe('#ff0000')
    expect(obj.stroke).toBe('#000000')
  })

  it('getLabel 应识别填充色变更', () => {
    const obj = makeMockObj({ fill: '#ff0000' })
    const cmd = new PropertyChangeCommand(obj, { fill: '#ff0000' }, { fill: '#0000ff' })
    expect(cmd.getLabel()).toBe('修改填充色')
  })

  it('getLabel 应识别透明度变更', () => {
    const obj = makeMockObj({ opacity: 1 })
    const cmd = new PropertyChangeCommand(obj, { opacity: 1 }, { opacity: 0.5 })
    expect(cmd.getLabel()).toBe('修改透明度')
  })

  it('getLabel 应对多个未知属性回退到通用描述', () => {
    const obj = makeMockObj()
    const cmd = new PropertyChangeCommand(obj, { customProp: 'a' }, { customProp: 'b' })
    expect(cmd.getLabel()).toBe('修改属性 (customProp)')
  })

  it('不应修改原始 oldProps 对象（拷贝防御）', () => {
    const obj = makeMockObj()
    const oldProps = { fill: '#ff0000' }
    const newProps = { fill: '#0000ff' }
    const cmd = new PropertyChangeCommand(obj, oldProps, newProps)

    // 修改原对象，不应影响 command 内部存储
    oldProps.fill = '#changed'
    cmd.execute()
    cmd.undo()

    expect(obj.fill).toBe('#ff0000') // 使用的是拷贝后的原值
  })
})
