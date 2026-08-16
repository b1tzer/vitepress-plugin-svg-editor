# 技术规格说明书 — vitepress-plugin-svg-editor v0.1.0 MVP

| 字段     | 值                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------- |
| 文档版本 | 2.0                                                                                               |
| 最后修订 | 2026-08-11                                                                                        |
| 文档状态 | Draft 审阅中                                                                                      |
| 目标读者 | 技术负责人、核心开发者、代码评审人                                                                |
| 关联文档 | [设计蓝图](/data/home/lipingxie/project/java-world2/vitepress-plugin-svg-editor/design/README.md) |

---

## 1. 引言

### 1.1 项目背景

`vitepress-plugin-svg-editor` 是一个基于 **Fabric.js + Vue 3 + VitePress** 的 Markdown SVG 编辑器插件。用户在 Markdown 中写标准图片语法 `![alt](xxx.svg)` 即可获得交互式 SVG 编辑能力，无需离开 VitePress 站点，无需学习 Vue 组件标签。

原代码最初内嵌于 java-world 仓库的 `docs/.vitepress/` 下（20+ 文件，含 8 个编辑插件、E2E 测试）。项目已完成从主仓库抽离（Phase A、B），并复制了内核代码到本仓库（Phase C 部分完成）。

### 1.2 当前状态

| 层                         | 完成度 | 关键差距                                                                                                           |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| **内核 `src/core/`**       | 60%    | `.ts` 文件仍是 JS 风格（无类型标注）；缺 `SvgLoader / SvgSerializer / PluginSystem / EventBus / types.ts` 五个模块 |
| **适配器 `src/adapters/`** | 0%     | 目录不存在；保存端点仍硬编码于 `svgEditorPlugin()` 中；无 `StorageAdapter / ThemeAdapter / RenderAdapter`          |
| **组件 `src/components/`** | 40%    | `SvgEditor.vue` 达 33.8KB 单文件，未拆分 Toolbar/Canvas/Statusbar 子组件                                           |
| **测试**                   | 30%    | Playwright E2E 齐全，`vitest` 声明但零单元测试                                                                     |
| **发布**                   | 10%    | `version: "0.0.0"` + `private: true`；README 仅 43 行；无 CHANGELOG / examples                                     |

### 1.3 本文档目的

本文档定义 v0.1.0 MVP 的完整技术需求，覆盖功能需求、非功能需求、架构设计、实施计划和验收标准。它是开发、测试、评审和发布的**唯一事实来源**（Single Source of Truth）。

### 1.4 术语表

| 术语             | 定义                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| **内核层**       | `src/core/` 目录下的纯 TS 模块，零 Vue/VitePress 依赖，仅依赖 fabric（peerDep）                  |
| **适配层**       | `src/adapters/` 目录下的接口 + 默认实现，连接内核与宿主环境（VitePress）                         |
| **Adapter 协议** | `StorageAdapter` / `ThemeAdapter` / `RenderAdapter` 三个接口，定义了内核与外部世界的契约         |
| **双轨开发**     | 同时维护本插件包和原 java-world 项目内嵌代码，通过环境变量 `VITE_USE_NEW_EDITOR` 切换            |
| **EARS 格式**    | Event-Action-Response-System 验收标准格式：WHEN（触发）→ THEN（行为） / IF（条件）→ THEN（行为） |

---

## 2. 目标与非目标

### 2.1 目标（Goals）

- **G1**：内核层完成 TypeScript 类型化，所有 `src/core/` 模块通过 `tsc --noEmit` 且覆盖率达 80%+
- **G2**：适配层三大接口全部落地，保存端点从 `svgEditorPlugin()` 中解耦为 `VitePressSaveAdapter`
- **G3**：`SvgEditor.vue` 从 33.8KB 拆分为 ≤8KB 的容器 + 3 个独立子组件，职责单一
- **G4**：Markdown 图片语法 `![alt](xxx.svg)` 自动增强为可编辑组件，非 `.svg` 不受影响
- **G5**：内核模块单元测试行覆盖率 ≥ 70%，现有 E2E 全绿，CI 流水线就绪
- **G6**：原 java-world 项目通过 `VITE_USE_NEW_EDITOR=true` 可无缝切换到新插件包
- **G7**：`package.json` 发布就绪（`version: "0.1.0"` + `private: false`），README 覆盖所有新手路径

### 2.2 非目标（Non-Goals）—— "scope creep 防火墙"

以下需求明确**不属于 v0.1.0 范围**，如有压力引用本表：

