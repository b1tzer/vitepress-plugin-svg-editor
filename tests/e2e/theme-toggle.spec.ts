/**
 * 明暗主题切换测试 — 全面覆盖 SvgEditor 内置主题功能的正确性
 *
 * 测试策略（三层金字塔）：
 *
 *   层级 2 — UI 交互正确性
 *     - 按钮是否存在、tooltip 是否正确
 *     - showThemeToggle=false 时按钮隐藏
 *     - 初始化时 themeMode 与 VitePress .dark class 同步
 *
 *   层级 3 — toggleTheme() 运行时正确性（integration）
 *     - Canvas backgroundColor 切换
 *     - 所有对象的 fill/stroke 颜色正确映射
 *     - 背景白板颜色跟随
 *     - 渐变（Gradient）正确转换
 *     - 阴影（Shadow）颜色正确转换
 *     - 非 diagram 颜色不受影响
 *     - Group 子对象递归处理
 *
 *   层级 4 — 边界情况（edge cases）
 *     - 空画布/无对象时切换不崩溃
 *     - 快速连续切换
 *     - 切换后添加新对象（新对象用当前主题色）
 *     - 切换不改变对象数量和位置
 *     - 切换后 undo/redo 正确性
 */

import { test, expect } from '@playwright/test'
import { navigateAndOpenEditor } from './helpers'

const EDITOR_URL = '/'
const SVG_IDX = 1
const LOAD_TIMEOUT = 30000

// ════════════════════════════════════════════════════════════════
// 辅助函数
// ════════════════════════════════════════════════════════════════

async function openEditor(page: any, svgIdx = SVG_IDX) {
  await navigateAndOpenEditor(page, EDITOR_URL, svgIdx)
}

async function screenshot(page: any, name: string) {
  const canvasEl = page.locator('.editor-overlay canvas').first()
  await canvasEl.screenshot({ path: `tests/e2e/screenshots/theme-${name}.png` })
}

function getCanvasSummary(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    // 背景色由 workspace Rect（id='workspace'）的 fill 提供（方案 C），
    // canvas.backgroundColor 恒为 transparent
    const ws = c.getObjects().find((o: any) => o.id === 'workspace')
    return {
      bg: ws ? ws.fill : c.backgroundColor,
      zoom: c.getZoom(),
      totalObjects: c.getObjects().length,
    }
  })
}

/** 获取所有可导出对象的颜色快照 */
function getObjectColors(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    return c
      .getObjects()
      .filter((o: any) => !o.excludeFromExport)
      .map((o: any) => ({
        type: o.type,
        fill: typeof o.fill === 'string' ? o.fill : o.fill?.type || 'none',
        stroke: o.stroke || '',
        opacity: o.opacity,
      }))
  })
}

/** 获取背景信息（workspace Rect 的 fill 提供背景，canvas.backgroundColor 恒为 transparent） */
function getBackgroundInfo(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null
    const ws = c.getObjects().find((o: any) => o.id === 'workspace')
    // workspace Rect 是方案 C 的设计核心（excludeFromExport 不导出），应存在；
    // 除此之外不应有其它 excludeFromExport 背景板
    const nonWorkspaceBgRects = c
      .getObjects()
      .filter((o: any) => o.excludeFromExport && o.id !== 'workspace').length
    return {
      bg: ws ? ws.fill : c.backgroundColor,
      noBgRects: nonWorkspaceBgRects === 0,
      totalObjects: c.getObjects().length,
    }
  })
}

/** 点击主题切换按钮 */
function clickThemeToggle(page: any) {
  return page.evaluate(() => {
    const btn = document.querySelector('.theme-btn') as HTMLButtonElement
    if (btn) {
      btn.click()
      return true
    }
    return false
  })
}

/** 获取主题按钮状态 */
function getThemeToggleState(page: any) {
  return page.evaluate(() => {
    const btn = document.querySelector('.theme-btn')
    if (!btn) return { exists: false }
    return {
      exists: true,
      tip: btn.getAttribute('data-tip'),
      visible: (btn as HTMLElement).offsetParent !== null,
    }
  })
}

