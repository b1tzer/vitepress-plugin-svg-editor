/**
 * 保存 composable — SVG 序列化与存储适配器保存（issue #15 第 2 条）
 *
 * 从 SvgEditor.vue 中抽取保存逻辑与错误提示，独立为可复用 composable。
 */

import { ref, type Ref } from 'vue'
import type { Canvas } from 'fabric'
import type { SvgSerializer } from '../core/serialization/SvgSerializer'
import type { IStorageAdapter } from '../adapters/storage/StorageAdapter'
import type { ThemeMode } from '../core/shared/types'
import { timed } from '../utils/perf'

export interface UseSaveDeps {
  getCanvas: () => Canvas | null
  serializer: SvgSerializer
  storageAdapter: IStorageAdapter
  src: string
  getOriginalViewBox: () => string
  getThemeMode: () => ThemeMode
  onSaved: () => void
  onClose: () => void
}

export function useSave(deps: UseSaveDeps): {
  saving: Ref<boolean>
  errorMessage: Ref<string>
  save: () => Promise<void>
  showError: (msg: string) => void
} {
  const saving = ref(false)
  const errorMessage = ref('')
  let _errorTimer: ReturnType<typeof setTimeout> | null = null

  function showError(msg: string): void {
    errorMessage.value = msg
    if (_errorTimer) clearTimeout(_errorTimer)
    _errorTimer = setTimeout(() => {
      errorMessage.value = ''
    }, 4000)
  }

  async function save(): Promise<void> {
    const fc = deps.getCanvas()
    if (!fc) return
    saving.value = true
    try {
      const svgText = timed('export:toSVG', () =>
        deps.serializer.serialize(fc, {
          originalViewBox: deps.getOriginalViewBox(),
          theme: deps.getThemeMode(),
        })
      )
      const result = await deps.storageAdapter.save(svgText, deps.src)
      if (result.success) {
        deps.onSaved()
        deps.onClose()
      } else {
        showError('保存失败: ' + result.error)
      }
    } catch (e: unknown) {
      showError('保存失败: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      saving.value = false
    }
  }

  return { saving, errorMessage, save, showError }
}
