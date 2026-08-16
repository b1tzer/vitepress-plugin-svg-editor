# 扩展点与事件

> 插件对外的扩展方式：组件事件 + 纯函数式编辑插件。

## 组件事件

编辑器通过 Vue 组件事件暴露扩展点，无需访问内部模块即可响应编辑器行为。

### SvgEditor 事件

| 事件名  | 参数 | 触发时机         |
| ------- | ---- | ---------------- |
| `close` | —    | 编辑器关闭时触发 |
| `saved` | —    | SVG 保存成功后触发 |

使用示例：

```html
<SvgEditor
  src="/diagrams/architecture.svg"
  @close="handleClose"
  @saved="handleSaved"
/>
```

### SvgDiagram 的编辑按钮

`SvgDiagram` 在悬停时显示「✏️ 编辑 SVG」按钮，点击后内嵌加载 `SvgEditor`。保存成功后会自动重新加载 SVG 内容，无需手动处理。

## 编辑插件（纯函数式）

编辑能力由 `src/plugins/` 下的纯函数模块提供，从 `vitepress-plugin-svg-editor/plugins` 子路径导入：

```ts
import { align, layer, textFormat, distribute, applyGradient, toggleShadow, applyShadow, mergeArrows } from 'vitepress-plugin-svg-editor/plugins'
```

这些函数直接操作 Fabric.js 画布对象，没有 `install` / 生命周期回调。详细的插件列表与自定义扩展方式见 [自定义插件](../guide/custom-plugins.md)。

## 关于内部模块

> ⚠️ 注意：`EventBus`、`PluginSystem`、`preprocessSvg`、`hexToCssVars` 等模块属于**内部实现细节**，并未从包的任何入口导出，**不属于公开 API**，请勿在业务代码中直接 `import`。它们在后续版本中可能随时调整，不受语义化版本约束。

