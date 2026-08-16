# 12 — 代码抽离与双轨开发策略

> 核心问题：如何在开发独立 npm 包的过程中，让原 java-world 项目继续正常使用 SVG 编辑器功能？

---

## 一、现状盘点

当前 SVG 编辑器代码分布在 `docs/.vitepress/` 下，共 **20 个文件**：

```
docs/.vitepress/
├── config.mts                        ← 含 /__svg-save__ 端点、Fabric.js CDN 注入
├── editor-server.py                  ← Node.js 保存脚本
├── start-editor.sh                   ← 启动脚本
├── test-editor.mjs                   ← 离线测试
├── test-svg-editor.sh
├── svg-editor.html                   ← 独立 HTML 编辑器（35KB）
└── theme/
    ├── index.ts                      ← 注册 SvgEditor/SvgDiagram 组件
    ├── custom.css                    ← 编辑器样式（7KB）
    └── components/
        ├── SvgDiagram.vue            ← SVG 展示组件（1.9KB）
        ├── SvgEditor.vue             ← 编辑器弹窗（33.8KB）
        └── editor/
            ├── CanvasManager.js      ← Fabric 画布管理（10KB）
            ├── HistoryManager.js     ← 撤销/重做（2KB）
            ├── constants.js          ← CSS 颜色映射（12.8KB）
            ├── preprocessor.js       ← SVG 预处理（7.4KB）
            ├── postprocessor.js      ← SVG 后处理（4.3KB）
            └── plugins/              ← 8 个编辑器插件
                ├── align.js          ← 对齐
                ├── arrow-merger.js   ← 箭头合并
                ├── distribute.js     ← 等距分布
                ├── gradient.js       ← 渐变
                ├── layer.js          ← 层级
                ├── selection.js      ← 选择
                ├── shadow.js         ← 阴影
                └── text-format.js    ← 文字格式
```

以及测试文件在 `tests/` 目录：

```
tests/
├── svg-editor.spec.ts               ← 基础 E2E 测试
├── svg-editor-full.spec.ts          ← 全量功能测试
├── svg-editor-edge.spec.ts          ← 边界测试
├── theme-toggle.spec.ts             ← 主题切换测试
└── canvas-helpers.ts                ← Canvas 测试辅助
```

---

## 二、总体策略：六阶段双轨过渡

**核心原则**：每一阶段原项目都能正常 build、正常 dev、正常编辑 SVG，不存在"等插件开发完才能用"的窗口期。

```
Phase A（当前）  Phase B        Phase C        Phase D        Phase E        Phase F
原项目内嵌      Monorepo 壳    内核从原项目    适配层连接    原项目切换为    彻底移除
所有代码 ────►  创建完毕 ────►  迁移到插件包 ──► 插件包 ──►  引用插件包 ──► 旧代码
                插件包空壳                                   workspace:*
   ✅ 可用        ✅ 可用         ✅ 可用          ✅ 可用         ✅ 可用          ✅ 可用
```

---

## Phase A：当前状态（基准线）

```
java-world/
├── docs/.vitepress/theme/components/editor/  ← 所有编辑器代码
├── docs/.vitepress/theme/components/SvgEditor.vue
├── docs/.vitepress/theme/components/SvgDiagram.vue
├── docs/.vitepress/theme/index.ts             ← 直接在这里注册组件
├── docs/.vitepress/config.mts                 ← /__svg-save__ 写死在这里
└── tests/                                     ← E2E 测试
```

**此时原项目的导入方式**：

```ts
// docs/.vitepress/theme/index.ts
import SvgEditor from './components/SvgEditor.vue'
import SvgDiagram from './components/SvgDiagram.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SvgEditor', SvgEditor)
    app.component('SvgDiagram', SvgDiagram)
  },
}
```

---

## Phase B：搭建 Monorepo 壳（1 天）

将 java-world 改造为 pnpm workspace monorepo，创建空壳插件包。

### 目录变化

```
java-world/                              ← 现仓库根目录
├── pnpm-workspace.yaml                  ← 新增
├── package.json                         ← 修改：加 private:true
├── docs/                                ← 不变，原 VitePress 项目
│   └── .vitepress/theme/components/editor/  ← 不变
│
└── packages/
    └── vitepress-plugin-svg-editor/     ← 新增空壳
        ├── package.json                 ← name + exports + peerDeps
        ├── tsconfig.json
        ├── unbuild.config.ts
        └── src/
            ├── node/index.ts            ← 空 export
            └── client/index.ts          ← 空 export
```

