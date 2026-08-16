import { defineConfig } from 'vitepress'
import { svgEditorPlugin, svgDiagramMarkdownPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  title: 'SVG Editor Demo',
  description: '最小示例 — VitePress SVG Editor 插件',
  lang: 'zh-CN',

  markdown: {
    config(md) {
      md.use(svgDiagramMarkdownPlugin)
    },
  },

  vite: {
    plugins: [svgEditorPlugin()],
  },
})
