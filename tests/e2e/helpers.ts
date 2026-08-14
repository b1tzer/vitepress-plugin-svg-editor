/**
 * E2E 测试统一辅助函数入口
 *
 * 整合了以下原散落各处的功能：
 *   - 导航 & 编辑器打开/关闭   (原 tests/e2e/helpers.ts + 各 spec 内联)
 *   - Canvas Fabric.js 操作     (原 tests/canvas-helpers.ts + svg-editor-full 内联)
 *   - 按钮点击 & 元素创建       (原 comprehensive.spec.ts 内联)
 *
 * 所有 E2E spec 文件统一从本文件 import，消除 8 份复制粘贴代码。
 */
import type { Page, JSHandle } from '@playwright/test'

// ═══════════════════════════════════════════════════════════
// 一、导航 & 编辑器生命周期
// ═══════════════════════════════════════════════════════════

/** 导航到 VitePress 页面并等待 SPA 渲染完成 */
export async function navigateToPage(page: Page, url: string, timeout = 30000): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle', timeout })
  await page.waitForFunction(() => {
    const app = document.querySelector('#app')
    return app && app.children.length > 0
  }, { timeout })
}

/** 等待 SVG 容器渲染并滚动到指定 index */
export async function waitForSvgContainer(page: Page, svgIndex = 0, timeout = 15000): Promise<void> {
  await page.waitForSelector('.svg-container', { timeout })
  await page.waitForFunction((idx: number) => {
    const c = document.querySelectorAll('.svg-container')[idx]
    return c && c.querySelector('svg')
  }, svgIndex, { timeout: 10000 })
  await page.evaluate((idx: number) => {
    const c = document.querySelectorAll('.svg-container')[idx]
    if (c) c.scrollIntoView({ block: 'center' })
  }, svgIndex)
  await page.waitForTimeout(500)
}

/**
 * 打开编辑器：从 hover SVG 容器到点击"编辑 SVG"按钮，等待 Canvas 渲染完成
 * @param page    Playwright Page
 * @param svgIndex SVG 容器索引（默认 0）
 */
export async function openEditor(page: Page, svgIndex = 0): Promise<void> {
  const container = page.locator('.svg-container').nth(svgIndex)
  await container.hover()
  await container.locator('.svg-edit-btn').click({ force: true })
  await page.waitForSelector('.editor-overlay')
  // 等待 loading 消失 + canvas 渲染
  await page.waitForFunction(() => {
    const loading = document.querySelector('.loading')
    const canvas = document.querySelector('.editor-overlay canvas')
    return (!loading || loading.offsetParent === null) && canvas
  }, { timeout: 15000 })
}

/**
 * 完整流程：导航到页面 → 等待 SVG → 打开编辑器
 * （大多数 E2E 测试的标准 beforeAll / beforeEach 模式）
 */
export async function navigateAndOpenEditor(
  page: Page,
  url: string,
  svgIndex = 0,
): Promise<void> {
  await navigateToPage(page, url)
  await waitForSvgContainer(page, svgIndex)
  await openEditor(page, svgIndex)
}

/** 等待编辑器完全关闭 */
export async function waitForEditorClose(page: Page): Promise<void> {
  await page.waitForSelector('.editor-overlay', { state: 'hidden', timeout: 5000 })
}

// ═══════════════════════════════════════════════════════════
// 二、截图 & 快捷键
// ═══════════════════════════════════════════════════════════

/** 截图并保存到 tests/screenshots/ */
export async function screenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `tests/e2e/screenshots/${name}.png`,
    fullPage: false,
  })
}

/** 截取画布区域 */
export async function screenshotCanvas(page: Page, name: string): Promise<void> {
  const canvasEl = page.locator('canvas').first()
  await canvasEl.screenshot({ path: `tests/e2e/screenshots/${name}.png` })
}

/** 触发快捷键 */
export async function pressShortcut(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key)
  await page.waitForTimeout(200)
}

/** 通过 data-tip 属性查找并点击按钮 */
export async function clickByTip(page: Page, tip: string): Promise<number> {
  const idx = await page.evaluate((tip: string) => {
    const btns = document.querySelectorAll('.editor-overlay button')
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute('data-tip') === tip) return i
    }
    return -1
  }, tip)
  if (idx >= 0) {
    await page.locator('.editor-overlay button').nth(idx).click()
    await page.waitForTimeout(200)
  }
  return idx
}

