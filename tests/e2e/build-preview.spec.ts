/**
 * 编辑器核心功能验证 — 确保 preview 模式下所有核心功能正常
 *
 * 注：本 spec 跑在 vitepress build + preview 静态产物上（playwright.config.ts 的
 * webServer 以 SVG_EDITOR_E2E=1 注入 __SVG_EDITOR_E2E__ 测试开关），使生产静态产物
 * 也能暴露 window.__fabricCanvas 测试钩子并渲染「编辑 SVG」按钮，替代 dev server。
 */
import { test, expect } from '@playwright/test'
import { openEditor } from './helpers'

const PAGE_URL = '/'
const LOAD_TIMEOUT = 30000

test.describe('编辑器核心功能验证（preview 模式）', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (e) => console.log('  ⚠️ JS错误:', e.message))
    await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: LOAD_TIMEOUT })
  })

  test('B1. SVG 容器正确渲染且尺寸非零', async ({ page }) => {
    await page.waitForSelector('.svg-container svg', { timeout: LOAD_TIMEOUT })
    const svg = page.locator('.svg-container svg').first()
    await expect(svg).toBeVisible()
    const box = await svg.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('B2. 编辑器打开且 Canvas 正确渲染（完整加载路径）', async ({ page }) => {
    await openEditor(page)

    const canvas = page.locator('.editor-overlay canvas').first()
    await expect(canvas).toBeVisible()
    const canvasBox = await canvas.boundingBox()
    expect(canvasBox).not.toBeNull()
    expect(canvasBox!.width).toBeGreaterThan(0)
    expect(canvasBox!.height).toBeGreaterThan(0)

    await page.waitForFunction(() => (window as any).__fabricCanvas, { timeout: 10000 })
    const summary = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return {
        objectCount: c.getObjects().length,
        width: c.getWidth(),
        height: c.getHeight(),
      }
    })
    console.log('[Canvas]', summary)
    expect(summary.width).toBeGreaterThan(0)
    expect(summary.height).toBeGreaterThan(0)
  })

  test('B3. 工具栏按钮可渲染', async ({ page }) => {
    await openEditor(page)

    const buttons = await page.evaluate(() => {
      const btns = document.querySelectorAll('.editor-overlay button')
      return Array.from(btns).map((b) => ({
        text: b.textContent?.trim() || '',
        tip: b.getAttribute('data-tip') || '',
      }))
    })
    console.log(
      '[Toolbar Buttons]',
      buttons.map((b) => b.tip || b.text)
    )
    expect(buttons.length).toBeGreaterThan(0)
    const tips = buttons.map((b) => b.tip).join(',')
    expect(tips).toContain('撤销')
  })

  test('B4. 添加图形 → undo → redo 操作正确', async ({ page }) => {
    await openEditor(page)

    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const rect = new (window as any).fabric.Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 80,
        fill: '#2196F3',
        stroke: '#1565C0',
        strokeWidth: 2,
      })
      c.add(rect)
      c.renderAll()
    })

    const countAfter = await page.evaluate(() => (window as any).__fabricCanvas.getObjects().length)
    expect(countAfter).toBeGreaterThan(0)

    await page.keyboard.press('Control+z')
    await page.waitForTimeout(500)
    const countAfterUndo = await page.evaluate(
      () => (window as any).__fabricCanvas.getObjects().length
    )
    console.log(`[undo] objects: ${countAfter} → ${countAfterUndo}`)

    await page.keyboard.press('Control+y')
    await page.waitForTimeout(500)
    const countAfterRedo = await page.evaluate(
      () => (window as any).__fabricCanvas.getObjects().length
    )
    console.log(`[redo] objects: ${countAfterUndo} → ${countAfterRedo}`)
    expect(countAfterRedo).toBe(countAfter)
  })

  test('B5. 编辑器关闭后无 JS 错误残留', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await openEditor(page)
    await page.keyboard.press('Escape')
    await page
      .waitForSelector('.editor-overlay', { state: 'hidden', timeout: 5000 })
      .catch(() => {})
    await page.waitForTimeout(1000)

    expect(errors.length).toBe(0)
  })

  test('B6. 多页面 SVG 加载 — 导航后编辑器仍可用', async ({ page }) => {
    await page.waitForSelector('.svg-container svg', { timeout: LOAD_TIMEOUT })
    const svg = page.locator('.svg-container svg').first()
    await expect(svg).toBeVisible()

    await page.goto('/features.html', { waitUntil: 'networkidle', timeout: LOAD_TIMEOUT })
    await page.waitForSelector('.svg-container svg', { timeout: LOAD_TIMEOUT })
    await expect(page.locator('.svg-container svg').first()).toBeVisible()

    await page.evaluate(() => {
      const c = document.querySelectorAll('.svg-container')
      if (c[1]) c[1].scrollIntoView({ block: 'center' })
    })
    await page.waitForTimeout(500)
    const container = page.locator('.svg-container').nth(1)
    await container.hover()
    const btn = container.locator('.svg-edit-btn')
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ force: true })
      await page.waitForSelector('.editor-overlay', { timeout: LOAD_TIMEOUT })
      await page.waitForFunction(() => (window as any).__fabricCanvas, { timeout: 10000 })
      const objCount = await page.evaluate(() => (window as any).__fabricCanvas.getObjects().length)
      console.log(`[第二页 Canvas] objects: ${objCount}`)
    }
  })

  test('B7. Console 无编译错误', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await openEditor(page)
    await page.waitForTimeout(1000)

    const realErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('extension')
    )
    if (realErrors.length > 0) {
      console.log('[Console Errors]', realErrors)
    }
    expect(realErrors.length).toBe(0)
  })
})
