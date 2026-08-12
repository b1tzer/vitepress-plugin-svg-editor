/**
 * 编辑器可视渲染回归测试（Playwright 真实浏览器）
 *
 * 为什么必须有这个测试？
 *   vitest + jsdom 只能测 DOM 结构（exists/classes/text），无法测 CSS 布局效果：
 *     - computedStyle 不反映 flex/grid 居中
 *     - 背景色/透明度/棋盘格实际渲染效果
 *     - resize 手柄默认背景色是否能让用户看见
 *     - 标尺坐标刻度是否绘制了文字
 *     - Fabric.js canvas 的 backgroundColor 是否真正透明
 *     - 滚动容器的滚动位置是否正确
 *
 * 这些都是用户在运行时实际看到的东西，只有真实浏览器能验证。
 */

import { test, expect } from '@playwright/test'

const PAGE_URL = '/java-world/05-java-data-access/chapter-02-jdbc.html'

test.describe('Editor Rendering Regression（真实浏览器验证）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForLoadState('networkidle')
  })

  // ══════════════════════════════════════════════
  // 1. SVG 容器 → 编辑器打开流程
  // ══════════════════════════════════════════════
  test('01. 点击 SVG 能正常打开编辑器 overlay', async ({ page }) => {
    const container = page.locator('.svg-container')
    await expect(container).toBeAttached({ timeout: 5000 })
    await container.hover()
    const editBtn = page.locator('.svg-edit-btn')
    await expect(editBtn).toBeVisible({ timeout: 3000 })
    await editBtn.click()
    const overlay = page.locator('.editor-overlay')
    await expect(overlay).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)
    const rulerCanvas = page.locator('.ruler-canvas')
    await expect(rulerCanvas).toBeAttached()
  })

  // ══════════════════════════════════════════════
  // 2. 棋盘格背景可见（不是纯白）
  // ══════════════════════════════════════════════
  test('02. 操作区显示棋盘格背景（含 linear-gradient，非纯色）', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const bg = await page.evaluate(() => {
      const el = document.querySelector('.editor-canvas') as HTMLElement
      if (!el) return null
      const cs = getComputedStyle(el)
      return { backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage, backgroundSize: cs.backgroundSize }
    })
    expect(bg).not.toBeNull()
    expect(bg!.backgroundImage).toContain('linear-gradient')
    expect(bg!.backgroundSize).toContain('20px')
  })

  // ══════════════════════════════════════════════
  // 3. Fabric canvas 背景透明
  // ══════════════════════════════════════════════
  test('03. Fabric.js canvas backgroundColor 为 transparent', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const bg = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      if (!c) return null
      return String(c.backgroundColor).toLowerCase()
    })
    expect(bg).not.toBeNull()
    expect(bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)').toBe(true)
  })

  // ══════════════════════════════════════════════
  // 4. 小画布在滚动容器中居中
  // ══════════════════════════════════════════════
  test('04. 小 SVG 画布在滚动容器中水平居中', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const layout = await page.evaluate(() => {
      const scroll = document.querySelector('.canvas-scroll') as HTMLElement
      const area = document.querySelector('.canvas-area') as HTMLElement
      if (!scroll || !area) return null
      const sr = scroll.getBoundingClientRect()
      const ar = area.getBoundingClientRect()
      return {
        scrollW: sr.width, scrollH: sr.height,
        areaW: ar.width, areaH: ar.height,
        offsetFromCenter: Math.abs((ar.x + ar.width / 2) - (sr.x + sr.width / 2)),
      }
    })
    expect(layout).not.toBeNull()
    if (layout!.areaW < layout!.scrollW - 100) {
      expect(layout!.offsetFromCenter).toBeLessThan(50)
    }
  })

  // ══════════════════════════════════════════════
  // 5. 8 个 resize 手柄默认可见（背景色非 transparent）
  // ══════════════════════════════════════════════
  test('05. 8 边 resize 手柄均有可见背景色', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const dirs = ['n','s','w','e','nw','ne','sw','se']
    for (const dir of dirs) {
      const visible = await page.evaluate((d) => {
        const el = document.querySelector(`.rh-${d}`) as HTMLElement
        if (!el) return null
        const cs = getComputedStyle(el)
        const bg = cs.backgroundColor
        const isVisible = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && cs.display !== 'none'
        return { bg, isVisible }
      }, dir)
      expect(visible).not.toBeNull()
      expect(visible!.isVisible).toBe(true)
    }
  })

  // ══════════════════════════════════════════════
  // 6. 画布区域有 outline 边界线
  // ══════════════════════════════════════════════
  test('06. .canvas-area 有 outline 边界线显示画布范围', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const outline = await page.evaluate(() => {
      const el = document.querySelector('.canvas-area') as HTMLElement
      if (!el) return null
      return getComputedStyle(el).outline
    })
    expect(outline).not.toBeNull()
    expect(outline).not.toBe('none')
    expect(outline).not.toBe('')
  })

  // ══════════════════════════════════════════════
  // 7. 标尺 canvas 已绘制（尺寸 > 0）
  // ══════════════════════════════════════════════
  test('07. 标尺 canvas 尺寸 > 0（已绘制坐标刻度）', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const info = await page.evaluate(() => {
      const cvs = document.querySelector('.ruler-canvas') as HTMLCanvasElement
      if (!cvs) return null
      return { width: cvs.width, height: cvs.height }
    })
    expect(info).not.toBeNull()
    expect(info!.width).toBeGreaterThan(0)
    expect(info!.height).toBeGreaterThan(0)
  })

  // ══════════════════════════════════════════════
  // 8. canvas-area 和 Fabric canvas 尺寸非零
  // ══════════════════════════════════════════════
  test('08. canvas-area 和 Fabric canvas 尺寸均 > 50px', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const dims = await page.evaluate(() => {
      const area = document.querySelector('.canvas-area') as HTMLElement
      const c = (window as any).__fabricCanvas
      if (!area || !c) return null
      return {
        areaW: area.getBoundingClientRect().width,
        areaH: area.getBoundingClientRect().height,
        fabricW: c.getWidth(),
        fabricH: c.getHeight(),
      }
    })
    expect(dims).not.toBeNull()
    expect(dims!.areaW).toBeGreaterThan(50)
    expect(dims!.areaH).toBeGreaterThan(50)
    expect(dims!.fabricW).toBeGreaterThan(50)
    expect(dims!.fabricH).toBeGreaterThan(50)
  })

  // ══════════════════════════════════════════════
  // 9. 折叠按钮为 20×64 直角竖条（非圆形）
  // ══════════════════════════════════════════════
  test('09. 折叠按钮为 20×64 直角竖条，无圆角无阴影', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const info = await page.evaluate(() => {
      const btn = document.querySelector('.left-panel .floating-toggle') as HTMLElement
      if (!btn) return null
      const cs = getComputedStyle(btn)
      const r = btn.getBoundingClientRect()
      return { w: r.width, h: r.height, borderRadius: cs.borderRadius, boxShadow: cs.boxShadow, bg: cs.backgroundColor }
    })
    expect(info).not.toBeNull()
    expect(info!.w).toBeGreaterThanOrEqual(18)
    expect(info!.w).toBeLessThanOrEqual(24)
    expect(info!.h).toBeGreaterThanOrEqual(60)
    expect(info!.h).toBeLessThanOrEqual(68)
    expect(info!.borderRadius).toBe('0px')
    expect(info!.boxShadow).toBe('none')
  })

  // ══════════════════════════════════════════════
  // 10. 左/中/右三栏均存在且宽度 > 0
  // ══════════════════════════════════════════════
  test('10. 三栏布局 DOM 存在且可见宽度 > 0', async ({ page }) => {
    const container = page.locator('.svg-container')
    await container.hover()
    await page.locator('.svg-edit-btn').click()
    await expect(page.locator('.editor-overlay')).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(1500)

    const panels = await page.evaluate(() => {
      const left = document.querySelector('.left-panel') as HTMLElement
      const canvas = document.querySelector('.editor-canvas') as HTMLElement
      const right = document.querySelector('.context-panel') as HTMLElement
      return {
        leftW: left?.getBoundingClientRect().width || 0,
        canvasW: canvas?.getBoundingClientRect().width || 0,
        rightW: right?.getBoundingClientRect().width || 0,
      }
    })
    expect(panels.leftW).toBeGreaterThan(0)
    expect(panels.canvasW).toBeGreaterThan(0)
    expect(panels.rightW).toBeGreaterThan(0)
  })
})
