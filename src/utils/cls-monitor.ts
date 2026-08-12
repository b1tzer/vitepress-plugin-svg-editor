/**
 * CLS（累积布局偏移）运行时监控工具
 *
 * 用途：
 *   - dev 模式下自动启用，在浏览器 console 中打印每个布局偏移的详细信息
 *   - 帮助开发者在开发阶段就发现 v-if 导致的 DOM 增删、图片无尺寸等 CLS 问题
 *
 * 使用方式：
 *   import { initClsMonitor } from './utils/cls-monitor'
 *   initClsMonitor()  // 在 App.vue 的 onMounted 中调用
 *
 * 原理：
 *   - 基于 PerformanceObserver 监听 'layout-shift' 事件
 *   - Google Core Web Vitals 标准：CLS > 0.1 为差，≤ 0.05 为优秀
 */

export interface ClsEntry {
  /** 偏移分数（0~1，越大越严重） */
  value: number
  /** 累计 CLS */
  cumulative: number
  /** 触发偏移的 DOM 节点列表 */
  sources: { node: Element; previousRect: DOMRect; currentRect: DOMRect }[]
  /** 是否由用户交互触发（不计入 CLS 指标） */
  hadRecentInput: boolean
  /** 发生时间 */
  timestamp: number
}

type ClsCallback = (entry: ClsEntry) => void

let cumulativeCls = 0
let observer: PerformanceObserver | null = null

/**
 * 启动 CLS 监控
 * @param onCls - 每次检测到布局偏移时的回调（可选）
 * @param threshold - 偏移分数阈值，超过此值才触发回调（默认 0.005）
 */
export function initClsMonitor(onCls?: ClsCallback, threshold = 0.005): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => {}
  }

  // 防止重复初始化
  if (observer) {
    return () => { observer?.disconnect(); observer = null; cumulativeCls = 0 }
  }

  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // 跳过用户交互触发的偏移（不计入 CLS 指标）
        // 这些通常是用户主动操作导致的正常布局变化
        const layoutShift = entry as any
        if (layoutShift.hadRecentInput) continue

        // 过滤掉极小偏移（如 1px 以内的像素对齐差异）
        const value = layoutShift.value || 0
        if (value < threshold) continue

        cumulativeCls += value

        const clsEntry: ClsEntry = {
          value,
          cumulative: cumulativeCls,
          hadRecentInput: false,
          timestamp: entry.startTime,
          sources: (layoutShift.sources || []).map((s: any) => ({
            node: s.node,
            previousRect: s.previousRect,
            currentRect: s.currentRect,
          })),
        }

        // dev 环境下在控制台打印详细警告
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
          const rating =
            cumulativeCls <= 0.05 ? '🟢 优秀' :
            cumulativeCls <= 0.1  ? '🟡 需改善' :
                                     '🔴 差'

          console.group(
            `⚠️ CLS 检测：布局偏移 ${(value * 100).toFixed(2)}%（累计 ${(cumulativeCls * 100).toFixed(2)}% ${rating}）`
          )
          console.log('偏移分数：', value)
          console.log('累计 CLS：', cumulativeCls, rating)
          console.log('时间戳：', new Date(entry.startTime).toLocaleTimeString())
          console.log('偏移来源：', clsEntry.sources.map(s => ({
            tag: s.node.tagName?.toLowerCase(),
            class: (s.node as HTMLElement).className?.slice(0, 80) || '(无)',
            id: s.node.id || '(无)',
            before: `${s.previousRect.width}x${s.previousRect.height}@(${s.previousRect.x},${s.previousRect.y})`,
            after: `${s.currentRect.width}x${s.currentRect.height}@(${s.currentRect.x},${s.currentRect.y})`,
          })))
          console.groupEnd()

          // 如果 CLS 超过 0.1，额外弹出一个醒目的警告
          if (cumulativeCls > 0.1 && onCls) {
            console.error(
              `🔴 [CLS 严重警告] 累计布局偏移已达 ${(cumulativeCls * 100).toFixed(1)}%！\n` +
              `   请检查是否有 v-if 导致 DOM 增删、图片未设尺寸、动态内容未预留空间等问题。\n` +
              `   参考文档：docs/CLS_PREVENTION.md`
            )
          }
        }

        // 触发外部回调
        onCls?.(clsEntry)
      }
    })

    observer.observe({ type: 'layout-shift', buffered: true })
  } catch (e) {
    // 某些浏览器不支持 layout-shift 类型
    console.debug('[CLS Monitor] 当前浏览器不支持 Layout Shift 检测', e)
  }

  // 返回销毁函数
  return () => {
    observer?.disconnect()
    observer = null
    cumulativeCls = 0
  }
}

/**
 * 获取当前累计 CLS 分数
 */
export function getClsScore(): number {
  return cumulativeCls
}

/**
 * 评估 CLS 等级
 */
export function getClsRating(): 'good' | 'needs-improvement' | 'poor' {
  if (cumulativeCls <= 0.05) return 'good'
  if (cumulativeCls <= 0.1) return 'needs-improvement'
  return 'poor'
}
