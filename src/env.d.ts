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

// Vite define 注入的 E2E 测试模式开关（由 svgEditorPlugin 读取 SVG_EDITOR_E2E 环境变量注入）。
// 默认 false：真正的发布产物既不暴露测试钩子、也不显示「编辑 SVG」按钮，保持零污染。
// 仅 CI 测试专用构建（SVG_EDITOR_E2E=1）时为 true，使 vitepress preview 静态产物也能：
//   1) 在 testHooks.ts 中暴露 window.__fabricCanvas 等测试钩子；
//   2) 在 SvgDiagram.vue 中渲染「编辑 SVG」入口按钮（原本仅 dev 模式显示）。
declare const __SVG_EDITOR_E2E__: boolean | undefined
