# 10 — 自动化测试方案

> 测试策略：**测试金字塔 + 兼容性矩阵**。单元测试打底，E2E 兜底，中间用集成测试桥接。

---

## 一、测试金字塔

```
           ╱   E2E   ╲          数量：~15 个 spec
          ╱  (Playwright) ╲       耗时：~5 分钟 / 全量
         ╱──────────────────╲
        ╱    集成测试         ╲     数量：~20 个 spec
       ╱  (Vitest + jsdom)    ╲    耗时：~30 秒
      ╱──────────────────────────╲
     ╱      单元测试               ╲   数量：~60 个 spec
    ╱  (Vitest, 纯逻辑)            ╲  耗时：~3 秒
   ╱──────────────────────────────────╲
```

## 二、测试层级详解

### 2.1 单元测试（Unit Tests）

**目标**：内核层每个模块独立可测，不依赖 DOM、Canvas、VitePress。

| 测试对象                     | 测试内容                                            | 工具                 | 示例 case                                                |
| ---------------------------- | --------------------------------------------------- | -------------------- | -------------------------------------------------------- |
| `EventBus`                   | emit/on/off/once，事件顺序，错误隔离                | Vitest               | 注册 3 个监听器，emit 后按顺序触发；一个抛异常不影响其他 |
| `HistoryManager`             | push/undo/redo，栈上限，空栈操作                    | Vitest               | push 60 步后 undo 50 步，验证栈顶正确                    |
| `SvgLoader`                  | 加载合法 SVG、非法 SVG、空字符串、超大 SVG          | Vitest               | `<svg>...</svg>` 正确解析；`"not svg"` 抛错              |
| `SvgSerializer`              | `canvas.toSVG()` 输出转换为标准 SVG                 | Vitest (mock canvas) | 移除 `data-fabric-*` 属性；CSS 变量还原                  |
| `PluginSystem`               | 注册/卸载/调度插件，插件加载顺序                    | Vitest               | 注册 3 个插件，验证 `install` 回调按序触发               |
| `StorageAdapter` 实现        | VitePressSaveAdapter.save/load, LocalStorageAdapter | Vitest + tmp dir     | save 写入文件，load 读回内容一致                         |
| `ThemeAdapter` 实现          | VitePressThemeAdapter.isDark(), onChange            | Vitest (mock ref)    | 切换 isDark → onChange 回调触发                          |
| preprocessor / postprocessor | 链式调用、异常处理、空函数透传                      | Vitest               | `preprocess: svg → svg` 链式调用；一个抛错不影响链       |

**单元测试覆盖目标**：`core/` 目录代码覆盖率 ≥ 80%。

### 2.2 组件测试（Component Tests）

**目标**：Vue 组件在隔离环境中可渲染、可交互。

| 测试对象              | 测试内容                                          | 工具                     | 示例 case                                  |
| --------------------- | ------------------------------------------------- | ------------------------ | ------------------------------------------ |
| `SvgDiagram.vue`      | props 传递、v-html 渲染、hover 按钮出现、点击触发 | Vitest + @vue/test-utils | 传入 src，验证 `<div v-html>` 内容非空     |
| `SvgEditor.vue`       | 弹窗打开/关闭、loading 态、Teleport 目标          | Vitest + @vue/test-utils | `showEditor=true` → `.editor-overlay` 存在 |
| `EditorToolbar.vue`   | 按钮渲染、disabled 状态、点击 emit                | Vitest + @vue/test-utils | 无选中对象时对齐按钮 disabled              |
| `EditorStatusbar.vue` | 缩放级别显示、坐标显示                            | Vitest + @vue/test-utils | 缩放 150% → 显示 "150%"                    |

**注意**：组件测试中 Fabric.js Canvas 不可用（jsdom 不支持），因此需 mock `CanvasManager` 或仅在测试中验证 DOM 结构，不做 Canvas 交互测试。

### 2.3 集成测试（Integration Tests）

**目标**：多个模块协同工作的完整链路。

| 测试链路              | 测试内容                         | 工具                         | 示例 case                                              |
| --------------------- | -------------------------------- | ---------------------------- | ------------------------------------------------------ |
| load → edit → save    | 完整闭环，使用 mock canvas       | Vitest + jsdom + fabric mock | 加载 SVG → 模拟选中对象 → 修改属性 → 序列化 → 验证输出 |
| undo/redo 完整链路    | 多步操作后 undo 恢复到初始状态   | Vitest                       | 执行 5 步操作 → undo 5 次 → 与初始状态 diff 为零       |
| 插件加载 → 工具栏渲染 | 注册插件后工具栏按钮正确出现     | Vitest                       | 注册 align 插件 → 工具栏出现对齐按钮                   |
| ThemeAdapter 集成     | isDark 变化 → 编辑器重新加载 SVG | Vitest                       | 切换暗色 → canvas 中颜色值从亮色映射变为暗色映射       |

