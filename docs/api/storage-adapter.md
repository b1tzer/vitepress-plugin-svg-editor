# 存储适配器

> 内置存储策略说明。适配器接口为**内部实现细节**，不对外导出。

## 内置存储策略

插件通过 `svgEditorPlugin({ storage })` 提供两种存储方式：

| 适配器                 | 用途                                        | 何时使用             |
| ---------------------- | ------------------------------------------- | -------------------- |
| `VitePressSaveAdapter` | 通过 VitePress 开发服务器 POST 端点写回文件 | 本地开发、静态站点   |
| `LocalStorageAdapter`  | 保存到浏览器 localStorage                   | 纯前端预览、无服务端 |

在 `svgEditorPlugin` 中通过 `storage` 选项选择：

```ts
svgEditorPlugin({ storage: 'vitepress' })     // 默认，写入 docs/public（原路保存）
svgEditorPlugin({ storage: 'localStorage' })  // 仅浏览器 localStorage
```

## VitePressSaveAdapter 行为

`storage: 'vitepress'` 时，保存请求会 `POST` 到 `saveEndpoint`（默认 `/__svg-save__`），由 Vite 开发服务器将 SVG **原路写回** `docs/public` 目录下的原始路径。

安全策略：

- 仅允许写入 `docs/public` 目录内的路径
- 仅接受 `.svg` 后缀的文件
- 拒绝包含 `../` 的路径遍历攻击
- 请求体上限 10MB，防止内存 DoS

## 关于接口

> ⚠️ 注意：`IStorageAdapter` 接口（含 `VitePressSaveAdapter` / `LocalStorageAdapter` 实现）属于**内部实现细节**，并未从包的任何入口导出，**不属于公开 API**。当前公开配置仅支持上述两种内置策略，暂不支持从外部注入自定义适配器实例。相关能力请关注后续版本。

