# SVG Editor Demo

> 把鼠标悬停在下方图表上，点击「✏️ 编辑 SVG」即可体验在线 SVG 编辑。

<SvgDiagram src="/diagrams/test.svg" />

<SvgDiagram src="/diagrams/test-complex.svg" />

---

## 集成说明

本示例展示 `vitepress-plugin-svg-editor` 的最小集成方式：

1. **安装** `pnpm add vitepress-plugin-svg-editor`
2. **配置** `config.mts` 中加两行
3. **注册** `theme/index.ts` 中注册组件
4. **使用** Markdown 中写 `<SvgDiagram src="..." />`

更多功能见 [功能特性](./features.md)。
