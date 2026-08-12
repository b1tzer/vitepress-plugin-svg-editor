/**
 * TextFormat 插件单元测试
 *
 * 重点：覆盖 getTextObjects 对所有文本类型（text / textbox / itext）的识别能力。
 * 历史 Bug：getTextObjects 遗漏了 type='text'，导致通过 addElement('text') 创建的
 * fabric.Text 对象所有格式化操作（字号/加粗/斜体/下划线/对齐/颜色）静默失效。
 */
import { describe, it, expect, beforeEach } from 'vitest'
import * as TextFormatPlugin from '../../src/plugins/text-format'

// 最小化 mock fabric Canvas
function makeFakeCanvas(activeObjects: any[]) {
  return {
    getActiveObject: () => {
      if (activeObjects.length === 0) return null
      if (activeObjects.length === 1) return activeObjects[0]
      return { type: 'activeSelection', _objects: activeObjects }
    },
    renderAll: () => {},
    getObjects: () => activeObjects,
  }
}

function textObj(opts: Record<string, any> = {}) {
  return {
    type: 'text', text: 'Hello', fontWeight: 'normal', fontStyle: 'normal', underline: false, ...opts,
    set(prop: string, value: any) { (this as any)[prop] = value },
  }
}
function textboxObj(opts: Record<string, any> = {}) {
  return {
    type: 'textbox', text: 'World', width: 120, fontWeight: 'normal', fontStyle: 'normal', underline: false, ...opts,
    set(prop: string, value: any) { (this as any)[prop] = value },
  }
}

describe('TextFormatPlugin.getTextObjects', () => {
  // ══════════════════════════════════════════════
  // 核心回归：必须覆盖 type='text'
  // ══════════════════════════════════════════════
  it('单选 type=text时应返回 [obj]', () => {
    const obj = textObj()
    const c = makeFakeCanvas([obj])
    const result = TextFormatPlugin.getTextObjects(c)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(obj)
  })

  it('单选 type=textbox时应返回 [obj]', () => {
    const obj = textboxObj()
    const c = makeFakeCanvas([obj])
    const result = TextFormatPlugin.getTextObjects(c)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(obj)
  })

  it('无选中时应返回空数组', () => {
    const c = makeFakeCanvas([])
    expect(TextFormatPlugin.getTextObjects(c)).toEqual([])
  })

  it('选中非文本对象（rect）应返回空数组', () => {
    const c = makeFakeCanvas([{ type: 'rect' }])
    expect(TextFormatPlugin.getTextObjects(c)).toEqual([])
  })

  it('activeSelection 内应筛选所有文本对象（含 type=text）', () => {
    const t1 = textObj({ text: 'A' })
    const t2 = textboxObj({ text: 'B' })
    const rect = { type: 'rect' }
    const c = makeFakeCanvas([t1, t2, rect])
    const result = TextFormatPlugin.getTextObjects(c)
    expect(result).toHaveLength(2)
    expect(result).toContain(t1)
    expect(result).toContain(t2)
  })

  it('group 内应筛选所有文本对象', () => {
    const t = textObj()
    const c = {
      ...makeFakeCanvas([]),
      getActiveObject: () => ({ type: 'group', _objects: [t, { type: 'circle' }] }),
    }
    const result = TextFormatPlugin.getTextObjects(c)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(t)
  })
})

describe('TextFormatPlugin.applyTextAlign', () => {
  it('应设置所有文本对象的 textAlign', () => {
    const t1 = textObj()
    const t2 = textboxObj()
    const c = makeFakeCanvas([t1, t2])
    TextFormatPlugin.applyTextAlign(c, 'center')
    expect(t1.textAlign).toBe('center')
    expect(t2.textAlign).toBe('center')
  })

  it('选中非文本时不应报错', () => {
    const c = makeFakeCanvas([{ type: 'circle' }])
    expect(() => TextFormatPlugin.applyTextAlign(c, 'right')).not.toThrow()
  })
})

describe('TextFormatPlugin.applyFontSize', () => {
  it('应设置 type=text 和 type=textbox 的字号', () => {
    const t1 = textObj()
    const t2 = textboxObj()
    const c = makeFakeCanvas([t1, t2])
    TextFormatPlugin.applyFontSize(c, 24)
    expect(t1.fontSize).toBe(24)
    expect(t2.fontSize).toBe(24)
  })
})

describe('TextFormatPlugin.toggleBold', () => {
  it('type=text normal→bold', () => {
    const t = textObj({ fontWeight: 'normal' })
    const c = makeFakeCanvas([t])
    const result = TextFormatPlugin.toggleBold(c)
    expect(t.fontWeight).toBe('bold')
    expect(result).toBe('bold')
  })

  it('type=text bold→normal', () => {
    const t = textObj({ fontWeight: 'bold' })
    const c = makeFakeCanvas([t])
    const result = TextFormatPlugin.toggleBold(c)
    expect(t.fontWeight).toBe('normal')
    expect(result).toBe('normal')
  })
})

describe('TextFormatPlugin.toggleItalic', () => {
  it('type=text normal→italic', () => {
    const t = textObj({ fontStyle: 'normal' })
    const c = makeFakeCanvas([t])
    const result = TextFormatPlugin.toggleItalic(c)
    expect(t.fontStyle).toBe('italic')
    expect(result).toBe('italic')
  })
})

describe('TextFormatPlugin.toggleUnderline', () => {
  it('type=text underline=false→true', () => {
    const t = textObj({ underline: false })
    const c = makeFakeCanvas([t])
    const result = TextFormatPlugin.toggleUnderline(c)
    expect(t.underline).toBe(true)
    expect(result).toBe(true)
  })
})

describe('TextFormatPlugin.applyTextFill', () => {
  it('应设置 type=text 和 type=textbox 的 fill', () => {
    const t1 = textObj()
    const t2 = textboxObj()
    const c = makeFakeCanvas([t1, t2])
    TextFormatPlugin.applyTextFill(c, '#ff0000')
    expect(t1.fill).toBe('#ff0000')
    expect(t2.fill).toBe('#ff0000')
  })
})