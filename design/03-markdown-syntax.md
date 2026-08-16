# 03a — Markdown 原生语法方案

## 问题

用户是否必须写 `<SvgDiagram src="/diagrams/foo.svg" />` 这种 Vue 组件标签？能不能用标准 Markdown 语法？

```md
## 架构图

![架构图](/diagrams/my-architecture.svg)
```

## 答案：可以，而且推荐

通过 **markdown-it `renderer.rules.image` 拦截替换** 机制，插件在构建时自动将 `![alt](xxx.svg)` 转换为 `<SvgDiagram>` Vue 组件。

**用户完全不需要写 Vue 标签**，标准 Markdown 图片语法即可获得编辑能力。

## 三种可行方案对比

| 方案                    | 用户语法                              | 优点                                                          | 缺点                                        |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **A. 镜像拦截（推荐）** | `![alt](/diagrams/foo.svg)`           | 完全标准 Markdown；其他 MD 阅读器也能看到图片；用户零学习成本 | 非 `.svg` 后缀的图片不会被拦截，需处理边界  |
| B. 自定义容器           | `:::svg-editor /diagrams/foo.svg :::` | 语义明确；不污染标准图片语法                                  | 非标准 Markdown；其他 MD 阅读器无法预览     |
| C. Alt Text 标记        | `![edit](/diagrams/foo.svg)`          | 语法干净                                                      | 语义 hack；alt 文本不能表达真实含义；SEO 差 |

**推荐方案 A**。理由：

1. 完全标准 Markdown，不破坏可移植性——在 GitHub、Obsidian、iA Writer 等其他工具中 `![alt](path.svg)` 正常显示为图片
2. VitePress 社区大量使用此模式：nolebase 的 `markdown-it-unlazy-img`、medium-zoom 图片预览、响应式图片插件等
3. VitePress 官方 issue #2302 明确讨论和支持这种「Markdown 图片→Vue 组件替换」的架构
4. 对 `.svg` 后缀做条件过滤，非 SVG 图片继续走默认 `<img>` 渲染，互不干扰

## 实现原理

```ts
// 插件内置的 markdown-it 规则（用户无感）
import type MarkdownIt from 'markdown-it'

export function svgEditorMarkdownPlugin(md: MarkdownIt) {
  // 保存原始 image 渲染规则
  const defaultImageRender = md.renderer.rules.image!

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const src = token.attrGet('src') || ''

    // 只拦截 .svg 文件
    if (src.endsWith('.svg')) {
      const alt = token.content
      // 渲染为 <SvgDiagram> 组件而不是 <img>
      return `<SvgDiagram src="${src}" alt="${alt}" />`
    }

    // 非 SVG 图片走默认渲染
    return defaultImageRender(tokens, idx, options, env, self)
  }
}
```

## 用户最终使用方式

```md
<!-- 标准 Markdown 写法，自动获得编辑能力 -->

![类型体系架构图](/diagrams/type-hierarchy.svg)

<!-- 普通 PNG 图片不受影响 -->

![截图](/diagrams/screenshot.png)
```

```ts
// .vitepress/config.ts — 一行配置即可
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  plugins: [
    svgEditorPlugin({
      // markdownSyntax: true 是默认值，开启了 markdown-it 自动拦截
      // 如果设为 false，则退化为必须用 <SvgDiagram> 标签
    }),
  ],
})
```

用户仍然可以用 `<SvgDiagram src="..." />`标签（兼容写法），但文档推荐用标准 Markdown 图片语法。

## 兼容性保证

| 场景                       | 行为                                          |
| -------------------------- | --------------------------------------------- |
| `![alt](foo.svg)`          | ✅ 转换为 `<SvgDiagram>`，可编辑              |
| `![alt](foo.png)`          | ✅ 保持 `<img>` 标签，不拦截                  |
| `![alt](foo.jpg)`          | ✅ 保持 `<img>` 标签，不拦截                  |
| `<SvgDiagram src="..." />` | ✅ 直接使用 Vue 组件（兼容写法）              |
| `<img src="foo.svg" />`    | ❌ 原始 HTML 标签不经过 markdown-it，不会转换 |

## 已知限制

1. **HTML `<img>` 标签不拦截**：如果用户写的是 `<img src="foo.svg">`（而不是 `![alt](foo.svg)`），markdown-it 不会处理它，走的是 `html_block`/`html_inline` token 类型。解决方案：在文档中引导用户使用标准 Markdown 语法。
2. **非 `.svg` 后缀**：某些 SVG 文件可能用查询参数（如 `diagram?type=svg`），需要额外配置 `svgPattern` 匹配规则。
3. **SSR 安全**：拦截生成的是 `<SvgDiagram>` 组件标签，该组件内部不操作 Canvas（Canvas 在 SvgEditor 中，由 `defineClientComponent` 包裹），SSR 安全。

## 社区参照

| 项目                              | 做法                                                      | 链接                                                                                |
| --------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| nolebase markdown-it-unlazy-img   | 劫持 image token，替换为 `<NolebaseUnlazyImg>` 自定义标签 | [nolebase-integrations](https://nolebase-integrations.ayaka.io/)                    |
| VitePress 图片预览（medium-zoom） | 劫持 image renderer，包一层 `<a>` 或 `<div>` 支持点击放大 | [VitePress #2302](https://github.com/vuejs/vitepress/discussions/2302)              |
| markdown-it-image-figures         | 标准 `![alt](src "title")` → `<figure><img/><figcaption>` | [npm](https://www.npmjs.com/package/markdown-it-image-figures)                      |
| 响应式图片插件                    | `![alt](src)` → `<base-img>` 组件                         | [codlin.me](https://codlin.me/blog-ocean-world/add-responsive-images-to-vite-press) |

这些项目都采用了同一个模式：**不改变用户写作习惯 + 构建时自动增强**。我们的 SVG 编辑器插件应该跟随这个范式。
