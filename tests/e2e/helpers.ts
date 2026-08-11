/**
 * E2E 测试辅助函数
 *
 * 为 Playwright E2E 测试提供可复用的操作封装。
 */

import type { Page, JSHandle } from '@playwright/test'

/**
 * 打开编辑器：从 hover SVG 容器到点击"编辑 SVG"按钮，等待 Canvas 渲染完成
 */
export async function openEditor(page: Page, svgIndex = 0): Promise<void> {
  const container = page.locator('.svg-container').nth(svgIndex)
  await container.hover()
  await container.locator('.svg-edit-btn').click({ force: true })
  await page.waitForSelector('.editor-overlay')
  // 等待 loading 消失
  await page.waitForFunction(() => {
    const loading = document.querySelector('.loading')
    return !loading || loading.textContent === ''
  }, { timeout: 10000 })
}

/**
 * 等待编辑器完全关闭
 */
export async function waitForEditorClose(page: Page): Promise<void> {
  await page.waitForSelector('.editor-overlay', { state: 'hidden', timeout: 5000 })
}

/**
 * 获取 Fabric.js Canvas 实例（通过 window.__fabricCanvas）
 */
export async function getCanvas(page: Page): Promise<JSHandle> {
  return page.evaluateHandle(() => (window as any).__fabricCanvas)
}

/**
 * 截图并保存
 */
export async function screenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `tests/screenshots/${name}.png`,
    fullPage: false,
  })
}

/**
 * 触发快捷键
 */
export async function pressShortcut(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key)
  await page.waitForTimeout(200)
}

/**
 * 获取对象状态（位置、大小）
 */
export async function getObjectState(page: Page): Promise<object> {
  return page.evaluate(() => {
    const canvas = (window as any).__fabricCanvas
    if (!canvas) return null
    const obj = canvas.getActiveObject()
    if (!obj) return null
    return {
      left: obj.left,
      top: obj.top,
      width: obj.width,
      height: obj.height,
      fill: obj.fill,
      stroke: obj.stroke,
      angle: obj.angle || 0,
    }
  })
}
