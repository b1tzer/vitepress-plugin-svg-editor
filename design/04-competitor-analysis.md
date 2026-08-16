# 04 — 竞品分析

## 4.1 业界 SVG 编辑器

### SVG-Edit（金标准）

| 维度         | 详情                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| **GitHub**   | SVG-Edit/svgedit，4.1k+ commits，7.4.2 版本（2026.07）                         |
| **架构**     | 双组件：`@svgedit/svgcanvas`（内核npm包） + Editor UI（Web Component）         |
| **渲染**     | 原生 SVG DOM，不是 Canvas                                                      |
| **插件**     | `extensions/` 目录，connector/eyedropper/grid/markers/panning/shapes/storage   |
| **可取之处** | ①内核独立npm包 `@svgedit/svgcanvas` ②插件通过统一接口注册 ③内核/UI分离         |
| **不足**     | ①UI用Web Component而非Vue/React ②SVG DOM渲染大量元素卡顿 ③细线、小元素难以点击 |

### Method Draw（极简主义）

| 维度         | 详情                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| **定位**     | SVG-Edit 的极简分支，**刻意去掉**图层管理、复杂路径编辑                             |
| **架构**     | 三层：`$.SvgCanvas`(内核) → `MD.Editor`(协调层) → `MD.Panel/Toolbar/Menu`(UI)       |
| **可取之处** | ①"去掉不需要的比增加功能更重要" ②事件驱动的回调模式(pub-sub) ③代码量~15000行，500KB |
| **不足**     | 功能太少，不适合SVG编辑需求                                                         |

### JointJS（商业级）

| 维度             | 详情                                                                |
| ---------------- | ------------------------------------------------------------------- |
| **定位**         | 基于 SVG 的图表库，流程图/UML/BPMN 专用                             |
| **可取之处**     | ①monorepo架构 ②框架无关 + React一等支持 ③14年历史，经大规模生产验证 |
| **对我们不适用** | 它是图表库而非通用SVG编辑器，太重                                   |

### Tiny-SVG（轻量级内核）

| 维度         | 详情                                                     |
| ------------ | -------------------------------------------------------- |
| **定位**     | "给工程师使用的SVG编辑内核框架"，可以嵌入任何Web项目     |
| **可取之处** | ①零框架依赖 ②MIT协议 ③定位精准：作为"内核"而非"完整产品" |

## 4.2 VitePress 插件生态

### vitepress-tuck（3.4k stars）— 插件协议标准答案

| 维度         | 详情                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------- |
| **解决问题** | VitePress 没有统一插件协议，导致复杂插件需要在 config.ts、theme/index.ts、vite.plugins 三处配置 |
| **方案**     | `definePlugin()` 一个函数封装所有三层配置，用户只需 `plugins: [x()]`                            |
| **架构**     | `client.enhance` 自动注入 theme、`markdown.config` 注入 markdown-it、`vite.plugins` 注入 Vite   |
| **组件注入** | 内置 `unplugin-vue-components`，插件声明 `componentResolver` 后用户即可在 md 中直接使用         |
| **我们对标** | **核心参考对象**。我们的 `svgEditorPlugin()` 应该遵循同样的模式                                 |

### nolebase/integrations（大厂级）

| 维度         | 详情                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | Nolebase 团队的 VitePress 插件集合 monorepo                                                                                                              |
| **可取之处** | ①清晰的包类型划分（VitePress Plugins / Markdown-it Plugins / UI Components）②虚拟模块模式（build-time生成数据→client注入）③`./vite` 和 `./client` 双入口 |
| **我们对标** | `exports` 双入口（`./vite` 和 `./client`）模式                                                                                                           |

### vitepress-demo-plugin

| 维度         | 详情                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| **可取之处** | ①monorepo结构清晰（`packages/plugin` + `packages/docs`）②ESM/CJS/UMD三输出 + `.d.ts` ③peerDependencies分离 |
| **我们对标** | package.json 的多格式输出策略                                                                              |

### vitepress-plugin-group-icons

| 维度         | 详情                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **可取之处** | ①单一职责：仅处理图标分组 ②`src/index.ts` 统一导出所有模块 ③pnpm workspace + playground 本地测试 |
| **我们对标** | 目录结构（`src/` 下按职责分文件，`index.ts` 统一导出）                                           |

## 4.3 总结合并：我们应该学什么

| 来源                  | 学什么                                                                               |
| --------------------- | ------------------------------------------------------------------------------------ |
| SVG-Edit              | 内核npm包独立发布；插件系统通过统一接口注册                                          |
| vitepress-tuck        | `definePlugin` 封装三层配置；`client.enhance` 自动注入；`componentResolver` 自动注册 |
| nolebase              | 双入口（`./vite` + `./client`）；虚拟模块模式                                        |
| vitepress-demo-plugin | 多格式产物（ESM/CJS + .d.ts）；monorepo结构                                          |
| Tiny-SVG              | 内核层零框架依赖                                                                     |
| JointJS               | 框架无关内核 + 适配层模式                                                            |
