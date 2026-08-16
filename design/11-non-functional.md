# 11 — 插件非功能性能力清单

> 一个插件从"能用"到"好用"再到"被社区信任"，差距往往不在核心功能（编辑 SVG），而在于这些「非功能性」能力。以下 15 个维度按优先级分为 P0（缺一不可）、P1（品质门槛）、P2（信任门槛）三层。

---

## P0：缺一个就没法发布

### 1. 安装与集成体验（Zero-Friction Onboarding）

**目标**：用户从知晓到首次成功使用不超过 3 分钟。

| 要求           | 具体做法                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| 一行安装       | `pnpm add vitepress-plugin-svg-editor`                                                                        |
| 一行配置       | `config.ts` 中 `svgEditorPlugin()` 一行                                                                       |
| 一行注册       | `theme/index.ts` 中 `import 'pkg/client'` 一行                                                                |
| 零额外依赖     | Fabric.js 作为 optional peerDep，用户已有则复用                                                               |
| 开箱即用       | 默认值覆盖 90% 场景，不强制用户理解 `StorageAdapter`                                                          |
| 安装失败可诊断 | `peerDependencies` 缺失时给出精确警告（"Fabric.js 未安装，请执行 pnpm add fabric"）而非模棱两可的 import 报错 |

**反例**：Mermaid 插件需要在三个文件分别配置，用户首次集成平均 30 分钟。

---

### 2. 清晰的错误处理（Fail Loudly, Fail Helpfully）

**目标**：用户看到错误时能自己解决，不需要来提 Issue。

| 场景              | 错误信息要求                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| SVG 文件不存在    | `未找到 SVG 文件 "/diagrams/foo.svg"，请检查路径是否正确。当前页面路径：/guide/xxx`                        |
| SVG 格式非法      | `SVG 文件解析失败：第 23 行缺少闭合标签 </g>。文件：/diagrams/foo.svg`                                     |
| Fabric.js 未加载  | `Fabric.js 未加载。请确认已安装 fabric 依赖：pnpm add fabric`                                              |
| 保存失败          | `保存失败：HTTP 403。保存端点仅允许 diagrams/ 目录下的 .svg 文件。当前路径：/diagrams/../../../etc/passwd` |
| Canvas 初始化失败 | `Canvas 初始化超时（5s）。请检查浏览器是否支持 Canvas API 或 Fabric.js CDN 是否可达。`                     |

**原则**：

- 永远不输出 `undefined is not a function` 给用户
- 每条错误包含：发生了什么 + 为什么 + 怎么修
- 对开发者调错友好的场景提供 `debug: true` 开启详细堆栈

---

### 3. 安全防护（Security）

**目标**：插件不会成为攻击面。

| 威胁                                     | 防护措施                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| 路径遍历（`../../etc/passwd`）           | `StorageAdapter` 中校验路径必须在 `docs/public` 白名单内，拒绝 `../`    |
| XSS（SVG 内嵌 `<script>`）               | `SvgLoader` 加载时自动移除 `<script>`、`onclick`、`onload` 等标签和属性 |
| CSS 注入（SVG `<style>` 中引用外部资源） | 默认剥离 `@import url(...)`，可通过 `preprocess` 钩子自定义策略         |
| SSRF（SVG 引用外部图片）                 | 默认禁止加载外部 URL 的 `<image href="http://...">`，仅允许 data: URI   |
| 大文件 DoS                               | `SvgLoader` 拒绝 > 10MB 的 SVG，可在配置中调整 `maxFileSize`            |

**注意**：安全策略不应该是"默认放行 + 用户自行配置"，而应该是"默认最严 + 提供放行配置"。参见 [05-pain-points](../05-pain-points-and-prevention/prevention-checklist.md) 中的 A7。

---

### 4. 性能基线（Performance Budget）

**目标**：插件本身不能成为性能瓶颈。

| 指标                    | 目标值                                        | 测量方式                                                  |
| ----------------------- | --------------------------------------------- | --------------------------------------------------------- |
| 插件 npm 包体积（gzip） | < 50KB（不含 fabric）                         | `size-limit` CI 检查                                      |
| 编辑器打开延迟          | < 2 秒（包含 Fabric.js 加载 + Canvas 初始化） | E2E 计时                                                  |
| 撤销/重做延迟           | < 100ms（50 步历史）                          | 单元测试计时                                              |
| Canvas 帧率             | ≥ 30fps（100 个对象场景）                     | Playwright `page.evaluate(() => requestAnimationFrame)`   |
| 多 SVG 页面无泄漏       | 打开→关闭编辑器 10 次，heap 增长 < 5MB        | Playwright `performance.measureUserAgentSpecificMemory()` |
| 构建产物无冗余代码      | 未使用的插件不打包进 bundle                   | tree-shaking 验证（rollup-plugin-visualizer）             |

