/**
 * 轻量级 i18n — 基于 Vue 3 provide/inject
 *
 * 使用方式：
 *   // SvgEditor.vue（根组件）
 *   import { createI18n, provideI18n } from '../i18n'
 *   const i18n = createI18n('zh')
 *   provideI18n(i18n)
 *
 *   // 子组件
 *   import { useI18n } from '../i18n'
 *   const { t } = useI18n()
 *   console.log(t('toolbar.undo')) // "撤销 Ctrl+Z"
 */

import { ref, provide, inject, type Ref } from 'vue'
import zhMessages from './zh'
import enMessages from './en'
import type { I18nInstance } from './types'

const I18N_KEY = Symbol('i18n')

const messages: Record<string, Record<string, Record<string, string>>> = {
  zh: zhMessages,
  en: enMessages,
}

/**
 * 创建 i18n 实例
 * @param defaultLocale 默认语言，默认 'zh'
 */
export function createI18n(defaultLocale: string = 'zh'): I18nInstance {
  const locale = ref(defaultLocale)

  function setLocale(l: string): void {
    if (messages[l]) locale.value = l
  }

  function t(key: string): string {
    const parts = key.split('.')
    let result: unknown = messages[locale.value]
    for (const p of parts) {
      result = (result as Record<string, unknown>)?.[p]
      if (result === undefined) break
    }
    // 回退：未找到翻译则返回 key 本身
    return typeof result === 'string' ? result : key
  }

  return { t, locale: locale.value, setLocale }
}

/** 在根组件中 provide i18n 实例 */
export function provideI18n(i18n: I18nInstance): void {
  provide(I18N_KEY, i18n)
}

/** 在子组件中 inject i18n 实例 */
export function useI18n(): I18nInstance {
  const instance = inject<I18nInstance>(I18N_KEY)
  if (!instance) throw new Error('[i18n] 未找到 i18n 实例，请确保已在根组件中调用 provideI18n()')
  return instance
}