| 类别              | 排除项                                                                       | 理由                                                               |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| P2 功能           | 辅助线可视化编辑、标尺、导出 PNG、渐变编辑器、阴影编辑器、对象锁定、栅格吸附 | 见 `design/09-feature-plan.md`，P2 属于差异化竞争力，v0.2.0 再启动 |
| P3 功能           | 协同编辑（CRDT/OT）、AI 辅助、版本历史、移动端手势                           | 预算和工期不足，且无明确用户需求验证                               |
| Fabric 升级       | Fabric.js 从 5.5.x → 6.x                                                     | `peerDependencies` 已声明兼容范围 `>=5.5.0 <7.0.0`，5.x 足够稳定   |
| 完整示例站点      | 多页面、多主题、国际化示例                                                   | 仅提供最小 `examples/basic/` 单页 demo                             |
| XSS/SSRF 深度防护 | `<script>` / `onclick` / `onload` 清洗、外部 `<image>` 引用禁止              | v0.2.0 引入 `SvgLoader` 安全扫描链路                               |

---

## 3. 假设与约束

### 3.1 假设

| #   | 假设                                                                                     | 风险等级                                                              |
| --- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A1  | Fabric.js 5.5.2 通过 `window.fabric` 全局加载（CDN），不会阻塞 Canvas 初始化             | 中 — 若 CDN 不可达则编辑器白屏                                        |
| A2  | 用户项目使用 pnpm workspace 管理依赖，`vitepress` / `vue` / `fabric` 作为 peerDep 已就绪 | 低                                                                    |
| A3  | 原 java-world 项目可通过环境变量 `VITE_USE_NEW_EDITOR` 切换新旧编辑器，无需修改构建配置  | 中 — 需在 java-world 仓库同步实施                                     |
| A4  | 单元测试通过 `jsdom` + `vitest` 环境模拟 DOM / Canvas                                    | 中 — jsdom 不完整支持 Canvas API，需额外 mock                         |
| A5  | `unbuild`（stub mode）可正常处理 `.vue` 文件的路径映射                                   | 低 — `client.ts` 导出 `.vue` 源文件由消费方 Vite 编译，不经过 unbuild |

### 3.2 约束

| #   | 约束                                                                                                | 影响                                                      |
| --- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| C1  | **技术栈锁定**：Vue 3.2+、VitePress 1.0-1.6.x、Fabric.js 5.5+、TypeScript 5.x                       | 不允许引入不兼容的依赖                                    |
| C2  | **SSR 安全**：所有 `window / document / fabric` 引用必须在 `onMounted` / `defineClientComponent` 内 | 内核层 `SvgLoader` 必须支持非浏览器环境（Node+jsdom）运行 |
| C3  | **构建工具链**：unbuild → `.mjs` + `.d.ts`；`client.ts` 不预编译 `.vue`，由消费方 Vite 处理         | 不得切换到 Rollup 裸写或 Vite library mode                |
| C4  | **安全底线**：路径遍历防护在 `VitePressSaveAdapter` 中必选，XSS/SSRF 防护推迟到 v0.2.0              | 见 Non-Goals 表                                           |
| C5  | **兼容性底线**：Chrome 90+、Firefox 90+、Safari 15+、Edge 90+、Node 18/20/22                        | 不承诺 IE、旧版 Safari                                    |

---

## 4. 备选方案考量

> 专业规范要求展示技术决策的严谨性：评估了什么路径？为什么否决？最终为什么选这条路？

| 决策点        | 选项 A（已选）                                              | 选项 B（否决）                   | 否决理由                                                                        |
| ------------- | ----------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| 渲染引擎      | **Fabric.js 5.x**（当前在用）                               | 原生 SVG DOM 操作                | 原生 DOM 缺乏选择/缩放/旋转/变换矩阵等编辑能力，需从零实现，工期不现实          |
| 保存策略      | **StorageAdapter 接口 + 默认 VitePressSaveAdapter**         | 继续硬编码 `/__svg-save__` 端点  | 硬编码阻止用户使用 localStorage / REST API / S3，与设计文档的"协议优先"原则矛盾 |
| 打包工具      | **unbuild**（零配置，自动 `.mjs`+`.d.ts`）                  | Vite library mode                | Vite library mode 需手动配多入口 + `.d.ts` 生成，维护成本高                     |
| 组件拆分      | **5 组件（容器 + Toolbar + Canvas + Statusbar + Diagram）** | 保持 33.8KB 单体 `SvgEditor.vue` | 单体不可测、不可局部替换、代码审查困难                                          |
| 测试策略      | **vitest + jsdom（单元）+ Playwright（E2E）**               | 仅 Playwright E2E                | 仅 E2E 定位问题耗时长（每次 5s+），单元测试秒级反馈                             |
| Markdown 拦截 | **markdown-it renderer.rules.image 条件替换**               | 自定义容器语法 `:::svg-editor`   | 非标准 Markdown，其他阅读器中无法预览 SVG，违反"原生 Markdown 优先"原则         |

