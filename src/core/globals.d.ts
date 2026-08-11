/**
 * 全局类型声明 — 扩展 Window 接口
 *
 * 供 TypeScript 编译器识别 window.__fabricCanvas / window._clipboard 等全局变量
 * 注意：fabric 已改为纯 ESM import，不再挂载到 window
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    __fabricCanvas: any
    __canvasMgr: any
    _clipboard: any
  }
}

export {}
