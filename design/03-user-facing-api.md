# 03 — 用户侧 API 设计

## 目标体验

### 方式一：Markdown 原生图片语法（推荐）

用户只需要在 Markdown 里正常写图片：

```md
## 架构图

![类型体系架构图](/diagrams/type-hierarchy.svg)
```

插件在构建时自动将 `![alt](xxx.svg)` 替换为 `<SvgDiagram>` 组件，用户获得完整的编辑能力。

**零学习成本，不改变写作习惯。**

> 原理：markdown-it `renderer.rules.image` 拦截 + 替换。详见 [markdown-syntax.md](./markdown-syntax.md)。

### 方式二：Vue 组件标签（兼容写法）

如果用户更倾向显式控制，也可以用 Vue 组件标签：

```md
<SvgDiagram src="/diagrams/type-hierarchy.svg" />
```

两种写法完全等价，用户按习惯选择。

### 插件配置（一行即可）

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  plugins: [
    svgEditorPlugin({
      // 所有配置都有默认值，这里只覆盖需要的
      storage: 'vitepress',    // 'vitepress' | 'localStorage' | CustomStorageAdapter
      saveDir: 'public/diagrams/', // 默认保存目录
      theme: 'auto',           // 'auto' | 'light' | 'dark' | ThemeAdapter
    })
  ]
})
```

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import 'vitepress-plugin-svg-editor/client'  // 自动注册 SvgDiagram 和 SvgEditor

export default {
  extends: DefaultTheme,
  // 不需要手动 app.component() 注册
}
```

Markdown 中使用：

```md
## 架构图

<SvgDiagram src="/diagrams/my-architecture.svg" />
```

## 插件配置项（完整）

```ts
interface SvgEditorPluginOptions {
  /**
   * 存储适配器
   * - 'vitepress': 通过 Vite 插件保存到文件系统（默认）
   * - 'localStorage': 保存到浏览器 localStorage（仅预览模式）
   * - CustomStorageAdapter 实例：自定义保存逻辑
   */
  storage?: 'vitepress' | 'localStorage' | StorageAdapter

  /**
   * SVG 文件保存目录（相对于 VitePress 项目根目录）
   * 默认：'public/diagrams/'
   * 仅 storage='vitepress' 时生效
   */
  saveDir?: string

  /**
   * 保存端点路径
   * 默认：'/__svg-save__'
   * 仅 storage='vitepress' 时生效
   */
  saveEndpoint?: string

  /**
   * 主题模式
   * - 'auto': 跟随 VitePress 的 isDark（默认）
   * - 'light': 始终亮色
   * - 'dark': 始终暗色
   * - CustomThemeAdapter 实例：自定义主题逻辑
   */
  theme?: 'auto' | 'light' | 'dark' | ThemeAdapter

  /**
   * CSS 变量 → 颜色值映射表
   * 编辑器需要将 CSS 变量（如 var(--vp-c-brand-1)）解析为实际颜色值
   * 默认提供 VitePress 默认主题的完整映射
   */
  cssVariableMap?: Record<string, string>

  /**
   * SVG 预处理钩子（加载 SVG 后、传给 Fabric.js 之前）
   * 可在此修改/清理 SVG 内容
   */
  preprocess?: (svgText: string) => string

  /**
   * SVG 后处理钩子（Fabric.js 导出 SVG 后、保存之前）
   * 可在此恢复 CSS 变量、添加属性等
   */
  postprocess?: (svgText: string) => string

  /**
   * 内置插件列表
   * 默认启用：['align', 'layer', 'text-format', 'distribute']
   * 可选：['gradient', 'shadow']
   */
  builtinPlugins?: string[]

  /**
   * 自定义编辑器插件
   */
  customPlugins?: EditorPlugin[]

  /**
   * 编辑器工具栏配置
   * 可定制按钮顺序、可见性
   */
  toolbar?: ToolbarConfig

  /**
   * Fabric.js Canvas 配置
   * 透传给 new fabric.Canvas(el, options)
   */
  canvasOptions?: Partial<fabric.CanvasOptions>
}
```

## 组件 Props

### SvgDiagram（展示组件）

```ts
interface SvgDiagramProps {
  /** SVG 文件路径（相对于 public 目录） */
  src: string
  /** 是否显示编辑按钮（默认：开发模式下显示） */
  editable?: boolean
  /** 自定义 CSS class */
  class?: string
}
```

### SvgEditor（编辑器弹窗）

```ts
interface SvgEditorProps {
  /** SVG 文件路径 */
  src: string
  /** 关闭回调 */
  onClose?: () => void
  /** 保存成功回调 */
  onSaved?: () => void
}
```

## 生命周期钩子（Plugin Hooks）

```ts
interface EditorHooks {
  /** SVG 加载前，可返回修改后的 URL */
  onBeforeLoad?: (src: string) => string | Promise<string>

  /** SVG 加载完成、Canvas 初始化之后 */
  onAfterLoad?: (canvas: fabric.Canvas, svgText: string) => void

  /** 保存前，可返回修改后的 SVG 文本 */
  onBeforeSave?: (svgText: string) => canvas.fabric.Object[]

  /** 保存完成后 */
  onAfterSave?: (result: { success: boolean; path?: string; error?: Error }) => void

  /** 选中对象变化 */
  onSelect?: (objects: fabric.Object[]) => void

  /** 对象被修改（拖拽、缩放、属性变更） */
  onModify?: (objects: fabric.Object[]) => void

  /** 编辑器关闭 */
  onClose?: () => void
}
```

## StorageAdapter 接口

```ts
interface StorageAdapter {
  /** 保存 SVG 文本到目标位置，返回成功与否 */
  save(svgText: string, sourcePath: string): Promise<SaveResult>

  /** 加载 SVG 文本 */
  load(sourcePath: string): Promise<string>
}

interface SaveResult {
  success: boolean
  path?: string    // 保存后的实际路径
  error?: Error    // 错误信息
}
```

## ThemeAdapter 接口

```ts
interface ThemeAdapter {
  /** 返回当前是否为暗色模式 */
  isDark(): boolean | Ref<boolean>

  /** 获取 CSS 变量值（如 '--vp-c-brand-1' → '#646cff'） */
  getCSSVariableValue(varName: string): string

  /** 主题变化时的回调注册 */
  onChange(callback: (isDark: boolean) => void): void
}
```

## 使用示例

### 自定义存储（保存到后端 API）

```ts
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

const myStorage: StorageAdapter = {
  async save(svgText, sourcePath) {
    const res = await fetch('/api/svg/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: sourcePath, content: svgText })
    })
    return { success: res.ok }
  },
  async load(sourcePath) {
    const res = await fetch(`/api/svg/load?path=${sourcePath}`)
    return res.text()
  }
}

export default defineConfig({
  plugins: [svgEditorPlugin({ storage: myStorage })]
})
```

### 自定义 CSS 变量映射

```ts
svgEditorPlugin({
  cssVariableMap: {
    '--my-brand-color': '#ff6600',
    '--my-bg-color': '#fafafa',
    '--my-dark-brand-color': '#ff9944',
    '--my-dark-bg-color': '#1a1a1a',
  }
})
```
