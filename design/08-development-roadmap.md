# 08 — 开发路线图

## 阶段划分原则

- 每个阶段有明确的「可交付物」和「验收标准」
- 前一个阶段的产物是下一个阶段的输入
- 每个阶段完成后必须通过 CI 验证

---

## Phase 0：项目骨架搭建（预计 2-3 天）

**目标**：npm 包项目初始化，空壳可构建、可发布。

### 产出

```
[ ] package.json 配置（name, version, exports, peerDeps, scripts）
[ ] tsconfig.json 配置
[ ] unbuild.config.ts 配置
[ ] src/node/index.ts（空 definePlugin 导出）
[ ] src/client/index.ts（空 enhanceApp 导出）
[ ] .gitignore, .npmignore
[ ] CI 流水线（lint + typecheck + build）
```

### 验收标准

```
[ ] pnpm build 成功，dist/ 下有 .mjs + .cjs + .d.ts
[ ] 在测试 VitePress 项目中 pnpm link 后能 import，不报错
```

---

## Phase 1：内核层实现（预计 5-7 天）

**目标**：内核层完整实现，可独立测试，不依赖 VitePress。

### 产出

```
[ ] core/EventBus.ts          — 事件发布订阅
[ ] core/SvgLoader.ts         — SVG 加载 + 预处理链
[ ] core/SvgSerializer.ts     — SVG 序列化 + 后处理链
[ ] core/CanvasManager.ts     — Fabric.js 画布生命周期
[ ] core/HistoryManager.ts    — 撤销/重做栈
[ ] core/PluginSystem.ts      — 插件注册/调度
[ ] core/types.ts             — 内核公共类型
[ ] core/__tests__/            — 内核单元测试
```

### 验收标准

```
[ ] 所有 core/ 模块有单元测试，覆盖率 > 80%
[ ] CanvasManager 可在纯 Node 环境（jsdom）中初始化 Fabric 画布
[ ] load → edit → serialize 完整链路通过测试
[ ] 预处理/后处理链可插入自定义函数
[ ] PluginSystem 可注册/卸载插件
```

---

## Phase 2：内置插件 & 适配器（预计 4-5 天）

**目标**：从当前项目迁移并重构所有编辑插件，实现适配器接口。

### 产出

```
[ ] plugins/align.ts           — 对齐
[ ] plugins/layer.ts           — 层级控制
[ ] plugins/text-format.ts     — 文字格式
[ ] plugins/distribute.ts      — 等间距分布
[ ] plugins/gradient.ts        — 渐变（可选）
[ ] plugins/shadow.ts          — 阴影（可选）
[ ] plugins/index.ts           — 统一导出

[ ] adapters/storage/StorageAdapter.interface.ts
[ ] adapters/storage/VitePressSaveAdapter.ts
[ ] adapters/storage/LocalStorageAdapter.ts
[ ] adapters/theme/ThemeAdapter.interface.ts
[ ] adapters/theme/VitePressThemeAdapter.ts
[ ] adapters/render/RenderAdapter.interface.ts
[ ] adapters/render/FabricRenderAdapter.ts

[ ] 插件 & 适配器单元测试
```

### 验收标准

```
[ ] 所有内置插件通过 PluginSystem 注册
[ ] VitePressSaveAdapter 在 VitePress 项目中保存成功
[ ] LocalStorageAdapter 在浏览器中保存/读取成功
[ ] 切换适配器不修改内核代码
```

---

## Phase 3：Vue 组件 & VitePress 集成（预计 4-5 天）

**目标**：Vue 组件完整实现，通过 definePlugin 集成到 VitePress。

### 产出

```
[ ] src/components/SvgDiagram.vue       — 展示组件
[ ] src/components/SvgEditor.vue        — 编辑器弹窗（defineClientComponent）
[ ] src/components/sub/EditorToolbar.vue
[ ] src/components/sub/EditorCanvas.vue
[ ] src/components/sub/EditorStatusbar.vue

[ ] src/node/vite-plugin.ts             — Vite 插件（save 端点 + optimizeDeps）
[ ] src/node/markdown-plugin.ts          — Markdown-it 插件（可选）
[ ] src/node/index.ts                    — definePlugin 导出

[ ] src/client/index.ts                  — enhanceApp 函数
```

### 验收标准

```
[ ] SvgDiagram 在 VitePress markdown 中正常渲染 SVG
[ ] 点击"编辑 SVG"打开 SvgEditor，Canvas 正确显示
[ ] 拖拽编辑 → 保存 → 文件更新 → 页面刷新显示新内容
[ ] dev 模式、build+preview 模式均通过测试
[ ] 暗色/亮色主题切换正常工作
```

---

## Phase 4：E2E 测试 & 兼容性验证（预计 3-4 天）

**目标**：全流程 E2E 测试覆盖，兼容性矩阵验证。

### 产出

```
[ ] tests/e2e/basic.spec.ts          — 基本功能
[ ] tests/e2e/edit-save.spec.ts      — 编辑 & 保存
[ ] tests/e2e/theme-toggle.spec.ts   — 主题切换
[ ] tests/e2e/plugins.spec.ts        — 插件功能
[ ] tests/e2e/multiple-svg.spec.ts   — 多 SVG 页面
[ ] tests/e2e/edge-cases.spec.ts     — 边界情况

[ ] CI 兼容性矩阵（VitePress 1.0/1.3/1.6 × Node 18/20/22 × Chrome/Firefox）
```

### 验收标准

```
[ ] 所有 E2E case 在 CI 上通过（Chrome + Firefox）
[ ] 兼容性矩阵全绿
[ ] 边界 case 覆盖：空白 SVG、超大 SVG、嵌套 SVG、含 marker 的 SVG
```

---

## Phase 5：文档 & 发布（预计 3-4 天）

**目标**：用户文档、API 参考、示例项目。

### 产出

```
[ ] README.md                   — 快速开始 + 配置参考
[ ] docs/guide/getting-started.md
[ ] docs/guide/configuration.md
[ ] docs/guide/custom-storage.md
[ ] docs/guide/custom-plugins.md
[ ] docs/api/plugin-options.md  — 配置项 API 参考
[ ] docs/api/hooks.md           — 生命周期钩子 API 参考
[ ] docs/api/storage-adapter.md — StorageAdapter API
[ ] examples/basic/              — 最小示例 VitePress 项目
[ ] examples/custom-storage/     — 自定义存储示例
[ ] CHANGELOG.md
```

### 验收标准

```
[ ] 文档覆盖所有公开 API
[ ] 示例项目可 clone 后直接 pnpm dev 运行
[ ] npm publish 后可通过 npm install 安装
```

---

## 依赖关系图

```
Phase 0（骨架）
    │
    ▼
Phase 1（内核）──── 可独立测试，不依赖后续 Phase
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 2（插件+适配器）    （Phase 1 单元测试持续完善）
    │
    ▼
Phase 3（Vue组件+集成）── 此时才能完整 E2E 测试
    │
    ▼
Phase 4（E2E+兼容性）
    │
    ▼
Phase 5（文档+发布）
```

## 总时间估算

| 阶段 | 乐观 | 悲观 | 依赖 |
|------|------|------|------|
| Phase 0 | 2天 | 3天 | 无 |
| Phase 1 | 5天 | 7天 | Phase 0 |
| Phase 2 | 4天 | 5天 | Phase 1 |
| Phase 3 | 4天 | 5天 | Phase 2 |
| Phase 4 | 3天 | 4天 | Phase 3 |
| Phase 5 | 3天 | 4天 | Phase 4 |
| **总计** | **21天** | **28天** | |

注：以上为单人全职开发估算。
