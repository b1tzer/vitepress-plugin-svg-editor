# SVG Editor VitePress Plugin — 设计蓝图

> 本目录存放插件开发前的所有调研、决策和设计资料，是后续编码工作的**唯一事实来源**。
> 开发前阅读本目录所有文档，开发中遇到疑问回查对应章节，不要凭记忆猜测。

## 目录导航

| 章节 | 目录                             | 解决的问题                                                                                                                  |
| ---- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 01   | `01-architecture/`               | 插件整体架构是三层还是两层？内核和 VitePress 如何解耦？组件树怎么组织？                                                     |
| 02   | `02-package-design/`             | npm 包怎么组织？`exports` 字段怎么设计？peerDependencies 声明哪些？构建工具选什么？                                         |
| 03   | `03-api-design/`                 | 用户怎么用这个插件？（一行 import？还是多文件配置？）暴露哪些生命周期钩子？StorageAdapter 接口长什么样？                    |
| 04   | `04-competitor-analysis/`        | 业界 SVG 编辑器怎么架构的？VitePress 插件生态里的优秀案例怎么做的？我们从谁身上学什么？                                     |
| 05   | `05-pain-points-and-prevention/` | 真实用户踩过哪些坑？我们如何提前预防？                                                                                      |
| 06   | `06-compatibility-matrix/`       | 支持哪些 VitePress 版本？Node.js 版本？浏览器？SSR 策略？                                                                   |
| 07   | `07-technical-decisions/`        | 为什么选 Fabric.js 而不是原生 SVG DOM？为什么用 `defineClientComponent` 而不是 `onMounted` 判断？每个关键决策的记录和理由。 |
| 08   | `08-development-roadmap/`        | 分几个阶段？每个阶段产出什么？依赖关系？                                                                                    |
| 09   | `09-feature-plan/`               | P0/P1/P2/P3 功能分层、依赖图、功能与开发 Phase 对应关系                                                                     |
| 10   | `10-test-plan/`                  | 测试金字塔（单元→组件→集成→E2E）、CI 流水线、兼容性矩阵、提交前自检清单                                                     |
| 11   | `11-non-functional-checklist/`   | 插件核心功能之外的 15 个必备素质（安全/性能/a11y/i18n/文档/社区…），按 P0/P1/P2 分层                                        |
| 12   | `12-migration-strategy/`         | 如何从原项目抽离代码成为独立 npm 包，同时保证原项目期间不中断——六阶段双轨过渡策略                                           |

## 使用方式

1. **开发前**：顺序阅读 01→02→03，理解完整设计
2. **开发中**：遇到不确定的问题，跳到对应章节查决策依据
3. **新成员 onboarding**：阅读本 README → 01-architecture → 03-api-design 即可上手
4. **决策变更**：更新 `07-technical-decisions/decisions.md`（不要覆盖旧决策，追加新的并标注状态）

## 关键约定

- 所有文档使用中文撰写
- 技术术语保留英文（如 SSR、peerDependencies、defineClientComponent）
- 决策记录（ADR）格式：`日期 | 决策 | 理由 | 替代方案 | 后果`
- 本目录不存放任何代码，只存放设计资料
