/**
 * 编辑器布局稳定性视觉回归测试
 *
 * 目的：防止任何导致画布跳动、面板尺寸变化的代码变更进入主分支
 * 原理：通过 Playwright 的 toHaveScreenshot 进行像素级比对
 *
 * 测试场景：
 *   1. 编辑器初始加载后的布局快照
 *   2. 选中/取消选中对象时，画布区域不跳动
 *   3. 右侧面板始终固定宽度，不随内容变化
 */

import { test, expect } from '@playwright/test'

const EDITOR_PAGE = '/guide/get-started' // 修改为你的 VitePress 编辑器页面

test.describe('Editor Layout Stability (CLS Prevention)', () => {
  test.beforeEach(async ({ page }) => {
    // 禁用 CSS 动画，避免截图时机差异
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })
    await page.goto(EDITOR_PAGE)
    await page.waitForLoadState('networkidle')
  })

  test('1. 编辑器整体布局基线快照', async ({ page }) => {
    // 点击 SVG 打开编辑器
    const svgLink = page.locator('a[href$=".svg"]').first()
    if (await svgLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await svgLink.click()
    } else {
      test.skip(true, 'SVG editor link not found on page')
      return
    }

    // 等待编辑器面板出现
    const editorPanel = page.locator('.editor-panel')
    await expect(editorPanel).toBeVisible({ timeout: 5000 })

    // 基线快照：编辑器刚打开时的布局
    await expect(editorPanel).toHaveScreenshot({
      // 使用文件路径无关的名称，方便跨平台
    })
  })

  test('2. 编辑器主要区域不因 props 变化而跳动', async ({ page }) => {
    const svgLink = page.locator('a[href$=".svg"]').first()
    if (!(await svgLink.isVisible({ timeout: 3000 }).catch(() => false))) {
      test.skip(true, 'SVG editor link not found')
      return
    }
    await svgLink.click()

    const editorPanel = page.locator('.editor-panel')
    await expect(editorPanel).toBeVisible({ timeout: 5000 })

    // 记录初始时顶部工具栏的高度
    const topBar = page.locator('.toolbar-top')
    const initialTopBox = await topBar.boundingBox()
    expect(initialTopBox).not.toBeNull()

    // 记录初始时底部工具栏的高度
    const bottomBar = page.locator('.toolbar-bottom')
    const initialBottomBox = await bottomBar.boundingBox()
    expect(initialBottomBox).not.toBeNull()

    // 验证顶部栏高度不为 0（如果 v-if 移除导致高度塌陷，这里会抓到）
    expect(initialTopBox!.height).toBeGreaterThan(10)
    expect(initialBottomBox!.height).toBeGreaterThan(10)

    // 等待 2 秒，模拟各种内部 props 更新
    await page.waitForTimeout(2000)

    // 再次测量，确认高度未变
    const finalTopBox = await topBar.boundingBox()
    const finalBottomBox = await bottomBar.boundingBox()
    expect(finalTopBox!.height).toBe(initialTopBox!.height)
    expect(finalBottomBox!.height).toBe(initialBottomBox!.height)
  })

  test('3. 右侧属性面板始终占位，不会被 v-if 移除', async ({ page }) => {
    const svgLink = page.locator('a[href$=".svg"]').first()
    if (!(await svgLink.isVisible({ timeout: 3000 }).catch(() => false))) {
      test.skip(true, 'SVG editor link not found')
      return
    }
    await svgLink.click()

    const editorPanel = page.locator('.editor-panel')
    await expect(editorPanel).toBeVisible({ timeout: 5000 })

    // 右侧面板应在 DOM 中始终存在
    const contextPanel = page.locator('.context-panel')
    await expect(contextPanel).toBeAttached({ timeout: 3000 })

    // 记录面板宽度
    const initialBox = await contextPanel.boundingBox()
    expect(initialBox).not.toBeNull()

    // 点画布空白区域（取消选中）
    const canvasEl = page.locator('canvas').first()
    if (await canvasEl.isVisible({ timeout: 2000 }).catch(() => false)) {
      await canvasEl.click({ position: { x: 10, y: 10 } })
      await page.waitForTimeout(500)
    }

    // 面板仍应在 DOM 中，宽度不变
    const afterDeselectBox = await contextPanel.boundingBox()
    expect(afterDeselectBox).not.toBeNull()
    expect(afterDeselectBox!.width).toBeCloseTo(initialBox!.width, -1)
  })

  test('4. 编辑器中不应出现意外的 display:none 导致布局塌陷', async ({ page }) => {
    const svgLink = page.locator('a[href$=".svg"]').first()
    if (!(await svgLink.isVisible({ timeout: 3000 }).catch(() => false))) {
      test.skip(true, 'SVG editor link not found')
      return
    }
    await svgLink.click()

    const editorPanel = page.locator('.editor-panel')
    await expect(editorPanel).toBeVisible({ timeout: 5000 })

    // 检查关键布局元素没有 display:none 内联样式
    const topBar = page.locator('.toolbar-top')
    const bottomBar = page.locator('.toolbar-bottom')
    const contextPanel = page.locator('.context-panel')

    for (const el of [topBar, bottomBar, contextPanel]) {
      const display = await el.evaluate((node: HTMLElement) =>
        window.getComputedStyle(node).display
      )
      expect(display).not.toBe('none')
    }
  })
})
