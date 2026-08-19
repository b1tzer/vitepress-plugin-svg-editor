# 功能特性

> 本页用于演示多页面场景下的 SVG 编辑能力。

## 基础编辑

![测试 SVG](/diagrams/test.svg)

## 复杂场景

![复杂测试 SVG](/diagrams/test-complex.svg)

## 决策树（9 箭头）

![决策树](/diagrams/decision-tree.svg)

## 明暗主题自适应

切换右上角的明暗主题开关，上方的 SVG 图会自动适配：

- 使用 `var(--diagram-*)` 语义变量的颜色随主题精确切换；
- 未命中的自定义色（裸 hex）在 OKLCH 感知色彩空间中做亮度翻转，自动获得协调的暗色。

---

返回 [首页](./index.md) 查看最小示例。
