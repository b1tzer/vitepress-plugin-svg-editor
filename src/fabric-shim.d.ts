/**
 * fabric 模块类型替身（shim）
 *
 * fabric@5.5.2 无官方 @types/fabric 包，此文件提供最低限度的类型声明，
 * 使 `import type { Canvas } from 'fabric'` 通过 tsc 类型检查。
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'fabric' {
  const fabric: any
  export default fabric
  export { fabric }

  // 满足 import type 需求的最小类型别名
  export type Canvas = any
  export type Object = any
  export type IText = any
  export type Textbox = any
  export type Group = any
  export type Image = any
  export type Rect = any
  export type Circle = any
  export type Line = any
  export type Polygon = any
  export type Path = any
  export type Point = any
  export type Gradient = any
  export type Shadow = any
}
