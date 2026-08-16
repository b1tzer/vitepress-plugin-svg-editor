# 自定义存储

> 当前版本仅内置两种存储策略，暂不支持从外部注入自定义存储后端。

## 内置存储策略

插件通过 `svgEditorPlugin({ storage })` 选择存储方式：

| 适配器                 | 用途                                        | 何时使用             |
| ---------------------- | ------------------------------------------- | -------------------- |
| `VitePressSaveAdapter` | 通过 VitePress 开发服务器写回本地文件系统    | 本地开发、静态站点   |
| `LocalStorageAdapter`  | 保存到浏览器 localStorage                   | 纯前端预览、无服务端 |

```ts
import { svgEditorPlugin } from 'vitepress-plugin-svg-editor'

export default defineConfig({
  vite: {
    plugins: [
      // 写入 docs/public（原路保存）
      svgEditorPlugin({ storage: 'vitepress' }),

      // 或保存到浏览器 localStorage
      // svgEditorPlugin({ storage: 'localStorage' }),
    ],
  },
})
```

## 保存到 S3 / REST API / 数据库？

当前版本**尚未开放**自定义存储后端的公开接口。`storage` 选项只接受 `'vitepress' | 'localStorage'` 两种字面量，无法传入自定义适配器实例。

如果你需要对接 S3、REST API 或数据库等自定义后端，目前需要：

1. **fork 源码**，在 `src/adapters/storage/` 下新增一个实现 `IStorageAdapter` 接口的适配器；
2. 在 `src/components/SvgEditor.vue` 中替换默认适配器的选择逻辑。

该能力（外部注入自定义适配器）已列入后续规划，敬请关注版本更新。

## 内部接口（仅供 fork 参考）

```ts
// src/adapters/storage/StorageAdapter.ts
interface IStorageAdapter {
  save(svgText: string, sourcePath: string): Promise<SaveResult>
  load(sourcePath: string): Promise<string>
}

interface SaveResult {
  success: boolean
  path?: string
  error?: string
}
```

> ⚠️ 该接口属于**内部实现细节**，不对外导出，仅作 fork 源码时参考。