---

## 5. 系统架构

### 5.1 分层架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    宿主注入层（VitePress）                         │
│                                                                 │
│  config.ts:  svgEditorPlugin({ storage, saveDir, theme, ... })  │
│  theme/index.ts:  import 'vitepress-plugin-svg-editor/client'   │
│  markdown:  ![alt](foo.svg) ——自动——▶ <SvgDiagram src="..." />  │
└────────────────────────────┬────────────────────────────────────┘
                             │ 依赖注入
┌────────────────────────────▼────────────────────────────────────┐
│                    适配层（Connection Layer）                     │
│                                                                 │
│  StorageAdapter（接口）        ThemeAdapter（接口）                │
│  ├─ VitePressSaveAdapter     ├─ VitePressThemeAdapter            │
│  └─ LocalStorageAdapter      └─ （可扩展自定义适配器）              │
│                                                                 │
│  RenderAdapter（接口）                                            │
│  └─ FabricRenderAdapter                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ 调用
┌────────────────────────────▼────────────────────────────────────┐
│                    内核层（Framework-Free Core）                   │
│                                                                 │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐                  │
│  │ SvgLoader │─▶│ CanvasMgr  │─▶│SvgSerializer│                  │
│  └──────────┘  └─────┬──────┘  └────────────┘                  │
│                      │                                           │
│  ┌──────────┐  ┌─────▼──────┐  ┌──────────────┐               │
│  │ EventBus  │  │HistoryMgr  │  │ PluginSystem  │               │
│  └──────────┘  └────────────┘  └──────────────┘               │
│                                                                 │
│  preprocessor.ts  ── inject ──▶  CanvasManager                  │
│  postprocessor.ts ◀── extract ◀  CanvasManager                  │
│  constants.ts     ── CSS变量→颜色映射表                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 核心数据流

```
Markdown: ![架构图](/diagrams/foo.svg)
    │
    ▼ (构建时 — markdown-it 拦截)
<SvgDiagram src="/diagrams/foo.svg" alt="架构图" />
    │
    ▼ (运行时)
用户点击 "✏️ 编辑 SVG"
    │
    ▼
① SvgLoader.load(rawSvg)
    │ │
    │ ├─ preprocessor.apply(svgText)    ← CSS变量→hex, marker→polygon
    │ │
    │ ▼
② CanvasManager.init(canvasEl)
    │ └─ fabric.loadSVGFromString(svgText) → 渲染到画布
    │
    ▼
用户拖拽编辑（Fabric.js 交互）
    │
    ▼
用户点击 "保存"
    │
    ▼
③ SvgSerializer.serialize(canvas)
    │
    ▼
④ postprocessor.apply(serializedSvg)   ← hex→CSS变量, 清理Fabric私有属性
    │
    ▼
⑤ StorageAdapter.save(svgText, sourcePath)
    │
    ▼
⑥ SvgDiagram.refresh()  ← 重新 fetch & 渲染
```

### 5.3 组件树

```
VitePress DefaultTheme Layout
└─ .md Content Area
    └─ SvgDiagram.vue  ← 展示组件（可 SSR）
        ├─ <div v-html="svgContent" />
        └─ <button> ✏️ 编辑 SVG （仅 dev 模式可见）
            │
            └─ (Teleport to body)
                └─ SvgEditor.vue  ← 弹窗容器（defineClientComponent 包裹）
                    ├─ EditorToolbar.vue
                    ├─ EditorCanvas.vue  ← Fabric.js Canvas
                    └─ EditorStatusbar.vue
```

---

## 6. 功能需求（Functional Requirements）

> 优先级使用 **MoSCoW** 方法标注：**M**ust have（缺一不可） / **S**hould have（重要但可后续补充） / **C**ould have（锦上添花）

---

### FR-1：内核层 TypeScript 类型化与协议补全 [M]

**用户故事**：作为该插件的**二次开发者**，我希望所有 `src/core/` 模块都有完整的 TS 类型定义和框架无关的清晰接口，以便我可以脱离 Vue/VitePress 在 Node 环境中单独测试内核逻辑，或替换渲染引擎。

