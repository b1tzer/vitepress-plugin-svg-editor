# 自定义插件

> 编辑器采用**纯函数式**插件体系，无需注册/生命周期，直接操作 Fabric.js 画布。

## 内置插件

所有编辑能力以纯函数模块从 `vitepress-plugin-svg-editor/plugins` 子路径导出：

```ts
import {
  align,          // 对齐（左/居中/右/顶/垂直居中/底）
  layer,          // 层级（前移/后移/置顶/置底）
  textFormat,     // 文字格式（字号/粗体/斜体/下划线/对齐/颜色）
  distribute,     // 等距分布（水平/垂直）
  applyGradient,  // 渐变填充（纯色/线性/径向）
  toggleShadow,   // 阴影开关
  applyShadow,    // 阴影参数
  mergeArrows,    // 箭头合并（line + polygon → Group）
} from 'vitepress-plugin-svg-editor/plugins'
```

## 插件形态

插件是一个接收 Fabric.js `Canvas` 并直接操作选中对象的纯函数，无 `install` / 生命周期回调：

```ts
import type { Canvas } from 'fabric'

// 示例：将所有选中对象左对齐到最左边界
function alignLeft(canvas: Canvas): void {
  const active = canvas.getActiveObjects()
  if (active.length < 2) return
  const minLeft = Math.min(...active.map((o) => o.left ?? 0))
  active.forEach((o) => {
    o.set({ left: minLeft })
    o.setCoords()
  })
  canvas.requestRenderAll()
}
```

## 编写自己的编辑函数

1. 定义一个接收 `Canvas`（及其它必要上下文）的纯函数
2. 在函数内通过 `canvas.getActiveObjects()` / `canvas.getActiveObject()` 获取选中对象
3. 修改对象属性后调用 `setCoords()` 与 `requestRenderAll()` 刷新画布

由于插件是纯函数，你可以直接在你的组件或自定义工具栏按钮中调用它们，无需任何注册步骤。

```ts
import { align } from 'vitepress-plugin-svg-editor/plugins'

// 在自定义按钮的点击回调里
align.left(canvas)
```

## 内置插件清单

| 插件          | 导出                        | 功能                                        |
| ------------- | --------------------------- | ------------------------------------------- |
| `align`       | `align`（命名空间）         | 对齐（左/居中/右/顶/垂直居中/底）           |
| `layer`       | `layer`（命名空间）         | 层级控制（上移/下移/置顶/置底）             |
| `textFormat`  | `textFormat`（命名空间）    | 文字格式（字号/加粗/斜体/下划线/对齐/颜色） |
| `distribute`  | `distribute`（命名空间）    | 等间距分布（水平/垂直）                     |
| `gradient`    | `applyGradient`             | 渐变填充（纯色/线性/径向）                  |
| `shadow`      | `toggleShadow` / `applyShadow` | 阴影开关与参数                            |
| `arrow-merger`| `mergeArrows`               | 箭头预处理（marker → polygon）              |

