# VitePress SVG Editor — 最小示例

> `git clone` → `pnpm install` → `pnpm docs:dev` 即可体验。

## 快速启动

```bash
cd examples/basic
pnpm install
pnpm docs:dev
```

浏览器打开 `http://localhost:5173`，将鼠标悬停在 SVG 图表上，点击「✏️ 编辑 SVG」按钮。

## 目录结构

```
examples/basic/
├── package.json
└── docs/
    ├── index.md
    ├── public/diagrams/
    │   └── test.svg
    └── .vitepress/
        ├── config.mts
        └── theme/
            └── index.ts
```
