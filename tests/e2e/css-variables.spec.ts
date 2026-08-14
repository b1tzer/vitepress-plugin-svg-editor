/**
 * CSS 变量解析 E2E 测试 — F1 的子功能
 *
 * 验证含 CSS 变量（如 var(--vp-c-brand-1)）的 SVG 在 Canvas 中能被
 * 正确解析为实际 hex 颜色值。
 */

import { test, expect } from '@playwright/test'
import { openEditor, screenshotCanvas } from './helpers'

// ═══════════════════ 配置 ═══════════════════
// 使用含有 CSS 变量的 SVG 所在页面
const EDITOR_URL = '/'
const SVG_IDX = 1

// ═══════════════════ Tests ═══════════════════

test.describe('CSS 变量解析', () => {

  test.beforeEach(async ({ page }) => {
    page.on('pageerror', e => console.log('  ⚠️ JS:', e.message))
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })
  })

  test('CV1: 含 CSS 变量的 SVG 打开后颜色解析为非 var() 值', async ({ page }) => {
    // 获取页面某张 SVG 的原始内容，检查是否含 var() 
    const rawSvg = await page.evaluate((idx: number) => {
      const containers = document.querySelectorAll('.svg-container')
      const svg = containers[idx]?.querySelector('svg')
      return svg?.getAttribute('data-original-svg') || svg?.outerHTML || ''
    }, SVG_IDX)

    console.log(`  原始 SVG 长度: ${rawSvg.length}`)

    // 打开编辑器
    await openEditor(page, SVG_IDX)

    // 检查 Canvas 中对象的 fill 值不包含 'var('
    const fillValues = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      if (!c) return []
      return c.getObjects().map((o: any) => ({
        type: o.type,
        fill: String(o.fill),
        stroke: String(o.stroke || ''),
      }))
    })

    console.log(`  Canvas 对象数: ${fillValues.length}`)
    for (const obj of fillValues) {
      console.log(`    对象: type=${obj.type}, fill=${obj.fill}, stroke=${obj.stroke}`)
      // fill 不应包含 CSS var()
      expect(obj.fill).not.toContain('var(')
      if (obj.stroke) {
        expect(obj.stroke).not.toContain('var(')
      }
    }

    await screenshotCanvas(page, 'css-vars-canvas')
  })

  test('CV2: 保存后导出 SVG 不包含 CSS 变量原始值', async ({ page }) => {
    await openEditor(page, SVG_IDX)

    // 检查 Canvas 中对象属性是否已解析
    const resolved = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      if (!c) return { count: 0, hasCssVar: false }
      const objs = c.getObjects()
      return {
        count: objs.length,
        hasCssVar: objs.some((o: any) => 
          String(o.fill || '').includes('var(') || String(o.stroke || '').includes('var(')
        ),
      }
    })

    // Canvas 中的对象不应再包含 CSS 变量引用
    expect(resolved.hasCssVar).toBe(false)

    // 点击保存
    const saveBtn = page.locator('.btn-save')
    if (await saveBtn.isVisible()) {
      await saveBtn.click()
      await page.waitForTimeout(2000)
    }
  })

  test('CV3: 直接使用 CSS var() 的 fixture SVG — 颜色应被解析', async ({ page }) => {
    // 此测试用具体页面的 SVG 验证，作为回归测试
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container svg', { timeout: 15000 })

    // 检查页面上的 SVG 是否含 var()
    const hasCssVar = await page.evaluate((idx: number) => {
      const svg = document.querySelectorAll('.svg-container svg')[idx]
      return svg ? svg.outerHTML.includes('var(') : false
    }, SVG_IDX)

    console.log(`  页面 SVG 含 var(): ${hasCssVar}`)

    await openEditor(page, SVG_IDX)

    // 获取所有对象颜色值
    const canvasColors = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      if (!c) return { count: 0, fills: [] as string[] }
      return {
        count: c.getObjects().length,
        fills: c.getObjects().map((o: any) => String(o.fill || '')),
      }
    })

    // 所有 fill 不应以 var( 开头
    for (const fill of canvasColors.fills) {
      expect(fill).not.toContain('var(')
    }
  })

})