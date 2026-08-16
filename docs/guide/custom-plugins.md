# 自定义插件

> 开发编辑器工具栏扩展，为 SVG 编辑器添加自定义功能。

## 插件接口

```ts
interface EditorPlugin {
  name: string // 唯一标识
  install(ctx: PluginContext): void // 安装回调
}

interface PluginContext {
  canvas: Canvas // Fabric.js 画布实例
  eventBus: EventBus // 事件总线（订阅选择、缩放等）
  historyManager: HistoryManager // 撤销/重做管理器
}
```

## 开发一个自定义插件

以下示例创建一个"导出 PNG"插件：

```ts
import type { EditorPlugin, PluginContext } from 'vitepress-plugin-svg-editor'

const exportPngPlugin: EditorPlugin = {
  name: 'export-png',
  install(ctx: PluginContext) {
    // 1. 在工具栏添加按钮（通过 Template Slot 或 DOM 操作）
    const toolbar = document.querySelector('.editor-toolbar')
    const btn = document.createElement('button')
    btn.innerHTML = '📥 导出 PNG'
    btn.onclick = () => {
      // 2. 使用 ctx.canvas 操作画布
      const dataUrl = ctx.canvas.toDataURL({ format: 'png', multiplier: 2 })
      const link = document.createElement('a')
      link.download = 'diagram.png'
      link.href = dataUrl
      link.click()
    }
    toolbar?.appendChild(btn)

    // 3. 可选：监听事件做响应
    ctx.eventBus.on('selectionChange' /* ... */)
  },
}
```

## 注册插件

```ts
import { PluginSystem } from 'vitepress-plugin-svg-editor'

const pluginSystem = new PluginSystem()
pluginSystem.register(exportPngPlugin)
pluginSystem.installAll({ canvas, eventBus, historyManager })
```

## 内置插件列表

| 插件名         | 功能                                        |
| -------------- | ------------------------------------------- |
| `align`        | 对齐（左/居中/右/顶/垂直居中/底）           |
| `layer`        | 层级控制（上移/下移/置顶/置底）             |
| `text-format`  | 文字格式（字号/加粗/斜体/下划线/对齐/颜色） |
| `distribute`   | 等间距分布（水平/垂直）                     |
| `gradient`     | 渐变编辑器                                  |
| `shadow`       | 阴影编辑器                                  |
| `arrow-merger` | 箭头预处理（marker → polygon）              |
