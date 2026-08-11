/**
 * vitepress-plugin-svg-editor — Node 端入口
 *
 * 提供：
 *   1. svgEditorPlugin()  — Vite 插件（save 端点 + optimizeDeps）
 *   2. svgDiagramMarkdownPlugin() — Markdown-it 插件（![alt](.svg) → <SvgDiagram>）
 */

import fs from 'fs'
import path from 'path'

export interface SvgEditorPluginOptions {
  saveEndpoint?: string
  saveDir?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function svgEditorPlugin(options: SvgEditorPluginOptions = {}): any {
  const saveEndpoint = options.saveEndpoint || '/__svg-save__'
  const saveDir = options.saveDir || 'docs/public/diagrams'

  return {
    name: 'vitepress-plugin-svg-editor',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      const diagramsDir = path.resolve(process.cwd(), saveDir)
      server.middlewares.use(saveEndpoint, (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => (body += chunk.toString()))
        req.on('end', () => {
          try {
            const { path: svgPath, content } = JSON.parse(body)
            const fullPath = path.resolve(process.cwd(), 'docs/public', svgPath.replace(/^\//, ''))
            if (!fullPath.startsWith(diagramsDir) || !fullPath.endsWith('.svg')) {
              res.statusCode = 403
              res.end('Forbidden: only SVG files in ' + saveDir + ' are allowed')
              return
            }
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
      }
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function svgDiagramMarkdownPlugin(md: any) {
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