### 关键文件

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

`packages/vitepress-plugin-svg-editor/package.json`:

```json
{
  "name": "vitepress-plugin-svg-editor",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/node/index.mjs",
  "types": "./dist/node/index.d.ts",
  "exports": {
    ".": { "import": "./dist/node/index.mjs", "types": "./dist/node/index.d.ts" },
    "./client": { "import": "./dist/client/index.mjs", "types": "./dist/client/index.d.ts" }
  },
  "files": ["dist"],
  "scripts": {
    "build": "unbuild",
    "dev": "unbuild --stub"
  }
}
```

**验收标准**：

```
[ ] pnpm install 成功，不报错
[ ] pnpm --filter vitepress-plugin-svg-editor build 成功
[ ] 原项目 pnpm docs:dev 正常启动，SVG 编辑器功能不变
```

---

## Phase C：内核代码迁移——"复制，不删除"（3-4 天）

**关键原则**：从原项目**复制**文件到插件包，原路径下的旧文件**暂不删除**。插件包中的代码会被重构（JS→TS、接口化），原项目继续使用旧代码。

### 文件迁移映射

| 原路径                                      | 新路径                                    | 变化            |
| ------------------------------------------- | ----------------------------------------- | --------------- |
| `theme/components/editor/CanvasManager.js`  | `packages/.../src/core/CanvasManager.ts`  | JS→TS，提取接口 |
| `theme/components/editor/HistoryManager.js` | `packages/.../src/core/HistoryManager.ts` | JS→TS           |
| `theme/components/editor/constants.js`      | `packages/.../src/core/constants.ts`      | 分类整理        |
| `theme/components/editor/preprocessor.js`   | `packages/.../src/core/preprocessor.ts`   | 可配置化        |
| `theme/components/editor/postprocessor.js`  | `packages/.../src/core/postprocessor.ts`  | 可配置化        |
| `theme/components/editor/plugins/*.js`      | `packages/.../src/plugins/*.ts`           | 改为注册式      |

**验收标准**：

```
[ ] pnpm --filter vitepress-plugin-svg-editor build 成功
[ ] core/ 目录单元测试覆盖率 ≥ 80%
[ ] 原项目 pnpm docs:dev 正常启动（仍用旧代码）
[ ] 原项目 E2E 测试全绿
```

---

## Phase D：适配层 + Vue 组件实现（4-5 天）

实现 `StorageAdapter`、`ThemeAdapter`、`definePlugin`、`SvgDiagram.vue`、`SvgEditor.vue`。

此时原项目**仍然使用旧代码**，但可以通过 `workspace:*` 在本地验证新插件包。

### 本地验证方式

在原项目的 `docs/.vitepress/theme/index.ts` 中**临时添加一个分支**来验证新包：

```ts
// docs/.vitepress/theme/index.ts

// === 新插件包验证分支（以环境变量控制） ===
if (import.meta.env.VITE_USE_NEW_EDITOR === 'true') {
  // 使用新插件包
  import 'vitepress-plugin-svg-editor/client'
} else {
  // 继续使用旧代码
  import SvgEditor from './components/SvgEditor.vue'
  import SvgDiagram from './components/SvgDiagram.vue'
  // ... 原有注册逻辑
}
```

通过 `VITE_USE_NEW_EDITOR=true pnpm docs:dev` 切换到新包验证，默认仍走旧代码。

**验收标准**：

```
[ ] VITE_USE_NEW_EDITOR=true 时编辑器正常打开、编辑、保存
[ ] VITE_USE_NEW_EDITOR=false（默认）时原编辑器正常
[ ] definePlugin 在本地 VitePress 项目中可正常导入
```

---

## Phase E：原项目切换为引用插件包（1 天）

这是"切换日"——原项目移除旧代码，改为从 `workspace:*` 引用本地插件包。

### 切换到新代码

```ts
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import 'vitepress-plugin-svg-editor/client'

export default {
  extends: DefaultTheme,
}
```

```ts
// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  plugins: [
    svgEditorPlugin({
      saveDir: 'public/diagrams/',
    }),
  ],
})
```