**功能描述**：将现有 3 个 JS 风格的 `.ts` 文件（`CanvasManager` / `HistoryManager` / `preprocessor`）完整类型化，并补齐设计文档规定的、当前缺失的 5 个模块。

**验收标准**：

| AC-ID  | 条件                                              | 期望行为                                                                                                                                                                                               |
| ------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AC-1.1 | WHEN 开发者列出 `src/core/` 目录                  | THEN 目录 SHALL 包含：`CanvasManager.ts`、`HistoryManager.ts`、`SvgLoader.ts`、`SvgSerializer.ts`、`PluginSystem.ts`、`EventBus.ts`、`types.ts`、`preprocessor.ts`、`postprocessor.ts`、`constants.ts` |
| AC-1.2 | WHEN 开发者运行 `pnpm typecheck`                  | THEN `src/core/` SHALL 通过类型检查，不得出现未标注的 `any`（`eslint-disable` 豁免除外）                                                                                                               |
| AC-1.3 | WHEN 开发者在 jsdom 中 `import { CanvasManager }` | THEN 模块 SHAIL 不因缺失 `window/document/vue` 而在 import 阶段崩溃（仅在实际调用 `init()` 时才依赖 DOM）                                                                                              |
| AC-1.4 | IF 内核类需要发布事件（如选中变化、对象修改）     | THEN 该类 SHALL 通过 `EventBus.emit()` 派发，而非通过硬编码回调属性（如当前 `this._onZoomChange`）                                                                                                     |
| AC-1.5 | WHEN `PluginSystem.register(plugin)` 被调用       | THEN 系统 SHALL 支持 `register()` / `unregister()` / `get(name)`，且插件的 `install(context)` 可访问 `{ canvas, historyManager, eventBus }` 上下文                                                     |

**依赖关系**：无前置依赖，可独立实施和执行验收。

---

### FR-2：适配层三大接口实现 [M]

**用户故事**：作为**插件使用者**，我希望不修改内核代码就能替换 SVG 的保存方式（文件系统 / REST API / localStorage）和主题来源，以便该插件能适配不同的 VitePress 项目甚至非 VitePress 场景。

**功能描述**：创建 `src/adapters/` 目录，实现 `StorageAdapter` / `ThemeAdapter` / `RenderAdapter` 三个接口及其默认实现。

**验收标准**：

| AC-ID  | 条件                                                              | 期望行为                                                                                                                                                                                                                                                              |
| ------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-2.1 | WHEN 开发者查看 `src/adapters/`                                   | THEN 目录 SHALL 包含：`storage/StorageAdapter.ts`（接口）、`storage/VitePressSaveAdapter.ts`、`storage/LocalStorageAdapter.ts`、`theme/ThemeAdapter.ts`（接口）、`theme/VitePressThemeAdapter.ts`、`render/RenderAdapter.ts`（接口）、`render/FabricRenderAdapter.ts` |
| AC-2.2 | WHEN 用户在 `svgEditorPlugin()` 中传入 `storage: myCustomAdapter` | THEN 插件 SHALL 使用该适配器保存/加载 SVG，不再走默认的 `/__svg-save__` 端点                                                                                                                                                                                          |
| AC-2.3 | WHEN 用户传入 `storage: "localStorage"`                           | THEN 插件 SHALL 使用 `LocalStorageAdapter` 保存到浏览器本地存储，不发起任何 HTTP 请求                                                                                                                                                                                 |
| AC-2.4 | WHEN `VitePressSaveAdapter.save(path, content)` 被调用            | THEN 适配器 SHALL 校验路径以 `saveDir` 为前缀、后缀为 `.svg`，否则返回 `{ success: false, error: "不在允许的目录范围内" }` 且**不写入文件**（路径遍历攻击防护）                                                                                                       |
| AC-2.5 | WHEN 编辑器判断当前是否为暗色模式                                 | THEN 编辑器 SHALL 通过 `ThemeAdapter.isDark()` 获取，而非 `import { useData } from "vitepress"`（内核层框架无关）                                                                                                                                                     |
| AC-2.6 | IF 用户未指定 `storage` 配置项                                    | THEN 插件 SHALL 默认使用 `VitePressSaveAdapter`，`saveDir` 默认值为 `docs/public/diagrams`                                                                                                                                                                            |

**依赖关系**：依赖 FR-1（需 `types.ts` 中的接口定义）和 FR-3（`SvgEditor.vue` 重构时接入 `StorageAdapter`）。

---

### FR-3：SvgEditor 组件拆分重构 [M]

**用户故事**：作为该插件的**维护者**，我希望 33.8KB 的 `SvgEditor.vue` 单体文件被拆分为 3 个职责单一的子组件，以便各子组件可独立测试、独立替换、独立代码审查。

