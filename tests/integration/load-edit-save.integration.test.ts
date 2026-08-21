/**
 * load → edit → save 完整闭环集成测试（对齐 design/10-test-strategy.md 2.3）
 *
 * 覆盖跨模块协同链路：
 *   SvgLoader.load（清洗 + 预处理）→ mountSvgObjects（装载到真实 Fabric 画布）
 *   → 编辑对象 → SvgSerializer.serialize（后处理）→ LocalStorageAdapter.save/load
 *
 * 全面算法化后：带 fallback 的 var() 解析为 hex，保存不再还原语义变量，
 * 落盘永远为纯 hex（亮色真值）。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fabric from 'fabric'
import { SvgLoader } from '../../src/core/serialization/SvgLoader'
import { SvgSerializer } from '../../src/core/serialization/SvgSerializer'
import { mountSvgObjects } from '../../src/core/editor/SvgObjectMounter'
import { LocalStorageAdapter } from '../../src/adapters/storage/LocalStorageAdapter'

// DOMPurify 依赖浏览器原生 SVG 命名空间解析，happy-dom 对 SVG 支持不完整，
// 官方不建议二者组合。集成测试聚焦「模块间数据流动」，透传 mock；
// 真实清洗效果由 E2E（真实浏览器）验证。
vi.mock('dompurify', () => ({
  default: { sanitize: (dirty: string) => dirty },
}))

// 含带 fallback CSS 变量的最小 SVG
const cssVarSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">' +
  '<rect x="10" y="10" width="80" height="50" fill="var(--diagram-accent-1, #1565C0)"/>' +
  '</svg>'

describe('load → edit → save 完整闭环', () => {
  let canvasEl: HTMLCanvasElement
  let canvas: fabric.Canvas

  beforeEach(() => {
    localStorage.clear()
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
  })

  afterEach(() => {
    canvas.dispose()
    document.body.removeChild(canvasEl)
  })

  it('应完成 load → mount → edit → serialize → save → load 全链路', async () => {
    const loader = new SvgLoader()

    // 1. load：带 fallback 的 CSS 变量应被替换为 fallback hex
    const loadResult = loader.load(cssVarSvg)
    expect(loadResult.svg).toContain('#1565C0')
    expect(loadResult.svg).not.toContain('var(--diagram-accent-1')
    expect(loadResult.originalViewBox).toBe('0 0 200 100')

    // 2. mount：装载到真实 Fabric 画布
    await mountSvgObjects(canvas, loadResult.svg)
    const objs = canvas.getObjects()
    expect(objs.length).toBe(1)
    const rect = objs[0] as any
    expect(String(rect.fill).toUpperCase()).toBe('#1565C0')

    // 3. edit：移动对象并改色（模拟用户编辑）
    rect.set({ left: 100, fill: '#E65100' })
    rect.setCoords()
    canvas.renderAll()

    // 4. serialize：后处理应移除 Fabric 私有属性并恢复 viewBox
    const serializer = new SvgSerializer()
    const svgText = serializer.serialize(canvas, { originalViewBox: loadResult.originalViewBox })
    expect(svgText).toContain('<svg')
    expect(svgText).not.toContain('data-fabric')
    expect(svgText).toContain('viewBox="0 0 200 100"')

    // 5. save → load：LocalStorageAdapter 持久化闭环
    const adapter = new LocalStorageAdapter()
    const saveResult = await adapter.save(svgText, '/diagrams/foo.svg')
    expect(saveResult.success).toBe(true)
    const loaded = await adapter.load('/diagrams/foo.svg')
    expect(loaded).toBe(svgText)
  })

  it('带 fallback 的 var() 应解析为 hex（不再保留语义变量）', async () => {
    const loader = new SvgLoader()
    const loadResult = loader.load(cssVarSvg)

    await mountSvgObjects(canvas, loadResult.svg)
    const rect = canvas.getObjects()[0] as any
    expect(String(rect.fill).toUpperCase()).toBe('#1565C0')

    const serializer = new SvgSerializer()
    const svgText = serializer.serialize(canvas, { originalViewBox: loadResult.originalViewBox })

    // 全面算法化：保存不再还原 var()，落盘为纯 hex
    expect(svgText).not.toContain('var(--diagram-')
    expect(svgText).toContain('#1565C0')
  })

  it('纯 hex 对象保存后保持 hex 不变（不再还原为 CSS 变量）', async () => {
    const rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 80,
      height: 50,
      fill: '#1565C0',
    })
    canvas.add(rect)
    canvas.renderAll()

    const serializer = new SvgSerializer()
    const svgText = serializer.serialize(canvas, { originalViewBox: '0 0 200 100' })

    expect(svgText).not.toContain('var(--diagram-')
    expect(svgText).toContain('#1565C0')
  })
})
