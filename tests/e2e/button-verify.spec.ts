/**
 * button-verify.spec.ts — 工具栏按钮点击效果验证
 *
 * 不只检查按钮是否存在，而是真实点击按钮 + 读取 canvas 上元素坐标来验证效果。
 *
 * 用法: npx playwright test button-verify --project=chromium --timeout=120000
 */
import { test, expect } from '@playwright/test'
import { navigateAndOpenEditor } from './helpers'

const PAGE = '/java-world/04-java-network/chapter-03-socket'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', e => console.log('  ⚠️ JS Error:', e.message))
  page.on('console', msg => { if (msg.type() === 'error') console.log('  ⚠️ Console Error:', msg.text()) })
})

test('按钮效果验证：创建对象 → 选中 → 居中 → 坐标收敛验证', async ({ page }) => {
  // ═══════════════════ 1. 打开编辑器 ═══════════════════
  console.log('[1/3] 打开编辑器...')
  await navigateAndOpenEditor(page, PAGE, 1)
  await page.waitForTimeout(2000)

  // ═══════════════════ 2. 准备：找按钮 + 创建矩形 + 多选 ═══════════════════
  console.log('[2/3] 找居中按钮 → 重置坐标系 → 创建两个矩形 → 多选...')

  const btnIdx = await page.evaluate(() => {
    const btns = document.querySelectorAll('.editor-overlay button')
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute('data-tip') === '水平居中') return i
    }
    return -1
  })
  expect(btnIdx, '应能找到 data-tip="水平居中" 的按钮').toBeGreaterThanOrEqual(0)
  console.log(`  水平居中按钮 index: ${btnIdx}`)

  await page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    c.discardActiveObject()
    c.setViewportTransform([1, 0, 0, 1, 0, 0])
    c.setZoom(1)
    c.getObjects().forEach((o: any) => { if (o.type === 'rect' || o.id === '__test__') c.remove(o) })
    const R = (window as any).fabric.Rect
    const r1 = new R({ left: 100, top: 100, width: 80, height: 50, fill: '#1565C0', id: '__test__' })
    const r2 = new R({ left: 400, top: 100, width: 80, height: 50, fill: '#E53935', id: '__test__' })
    c.add(r1, r2)
    c.renderAll()
  })
  await page.waitForTimeout(200)

  const before = await page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const rects = c.getObjects().filter((o: any) => o.id === '__test__')
    return rects.map((o: any) => Math.round(o.left + o.width! * (o.scaleX || 1) / 2))
  })
  console.log(`  居中前中心X: [${before[0]}, ${before[1]}]`)
  expect(before[0]).toBeGreaterThan(0)
  expect(before[1]).toBeGreaterThan(0)

  await page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const rects = c.getObjects().filter((o: any) => o.id === '__test__')
    const sel = new (window as any).fabric.ActiveSelection([rects[0], rects[1]], { canvas: c })
    c.setActiveObject(sel)
    c.renderAll()
  })
  await page.waitForTimeout(200)

  // ═══════════════════ 3. 点击居中按钮 + 验证效果 ═══════════════════
  console.log('[3/3] 点击水平居中按钮 → 验证中心X收敛...')
  await page.locator('.editor-overlay button').nth(btnIdx!).click()
  await page.waitForTimeout(500)

  const after = await page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    const sel = c.getActiveObject()
    if (sel && sel.type === 'activeselection') sel.destroy()
    c.discardActiveObject()
    c.renderAll()
    return c.getObjects().filter((o: any) => o.id === '__test__')
      .map((o: any) => Math.round(o.left + o.width! * (o.scaleX || 1) / 2))
  })
  const diff = Math.abs(after[0] - after[1])
  const moved = before[0] !== after[0] || before[1] !== after[1]
  console.log(`  居中后中心X: [${after[0]}, ${after[1]}]  差值: ${diff}px  坐标变化: ${moved}`)

  expect(diff, `水平居中后两中心X差值应≤5px，实际=${diff}px`).toBeLessThanOrEqual(5)
  expect(moved, '居中后坐标应发生变化（证明按钮确实执行了操作）').toBe(true)

  await page.screenshot({ path: 'test-results/center-align-verified.png' })
  console.log('📸 截图: test-results/center-align-verified.png')
  console.log('✅ 水平居中按钮效果验证通过！')
})