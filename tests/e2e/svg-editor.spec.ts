import { test, expect } from '@playwright/test'
import { openEditor } from './helpers'

const PAGE_URL = '/'
const SVG_IDX = 1

test.describe('SvgEditor UI 运行时验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForSelector('.VPContent', { timeout: 15000 })
    await page.waitForSelector('.svg-container svg', { timeout: 15000 })
    await page.evaluate(() => {
      const containers = document.querySelectorAll('.svg-container')
      if (containers[1]) containers[1].scrollIntoView({ block: 'center' })
    })
    await page.waitForTimeout(500)
  })

  test('1. SVG 图表正确渲染（尺寸不为 0）', async ({ page }) => {
    const svg = page.locator('.svg-container svg').first()
    await expect(svg).toBeVisible()
    const box = await svg.boundingBox()
    console.log(`[SVG 尺寸] width=${box?.width}, height=${box?.height}`)
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('2. 悬浮显示编辑按钮', async ({ page }) => {
    const container = page.locator('.svg-container').nth(SVG_IDX)
    await container.hover()
    const btn = container.locator('.svg-edit-btn')
    await expect(btn).toBeVisible({ timeout: 5000 })
    const text = await btn.textContent()
    console.log(`[编辑按钮] text="${text}"`)
    expect(text).toContain('编辑 SVG')
  })

  test('3. 点击编辑按钮打开编辑器弹窗', async ({ page }) => {
    await openEditor(page, SVG_IDX)
    const editor = page.locator('.editor-overlay')
    await expect(editor).toBeVisible({ timeout: 10000 })
    console.log('[编辑器] 弹窗已打开')
  })

  test('4. 编辑器工具栏按钮完整', async ({ page }) => {
    await openEditor(page, SVG_IDX)
    const toolbar = page.locator('.editor-toolbar')
    await expect(toolbar).toBeVisible()

    const buttons = toolbar.locator('button')
    const count = await buttons.count()
    console.log(`[工具栏] 按钮总数: ${count}`)

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i)
      const title = await btn.getAttribute('title') || ''
      const text = await btn.textContent()
      console.log(`  按钮 ${i}: title="${title}", text="${text?.trim()}"`)
    }

    const expectedTips = ['撤销 Ctrl+Z', '重做 Ctrl+Y', '复制 Ctrl+C', '粘贴 Ctrl+V', '删除 Delete', '适应画布 Ctrl+0']
    for (const t of expectedTips) {
      const btn = toolbar.locator(`button[data-tip="${t}"]`)
      const exists = await btn.count()
      console.log(`[按钮检查] "${t}": ${exists > 0 ? '✅' : '❌'}`)
      expect(exists).toBeGreaterThan(0)
    }
    const saveBtn = toolbar.locator('button[data-tip*="保存"]')
    expect(await saveBtn.count()).toBeGreaterThan(0)
    console.log(`[按钮检查] "保存": ✅ (partial match)`)
  })

  test('5. 画布正确初始化', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    const canvas = page.locator('.editor-canvas canvas').first()
    await expect(canvas).toBeVisible()

    const box = await canvas.boundingBox()
    console.log(`[画布] width=${box?.width}, height=${box?.height}`)
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('6. 缩放级别显示', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    const zoomInfo = page.locator('.editor-toolbar .zoom-badge').first()
    const text = await zoomInfo.textContent()
    console.log(`[缩放] 当前级别: ${text}`)
    expect(text).toMatch(/\d+%/)
  })

  test('7. 关闭编辑器', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    const closeBtn = page.locator('.editor-toolbar button').last()
    await closeBtn.click()

    const editor = page.locator('.editor-overlay')
    await expect(editor).not.toBeVisible({ timeout: 5000 })
    console.log('[关闭] 编辑器已关闭')
  })

  test('8. Escape 键关闭编辑器', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    await page.keyboard.press('Escape')

    const editor = page.locator('.editor-overlay')
    await expect(editor).not.toBeVisible({ timeout: 5000 })
    console.log('[Escape] 编辑器已关闭')
  })

  test('9. 颜色选择器存在', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    // 选中一个非文本对象，使属性面板显示「填充/边框」颜色选择器
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getObjects().find((o: any) => o.type !== 'text' && o.type !== 'i-text' && o.type !== 'textbox')
      if (obj) { c.setActiveObject(obj); c.renderAll() }
    })

    const colorInputs = page.locator('.context-panel input[type="color"]')
    const count = await colorInputs.count()
    console.log(`[颜色] 选择器数量: ${count}`)
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('10. 对齐按钮组完整', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    // 选中对象，使属性面板显示对齐按钮
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getObjects().find((o: any) => o.type !== 'text' && o.type !== 'i-text' && o.type !== 'textbox')
      if (obj) { c.setActiveObject(obj); c.renderAll() }
    })

    const alignTips = ['左对齐', '水平居中', '右对齐', '顶对齐', '垂直居中', '底对齐']
    for (const tip of alignTips) {
      const btn = page.locator(`.context-panel button[data-tip="${tip}"]`)
      await expect(btn).toBeVisible()
      console.log(`[对齐] "${tip}": ✅`)
    }
  })
})
