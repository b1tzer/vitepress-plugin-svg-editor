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

// Vite define 注入的存储模式常量（由 svgEditorPlugin 的 storage 选项注入，
// 供客户端 SvgEditor.vue 选择 VitePressSaveAdapter 或 LocalStorageAdapter）
declare const __SVG_EDITOR_STORAGE__: 'vitepress' | 'localStorage' | undefined

// Vite define 注入的保存端点（由 svgEditorPlugin 的 saveEndpoint 选项注入，
// 供客户端 SvgEditor.vue 构造 VitePressSaveAdapter，避免自定义端点后保存失败）
declare const __SVG_EDITOR_SAVE_ENDPOINT__: string | undefined
