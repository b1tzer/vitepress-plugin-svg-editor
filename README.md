# vitepress-plugin-svg-editor

A VitePress plugin that provides interactive SVG editing capabilities directly in Markdown.

## Quick Start

```bash
pnpm add vitepress-plugin-svg-editor fabric
```

`.vitepress/config.ts`:
```ts
import { svgEditorPlugin, svgDiagramMarkdownPlugin } from "vitepress-plugin-svg-editor"

export default defineConfig({
  plugins: [svgEditorPlugin({ saveDir: "docs/public/diagrams" })],
  markdown: {
    config(md) { md.use(svgDiagramMarkdownPlugin) }
  }
})
```

`.vitepress/theme/index.ts`:
```ts
import { SvgDiagram, SvgEditor } from "vitepress-plugin-svg-editor/client"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("SvgDiagram", SvgDiagram)
    app.component("SvgEditor", SvgEditor)
  }
}
```

Then use standard Markdown image syntax:
```md
![architecture](/diagrams/my-architecture.svg)
```

## License
MIT