### 2.4 E2E 测试（End-to-End Tests）

**目标**：真实浏览器中完整用户操作路径验证。

**工具**：Playwright（Chromium + Firefox）

**环境**：`SVG_EDITOR_E2E=1 vitepress build && vitepress preview`（生产静态产物 + 测试钩子开关，替代 dev server，避免 HMR/按需编译导致的慢与并发脆弱）

| 测试 spec                    | 覆盖功能                                   | 核心步骤                                                                     |
| ---------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| `basic.spec.ts`              | F1（加载）, F2（选中拖拽）                 | 打开含 SVG 的页面 → 确认 SVG 可见且尺寸>0 → 点击编辑按钮 → 确认 Canvas 渲染  |
| `edit-save.spec.ts`          | F5（保存）, F15（预处理）, F16（保存确认） | 打开编辑器 → 移动一个矩形 → 点击保存 → 等待关闭 → 刷新页面 → 确认 SVG 已改变 |
| `theme-toggle.spec.ts`       | F8（主题切换）                             | 打开编辑器 → 截图亮色 → 切换主题 → 截图暗色 → 像素比较有差异                 |
| `undo-redo.spec.ts`          | F4（undo/redo）                            | 移动对象 → Ctrl+Z → 位置恢复 → Ctrl+Y → 位置回来                             |
| `text-edit.spec.ts`          | F6（文字编辑）, F9（文字格式）             | 双击文字 → 修改内容 → Ctrl+B 加粗 → 保存 → 验证 Bold 生效                    |
| `layer-control.spec.ts`      | F10（层级）                                | 创建 2 个矩形 → 发送到后面 → 验证 z-index 变化                               |
| `align.spec.ts`              | F11（对齐）                                | 选中 2 个对象 → 左对齐 → 验证两者 left 坐标一致                              |
| `distribute.spec.ts`         | F12（等距）                                | 选中 3 个对象 → 水平等距 → 验证间距相等                                      |
| `keyboard-shortcuts.spec.ts` | F14（快捷键）                              | 验证 Ctrl+Z/Y/S/Delete/Del/Ctrl+A 全部生效                                   |
| `arrow-marker.spec.ts`       | F7（箭头）                                 | 打开含 marker 的 SVG → 确认箭头三角形存在 → 拖动线条 → 箭头跟随              |
| `css-variables.spec.ts`      | F1（CSS变量解析）                          | 打开含 `var(--vp-c-brand-1)` 的 SVG → Canvas 中颜色为对应 hex 值             |
| `markdown-syntax.spec.ts`    | Markdown 原生语法                          | `![alt](test.svg)` 在页面中被渲染为可编辑的 SVG 容器                         |
| `multiple-svg.spec.ts`       | 多 SVG 页面                                | 含 5 张 SVG 的页面 → 逐个打开编辑器 → 无内存泄漏                             |
| `edge-cases.spec.ts`         | 边界情况                                   | 空白 SVG、超大 SVG（>1MB）、损坏 SVG、无 viewBox 的 SVG                      |
| `build-preview.spec.ts`      | 核心功能验证（preview 模式）              | preview 模式（5173）下重跑核心 E2E case（`SVG_EDITOR_E2E=1` 注入测试钩子开关，让生产静态产物也能暴露 `window.__fabricCanvas`） |

### 2.5 兼容性矩阵测试

**目标**：确保在不同环境组合下插件正常工作。

| 维度           | 变体                   | 测试方式                                |
| -------------- | ---------------------- | --------------------------------------- |
| VitePress 版本 | 1.0.x, 1.3.x, 1.6.x    | CI Matrix，每个版本跑核心 E2E case      |
| Node.js 版本   | 20 LTS, 22 LTS         | CI Matrix（Node 18 已 EOL，不再纳入）       |
| 浏览器         | Chromium, Firefox      | Playwright projects（每个 spec 跑两次） |
| 包管理器       | pnpm, yarn, npm        | CI 中分别 install + build               |

## 三、测试基础设施

### 3.1 目录结构