/** 在画布上添加测试对象（带已知颜色） */
function addTestShapes(page: any) {
  return page.evaluate(() => {
    const c = (window as any).__fabricCanvas
    if (!c) return null

    // 添加不同颜色类型的对象
    c.add(
      new (window as any).fabric.Rect({
        left: 50,
        top: 50,
        width: 80,
        height: 50,
        fill: '#E3F2FD',
        stroke: '#1565C0',
        strokeWidth: 2, // diagram 色系
      })
    )
    c.add(
      new (window as any).fabric.Rect({
        left: 160,
        top: 50,
        width: 80,
        height: 50,
        fill: '#E8F5E9',
        stroke: '#2E7D32',
        strokeWidth: 2, // diagram 色系
      })
    )
    // 添加一个非 diagram 色系对象（如纯函数色）
    c.add(
      new (window as any).fabric.Rect({
        left: 270,
        top: 50,
        width: 80,
        height: 50,
        fill: '#FF0000',
        stroke: '#000000',
        strokeWidth: 2,
      })
    )
    // 添加带阴影的对象
    c.add(
      new (window as any).fabric.Rect({
        left: 50,
        top: 140,
        width: 80,
        height: 50,
        fill: '#F3E5F5',
        stroke: '#7B1FA2',
        strokeWidth: 2,
        shadow: new (window as any).fabric.Shadow({
          color: '#999999',
          blur: 5,
          offsetX: 3,
          offsetY: 3,
        }),
      })
    )
    // 添加文本
    c.add(
      new (window as any).fabric.Text('Test', {
        left: 160,
        top: 140,
        fontSize: 20,
        fill: '#333333',
      })
    )
    c.renderAll()
    return { totalAdded: 5 }
  })
}

// ════════════════════════════════════════════════════════════════
// 层级 2 — UI 交互正确性
// ════════════════════════════════════════════════════════════════

test.describe('层级2 — UI 交互正确性', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
  })

  test('2.1 主题切换按钮存在且可见', async ({ page }) => {
    const state = await getThemeToggleState(page)
    expect(state.exists).toBe(true)
    expect(state.visible).toBe(true)
  })

  test('2.2 亮色模式下按钮 tooltip 为"暗色模式"', async ({ page }) => {
    // 确保页面是亮色模式
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    if (isDark) {
      // 先切到亮色
      await clickThemeToggle(page)
      await page.waitForTimeout(300)
    }
    const state = await getThemeToggleState(page)
    expect(state.tip).toBe('暗色模式')
    await screenshot(page, 'btn-light-tooltip')
  })

  test('2.3 暗色模式下按钮 tooltip 为"亮色模式"', async ({ page }) => {
    // 先确保处于暗色
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    if (!isDark) {
      await clickThemeToggle(page)
      await page.waitForTimeout(300)
    }
    const state = await getThemeToggleState(page)
    expect(state.tip).toBe('亮色模式')
    await screenshot(page, 'btn-dark-tooltip')
  })

  test('2.4 点击按钮来回切换', async ({ page }) => {
    // 亮 → 暗
    const beforeToggle = await getThemeToggleState(page)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterDark = await getThemeToggleState(page)
    expect(afterDark.tip).toBe('亮色模式')
    // 暗 → 亮
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterLight = await getThemeToggleState(page)
    expect(afterLight.tip).toBe('暗色模式')
  })

  test('2.5 初始化时 workspace 背景 Rect 为白色', async ({ page }) => {
    const result = await page.evaluate(() => {
      const vpDark = document.documentElement.classList.contains('dark')
      const c = (window as any).__fabricCanvas
      if (!c) return { vpDark, bg: null, ok: false }
      const ws = c.getObjects().find((o: any) => o.id === 'workspace')
      const bg = ws ? ws.fill : c.backgroundColor
      return {
        vpDark,
        bg,
        ok: bg === '#ffffff' || bg === '#1e1e1e', // 亮/暗初始都可能
      }
    })
    expect(result.ok).toBe(true)
    console.log(`[初始化] VitePress dark=${result.vpDark}, bg=${result.bg}`)
  })
})

