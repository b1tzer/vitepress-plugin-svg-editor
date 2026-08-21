/**
 * fabricDarkMode 纯函数单元测试
 * 覆盖：applyObjectTheme 对 fill（纯色/渐变）、stroke、shadow、Group 递归的明暗派生
 */
import { describe, it, expect, vi } from 'vitest'
import { applyObjectTheme } from '../../src/core/shared/fabricDarkMode'
import { lightHexToDark } from '../../src/core/shared/colors'

/** 构造最小可测的 Fabric 对象 mock（set 真正写回属性，模拟 fabric 行为） */
function makeObj(overrides: Record<string, unknown> = {}): any {
  const obj: Record<string, unknown> = {
    type: 'rect',
    fill: '#1565C0',
    stroke: '#BDBDBD',
    set: vi.fn(function (this: Record<string, unknown>, k: string, v: unknown) {
      this[k] = v
    }),
    ...overrides,
  }
  return obj
}

describe('applyObjectTheme — 纯色 fill/stroke', () => {
  it('切暗时 fill 应经 OKLCH 翻转并锚定 fillLight', () => {
    const obj = makeObj({ fill: '#1565C0' })
    applyObjectTheme(obj, true)
    expect(obj.fill).toBe(lightHexToDark('#1565C0'))
    expect(obj.fillLight).toBe('#1565C0')
  })

  it('切亮时 fill 应恢复 fillLight 真值', () => {
    const obj = makeObj({ fill: '#1565C0' })
    applyObjectTheme(obj, true)
    applyObjectTheme(obj, false)
    expect(obj.fill).toBe('#1565C0')
  })

  it('切暗时 stroke 应经 OKLCH 翻转并锚定 strokeLight', () => {
    const obj = makeObj({ stroke: '#BDBDBD' })
    applyObjectTheme(obj, true)
    expect(obj.stroke).toBe(lightHexToDark('#BDBDBD'))
    expect(obj.strokeLight).toBe('#BDBDBD')
  })

  it('非 hex fill 应原样返回（不翻转、不抛错）', () => {
    const obj = makeObj({ fill: 'rgba(0,0,0,0.5)' })
    applyObjectTheme(obj, true)
    expect(obj.fill).toBe('rgba(0,0,0,0.5)')
  })
})

describe('applyObjectTheme — 渐变', () => {
  it('切暗时每个 colorStop 应翻转并记录 lightColor', () => {
    const stops = [
      { offset: 0, color: '#1565C0' },
      { offset: 1, color: '#FF0000' },
    ]
    const obj = makeObj({ fill: { colorStops: stops } })
    applyObjectTheme(obj, true)
    expect(stops[0].color).toBe(lightHexToDark('#1565C0'))
    expect(stops[0].lightColor).toBe('#1565C0')
    expect(stops[1].color).toBe(lightHexToDark('#FF0000'))
    expect(stops[1].lightColor).toBe('#FF0000')
  })

  it('切亮时每个 colorStop 应恢复 lightColor 真值', () => {
    const stops = [{ offset: 0, color: '#1565C0' }]
    const obj = makeObj({ fill: { colorStops: stops } })
    applyObjectTheme(obj, true)
    applyObjectTheme(obj, false)
    expect(stops[0].color).toBe('#1565C0')
  })

  it('切暗时应标记对象 dirty 以强制重光栅化', () => {
    const obj = makeObj({ fill: { colorStops: [{ offset: 0, color: '#1565C0' }] } })
    applyObjectTheme(obj, true)
    expect(obj.dirty).toBe(true)
  })
})

describe('applyObjectTheme — 阴影', () => {
  it('切暗时阴影颜色应翻转并记录 lightColor', () => {
    const shadow = { color: '#999999' }
    const obj = makeObj({ shadow })
    applyObjectTheme(obj, true)
    expect(shadow.color).toBe(lightHexToDark('#999999'))
    expect(shadow.lightColor).toBe('#999999')
  })

  it('切亮时阴影颜色应恢复 lightColor 真值', () => {
    const shadow = { color: '#999999' }
    const obj = makeObj({ shadow })
    applyObjectTheme(obj, true)
    applyObjectTheme(obj, false)
    expect(shadow.color).toBe('#999999')
  })
})

describe('applyObjectTheme — Group 递归', () => {
  it('应递归处理 Group 子对象', () => {
    const child = makeObj({ fill: '#1565C0' })
    const group = makeObj({ _objects: [child] })
    applyObjectTheme(group, true)
    expect(child.fill).toBe(lightHexToDark('#1565C0'))
  })
})
