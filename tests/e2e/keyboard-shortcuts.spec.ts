/**
 * 快捷键 E2E 测试 — F14
 *
 * 验证所有核心快捷键：Ctrl+Z/Y/S/A/Delete/
 */

import { test, expect } from '@playwright/test'
import {
  openEditor,
  addRect,
  addText,
  addCircle,
  selectAll,
  undo,
  redo,
  getCanvasSummary,
} from './helpers'

// ═══════════════════ 配置 ═══════════════════
const EDITOR_URL = '/'
const SVG_IDX = 1

// ═══════════════════ Tests ═══════════════════

test.describe('快捷键', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (e) => console.log('  ⚠️ JS:', e.message))
    // 拦截保存端点：避免测试真实写回样例 SVG 文件（污染源码），返回内存 mock 响应
    await page.route('**/__svg-save__', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, file: '/__mock__/test.svg' }),
      })
    })
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })
    await openEditor(page, SVG_IDX)
  })

  test('K1: Ctrl+A 全选 — 应选中所有对象', async ({ page }) => {
    await addRect(page, { left: 50, top: 50, width: 80, height: 60 })
    await addCircle(page, { left: 200, top: 100, fill: '#4CAF50' })
    await addText(page, 'Hello', { left: 350, top: 80, fontSize: 24 })

    await page.keyboard.press('Control+a')
    await page.waitForTimeout(300)

    // 验证 ActiveSelection 存在
    const hasActiveSelection = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj && (obj.type === 'activeSelection' || obj.type === 'activeselection')
    })
    expect(hasActiveSelection).toBe(true)
  })

  test('K2: Ctrl+Z 撤销 / Ctrl+Y 重做', async ({ page }) => {
    // 添加 3 个对象
    await addRect(page, { left: 50, top: 50, width: 80, height: 60 })
    const before = await getCanvasSummary(page)
    expect(before.objectCount).toBeGreaterThanOrEqual(1)

    // Ctrl+Z 撤销
    await page.keyboard.press('Control+z')
    await page.waitForTimeout(300)
    const afterUndo = await getCanvasSummary(page)
    // 撤销后对象数应减少
    expect(afterUndo.objectCount).toBeLessThanOrEqual(before.objectCount - 1)

    // Ctrl+Y 重做
    await page.keyboard.press('Control+y')
    await page.waitForTimeout(300)
    const afterRedo = await getCanvasSummary(page)
    expect(afterRedo.objectCount).toBe(before.objectCount)
  })

  test('K3: Delete/Del 删除选中对象', async ({ page }) => {
    await addRect(page, { left: 50, top: 50, width: 80, height: 60, fill: '#2196F3' })
    const before = await getCanvasSummary(page)

    // 选中并删除
    await page.keyboard.press('Control+a')
    await page.waitForTimeout(200)
    await page.keyboard.press('Delete')
    await page.waitForTimeout(300)

    const after = await getCanvasSummary(page)
    expect(after.objectCount).toBeLessThan(before.objectCount)
  })

  test('K4: Ctrl+S 保存（不报错即可）', async ({ page }) => {
    await addRect(page, { left: 50, top: 50, width: 80, height: 60 })

    // Ctrl+S 不应抛异常
    await page.keyboard.press('Control+s')
    await page.waitForTimeout(500)

    // 验证没有弹 error
    const errors = await page.evaluate(() => {
      return (window as any).__test_errors || []
    })
    expect(errors.length).toBe(0)
  })

  test('K5: Ctrl+C/V 复制粘贴', async ({ page }) => {
    // 添加并选中一个矩形
    await addRect(page, { left: 100, top: 100, width: 80, height: 60, fill: '#F44336' })
    const before = await getCanvasSummary(page)

    // 全选 + 复制 + 粘贴
    await page.keyboard.press('Control+a')
    await page.waitForTimeout(100)
    await page.keyboard.press('Control+c')
    await page.waitForTimeout(100)
    await page.keyboard.press('Control+v')
    await page.waitForTimeout(500)

    const after = await getCanvasSummary(page)
    // 粘贴后对象数应增加
    expect(after.objectCount).toBeGreaterThan(before.objectCount)
  })

  test('K6: Escape 关闭编辑器', async ({ page }) => {
    await addRect(page, { left: 50, top: 50, width: 80, height: 60 })

    // Escape 在 SvgEditor.vue 中绑定 @keydown.escape="emit('close')"，语义为关闭编辑器
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const editorClosed = await page.evaluate(() => !document.querySelector('.editor-overlay'))
    expect(editorClosed).toBe(true)
  })
})
