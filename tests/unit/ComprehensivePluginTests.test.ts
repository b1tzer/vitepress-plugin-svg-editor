/**
 * 插件函数单元测试 — 对齐 / 分布 / 层级 / 渐变 / 阴影 / 选择
 *
 * 问题背景：text-format.ts 遗漏 type='text' 导致 6 个按钮静默失效。
 * 究其根因：7 个插件函数文件零单元测试，仅依赖 SvgEditor.vue 的组件测试间接覆盖
 * （且组件测试 mock 了所有 emit，根本没执行真实函数逻辑）。
 *
 * 本文件对所有非 text-format 插件函数建立防回归测试网。
 */
import { describe, it, expect, vi } from 'vitest'
import * as AlignPlugin from '../../src/plugins/align'
import * as DistributePlugin from '../../src/plugins/distribute'
import * as LayerPlugin from '../../src/plugins/layer'

// ═════════════════════════════════════════════════════════
// Mock Helpers
// ═════════════════════════════════════════════════════════

/** 创建一个带真实 set 方法的 mock Fabric 对象 */
function makeObj(overrides: Record<string, any> = {}) {
  const obj = {
    left: 0,
    top: 0,
    width: 80,
    height: 60,
    scaleX: 1,
    scaleY: 1,
    fill: '#3b82f6',
    stroke: '',
    strokeWidth: 0,
    opacity: 1,
    type: 'rect',
    getBoundingRect() {
      return {
        left: this.left,
        top: this.top,
        width: this.width * (this.scaleX || 1),
        height: this.height * (this.scaleY || 1),
      }
    },
    set(prop: string, value: any) {
      ;(this as any)[prop] = value
    },
    ...overrides,
  }
  // 再合并一次确保 override 的 set 不会被覆盖
  Object.assign(obj, overrides)
  return obj
}

/** 创建 mock Fabric canvas */
function makeCanvas(active: any = null) {
  const fn = vi.fn()
  return {
    getActiveObject: () => active,
    bringObjectForward: fn,
    sendObjectBackwards: fn,
    bringObjectToFront: fn,
    sendObjectToBack: fn,
    renderAll: vi.fn(),
  }
}

// ═════════════════════════════════════════════════════════
// 1. 对齐插件
// ═════════════════════════════════════════════════════════
describe('AlignPlugin', () => {
  const makeMultiCanvas = (objs: any[]) => {
    return {
      getActiveObject: () => (objs.length < 2 ? null : { _objects: objs }),
      renderAll: vi.fn(),
    }
  }

  it('alignLeft：所有对象的 left 对齐到最小值', () => {
    const o1 = makeObj({ left: 10, width: 80 })
    const o2 = makeObj({ left: 100, width: 60 })
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.alignLeft(c)
    expect(o1.left).toBe(10)
    expect(o2.left).toBe(10)
  })

  it('alignRight：所有对象右对齐', () => {
    const o1 = makeObj({ left: 10, width: 80 }) // right=90
    const o2 = makeObj({ left: 100, width: 60 }) // right=160
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.alignRight(c)
    // max right = 160, o1.left = 160-80 = 80, o2.left = 160-60 = 100
    expect(o1.left).toBe(80)
    expect(o2.left).toBe(100)
  })

  it('alignCenterH：水平居中', () => {
    const o1 = makeObj({ left: 0, width: 100 }) // center=50
    const o2 = makeObj({ left: 200, width: 200 }) // center=300
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.alignCenterH(c)
    // avg center = (50+300)/2 = 175
    expect(o1.left).toBe(125) // 175 - 100/2
    expect(o2.left).toBe(75) // 175 - 200/2
  })

  it('alignTop：所有对象的 top 对齐到最小值', () => {
    const o1 = makeObj({ top: 30 })
    const o2 = makeObj({ top: 150 })
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.alignTop(c)
    expect(o1.top).toBe(30)
    expect(o2.top).toBe(30)
  })

  it('alignBottom：所有对象底对齐', () => {
    const o1 = makeObj({ top: 10, height: 40 }) // bottom=50
    const o2 = makeObj({ top: 100, height: 80 }) // bottom=180
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.alignBottom(c)
    expect(o1.top).toBe(140) // 180-40
    expect(o2.top).toBe(100) // 180-80
  })

  it('< 2 对象时所有对齐函数安全返回不抛异常', () => {
    const c = makeMultiCanvas([])
    expect(() => AlignPlugin.alignLeft(c)).not.toThrow()
    expect(() => AlignPlugin.alignRight(c)).not.toThrow()
    expect(() => AlignPlugin.alignCenterH(c)).not.toThrow()
    expect(() => AlignPlugin.alignTop(c)).not.toThrow()
    expect(() => AlignPlugin.alignBottom(c)).not.toThrow()
    expect(() => AlignPlugin.alignCenterV(c)).not.toThrow()
  })

  it('sameWidth/sameHeight：所有对象统一到第一个对象的尺寸', () => {
    const o1 = makeObj({ width: 200 })
    const o2 = makeObj({ width: 100 })
    const c = makeMultiCanvas([o1, o2])
    AlignPlugin.sameWidth(c)
    expect(o2.scaleX).toBeCloseTo(2) // 200/100
    const o3 = makeObj({ height: 50 })
    const o4 = makeObj({ height: 100 })
    const c2 = makeMultiCanvas([o3, o4])
    AlignPlugin.sameHeight(c2)
    expect(o4.scaleY).toBeCloseTo(0.5) // 50/100
  })
})

