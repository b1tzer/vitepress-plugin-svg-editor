# Changelog

## v0.1.0 (2026-08-11)

### Added

- **Kernel layer**: `CanvasManager`, `HistoryManager`, `SvgLoader`, `SvgSerializer`, `EventBus`, `PluginSystem`, `types` — all TypeScript typed
- **Adapter layer**: `StorageAdapter` / `VitePressSaveAdapter` / `LocalStorageAdapter`, `ThemeAdapter` / `VitePressThemeAdapter`, `RenderAdapter` / `FabricRenderAdapter`
- **Plugin system**: `register` / `unregister` / `get` / `installAll` APIs for extensible editing plugins
- **Event bus**: type-safe publish/subscribe decoupling CanvasManager callbacks
- **VitePress save endpoint**: path traversal protection (docs/public prefix + .svg suffix validation)
- **Markdown syntax**: `![alt](xxx.svg)` auto-converts to editable `<SvgDiagram>`, `markdownSyntax: false` exit mechanism
- **Component refactoring**: `SvgEditor.vue` split into `EditorToolbar` / `EditorCanvas` sub-components with `aria-label` coverage
- **Unit tests**: LocalStorageAdapter + VitePressThemeAdapter (vitest + happy-dom)

### Changed

- `CanvasManager`: callback system migrated from hardcoded properties to `EventBus`
- `HistoryManager`: stack depth increased from 30 to 50, implements `IHistoryManager` interface
- `svgEditorPlugin()`: supports `storage: 'vitepress' | 'localStorage'` option
- `svgDiagramMarkdownPlugin()`: supports `markdownSyntax: false` option

### Fixed

- TypeScript strict mode for all `src/core/` and `src/adapters/` modules
- `@ts-nocheck` for `fabric@5.5.2` (no official type declarations) in CanvasManager, FabricRenderAdapter, postprocessor
