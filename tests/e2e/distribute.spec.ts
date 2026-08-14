/**
 * 等间距分布 E2E 测试 — F12
 *
 * 验证水平等距 / 垂直等距功能。
 */

import { test, expect } from '@playwright/test'
import { openEditor, addRect, selectObject, getObjectState, screenshotCanvas } from './helpers'

// ═══════════════════ 配置 ═══════════════════
const EDITOR_URL = '/'
const SVG_IDX = 1

// ═══════════════════ 辅助函数 ═══════════════════

async function addThreeRects(page: any) {
  // 创建 3 个水平排列但间距不等的矩形
  await addRect(page, { left: 50, top: 150, width: 80, height: 60, fill: '#2196F3' })
  await addRect(page, { left: 200, top: 150, width: 80, height: 60, fill: '#4CAF50' })
  await addRect(page, { left: 500, top: 150, width: 80, height: 60, fill: '#FF9800' })
}

async function multiSelectAll(page: any) {
  // 通过 Ctrl+A 全选（3 个矩形）
  await page.keyboard.press('Control+a')
  await page.waitForTimeout(300)
}

async function getDistributeState(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    return c.getObjects().map((o: any, i: number) => ({
      index: i,
      left: Math.round(o.left),
      top: Math.round(o.top),
      width: Math.round(o.width * (o.scaleX || 1)),
      height: Math.round(o.height * (o.scaleY || 1)),
    }))
  })
}

// ═══════════════════ Tests ═══════════════════

test.describe('等间距分布', () => {

  test.beforeEach(async ({ page }) => {
    page.on('pageerror', e => console.log('  ⚠️ JS:', e.message))
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })
    await openEditor(page, SVG_IDX)
  })

  test('D1: 水平等距 — 3 个矩形间距应相等', async ({ page }) => {
    await addThreeRects(page)
    const before = await getDistributeState(page)
    // 验证 3 个对象都存在
    expect(before.length).toBeGreaterThanOrEqual(3)

    await multiSelectAll(page)

    // 找到水平等距按钮并点击
    const btnIdx = await page.evaluate(() => {
      const btns = document.querySelectorAll('.editor-overlay button')
      for (let i = 0; i < btns.length; i++) {
        const tip = btns[i].getAttribute('data-tip') || btns[i].textContent || ''
        if (tip.includes('水平等距') || tip.includes('水平分布')) return i
      }
      return -1
    })

    if (btnIdx >= 0) {
      await page.locator('.editor-overlay button').nth(btnIdx).click()
      await page.waitForTimeout(500)
    }

    const after = await getDistributeState(page)
    // 计算相邻对象间距是否相等
    const sorted = after.sort((a: any, b: any) => a.left - b.left)
    if (sorted.length >= 3) {
      const gap1 = sorted[1].left - sorted[0].left - sorted[0].width
      const gap2 = sorted[2].left - sorted[1].left - sorted[1].width
      console.log(`  间距: ${gap1} vs ${gap2}`)
      expect(Math.abs(gap1 - gap2)).toBeLessThan(5)
    }

    await screenshotCanvas(page, 'distribute-horizontal')
  })

  test('D2: 垂直等距 — 3 个矩形间距应相等', async ({ page }) => {
    // 创建 3 个垂直排列但间距不等的矩形
    await addRect(page, { left: 200, top: 50, width: 80, height: 40, fill: '#2196F3' })
    await addRect(page, { left: 200, top: 200, width: 80, height: 40, fill: '#4CAF50' })
    await addRect(page, { left: 200, top: 500, width: 80, height: 40, fill: '#FF9800' })

    await multiSelectAll(page)

    // 找到垂直等距按钮并点击
    const btnIdx = await page.evaluate(() => {
      const btns = document.querySelectorAll('.editor-overlay button')
      for (let i = 0; i < btns.length; i++) {
        const tip = btns[i].getAttribute('data-tip') || btns[i].textContent || ''
        if (tip.includes('垂直等距') || tip.includes('垂直分布')) return i
      }
      return -1
    })

    if (btnIdx >= 0) {
      await page.locator('.editor-overlay button').nth(btnIdx).click()
      await page.waitForTimeout(500)
    }

    const after = await getDistributeState(page)
    const sorted = after.sort((a: any, b: any) => a.top - b.top)
    if (sorted.length >= 3) {
      const gap1 = sorted[1].top - sorted[0].top - sorted[0].height
      const gap2 = sorted[2].top - sorted[1].top - sorted[1].height
      console.log(`  间距: ${gap1} vs ${gap2}`)
      expect(Math.abs(gap1 - gap2)).toBeLessThan(5)
    }

    await screenshotCanvas(page, 'distribute-vertical')
  })

  test('D3: 少于 3 个对象时等距操作不抛异常', async ({ page }) => {
    // 只创建 1 个矩形
    await addRect(page, { left: 100, top: 100, width: 80, height: 60, fill: '#2196F3' })

    // 查找等距按钮并点击 — 不应抛异常
    const btns = await page.evaluate(() => {
      const els = document.querySelectorAll('.editor-overlay button')
      const indices: number[] = []
      for (let i = 0; i < els.length; i++) {
        const tip = els[i].getAttribute('data-tip') || els[i].textContent || ''
        if (tip.includes('等距') || tip.includes('分布')) indices.push(i)
      }
      return indices
    })
    for (const idx of btns) {
      await page.locator('.editor-overlay button').nth(idx).click({ force: true })
      await page.waitForTimeout(200)
    }

    // 对象应仍然存在
    const state = await getObjectState(page, 0)
    expect(state).not.toBeNull()
  })

})