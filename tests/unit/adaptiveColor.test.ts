/**
 * 自适应颜色模块单元测试
 * 覆盖：hex↔RGB、RGB↔OKLCH 转换精度、亮度翻转、非法输入防御
 */
import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  adaptColorLuminance,
} from '../../src/core/shared/adaptiveColor'

describe('hexToRgb', () => {
  it('解析 6 位 hex（大小写不敏感）', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
    expect(hexToRgb('#123456')).toEqual({ r: 0x12, g: 0x34, b: 0x56 })
  })

  it('解析 3 位 hex（短写法展开为 6 位）', () => {
    expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#abc')).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc })
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('非法输入返回 null', () => {
    expect(hexToRgb('red')).toBeNull()
    expect(hexToRgb('#FFFF')).toBeNull() // 4 位非法
    expect(hexToRgb('rgba(0,0,0,0.5)')).toBeNull()
    expect(hexToRgb('transparent')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })
})

describe('rgbToHex', () => {
  it('编码为 6 位大写 hex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#FF0000')
    expect(rgbToHex(18, 52, 86)).toBe('#123456')
  })

  it('通道越界时 clamp 到 [0,255]', () => {
    expect(rgbToHex(-10, 128, 300)).toBe('#0080FF')
  })
})

describe('rgbToOklch', () => {
  it('锚点：纯红/绿/蓝的 OKLCH 分量（感知均匀）', () => {
    const red = rgbToOklch(hexToRgb('#FF0000')!)
    expect(red.l).toBeGreaterThan(0.62)
    expect(red.l).toBeLessThan(0.64)
    expect(red.c).toBeGreaterThan(0.25)
    expect(red.c).toBeLessThan(0.27)

    const green = rgbToOklch(hexToRgb('#00FF00')!)
    expect(green.l).toBeGreaterThan(0.86)
    expect(green.l).toBeLessThan(0.87)

    const blue = rgbToOklch(hexToRgb('#0000FF')!)
    expect(blue.l).toBeGreaterThan(0.44)
    expect(blue.l).toBeLessThan(0.46)
  })

  it('纯黑/纯白：L 分别为 0 与 1，C 为 0', () => {
    const black = rgbToOklch(hexToRgb('#000000')!)
    expect(black.l).toBeCloseTo(0, 5)
    expect(black.c).toBeCloseTo(0, 5)

    const white = rgbToOklch(hexToRgb('#FFFFFF')!)
    expect(white.l).toBeCloseTo(1, 5)
    expect(white.c).toBeCloseTo(0, 5)
  })
})

describe('oklchToRgb', () => {
  it('hex → OKLCH → RGB → hex 应恢复原值（色域内颜色）', () => {
    const colors = ['#1565C0', '#333333', '#808080', '#FF7F50', '#E3F2FD', '#123456']
    for (const hex of colors) {
      const rgb = hexToRgb(hex)!
      const lch = rgbToOklch(rgb)
      const back = oklchToRgb(lch)
      expect(rgbToHex(back.r, back.g, back.b)).toBe(hex)
    }
  })
})

describe('adaptColorLuminance', () => {
  it('纯黑 ↔ 纯白互翻', () => {
    expect(adaptColorLuminance('#000000')).toBe('#FFFFFF')
    expect(adaptColorLuminance('#FFFFFF')).toBe('#000000')
  })

  it('无色度灰翻转两次自逆（#808080）', () => {
    const once = adaptColorLuminance('#808080')
    expect(adaptColorLuminance(once)).toBe('#808080')
  })

  it('亮色翻转后变暗、暗色翻转后变亮（亮度方向性）', () => {
    const sum = (hex: string) => {
      const { r, g, b } = hexToRgb(hex)!
      return r + g + b
    }
    // #FF0000（和 255）→ 暗红（和 < 255）
    expect(sum(adaptColorLuminance('#FF0000'))).toBeLessThan(255)
    // #123456（暗蓝，和 156）→ 亮色（和更大）
    expect(sum(adaptColorLuminance('#123456'))).toBeGreaterThan(sum('#123456'))
  })

  it('3 位 hex 短写法应被翻转', () => {
    // #FFF 白色 → #000000 黑色（大写保持）
    expect(adaptColorLuminance('#FFF')).toBe('#000000')
    // #fff 白色 → #000000 黑色（小写保持，全数字无大小写差异）
    expect(adaptColorLuminance('#fff')).toBe('#000000')
    // #abc → 6 位展开后翻转，不再是原值
    expect(adaptColorLuminance('#abc')).not.toBe('#abc')
  })

  it('非法输入原样返回', () => {
    expect(adaptColorLuminance('rgba(0,0,0,0.5)')).toBe('rgba(0,0,0,0.5)')
    expect(adaptColorLuminance('transparent')).toBe('transparent')
    expect(adaptColorLuminance('')).toBe('')
  })
})
