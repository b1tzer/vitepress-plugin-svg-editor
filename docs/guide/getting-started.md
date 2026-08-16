# 快速开始

> 5 分钟内在你的 VitePress 项目中集成可交互的 SVG 编辑器。

## 前提条件

- VitePress ≥ 1.0.0
- Node.js ≥ 18

## 第 1 步：安装

```bash
pnpm add vitepress-plugin-svg-editor
```

如果项目中尚未安装 Fabric.js（用于 Canvas 渲染）：

```bash
pnpm add fabric
```

## 第 2 步：配置 VitePress

编辑 `docs/.vitepress/config.mts`，添加两行：

```ts
import { svgEditorPlugin, svgDiagramMarkdownPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(svgDiagramMarkdownPlugin) // ← 让 Markdown 中的 .svg 图片变为可编辑的
    },
  },
  vite: {
    plugins: [
      svgEditorPlugin({ saveDir: 'docs/public/diagrams' }), // ← 注册保存端点
    ],
  },
})
```

## 第 3 步：注册组件

编辑 `docs/.vitepress/theme/index.ts`：

```ts
import DefaultTheme from 'vitepress/theme'
import { SvgDiagram, SvgEditor } from 'vitepress-plugin-svg-editor/client'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SvgDiagram', SvgDiagram)
    app.component('SvgEditor', SvgEditor)
  },
}
```

## 第 4 步：使用

在 Markdown 中放一张 `.svg` 图片：

```md
<SvgDiagram src="/diagrams/architecture.svg" />
```

也可以用原生 Markdown 图片语法（自动拦截）：

```md
![架构图](/diagrams/architecture.svg)
```

启动 dev 服务器，把鼠标悬停在 SVG 图表上，点击 **"✏️ 编辑 SVG"** 按钮即可进入编辑器。

## 下一步

- [配置参考](./configuration.md) — 了解完整的配置选项
- [自定义存储](./custom-storage.md) — 把 SVG 保存到 S3、REST API 等
- [自定义插件](./custom-plugins.md) — 开发编辑器工具栏扩展
