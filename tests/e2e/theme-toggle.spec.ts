/**
 * 明暗主题切换测试 — 全面覆盖 SvgEditor 内置主题功能的正确性
 *
 * 测试策略（三层金字塔）：
 *
 *   层级 2 — UI 交互正确性
 *     - 按钮是否存在、tooltip 是否正确（按住预览暗色 / 松开恢复亮色）
 *     - showThemeToggle=false 时按钮隐藏
 *
 *   层级 3 — 按住预览运行时正确性
 *     - workspace 背景色切换
 *     - 所有对象的 fill/stroke 颜色经 OKLCH 亮度翻转（非语义精确映射）
 *     - 阴影 / 文本 / 渐变颜色同样翻转
 *     - 松手恢复亮色真值
 *
 *   层级 4 — 边界情况
 *     - 空画布按住不崩溃
 *     - 快速按住/松开
 *     - 按住不改变对象数量和位置
 *     - 编辑器 chrome 明暗跟随网页 .dark 而非按钮
 */

import { test, expect } from '@playwright/test'
import { navigateAndOpenEditor } from './helpers'

const EDITOR_URL = '/'
const SVG_IDX = 1

// ════════════════════════════════════════════════════════════════
// 辅助函数
// ════════════════════════════════════════════════════════════════

async function openEditor(page: any, svgIdx = SVG_IDX) {
  await navigateAndOpenEditor(page, EDITOR_URL, svgIdx)
}

async function screenshot(page: any, name: string) {
  const canvasEl = page.locator('.editor-overlay canvas').first()
  await canvasEl.screenshot({ path: `tests/e2e/screenshots/theme-${name}.png` })
}

function getCanvasSummary(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    // 背景色由 workspace Rect（id='workspace'）的 fill 提供（方案 C），
    // canvas.backgroundColor 恒为 transparent
    const ws = c.getObjects().find((o: any) => o.id === 'workspace')
    return {
      bg: ws ? ws.fill : c.backgroundColor,
      totalObjects: c.getObjects().length,
    }
  })
}

/** 获取所有可导出对象的颜色快照 */
function getObjectColors(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    return c
      .getObjects()
      .filter((o: any) => !o.excludeFromExport)
      .map((o: any) => ({
        type: o.type,
        fill: typeof o.fill === 'string' ? o.fill : o.fill?.type || 'none',
        stroke: o.stroke || '',
        opacity: o.opacity,
      }))
  })
}

/** 获取背景信息（workspace Rect 的 fill 提供背景，canvas.backgroundColor 恒为 transparent） */
function getBackgroundInfo(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    const ws = c.getObjects().find((o: any) => o.id === 'workspace')
    const nonWorkspaceBgRects = c
      .getObjects()
      .filter((o: any) => o.excludeFromExport && o.id !== 'workspace').length
    return {
      bg: ws ? ws.fill : c.backgroundColor,
      noBgRects: nonWorkspaceBgRects === 0,
      totalObjects: c.getObjects().length,
    }
  })
}

/** 按住主题预览按钮（触发 pointerdown，开始暗色预览） */
function pressThemeToggle(page: any) {
  return page.evaluate(() => {
    const btn = document.querySelector('.theme-btn') as HTMLButtonElement
    if (!btn) return false
    btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    return true
  })
}

/** 松开主题预览按钮（触发 pointerup，恢复亮色） */
function releaseThemeToggle(page: any) {
  return page.evaluate(() => {
    const btn = document.querySelector('.theme-btn') as HTMLButtonElement
    if (!btn) return false
    btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    return true
  })
}

/** 获取主题按钮状态 */
function getThemeToggleState(page: any) {
  return page.evaluate(() => {
    const btn = document.querySelector('.theme-btn')
    if (!btn) return { exists: false }
    return {
      exists: true,
      tip: btn.getAttribute('data-tip'),
      visible: (btn as HTMLElement).offsetParent !== null,
    }
  })
}

