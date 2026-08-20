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
import type { ColorMode } from '../core/shared/types'
import { timed } from '../utils/perf'

export interface UseSaveDeps {
  getCanvas: () => Canvas | null
  serializer: SvgSerializer
  storageAdapter: IStorageAdapter
  src: string
  getOriginalViewBox: () => string
  getThemeMode: () => ThemeMode
  /** 颜色处理模式：'algorithm' 时保存不还原 var()，落盘为纯 hex */
  colorMode: ColorMode
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
      // 序列化器内部从对象 fillLight/strokeLight 收集非语义色归一化映射，
      // 保证落盘 SVG 永远保存亮色语义（暗色由运行时派生），无需外部传入反向映射。
      const theme = deps.getThemeMode()
      const svgText = timed('export:toSVG', () =>
        deps.serializer.serialize(fc, {
          originalViewBox: deps.getOriginalViewBox(),
          theme,
          // 纯算法模式不还原 var()：语义 ID 已在导入时被剥离，落盘为纯 hex
          restoreCssVars: deps.colorMode === 'semantic',
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
