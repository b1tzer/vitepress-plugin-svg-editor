# 生命周期钩子 API

> 编辑器核心事件钩子，用于扩展编辑器行为。

## 事件总线

`EventBus` 是编辑器的核心事件系统，所有 Canvas 事件通过它广播。

### Canvas 事件

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| `zoomChange` | `(level: number)` | 缩放级别变化 |
| `guideLinesChange` | `(lines: GuideLine[])` | 对齐辅助线变化 |
| `selectionChange` | `(obj: fabric.Object \| null)` | 选中对象变化 |
| `modified` | `(obj: fabric.Object)` | 对象被修改（拖拽/缩放/旋转后） |

### 使用示例

```ts
import { EventBus } from 'vitepress-plugin-svg-editor'

const bus = new EventBus()

// 监听选区变化
bus.on('selectionChange', (obj) => {
  if (obj) {
    console.log('选中:', obj.type, '颜色:', obj.fill)
  } else {
    console.log('取消选中')
  }
})

// 监听缩放
bus.on('zoomChange', (level) => {
  console.log(`当前缩放: ${level}%`)
})
```

## PluginSystem 钩子

插件通过 `install(ctx)` 获取上下文，可以访问画布和事件总线：

```ts
interface PluginContext {
  canvas: Canvas
  eventBus: EventBus
  historyManager: HistoryManager
}
```

## 自定义预处理/后处理钩子

通过 `preprocessSvg` 和 `postprocess` 管道自定义 SVG 变换逻辑：

```ts
import { preprocessSvg } from 'vitepress-plugin-svg-editor'
import { hexToCssVars } from 'vitepress-plugin-svg-editor'

// 预处理（加载时）
const result = preprocessSvg(rawSvg, 'light')
// result.svg 已展开 CSS 变量、转换 marker、清理非法属性

// 后处理（保存时）
const cleanSvg = hexToCssVars(editedSvg)
// 将 hex 颜色还原为 CSS 变量
```