---

## P1：品质门槛——没有这些用户会觉得"粗糙"

### 5. TypeScript 类型支持

| 要求              | 具体做法                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| 完整 `.d.ts` 导出 | `package.json` 的 `types` 字段指向 `dist/node/index.d.ts`                |
| 配置项类型严格    | `SvgEditorPluginOptions` 每个字段有 JSDoc 注释，IDE hover 可见           |
| 事件类型安全      | `onSelect: (objects: fabric.Object[]) => void` 而非 `onSelect: Function` |
| 泛型适配器        | `StorageAdapter<TConfig>` 让自定义适配器也有类型推导                     |

---

### 6. 日志与调试能力（Observability）

| 能力               | 实现                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `debug: true` 开关 | 开启后 Console 输出：SVG 加载耗时、preprocess 链执行顺序、Canvas 对象数、保存结果                                           |
| 性能标记           | `performance.mark('svg-editor:load-start')` → `performance.mark('svg-editor:load-end')`，可在 DevTools Performance 面板查看 |
| 错误上报钩子       | `onError: (error, context) => void`，用户可接入 Sentry/DataDog                                                              |
| 编辑器状态导出     | `canvas.toJSON()` 一键导出完整状态用于 Issue 复现                                                                           |

---

### 7. 可访问性（Accessibility / a11y）

| 要求           | 具体做法                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| 键盘全操作     | Tab 在工具栏按钮间切换，Enter/Space 触发，Escape 关闭弹窗，所有操作有键盘路径                         |
| 屏幕阅读器标签 | 工具栏按钮有 `aria-label`（如 `aria-label="加粗 Ctrl+B"`），Canvas 区域有 `role="img"` + `aria-label` |
| 焦点管理       | 弹窗打开时焦点自动移到编辑器内第一个可交互元素，关闭时焦点回到触发按钮                                |
| 高对比度模式   | 编辑器工具图标在 `prefers-contrast: high` 下使用粗线条版本                                            |
| 缩放不依赖鼠标 | 提供 `Ctrl+=`/`Ctrl+-` 缩放快捷键和工具栏缩放按钮，不强制滚轮                                         |

---

### 8. 国际化（i18n）

**目标**：编辑器 UI 支持多语言，默认提供中英文。

| 组件           | 需要翻译的文本                                |
| -------------- | --------------------------------------------- |
| 工具栏 tooltip | "加粗", "斜体", "撤销", "保存", "上移一层"... |
| 状态栏         | "缩放: 100%", "选中: 3 个对象"                |
| 确认对话框     | "确定保存？", "保存成功", "保存失败"          |
| 加载态         | "正在加载 SVG...", "正在保存..."              |

**实现方式**：参考 `vitepress-demo-plugin` 的 i18n 方案——通过 `MutationObserver` 监听 `document.documentElement.lang` 自动切换，无需用户额外配置。语言包为独立 JSON/TS 文件，易于社区贡献新语言。

---

### 9. 主题兼容（Theming）

| 要求              | 实现                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| 暗色/亮色自动跟随 | `ThemeAdapter` 读取 VitePress 的 `isDark`，编辑器 UI 和 Canvas 内容同步切换            |
| CSS 变量覆盖      | 编辑器工具栏/弹窗的边框、背景、文字颜色通过 CSS 变量暴露，用户可在 `custom.css` 中覆盖 |
| 无闪烁            | 首屏不出现亮色→暗色的主题闪烁（`themeReady` 守卫）                                     |
| 品牌色定制        | `--svg-editor-accent` 等变量允许用户匹配自己的品牌色                                   |

---

### 10. 向后兼容性承诺（Backward Compatibility）

| 承诺                    | 说明                                                                       |
| ----------------------- | -------------------------------------------------------------------------- |
| Semver 严格遵守         | MAJOR：破坏性 API 变更；MINOR：向后兼容的新功能；PATCH：Bug 修复           |
| 废弃警告期 ≥ 1 个 MINOR | 标记为 `@deprecated` 的 API 至少在一个 MINOR 版本中继续工作并 Console.warn |
| Migration Guide         | MAJOR 版本发布时附带从上一 MAJOR 迁移的步骤文档                            |
| peerDep 版本范围不锁死  | `"vitepress": ">=1.0.0 <2.0.0"` 而非 `"vitepress": "^1.6.0"`               |

---

## P2：信任门槛——社区愿意推荐你而不推荐竞品的理由

### 11. 文档体系（Documentation）

不仅仅是 README，而是一个完整的 Diátaxis 四层文档体系：

