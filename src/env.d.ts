/**
 * 全局类型补充 — Vue SFC 和 Vite ImportMeta
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// 补充 import.meta.env 类型（无需安装 vite）
interface ImportMetaEnv {
  readonly SSR: boolean
  readonly DEV: boolean
  readonly BASE_URL: string
  [key: string]: string | boolean | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}