# 07 — 技术决策记录（ADR）

> 格式：日期 | 状态 | 决策 | 理由 | 替代方案 | 后果

---

## ADR-001：渲染引擎选择

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：使用 Fabric.js 6.x 作为默认渲染引擎，通过 `RenderAdapter` 接口允许替换。

**理由**：
1. 当前项目已深度使用 Fabric.js（878 行 SvgEditor.vue + CanvasManager + 8 个插件）
2. Fabric.js 内置交互控件（选择框、旋转手柄、缩放）无需自己实现
3. 对象模型成熟（Group、Textbox、Path），直接映射 SVG 元素
4. 通过 RenderAdapter 抽象，未来可切换到 Konva.js 或原生 SVG DOM

**替代方案**：
- A. 原生 SVG DOM（SVG-Edit 方案）：调试友好，但大量元素卡顿、命中检测困难
- B. Konva.js：性能更好（~2x），但 API 不如 Fabric 直观，社区更小
- C. 自研渲染引擎：工作量大，无必要

**后果**：
- 需要处理 Fabric.js 的 SVG 解析缺陷（preprocessor 机制）
- 需要处理 Fabric.js 的 Firefox 性能问题（objectCaching 策略）
- 需要处理 Fabric.js 与现代打包工具的兼容性（锁定版本）

---

## ADR-002：插件协议设计

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：参考 `vitepress-tuck` 的 `definePlugin` 模式，一个 `svgEditorPlugin()` 调用封装 vite + markdown + theme 三层配置。

**理由**：
1. VitePress 本身没有统一插件协议，社区最优实践是 `vitepress-tuck`（3.4k stars）
2. 复杂插件在三处分散配置是用户最痛的反馈（见 05-pain-points A6）
3. `definePlugin` 模式已经被 nolebase、vitepress-demo-plugin 等大项目验证

**替代方案**：
- A. 只提供 Vite 插件 + 单独的客户端导入：用户需要手动在两处配置 → ❌
- B. 仿 VS Code 的 contributes 模式：太重，不适合 VitePress → ❌

**后果**：
- 插件必须同时提供 node 端（VitePlugin）和 client 端（enhanceApp）两个入口
- `exports` 字段需要区分 `"."` 和 `"./client"`
- 可以参考但不需要直接依赖 `vitepress-tuck`（避免传递依赖）

---

## ADR-003：内核与框架解耦

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：内核层（`core/`）纯 TypeScript，零 Vue/VitePress 依赖。通过适配层（`adapters/`）连接宿主。

**理由**：
1. 用户可能想在非 VitePress 项目中使用 SVG 编辑器（Nuxt、Astro、纯 HTML）
2. 内核无框架依赖意味着可以独立测试、独立发版
3. SVG-Edit、Tiny-SVG、JointJS 都是这个模式

**替代方案**：
- A. 内核直接 import Vue：绑死 Vue 生态，限制使用场景 → ❌

**后果**：
- 内核不能直接使用 Vue 的 reactive/watch/ref
- 内核通过 EventBus 与 UI 通信
- UI 层负责将内核事件映射到 Vue 响应式

---

## ADR-004：SSR 安全策略

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：所有 Canvas/Fabric.js 相关代码必须通过 `defineClientComponent` 或 `!import.meta.env.SSR` 守卫，不在 SSR 阶段执行。

**理由**：
1. VitePress 默认 SSR 所有页面，`window`、`document` 在 Node.js 中不存在
2. Fabric.js 在 import 时就依赖 Canvas API（`document.createElement('canvas')`）
3. 社区坑榜 A8 是最高频的构建失败原因

**替代方案**：
- A. 配置 `ssr.noExternal: ['fabric']`：无法解决根本问题，Fabric.js 不在 SSR 环境工作 → ❌
- B. 在组件中用 `onMounted` 动态 import：可行但不如 `defineClientComponent` 优雅 → 备选

**后果**：
- SvgEditor.vue 不能直接在 markdown 中作为普通组件使用
- 必须通过 SvgDiagram.vue 中间层触发（用户点击按钮才加载）
- 首屏 SSR 输出中不含编辑器代码 → 更小的 bundle

---