```
packages/vitepress-plugin-svg-editor/
├── src/                        # 源码（不变）
├── tests/
│   ├── unit/                   # 单元测试
│   │   ├── EventBus.test.ts
│   │   ├── HistoryManager.test.ts
│   │   ├── SvgLoader.test.ts
│   │   ├── SvgSerializer.test.ts
│   │   ├── PluginSystem.test.ts
│   │   ├── VitePressSaveAdapter.test.ts
│   │   └── VitePressThemeAdapter.test.ts
│   │
│   ├── components/             # 组件测试
│   │   ├── SvgDiagram.test.ts
│   │   ├── SvgEditor.test.ts
│   │   ├── EditorToolbar.test.ts
│   │   └── EditorStatusbar.test.ts
│   │
│   ├── integration/            # 集成测试
│   │   ├── load-edit-save.test.ts
│   │   ├── undo-redo.test.ts
│   │   └── plugin-toolbar.test.ts
│   │
│   ├── e2e/                    # E2E 测试（Playwright）
│   │   ├── fixtures/           # 测试用 SVG 文件
│   │   │   ├── simple.svg
│   │   │   ├── with-marker.svg
│   │   │   ├── with-css-vars.svg
│   │   │   ├── large.svg
│   │   │   └── broken.svg
│   │   ├── helpers.ts          # 公共辅助函数
│   │   ├── basic.spec.ts
│   │   ├── edit-save.spec.ts
│   │   ├── ...
│   │   └── build-preview.spec.ts
│   │
│   └── fixtures/               # 共享 fixtures
│       └── test-svg-content.ts  # 各种 SVG 字符串常量
│
├── vitest.config.ts            # Vitest 配置
├── playwright.config.ts        # Playwright 配置
└── package.json
```

### 3.2 关键配置

**vitest.config.ts**:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // 组件测试需要 DOM
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/core/**'], // 只统计内核覆盖率
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
})
```

**playwright.config.ts**:

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  retries: 1,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
  webServer: [
    {
      command: 'pnpm --filter test-vitepress-site dev',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
})
```

### 3.3 E2E 辅助函数（helpers.ts 核心函数签名）

```ts
// 打开编辑器（从点击"编辑 SVG"按钮到 Canvas 渲染完成）
async function openEditor(page: Page, svgIndex: number): Promise<void>

// 获取 Fabric.js Canvas 实例（通过 window.__fabricCanvas）
async function getCanvas(page: Page): Promise<JSHandle>

// 截图并保存到 tests/screenshots/
async function screenshot(page: Page, name: string): Promise<void>

// 等待编辑器完全关闭
async function waitForEditorClose(page: Page): Promise<void>

// 创建测试用的标准形状
async function addRect(page: Page, opts: RectOpts): Promise<void>
async function addCircle(page: Page, opts: CircleOpts): Promise<void>
async function addText(page: Page, text: string): Promise<void>

// 获取对象状态（位置、大小、属性）
async function getObjectState(page: Page, index: number): Promise<ObjectState>

// 触发快捷键
async function pressShortcut(page: Page, key: string): Promise<void>
```

## 四、CI 流水线

```yaml
# .github/workflows/test.yml（示意）
jobs:
  unit-and-component:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:components

  e2e:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        vitepress: ['1.0.0', '1.3.0', '1.6.0']
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm add -D vitepress@${{ matrix.vitepress }}
      - run: pnpm test:e2e

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm build

  package-manager:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - pm: pnpm
            install: 'pnpm install --frozen-lockfile'
            build: 'pnpm build'
          - pm: yarn
            install: 'yarn install --no-lockfile'
            build: 'yarn build'
          - pm: npm
            install: 'npm install --no-package-lock'
            build: 'npm run build'
    steps:
      - uses: actions/checkout@v4
      - run: ${{ matrix.install }}
      - run: ${{ matrix.build }}
```

## 五、测试 check list（开发提交前自检）

```
[ ] core/ 所有模块有单元测试，覆盖率 ≥ 80%
[ ] 每个 Vue 组件有至少 1 个组件测试
[ ] load → edit → save 集成链路通过
[ ] 含 marker 的 SVG 加载后箭头显示正确
[ ] 含 CSS 变量的 SVG 加载后颜色解析正确
[ ] undo 50 步恢复到初始状态（diff 为零）
[ ] Chrome + Firefox E2E 全部通过
[ ] preview 模式 E2E 全部通过
[ ] 打开编辑器 → 关闭 → 再次打开，无 console error
[ ] 多 SVG 页面逐张编辑，无内存泄漏（heap snapshot 比较）
[ ] 构建产物 `dist/` 下无 ESM/CJS 导入错误
```