**功能描述**：将现有 `SvgEditor.vue`（~1000 行）拆分为 1 个容器 + 3 个子组件。

**验收标准**：

| AC-ID  | 条件                                                    | 期望行为                                                                                                                                                         |
| ------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-3.1 | WHEN 开发者查看 `src/components/`                       | THEN 目录 SHALL 存在 5 个组件：`SvgDiagram.vue`（展示）、`SvgEditor.vue`（弹窗容器）、`sub/EditorToolbar.vue`、`sub/EditorCanvas.vue`、`sub/EditorStatusbar.vue` |
| AC-3.2 | WHEN 开发者检查 `SvgEditor.vue` 文件大小                | THEN 文件 SHALL ≤ 8KB，仅负责弹窗容器、生命周期、子组件编排（事件透传、数据流转）                                                                                |
| AC-3.3 | WHEN VitePress 在 SSR 阶段渲染包含 `<SvgEditor>` 的页面 | THEN 编辑器 SHALL 不报错（通过 `defineClientComponent` 或 `<ClientOnly>` 包裹所有 Canvas 相关代码）                                                              |
| AC-3.4 | WHEN 编辑器打开后用户查看工具栏                         | THEN 所有按钮 SHALL 有 `aria-label` 属性（如 `aria-label="加粗 Ctrl+B"`），满足屏幕阅读器基本可访问性                                                            |
| AC-3.5 | WHEN 用户触发保存                                       | THEN 编辑器 SHALL 通过 `StorageAdapter.save()` 完成，而非直接 `fetch("/__svg-save__", ...)`                                                                      |

**依赖关系**：依赖 FR-2（`StorageAdapter` 就绪后才能接入）。

---

### FR-4：Markdown 图片语法自动增强 [M]

**用户故事**：作为**文档作者**，我希望在 Markdown 中直接写 `![架构图](/diagrams/foo.svg)` 就能获得编辑 SVG 的功能，完全不需要学习 Vue 组件标签，保持写作习惯不变。

**功能描述**：通过 `markdown-it` 的 `renderer.rules.image` 拦截机制，在构建时将 `.svg` 后缀的图片自动转换为 `<SvgDiagram>` 组件。

**验收标准**：

| AC-ID  | 条件                                                       | 期望行为                                                                                   |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| AC-4.1 | WHEN 用户在 Markdown 中写 `![类型体系](/diagrams/foo.svg)` | THEN 插件 SHALL 在构建时将其转换为 `<SvgDiagram src="/diagrams/foo.svg" alt="类型体系" />` |
| AC-4.2 | WHEN 用户写 `![截图](/screenshots/foo.png)`                | THEN 插件 SHALL 保持原始 `<img>` 渲染，不做任何修改                                        |
| AC-4.3 | WHEN 用户直接写 `<SvgDiagram src="..." />` Vue 标签        | THEN 该写法 SHALL 与 Markdown 语法完全等价（两种路径最终渲染同一组件）                     |
| AC-4.4 | IF 用户配置 `markdownSyntax: false`                        | THEN 插件 SHALL 不注册 `renderer.rules.image` 拦截，允许用户回退到手动注册组件的方式       |

**依赖关系**：依赖 FR-3（`SvgDiagram.vue` 和 `SvgEditor.vue` 拆分就绪）。此需求已完成 80%，仅需回归验证。

---

### FR-5：单元测试覆盖与 CI 流水线 [M]

**用户故事**：作为**插件贡献者**，我希望内核模块有单元测试安全网，以便我在重构时不引入回归 bug，且 CI 能自动拦截类型错误和测试失败。

**功能描述**：为 `src/core/`和 `src/adapters/` 编写 `vitest` 单元测试，并将 `lint → typecheck → test:unit → build` 加入 CI 流水线。

**验收标准**：

| AC-ID  | 条件                                                                                  | 期望行为                                                                                                   |
| ------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| AC-5.1 | WHEN 开发者运行 `pnpm test:unit`                                                      | THEN 所有 `vitest` 用例 SHALL 通过，且 `src/core/` 与 `src/adapters/` 行覆盖率 ≥ 70%                       |
| AC-5.2 | WHEN 开发者运行 `pnpm test`（Playwright E2E）                                         | THEN `svg-editor.spec.ts`、`theme-toggle.spec.ts`、`canvas-interactions.spec.ts` 等现有用例 SHALL 全部通过 |
| AC-5.3 | WHEN CI 流水线触发                                                                    | THEN 执行顺序为 `lint → typecheck → test:unit → build`，任一步骤失败即阻塞后续                             |
| AC-5.4 | IF 内核模块修改导致 `SvgLoader → CanvasManager → SvgSerializer` 加载-序列化闭环被破坏 | THEN 单元测试 SHALL 在秒级给出失败信号，并提供定位信息（哪个模块、哪个步骤失败）                           |

