# vitepress-plugin-svg-editor

A VitePress plugin that provides interactive SVG editing capabilities directly in Markdown.

Built with **Vue 3 + Fabric.js + TypeScript**.

## Quick Start

```bash
pnpm add vitepress-plugin-svg-editor fabric
```

### Configuration

`.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { svgEditorPlugin, svgDiagramMarkdownPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  vite: {
    plugins: [
      svgEditorPlugin({
        storage: 'vitepress',  // 'vitepress' | 'localStorage'
      }),
    ],
  },
  markdown: {
    config(md) { md.use(svgDiagramMarkdownPlugin) }
  },
})
```

`.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import { enhanceApp } from 'vitepress-plugin-svg-editor/client'

export default {
  extends: DefaultTheme,
  enhanceApp,
}
```

### Usage

Use standard Markdown image syntax — `.svg` files get edit buttons automatically:

```md
![Architecture](/diagrams/my-architecture.svg)
```

![Screenshot](/diagrams/screenshot.png) — PNGs are unaffected.

Click the **✏️ Edit SVG** button that appears on hover (dev mode only) to open the full-featured editor.

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `'vitepress'` \| `'localStorage'` | `'vitepress'` | Save strategy |
| `saveEndpoint` | `string` | `'/__svg-save__'` | Save API endpoint (vitepress mode only) |
| `markdownSyntax` | `boolean` | `true` | Enable Markdown image interception |

## Architecture

```
src/
├── core/          # Framework-free kernel (CanvasManager, SvgLoader, EventBus, PluginSystem...)
├── adapters/      # StorageAdapter, ThemeAdapter, RenderAdapter + default implementations
├── plugins/       # Built-in editing plugins (align, layer, text-format, distribute, gradient, shadow)
├── components/    # Vue components (SvgDiagram, SvgEditor, EditorToolbar, EditorCanvas)
└── node/          # VitePress plugin entry (svgEditorPlugin, svgDiagramMarkdownPlugin)
```

## Development

```bash
pnpm install
pnpm dev           # unbuild stub mode
pnpm test:unit     # vitest unit tests
pnpm test          # Playwright E2E tests
pnpm typecheck     # TypeScript check
pnpm build         # Production build
```

## License

MIT
