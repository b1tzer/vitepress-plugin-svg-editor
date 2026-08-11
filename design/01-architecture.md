# 01 — 插件架构设计

## 核心原则

1. **内核与宿主解耦**：纯 JS/TS 内核不依赖 VitePress、Vue、Fabric.js 之外的特定框架
2. **三层分离**：内核层 → 适配层 → 宿主注入层，每层可独立测试
3. **协议优先**：先定义接口，再写实现；所有公开 API 必须类型安全
4. **原生 Markdown 优先**：用户用标准 `![alt](diagram.svg)` 即可获得编辑能力，通过 markdown-it `renderer.rules.image` 拦截替换为 `<SvgDiagram>` 组件，不强制写 Vue 标签

## 架构分层

```
┌──────────────────────────────────────────────────────────────┐
│                    宿主注入层（VitePress 专用）                  │
│                                                              │
│   config.ts 中：                                              │
│     import { svgEditorPlugin } from 'vitepress-plugin-svg-editor' │
│     export default defineConfig({ plugins: [svgEditorPlugin()] }) │
│                                                              │
│   theme/index.ts 中（自动或手动）：                             │
│     import 'vitepress-plugin-svg-editor/client'              │
│                                                              │
│   这一层负责：                                                 │
│   - 注册 Vite 插件（/__svg-save__ 端点 or 自定义 adapter）      │
│   - 注册全局 Vue 组件（SvgDiagram, SvgEditor）                │
│   - 注入 Markdown-it 插件（可选，如果要在 md 中直接写组件标签）   │
└──────────────────────────┬───────────────────────────────────┘
                           │ 调用
┌──────────────────────────▼───────────────────────────────────┐
│                    适配层（Connection Layer）                   │
│                                                              │
│   StorageAdapter（接口）         ThemeAdapter（接口）            │
│   ├── VitePressSaveAdapter      ├── VitePressThemeAdapter     │
│   ├── LocalStorageAdapter       ├── VanillaThemeAdapter       │
│   └── CustomAdapter             └── ReactThemeAdapter         │
│                                                              │
│   这一层负责：                                                 │
│   - 持久化策略可插拔（默认提供 VitePress 文件系统保存）           │
│   - 主题/暗色模式可注入（默认提供 VitePress useData().isDark）   │
│   - SSR 安全包裹（defineClientComponent）                     │
└──────────────────────────┬───────────────────────────────────┘
                           │ 调用
┌──────────────────────────▼───────────────────────────────────┐
│                    内核层（Framework-Free Core）                │
│                                                              │
│   CanvasManager        HistoryManager       SvgLoader          │
│   SvgSerializer        PluginSystem         EventBus           │
│                                                              │
│   这一层负责：                                                 │
│   - Fabric.js 画布生命周期（创建、渲染、销毁）                    │
│   - SVG 加载/解析/序列化                                      │
│   - 撤销/重做栈                                               │
│   - 插件注册与调度（align, layer, text-format, distribute...）  │
│   - 事件总线（selected, modified, saved, closed...）          │
│                                                              │
│   零依赖：不 import vue, vitepress, react                      │
│   唯一外部依赖：fabric（peerDependency）                       │
└──────────────────────────────────────────────────────────────┘
```

## 数据流

```
用户在 Markdown 中写标准图片语法：
   ![架构图](/diagrams/foo.svg)
       │
       ▼ （VitePress 构建时）
┌──────────────────────┐
│  markdown-it 拦截     │  ← md.renderer.rules.image 检测 .svg 后缀
│  替换为 <SvgDiagram>   │     自动转换为 <SvgDiagram src="/diagrams/foo.svg" />
└──────────┬───────────┘
           │
           ▼ （浏览器运行时）
用户点击"编辑SVG"
       │
       ▼
SvgDiagram.vue ──fetch SVG──▶ SvgLoader.load(svgText)
       │                            │
       │                    ┌───────▼────────┐
       │                    │  Preprocessor   │  （可选，默认透传）
       │                    │  - CSS变量→hex  │
       │                    │  - marker→poly  │
       │                    │  - 清理非法属性  │
       │                    └───────┬────────┘
       │                            │
       │                    ┌───────▼────────┐
       │                    │  CanvasManager  │
       │                    │  .init(canvasEl)│
       │                    │  .loadSvg(data) │
       │                    └───────┬────────┘
       │                            │
       │              用户拖拽编辑（Fabric.js 交互层）
       │                            │
       │              用户点击"保存"
       │                            │
       │                    ┌───────▼────────┐
       │                    │  SvgSerializer  │
       │                    │  .serialize()   │
       │                    └───────┬────────┘
       │                            │
       │                    ┌───────▼────────┐
       │                    │  Postprocessor  │  （可选，默认透传）
       │                    │  - hex→CSS变量  │
       │                    └───────┬────────┘
       │                            │
       ▼                            ▼
  SvgDiagram.vue ◀── reload ── StorageAdapter.save(svgText)
```

## 组件树（VitePress 场景）

```
┌─ VitePress DefaultTheme Layout ──────────────────────────┐
│                                                          │
│  ┌─ .md Content Area ────────────────────────────────┐  │
│  │                                                    │  │
│  │   <SvgDiagram src="/diagrams/foo.svg" />           │  │
│  │   ┌──────────────────────────────────────┐        │  │
│  │   │  .svg-container                       │        │  │
│  │   │  ├── <div v-html="svgContent" />      │        │  │
│  │   │  └── <button> ✏️ 编辑 SVG </button>    │        │  │
│  │   └──────────────────────────────────────┘        │  │
│  │                                                    │  │
│  │   <Teleport to="body">                             │  │
│  │     <SvgEditor>  ← defineClientComponent 包裹       │  │
│  │       ├── .editor-overlay                          │  │
│  │       ├── .editor-toolbar                          │  │
│  │       ├── .editor-canvas  ← Fabric.js Canvas       │  │
│  │       └── .editor-statusbar                        │  │
│  │     </SvgEditor>                                   │  │
│  │   </Teleport>                                      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 关键设计决策（简要）

| 决策 | 选择 | 理由 |
|------|------|------|
| 内核语言 | TypeScript | 类型安全，便于插件使用者获得 IDE 提示 |
| 渲染引擎 | Fabric.js 6.x（可替换） | 当前项目已深度使用；通过 RenderAdapter 抽象允许未来切换 |
| 插件协议 | 参考 vitepress-tuck 的 definePlugin | 一行配置覆盖三层（vite + markdown + theme） |
| 持久化 | StorageAdapter 接口 + 默认 VitePress 文件系统实现 | 不写死 /__svg-save__ |
| SSR 安全 | defineClientComponent 包裹所有 Canvas 代码 | VitePress 官方推荐方案 |
| 打包工具 | unbuild / tsdown | 纯 TS 库无需 Vite 构建，产物更干净 |
| 包管理 | pnpm workspace（monorepo 可选） | 独立 npm 包也可以不建 monorepo |
