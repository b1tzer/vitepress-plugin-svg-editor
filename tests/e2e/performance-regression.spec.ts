/**
 * 性能回归测试 — 量化 SVG 编辑器的运行时性能瓶颈，防止退化
 *
 * 对齐 design/11-non-functional.md「P0-4 性能基线」：
 *   - 撤销/重做延迟 < 100ms（50 步历史）
 *   - Canvas 帧率 ≥ 30fps（100 对象场景）
 *   - 导出无长时间主线程阻塞
 *
 * 测量策略：
 *   - 在真实浏览器中通过 window.__fabricCanvas 直接测量关键操作耗时
 *   - 每个操作采样 3 次取最小值，抗 CI 共享机器噪声
 *   - 不依赖 console 输出或 dev-only 打点（src/utils/perf.ts 的 measure 会 clearMeasures，
 *     无法用 getEntriesByName 读回），保证 CI 与本地行为一致
 *
 * 阈值说明：
 *   - 采用「CI 宽松值」避免 GitHub Actions 共享机器性能波动导致 flaky
 *   - 本地/严格目标见各常量注释，后续可在 CI 稳定后收紧
 *
 * 仅跑 Chromium：性能测量需单浏览器稳定，Firefox 的 performance.memory / longtask 支持弱。
 */
import { test, expect, type Page } from '@playwright/test'
import { navigateAndOpenEditor } from './helpers'

const PAGE_URL = '/'
const SVG_IDX = 1
const OBJECT_COUNT = 100

// ── 阈值（CI 宽松值；本地严格目标见注释） ──
/** 单帧 renderAll 耗时。本地目标 < 33ms（等效 30fps），CI 放宽到 200ms */
const RENDER_ALL_BUDGET_MS = 200
/** 全量快照 toJSON（撤销/重做卡顿主源）。设计文档 < 100ms，CI 放宽到 500ms */
const TO_JSON_BUDGET_MS = 500
/** 导出 toSVG。本地目标 < 100ms，CI 放宽到 500ms */
const TO_SVG_BUDGET_MS = 500
/** 拖拽单帧「移动+渲染」耗时。本地目标 < 33ms（等效 30fps），CI 放宽到 100ms */
const DRAG_MOVE_BUDGET_MS = 100
/** 100 对象场景拖拽平均帧率（对齐设计文档 ≥30fps，P4 使用） */
const DRAG_FPS_BUDGET = 30
/** 复杂 SVG 单对象真实鼠标拖拽帧率（P3 使用）。
 * 本地严格目标 30fps；但 CI 共享 runner 上复杂对象（circle/group/textbox）
 * 光栅化负载更重，实测稳定 23~30fps，故 CI 放宽到 20 以防 flaky。
 * 不放松 P4 的「100 对象 ≥30fps」硬指标。 */
const COMPLEX_SVG_DRAG_FPS_BUDGET = 20
/** 缩放/平移/全选拖拽单次全量重绘耗时。本地目标 < 33ms（等效 30fps），CI 放宽到 100ms */
const FULL_REDRAW_BUDGET_MS = 100

// ── 辅助函数 ──

/** 获取画布中可拖拽对象的屏幕中心坐标（可指定 id，否则取第一个非文本可拖拽对象） */
async function getDraggableTarget(
  page: Page,
  id?: string
): Promise<{ sx: number; sy: number } | null> {
  return page.evaluate((targetId) => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    const obj = targetId
      ? c.getObjects().find((o: any) => o.id === targetId)
      : c.getObjects().find((o: any) => {
          const t = o.type
          return t === 'rect' || t === 'circle' || t === 'line' || t === 'polygon' || t === 'path'
        })
    if (!obj) return null
    const vt = c.viewportTransform || [1, 0, 0, 1, 0, 0]
    const el = document.querySelector('.editor-canvas .lower-canvas') as HTMLElement
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cx = obj.left + ((obj.width || 0) * (obj.scaleX || 1)) / 2
    const cy = obj.top + ((obj.height || 0) * (obj.scaleY || 1)) / 2
    return {
      sx: r.left + cx * vt[0] + vt[4],
      sy: r.top + cy * vt[0] + vt[5],
    }
  }, id)
}

