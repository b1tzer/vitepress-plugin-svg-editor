/**
 * Canvas + HistoryManager 集成测试（防回归：undo 后黑屏 / 对象不可交互）
 *
 * 设计理念：
 *   mock 单元测试能测「逻辑正确」，但无法验证「真实行为正确」
 *   本文件使用真实 Fabric.js + happy-dom，填补 mock 与现实的鸿沟
 *
 * 为什么 HistoryManager 的黑屏 bug 逃过了单元测试？
 *   旧 mock 把 loadFromJSON 写成同步 callback 模式，而 Fabric 6 真实行为是
 *   返回 Promise 的异步 API。mock 通过了 → 真实环境崩溃。
 *
 * 本测试的使命：
 *   - 用真实 Fabric.js 验证 undo/redo 不会导致画布黑屏
 *   - 用真实 Fabric.js 验证 undo 后对象位置正确恢复
 *   - 用真实 Fabric.js 验证 undo 后对象仍可交互
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fabric from 'fabric'
import { HistoryManager } from '../../src/core/HistoryManager'

// ── happy-dom 环境适配：mock getContext('2d') 返回最小可用的 2D 上下文 ──
// Fabric.js 初始化 require getContext('2d')，happy-dom 的 Canvas 2D 不完整
function setupCanvasMock() {
  const origGetContext = HTMLCanvasElement.prototype.getContext
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string,
    ...args: any[]
  ) {
    if (contextId === '2d') {
      return {
        canvas: this,
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        scale: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        arcTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillText: vi.fn(),
        strokeText: vi.fn(),
        clip: vi.fn(),
        drawImage: vi.fn(),
        createPattern: vi.fn(),
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        measureText: vi.fn(() => ({ width: 0 })),
        setTransform: vi.fn(),
        transform: vi.fn(),
        getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
        getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
        setLineDash: vi.fn(),
        getLineDash: vi.fn(() => []),
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '12px sans-serif',
        textAlign: 'left' as CanvasTextAlign,
        textBaseline: 'top' as CanvasTextBaseline,
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        shadowBlur: 0,
        shadowColor: 'rgba(0,0,0,0)',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      } as unknown as CanvasRenderingContext2D
    }
    return origGetContext.call(this, contextId, ...args) as any
  })
}

describe('Canvas + HistoryManager 集成测试 (真实 Fabric.js)', () => {
  let canvasEl: HTMLCanvasElement | null = null
  let canvas: fabric.Canvas | null = null
  let history: HistoryManager

  beforeEach(() => {
    setupCanvasMock()

    canvasEl = document.createElement('canvas')
    canvasEl.width = 800
    canvasEl.height = 600
    document.body.appendChild(canvasEl)

    canvas = new fabric.Canvas(canvasEl, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false,
    })

    history = new HistoryManager()
  })

  afterEach(() => {
    canvas?.dispose()
    canvas = null
    if (canvasEl) {
      document.body.removeChild(canvasEl)
      canvasEl = null
    }
    vi.restoreAllMocks()
  })

  // ────────────────────────────────────────────────────────
  // 场景 1：添加 Textbox → 保存 → 移动 → 保存 → undo 回原位
  // ────────────────────────────────────────────────────────
  it('移动 Textbox 后 undo，对象应回到原始位置', async () => {
    const textbox = new fabric.Textbox('Hello', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#333333',
      width: 120,
    })
    canvas!.add(textbox)
    canvas!.renderAll()

    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(false) // 仅 1 步

    textbox.set({ left: 300, top: 200 })
    textbox.setCoords()
    canvas!.renderAll()
    expect(textbox.left).toBe(300)

    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(true)

    // undo
    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    const objects = canvas!.getObjects()
    expect(objects.length).toBeGreaterThan(0)
    const restored = objects[0] as fabric.Textbox
    expect(restored.left).toBe(100)
    expect(restored.top).toBe(100)
    expect(restored.text).toBe('Hello')
  })

  // ────────────────────────────────────────────────────────
  // 场景 2：undo 后画布对象应保持存在
  // ────────────────────────────────────────────────────────
  it('undo 后画布对象应保持存在（非黑屏）', async () => {
    const rect = new fabric.Rect({ left: 50, top: 50, width: 100, height: 80, fill: '#1565C0' })
    canvas!.add(rect)
    canvas!.renderAll()

    history.save(canvas!, () => {}, () => {})
    rect.set({ fill: '#E65100', left: 200 })
    rect.setCoords()
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})

    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    expect(canvas!.getObjects().length).toBeGreaterThanOrEqual(1)
  })

  // ────────────────────────────────────────────────────────
  // 场景 3：undo 后对象可交互
  // ────────────────────────────────────────────────────────
  it('undo 后对象应保持 selectable 和 evented', async () => {
    const circle = new fabric.Circle({ left: 60, top: 60, radius: 40, fill: '#2E7D32' })
    canvas!.add(circle)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})

    circle.set({ left: 400 })
    circle.setCoords()
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})

    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    const obj = canvas!.getObjects()[0]
    expect(obj.selectable).not.toBe(false)
    expect(obj.evented).not.toBe(false)
  })

  // ────────────────────────────────────────────────────────
  // 场景 4：无填充 shape undo 后获得透明填充
  // ────────────────────────────────────────────────────────
  it('无填充的 shape undo 后应获得透明填充（确保可点击）', async () => {
    const rect = new fabric.Rect({
      left: 10, top: 10, width: 200, height: 100,
      fill: '', stroke: '#000', strokeWidth: 2,
    })
    canvas!.add(rect)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})

    rect.set({ left: 300 })
    rect.setCoords()
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})

    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    const restored = canvas!.getObjects()[0]
    // HistoryManager 后处理：必须注入透明填充
    expect(restored.fill).toBeTruthy()
    expect(typeof restored.fill).toBe('string')
  })

  // ────────────────────────────────────────────────────────
  // 场景 5：空画布 undo 不崩溃
  // ────────────────────────────────────────────────────────
  it('空画布 undo 不应崩溃或黑屏', () => {
    history.save(canvas!, () => {}, () => {})
    history.save(canvas!, () => {}, () => {})
    expect(() => history.undo(canvas!, () => {})).not.toThrow()
  })
})

// ═══════════════════════════════════════════════════════════
// 防回归：验证 canUndo() 在 object:modified 后变为 true
// （这是移动 textbox 后 undo 图标不亮的根因）
// ═══════════════════════════════════════════════════════════
describe('Undo 按钮状态响应性（防回归）', () => {
  let canvasEl: HTMLCanvasElement | null = null
  let canvas: fabric.Canvas | null = null
  let history: HistoryManager

  beforeEach(() => {
    const origGetContext = HTMLCanvasElement.prototype.getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
      this: HTMLCanvasElement, contextId: string, ...args: any[]
    ) {
      if (contextId === '2d') {
        return {
          canvas: this, fillRect: vi.fn(), clearRect: vi.fn(),
          scale: vi.fn(), translate: vi.fn(), rotate: vi.fn(),
          save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(),
          closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
          arc: vi.fn(), arcTo: vi.fn(), bezierCurveTo: vi.fn(),
          quadraticCurveTo: vi.fn(), rect: vi.fn(),
          fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
          strokeText: vi.fn(), clip: vi.fn(), drawImage: vi.fn(),
          createPattern: vi.fn(),
          createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
          createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
          measureText: vi.fn(() => ({ width: 0 })),
          setTransform: vi.fn(), transform: vi.fn(),
          getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
          getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
          setLineDash: vi.fn(), getLineDash: vi.fn(() => []),
          globalAlpha: 1, globalCompositeOperation: 'source-over',
          font: '12px sans-serif',
          textAlign: 'left' as CanvasTextAlign,
          textBaseline: 'top' as CanvasTextBaseline,
          fillStyle: '#000000', strokeStyle: '#000000',
          lineWidth: 1, shadowBlur: 0, shadowColor: 'rgba(0,0,0,0)',
          shadowOffsetX: 0, shadowOffsetY: 0,
        } as unknown as CanvasRenderingContext2D
      }
      return origGetContext.call(this, contextId, ...args) as any
    })

    canvasEl = document.createElement('canvas')
    canvasEl.width = 800; canvasEl.height = 600
    document.body.appendChild(canvasEl)

    canvas = new fabric.Canvas(canvasEl, {
      width: 800, height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false,
    })
    history = new HistoryManager()
  })

  afterEach(() => {
    canvas?.dispose(); canvas = null
    if (canvasEl) { document.body.removeChild(canvasEl); canvasEl = null }
    vi.restoreAllMocks()
  })

  it('初始加载后 canUndo 应为 false（仅 1 个初始状态）', () => {
    // 模拟初始加载：添加对象 + save
    const rect = new fabric.Rect({ left: 10, top: 10, width: 100, height: 80, fill: '#333' })
    canvas!.add(rect)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(false) // 仅 1 个状态，不可撤销
  })

  it('object:modified 事件触发 save 后 canUndo 应变为 true', () => {
    const rect = new fabric.Rect({ left: 10, top: 10, width: 100, height: 80, fill: '#333' })
    canvas!.add(rect)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})     // 初始状态
    expect(history.canUndo()).toBe(false)

    // 模拟 onModified 回调：移动对象后保存（这是 SvgEditor.vue 的真实流程）
    rect.set({ left: 300 })
    rect.setCoords()
    history.save(canvas!, () => {}, () => {})     // ← object:modified 后调用
    expect(history.canUndo()).toBe(true)          // ← 这是测试遗漏的关键断言！
  })

  it('连续两次 save 后 canUndo 应保持 true', () => {
    const rect = new fabric.Rect({ left: 10, top: 10, width: 100, height: 80, fill: '#333' })
    canvas!.add(rect)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(false)

    // 第一次移动
    rect.set({ left: 200 }); rect.setCoords()
    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(true)

    // 第二次移动
    rect.set({ left: 400 }); rect.setCoords()
    history.save(canvas!, () => {}, () => {})
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false) // save 后 redo 栈应为空
  })

  it('textbox 移动场景：save 后 canUndo 为 true', () => {
    const textbox = new fabric.Textbox('test', {
      left: 50, top: 50, fontSize: 16, fill: '#000', width: 80,
    })
    canvas!.add(textbox)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})       // 初始
    expect(history.canUndo()).toBe(false)

    // 移动 textbox（这是用户报告的原始场景）
    textbox.set({ left: 250, top: 120 })
    textbox.setCoords()
    history.save(canvas!, () => {}, () => {})       // object:modified → save
    expect(history.canUndo()).toBe(true)            // ← undo 按钮应该亮起
  })

  it('undo 后 canUndo 和 canRedo 状态应正确切换', async () => {
    const rect = new fabric.Rect({ left: 10, top: 10, width: 100, height: 80, fill: '#333' })
    canvas!.add(rect)
    canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})       // state 0
    rect.set({ left: 300 }); rect.setCoords()
    history.save(canvas!, () => {}, () => {})       // state 1

    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    expect(history.canUndo()).toBe(false)            // 回到初始状态
    expect(history.canRedo()).toBe(true)             // 可重做
  })
})

// ═══════════════════════════════════════════════════════════
// 全流程冒烟测试：模拟 addElement（左侧面板点击）的完整回路
// （这是用户报告 bug 的原型场景：添加元素后对象存在、undo 后消失）
// ═══════════════════════════════════════════════════════════
describe('addElement → undo 全流程（防回归冒烟）', () => {
  let canvasEl: HTMLCanvasElement | null = null
  let canvas: fabric.Canvas | null = null
  let history: HistoryManager

  beforeEach(() => {
    const origGetContext = HTMLCanvasElement.prototype.getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
      this: HTMLCanvasElement, contextId: string, ...args: any[]
    ) {
      if (contextId === '2d') {
        return {
          canvas: this, fillRect: vi.fn(), clearRect: vi.fn(),
          scale: vi.fn(), translate: vi.fn(), rotate: vi.fn(),
          save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(),
          closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
          arc: vi.fn(), arcTo: vi.fn(), bezierCurveTo: vi.fn(),
          quadraticCurveTo: vi.fn(), rect: vi.fn(),
          fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
          strokeText: vi.fn(), clip: vi.fn(), drawImage: vi.fn(),
          createPattern: vi.fn(),
          createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
          createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
          measureText: vi.fn(() => ({ width: 0 })),
          setTransform: vi.fn(), transform: vi.fn(),
          getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
          getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })),
          setLineDash: vi.fn(), getLineDash: vi.fn(() => []),
          globalAlpha: 1, globalCompositeOperation: 'source-over',
          font: '12px sans-serif',
          textAlign: 'left' as CanvasTextAlign, textBaseline: 'top' as CanvasTextBaseline,
          fillStyle: '#000000', strokeStyle: '#000000', lineWidth: 1,
          shadowBlur: 0, shadowColor: 'rgba(0,0,0,0)', shadowOffsetX: 0, shadowOffsetY: 0,
        } as unknown as CanvasRenderingContext2D
      }
      return origGetContext.call(this, contextId, ...args) as any
    })

    canvasEl = document.createElement('canvas')
    canvasEl.width = 800; canvasEl.height = 600
    document.body.appendChild(canvasEl)
    canvas = new fabric.Canvas(canvasEl, { width: 800, height: 600, backgroundColor: '#fff', renderOnAddRemove: false })
    history = new HistoryManager()
  })

  afterEach(() => {
    canvas?.dispose(); canvas = null
    if (canvasEl) { document.body.removeChild(canvasEl); canvasEl = null }
    vi.restoreAllMocks()
  })

  // 核心场景：从左侧面板添加矩形 → 验证存在 → undo → 验证消失
  it('添加矩形后对象数量=1，undo 后数量=0', async () => {
    // 步骤 1：模拟初始加载（画布上已有一条 SVG 加载的数据）
    history.save(canvas!, () => {}, () => {})
    expect(canvas!.getObjects().length).toBe(0)

    // 步骤 2：用户点击「矩形」卡片 → addElement('rect')
    const rect = new fabric.Rect({ left: 100, top: 100, width: 80, height: 60, fill: '#3b82f6' })
    canvas!.add(rect); canvas!.renderAll()
    history.save(canvas!, () => {}, () => {})       // ← 对应 addElement 中的 withSave

    expect(canvas!.getObjects().length).toBe(1)
    expect(history.canUndo()).toBe(true)             // undo 按钮应亮起
    expect(history.canRedo()).toBe(false)

    // 步骤 3：用户按 Ctrl+Z → undo
    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise

    expect(canvas!.getObjects().length).toBe(0)      // 矩形消失
    expect(history.canRedo()).toBe(true)             // 可重做
  })

  // 添加多种元素后，undo 应逐级回退
  it('添加矩形+圆形后 undo 应回到只有矩形的状态', async () => {
    history.save(canvas!, () => {}, () => {})         // 初始空画布

    // 添加矩形
    canvas!.add(new fabric.Rect({ left: 10, top: 10, width: 50, height: 50, fill: 'blue' }))
    canvas!.renderAll(); history.save(canvas!, () => {}, () => {})
    expect(canvas!.getObjects().length).toBe(1)

    // 添加圆形
    canvas!.add(new fabric.Circle({ left: 60, top: 60, radius: 25, fill: 'red' }))
    canvas!.renderAll(); history.save(canvas!, () => {}, () => {})
    expect(canvas!.getObjects().length).toBe(2)

    // undo → 回到只有矩形的状态
    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise
    expect(canvas!.getObjects().length).toBe(1)
    expect(canvas!.getObjects()[0].type).toBe('rect')
  })

  // 添加文本后 undo 文本应消失
  it('添加文本框后 undo 文本应消失', async () => {
    history.save(canvas!, () => {}, () => {})

    canvas!.add(new fabric.Textbox('Hello', { left: 50, top: 50, fontSize: 24, fill: '#000', width: 120 }))
    canvas!.renderAll(); history.save(canvas!, () => {}, () => {})

    expect(canvas!.getObjects().length).toBe(1)
    expect((canvas!.getObjects()[0] as any).text).toBe('Hello')

    const promise = new Promise<void>((resolve) => {
      history.undo(canvas!, () => resolve())
    })
    await promise
    expect(canvas!.getObjects().length).toBe(0)
  })
})
