# 02 — npm 包设计

## 包名（待定）

| 候选                                      | 命名空间    | 优点           | 缺点           |
| ----------------------------------------- | ----------- | -------------- | -------------- |
| `vitepress-plugin-svg-editor`             | 无          | 直白，SEO 友好 | 重名风险       |
| `@java-world/vitepress-plugin-svg-editor` | @java-world | 组织标识       | 仅限本项目使用 |
| `@scope/vitepress-svg-editor`             | @scope      | 灵活           | 需确定 scope   |

## 目录结构

```
vitepress-plugin-svg-editor/
├── src/
│   ├── core/                    # 内核层（框架无关）
│   │   ├── CanvasManager.ts     # Fabric.js 画布管理
│   │   ├── HistoryManager.ts    # 撤销/重做
│   │   ├── SvgLoader.ts         # SVG 加载 + 预处理
│   │   ├── SvgSerializer.ts     # SVG 序列化 + 后处理
│   │   ├── PluginSystem.ts      # 插件注册/调度
│   │   ├── EventBus.ts          # 事件总线
│   │   └── types.ts             # 内核类型定义
│   │
│   ├── adapters/                # 适配层
│   │   ├── storage/
│   │   │   ├── StorageAdapter.interface.ts
│   │   │   ├── VitePressSaveAdapter.ts    # 默认实现
│   │   │   └── LocalStorageAdapter.ts     # 浏览器 localStorage
│   │   ├── theme/
│   │   │   ├── ThemeAdapter.interface.ts
│   │   │   └── VitePressThemeAdapter.ts   # 从 useData().isDark 读取
│   │   └── render/
│   │       ├── RenderAdapter.interface.ts
│   │       └── FabricRenderAdapter.ts
│   │
│   ├── plugins/                 # 内置编辑插件
│   │   ├── align.ts
│   │   ├── layer.ts
│   │   ├── text-format.ts
│   │   ├── distribute.ts
│   │   ├── gradient.ts
│   │   ├── shadow.ts
│   │   └── index.ts             # 插件统一导出
│   │
│   ├── components/              # Vue 组件（VitePress 适配）
│   │   ├── SvgDiagram.vue       # 展示组件
│   │   ├── SvgEditor.vue        # 编辑器弹窗（defineClientComponent 包裹）
│   │   └── sub/                 # 子组件
│   │       ├── EditorToolbar.vue
│   │       ├── EditorCanvas.vue
│   │       └── EditorStatusbar.vue
│   │
│   ├── node/                    # Node 端入口（Vite 插件）
│   │   ├── index.ts             # definePlugin 导出
│   │   ├── vite-plugin.ts       # Vite 插件实现（save 端点）
│   │   └── markdown-plugin.ts   # Markdown-it 插件（可选）
│   │
│   └── client/                  # 浏览器端入口
│       └── index.ts             # enhanceApp 函数导出
│
├── package.json
├── tsconfig.json
├── unbuild.config.ts            # 或 tsdown.config.ts
└── README.md
```

## package.json 关键字段

```jsonc
{
  "name": "vitepress-plugin-svg-editor",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/node/index.mjs",
  "types": "./dist/node/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/node/index.d.ts",
      "import": "./dist/node/index.mjs",
      "require": "./dist/node/index.cjs",
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "import": "./dist/client/index.mjs",
    },
    "./components/*": "./dist/components/*",
  },
  "files": ["dist"],
  "peerDependencies": {
    "vitepress": "^1.0.0",
    "vue": "^3.2.0",
    "fabric": "^6.0.0",
  },
  "peerDependenciesMeta": {
    "fabric": { "optional": true },
  },
  "devDependencies": {
    "unbuild": "^2.0.0",
    "typescript": "^5.0.0",
    "vitepress": "^1.0.0",
    "vue": "^3.2.0",
    "fabric": "^6.0.0",
  },
}
```

### exports 字段设计要点

| 入口             | 用途                          | 导入方式                                                           |
| ---------------- | ----------------------------- | ------------------------------------------------------------------ |
| `.`              | VitePress 配置中使用          | `import { svgEditorPlugin } from 'pkg'`                            |
| `./client`       | VitePress theme/index.ts 使用 | `import 'pkg/client'` 或 `import { enhanceApp } from 'pkg/client'` |
| `./components/*` | 按需导入独立组件              | `import SvgDiagram from 'pkg/components/SvgDiagram.vue'`           |

### 为什么 fabric 是 optional peerDependency

- 如果用户已有 Fabric.js（如当前项目 CDN 加载），不需要重复打包
- 如果用户没装，插件在 `enhanceApp` 中检测并给出清晰报错，不静默失败
- CDN 加载方案作为备选：插件可以内置一个 fallback CDN 加载器

## 构建工具选型

| 工具              | 优点                                             | 缺点                            | 结论    |
| ----------------- | ------------------------------------------------ | ------------------------------- | ------- |
| **unbuild**       | 零配置，自动处理 .mjs/.cjs/.d.ts，支持 stub mode | 社区相对小                      | ✅ 首选 |
| tsdown            | 新兴工具，速度快                                 | 生态不成熟                      | 备选    |
| Vite library mode | 与项目技术栈一致                                 | 需要手动配置多入口 + .d.ts 生成 | 次选    |
| Rollup 裸写       | 最灵活                                           | 配置复杂，维护成本高            | ❌ 不选 |

## peerDependencies 版本策略

```jsonc
{
  "peerDependencies": {
    "vitepress": ">=1.0.0 <2.0.0", // VitePress 2.x 还没出，先锁 1.x
    "vue": ">=3.2.0 <4.0.0", // Vue 3.x only
    "fabric": ">=6.0.0 <7.0.0", // Fabric 6.x，5.x 已停止维护
  },
}
```

### 版本兼容声明（放在 README 中）

| 依赖      | 支持版本                                      | 测试覆盖                  |
| --------- | --------------------------------------------- | ------------------------- |
| VitePress | 1.0.0 - 1.6.x                                 | CI 矩阵测试 1.0, 1.3, 1.6 |
| Node.js   | 18 LTS, 20 LTS, 22 LTS                        | CI 矩阵全覆盖             |
| 浏览器    | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ | Playwright E2E            |