/** 获取 Canvas 的 CSS bounding box（用于鼠标事件计算） */
export async function getCanvasBox(page: Page) {
  return page.locator('.editor-canvas .lower-canvas').boundingBox().catch(() => null)
}

// ═══════════════════════════════════════════════════════════
// 三、Canvas Fabric.js 操作（通过 window.__fabricCanvas 桥接）
// ═══════════════════════════════════════════════════════════

// ── 获取全局 canvas 实例 ──

/** 获取 Fabric.js canvas 实例（SvgEditor 挂载在 window.__fabricCanvas 上） */
export async function getCanvas(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) throw new Error('Canvas not found. Is the editor open?')
    return { objectCount: c.getObjects().length, width: c.getWidth(), height: c.getHeight() }
  })
}

// ── 添加元素 ──

export interface ShapeOptions {
  left?: number; top?: number; fill?: string; stroke?: string; strokeWidth?: number
  width?: number; height?: number; radius?: number; text?: string; fontSize?: number
  scaleX?: number; scaleY?: number; angle?: number; opacity?: number
}

/** 添加矩形 */
export async function addRect(page: Page, opts: ShapeOptions = {}) {
  return page.evaluate((o) => {
    const c = (window as any).__fabricCanvas
    const rect = new (window as any).fabric.Rect({
      left: o.left ?? 100, top: o.top ?? 100,
      width: o.width ?? 200, height: o.height ?? 100,
      fill: o.fill ?? '#2196F3', stroke: o.stroke ?? '#1565C0',
      strokeWidth: o.strokeWidth ?? 2,
    })
    c.add(rect)
    c.setActiveObject(rect)
    c.renderAll()
    ;(window as any).__historyMgr?.save(c)
    return c.getObjects().length - 1
  }, opts)
}

/** 添加圆形 */
export async function addCircle(page: Page, opts: ShapeOptions = {}) {
  return page.evaluate((o) => {
    const c = (window as any).__fabricCanvas
    const circle = new (window as any).fabric.Circle({
      left: o.left ?? 100, top: o.top ?? 100,
      radius: o.radius ?? 50,
      fill: o.fill ?? '#4CAF50', stroke: o.stroke ?? '#388E3C',
      strokeWidth: o.strokeWidth ?? 2,
    })
    c.add(circle)
    c.setActiveObject(circle)
    c.renderAll()
    ;(window as any).__historyMgr?.save(c)
    return c.getObjects().length - 1
  }, opts)
}

/** 添加文本 */
export async function addText(page: Page, text: string, opts: ShapeOptions = {}) {
  return page.evaluate(([t, o]) => {
    const c = (window as any).__fabricCanvas
    const textObj = new (window as any).fabric.Text(t, {
      left: o.left ?? 100, top: o.top ?? 100,
      fontSize: o.fontSize ?? 24, fill: o.fill ?? '#333333',
    })
    c.add(textObj)
    c.setActiveObject(textObj)
    c.renderAll()
    ;(window as any).__historyMgr?.save(c)
    return c.getObjects().length - 1
  }, [text, opts] as const)
}

/** 添加直线 */
export async function addLine(page: Page, x1: number, y1: number, x2: number, y2: number, opts: ShapeOptions = {}) {
  return page.evaluate(([a, b, c2, d, o]) => {
    const c = (window as any).__fabricCanvas
    const line = new (window as any).fabric.Line([a, b, c2, d], {
      stroke: o.stroke ?? '#333333', strokeWidth: o.strokeWidth ?? 2,
    })
    c.add(line)
    c.renderAll()
    ;(window as any).__historyMgr?.save(c)
    return c.getObjects().length - 1
  }, [x1, y1, x2, y2, opts] as const)
}

// ── 选择与操作 ──

/** 选中指定 index 的对象 */
export async function selectObject(page: Page, index: number) {
  return page.evaluate((idx) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    c.setActiveObject(obj)
    c.renderAll()
    return true
  }, index)
}

/** 选中所有对象 */
export async function selectAll(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    c.discardActiveObject()
    const sel = new (window as any).fabric.ActiveSelection(c.getObjects(), { canvas: c })
    c.setActiveObject(sel)
    c.renderAll()
    return c.getActiveObjects().length
  })
}