## ADR-005：持久化策略

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：通过 `StorageAdapter` 接口抽象持久化，默认提供 VitePress 文件系统实现（`/__svg-save__` 端点）。

**理由**：
1. 当前 `/__svg-save__` 写死了 VitePress 的 Vite 插件机制
2. 用户可能需要保存到后端 API、localStorage、S3 等
3. LucidChart 用户因自定义形状库无法扩展而放弃 → 我们不应犯同样错误

**替代方案**：
- A. 只保留 `/__svg-save__`：简单但不可扩展 → ❌
- B. 提供多个内置 adapter + 允许自定义：✅ 当前决策

**后果**：
- 需要定义清晰的 `StorageAdapter` 接口
- 默认实现需要处理路径白名单安全校验
- 用户文档中需要提供自定义 storage 的示例

---

## ADR-006：CSS 变量处理

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：preprocessor 中将 CSS 变量替换为 hex 值，postprocessor 中还原。提供 `cssVariableMap` 配置允许用户自定义映射。

**理由**：
1. Fabric.js 不支持 CSS 变量（`var(--vp-c-brand-1)` → 透明）
2. 当前项目已通过 `CSS_COLORS` 映射表实现，验证可行
3. 不同用户的项目有不同的 CSS 变量，不能硬编码

**替代方案**：
- A. 运行时用 `getComputedStyle` 解析：在 Canvas 上下文中不可靠 → ❌
- B. 要求用户导出时手动替换：用户体验差 → ❌

**后果**：
- 需要维护默认的 VitePress 主题 CSS 变量映射
- 暗色/亮色模式切换时，用户需要提供两套映射
- preprocess/postprocess 的对称性必须保证（不能漏变量）

---

## ADR-007：打包工具选择

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：使用 `unbuild` 打包，生成 ESM（`.mjs`）+ CJS（`.cjs`）+ 类型声明（`.d.ts`）。

**理由**：
1. 纯 TS 库，不需要 Vite 的 HMR/dev server 能力
2. unbuild 零配置，自动处理多格式输出
3. 支持 stub mode，开发时无需反复构建
4. vitepress-demo-plugin、nolebase 等都用类似方案

**替代方案**：
- A. Vite library mode：需要手写多入口配置 + dts 插件 → 次选
- B. Rollup 裸写：太复杂 → ❌

**后果**：
- 需要配置 `exports` 字段的多个条件导出
- dev 时使用 `unbuild --stub` 模式

---

## ADR-008：Markdown 原生语法支持

**日期**：2026-08-11
**状态**：✅ 已确定

**决策**：通过 markdown-it `renderer.rules.image` 拦截 `.svg` 后缀的图片，自动转换为 `<SvgDiagram>` Vue 组件。用户用标准 `![alt](diagram.svg)` 即可获得编辑能力，同时保留 `<SvgDiagram src="...">` 标签作为兼容写法。

**理由**：
1. `![alt](foo.svg)` 是完全标准的 Markdown 语法，在 GitHub、Obsidian 等其他工具中正常显示
2. 不改变用户写作习惯，零学习成本
3. VitePress 社区大量使用此模式（nolebase 的 unlazy-img、medium-zoom 图片预览、响应式图片组件）
4. VitePress 官方 issue #2302 讨论并认可了这种「Markdown 图片→Vue 组件替换」架构
5. 非 .svg 后缀的图片不受影响，继续走默认 `<img>` 渲染路径

**替代方案**：
- A. 自定义容器（`:::svg-editor path :::`）：语义明确但不标准，其他 MD 阅读器无法预览 → 备选
- B. Alt Text 标记（`![edit](path)`）：语法 hack，alt 不能表达真实含义 → ❌
- C. 仅 Vue 标签（`<SvgDiagram>`）：在 Obsidian 等编辑器中只显示代码块，不能预览图片 → ❌ 作为唯一方式不可接受

**后果**：
- 需要在插件的 markdown-it 配置中注册 `renderer.rules.image` 规则
- 需要处理 `.svg` 后缀的精确匹配（避免 `.svg.png` 等误匹配）
- HTML `<img src="foo.svg">` 不会被拦截（走不同 token 类型），需在文档中引导用户用标准 Markdown 语法
- 这是默认开启的行为，可通过 `markdownSyntax: false` 禁用
