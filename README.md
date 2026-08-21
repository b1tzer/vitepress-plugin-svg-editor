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
        storage: 'vitepress', // 'vitepress' | 'localStorage'
      }),
    ],
  },
  markdown: {
    config(md) {
      md.use(svgDiagramMarkdownPlugin)
    },
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

## Dark Mode / Theme Adaptation

The plugin provides automatic light/dark theme adaptation for SVG diagrams:

- **Bare hex colors**: non-semantic hex colors are adapted at runtime in the OKLCH perceptual color space (brightness flip, hue/saturation preserved) when the site switches to dark mode.
- **CSS variables with fallback** (`var(--vp-c-brand-1, #2563eb)`): resolved to their fallback value at load time.
- **Editor + display consistency**: saving always normalizes colors to their light-mode canonical value, so what you see in the editor matches what renders on the page across theme switches.

## Plugin Options

| Option           | Type                               | Default           | Description                                  |
| ---------------- | ---------------------------------- | ----------------- | -------------------------------------------- |
| `storage`        | `'vitepress'` \| `'localStorage'`  | `'vitepress'`     | Save strategy                               |
| `saveEndpoint`   | `string`                           | `'/__svg-save__'` | Save API endpoint (vitepress mode only)     |
| `markdownSyntax` | `boolean`                          | `true`            | Enable Markdown image interception          |

## Architecture

```
src/
├── core/          # Framework-free kernel (CanvasManager, HistoryManager, SvgLoader, SvgSerializer, EventBus...)
├── adapters/      # Storage adapters (IStorageAdapter, VitePressSaveAdapter, LocalStorageAdapter)
├── plugins/       # Pure-function editing plugins (align, layer, text-format, distribute, gradient, shadow, arrow-merger)
├── components/    # Vue components (SvgDiagram, SvgEditor, EditorToolbar, EditorCanvas, EditorLeftPanel, EditorContextPanel)
├── composables/   # Vue composables (useTheme, useSave, useLayer, useSelection...)
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