/** 用 Playwright 真实鼠标事件拖拽对象，并测量 rAF 帧率 */
async function measureDragFps(
  page: Page,
  sx: number,
  sy: number,
  dx: number,
  dy: number
): Promise<{ fps: number; frameCount: number; validFrameCount: number; avgIntervalMs: number }> {
  // 启动 rAF 帧间隔测量
  await page.evaluate(() => {
    ;(window as any).__frames = []
    const loop = (t: number) => {
      ;(window as any).__frames.push(t)
      ;(window as any).__rafId = requestAnimationFrame(loop)
    }
    ;(window as any).__rafId = requestAnimationFrame(loop)
  })

  // 真实鼠标拖拽（多步移动派发连续 mousemove，模拟真实拖拽）
  await page.mouse.move(sx, sy)
  await page.mouse.down()
  await page.mouse.move(sx + dx, sy + dy, { steps: 30 })
  await page.mouse.move(sx + dx, sy + dy)
  await page.mouse.up()

  // 停止测量并计算平均帧率
  return page.evaluate(() => {
    cancelAnimationFrame((window as any).__rafId)
    const frames = (window as any).__frames as number[]
    const intervals: number[] = []
    for (let i = 1; i < frames.length; i++) intervals.push(frames[i] - frames[i - 1])
    if (intervals.length < 2)
      return { fps: 0, frameCount: intervals.length, validFrameCount: 0, avgIntervalMs: 0 }
    // 过滤异常大间隔（>100ms，可能是 GC / 事件间隙），取稳定帧
    const valid = intervals.filter((x) => x < 100)
    const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0
    return {
      fps: avg > 0 ? Math.round(1000 / avg) : 0,
      frameCount: intervals.length,
      validFrameCount: valid.length,
      avgIntervalMs: avg,
    }
  })
}

