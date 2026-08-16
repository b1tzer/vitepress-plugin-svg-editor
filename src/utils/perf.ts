/**
 * 性能打点工具（dev-only）
 *
 * 目标：为 SVG 编辑器提供可量化、可进 DevTools 的性能测量能力，
 * 用于坐实「拖拽/缩放/撤销卡顿」这类运行时瓶颈，而非只靠主观感受。
 *
 * 分层能力：
 *   1. User Timing API（mark / measure）— 关键路径函数耗时，显示在 DevTools Performance 的 Timings 轨道
 *   2. timed / timedAsync — 同步 / 异步函数耗时包装，内部自动 mark + measure
 *   3. PerformanceObserver('longtask') — 自动捕获 >50ms 的主线程卡顿（零侵入，无需手埋）
 *   4. rAF FPS 计数器 — 量化拖拽/缩放流畅度（对齐设计文档「100 对象 ≥ 30fps」）
 *   5. performance.memory 采样 — 量化内存泄漏（对齐设计文档「多 SVG 无泄漏 < 5MB」）
 *
 * 设计原则：
 *   - dev-only：默认跟随 import.meta.env.DEV，可通过 setPerfEnabled 显式开启/关闭
 *   - 能力检测：SSR / jsdom / 旧浏览器下自动降级，绝不抛错
 *   - 零依赖：仅使用浏览器原生 Performance API
 */

/** 全局开关，默认跟随 dev 环境 */
let _enabled = import.meta.env.DEV

/** 显式开启 / 关闭打点（例如用户配置 debug: true 时在 production 也开启） */
export function setPerfEnabled(enabled: boolean): void {
  _enabled = enabled
}

/** 是否处于可用状态（开关开启 + 环境支持 performance.mark） */
export function isPerfEnabled(): boolean {
  return _enabled && typeof performance !== 'undefined' && typeof performance.mark === 'function'
}

// ── 1. User Timing API 基础封装 ──

/** 打一个时间标记（mark） */
export function mark(name: string): void {
  if (!isPerfEnabled()) return
  performance.mark(name)
}

/** 计算两个标记之间的耗时（measure），并清理临时标记 */
export function measure(name: string, startMark: string, endMark: string): number | undefined {
  if (!isPerfEnabled()) return undefined
  try {
    performance.measure(name, startMark, endMark)
    const entries = performance.getEntriesByName(name, 'measure')
    const duration = entries.length ? entries[entries.length - 1].duration : undefined
    performance.clearMarks(startMark)
    performance.clearMarks(endMark)
    performance.clearMeasures(name)
    return duration
  } catch {
    return undefined
  }
}

// ── 2. 函数耗时包装 ──

/**
 * 同步函数耗时包装
 * @example const json = timed('history:save', () => canvas.toJSON())
 */
export function timed<T>(name: string, fn: () => T): T {
  if (!isPerfEnabled()) return fn()
  const start = `${name}:start`
  const end = `${name}:end`
  performance.mark(start)
  try {
    return fn()
  } finally {
    performance.mark(end)
    const duration = measure(name, start, end)
    if (duration !== undefined) {
      console.debug(`[perf] ${name} = ${duration.toFixed(1)}ms`)
    }
  }
}

/**
 * 异步函数耗时包装
 * @example const result = await timedAsync('svg:load', async () => loadSvg())
 */
export async function timedAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  if (!isPerfEnabled()) return fn()
  const start = `${name}:start`
  const end = `${name}:end`
  performance.mark(start)
  try {
    return await fn()
  } finally {
    performance.mark(end)
    const duration = measure(name, start, end)
    if (duration !== undefined) {
      console.debug(`[perf] ${name} = ${duration.toFixed(1)}ms`)
    }
  }
}

// ── 3. 主线程长任务监测（零侵入） ──

export interface LongTaskMonitorOptions {
  /** 只上报超过此阈值（ms）的长任务，默认 100 */
  threshold?: number
  /** 每次检测到长任务时的回调（可选，用于接入自定义上报） */
  onLongTask?: (duration: number) => void
}

/** 启动长任务监测，返回停止函数 */
export function startLongTaskMonitor(opts: LongTaskMonitorOptions = {}): () => void {
  if (!isPerfEnabled()) return () => {}
  const { threshold = 100, onLongTask } = opts

  const supported =
    typeof PerformanceObserver !== 'undefined' &&
    PerformanceObserver.supportedEntryTypes &&
    PerformanceObserver.supportedEntryTypes.includes('longtask')
  if (!supported) return () => {}

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration < threshold) continue
      console.warn(`[perf] longtask ${entry.duration.toFixed(1)}ms（主线程阻塞）`)
      onLongTask?.(entry.duration)
    }
  })

  try {
    observer.observe({ type: 'longtask', buffered: true })
  } catch {
    observer.disconnect()
    return () => {}
  }
  return () => observer.disconnect()
}

// ── 4. rAF FPS 计数器 ──

export interface FpsMonitorOptions {
  /** 统计周期（ms），默认 1000（每秒输出一次） */
  interval?: number
  /** 每秒回调（可选） */
  onFps?: (fps: number) => void
}

/** 启动 FPS 计数，返回停止函数 */
export function startFpsMonitor(opts: FpsMonitorOptions = {}): () => void {
  if (!isPerfEnabled() || typeof requestAnimationFrame === 'undefined') return () => {}
  const { interval = 1000, onFps } = opts

  let rafId = 0
  let frames = 0
  let last = performance.now()

  const loop = (now: number) => {
    frames++
    if (now - last >= interval) {
      const fps = Math.round((frames * 1000) / (now - last))
      frames = 0
      last = now
      console.debug(`[perf] fps = ${fps}`)
      onFps?.(fps)
    }
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(rafId)
}

// ── 5. 内存采样（Chromium） ──

export interface MemorySample {
  usedJSHeapSize: number
  totalJSHeapSize: number
  usedHeapMB: number
}

/** 采样当前 JS 堆内存（仅 Chromium 支持，其余返回 null） */
export function sampleMemory(): MemorySample | null {
  if (!isPerfEnabled()) return null
  const mem = (
    performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }
  ).memory
  if (!mem) return null
  return {
    usedJSHeapSize: mem.usedJSHeapSize,
    totalJSHeapSize: mem.totalJSHeapSize,
    usedHeapMB: mem.usedJSHeapSize / (1024 * 1024),
  }
}

// ── 6. 一键启动组合监测（longtask + fps） ──

export interface PerfMonitorOptions {
  longTaskThreshold?: number
  fpsInterval?: number
  onLongTask?: (duration: number) => void
  onFps?: (fps: number) => void
}

/**
 * 一键启动组合监测（长任务 + 帧率），返回统一的停止函数。
 * 用于 dev 环境下挂在编辑器打开时，拖拽/缩放期间实时观察卡顿与掉帧。
 */
export function initPerfMonitor(opts: PerfMonitorOptions = {}): () => void {
  if (!isPerfEnabled()) return () => {}
  const stopLongTask = startLongTaskMonitor({
    threshold: opts.longTaskThreshold,
    onLongTask: opts.onLongTask,
  })
  const stopFps = startFpsMonitor({
    interval: opts.fpsInterval,
    onFps: opts.onFps,
  })
  return () => {
    stopLongTask()
    stopFps()
  }
}
