# 配置指南

> SvgEditor 组件的完整配置项和使用方式。

## 组件 Props

### SvgDiagram

| Prop  | 类型     | 默认值 | 说明                                  |
| ----- | -------- | ------ | ------------------------------------- |
| `src` | `string` | 必填   | SVG 文件路径（相对于 `public/` 目录） |

```html
<SvgDiagram src="/diagrams/architecture.svg" />
```

### SvgEditor

| Prop              | 类型      | 默认值 | 说明                          |
| ----------------- | --------- | ------ | ----------------------------- |
| `src`             | `string`  | 必填   | 要编辑的 SVG 文件路径         |
| `showThemeToggle` | `boolean` | `true` | 是否显示暗色/亮色主题切换按钮 |

### SvgEditor Events

| 事件    | 参数 | 说明               |
| ------- | ---- | ------------------ |
| `close` | —    | 编辑器关闭时触发   |
| `saved` | —    | SVG 保存成功后触发 |

## 主题定制

### 编辑器明暗主题

编辑器通过 `.theme-light` / `.theme-dark` class 自动切换明暗主题，由 `showThemeToggle` prop 控制是否显示切换按钮：

```html
<SvgEditor src="/diagrams/my-chart.svg" :show-theme-toggle="true" />
```

`showThemeToggle` 为 `true`（默认）时，工具栏会显示明暗主题切换按钮；设为 `false` 则隐藏该按钮。

### 图表配色变量

SVG 图表内部颜色建议使用以下 CSS 变量（亮色/暗色自动适配）：

```css
:root {
  --diagram-surface-1: #ffffff;  /* 背景面 */
  --diagram-stroke-1: #bdbdbd;   /* 边框线 */
  --diagram-text-1: #333333;     /* 文字 */
  --diagram-accent-1: #1565c0;   /* 强调色 */
  --diagram-arrow: #555555;      /* 箭头/连线 */
}
.dark {
  --diagram-surface-1: #1a1a1a;
  /* ... 暗色配色 */
}
```

在你的 SVG 中直接引用这些变量：

```xml
<rect fill="var(--diagram-surface-1)" stroke="var(--diagram-stroke-1)" />
```

编辑保存时，插件会自动将 CSS 变量还原，保证明暗主题下图表颜色同步变化。

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
