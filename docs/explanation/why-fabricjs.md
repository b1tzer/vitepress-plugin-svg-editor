# 为什么选择 Fabric.js

> 技术选型背后的权衡与思考。

## 问题

VitePress 文档站点需要嵌入**可交互的 SVG 编辑器**。核心需求：

1. 用户在浏览器中直接拖拽、缩放、修改 SVG 元素
2. 编辑后的 SVG 能正确保存为标准格式，不丢失属性
3. 支持暗色/亮色主题切换时 SVG 内颜色同步变化
4. 提供撤销/重做、对齐、层级控制等编辑操作

## 候选方案

| 方案             | 描述                           | 优点                                        | 缺点                                     |
| ---------------- | ------------------------------ | ------------------------------------------- | ---------------------------------------- |
| **原生 SVG DOM** | 直接在 `<svg>` 元素上绑定事件  | 标准 SVG 输出、零依赖                       | 无选择框/控制手柄、需自行实现所有交互    |
| **Fabric.js**    | Canvas-based SVG 渲染 + 交互库 | 开箱即用的编辑体验、丰富的插件生态          | 输出需后处理（data-fabric-*、rgb→hex）   |
| **Konva.js**     | 另一个 Canvas 库               | 比 Fabric 更现代的 API、TypeScript 原生支持 | 社区规模小于 Fabric、SVG 导入不如 Fabric |
| **SVG.js**       | SVG DOM 操作库                 | 标准 SVG 输出                               | 无内置编辑器交互                         |

## 决策

**选择 Fabric.js v6.x**。

### 理由

1. **交互开箱即用**：选择框、缩放控制点、旋转手柄、拖拽移动 — 这些都是 Fabric.js 内置的，用原生 SVG DOM 需要数千行代码

2. **社区成熟**：Fabric.js 是 GitHub 上最活跃的 Canvas 库之一（27k+ stars），意味着：
   - Stack Overflow 上有大量问答可参考
   - Bug 修复速度有保障
   - 第三方插件和教程丰富

3. **我们项目已验证**：在 java-world 项目中，基于 Fabric.js 的编辑器已稳定运行数月，经过了 200+ 张 SVG 图表的实战检验

### 代价

1. **输出后处理**：Fabric.js 的 `toSVG()` 输出不是标准 SVG — 需要移除 `data-fabric-*` 属性、`rgb()`→`hex`、恢复 `viewBox` 等。我们通过 `SvgSerializer` + `postprocessor` 链式处理解决。

2. **CSS 变量不识别**：Fabric.js 无法理解 `fill="var(--vp-c-brand-1)"`。我们通过 `preprocessor` 在加载时将 CSS 变量展开为具体的 hex 值，保存时再通过 `hexToCssVars` 还原。

3. **`<marker>` 不支持**：Fabric.js 没有箭头标记的概念。我们通过 `arrow-merger` 插件将 `<marker>` → `<polygon>`，让箭头在 Canvas 中也能正确显示。

## 不选什么、为什么

| 方案             | 为什么不选                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| **原生 SVG DOM** | 需要从零实现完整的编辑器交互层，ROI 极低                               |
| **Konva.js**     | API 更现代，但 SVG 导入/导出不如 Fabric 成熟，且我们没有迁移的商业动力 |
| **SVG.js**       | 它只是 SVG DOM 操作库，不提供编辑器 UI 能力                            |

## 参考

- [Fabric.js 官方文档](http://fabricjs.com/)
- [Fabric.js GitHub](https://github.com/fabricjs/fabric.js)
- [Konva vs Fabric 对比](https://konvajs.org/docs/sandbox/Comparison.html)
