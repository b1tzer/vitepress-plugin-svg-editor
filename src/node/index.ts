/**
 * vitepress-plugin-svg-editor — Node 端入口
 *
 * 提供：
 *   1. svgEditorPlugin()  — Vite 插件（save 端点 + optimizeDeps + StorageAdapter 可切换）
 *   2. svgDiagramMarkdownPlugin() — Markdown-it 插件（![alt](.svg) → <SvgDiagram>）
 */

import fs from 'fs'
import path from 'path'

export interface SvgEditorPluginOptions {
  /**
   * 存储适配器类型
   * - 'vitepress'：通过 Vite 开发服务器 POST 端点保存到文件系统（默认）
   * - 'localStorage'：保存到浏览器 localStorage（仅预览模式，不需要服务端端点）
   * - StorageAdapter 实例：自定义保存逻辑
   */
  storage?: 'vitepress' | 'localStorage'

  /** 保存端点路径（仅 storage='vitepress' 时生效，默认 /__svg-save__） */
  saveEndpoint?: string

  /**
   * @deprecated 保存目录已统一为 VitePress 的 docs/public（原路保存），此选项不再作为白名单使用。
   * 保留仅为向后兼容，新代码无需设置。
   */
  saveDir?: string

  /** 是否注册 markdown-it 图片拦截（默认 true） */
  markdownSyntax?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function svgEditorPlugin(options: SvgEditorPluginOptions = {}): any {
  const storage = options.storage || 'vitepress'
  const saveEndpoint = options.saveEndpoint || '/__svg-save__'

  return {
    name: 'vitepress-plugin-svg-editor',

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      // 仅 VitePress 模式启动保存端点（localStorage 不需要服务端）
      if (storage !== 'vitepress') return

      // VitePress 默认 public 目录：保存边界统一到 docs/public 根目录（原路保存）
      const publicDir = path.resolve(process.cwd(), 'docs/public')
      server.middlewares.use(saveEndpoint, (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => (body += chunk.toString()))
        req.on('end', () => {
          try {
            const { path: svgPath, content } = JSON.parse(body)

            // 1. 去掉开头 /，交给 path.resolve 统一消解 . 和 ..
            const relativePath = svgPath.replace(/^\/+/, '')
            const fullPath = path.resolve(publicDir, relativePath)

            // 2. 安全校验：最终路径必须仍在 publicDir 内 + 仅 .svg 后缀
            if (!fullPath.startsWith(publicDir + path.sep) || !fullPath.endsWith('.svg')) {
              res.statusCode = 403
              res.end('Forbidden: only SVG files under docs/public are allowed')
              return
            }

            // 3. 确保父目录存在（支持保存到未预先创建的子目录）
            fs.mkdirSync(path.dirname(fullPath), { recursive: true })
            fs.writeFileSync(fullPath, content, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, file: fullPath }))
          } catch (e: any) {
            res.statusCode = 500
            res.end(e.message)
          }
        })
      })
    },

    config() {
      return {
        optimizeDeps: {
          include: ['fabric'],
        },
        // 通过 Vite define 将 storage 模式注入到客户端运行时，
        // 供 SvgEditor.vue 据此选择 VitePressSaveAdapter 或 LocalStorageAdapter
        define: {
          __SVG_EDITOR_STORAGE__: JSON.stringify(storage),
        },
      }
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function svgDiagramMarkdownPlugin(md: any, options: { markdownSyntax?: boolean } = {}) {
  if (options.markdownSyntax === false) return

  const defaultImageRender = md.renderer.rules.image

  md.renderer.rules.image = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx]
    const src = token.attrGet('src') || ''

    if (src.endsWith('.svg')) {
      const alt = token.content
      return `<SvgDiagram src="${src}" alt="${alt}" />`
    }

    return defaultImageRender(tokens, idx, options, env, self)
  }
}
