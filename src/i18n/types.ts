/**
 * i18n 类型定义
 */

/** 翻译字典：key → 中文/英文 */
export type TranslationMap = Record<string, Record<string, string>>

/** i18n 实例 */
export interface I18nInstance {
  /** 翻译函数 */
  t: (key: string) => string
  /** 当前语言 */
  locale: string
  /** 设置语言 */
  setLocale: (l: string) => void
}