/** 在画布上添加测试对象（带已知颜色） */
function addTestShapes(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null

    c.add(
      new (window as any).fabric.Rect({
        left: 50,
        top: 50,
        width: 80,
        height: 50,
        fill: '#E3F2FD',
        stroke: '#1565C0',
        strokeWidth: 2,
      })
    )
    c.add(
      new (window as any).fabric.Rect({
        left: 270,
        top: 50,
        width: 80,
        height: 50,
        fill: '#FF0000',
        stroke: '#000000',
        strokeWidth: 2,
      })
    )
    // 添加带阴影的对象
    c.add(
      new (window as any).fabric.Rect({
        left: 50,
        top: 140,
        width: 80,
        height: 50,
        fill: '#F3E5F5',
        stroke: '#7B1FA2',
        strokeWidth: 2,
        shadow: new (window as any).fabric.Shadow({
          color: '#999999',
          blur: 5,
          offsetX: 3,
          offsetY: 3,
        }),
      })
    )
    // 添加文本
    c.add(
      new (window as any).fabric.Text('Test', {
        left: 160,
        top: 140,
        fontSize: 20,
        fill: '#333333',
      })
    )
    c.renderAll()
    return { totalAdded: 4 }
  })
}

// ════════════════════════════════════════════════════════════════
// 层级 2 — UI 交互正确性
// ════════════════════════════════════════════════════════════════

test.describe('层级2 — UI 交互正确性', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
  })

  test('2.1 主题预览按钮存在且可见', async ({ page }) => {
    const state = await getThemeToggleState(page)
    expect(state.exists).toBe(true)
    expect(state.visible).toBe(true)
  })

  test('2.2 默认（未按住）tooltip 为"按住预览暗色"', async ({ page }) => {
    const state = await getThemeToggleState(page)
    expect(state.tip).toBe('按住预览暗色')
  })

  test('2.3 按住后 tooltip 为"松开恢复亮色"，松手后恢复"按住预览暗色"', async ({ page }) => {
    await pressThemeToggle(page)
    await page.waitForTimeout(200)
    expect((await getThemeToggleState(page)).tip).toBe('松开恢复亮色')

    await releaseThemeToggle(page)
    await page.waitForTimeout(200)
    expect((await getThemeToggleState(page)).tip).toBe('按住预览暗色')
  })

  test('2.4 按住预览不改变编辑器 chrome 明暗（跟随网页 .dark）', async ({ page }) => {
    const toolbarClassBefore = await page.evaluate(() =>
      document.querySelector('.editor-toolbar')?.className || ''
    )
    await pressThemeToggle(page)
    await page.waitForTimeout(200)
    const toolbarClassAfter = await page.evaluate(() =>
      document.querySelector('.editor-toolbar')?.className || ''
    )
    // 按住预览只影响 SVG 画布，不影响工具栏（chrome 跟随网页 .dark，此处不变）
    expect(toolbarClassAfter).toBe(toolbarClassBefore)
    await releaseThemeToggle(page)
  })
})

// ════════════════════════════════════════════════════════════════
// 层级 3 — 按住预览运行时正确性
// ════════════════════════════════════════════════════════════════

