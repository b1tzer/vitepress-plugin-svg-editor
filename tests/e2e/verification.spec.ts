import { test } from '@playwright/test'
import { openEditor, analyzeSvg } from './helpers'

const PAGE_URL = '/java-world/01-java-language/chapter-01-type-system'
const SVG_IDX = 1

test.describe('SVG 编辑器验证（SVG 1 - type-hierarchy）', () => {

  test('1. 保存前后结构对比', async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForSelector('.svg-container svg', { timeout: 15000 })

    const beforeHtml = await page.evaluate(() => {
      const c = document.querySelectorAll('.svg-container')
      return c[1]?.querySelector('svg')?.outerHTML || ''
    })
    const before = analyzeSvg(beforeHtml)
    console.log(`[保存前]`, JSON.stringify(before))

    await openEditor(page, SVG_IDX)
    await page.locator('.btn-save').click()
    await page.waitForFunction(() => !document.querySelector('.editor-overlay'), { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(1500)

    const afterHtml = await page.evaluate(() => {
      const c = document.querySelectorAll('.svg-container')
      return c[1]?.querySelector('svg')?.outerHTML || ''
    })
    const after = analyzeSvg(afterHtml)
    console.log(`[保存后]`, JSON.stringify(after))

    for (const key of Object.keys(before) as Array<keyof typeof before>) {
      const diff = after[key] - before[key]
      console.log(`[${diff === 0 ? '✅' : '⚠️'}] ${key}: ${before[key]} → ${after[key]}`)
    }
  })

  test('2. 3 轮保存稳定性', async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForSelector('.svg-container svg', { timeout: 15000 })

    const html0 = await page.evaluate(() => {
      const c = document.querySelectorAll('.svg-container')
      return c[1]?.querySelector('svg')?.outerHTML || ''
    })
    const s0 = analyzeSvg(html0)
    console.log(`[Round 0]`, JSON.stringify(s0))

    for (let i = 1; i <= 3; i++) {
      await openEditor(page, SVG_IDX)
      await page.locator('.btn-save').click()
      await page.waitForFunction(() => !document.querySelector('.editor-overlay'), { timeout: 10000 }).catch(() => {})
      await page.waitForTimeout(1500)

      const html = await page.evaluate(() => {
        const c = document.querySelectorAll('.svg-container')
        return c[1]?.querySelector('svg')?.outerHTML || ''
      })
      const s = analyzeSvg(html)
      console.log(`[Round ${i}]`, JSON.stringify(s))

      if (s.lines !== s0.lines) console.log(`[⚠️] lines: ${s0.lines}→${s.lines}`)
      if (s.texts !== s0.texts) console.log(`[⚠️] texts: ${s0.texts}→${s.texts}`)
      if (s.groups !== s0.groups) console.log(`[⚠️] groups: ${s0.groups}→${s.groups}`)
    }
  })
})
