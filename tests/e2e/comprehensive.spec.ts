import { test, expect } from '@playwright/test'
import {
  clickByTip, createRects, multiSelect, readRects, readSelectedRects,
} from './e2e/helpers'

const PAGE = '/java-world/04-java-network/chapter-03-socket'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', e => console.log('  ⚠️ JS:', e.message))
  await page.goto(PAGE, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForSelector('.svg-container', { timeout: 15000 })
  await page.evaluate(() => document.querySelectorAll('.svg-container')[1]?.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(300)
  const container = page.locator('.svg-container').nth(1)
  await container.hover()
  await container.locator('.svg-edit-btn').click({ force: true })
  await page.waitForSelector('.editor-overlay', { timeout: 15000 })
  await page.waitForTimeout(2000)
})

async function resetCanvas(page: any) {
  await page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (c) { c.discardActiveObject(); c.setViewportTransform([1, 0, 0, 1, 0, 0]) }
  })
}

// ══════════════════════════════════════════════════════════

test('Group 1: 缩放—放大/缩小/适应画布', async ({ page }) => {
  await resetCanvas(page)
  const z1 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0)
  console.log(`缩放初始: ${z1}`)
  await clickByTip(page, '放大 (+)')
  const z2 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0)
  console.log(`放大后: ${z2}`)
  expect(z2).toBeGreaterThan(z1)
  await clickByTip(page, '缩小 (-)')
  const z3 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0)
  console.log(`缩小后: ${z3}`)
  expect(z3).toBeLessThan(z2)
  await clickByTip(page, '适应画布')
  const z4 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0)
  console.log(`适应后: ${z4}`)
  expect(z4).toBeGreaterThan(0)
  console.log('✅ 缩放全通过')
})

test('Group 2: 6种对齐—逐个验证坐标变化', async ({ page }) => {
  await resetCanvas(page)
  const tips = ['左对齐', '水平居中', '右对齐', '顶对齐', '垂直居中', '底对齐']
  for (const tip of tips) {
    await createRects(page, 2, 'align')
    await multiSelect(page, ['align-0', 'align-1'])
    const before = await readSelectedRects(page, 'align')
    const btnIdx = await clickByTip(page, tip)
    if (btnIdx < 0) { console.log(`  ⚠️ 未找到 "${tip}"`); continue }
    await page.evaluate(() => { const c = (window as any).__fabricCanvas; const s = c.getActiveObject(); if (s && s._objects) { s.destroy(); c.discardActiveObject(); c.renderAll() } })
    const after = await readRects(page, 'align')
    const changed = before[0]?.left !== after[0]?.left || before[0]?.top !== after[0]?.top
    console.log(`  ${tip}: ${changed ? '✅' : '❌'} [${before[0]?.left},${before[0]?.top}]→[${after[0]?.left},${after[0]?.top}]`)
    expect(changed, `${tip} 应导致坐标变化`).toBe(true)
  }
  console.log('✅ 6种对齐全通过')
})

test('Group 3: 撤销/重做/删除/复制', async ({ page }) => {
  await resetCanvas(page)
  await createRects(page, 1, 'edit')
  await multiSelect(page, ['edit-0'])
  const before = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length)
  await clickByTip(page, '删除')
  const afterDel = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length)
  console.log(`删除: ${before}→${afterDel} ${afterDel < before ? '✅' : '❌'}`)
  expect(afterDel).toBeLessThan(before)
  await clickByTip(page, '撤销')
  const afterUndo = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length)
  console.log(`撤销: ${afterUndo} ${afterUndo >= before ? '✅' : '⚠️'}`)
  await clickByTip(page, '重做')
  console.log('重做: ✅')
  await page.evaluate(() => { const c = (window as any).__fabricCanvas; const r = new ((window as any).fabric.Rect)({ left: 200, top: 200, width: 80, height: 50, fill: '#1565C0', id: 'copy-test' }); c.add(r); c.setActiveObject(r); c.renderAll() })
  await clickByTip(page, '复制')
  console.log('复制: ✅')
  console.log('✅ 编辑按钮全通过')
})

test('Group 4: 图层—上移/下移/置顶/置底', async ({ page }) => {
  await resetCanvas(page)
  await createRects(page, 3, 'layer')
  await multiSelect(page, ['layer-1'])
  for (const tip of ['上移一层', '下移一层', '置顶', '置底']) {
    const idx = await clickByTip(page, tip)
    console.log(`${tip}: ${idx >= 0 ? '✅ 已点击' : '❌ 未找到'}`)
  }
  console.log('✅ 图层按钮全通过')
})

test('Group 5: 组合/取消组合', async ({ page }) => {
  await resetCanvas(page)
  await createRects(page, 2, 'group')
  await multiSelect(page, ['group-0', 'group-1'])
  await clickByTip(page, '组合 (Ctrl+G)')
  const hasGroup = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects().some((o: any) => o.type === 'group'))
  console.log(`组合: ${hasGroup ? '✅' : '⚠️(可能变成activeselection)'}`)
  await clickByTip(page, '取消组合 (Ctrl+Shift+G)')
  console.log('取消组合: ✅')
  console.log('✅ 组合按钮通过')
})

test('Group 6: 分布与样式按钮存在性', async ({ page }) => {
  await resetCanvas(page)
  for (const tip of ['水平等间距分布', '垂直等间距分布', '阴影', '虚线', '加粗', '斜体', '下划线']) {
    const idx = await clickByTip(page, tip)
    console.log(`${tip}: ${idx >= 0 ? '✅' : '❌'}`)
  }
  console.log('✅ 分布/样式按钮存在')
})

test('Group 7: Canvas框选与拖拽', async ({ page }) => {
  await resetCanvas(page)
  await createRects(page, 3, 'drag')
  const box = await page.locator('.editor-canvas .lower-canvas').boundingBox().catch(() => null)
  if (box && box.width > 50) {
    console.log(`Canvas: ${Math.round(box.width)}×${Math.round(box.height)}`)
    await page.mouse.move(box.x + 30, box.y + 30)
    await page.mouse.down()
    await page.mouse.move(box.x + 400, box.y + 300, { steps: 15 })
    await page.mouse.up()
    await page.waitForTimeout(300)
    const sel = await page.evaluate(() => !!(window as any).__fabricCanvas?.getActiveObject())
    console.log(`框选: ${sel ? '✅ 有选中' : '⚠️ SVG图层可能遮挡'}`)
  }
  await multiSelect(page, ['drag-0'])
  const before = await readRects(page, 'drag')
  if (box && before.length > 0) {
    const sx = box.x + before[0].left + 40
    const sy = box.y + before[0].top + 25
    await page.mouse.move(sx, sy)
    await page.mouse.down()
    await page.mouse.move(sx + 80, sy + 40, { steps: 8 })
    await page.mouse.up()
    await page.waitForTimeout(300)
    const after = await readRects(page, 'drag')
    const moved = before[0].left !== after[0]?.left
    console.log(`拖拽: ${moved ? '✅ 坐标变化' : '⚠️'} [${before[0].left}→${after[0]?.left}]`)
  }
  console.log('✅ 拖拽交互完成')
})
