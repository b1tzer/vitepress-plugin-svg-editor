/**
 * 全局类型声明 — 扩展 Window 接口
 *
 * 供 TypeScript 编译器识别 window.fabric / window.__fabricCanvas 等全局变量
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    fabric: any
    __fabricCanvas: any
    __canvasMgr: any
    _clipboard: any
  }
}

export {}
