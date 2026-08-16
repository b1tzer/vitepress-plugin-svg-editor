/**
 * 编辑器布局稳定性测试（CLS 防护）
 *
 * 目的：防止任何导致画布跳动、面板尺寸突变的代码变更进入主分支。
 *
 * 为什么用「语义化 DOM 测量断言」而非像素级 toHaveScreenshot？
 *   - Fabric.js canvas 是动态绘制内容，像素级对比受浏览器版本 / GPU / 抗锯齿 /
 *     异步加载时机影响；跨平台（macOS vs Linux CI）字体渲染差异会造成大量 flaky。
 *   - 本测试直接测量关键布局元素（工具栏 / 三栏面板）的 getBoundingClientRect，
 *     精确断言「选中 / 取消选中 / 切换主题」等内部状态变化不会引起布局跳动。
 *     相比像素 diff，它能直接定位「哪个元素跳了多少像素」，更快、更抗 flaky。
 *
 * 测试场景：
 *   1. 编辑器初始加载后，工具栏与三栏布局基线存在且尺寸合理
 *   2. 选中对象不改变右侧属性面板宽度（固定容器 + 内部 v-if 的 CLS 铁律）
 *   3. 取消选中不引起任何布局元素跳动
 *   4. 切换明暗主题只改颜色，不改变任何布局元素的尺寸 / 位置
 */

import { test, expect } from '@playwright/test'
import { navigateAndOpenEditor } from '../helpers'

const PAGE_URL = '/features.html'

/** 读取关键布局元素的 boundingBox（四舍五入到整数像素） */
function getLayoutSnapshot(page: any) {
  return page.evaluate(() => {
    const box = (selector: string) => {
      const el = document.querySelector(selector)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    }
    return {
      overlay: box('.editor-overlay'),
      toolbar: box('.editor-toolbar'),
      leftPanel: box('.left-panel'),
      canvas: box('.editor-canvas'),
      contextPanel: box('.context-panel'),
    }
  })
}

test.describe('Editor Layout Stability（CLS 防护）', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndOpenEditor(page, PAGE_URL)
  })

  test('1. 打开编辑器后工具栏与三栏布局基线存在且尺寸合理', async ({ page }) => {
    const s = await getLayoutSnapshot(page)
    // 所有关键布局元素都应存在
    expect(s.overlay).not.toBeNull()
    expect(s.toolbar).not.toBeNull()
    expect(s.leftPanel).not.toBeNull()
    expect(s.canvas).not.toBeNull()
    expect(s.contextPanel).not.toBeNull()

    // 工具栏高度 > 0（防止 v-if 移除导致高度塌陷）
    expect(s.toolbar!.h).toBeGreaterThan(10)
    // 三栏宽度均 > 0
    expect(s.leftPanel!.w).toBeGreaterThan(0)
    expect(s.canvas!.w).toBeGreaterThan(0)
    expect(s.contextPanel!.w).toBeGreaterThan(0)
  })

  test('2. 选中对象不改变右侧属性面板宽度（固定宽度，内容切换不撑开/塌陷）', async ({ page }) => {
    const before = await getLayoutSnapshot(page)
    const contextWidth = before.contextPanel!.w

    // 选中第一个对象
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const objs = c.getObjects()
      if (objs.length) {
        c.setActiveObject(objs[0])
        c.renderAll()
      }
    })
    await page.waitForTimeout(300)

    const after = await getLayoutSnapshot(page)
    // 属性面板宽度必须保持不变（CLS 铁律：固定容器 + 内部 v-if）
    expect(after.contextPanel!.w).toBe(contextWidth)
    // 画布和左面板的水平位置也不应因选中而跳动
    expect(after.canvas!.x).toBe(before.canvas!.x)
    expect(after.leftPanel!.x).toBe(before.leftPanel!.x)
  })

  test('3. 取消选中不引起任何布局元素跳动', async ({ page }) => {
    // 先选中再取消，制造内部状态变化
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const objs = c.getObjects()
      if (objs.length) c.setActiveObject(objs[0])
      c.renderAll()
    })
    await page.waitForTimeout(200)

    const before = await getLayoutSnapshot(page)
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      c.discardActiveObject()
      c.renderAll()
    })
    await page.waitForTimeout(300)

    const after = await getLayoutSnapshot(page)
    // 所有关键布局元素位置与尺寸都不应改变
    for (const key of ['toolbar', 'leftPanel', 'canvas', 'contextPanel'] as const) {
      expect(after[key]).toEqual(before[key])
    }
  })

  test('4. 切换明暗主题只改颜色，不改变布局尺寸', async ({ page }) => {
    const before = await getLayoutSnapshot(page)

    // 点击主题切换按钮
    const toggled = await page.evaluate(() => {
      const btn = document.querySelector('.theme-toggle-btn') as HTMLButtonElement
      if (btn) {
        btn.click()
        return true
      }
      return false
    })
    await page.waitForTimeout(300)

    const after = await getLayoutSnapshot(page)
    if (toggled) {
      for (const key of ['toolbar', 'leftPanel', 'canvas', 'contextPanel'] as const) {
        expect(after[key]).toEqual(before[key])
      }
    }
  })
})
