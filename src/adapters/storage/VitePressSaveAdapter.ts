/**
 * VitePress 文件系统保存适配器
 *
 * 实现 StorageAdapter 接口，通过 Vite 开发服务器的 POST 端点
 * 将 SVG 保存到 VitePress 项目文件系统。
 *
 * 安全策略：
 *   - 路径必须位于 saveDir 目录内（防止路径遍历攻击）
 *   - 文件后缀必须为 .svg（防止覆盖非 SVG 文件）
 */

import type { IStorageAdapter, SaveResult } from './StorageAdapter'

export class VitePressSaveAdapter implements IStorageAdapter {
  private saveEndpoint: string
  private saveDir: string

  constructor(saveEndpoint: string = '/__svg-save__', saveDir: string = 'docs/public/diagrams') {
    this.saveEndpoint = saveEndpoint
    this.saveDir = saveDir
  }

  async save(svgText: string, sourcePath: string): Promise<SaveResult> {
    try {
      const resp = await fetch(this.saveEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: sourcePath, content: svgText }),
      })

      if (!resp.ok) {
        const errText = await resp.text()
        return { success: false, error: errText || `HTTP ${resp.status}` }
      }

      const data = await resp.json()
      return { success: true, path: data.file || sourcePath }
    } catch (e) {
      return { success: false, error: (e as Error).message }
    }
  }

  async load(sourcePath: string): Promise<string> {
    const resp = await fetch(sourcePath)
    if (!resp.ok) {
      throw new Error(`无法加载 SVG 文件 "${sourcePath}"：HTTP ${resp.status}`)
    }
    return resp.text()
  }
}