### 文件清理

此时删除原 `docs/.vitepress/theme/components/editor/` 目录下所有旧代码文件。

**回滚策略**：如果切换后发现回归问题，git revert 回到 Phase D 状态，旧代码还在 git 历史中。

**验收标准**：

```
[ ] 删除旧代码后项目仍正常 build + dev
[ ] E2E 测试全部通过
[ ] 与切换前截图 diff 无回归
```

---

## Phase F：清理与发布（1 天）

### 清理

```
[ ] 移除 VITE_USE_NEW_EDITOR 环境变量判断逻辑
[ ] 移除 docs/.vitepress/theme/components/editor/ 旧目录
[ ] 移除 editor-server.py、start-editor.sh、test-editor.mjs 等辅助脚本
[ ] 测试文件 tests/ 移到 packages/vitepress-plugin-svg-editor/tests/
```

### 插件包发布

```
[ ] private:true → private:false
[ ] 版本号 0.0.0 → 0.1.0
[ ] pnpm publish
```

---

## 三、日常开发工作流

### 开发插件时

```bash
# 终端 1：插件包 dev 模式（unbuild --stub，自动 watch）
pnpm --filter vitepress-plugin-svg-editor dev

# 终端 2：原项目 docs dev
pnpm docs:dev
# 如果 VITE_USE_NEW_EDITOR=true，则实时验证新包效果
```

### 修改原项目文档时

```bash
pnpm docs:dev
# 不设置 VITE_USE_NEW_EDITOR，使用旧代码（Phase D 前）
# 或默认使用新包（Phase E 后）
```

### 运行测试

```bash
# 插件包单元测试
pnpm --filter vitepress-plugin-svg-editor test

# 原项目 E2E 测试（验证原项目没有回归）
pnpm test:e2e
```

---

## 四、配置文件统一管理

| 配置项             | 过渡期位置                                                                  | 最终位置                                     |
| ------------------ | --------------------------------------------------------------------------- | -------------------------------------------- |
| CSS 颜色映射       | `theme/components/editor/constants.js`（旧）+ `src/core/constants.ts`（新） | `svgEditorPlugin({ cssVariableMap })` 默认值 |
| Fabric.js CDN URL  | `config.mts` transformHead                                                  | 插件内置 + `cdnUrl` 配置项                   |
| /**svg-save** 端点 | `config.mts` vite plugin                                                    | 插件内置 `VitePressSaveAdapter`              |
| 预处理逻辑         | `theme/components/editor/preprocessor.js`                                   | 插件内置 + `preprocess` 钩子                 |
| 目录白名单         | `config.mts` save-tool                                                      | `StorageAdapter.saveDir` 配置                |

---

## 五、回滚与应急方案

| 场景                              | 操作                                                              |
| --------------------------------- | ----------------------------------------------------------------- |
| Phase D 新包验证有 bug            | 关掉 `VITE_USE_NEW_EDITOR` 环境变量，旧代码完全不受影响           |
| Phase E 切换后出问题              | `git revert` 回到 Phase D                                         |
| npm publish 后有严重问题          | `npm deprecate pkg@0.1.0` + 原项目 pin 到上一个可用的 commit hash |
| 原项目依赖了新包但 pnpm link 断开 | `pnpm install` 自动重新建立 workspace soft link                   |

---

## 六、检查清单

```
Phase B 完成检查
[ ] pnpm-workspace.yaml 创建
[ ] 根 package.json 添加 "private": true
[ ] 插件包空壳创建并 build 成功
[ ] 原项目 pnpm docs:dev 正常

Phase C 完成检查
[ ] core/ 所有文件从 .js 改为 .ts
[ ] core/ 单元测试绿色
[ ] 原项目仍用旧代码，不受影响

Phase D 完成检查
[ ] VITE_USE_NEW_EDITOR=true 时编辑器可用
[ ] VITE_USE_NEW_EDITOR=false 时原编辑器仍可用

Phase E 完成检查
[ ] 旧代码已删除
[ ] 原项目引用 workspace:* 正常工作
[ ] E2E 全绿

Phase F 完成检查
[ ] 所有辅助脚本已清理
[ ] 插件包 npm publish 成功
[ ] 外部项目可 npm install 使用
```