/** 取消选择 */
export async function deselectAll(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    c.discardActiveObject()
    c.renderAll()
  })
}

/** 删除选中对象 */
export async function deleteSelected(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const active = c.getActiveObjects()
    active.forEach((obj: any) => c.remove(obj))
    c.discardActiveObject()
    c.renderAll()
    return c.getObjects().length
  })
}

/** 选中多个指定 id 的对象（id 通过对象上的 id 属性匹配） */
export async function multiSelect(page: Page, ids: string[]) {
  await page.evaluate((ids: string[]) => {
    const c = (window as any).__fabricCanvas
    const objs = ids.map(id => c.getObjects().find((o: any) => o.id === id)).filter(Boolean)
    if (objs.length >= 2) {
      c.setActiveObject(new (window as any).fabric.ActiveSelection(objs, { canvas: c }))
    } else if (objs.length === 1) c.setActiveObject(objs[0])
    c.renderAll()
  }, ids)
}

/** 通过 id 前缀创建多个矩形 */
export async function createRects(page: Page, n: number, pfx: string) {
  const colors = ['#1565C0', '#E53935', '#4CAF50', '#FF9800', '#9C27B0']
  return page.evaluate(({ n, pfx, colors }: any) => {
    const c = (window as any).__fabricCanvas
    if (!c) return []
    // 清理旧对象
    c.getObjects().filter((o: any) => o.id?.startsWith(pfx)).forEach((o: any) => c.remove(o))
    const R = (window as any).fabric.Rect
    const rects: any[] = []
    for (let i = 0; i < n; i++) {
      const r = new R({
        left: 100 + i * 60, top: 100 + i * 30, width: 80, height: 50,
        fill: colors[i % colors.length], id: `${pfx}-${i}`,
      })
      c.add(r); rects.push(r)
    }
    c.renderAll()
    return rects.map((r: any) => ({ left: Math.round(r.left), top: Math.round(r.top), id: r.id }))
  }, { n, pfx, colors })
}

/** 读取指定 id 前缀的矩形坐标 */
export async function readRects(page: Page, pfx: string) {
  return page.evaluate((pfx: string) => {
    const c = (window as any).__fabricCanvas
    return c.getObjects().filter((o: any) => o.id?.startsWith(pfx))
      .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top), id: o.id }))
  }, pfx)
}

/** 读取当前选中对象中指定前缀的矩形坐标 */
export async function readSelectedRects(page: Page, pfx: string) {
  return page.evaluate((pfx: string) => {
    const c = (window as any).__fabricCanvas
    const sel = c.getActiveObject()
    const source = (sel && sel._objects) ? sel._objects : c.getObjects()
    return (source as any[]).filter((o: any) => o.id?.startsWith(pfx))
      .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top), id: o.id }))
  }, pfx)
}

// ── 移动与变换 ──

export async function moveObject(page: Page, index: number, left: number, top: number) {
  return page.evaluate(([idx, l, t]) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    obj.set({ left: l, top: t })
    obj.setCoords()
    c.renderAll()
    return { left: obj.left, top: obj.top }
  }, [index, left, top] as const)
}

export async function dragObject(page: Page, index: number, dx: number, dy: number) {
  return page.evaluate(([idx, ddx, ddy]) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    obj.set({ left: obj.left + ddx, top: obj.top + ddy })
    obj.setCoords()
    c.renderAll()
    return { left: obj.left, top: obj.top }
  }, [index, dx, dy] as const)
}

export async function scaleObject(page: Page, index: number, scaleX: number, scaleY: number) {
  return page.evaluate(([idx, sx, sy]) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    obj.set({ scaleX: sx, scaleY: sy })
    obj.setCoords()
    c.renderAll()
    return { scaleX: obj.scaleX, scaleY: obj.scaleY }
  }, [index, scaleX, scaleY] as const)
}

export async function rotateObject(page: Page, index: number, angle: number) {
  return page.evaluate(([idx, a]) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    obj.set({ angle: a })
    obj.setCoords()
    c.renderAll()
    return obj.angle
  }, [index, angle] as const)
}

export async function setObjectOpacity(page: Page, index: number, opacity: number) {
  return page.evaluate(([idx, o]) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) throw new Error(`Object at index ${idx} not found`)
    obj.set({ opacity: o })
    c.renderAll()
    return obj.opacity
  }, [index, opacity] as const)
}

