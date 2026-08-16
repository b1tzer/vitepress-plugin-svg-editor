/**
 * 全局类型声明 — 扩展 Window 接口
 *
 * 供 TypeScript 编译器识别 window.__fabricCanvas / window._clipboard 等全局变量。
 * 这些全局变量主要用于 E2E 测试（__fabricCanvas / __canvasMgr / __historyMgr）、
 * 剪贴板（_clipboard）与性能监测（__perfFps）。
 *
 * 注意：
 *   - fabric 已改为纯 ESM import，不再挂载到 window（仅测试钩子暴露实例引用）。
 *   - 测试钩子建议后续收敛到独立模块（见 issue #15），当前先补齐精确类型。
 */

import type { Canvas } from 'fabric'
import type { CanvasManager } from './CanvasManager'
import type { HistoryManager } from './HistoryManager'

declare global {
  interface Window {
    /** Fabric.js 命名空间（E2E 测试钩子，供 `new window.fabric.Rect()` 等构造对象） */
    fabric: typeof import('fabric')
    /** Fabric.js 画布实例（E2E 测试钩子） */
    __fabricCanvas: Canvas | null
    /** CanvasManager 实例（E2E 测试钩子） */
    __canvasMgr: CanvasManager | null
    /** HistoryManager 实例（E2E 测试钩子） */
    __historyMgr: HistoryManager | null
    /** 实时 FPS 监测值（仅 dev 环境写入，生产构建不暴露） */
    __perfFps?: number
  }
}

export {}
