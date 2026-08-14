# VitePress SVG Editor — 示例项目

> 最小可运行示例，展示 `vitepress-plugin-svg-editor` 的集成方式。

## 快速启动

本项目为 pnpm workspace 的一部分，在仓库根目录执行一次 `pnpm install` 即可装齐所有依赖（含本示例）。

```bash
# 在仓库根目录
pnpm install

# 启动示例文档站点
pnpm --dir examples/basic docs:dev
```

浏览器打开 `http://localhost:5173`，将鼠标悬停在 SVG 图表上，点击「✏️ 编辑 SVG」按钮即可体验。

## 页面

- `index.md` — 首页，包含两张可编辑 SVG（基础 + 复杂场景）
- `features.md` — 功能特性页，演示多页面下的 SVG 编辑

## 目录结构

```
examples/basic/
├── package.json
└── docs/
    ├── index.md
    ├── features.md
    ├── public/diagrams/
    │   ├── test.svg          # 基础示例
    │   └── test-complex.svg  # 复杂示例（CSS 变量 + 多元素）
    └── .vitepress/
        ├── config.mts
        └── theme/
            └── index.ts
```