// ═════════════════════════════════════════════════════════
// 2. 分布插件
// ═════════════════════════════════════════════════════════
describe('DistributePlugin', () => {
  const makeDistCanvas = (objs: any[]) => ({
    getActiveObject: () => (objs.length < 3 ? null : { _objects: objs }),
    renderAll: vi.fn(),
  })

  it('distributeHorizontal：3 个对象等间距分布', () => {
    const o1 = makeObj({ left: 0, width: 100 }) // x:0..100
    const o2 = makeObj({ left: 120, width: 80 }) // x:120..200
    const o3 = makeObj({ left: 240, width: 120 }) // x:240..360
    const c = makeDistCanvas([o1, o2, o3])
    DistributePlugin.distributeHorizontal(c)
    // first=0, last=360, totalW=100+80+120=300, gap=(360-0-300)/2=30
    // o1: 0, o2: 100+30=130, o3: 130+80+30=240
    expect(o1.left).toBe(0)
    expect(o2.left).toBe(130)
    expect(o3.left).toBe(240)
  })

  it('< 3 对象时不应抛异常', () => {
    const c = makeDistCanvas([makeObj(), makeObj()])
    expect(() => DistributePlugin.distributeHorizontal(c)).not.toThrow()
    expect(() => DistributePlugin.distributeVertical(c)).not.toThrow()
  })
})

// ═════════════════════════════════════════════════════════
// 3. 层级插件
// ═════════════════════════════════════════════════════════
describe('LayerPlugin', () => {
  it('forward：有对象时调用 bringObjectForward + renderAll', () => {
    const c = makeCanvas(makeObj())
    LayerPlugin.forward(c)
    expect(c.bringObjectForward).toHaveBeenCalledTimes(1)
    expect(c.renderAll).toHaveBeenCalled()
  })

  it('backward：有对象时调用 sendObjectBackwards + renderAll', () => {
    const c = makeCanvas(makeObj())
    LayerPlugin.backward(c)
    expect(c.sendObjectBackwards).toHaveBeenCalledTimes(1)
  })

  it('toFront：有对象时调用 bringObjectToFront', () => {
    const c = makeCanvas(makeObj())
    LayerPlugin.toFront(c)
    expect(c.bringObjectToFront).toHaveBeenCalledTimes(1)
  })

  it('toBack：有对象时调用 sendObjectToBack', () => {
    const c = makeCanvas(makeObj())
    LayerPlugin.toBack(c)
    expect(c.sendObjectToBack).toHaveBeenCalledTimes(1)
  })

  it('无选中对象时不抛异常', () => {
    const c = makeCanvas(null)
    expect(() => LayerPlugin.forward(c)).not.toThrow()
    expect(() => LayerPlugin.backward(c)).not.toThrow()
    expect(() => LayerPlugin.toFront(c)).not.toThrow()
    expect(() => LayerPlugin.toBack(c)).not.toThrow()
  })
})

// ═════════════════════════════════════════════════════════
// 5. 渐变插件（需真实 fabric 库）
// ═════════════════════════════════════════════════════════
describe('GradientPlugin.applyGradient', () => {
  it('type=none 时设为纯色 fill', async () => {
    const { applyGradient } = await import('../../src/plugins/gradient')
    const obj = makeObj({ fill: '#ff0000' })
    const c = { getActiveObject: () => obj, renderAll: vi.fn() }
    applyGradient(c, { type: 'none', angle: 0, color1: '#00ff00', color2: '#0000ff' })
    expect(obj.fill).toBe('#00ff00')
  })

  it('无选中时不抛异常', async () => {
    const { applyGradient } = await import('../../src/plugins/gradient')
    const c = { getActiveObject: () => null, renderAll: vi.fn() }
    expect(() =>
      applyGradient(c, { type: 'linear', angle: 45, color1: '#ff0', color2: '#0ff' })
    ).not.toThrow()
  })
})

// ═════════════════════════════════════════════════════════
// 6. 阴影插件（需真实 fabric 库）
// ═════════════════════════════════════════════════════════
describe('ShadowPlugin', () => {
  it('toggleShadow：无选中时返回 false', async () => {
    const { toggleShadow } = await import('../../src/plugins/shadow')
    const c = { getActiveObject: () => null, renderAll: vi.fn() }
    expect(toggleShadow(c)).toBe(false)
  })

  it('applyShadow：对象的 shadow 为 null 时不抛异常', async () => {
    const { applyShadow } = await import('../../src/plugins/shadow')
    const obj = makeObj({ shadow: null })
    const c = { getActiveObject: () => obj, renderAll: vi.fn() }
    expect(() => applyShadow(c, { color: '#000', blur: 5, offsetX: 0, offsetY: 0 })).not.toThrow()
  })
})
