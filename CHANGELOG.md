# Changelog

## v0.3.0 (2026-08-19)

### Added

- **语义化颜色 ID 体系**：新增 `--diagram-*` 语义 token 与对象级 `fillVar`/`strokeVar` 标记，将颜色从「hex 裸值」升级为「语义身份」，彻底消除明暗主题切换时的 hex 撞色串色。
- **OKLCH 自适应颜色算法**（`adaptiveColor.ts`）：零依赖手写 sRGB ↔ OKLCH 转换，在感知均匀色彩空间做亮度翻转（`L' = 1 - L`，保色相、保饱和度），使未命中语义色板的自定义颜色也能自动获得协调的暗色。
- **编辑器内三级颜色策略**：语义色优先 → hex 精确映射 → 双向记忆化 + OKLCH 翻转兜底；补齐渐变 `colorStops` 遍历与阴影自适应。
- **保存归一化（强制存亮色真值）**：暗色模式下保存时自动将非语义色归一化回亮色真值，落盘 SVG 永远保存亮色语义，暗色由运行时派生。
- **展示层暗色派生**（`svgDarkMode.ts` + `useSvgDarkMode.ts`）：`SvgDiagram` 在页面切换暗色时对裸 hex 运行时派生暗色，`var(--diagram-*)` 交由已注入的 CSS 自动切换，打通「编辑器所见 = 页面所得」的明暗闭环。
- **`mapHexToVar` 插件选项**：开启后对色板精确命中的裸 hex 自动升级为语义 token（跨主题撞色 hex 自动跳过，默认关闭）。

### Changed

- **画布布局重构**：画布铺满主体区域，左右工具栏改为悬浮层；折叠按钮改为圆角胶囊把手。
- **文件命名规范统一**：`FabricTypes.ts → fabricTypes.ts`、`Interactive.ts → interactive.ts` 等核心文件小写化。

### Fixed

- 修复明暗主题 hex 撞色导致导出颜色还原串色。
- 修复写死色板色跨主题一致升级为语义 token。

## v0.2.1 (2026-08-17)

### Fixed

- **CSS 变量 fallback 未处理**：`var(--vp-c-brand-1, #2563eb)` 这类带 fallback 的外部变量此前会被 Fabric 当作非法颜色渲染为透明，现正确取 fallback 兜底色。
- **箭头合并坐标误判**：修复 Fabric v6 下从右到左的斜线箭头无法合并的问题；终点绝对坐标直接取 `line.x2`/`line.y2`，不再按数值大小猜测坐标约定。
- **阴影颜色不跟随主题**：主题切换时阴影颜色（如 `--diagram-ghost` 亮 `#999999` ↔ 暗 `#666666`）此前未参与映射，现同步跟随明暗主题。
- **非自闭合箭头元素注入**：`<line>…</line>`、`<path>…</path>` 非自闭合形式的 SVG 元素此前无法注入箭头标记，现已支持。

### Internal

- **E2E 测试模式开关**：新增 `__SVG_EDITOR_E2E__` 注入（由 `SVG_EDITOR_E2E=1` 环境变量控制），使 `vitepress preview` 静态产物也能运行 E2E 测试；默认关闭，生产产物零污染。
- **发布工作流**：改为 `push v* tag` 触发（OIDC + `--provenance`），并新增 tag 版本号与 `package.json` version 一致性校验。
- **CI**：测试步骤新增 `pnpm build`；清理 `test.yml` 中已删除的 `master` 分支触发项。

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