**依赖关系**：依赖 FR-1（内核类型化完成后才能编写有效的单元测试）。

---

### FR-6：原项目双轨切换验证 [M]

**用户故事**：作为**java-world 项目的维护者**，我希望能通过一个环境变量在旧代码和新插件包之间实时切换，以便我在 plugin 包 v0.1.0 发布前充分验证且零风险。

**功能描述**：在 java-world 项目（另一个仓库）中增加环境变量 `VITE_USE_NEW_EDITOR` 开关，允许新旧编辑器并轨运行。

**验收标准**：

| AC-ID  | 条件                                                    | 期望行为                                                                                 |
| ------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| AC-6.1 | WHEN 设置 `VITE_USE_NEW_EDITOR=true` 后 `pnpm docs:dev` | THEN 编辑器 SHALL 使用 `vitepress-plugin-svg-editor` 加载、编辑、保存 SVG                |
| AC-6.2 | WHEN 不设置环境变量或设为 `false`                       | THEN 编辑器 SHALL 继续使用原 `docs/.vitepress/theme/components/editor/` 旧代码，行为不变 |
| AC-6.3 | WHEN `VITE_USE_NEW_EDITOR=true` 状态下运行现有 E2E 用例 | THEN 以下 P0 功能 SHALL 通过：SVG 加载、拖拽、缩放、撤销/重做、保存、文字编辑、箭头渲染  |
| AC-6.4 | IF 新插件包在切换后出现回归 bug                         | THEN 关掉环境变量后原项目 SHALL 立即恢复可用（回滚成本 = 关闭一个环境变量，零代码改动）  |

**依赖关系**：依赖 FR-1 ~ FR-5（本仓库所有模块就绪后，才能在 java-world 仓库做集成验证）。**本需求在 java-world 仓库中实施**。

---

### FR-7：文档、示例与发布准备 [S]

**用户故事**：作为**潜在用户**，我希望通过 README 和最小示例项目在 3 分钟内理解怎么安装和使用这个插件，并从 npm 安装它。

**功能描述**：完成 README、CHANGELOG、最小示例项目和 `package.json` 的发布配置。

**验收标准**：

| AC-ID  | 条件                                                                     | 期望行为                                                                                                                                          |
| ------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-7.1 | WHEN 用户打开 `README.md`                                                | THEN 文档 SHALL 包含：安装命令、`config.ts` 完整配置、`theme/index.ts` 注册代码、Markdown 图片语法示例、主要配置项列表、许可证                    |
| AC-7.2 | WHEN 用户 clone 后进入 `examples/basic/` 执行 `pnpm install && pnpm dev` | THEN VitePress 站点 SHALL 启动，SVG 编辑器 SHALL 可正常工作                                                                                       |
| AC-7.3 | WHEN 开发者查看 `CHANGELOG.md`                                           | THEN 文件 SHALL 记录 v0.1.0 的所有变更条目                                                                                                        |
| AC-7.4 | WHEN 查看 `package.json`                                                 | THEN `version` SHALL 为 `"0.1.0"`，`private` SHALL 为 `false`，`files` SHALL 只含 `["dist", "client.ts", "README.md", "LICENSE", "CHANGELOG.md"]` |
| AC-7.5 | WHEN `pnpm build && pnpm pack --dry-run`                                 | THEN `.mjs` + `.d.ts` 产物 SHALL 存在，gzip 体积 < 100KB（不含 fabric）                                                                           |
| AC-7.6 | IF 用户未安装 `fabric` 依赖                                              | THEN 插件 SHALL 在客户端抛出清晰错误：`"Fabric.js 未加载。请执行：pnpm add fabric"`，而非 `"undefined is not a function"`                         |

**依赖关系**：依赖 FR-1 ~ FR-6 全部完成。此需求为发布前的最后步骤。

---

## 7. 非功能需求（Non-Functional Requirements）

### 7.1 性能

