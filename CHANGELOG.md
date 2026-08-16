# Changelog

## v0.2.0 (2026-08-16)

### Breaking Changes

- **Removed dead code & legacy public APIs**: `PluginSystem`, `EditorMediator`, `RenderAdapter`, `ThemeAdapter`, DI container, `PreprocessPipeline`, `CommandHistory`, `AddCommand` / `RemoveCommand`, `useCanvas`, etc. — these were never wired up and are no longer exported.
- **Removed `svgEditorPlugin({ saveDir })`**: saving is now always "save in place" under `docs/public`; the dead `saveDir` option has been removed from `SvgEditorPluginOptions`.
- **Removed drag guide lines & snapping** feature.

### Changed

- **Fabric.js v5 → v6**: upgraded and fixed v6 compatibility (group/ungroup, zoom commands, `ActiveSelection` type casing, etc.).
- **Modular architecture**: split the monolith into a layered `core/`, extracted Vue `composables/`, and rewired `SvgEditor.vue` as a thin orchestrator.
- **Zoom model simplified**: driven purely by `viewportTransform`; removed the dual-channel physical resize path.
- **Canvas layout**: logical canvas via `workspace Rect` + `clipPath` clipping.
- **Type consolidation**: 36+ hardcoded Fabric object type checks centralized into `src/core/FabricTypes.ts`.
- **SVG post-processing unified** through `SvgSerializer`.

### Added

- **Security**: DOMPurify-based SVG sanitization in `SvgLoader`.
- **Performance instrumentation**: `src/utils/perf.ts` + performance regression tests.
- **Full test pyramid**: unit / component / integration / E2E / CI, plus package-manager matrix tests.
- **Quality gates**: ESLint, Prettier, `vue-tsc` typecheck.
- **Self-contained example**: `examples/basic` migrated to a standalone VitePress site; E2E tests now run against it.

### Security

- **Hardened save endpoint**: `docs/public` allowlist + `.svg` suffix validation + 10MB body limit + JSON `Content-Type` only.

### Performance

- Removed a resident `requestAnimationFrame` loop; throttled hover highlight & panning; optimized zoom (canvas ceiling + `objectCaching`).

### Fixed

- Background interaction, canvas zoom/pan, and resize handles.
- Ruler number rendering and coordinate consistency.
- `zoomFit` centering offset (content pushed off-canvas).
- Undo/redo snapshot gaps and `Ctrl+A` select-all.
- `saveEndpoint` configuration now correctly injected into the client.
- `preprocessor` metadata extraction via structured DOMParser parsing.

### Build

- Fixed unbuild config filename (`build.config.ts`); it was previously silently ignored.
- Tightened `files` publish manifest (excludes server-side `src/node`).
- Added default conditional export for `./client`; added `sideEffects` and client `types` conditions.

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
