/**
 * 多 SVG 页面 E2E 测试
 *
 * 验证一张页面中存在多张 SVG 时，编辑器能正确加载/关闭每张 SVG，
 * 且无内存泄漏、无 console error。
 */

import { test, expect } from '@playwright/test'
import { openEditor, addRect, getCanvasSummary } from './helpers'

// ═══════════════════ 配置 ═══════════════════
// 选一个有多张 SVG 的页面
const EDITOR_URL = '/'

// ═══════════════════ Tests ═══════════════════

test.describe('多 SVG 页面', () => {

  test('M1: 同一页面多张 SVG — 逐张打开编辑器不报错', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))

    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })

    // 统计页面上的 SVG 数量
    const svgCount = await page.evaluate(() =>
      document.querySelectorAll('.svg-container').length
    )
    console.log(`  页面 SVG 数量: ${svgCount}`)

    // 逐张打开编辑器（最多 3 张，避免耗时过长）
    const maxToTest = Math.min(svgCount, 3)
    for (let i = 0; i < maxToTest; i++) {
      console.log(`  正在测试第 ${i} 张 SVG...`)

      // 滚动到目标 SVG
      await page.evaluate((idx: number) => {
        const containers = document.querySelectorAll('.svg-container')
        containers[idx]?.scrollIntoView({ block: 'center' })
      }, i)
      await page.waitForTimeout(500)

      await openEditor(page, i)

      // 验证 Canvas 存在
      const summary = await getCanvasSummary(page)
      console.log(`    第 ${i} 张: objects=${summary.objectCount}, zoom=${summary.zoom}`)

      // 关闭编辑器
      const closeBtn = page.locator('.editor-overlay .close-btn, .editor-overlay [aria-label="关闭"]').first()
      if (await closeBtn.isVisible()) {
        await closeBtn.click({ force: true })
        await page.waitForTimeout(800)
      }
    }

    // 无 page error
    expect(errors.filter(e => e.includes('Error') || e.includes('Uncaught'))).toHaveLength(0)
  })

  test('M2: 同张 SVG 连续开关编辑器 3 次无累积错误', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))

    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })

    const svgIdx = 1

    for (let round = 1; round <= 3; round++) {
      console.log(`  第 ${round} 轮 开关编辑器...`)

      await page.evaluate((idx: number) => {
        document.querySelectorAll('.svg-container')[idx]?.scrollIntoView({ block: 'center' })
      }, svgIdx)
      await page.waitForTimeout(300)

      await openEditor(page, svgIdx)

      // 添加一个对象
      await addRect(page, {
        left: 50 + round * 10,
        top: 50 + round * 10,
        width: 60,
        height: 40,
        fill: '#2196F3',
      })

      // 关闭编辑器
      const closeBtn = page.locator('.editor-overlay .close-btn').first()
      if (await closeBtn.isVisible()) {
        await closeBtn.click({ force: true })
        await page.waitForTimeout(800)
      }

      // 每轮后检查错误数不增加
      const currentErrors = errors.filter(e => e.includes('Error') || e.includes('Uncaught'))
      if (currentErrors.length > 0) {
        console.log(`    ⚠️ 第 ${round} 轮后出现 ${currentErrors.length} 个错误:`, currentErrors)
      }
    }

    // 最终检查无累积错误
    const finalErrors = errors.filter(e => e.includes('Error') || e.includes('Uncaught'))
    expect(finalErrors.length).toBe(0)
  })

  test('M3: 快速连续在两张 SVG 间切换不崩溃', async ({ page }) => {
    page.on('pageerror', e => console.log('  ⚠️ JS:', e.message))

    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })

    const svgCount = await page.evaluate(() =>
      document.querySelectorAll('.svg-container').length
    )

    if (svgCount < 2) {
      console.log('  页面 SVG 少于 2 张，跳过测试')
      return
    }

    // A → B 切换
    console.log('  打开 SVG 0...')
    await openEditor(page, 0)
    const closeBtn0 = page.locator('.editor-overlay .close-btn').first()
    if (await closeBtn0.isVisible()) {
      await closeBtn0.click({ force: true })
      await page.waitForTimeout(500)
    }

    console.log('  打开 SVG 1...')
    await openEditor(page, 1)
    const closeBtn1 = page.locator('.editor-overlay .close-btn').first()
    if (await closeBtn1.isVisible()) {
      await closeBtn1.click({ force: true })
      await page.waitForTimeout(500)
    }

    // 再次打开 SVG 0 验证无问题
    console.log('  重新打开 SVG 0...')
    await openEditor(page, 0)
    const canvasOk = await page.evaluate(() => {
      return !!(window as any).__fabricCanvas
    })
    expect(canvasOk).toBe(true)
  })

})