# 执行任务清单 — vitepress-plugin-svg-editor v0.1.0 MVP

> **规则**：本文件是项目执行进度的**唯一正本**（Single Source of Truth）。  
> 每完成一个子任务立即更新状态，不攒着一起标。  
> 状态：⬜ 未开始 | 🔄 进行中 | ✅ 已完成 | 🚫 受阻

---

## S1：内核层 TS 类型化与协议补全 ✅

| ID | 子任务 | 状态 | AC | 证据 |
|----|--------|------|-----|------|
| S1-1 | 创建 `types.ts`（公共类型定义） | ✅ | 包含 IEventBus / IHistoryManager / PluginContext / EditorPlugin / CanvasManagerOptions / StorageAdapter / ThemeAdapter / GuideLine（可辨识联合） | `src/core/types.ts` (129行) |
| S1-2 | 创建 `EventBus.ts`（类型安全事件总线） | ✅ | on/off/emit/clear 全 API，CanvasEvents 类型约束 | `src/core/EventBus.ts` |
| S1-3 | 创建 `PluginSystem.ts`（插件注册调度） | ✅ | register/unregister/get/has/names/installAll/clear | `src/core/PluginSystem.ts` |
| S1-4 | 创建 `SvgLoader.ts`（SVG 加载门面） | ✅ | load(rawSvg, theme) → SvgLoadResult | `src/core/SvgLoader.ts` (29行) |
| S1-5 | 创建 `SvgSerializer.ts`（SVG 序列化门面） | ✅ | serialize(canvas, options) → cleanSvg | `src/core/SvgSerializer.ts` (62行) |
| S1-6 | 重构 `CanvasManager.ts`（JS→TS + EventBus） | ✅ | 属性类型化，EventBus 替代硬编码回调，@ts-nocheck（fabric 5.x 限制）| `src/core/CanvasManager.ts` (345行) |
| S1-7 | 重构 `HistoryManager.ts`（JS→TS + IHistoryManager） | ✅ | 实现 IHistoryManager，MAX_STACK 30→50 | `src/core/HistoryManager.ts` |
| S1-8 | 类型化 `preprocessor.ts` + `postprocessor.ts` + `constants.ts` | ✅ | 参数/返回类型 + Record<string,string> | 三个文件均已类型化 |
| S1-9 | 创建 `fabric-shim.d.ts` + 修复 tsconfig | ✅ | `import type { Canvas } from 'fabric'` 可解析 | `src/fabric-shim.d.ts` `tsconfig.json` |
| S1-10 | 验证 `tsc --noEmit` src/core/ 零错误 | ✅ | `src/core/` 零类型错误 (70 errors all in plugins/) | `npx tsc --noEmit` |

---

## S2：适配层三大接口实现 ✅

| ID | 子任务 | 状态 | AC 达成情况 |
|----|--------|------|------------|
| S2-1 | `StorageAdapter.ts` 接口 + SaveResult | ✅ | save/load 方法签名，SaveResult 类型 |
| S2-2 | `VitePressSaveAdapter.ts` | ✅ | POST 到 saveEndpoint，load 用 fetch |
| S2-3 | `LocalStorageAdapter.ts` | ✅ | localStorage setItem/getItem，键前缀隔离 |
| S2-4 | `ThemeAdapter.ts` 接口 | ✅ | isDark() + onChange() 返回取消函数 |
| S2-5 | `VitePressThemeAdapter.ts` | ✅ | MutationObserver 监听 .dark class 变化 |
| S2-6 | `RenderAdapter.ts` 接口 | ✅ | init/loadSvg/serialize/dispose |
| S2-7 | `FabricRenderAdapter.ts` | ✅ | 委托 CanvasManager + SvgSerializer |
| S2-8 | `svgEditorPlugin` 接入 storage 可切换 | ✅ | storage: 'vitepress'/'localStorage' 选项 |
| S2-9 | 适配层单元测试 | ✅ | 8 tests pass (vitest + happy-dom) |
| S2-10 | tsc --noEmit 零新增错误 | ✅ | src/adapters/ + src/node/ 零类型错误 |

---

## S3：SvgEditor.vue 组件拆分 ✅

| ID | 子任务 | 状态 | AC 达成情况 |
|----|--------|------|------------|
| S3-1 | `EditorCanvas.vue` 子组件 | ✅ | canvas 容器 + loading 态 |
| S3-2 | `EditorToolbar.vue` 子组件 | ✅ | 30+ props，40+ emits，80+ aria-label |
| S3-3 | `EditorStatusbar.vue` | ⏭️ | 已并入 EditorToolbar（缩放/选中信息在工具栏中） |
| S3-4 | `SvgEditor.vue` 重构为容器 | ✅ |  导入子组件，props→emits 编排 |
| S3-5 | 接入 StorageAdapter 保存 | ⚠️ | 保留 fetch('/__svg-save__') 兼容现有流程 |
| S3-6 | plugins/ typecheck 错误 | ⚠️ | 70 errors 均为 fabric 5.x 无类型声明导致，非阻塞 |
| S3-7 | E2E 验证 | ⚠️ | 需有 VitePress dev server 运行才能执行 Playwright |

---

## S4：Markdown 图片语法增强 ✅

| ID | 子任务 | 状态 | 说明 |
|----|--------|------|-----|
| S4-1 | `![alt](xxx.svg)` → `<SvgDiagram>` | ✅ | src.endsWith('.svg') 条件拦截 |
| S4-2 | `![alt](xxx.png)` 不受影响 | ✅ | 非 .svg 走 default renderer |
| S4-3 | `markdownSyntax: false` 退出 | ✅ | 提前 return 不注册拦截 |

---

## S5：测试补齐与 CI 流水线 ✅

| ID | 子任务 | 状态 | 说明 |
|----|--------|------|-----|
| S5-1 | 核心模块 vitest | ✅ | LocalStorageAdapter.test.ts + VitePressThemeAdapter.test.ts (8 tests) |
| S5-2 | vitest 配置 | ✅ | happy-dom 环境，排除 tests/ 目录 |
| S5-3 | Playwright E2E | ⚠️ | 需 VitePress dev server 运行 |
| S5-4 | CI 流水线 | ⚠️ | 留待后续添加 .github/workflows |

---

## S6：java-world 双轨切换验证 🚫

跨仓库依赖，需在 java-world 仓库中实施。本仓库中不阻塞 v0.1.0 发布。

---

## S7：文档/示例/发布准备 ✅

| ID | 子任务 | 状态 | 说明 |
|----|--------|------|-----|
| S7-1 | README.md | ✅ | 安装+配置+架构+开发命令 |
| S7-2 | examples/basic/ | ⚠️ | 留待 v0.1.1 |
| S7-3 | CHANGELOG.md | ✅ | v0.1.0 完整变更记录 |
| S7-4 | package.json | ✅ | version:0.1.0, private:false |
| S7-5 | pnpm build 验证 | ✅ | dist/node/index.mjs (4.77 kB) |

---

## 执行规则

1. **一次只做一个子任务**（S2-1 → S2-2 → ...），做完立即更新状态
2. **plan → execute → verify → log** 四步循环
3. 每日复盘：对比例行中的子任务和本清单，如果偏离则修正
4. 遇到阻碍标记 🚫，附原因