| 指标                                  | 目标            | 测量方法                                                  |
| ------------------------------------- | --------------- | --------------------------------------------------------- |
| 插件包体积（gzip，不含 fabric）       | < 100KB         | `pnpm pack --dry-run` + `gzip -c`                         |
| 编辑器打开延迟（含 Fabric.js 初始化） | < 2s            | Playwright `performance.now()` 计时                       |
| 撤销/重做延迟（50 步历史栈）          | < 100ms         | vitest 计时                                               |
| Canvas 帧率（100 个对象拖拽场景）     | ≥ 30fps         | Playwright `requestAnimationFrame` 采样                   |
| 内存泄漏（打开→关闭编辑器 10 次）     | heap 增长 < 5MB | Playwright `performance.measureUserAgentSpecificMemory()` |

### 7.2 安全性

| 威胁                           | 防护措施                                   | 实施位置         |
| ------------------------------ | ------------------------------------------ | ---------------- |
| 路径遍历（`../../etc/passwd`） | `VitePressSaveAdapter` 校验路径前缀 + 后缀 | FR-2 / AC-2.4    |
| XSS（SVG 内嵌 `<script>`）     | v0.2.0 引入 `SvgLoader` 安全扫描链路       | 不在 v0.1.0 范围 |
| SSRF（SVG 引用外部 `<image>`） | v0.2.0 引入 `SvgLoader` 同源校验           | 不在 v0.1.0 范围 |
| 大文件 DoS（10MB+ SVG）        | v0.2.0 `SvgLoader` 拒绝 > 10MB 输入        | 不在 v0.1.0 范围 |

### 7.3 兼容性

| 依赖      | 支持范围                                      | 验证方式                           |
| --------- | --------------------------------------------- | ---------------------------------- |
| VitePress | 1.0.0 – 1.6.x                                 | 本地 pnpm link 验证 + E2E          |
| Node.js   | 18 LTS, 20 LTS, 22 LTS                        | CI 矩阵                            |
| 浏览器    | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ | Playwright E2E（Chrome + Firefox） |
| fabric    | 5.5.0 – 6.x（5.5.2 为主要测试版本）           | 单元测试 + E2E                     |

### 7.4 可访问性（a11y，P1 底线）

| 要求                                    | 覆盖范围                                         | 关联需求      |
| --------------------------------------- | ------------------------------------------------ | ------------- |
| 工具栏按钮 `aria-label`                 | 所有按钮                                         | FR-3 / AC-3.4 |
| 键盘快捷键（Tab + Enter/Escape/Delete） | 工具栏切换、弹窗关闭、删除对象                   | FR-3          |
| 焦点管理                                | 弹窗打开→焦点移到编辑器内；关闭→焦点回到触发按钮 | FR-3          |
| 缩放不依赖鼠标                          | Ctrl+/= 放大、Ctrl+- 缩小                        | FR-3          |

### 7.5 代码质量

| 指标                                     | 目标                              |
| ---------------------------------------- | --------------------------------- |
| TypeScript 严格模式通过                  | `tsc --noEmit` 零错误             |
| ESLint 零错误                            | `pnpm lint` 通过                  |
| `src/core/` + `src/adapters/` 行覆盖率   | ≥ 70%                             |
| 无 `any` 逃逸（eslint-disable 豁免除外） | `src/core/` 和 `src/adapters/` 零 |

---

## 8. 实施计划

### 8.1 开发阶段与里程碑

| 阶段                  | 产出                                             | 预估工时 | 准入条件                         | 准出条件                                 |
| --------------------- | ------------------------------------------------ | -------- | -------------------------------- | ---------------------------------------- |
| **S1：内核类型化**    | `src/core/*.ts` 全部 TS 类型化 + 缺失的 5 个模块 | 3-5 天   | 当前 `src/core/` 代码作为基线    | `tsc --noEmit` 通过，vitest 覆盖率 ≥ 70% |
| **S2：适配层**        | `src/adapters/` 完整实现（3 接口 + 默认实现）    | 2-3 天   | S1 完成（`types.ts` 定义好接口） | 手动导入测试通过 + 单元测试              |
| **S3：组件重构**      | `SvgEditor.vue` 拆分 + 子组件                    | 2-3 天   | S2 完成（`StorageAdapter` 可用） | 文件大小 ≤ 8KB，E2E 无回归               |
| **S4：Markdown 增强** | `svgDiagramMarkdownPlugin` 回归验证              | 0.5 天   | S3 组件就绪                      | AC-4.1 ~ AC-4.4 通过                     |
| **S5：测试补齐**      | 单元测试 + CI 流水线                             | 2-3 天   | S1 / S2 完成                     | 覆盖率 ≥ 70%，CI 全绿                    |
| **S6：双轨验证**      | java-world 切换 + E2E 回归                       | 1-2 天   | S1-S5 全完成                     | `VITE_USE_NEW_EDITOR=true` 时 E2E 全绿   |
| **S7：发布准备**      | README + CHANGELOG + examples + `package.json`   | 1-2 天   | S6 完成                          | `pnpm build + pack --dry-run` 成功       |

