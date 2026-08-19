# SVG Editor Demo

> 把鼠标悬停在下方图表上，点击「✏️ 编辑 SVG」即可体验在线 SVG 编辑。

![测试 SVG](/diagrams/test.svg)

![复杂测试 SVG](/diagrams/test-complex.svg)

![决策树](/diagrams/decision-tree.svg)

## 复杂 SVG 案例

以下图表来自真实项目，覆盖 Spring / JVM / 网络 / 并发 / 高并发架构等复杂场景，适合验证编辑器的装载、箭头合并、文本换行与明暗主题还原能力。

![Spring Bean 生命周期](/diagrams/spring-bean-lifecycle.svg)

![Buffer 操作](/diagrams/buffer-ops.svg)

![HTTP 状态码决策](/diagrams/http-status-decision.svg)

![synchronized 监视器流程](/diagrams/sync-monitor-flow.svg)

![Netty 管线](/diagrams/netty-pipeline.svg)

![HTTP 演进](/diagrams/http-evolution.svg)

![JVM 对象创建](/diagrams/jvm-object-creation.svg)

![秒杀架构](/diagrams/seckill-arch.svg)

---

## 集成说明

本示例展示 `vitepress-plugin-svg-editor` 的最小集成方式：

1. **安装** `pnpm add vitepress-plugin-svg-editor`
2. **配置** `config.mts` 中加两行
3. **注册** `theme/index.ts` 中注册组件
4. **使用** Markdown 中写 `![描述](/diagrams/xxx.svg)`，插件会自动拦截 `.svg` 并渲染成可编辑图表

更多功能见 [功能特性](./features.md)。
