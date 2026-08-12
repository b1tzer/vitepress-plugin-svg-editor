/**
 * 主题适配器接口 — 定义暗色/亮色模式判断的抽象契约
 *
 * 使用者可实现此接口来替换默认的 VitePress 主题检测，
 * 例如自定义品牌色、固定主题等。
 */

export interface IThemeAdapter {
  /** 返回当前是否为暗色模式 */
  isDark(): boolean

  /** 注册主题变化监听，返回取消监听的函数 */
  onChange(callback: (isDark: boolean) => void): () => void
}
