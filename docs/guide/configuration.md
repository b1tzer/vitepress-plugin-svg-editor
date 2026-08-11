# 配置指南

> SvgEditor 组件的完整配置项和使用方式。

## 组件 Props

### SvgDiagram

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | 必填 | SVG 文件路径（相对于 `public/` 目录） |

```html
<SvgDiagram src="/diagrams/architecture.svg" />
```

### SvgEditor

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | 必填 | 要编辑的 SVG 文件路径 |
| `showThemeToggle` | `boolean` | `true` | 是否显示暗色/亮色主题切换按钮 |

### SvgEditor Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `close` | — | 编辑器关闭时触发 |
| `saved` | — | SVG 保存成功后触发 |

## 主题定制

编辑器通过 CSS 变量暴露样式定制点：

```css
/* docs/.vitepress/theme/custom.css */
.editor-overlay {
  /* 覆盖背景遮罩 */
  --svg-editor-overlay-bg: rgba(15, 15, 15, 0.85);
}

.editor-panel {
  /* 覆盖面板样式 */
  --svg-editor-panel-bg: #1a1a1a;
  --svg-editor-panel-radius: 12px;
}

.editor-toolbar button {
  /* 覆盖工具栏按钮 */
  --svg-editor-btn-hover-bg: rgba(255,255,255,0.1);
}
```

## Markdown 语法

### 手动使用组件

```md
<SvgDiagram src="/diagrams/my-chart.svg" />
```

### 自动拦截（默认启用）

```md
![我的图表](/diagrams/my-chart.svg)
```

自动拦截由 `svgDiagramMarkdownPlugin` 实现，所有 `.svg` 结尾的图片都会被转换为 `<SvgDiagram>` 组件。

要禁用自动拦截：

```ts
// docs/.vitepress/config.mts
export default defineConfig({
  markdown: {
    config(md) {
      md.use(svgDiagramMarkdownPlugin, { markdownSyntax: false })
    },
  },
})
```