| 层级                        | 内容                                                      | 对应文档                          |
| --------------------------- | --------------------------------------------------------- | --------------------------------- |
| **Tutorial**（教程）        | 5 分钟从零搭建                                            | `docs/guide/getting-started.md`   |
| **How-To**（操作指南）      | 自定义存储、自定义插件、自定义主题                        | `docs/guide/custom-storage.md` 等 |
| **Reference**（API 参考）   | 所有配置项、钩子、接口的类型和说明                        | `docs/api/`                       |
| **Explanation**（原理解释） | 为什么用 markdown-it 拦截？为什么用 Fabric 而非原生 SVG？ | `docs/explanation/`               |

附带一个 **可 clone 运行的示例项目**（`examples/basic/`），用户 `git clone && pnpm dev` 就能看到效果。

---

### 12. 版本管理与发布流程

| 要求             | 实现                                                          |
| ---------------- | ------------------------------------------------------------- |
| 自动化 changelog | `changesets` 或 `conventional-changelog` 根据 commit 自动生成 |
| 版本发布 CI      | GitHub Actions 打 tag → 自动 npm publish                      |
| 预发布渠道       | `next` tag（`npm i pkg@next`）供早期测试                      |
| 发布前 checklist | CI 全绿 + E2E 全过 + bundle size 未超预算 → 才允许发布        |

---

### 13. 社区健康（Community Health）

| 要求               | 实现                                                         |
| ------------------ | ------------------------------------------------------------ |
| Issue 模板         | Bug Report / Feature Request 两个模板，引导用户提供复现步骤  |
| 响应 SLA           | Issues 48h 内首次回复                                        |
| CONTRIBUTING.md    | 本地开发环境搭建、代码风格、PR 规范、测试要求                |
| CODE_OF_CONDUCT.md | 社区行为准则                                                 |
| 讨论区             | GitHub Discussions 开放，不用 Issues 做 Q&A                  |
| Star 不是目的      | 比起 Star 数，更关注 Issue 关闭率、PR 合并速度、NPM 周下载量 |

---

### 14. 许可与合规

| 要求           | 说明                                                            |
| -------------- | --------------------------------------------------------------- |
| MIT License    | 最宽松，商业友好                                                |
| 依赖许可证审计 | CI 中 `license-checker` 确保所有依赖 License 兼容               |
| 无 GPL 传染    | 不引入 GPL/AGPL 依赖，避免用户法律风险                          |
| 署名声明       | 如果使用 Fabric.js（MIT），在 README 的 Acknowledgements 中致谢 |

---

### 15. 扩展生态（Plugin Ecosystem）

**让插件本身也能被扩展**——这是最高级的非功能性能力。

| 能力           | 实现                                                               |
| -------------- | ------------------------------------------------------------------ |
| 自定义插件 API | `PluginSystem.register(plugin)` 接口，第三方可开发编辑插件         |
| 事件钩子       | `onSelect` `onModify` `onSave` `onClose` 等 7+ 生命周期钩子        |
| 渲染引擎可替换 | `RenderAdapter` 抽象，允许未来切换 Konva.js 或原生 SVG DOM         |
| 存储后端可替换 | `StorageAdapter` 抽象，支持文件系统 / REST API / S3 / localStorage |
| 示例插件仓库   | `examples/custom-plugin/` 演示如何写一个第三方编辑插件             |

---

## 对照检查表（发布前自检）

```
P0（缺一不可）
[ ] 安装步骤 ≤ 3 步（add + config.ts 一行 + theme/index.ts 一行）
[ ] 所有用户可见错误信息包含"发生了什么 + 为什么 + 怎么修"
[ ] 路径遍历、XSS、CSS 注入、SSRF、大文件 DoS 五个安全面全有防护
[ ] 包体积 < 50KB gzip，编辑器打开 < 2s，100 对象 ≥ 30fps

P1（品质门槛）
[ ] 完整的 .d.ts 导出 + 配置项 JSDoc + 适配器泛型
[ ] debug: true 开启性能日志
[ ] 键盘全操作 + aria-label + 焦点管理 + 高对比度支持
[ ] 中英文 UI 自动切换
[ ] 暗色/亮色无闪烁 + CSS 变量可覆盖
[ ] Semver + 废弃警告期 ≥ 1 个 MINOR + Migration Guide

P2（信任门槛）
[ ] Diátaxis 四层文档 + 可运行的示例项目
[ ] 自动化 changelog + CI 发布 + next 预发布频道
[ ] Issue 模板 + CONTRIBUTING.md + CODE_OF_CONDUCT.md
[ ] MIT License + 依赖 License 审计
[ ] PluginSystem + 事件钩子 + 适配器抽象
```
