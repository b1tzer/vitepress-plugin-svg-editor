/**
 * SvgDiagram 展示层暗色派生 — 真实浏览器验证
 *
 * 验证闭环后半环：保存侧已强制存亮色真值，展示侧在切换 .dark 时
 * 通过运行时派生暗色（裸 hex 翻转，var(--diagram-*) 交给 CSS），
 * 使「编辑器所见 = 页面所得」。
 */
import { test, expect } from '@playwright/test'

/** 读取首页第一个 SvgDiagram 中背景 rect 的实际渲染 fill（getComputedStyle 规范化后转 hex） */
function getBgFill(page: any): Promise<string | null> {
  return page.evaluate(() => {
    const svg = document.querySelector('.svg-container svg')
    const rect = svg?.querySelector('rect[style]') as SVGRectElement | null
    if (!rect) return null
    const computed = getComputedStyle(rect).fill
    // rgb(r, g, b) → #RRGGBB（统一比较格式）
    const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(computed)
    if (m) {
      return (
        '#' +
        [m[1], m[2], m[3]]
          .map((x) => parseInt(x, 10).toString(16).padStart(2, '0').toUpperCase())
          .join('')
      )
    }
    return computed.toUpperCase()
  })
}

test.describe('SvgDiagram 展示层暗色派生', () => {
  test('切换 .dark 后裸 hex 背景色应从 #FFFFFF 翻转为 #1A1A1A', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.svg-container svg')
    // 等待 SvgDiagram 的 loadSvg + refreshDarkMode 完成
    await page.waitForTimeout(300)

    const before = await getBgFill(page)
    // 初始亮色：背景应为语义色板 surface-1 对应的亮色 #FFFFFF
    expect(before).toBe('#FFFFFF')

    // 切换到暗色（VitePress 通过给 <html> 加 .dark 实现主题切换）
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    // 等 MutationObserver 触发 applySvgTheme
    await page.waitForTimeout(300)

    const after = await getBgFill(page)
    // #FFFFFF 命中语义色板 LIGHT_TO_DARK，应精确映射为 #1A1A1A
    expect(after).toBe('#1A1A1A')
  })

  test('切回亮色后应恢复原始 #FFFFFF（原始值持久化）', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.svg-container svg')
    await page.waitForTimeout(300)

    // 先切暗色
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.waitForTimeout(300)
    expect(await getBgFill(page)).toBe('#1A1A1A')

    // 切回亮色
    await page.evaluate(() => document.documentElement.classList.remove('dark'))
    await page.waitForTimeout(300)
    expect(await getBgFill(page)).toBe('#FFFFFF')
  })
})
