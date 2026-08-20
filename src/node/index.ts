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
import type { Plugin, ViteDevServer } from 'vite'
import type MarkdownIt from 'markdown-it'
import type { ColorMode } from '../core/shared/types'

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

  /** 是否注册 markdown-it 图片拦截（默认 true） */
  markdownSyntax?: boolean

  /**
   * 是否开启「hex 精确匹配 → 语义 token」升级（默认 false，显式开启才生效）。
   * 开启后，对色板中精确命中的裸 hex（fill/stroke）自动打上语义标记，
   * 使普通 hex SVG 也能获得明暗自适应能力；跨主题撞色 hex 会被跳过。
   * 注意：仅在 colorMode === 'semantic' 时生效。
   */
  mapHexToVar?: boolean

  /**
   * 颜色处理模式（默认 'semantic'）。
   * - 'semantic'：语义 token 优先，var(--diagram-*) 保留语义 ID，明暗按色板精确映射 + OKLCH 兜底。
   * - 'algorithm'：纯算法模式，忽略语义变量，全程只用 OKLCH 亮度翻转计算明暗，不保留/不还原 var()。
   */
  colorMode?: ColorMode
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

export function svgEditorPlugin(options: SvgEditorPluginOptions = {}): Plugin {
  const storage = options.storage || 'vitepress'
  const saveEndpoint = options.saveEndpoint || '/__svg-save__'
  const mapHexToVar = options.mapHexToVar === true
  const colorMode: ColorMode = options.colorMode === 'algorithm' ? 'algorithm' : 'semantic'

  return {
    name: 'vitepress-plugin-svg-editor',

    configureServer(server: ViteDevServer) {
      // 仅 VitePress 模式启动保存端点（localStorage 不需要服务端）
      if (storage !== 'vitepress') return

      // VitePress 默认 public 目录：保存边界统一到 docs/public 根目录（原路保存）
      const publicDir = path.resolve(process.cwd(), 'docs/public')
      server.middlewares.use(
        saveEndpoint,
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== 'POST') return next()

          // 🔒 仅接受 JSON 请求体
          const contentType = String(req.headers['content-type'] || '')
            .split(';')[0]
            .trim()
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
        }
      )
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
          // 「hex 精确匹配 → 语义 token」开关：默认 false（普通 hex SVG 保持原样），
          // 显式 svgEditorPlugin({ mapHexToVar: true }) 时才开启升级为语义色。
          __SVG_EDITOR_MAP_HEX_TO_VAR__: JSON.stringify(mapHexToVar),
          // 颜色处理模式：默认 'semantic'（语义 token 优先），
          // 显式 svgEditorPlugin({ colorMode: 'algorithm' }) 时走纯 OKLCH 算法。
          __SVG_EDITOR_COLOR_MODE__: JSON.stringify(colorMode),
          // E2E 测试模式开关：仅当显式设置 SVG_EDITOR_E2E=1 时才为 true，使 vitepress preview
          // 静态产物也能暴露测试钩子（testHooks.ts）并渲染「编辑 SVG」按钮（SvgDiagram.vue）。
          // 真正发布给使用者的构建不设置该变量，二者均关闭（配合 import.meta.env.DEV 的
          // tree-shaking，生产产物零污染），仅 CI 测试专用构建开启以支持 preview 跑测。
          __SVG_EDITOR_E2E__: JSON.stringify(process.env.SVG_EDITOR_E2E === '1'),
        },
      }
    },
  }
}

export function svgDiagramMarkdownPlugin(
  md: MarkdownIt,
  options: { markdownSyntax?: boolean } = {}
): void {
  if (options.markdownSyntax === false) return

  const defaultImageRender = md.renderer.rules.image

  md.renderer.rules.image = (tokens, idx, renderOpts, env, self) => {
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
