/**
 * localStorage 存储适配器
 *
 * 实现 StorageAdapter 接口，将 SVG 保存到浏览器 localStorage。
 * 适用于本地预览 / 离线编辑场景，不发起网络请求。
 *
 * 存储键格式：svg-editor:{sourcePath}
 */

import type { IStorageAdapter, SaveResult } from './StorageAdapter'

const KEY_PREFIX = 'svg-editor:'

export class LocalStorageAdapter implements IStorageAdapter {
  async save(svgText: string, sourcePath: string): Promise<SaveResult> {
    try {
      localStorage.setItem(KEY_PREFIX + sourcePath, svgText)
      return { success: true, path: sourcePath }
    } catch (e) {
      return {
        success: false,
        error: `localStorage 保存失败: ${(e as Error).message}`,
      }
    }
  }

  async load(sourcePath: string): Promise<string> {
    const data = localStorage.getItem(KEY_PREFIX + sourcePath)
    if (data === null) {
      throw new Error(`localStorage 中未找到 SVG: "${sourcePath}"`)
    }
    return data
  }
}
