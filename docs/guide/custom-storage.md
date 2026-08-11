# 自定义存储

> 把 SVG 保存到 S3、REST API、数据库或任何自定义后端。

## 内置存储适配器

插件内置两种存储方式：

| 适配器 | 用途 | 何时使用 |
|--------|------|---------|
| `VitePressSaveAdapter` | 通过 VitePress 开发服务器保存到本地文件系统 | 本地开发、静态站点 |
| `LocalStorageAdapter` | 保存到浏览器 localStorage | 纯前端预览、无服务端 |

## 自定义存储适配器

实现 `StorageAdapter` 接口：

```ts
import type { StorageAdapter } from 'vitepress-plugin-svg-editor'

class S3StorageAdapter implements StorageAdapter {
  async save(svgContent: string, filePath: string) {
    const response = await fetch('/api/upload-svg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath, content: svgContent }),
    })
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    return { success: true }
  }

  async load(filePath: string) {
    const response = await fetch(`/api/svg${filePath}`)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    return { success: true, content: await response.text() }
  }
}
```

然后在 `SvgEditor.vue` 中替换默认适配器（通过 props 或 DI 注入）。

## StorageAdapter 接口

```ts
interface StorageAdapter {
  save(content: string, path: string): Promise<SaveResult>
  load(path: string): Promise<LoadResult>
}

interface SaveResult {
  success: boolean
  error?: string
}

interface LoadResult {
  success: boolean
  content?: string
  error?: string
}
```
