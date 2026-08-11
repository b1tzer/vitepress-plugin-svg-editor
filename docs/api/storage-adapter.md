# StorageAdapter API

> 存储适配器接口定义与内置实现参考。

## 接口定义

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

## 方法

### `save(content, path)`

将 SVG 内容保存到指定路径。

- **参数**: `content: string` — SVG 文本内容，`path: string` — 保存路径（如 `/diagrams/foo.svg`）
- **返回**: `Promise<SaveResult>` — `success: true` 表示保存成功，否则 `error` 包含错误信息
- **异常**: 不抛出异常，所有错误通过 `{ success: false, error }` 返回

### `load(path)`

从指定路径加载 SVG 内容。

- **参数**: `path: string` — 文件路径
- **返回**: `Promise<LoadResult>` — `success: true` 时 `content` 包含 SVG 文本

## 内置实现

### VitePressSaveAdapter

通过 VitePress 开发服务器 POST 端点保存到文件系统。

```ts
const adapter = new VitePressSaveAdapter()
await adapter.save(svgContent, '/diagrams/architecture.svg')
// → POST /__svg-save__  { path, content }
// → 写入 docs/public/diagrams/architecture.svg
```

安全策略：
- 仅允许写入 `saveDir` 白名单内的路径
- 仅接受 `.svg` 后缀的文件
- 拒绝包含 `../` 的路径遍历攻击

### LocalStorageAdapter

保存到浏览器 localStorage（仅预览模式）。

```ts
const adapter = new LocalStorageAdapter()
await adapter.save(svgContent, 'my-diagram')
// → localStorage.setItem('svg:my-diagram', svgContent)
```
