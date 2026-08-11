# 配置参考

`svgEditorPlugin()` 的所有配置项及其默认值。

## 完整示例

```ts
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  vite: {
    plugins: [
      svgEditorPlugin({
        storage: 'vitepress',
        saveEndpoint: '/__svg-save__',
        saveDir: 'docs/public/diagrams',
        markdownSyntax: true,
      }),
    ],
  },
})
```

## 配置项

### `storage`

- **类型**: `'vitepress' | 'localStorage'`
- **默认值**: `'vitepress'`
- **说明**: 存储适配器类型。
  - `'vitepress'`：通过 Vite 开发服务器 POST 端点保存到文件系统（默认，生产推荐）
  - `'localStorage'`：保存到浏览器 localStorage（仅预览/调试模式）

### `saveEndpoint`

- **类型**: `string`
- **默认值**: `'/__svg-save__'`
- **说明**: 保存端点路径。仅在 `storage='vitepress'` 时生效。如果与项目中其他路由冲突，可自定义。

### `saveDir`

- **类型**: `string`
- **默认值**: `'docs/public/diagrams'`
- **说明**: SVG 文件保存目录（相对于 VitePress 项目根目录）。保存端点会以此目录为白名单，拒绝写入其他路径。

### `markdownSyntax`

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否注册 markdown-it 图片拦截。设为 `false` 时，`![alt](.svg)` 不会自动转换为 `<SvgDiagram>`，用户需手动使用 `<SvgDiagram src="...">` 标签。
