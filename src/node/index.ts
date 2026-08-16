/**
 * vitepress-plugin-svg-editor — Node 端入口
 *
 * 提供：
 *   1. svgEditorPlugin()  — Vite 插件（save 端点 + optimizeDeps + StorageAdapter 可切换）
 *   2. svgDiagramMarkdownPlugin() — Markdown-it 插件（![alt](.svg) → <SvgDiagram>）
 */

import fs from 'fs'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'node:http'

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

/**
 * Vite DevServer 的最小结构化接口。
 *
 * 项目未直接依赖 vite（vite 由 vitepress 传递依赖，顶层 node_modules 不存在 vite），
 * 因此无法 `import type { ViteDevServer } from 'vite'`。这里用结构化类型描述
 * configureServer 钩子实际用到的 `server.middlewares.use`，保持类型安全且不引入新依赖。
 */
interface ViteDevServerLike {
  middlewares: {
    use(
      path: string,
      handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void
    ): void
  }
}

/**
 * Vite 插件对象的最小结构化接口（svgEditorPlugin 返回值）。
 * 仅描述本插件实际实现的 name / configureServer / config 三个钩子。
 */
interface VitePluginLike {
  name: string
  configureServer(server: ViteDevServerLike): void
  config(): {
    optimizeDeps: { include: string[] }
    define: Record<string, string>
  }
}

/**
 * markdown-it Token 的最小结构化接口。
 * markdown-it 及其类型同样非直接依赖，仅描述 renderer.rules.image 用到的字段。
 */
interface MarkdownItToken {
  content: string
  attrGet(name: string): string | null
}

/** markdown-it 实例的最小结构化接口 */
interface MarkdownItLike {
  renderer: {
    rules: {
      image?:
        | ((tokens: MarkdownItToken[], idx: number, options: unknown, env: unknown, self: unknown) => string)
        | undefined
    }
  }
}

/** 最大请求体大小（与 SvgLoader 的 10MB 上限对齐），防止内存 DoS */
const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * 校验并解析 SVG 保存路径，返回安全的绝对路径。
 *
 * 使用 `path.relative` 做路径遍历检测（而非 `startsWith(publicDir + path.sep)`），
 * 避免 Windows 盘符 / 分隔符差异及 `publicDir` 恰好为根路径等边界导致的绕过。
 *
 * @param publicDir 保存边界目录（绝对路径）
 * @param svgPath   客户端提交的目标路径（可能含开头的 / 或 ../ 等）
 * @returns 合法的绝对路径；若越界或后缀非 .svg，返回 null
 */
export function resolveSafeSvgPath(publicDir: string, svgPath: string): string | null {
  // 去掉开头 /，交给 path.resolve 统一消解 . 和 ..
  const relativePath = svgPath.replace(/^\/+/, '')
  const fullPath = path.resolve(publicDir, relativePath)

  // 路径遍历防护：相对路径以 .. 开头或为绝对路径，说明越出 publicDir
  const rel = path.relative(publicDir, fullPath)
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null
  }

  // 仅允许 .svg 后缀
  if (!fullPath.endsWith('.svg')) {
    return null
  }

  return fullPath
}

export function svgEditorPlugin(options: SvgEditorPluginOptions = {}): VitePluginLike {
  const storage = options.storage || 'vitepress'
  const saveEndpoint = options.saveEndpoint || '/__svg-save__'

  return {
    name: 'vitepress-plugin-svg-editor',

    configureServer(server: ViteDevServerLike) {
      // 仅 VitePress 模式启动保存端点（localStorage 不需要服务端）
      if (storage !== 'vitepress') return

      // VitePress 默认 public 目录：保存边界统一到 docs/public 根目录（原路保存）
      const publicDir = path.resolve(process.cwd(), 'docs/public')
      server.middlewares.use(saveEndpoint, (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.method !== 'POST') return next()

        // 🔒 仅接受 JSON 请求体
        const contentType = String(req.headers['content-type'] || '').split(';')[0].trim()
        if (contentType !== 'application/json') {
          res.statusCode = 415
          res.end('Unsupported Media Type: only application/json is allowed')
          return
        }

        // 🔒 流式读取并限制请求体大小，超过上限立即拒绝（不继续累积内存）
        const chunks: Buffer[] = []
        let bodySize = 0
        let tooLarge = false
        req.on('data', (chunk: Buffer) => {
          if (tooLarge) return
          bodySize += chunk.length
          if (bodySize > MAX_BODY_SIZE) {
            tooLarge = true
            return
          }
          chunks.push(chunk)
        })
        req.on('end', () => {
          if (tooLarge) {
            res.statusCode = 413
            res.end('Payload Too Large: SVG content exceeds 10MB limit')
            return
          }

          try {
            const body = Buffer.concat(chunks).toString('utf-8')
            const { path: svgPath, content } = JSON.parse(body)

            // 🔒 校验字段类型，避免非法负载
            if (typeof svgPath !== 'string' || typeof content !== 'string') {
              res.statusCode = 400
              res.end('Bad Request: path and content must be strings')
              return
            }

            // 🔒 路径校验：必须仍在 publicDir 内 + 仅 .svg 后缀
            const fullPath = resolveSafeSvgPath(publicDir, svgPath)
            if (!fullPath) {
              res.statusCode = 403
              res.end('Forbidden: only SVG files under docs/public are allowed')
              return
            }

            // 确保父目录存在（支持保存到未预先创建的子目录）
            fs.mkdirSync(path.dirname(fullPath), { recursive: true })
            fs.writeFileSync(fullPath, content, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, file: fullPath }))
          } catch (e) {
            res.statusCode = 500
            res.end(e instanceof Error ? e.message : String(e))
          }
        })
      })
    },

    config() {
      return {
        optimizeDeps: {
          include: ['fabric'],
        },
        // 通过 Vite define 将 storage 模式与保存端点注入到客户端运行时，
        // 供 SvgEditor.vue 据此选择 VitePressSaveAdapter / LocalStorageAdapter
        // 及构造正确的保存端点（修复 saveEndpoint 自定义后客户端仍请求默认端点的问题）
        define: {
          __SVG_EDITOR_STORAGE__: JSON.stringify(storage),
          __SVG_EDITOR_SAVE_ENDPOINT__: JSON.stringify(saveEndpoint),
        },
      }
    },
  }
}

export function svgDiagramMarkdownPlugin(md: MarkdownItLike, options: { markdownSyntax?: boolean } = {}) {
  if (options.markdownSyntax === false) return

  const defaultImageRender = md.renderer.rules.image

  md.renderer.rules.image = (tokens: MarkdownItToken[], idx: number, renderOpts: unknown, env: unknown, self: unknown) => {
    const token = tokens[idx]
    const src = token.attrGet('src') || ''

    if (src.endsWith('.svg')) {
      const alt = token.content
      return `<SvgDiagram src="${src}" alt="${alt}" />`
    }

    if (!defaultImageRender) return ''
    return defaultImageRender(tokens, idx, renderOpts, env, self)
  }
}
