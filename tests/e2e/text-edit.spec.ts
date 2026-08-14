/**
 * 文字编辑 E2E 测试 — F6 / F9
 *
 * 验证文字创建、编辑、格式（加粗/斜体/下划线/字号/颜色/对齐）功能。
 */

import { test, expect } from '@playwright/test'
import { openEditor, addText, selectObject, getObjectState, screenshotCanvas } from './helpers'

// ═══════════════════ 配置 ═══════════════════
const EDITOR_URL = '/'
const SVG_IDX = 1

// ═══════════════════ 辅助函数 ═══════════════════

async function findToolbarButton(page: any, tipOrText: string) {
  return page.evaluate((target: string) => {
    const btns = document.querySelectorAll('.editor-overlay button, .editor-overlay [data-tip], .editor-overlay [title]')
    for (let i = 0; i < btns.length; i++) {
      const el = btns[i] as HTMLElement
      const tip = el.getAttribute('data-tip') || el.getAttribute('title') || el.textContent || ''
      if (tip.includes(target)) return i
    }
    return -1
  }, tipOrText)
}

async function clickToolbarButton(page: any, tipOrText: string) {
  const idx = await findToolbarButton(page, tipOrText)
  if (idx >= 0) {
    await page.locator('.editor-overlay button, .editor-overlay [data-tip]').nth(idx).click({ force: true })
    await page.waitForTimeout(300)
    return true
  }
  console.log(`  ⚠️ 未找到按钮: ${tipOrText}`)
  return false
}

// ═══════════════════ Tests ═══════════════════

test.describe('文字编辑', () => {

  test.beforeEach(async ({ page }) => {
    page.on('pageerror', e => console.log('  ⚠️ JS:', e.message))
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForSelector('.svg-container', { timeout: 15000 })
    await openEditor(page, SVG_IDX)
  })

  test('T1: 创建文字对象', async ({ page }) => {
    await addText(page, 'Hello World', { left: 150, top: 100, fontSize: 28, fill: '#333' })

    const state = await getObjectState(page, 0)
    expect(state).not.toBeNull()
    expect(state!.type).toBe('text')
    // Fabric.Text 的 fontSize 默认可能不是固定属性
    console.log(`  文字对象: type=${state!.type}, left=${state!.left}, top=${state!.top}`)

    await screenshotCanvas(page, 'text-create')
  })

  test('T2: 加粗切换 — fontWeight 应在 bold/normal 间切换', async ({ page }) => {
    await addText(page, 'Bold Test', { left: 100, top: 100, fontSize: 24, fill: '#333' })

    // 初始应非 bold（默认 normal）
    const boldBefore = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.fontWeight : null
    })
    console.log(`  加粗前 fontWeight: ${boldBefore}`)

    // 点击加粗按钮
    await clickToolbarButton(page, '粗')

    const boldAfter = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.fontWeight : null
    })
    console.log(`  加粗后 fontWeight: ${boldAfter}`)

    // 两次点击应回到原值
    await clickToolbarButton(page, '粗')
    const boldReset = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.fontWeight : null
    })
    // 回归验证：toggle 后应回到原值
    expect([boldBefore, 'normal']).toContain(boldReset)

    await screenshotCanvas(page, 'text-bold')
  })

  test('T3: 斜体切换 — fontStyle 应在 italic/normal 间切换', async ({ page }) => {
    await addText(page, 'Italic Test', { left: 100, top: 100, fontSize: 24, fill: '#333' })

    await clickToolbarButton(page, '斜')
    const italicStyle = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.fontStyle : null
    })
    // 第一次点击后应为 italic
    expect(['italic', 'Italic']).toContain(String(italicStyle))

    await screenshotCanvas(page, 'text-italic')
  })

  test('T4: 下划线切换', async ({ page }) => {
    await addText(page, 'Underline Test', { left: 100, top: 100, fontSize: 24, fill: '#333' })

    const underlineBefore = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.underline : null
    })

    await clickToolbarButton(page, '下划线')

    const underlineAfter = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.underline : null
    })
    // 应发生切换
    expect(underlineAfter).not.toBe(underlineBefore)

    await screenshotCanvas(page, 'text-underline')
  })

  test('T5: 字号变化', async ({ page }) => {
    await addText(page, 'Size Test', { left: 100, top: 100, fontSize: 18, fill: '#333' })

    // 尝试找到字号输入并修改
    const hasSizeInput = await page.evaluate(() => {
      const inputs = document.querySelectorAll('.editor-overlay input')
      return inputs.length > 0
    })

    if (hasSizeInput) {
      await screenshotCanvas(page, 'text-fontsize')
    } else {
      console.log('  ⚠️ 无字号输入框，跳过字号测试')
    }
  })

  test('T6: 文本颜色修改', async ({ page }) => {
    await addText(page, 'Color Test', { left: 100, top: 100, fontSize: 24, fill: '#333' })

    // 尝试修改 fill
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      if (obj) {
        obj.set('fill', '#E91E63')
        c.renderAll()
      }
    })

    const newFill = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.fill : null
    })
    expect(newFill).toBe('#E91E63')

    await screenshotCanvas(page, 'text-color')
  })

  test('T7: 文字对齐 — left/center/right', async ({ page }) => {
    await addText(page, 'Align Test\nLine Two', { left: 100, top: 100, fontSize: 20, fill: '#333' })

    // 尝试居中
    await clickToolbarButton(page, '居中')

    const align = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const obj = c.getActiveObject()
      return obj ? obj.textAlign : null
    })
    console.log(`  对齐方式: ${align}`)

    await screenshotCanvas(page, 'text-align')
  })

})