// ── 状态读取 ──

export async function getObjectState(page: Page, index: number) {
  return page.evaluate((idx) => {
    const c = (window as any).__fabricCanvas
    const obj = c.getObjects()[idx]
    if (!obj) return null
    return {
      type: obj.type, left: Math.round(obj.left), top: Math.round(obj.top),
      width: Math.round(obj.width * (obj.scaleX ?? 1)), height: Math.round(obj.height * (obj.scaleY ?? 1)),
      fill: obj.fill, stroke: obj.stroke, strokeWidth: obj.strokeWidth,
      angle: Math.round(obj.angle), opacity: obj.opacity,
      scaleX: obj.scaleX, scaleY: obj.scaleY, visible: obj.visible, selectable: obj.selectable,
    }
  }, index)
}

export async function getActiveObjectState(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const obj = c.getActiveObject()
    if (!obj) return null
    return {
      type: obj.type, left: Math.round(obj.left), top: Math.round(obj.top),
      width: Math.round(obj.width * (obj.scaleX ?? 1)), height: Math.round(obj.height * (obj.scaleY ?? 1)),
      fill: obj.fill, stroke: obj.stroke, angle: Math.round(obj.angle), opacity: obj.opacity,
    }
  })
}

export async function getCanvasSummary(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    return {
      objectCount: c.getObjects().length,
      objects: c.getObjects().map((obj: any, i: number) => ({
        index: i, type: obj.type,
        left: Math.round(obj.left), top: Math.round(obj.top),
      })),
      hasActiveObject: !!c.getActiveObject(),
      zoom: c.getZoom(),
    }
  })
}

// ── 画布操作 ──

export async function clearCanvas(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    c.clear()
    c.renderAll()
    return c.getObjects().length
  })
}

export async function getZoom(page: Page) {
  return page.evaluate(() => (window as any).__fabricCanvas?.getZoom())
}

export async function setZoom(page: Page, zoom: number) {
  return page.evaluate((z) => {
    const c = (window as any).__fabricCanvas
    const center = { x: c.getWidth() / 2, y: c.getHeight() / 2 }
    c.zoomToPoint(center, z)
    c.renderAll()
    return c.getZoom()
  }, zoom)
}

// ── undo/redo ──

export async function undo(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const historyMgr = (window as any).__historyMgr
    if (historyMgr?.undo) {
      historyMgr.undo(c)
      c.renderAll()
      return c.getObjects().length
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
    return c.getObjects().length
  })
}

export async function redo(page: Page) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const historyMgr = (window as any).__historyMgr
    if (historyMgr?.redo) {
      historyMgr.redo(c)
      c.renderAll()
      return c.getObjects().length
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true }))
    return c.getObjects().length
  })
}

// ── 组合操作 ──

export async function addTestShapes(page: Page) {
  const rectIdx = await addRect(page, { left: 100, top: 100, fill: '#2196F3', width: 150, height: 80 })
  const circleIdx = await addCircle(page, { left: 300, top: 100, fill: '#4CAF50', radius: 40 })
  const textIdx = await addText(page, 'Hello', { left: 100, top: 250, fontSize: 32, fill: '#333' })
  return { rectIdx, circleIdx, textIdx }
}

export async function expectCanvasToHave(page: Page, count: number) {
  const summary = await getCanvasSummary(page)
  if (summary.objectCount !== count) {
    throw new Error(`Expected ${count} objects, got ${summary.objectCount}`)
  }
  return true
}

// ═══════════════════════════════════════════════════════════
// 四、SVG 结构分析（原 verification.spec.ts 内联）
// ═══════════════════════════════════════════════════════════

export interface SvgStructure {
  lines: number; polygons: number; groups: number; texts: number
  markerEnds: number; markers: number
}

export function analyzeSvg(html: string): SvgStructure {
  return {
    lines: (html.match(/<line\s/g) || []).length,
    polygons: (html.match(/<polygon\s/g) || []).length,
    groups: (html.match(/<g[\s>]/g) || []).length,
    texts: (html.match(/<text\s/g) || []).length,
    markerEnds: (html.match(/marker-end=/g) || []).length,
    markers: (html.match(/<marker\s/g) || []).length,
  }
}