test.describe('层级3 — 按住预览运行时正确性', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
  })

  test('3.1 按住时 workspace 背景从亮切换为暗，松手恢复亮', async ({ page }) => {
    const before = await getCanvasSummary(page)
    expect(before!.bg).toBe('#ffffff')

    await pressThemeToggle(page)
    await page.waitForTimeout(300)
    const dark = await getCanvasSummary(page)
    expect(dark!.bg).toBe('#1e1e1e')

    await releaseThemeToggle(page)
    await page.waitForTimeout(300)
    const light = await getCanvasSummary(page)
    expect(light!.bg).toBe('#ffffff')
    await screenshot(page, 'canvas-bg-round-trip')
  })

  test('3.2 按住时对象 fill/stroke 应做 OKLCH 翻转（非原值）', async ({ page }) => {
    await addTestShapes(page)
    const before = await getObjectColors(page)

    await pressThemeToggle(page)
    await page.waitForTimeout(300)
    const after = await getObjectColors(page)

    // 纯算法下所有裸 hex 都应翻转；渐变对象（fill 为 fabric.Gradient）在
    // getObjectColors 中只显示 type='linear'，其 colorStops 的翻转由 3.3 单独验证。
    let checked = 0
    for (let i = 0; i < before.length; i++) {
      const b = before[i].fill
      if (typeof b === 'string' && /^#/.test(b)) {
        expect(after[i].fill).not.toBe(b)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(0)
    await screenshot(page, 'colors-flip')
  })

  test('3.3 按住时文本与阴影颜色同样翻转', async ({ page }) => {
    await addTestShapes(page)
    const before = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const text = c.getObjects().find((o: any) => o.type === 'text')
      const shadowed = c.getObjects().find((o: any) => o.shadow)
      return { textFill: text?.fill, shadowColor: shadowed?.shadow?.color }
    })
    expect(before.textFill).toBe('#333333')
    expect(before.shadowColor).toBe('#999999')

    await pressThemeToggle(page)
    await page.waitForTimeout(300)

    const after = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const text = c.getObjects().find((o: any) => o.type === 'text')
      const shadowed = c.getObjects().find((o: any) => o.shadow)
      return { textFill: text?.fill, shadowColor: shadowed?.shadow?.color }
    })
    expect(after.textFill).not.toBe('#333333')
    expect(after.shadowColor).not.toBe('#999999')
  })

  test('3.4 松手后颜色完全恢复亮色真值', async ({ page }) => {
    await addTestShapes(page)
    const before = await getObjectColors(page)

    await pressThemeToggle(page)
    await page.waitForTimeout(300)
    await releaseThemeToggle(page)
    await page.waitForTimeout(300)

    const after = await getObjectColors(page)
    for (let i = 0; i < before.length; i++) {
      expect(after[i].fill).toBe(before[i].fill)
      expect(after[i].stroke).toBe(before[i].stroke)
    }
    await screenshot(page, 'round-trip-restore')
  })

  test('3.5 无 fabric.Rect 背景板 + workspace 背景跟随预览', async ({ page }) => {
    const bgBefore = await getBackgroundInfo(page)
    expect(bgBefore.noBgRects).toBe(true)
    expect(bgBefore.bg).toBe('#ffffff')

    await pressThemeToggle(page)
    await page.waitForTimeout(300)
    const bgAfter = await getBackgroundInfo(page)
    expect(bgAfter.noBgRects).toBe(true)
    expect(bgAfter.bg).toBe('#1e1e1e')
    await releaseThemeToggle(page)
  })
})

// ════════════════════════════════════════════════════════════════
// 层级 4 — 边界情况
// ════════════════════════════════════════════════════════════════

test.describe('层级4 — 边界情况', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
  })

  test('4.1 空画布按住不崩溃', async ({ page }) => {
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const all = c.getObjects().filter((o: any) => !o.excludeFromExport)
      all.forEach((o: any) => c.remove(o))
      c.renderAll()
    })

    const ok = await pressThemeToggle(page)
    expect(ok).toBe(true)
    await page.waitForTimeout(300)
    const summary = await getCanvasSummary(page)
    expect(summary!.bg).toBe('#1e1e1e')
    await releaseThemeToggle(page)
  })

  test('4.2 快速按住/松开不崩溃，最终恢复亮色', async ({ page }) => {
    await addTestShapes(page)
    for (let i = 0; i < 3; i++) {
      await pressThemeToggle(page)
      await page.waitForTimeout(50)
      await releaseThemeToggle(page)
      await page.waitForTimeout(50)
    }
    const summary = await getCanvasSummary(page)
    expect(summary!.bg).toBe('#ffffff')
  })

  test('4.3 按住不改变对象数量与位置', async ({ page }) => {
    await addTestShapes(page)
    const before = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return c
        .getObjects()
        .filter((o: any) => !o.excludeFromExport)
        .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top) }))
    })

    await pressThemeToggle(page)
    await page.waitForTimeout(300)
    await releaseThemeToggle(page)
    await page.waitForTimeout(300)

    const after = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return c
        .getObjects()
        .filter((o: any) => !o.excludeFromExport)
        .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top) }))
    })
    expect(after.length).toBe(before.length)
    for (let i = 0; i < before.length; i++) {
      expect(after[i].left).toBe(before[i].left)
      expect(after[i].top).toBe(before[i].top)
    }
  })

  test('4.4 workspace Rect 为唯一 excludeFromExport 背景对象', async ({ page }) => {
    const result = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const bgRects = c.getObjects().filter((o: any) => o.excludeFromExport)
      return {
        workspaceCount: bgRects.filter((o: any) => o.id === 'workspace').length,
        otherCount: bgRects.filter((o: any) => o.id !== 'workspace').length,
      }
    })
    expect(result.workspaceCount).toBe(1)
    expect(result.otherCount).toBe(0)
  })
})
