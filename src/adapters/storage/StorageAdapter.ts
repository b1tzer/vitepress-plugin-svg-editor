/**
 * 存储适配器接口 — 定义 SVG 持久化的抽象契约
 *
 * 使用者可实现此接口来替换默认的 VitePress 文件系统保存，
 * 例如改为 REST API、localStorage、S3 等后端。
 */

/** 保存操作结果 */
export interface SaveResult {
  success: boolean
  path?: string
  error?: string
}

/** 存储适配器抽象接口 */
export interface IStorageAdapter {
  /**
   * 保存 SVG 文本到目标位置
   * @param svgText    — 最终 SVG 字符串
   * @param sourcePath — 原始文件路径（如 "/diagrams/foo.svg"）
   * @returns 操作结果，含成功/失败状态和可选错误信息
   */
  save(svgText: string, sourcePath: string): Promise<SaveResult>

  /**
   * 加载 SVG 文本
   * @param sourcePath — 原始文件路径
   * @returns SVG 字符串
   */
  load(sourcePath: string): Promise<string>
}
