# 05 — 用户痛点与预防清单

> 来源：GitHub Issues、Stack Overflow、Hacker News、开发者论坛、NPM 包 issue 区
> 方法论：用开放问题搜索法（不预设立场），关注 2024-2026 年时间窗口

## 5.1 真实用户痛点汇总

### 类别 A：VitePress 插件集成痛点

| # | 痛点 | 真实案例 | 影响 |
|---|------|---------|------|
| A1 | **CJS/ESM 导出不兼容** | `vue3-waterfall-plugin` 打包报 `Named export not found` | 🔴 插件无法安装 |
| A2 | **组件名冲突导致白屏** | CmdWise 批量注册 Lucide 图标 → 与 VitePress 内置组件冲突 → 白屏+Sidebar消失 | 🔴 站点无法使用 |
| A3 | **markdown-it 插件版本不兼容** | `markdown-it-mathjax3@5.x` 在 VitePress 中 `<script>` 标签被忽略 | 🟡 功能静默失效 |
| A4 | **pnpm 依赖穿透失败** | `vitepress-sidebar` 内部依赖 dayjs（CJS）→ pnpm 严格隔离 → Vite 找不到 | 🟡 dev 模式报错 |
| A5 | **dev正常 build崩溃** | Sentry Release 插件 buildEnd 残留代码 → 生产环境 `lexical declaration` 错误 | 🔴 上线后才发现 |
| A6 | **插件在三个文件分散配置** | Mermaid 插件需要改 config.ts + theme/index.ts + vite.plugins 三处 | 🟡 断点难排查 |
| A7 | **Node 大版本断崖** | `vite-plugin-vue-devtools@8.0.3` 在 Node 25 上直接 panic | 🔴 升级Node即挂 |
| A8 | **SSR 中访问 window 报错** | 第三方库在 import 时读 `window.location` → VitePress 构建时 `window is not defined` | 🔴 构建失败 |

### 类别 B：Fabric.js / Canvas 渲染痛点

| # | 痛点 | 真实案例 | 来源 |
|---|------|---------|------|
| B1 | **SVG 解析 Bug 山** | clipPath 无限递归(#10659)、linearGradient 不支持百分比(#8515)、textLength 不渲染(#6389) | Fabric.js GitHub Issues |
| B2 | **Firefox vs Chrome 性能差 5 倍** | 1万个圆 Chrome 选中瞬间，Firefox 5 秒(#10477) | Fabric.js Discussions |
| B3 | **高分辨率图+多 filter 卡死** | 7684×4320 背景 + 8 个 filter → 浏览器白屏(#10740) | Fabric.js Discussions |
| B4 | **内存泄漏** | 事件监听器累积，长时间运行内存持续增长 | 开发者社区 |
| B5 | **Vue reactive 代理 canvas 对象** | 图层拖动卡顿至浏览器崩溃(yft-design #120) | GitHub Issue |
| B6 | **移动端体验差** | "Fabric.js doesn't work well on Mobile"(#6980) | Fabric.js Issues |
| B7 | **CSP 安全策略冲突** | 依赖 `unsafe-eval`，严格CSP项目直接屏蔽(#9666) | Fabric.js Issues |
| B8 | **现代打包工具不兼容** | Next.js + Rollup 集成一团糟(#8444) | Fabric.js Issues |

### 类别 C：SVG 编辑器 UX 痛点

| # | 痛点 | 真实案例 | 来源 |
|---|------|---------|------|
| C1 | **新用户 10 秒放弃** | Hyvector 被 HN 用户吐槽"不知道怎么用"、"画布空白不知道怎么开始" | Hacker News |
| C2 | **导出到其他软件样式丢失** | Fabric.js 输出的 SVG 不够标准，在 Illustrator 中样式异常 | CSDN |
| C3 | **细线/小元素点不中** | 0.5px 线宽的线缩放后根本点不中（Canvas 命中检测缺陷） | 开发者社区 |
| C4 | **缩放后文字模糊** | Canvas 位图渲染 vs SVG 矢量本质的矛盾 | CSDN |
| C5 | **svg <marker> 完全不支持** | Fabric.js 无 `<marker>` 概念，箭头全部丢失（我们项目已遇） | 自身经验 |
| C6 | **CSS 变量 `var(--xxx)` 不解析** | Fabric.js 无法理解 CSS 变量，当作非法颜色值，渲染为透明（我们项目已遇） | 自身经验 |

## 5.2 预防清单

### VitePress 集成预防（8项）

```
[ ] A1-ESM双输出：package.json exports 提供 import/require 双入口
[ ] A2-组件名前缀：所有全局组件加前缀（SvgEditor*, SvgDiagram*），不批量注册
[ ] A3-锁依赖版本：peerDependencies 声明版本范围，CI 测多个 markdown-it 版本组合
[ ] A4-optimizeDeps显式声明：Vite 插件中自动注入 vite.optimizeDeps.include
[ ] A5-build+preview E2E：CI 覆盖 dev/build/preview 三阶段，不只 dev
[ ] A6-definePlugin封装：一个函数覆盖 vite+markdown+theme 三层配置
[ ] A7-多Node版本CI：Node 18/20/22 LTS 全覆盖
[ ] A8-defineClientComponent：所有 Canvas/DOM 代码用 defineClientComponent 包裹
```

### Fabric.js 预防（5项）

```
[ ] B1-preprocessor插槽：提供 preprocess 钩子让用户自定义SVG清洗逻辑
[ ] B2-不假设浏览器：renderOnAddRemove 批量模式，避免同步渲染卡顿
[ ] B3-filter限制：不内置大图filter功能，如有需要提示用户性能风险
[ ] B4-dispose清理：onUnmounted 中 canvas.dispose() + 移除所有事件监听
[ ] B5-markRaw防护：Fabric对象用 markRaw() 包装，避免Vue reactive代理
```

### UX 预防（4项）

```
[ ] C1-初始引导：空画布显示"拖入SVG文件或点击打开"，不展示空白
[ ] C2-标准SVG输出：postprocess 将 Fabric.js 输出还原为标准SVG
[ ] C3-增大命中区域：为小元素自动添加透明 padding 扩展点击区域
[ ] C4-retina缩放：enableRetinaScaling=true，objectCaching 按需开关
```

### 本项目已修复的坑（必须保留修复方案，不能退化）

```
[ ] 修复1：CSS变量 28 个全覆盖（不能退化到只覆盖 21 个）
[ ] 修复2：<marker> → <polygon> 预处理（6 张箭头图的修复不能丢）
[ ] 修复3：v-html 中间层 display:contents（SVG computed width=0 的修复不能丢）
[ ] 修复4：Canvas dispose() 清理（内存泄漏修复不能丢）
[ ] 修复5：Fabric.js CDN 5s 超时 + onerror（加载失败处理不能丢）
```

## 5.3 测试策略

| 测试层级 | 覆盖内容 | 工具 |
|---------|---------|------|
| **单元测试** | CanvasManager, HistoryManager, SvgLoader, SvgSerializer 纯逻辑 | Vitest |
| **组件测试** | SvgDiagram, SvgEditor Vue 组件渲染和交互 | Vitest + @vue/test-utils |
| **集成测试** | StorageAdapter 集成、完整的 load→edit→save 链路 | Vitest |
| **E2E 测试** | dev 模式打开编辑器、build+preview 模式验证、多浏览器 | Playwright |
| **兼容性矩阵** | VitePress 1.0/1.3/1.6 × Node 18/20/22 × Chrome/Firefox/Safari | CI Matrix |