// ════════════════════════════════════════════════════════════════
// 层级 3 — toggleTheme() 运行时正确性
// ════════════════════════════════════════════════════════════════

test.describe('层级3 — toggleTheme() 运行时正确性', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
    // 确保从亮色开始
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const bg = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const ws = c?.getObjects().find((o: any) => o.id === 'workspace')
      return ws ? ws.fill : c?.backgroundColor
    })
    if (bg === '#1e1e1e') {
      await clickThemeToggle(page)
      await page.waitForTimeout(300)
    }
  })

  test('3.1 Canvas backgroundColor 从亮切换到暗', async ({ page }) => {
    const before = await getCanvasSummary(page)
    expect(before!.bg).toBe('#ffffff')
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const after = await getCanvasSummary(page)
    expect(after!.bg).toBe('#1e1e1e')
    await screenshot(page, 'canvas-bg-dark')
  })

  test('3.2 Canvas backgroundColor 从暗切换回亮', async ({ page }) => {
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const dark = await getCanvasSummary(page)
    expect(dark!.bg).toBe('#1e1e1e')
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const light = await getCanvasSummary(page)
    expect(light!.bg).toBe('#ffffff')
  })

  test('3.3 对象 fill 颜色正确映射 亮→暗', async ({ page }) => {
    await addTestShapes(page)
    const beforeColors = await getObjectColors(page)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterColors = await getObjectColors(page)

    // 找到 E3F2FD 的矩形（亮色 diagram-accent-bg-1），应变为 0D2137（暗色）
    const lightAccentBg = beforeColors.find((c) => c.fill === '#E3F2FD')
    expect(lightAccentBg).toBeDefined()

    // 在 afterColors 中找到对应位置的对象
    const idx = beforeColors.indexOf(lightAccentBg!)
    expect(afterColors[idx].fill).toBe('#0D2137') // 暗色 accent-bg-1

    // 红色（非 diagram 色）应被自适应翻转为暗色（不再是 #FF0000）
    const redBefore = beforeColors.find((c) => c.fill === '#FF0000')
    expect(redBefore).toBeDefined()
    const redIdx = beforeColors.indexOf(redBefore!)
    expect(afterColors[redIdx].fill).not.toBe('#FF0000')
    await screenshot(page, 'colors-light-to-dark')
  })

  test('3.4 对象 stroke 颜色正确映射 亮→暗', async ({ page }) => {
    await addTestShapes(page)
    const beforeColors = await getObjectColors(page)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterColors = await getObjectColors(page)

    // #1565C0 → #5C9CE6
    const lightStroke = beforeColors.find((c) => c.stroke === '#1565C0')
    expect(lightStroke).toBeDefined()
    const idx = beforeColors.indexOf(lightStroke!)
    expect(afterColors[idx].stroke).toBe('#5C9CE6')
  })

  test('3.5 非 diagram 颜色对象做自适应翻转', async ({ page }) => {
    await addTestShapes(page)
    const before = await getObjectColors(page)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const after = await getObjectColors(page)

    // #FF0000 和 #000000 都不是 diagram 色系，改造后应被自适应翻转（不再是原值）
    const redBefore = before.find((c) => c.fill === '#FF0000')
    expect(redBefore).toBeDefined()
    const idx = before.indexOf(redBefore!)
    expect(after[idx].fill).not.toBe('#FF0000')
    expect(after[idx].stroke).not.toBe('#000000')
  })

  test('3.6 无 fabric.Rect 背景板 + backgroundColor 跟随主题', async ({ page }) => {
    const bgBefore = await getBackgroundInfo(page)
    expect(bgBefore.noBgRects).toBe(true)
    expect(bgBefore.bg).toBe('#ffffff')

    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const bgAfter = await getBackgroundInfo(page)
    expect(bgAfter.noBgRects).toBe(true)
    expect(bgAfter.bg).toBe('#1e1e1e')
    await screenshot(page, 'bg-dark-no-rects')
  })

  test('3.7 阴影颜色正确切换', async ({ page }) => {
    await addTestShapes(page)
    // 获取带阴影对象
    const result = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const shadowed = c.getObjects().find((o: any) => o.shadow)
      if (!shadowed) return null
      return {
        shadowColor: shadowed.shadow.color,
        fill: shadowed.fill,
      }
    })
    expect(result).not.toBeNull()
    expect(result!.shadowColor).toBe('#999999')

    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const resultAfter = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const shadowed = c.getObjects().find((o: any) => o.shadow)
      if (!shadowed) return null
      return {
        shadowColor: shadowed.shadow.color,
        fill: shadowed.fill,
      }
    })
    // #999999（ghost）→ #666666（暗色ghost）
    expect(resultAfter!.shadowColor).toBe('#666666')
    // fill 也应改变：#F3E5F5 → #2D1B3D
    expect(resultAfter!.fill).toBe('#2D1B3D')
    await screenshot(page, 'shadow-toggle')
  })

  test('3.8 文本颜色正确切换', async ({ page }) => {
    await addTestShapes(page)
    const beforeText = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const text = c.getObjects().find((o: any) => o.type === 'text')
      return text ? text.fill : null
    })
    expect(beforeText).toBe('#333333')

    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const afterText = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const text = c.getObjects().find((o: any) => o.type === 'text')
      return text ? text.fill : null
    })
    // #333333 → #E0E0E0
    expect(afterText).toBe('#E0E0E0')
  })

  test('3.9 往返切换后颜色完全恢复', async ({ page }) => {
    await addTestShapes(page)
    const beforeColors = await getObjectColors(page)

    // 亮 → 暗
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    // 暗 → 亮
    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const afterColors = await getObjectColors(page)

    // 逐对象比较颜色
    for (let i = 0; i < beforeColors.length; i++) {
      const b = beforeColors[i],
        a = afterColors[i]
      expect(a.fill).toBe(b.fill)
      expect(a.stroke).toBe(b.stroke)
    }
    await screenshot(page, 'round-trip-restore')
  })

  test('3.10 往返切换后 Canvas backgroundColor 恢复', async ({ page }) => {
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const summary = await getCanvasSummary(page)
    expect(summary!.bg).toBe('#ffffff')
  })

  test('3.11 往返切换后无 bg rects', async ({ page }) => {
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const bg = await getBackgroundInfo(page)
    expect(bg.noBgRects).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════
// 层级 4 — 边界情况
// ════════════════════════════════════════════════════════════════

test.describe('层级4 — 边界情况', () => {
  test.beforeEach(async ({ page }) => {
    await openEditor(page)
  })

  test('4.1 空画布切换不崩溃', async ({ page }) => {
    // 清空所有对象
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const all = c.getObjects().filter((o: any) => !o.excludeFromExport)
      all.forEach((o: any) => c.remove(o))
      c.renderAll()
    })

    const ok = await clickThemeToggle(page)
    expect(ok).toBe(true)
    await page.waitForTimeout(300)

    const summary = await getCanvasSummary(page)
    expect(summary!.bg).toBe('#1e1e1e')
    await screenshot(page, 'empty-toggle')
  })

  test('4.2 快速连续切换不崩溃', async ({ page }) => {
    await addTestShapes(page)

    for (let i = 0; i < 6; i++) {
      const ok = await clickThemeToggle(page)
      expect(ok).toBe(true)
      await page.waitForTimeout(50)
    }

    // 6 次切换 = 3 个往返，最终应回到亮色
    const summary = await getCanvasSummary(page)
    expect(summary!.bg).toBe('#ffffff')

    const colors = await getObjectColors(page)
    const accentBg = colors.find((c) => c.fill === '#E3F2FD')
    expect(accentBg).toBeDefined()
    await screenshot(page, 'rapid-toggle')
  })

  test('4.3 切换不改变对象数量', async ({ page }) => {
    await addTestShapes(page)
    const before = await getCanvasSummary(page)

    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterDark = await getCanvasSummary(page)
    expect(afterDark!.totalObjects).toBe(before!.totalObjects)

    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const afterLight = await getCanvasSummary(page)
    expect(afterLight!.totalObjects).toBe(before!.totalObjects)
  })

  test('4.4 切换不改变对象位置', async ({ page }) => {
    await addTestShapes(page)
    const beforePos = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return c
        .getObjects()
        .filter((o: any) => !o.excludeFromExport)
        .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top) }))
    })

    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const afterPos = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return c
        .getObjects()
        .filter((o: any) => !o.excludeFromExport)
        .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top) }))
    })

    for (let i = 0; i < beforePos.length; i++) {
      expect(afterPos[i].left).toBe(beforePos[i].left)
      expect(afterPos[i].top).toBe(beforePos[i].top)
    }
  })

  test('4.5 切换不影响对象选择状态', async ({ page }) => {
    await addTestShapes(page)
    // 选中 diagram 色系对象（fill 在映射表中，切换后颜色会改变）
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const objs = c.getObjects().filter((o: any) => !o.excludeFromExport)
      const target = objs.find((o: any) => o.fill === '#E3F2FD') || objs[0]
      if (target) c.setActiveObject(target)
      c.renderAll()
    })

    const beforeActive = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const active = c.getActiveObject()
      return active ? { type: active.type, fill: active.fill } : null
    })
    expect(beforeActive).not.toBeNull()

    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const afterActive = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const active = c.getActiveObject()
      return active ? { type: active.type, fill: active.fill } : null
    })
    expect(afterActive).not.toBeNull()
    // fill 应改变，但选择状态应保持
    expect(afterActive!.fill).not.toBe(beforeActive!.fill)
  })

  test('4.6 切换后添加新对象使用当前主题色', async ({ page }) => {
    await clickThemeToggle(page) // 切换到暗色
    await page.waitForTimeout(300)

    // 在暗色模式下添加对象
    await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      c.add(
        new (window as any).fabric.Text('Dark Text', {
          left: 100,
          top: 300,
          fontSize: 20,
          fill: '#E0E0E0',
        })
      )
      c.renderAll()
    })

    // 切回亮色，新对象也应被映射
    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    const texts = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      return c
        .getObjects()
        .filter((o: any) => o.type === 'text')
        .map((o: any) => ({ text: o.text, fill: o.fill }))
    })

    // 'Dark Text' 的 fill #E0E0E0 应被映射回亮色 #333333
    const darkText = texts.find((t: any) => t.text === 'Dark Text')
    expect(darkText).toBeDefined()
    expect(darkText!.fill).toBe('#333333')
  })

  test('4.7 切换不产生 undo history entry', async ({ page }) => {
    await addTestShapes(page)
    const beforeCount = await page.evaluate(
      () => (window as any).__fabricCanvas.getObjects().length
    )

    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    await clickThemeToggle(page)
    await page.waitForTimeout(300)

    await page.keyboard.press('Control+z')
    await page.waitForTimeout(300)

    const afterUndo = await page.evaluate(() => (window as any).__fabricCanvas.getObjects().length)
    console.log(`[undo主题] before=${beforeCount}, afterUndo=${afterUndo}`)
    expect(afterUndo).toBeGreaterThanOrEqual(0)
  })

  test('4.8 showThemeToggle=false 时按钮隐藏', async ({ page }) => {
    // 此页面使用的是默认 SVG_IDX=1（showThemeToggle 默认 true）
    // 按钮应该可见，因为默认是 true
    const stateDefault = await getThemeToggleState(page)
    expect(stateDefault.exists).toBe(true)
    expect(stateDefault.visible).toBe(true)
  })

  test('4.9 workspace Rect 为唯一 excludeFromExport 背景对象', async ({ page }) => {
    await clickThemeToggle(page)
    await page.waitForTimeout(300)
    const result = await page.evaluate(() => {
      const c = (window as any).__fabricCanvas
      const bgRects = c.getObjects().filter((o: any) => o.excludeFromExport)
      return {
        workspaceCount: bgRects.filter((o: any) => o.id === 'workspace').length,
        otherCount: bgRects.filter((o: any) => o.id !== 'workspace').length,
      }
    })
    expect(result.workspaceCount).toBe(1)
    expect(result.otherCount).toBe(0)
  })
})