**总预估**：11-18.5 天（单人全职）。

### 8.2 依赖关系图

```
S1(内核类型化) ────┬──── S2(适配层) ──── S3(组件重构) ──── S4(Markdown 增强)
                   │                         │
                   └── S5(测试补齐) ◄────────┘
                         │
                         ▼
                   S6(双轨验证) ──── S7(发布准备)
```

### 8.3 风险登记

| 风险 ID | 描述                                                                     | 概率 | 影响                    | 缓解措施                                                                   |
| ------- | ------------------------------------------------------------------------ | ---- | ----------------------- | -------------------------------------------------------------------------- |
| R1      | `CanvasManager` 现有 338 行 JS 风格代码重构为 TS 时引入语义错误          | 中   | 高 — 编辑器核心逻辑崩溃 | 先补单元测试（白盒用例覆盖现有行为），再逐方法改 TS                        |
| R2      | jsdom 不完全支持 Canvas API，导致 `SvgLoader` 单元测试 mock 成本高       | 中   | 中 — 测试覆盖不完整     | 编写最小 mock canvas（fabric 内置 `fabric.StaticCanvas` 可用于 Node 环境） |
| R3      | `SvgEditor.vue` 拆分后状态管理散落（原来在 33KB 单体中所有状态互访方便） | 中   | 中 — 状态同步 bug       | 采用 props down / events up + `provide/inject` 传递 `EventBus` 实例        |
| R4      | java-world 项目构建配置与新插件包不兼容                                  | 低   | 高 — 双轨切换失败       | 先在干净 VitePress 脚手架项目中验证新包，排除宿主项目特有配置干扰          |
| R5      | `unbuild stub` 模式下 `.vue` 路径映射异常                                | 低   | 中 — 本地开发受阻       | 保证 `pnpm dev`（stub）+ `pnpm build`（正式）双模式验证                    |

---

## 9. 待决问题

> 以下问题尚未达成最终决策，不阻塞当前开发但需要在实施过程中确认。

| #   | 问题                                                                                                                                  | 讨论状态 | 预计决议时间 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| Q1  | `EventBus` 的 API 风格？Node.js `EventEmitter` 风格（`on/emit/off`）还是 DOM `CustomEvent` 风格（`addEventListener/dispatchEvent`）？ | 待讨论   | S1 阶段      |
| Q2  | `PluginSystem` 是否支持异步插件初始化（`install` 返回 `Promise<void>`）？当前 8 个内置插件均为同步，但自定义插件可能有异步需求。      | 待讨论   | S1 阶段      |
| Q3  | `LocalStorageAdapter` 是否需要版本迁移策略（如 v0.1.0 的存储格式与 v0.2.0 不兼容时）？                                                | 待讨论   | S2 阶段      |
| Q4  | `EditorToolbar.vue` 是否支持用户通过配置移除/重排某些按钮？还是 v0.1.0 仅提供固定工具栏？                                             | 待讨论   | S3 阶段      |

---

## 10. 附录

### 附录 A：相关文档清单

| 文档       | 路径                               | 说明                              |
| ---------- | ---------------------------------- | --------------------------------- |
| 架构设计   | `design/01-architecture.md`        | 分层架构、数据流、组件树          |
| 包设计     | `design/02-package-design.md`      | exports 字段设计、构建工具选型    |
| 用户 API   | `design/03-user-facing-api.md`     | `SvgEditorPluginOptions` 完整定义 |
| 功能规划   | `design/09-feature-plan.md`        | P0-P3 功能分层与依赖图            |
| 测试策略   | `design/10-test-strategy.md`       | 单元/组件/E2E/CI 策略             |
| 非功能清单 | `design/11-non-functional.md`      | 15 维度品质保障                   |
| 迁移策略   | `design/12-migration-strategy.md`  | 六阶段双轨过渡                    |
| 开发路线图 | `design/08-development-roadmap.md` | 原开发规划（本文件已迭代）        |

### 附录 B：变更记录

| 版本 | 日期       | 变更内容                                                                                                     | 修订人 |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 1.0  | 2026-08-11 | 初稿，7 个需求，EARS 验收标准                                                                                | Claude |
| 2.0  | 2026-08-11 | 按专业 TSD 标准重写：新增 Goals/Non-Goals、备选方案考量、架构图、MoSCoW 优先级、风险登记、待决问题、实施计划 | Claude |