test.describe('性能回归', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', '性能测量仅跑 Chromium')

  test.beforeEach(async ({ page }) => {
    await navigateAndOpenEditor(page, PAGE_URL, SVG_IDX)
    await page.waitForFunction(() => (window as any).__fabricCanvas, { timeout: 15000 })
  })

  test('P1. 100 对象场景：单帧渲染 / 撤销快照 / 导出耗时', async ({ page }) => {
    const metrics = await page.evaluate((count) => {
      const c = (window as any).__fabricCanvas
      const fabricNS = (window as any).fabric
      if (!c) throw new Error('__fabricCanvas 未就绪')
      if (!fabricNS || !fabricNS.Rect) throw new Error('window.fabric 未就绪')

      // 批量添加对象（关闭 renderOnAddRemove，避免 add 时逐次重绘污染测量）
      const prevRenderOnAddRemove = c.renderOnAddRemove
      c.renderOnAddRemove = false
      const R = fabricNS.Rect
      for (let i = 0; i < count; i++) {
        c.add(
          new R({
            left: 50 + (i % 10) * 60,
            top: 50 + Math.floor(i / 10) * 60,
            width: 40,
            height: 30,
            fill: '#2196F3',
            stroke: '#1565C0',
            strokeWidth: 1,
          })
        )
      }
      c.renderOnAddRemove = prevRenderOnAddRemove
      c.renderAll()

      // 采样 3 次取最小值，抗 GC / 偶发噪声
      const measureMin = (fn: () => unknown): number => {
        const samples: number[] = []
        for (let i = 0; i < 3; i++) {
          const t = performance.now()
          fn()
          samples.push(performance.now() - t)
        }
        return Math.min(...samples)
      }

      const renderMs = measureMin(() => c.renderAll())
      const toJsonMs = measureMin(() => c.toJSON())
      const toSvgMs = measureMin(() => c.toSVG())

      return { objectCount: c.getObjects().length, renderMs, toJsonMs, toSvgMs }
    }, OBJECT_COUNT)

    // eslint-disable-next-line no-console
    console.log('[性能] 指标:', JSON.stringify(metrics, null, 2))

    expect(metrics.objectCount).toBeGreaterThanOrEqual(OBJECT_COUNT)
    expect(metrics.renderMs).toBeLessThan(RENDER_ALL_BUDGET_MS)
    expect(metrics.toJsonMs).toBeLessThan(TO_JSON_BUDGET_MS)
    expect(metrics.toSvgMs).toBeLessThan(TO_SVG_BUDGET_MS)
  })

  test('P2. 真实 SVG（test-complex.svg）场景：撤销快照 / 导出 / 拖拽帧率', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      if (!c) throw new Error('__fabricCanvas 未就绪')

      // SVG_IDX=1 对应 test-complex.svg（含 CSS 变量 + 渐变 + 文本 + 箭头），
      // 编辑器已解析加载完毕，这里不再额外添加矩形，直接测真实基线
      const objects = c.getObjects()
      const objectCount = objects.length

      // 找一个可拖拽的非文本对象（rect / circle / line / polygon / path）
      const target = objects.find((o: any) => {
        const t = o.type
        return t === 'rect' || t === 'circle' || t === 'line' || t === 'polygon' || t === 'path'
      })

      const measureMin = (fn: () => unknown): number => {
        const samples: number[] = []
        for (let i = 0; i < 3; i++) {
          const t = performance.now()
          fn()
          samples.push(performance.now() - t)
        }
        return Math.min(...samples)
      }

      const renderMs = measureMin(() => c.renderAll())
      const toJsonMs = measureMin(() => c.toJSON())
      const toSvgMs = measureMin(() => c.toSVG())

      // 拖拽帧率：连续 20 次「移动 + setCoords + renderAll」的平均耗时，换算成 fps。
      // 这模拟真实拖拽中每次 mousemove 触发的渲染负载。
      let dragMoveMs = 0
      if (target) {
        const origLeft = target.left
        const dragSamples: number[] = []
        for (let i = 1; i <= 20; i++) {
          const t = performance.now()
          target.set({ left: origLeft + i })
          target.setCoords()
          c.renderAll()
          dragSamples.push(performance.now() - t)
        }
        // 还原位置，避免污染后续断言 / 截图
        target.set({ left: origLeft })
        target.setCoords()
        c.renderAll()
        dragMoveMs = dragSamples.reduce((a, b) => a + b, 0) / dragSamples.length
      }

      return {
        objectCount,
        objectTypes: objects.map((o: any) => o.type),
        hasDraggable: !!target,
        renderMs,
        toJsonMs,
        toSvgMs,
        dragMoveMs,
        dragFps: dragMoveMs > 0 ? Math.round(1000 / dragMoveMs) : 0,
      }
    })

    // eslint-disable-next-line no-console
    console.log('[性能·真实SVG] 指标:', JSON.stringify(metrics, null, 2))

    expect(metrics.objectCount).toBeGreaterThan(0)
    expect(metrics.hasDraggable).toBe(true)
    expect(metrics.toJsonMs).toBeLessThan(TO_JSON_BUDGET_MS)
    expect(metrics.toSvgMs).toBeLessThan(TO_SVG_BUDGET_MS)
    expect(metrics.dragMoveMs).toBeLessThan(DRAG_MOVE_BUDGET_MS)
  })

  test('P3. 真实鼠标拖拽帧率', async ({ page }) => {
    const target = await getDraggableTarget(page)
    expect(target).not.toBeNull()
    // eslint-disable-next-line no-console
    console.log('[性能·拖拽] 目标:', JSON.stringify(target))

    // 采样 3 次取最大帧率（帧率越大越好，与 P1/P2 耗时「取最小值」口径对称），
    // 抗 CI 共享机器 GC / 并发负载抖动。交替拖拽方向让对象在原位附近往返，
    // 避免多次采样后对象漂出可视区域。
    const dirs = [
      { dx: 120, dy: 80 },
      { dx: -120, dy: -80 },
      { dx: 120, dy: 80 },
    ]
    let bestFps = 0
    for (let i = 0; i < dirs.length; i++) {
      const t = await getDraggableTarget(page)
      if (!t) break
      const result = await measureDragFps(page, t.sx, t.sy, dirs[i].dx, dirs[i].dy)
      // eslint-disable-next-line no-console
      console.log(`[性能·拖拽] 第 ${i + 1} 次帧率:`, JSON.stringify(result))
      bestFps = Math.max(bestFps, result.fps)
    }

    expect(bestFps).toBeGreaterThanOrEqual(COMPLEX_SVG_DRAG_FPS_BUDGET)
  })

  test('P4. 对象规模压力测试：拖拽帧率 / 快照耗时随对象数下降', async ({ page }) => {
    const SCALES = [10, 50, 100, 200, 400]
    const rows: Array<{ count: number; fps: number; toJsonMs: number }> = []

    for (const n of SCALES) {
      // 批量添加 n 个矩形（id 前缀标记，便于下一轮清理），模拟对象规模增长
      await page.evaluate((count) => {
        const c = (window as any).__fabricCanvas
        const R = (window as any).fabric.Rect
        c.getObjects()
          .filter((o: any) => o.id?.startsWith('perf-'))
          .forEach((o: any) => c.remove(o))
        const prev = c.renderOnAddRemove
        c.renderOnAddRemove = false
        for (let i = 0; i < count; i++) {
          c.add(
            new R({
              id: `perf-${i}`,
              left: 100 + (i % 10) * 50,
              top: 100 + Math.floor(i / 10) * 40,
              width: 30,
              height: 20,
              fill: '#2196F3',
              stroke: '#1565C0',
              strokeWidth: 1,
            })
          )
        }
        c.renderOnAddRemove = prev
        c.renderAll()
      }, n)

      // 拖拽明确指定的 perf-0 对象，避免与其他对象重叠导致命中歧义
      const target = await getDraggableTarget(page, 'perf-0')
      expect(target).not.toBeNull()
      const result = await measureDragFps(page, target!.sx, target!.sy, 120, 80)

      // 同规模下记录 toJSON 耗时（撤销/重做全量快照成本）
      const toJsonMs = await page.evaluate(() => {
        const c = (window as any).__fabricCanvas
        const t = performance.now()
        c.toJSON()
        return performance.now() - t
      })

      rows.push({ count: n, fps: result.fps, toJsonMs: Math.round(toJsonMs * 100) / 100 })
    }

    // eslint-disable-next-line no-console
    console.log('[性能·压力] 帧率/快照随对象数变化:', JSON.stringify(rows, null, 2))

    // 对齐设计文档：100 对象场景帧率 ≥ 30fps
    const at100 = rows.find((r) => r.count === 100)
    expect(at100).toBeDefined()
    expect(at100!.fps).toBeGreaterThanOrEqual(DRAG_FPS_BUDGET)
  })

  test('P5. 缩放 / 平移 / 全选拖拽耗时随对象数变化（全量重绘压力）', async ({ page }) => {
    const SCALES = [10, 50, 100, 200, 400]
    const rows: Array<{
      count: number
      zoomMs: number
      zoomFps: number
      panMs: number
      panFps: number
      dragAllMs: number
      dragAllFps: number
    }> = []

    for (const n of SCALES) {
      // 批量添加 n 个矩形（id 前缀标记，便于清理）
      await page.evaluate((count) => {
        const c = (window as any).__fabricCanvas
        const R = (window as any).fabric.Rect
        c.getObjects()
          .filter((o: any) => o.id?.startsWith('perf-'))
          .forEach((o: any) => c.remove(o))
        const prev = c.renderOnAddRemove
        c.renderOnAddRemove = false
        for (let i = 0; i < count; i++) {
          c.add(
            new R({
              id: `perf-${i}`,
              left: 100 + (i % 10) * 50,
              top: 100 + Math.floor(i / 10) * 40,
              width: 30,
              height: 20,
              fill: '#2196F3',
              stroke: '#1565C0',
              strokeWidth: 1,
            })
          )
        }
        c.renderOnAddRemove = prev
        c.renderAll()
      }, n)

      // 测量三类「全量重绘」操作的单次耗时（采样 3 次取最小）
      const row = await page.evaluate(() => {
        const c = (window as any).__fabricCanvas
        const Point = (window as any).fabric.Point
        const center = new Point(c.getWidth() / 2, c.getHeight() / 2)

        const measureMin = (fn: () => void): number => {
          const samples: number[] = []
          for (let i = 0; i < 3; i++) {
            const t = performance.now()
            fn()
            samples.push(performance.now() - t)
          }
          return Math.min(...samples)
        }

        // 全选所有非 workspace 对象，供「全选拖拽」测量
        const objs = c.getObjects().filter((o: any) => !o.excludeFromExport)
        const sel = new (window as any).fabric.ActiveSelection(objs, { canvas: c })
        c.setActiveObject(sel)
        c.renderAll()

        // 缩放：zoomToPoint 用绝对值 1.1，每次幂等，不累积 zoom，代表缩放全量重绘成本
        const zoomMs = measureMin(() => c.zoomToPoint(center, 1.1))

        // 平移：relativePan 内部触发 requestRenderAll，代表平移全量重绘成本
        const panMs = measureMin(() => c.relativePan(new Point(5, 5)))

        // 全选拖拽：移动整个 ActiveSelection + setCoords + renderAll，代表全选拖拽全量重绘成本
        const dragAllMs = measureMin(() => {
          sel.set({ left: (sel.left || 0) + 5, top: (sel.top || 0) + 5 })
          sel.setCoords()
          c.renderAll()
        })

        return { zoomMs, panMs, dragAllMs }
      })

      rows.push({
        count: n,
        zoomMs: Math.round(row.zoomMs * 100) / 100,
        zoomFps: row.zoomMs > 0 ? Math.round(1000 / row.zoomMs) : 0,
        panMs: Math.round(row.panMs * 100) / 100,
        panFps: row.panMs > 0 ? Math.round(1000 / row.panMs) : 0,
        dragAllMs: Math.round(row.dragAllMs * 100) / 100,
        dragAllFps: row.dragAllMs > 0 ? Math.round(1000 / row.dragAllMs) : 0,
      })
    }

    // eslint-disable-next-line no-console
    console.log('[性能·全量重绘] 缩放/平移/全选拖拽随对象数变化:', JSON.stringify(rows, null, 2))

    // 对齐设计文档：100 对象场景下，缩放/平移/全选拖拽单次 < 33ms（等效 30fps）
    const at100 = rows.find((r) => r.count === 100)
    expect(at100).toBeDefined()
    expect(at100!.zoomMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
    expect(at100!.panMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
    expect(at100!.dragAllMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
  })

  test('P6. 真实 SVG 对象全量重绘压力（clone 复杂对象：rect/textbox/group/circle）', async ({
    page,
  }) => {
    const SCALES = [10, 50, 100, 200, 400]
    const rows: Array<{
      count: number
      zoomMs: number
      zoomFps: number
      panMs: number
      panFps: number
      dragAllMs: number
      dragAllFps: number
    }> = []

    for (const n of SCALES) {
      // clone 真实 SVG 对象（test-complex.svg 解析出的 rect/textbox/group/circle），
      // 比简单矩形更接近真实场景：textbox 有文本、group 有箭头子对象、rect 有渐变填充。
      const row = await page.evaluate(async (count) => {
        const c = (window as any).__fabricCanvas
        // 清理上一轮的 perf- 克隆对象
        c.getObjects()
          .filter((o: any) => o.id?.startsWith('perf-'))
          .forEach((o: any) => c.remove(o))

        // 真实种子对象（排除 workspace / excludeFromExport 的背景与裁剪对象）
        const seeds = c
          .getObjects()
          .filter((o: any) => !o.excludeFromExport && o.id !== 'workspace')
        if (!seeds.length) throw new Error('未找到真实种子对象')

        // 克隆填充到目标总数（seeds 本身计入 count）
        const prevRender = c.renderOnAddRemove
        c.renderOnAddRemove = false
        const need = Math.max(0, count - seeds.length)
        for (let i = 0; i < need; i++) {
          const src = seeds[i % seeds.length]
          const cl = await src.clone()
          const batch = Math.floor(i / seeds.length)
          cl.set({
            id: `perf-${i}`,
            left: (src.left || 0) + (batch + 1) * 220,
            top: (src.top || 0) + (i % seeds.length) * 60,
          })
          c.add(cl)
        }
        c.renderOnAddRemove = prevRender
        // 预热：首次 renderAll 触发对象缓存光栅化，避免污染后续测量
        c.renderAll()

        const Point = (window as any).fabric.Point
        const center = new Point(c.getWidth() / 2, c.getHeight() / 2)

        const measureMin = (fn: () => void): number => {
          const samples: number[] = []
          for (let i = 0; i < 3; i++) {
            const t = performance.now()
            fn()
            samples.push(performance.now() - t)
          }
          return Math.min(...samples)
        }

        // 全选所有真实对象（排除 workspace/clipPath），供「全选拖拽」测量
        const objs = c.getObjects().filter((o: any) => !o.excludeFromExport)
        const sel = new (window as any).fabric.ActiveSelection(objs, { canvas: c })
        c.setActiveObject(sel)
        c.renderAll()

        const zoomMs = measureMin(() => c.zoomToPoint(center, 1.1))
        const panMs = measureMin(() => c.relativePan(new Point(5, 5)))
        const dragAllMs = measureMin(() => {
          sel.set({ left: (sel.left || 0) + 5, top: (sel.top || 0) + 5 })
          sel.setCoords()
          c.renderAll()
        })

        return {
          realObjectCount: c.getObjects().filter((o: any) => !o.excludeFromExport).length,
          zoomMs,
          panMs,
          dragAllMs,
        }
      }, n)

      rows.push({
        count: n,
        zoomMs: Math.round(row.zoomMs * 100) / 100,
        zoomFps: row.zoomMs > 0 ? Math.round(1000 / row.zoomMs) : 0,
        panMs: Math.round(row.panMs * 100) / 100,
        panFps: row.panMs > 0 ? Math.round(1000 / row.panMs) : 0,
        dragAllMs: Math.round(row.dragAllMs * 100) / 100,
        dragAllFps: row.dragAllMs > 0 ? Math.round(1000 / row.dragAllMs) : 0,
      })
    }

    // eslint-disable-next-line no-console
    console.log(
      '[性能·真实对象全量重绘] 缩放/平移/全选拖拽随对象数变化:',
      JSON.stringify(rows, null, 2)
    )

    // 对齐设计文档：100 个真实对象场景下，缩放/平移/全选拖拽单次 < 阈值
    const at100 = rows.find((r) => r.count === 100)
    expect(at100).toBeDefined()
    expect(at100!.zoomMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
    expect(at100!.panMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
    expect(at100!.dragAllMs).toBeLessThan(FULL_REDRAW_BUDGET_MS)
  })
})
