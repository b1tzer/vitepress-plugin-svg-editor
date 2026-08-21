<script setup lang="ts">
/**
 * SVG 编辑器 — 容器层（Orchestrator）
 *
 * 布局参考：vue-fabric-editor 三栏布局（左-中-右 + 顶栏）
 * 左：EditorLeftPanel（元素清单 + 图层面板）
 * 中：EditorCanvas（Fabric.js 画布 + 标尺）
 * 右：EditorContextPanel（属性面板）
 * 顶：EditorToolbar（全局操作栏）
 *
 * 职责（issue #15 第 2 条）：仅负责组件组合与事件转发；
 * 剪贴板/主题/选择状态/保存/图层/键盘等逻辑已下沉到 composable。
 */
import { ref, shallowRef, onMounted, onUnmounted, nextTick, provide } from 'vue'
import type { Canvas } from 'fabric'
import EditorToolbar from './sub/EditorToolbar.vue'
import EditorCanvas from './sub/EditorCanvas.vue'
import EditorLeftPanel from './sub/EditorLeftPanel.vue'
import EditorContextPanel from './sub/EditorContextPanel.vue'
import { SvgLoader } from '../core/serialization/SvgLoader'
import { SvgSerializer } from '../core/serialization/SvgSerializer'
import { CanvasManager } from '../core/canvas/CanvasManager'
import { HistoryManager } from '../core/history/HistoryManager'
import { mergeArrows } from '../plugins/arrow-merger'
import { VitePressSaveAdapter } from '../adapters/storage/VitePressSaveAdapter'
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter'
import type { IStorageAdapter } from '../adapters/storage/StorageAdapter'
import { ensureObjectInteractive } from '../core/shared/interactive'
import { createShape } from '../core/editor/ObjectFactory'
import { mountSvgObjects } from '../core/editor/SvgObjectMounter'
import { useEditorState } from '../composables/useEditorState'
import { useClipboard } from '../composables/useClipboard'
import { useTheme } from '../composables/useTheme'
import { useSave } from '../composables/useSave'
import { useLayer } from '../composables/useLayer'
import { useKeyboard } from '../composables/useKeyboard'
import { useCanvasSize } from '../composables/useCanvasSize'
import { useEditorStore, EditorStoreKey } from '../composables/useEditorStore'
import { exposeTestHooks, clearTestHooks } from '../core/shared/testHooks'
import { mark, measure, timedAsync, initPerfMonitor } from '../utils/perf'

// ── 存储适配器（根据插件配置的 storage 模式选择）──
const storageAdapter: IStorageAdapter =
  typeof __SVG_EDITOR_STORAGE__ !== 'undefined' && __SVG_EDITOR_STORAGE__ === 'localStorage'
    ? new LocalStorageAdapter()
    : new VitePressSaveAdapter(
        typeof __SVG_EDITOR_SAVE_ENDPOINT__ === 'string'
          ? __SVG_EDITOR_SAVE_ENDPOINT__
          : '/__svg-save__'
      )
// ── 序列化器（统一后处理链，复用 SvgSerializer 而非手写）──
const serializer = new SvgSerializer()
// ── 加载器（含 sanitizeSvg XSS 清洗 + 文件大小校验）──
const svgLoader = new SvgLoader()

const props = defineProps({
  src: { type: String, required: true },
  showThemeToggle: { type: Boolean, default: true },
})
const emit = defineEmits(['close', 'saved'])

// ── 默认画布尺寸（当 SVG 无 viewBox 或宽高时兜底）──
const DEFAULT_SVG_WIDTH = 800
const DEFAULT_SVG_HEIGHT = 500

// ── 编排层保留的 Vue 响应式状态 ──
const canvasRef = ref<InstanceType<typeof EditorCanvas> | null>(null)
const fabricCanvasRef = shallowRef<Canvas | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const spacePressed = ref(false)
const isPanning = ref(false)
const panelCollapsed = ref(false)
const leftPanelCollapsed = ref(false)
function togglePanel() {
  panelCollapsed.value = !panelCollapsed.value
}
function toggleLeftPanel() {
  leftPanelCollapsed.value = !leftPanelCollapsed.value
}

// 核心管理器
const canvasMgr = new CanvasManager()
const historyMgr = new HistoryManager()

// ── 主题切换（chrome 明暗跟随网页 .dark，SVG 暗色由按住预览按钮控制）──
const { uiTheme, svgDark, setSvgDark, mountUiThemeSync, unmountUiThemeSync } = useTheme(canvasMgr)

// ── 图层管理 ──
const { canvasObjects, refreshLayerList, selectLayer, toggleLayerVisibility } = useLayer(canvasMgr)

// ── 画布尺寸管理 ──
const { svgWidth, svgHeight, originalViewBox, handleResize, onResizePreview, onResizeCommit } =
  useCanvasSize(canvasMgr)

// ── 编辑器 store（聚合 selection + toolbar + commit，供属性面板 inject）──
const store = useEditorStore({
  canvasMgr,
  historyMgr,
  refreshLayerList,
  getSvgSize: () => ({ w: svgWidth.value, h: svgHeight.value }),
})
provide(EditorStoreKey, store)

// ── 从 store 解构本组件仍需复用的状态与操作 ──
const {
  selection,
  updateSelectionInfo,
  commit,
  undo,
  redo,
  deleteObj,
  selectAll,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  groupSelected,
  ungroupSelected,
} = store

// ── 剪贴板 ──
const { copy: copyObj, paste: pasteObj } = useClipboard({
  getCanvas: () => canvasMgr.canvas,
  commit,
})

// ── 保存 ──
const { saving, errorMessage, save, showError } = useSave({
  getCanvas: () => canvasMgr.canvas,
  serializer,
  storageAdapter,
  src: props.src,
  getOriginalViewBox: () => originalViewBox.value,
  onSaved: () => emit('saved'),
  onClose: () => emit('close'),
})

// ── 左侧面板：添加元素（使用逻辑坐标，viewport transform 负责缩放映射）──
function addElement(type: string) {
  const fc = canvasMgr.canvas
  if (!fc) return
  const centerX = svgWidth.value / 2
  const centerY = svgHeight.value / 2
  const obj = createShape(type, centerX, centerY)
  if (!obj) return
  commit((canvas) => {
    ensureObjectInteractive(obj)
    canvas.add(obj)
    canvas.setActiveObject(obj)
    canvas.renderAll()
  })
}

// ── 编辑器状态桥接（含 EventBus 监听清理）──
const { zoomLevel, viewportVersion, canUndo, canRedo } = useEditorState(canvasMgr, historyMgr, {
  onSelectionChange: updateSelectionInfo,
  onModified: (command) => {
    if (command) historyMgr.record(command)
    else historyMgr.save(canvasMgr.canvas!)
    refreshLayerList()
  },
})

// ── 键盘监听（集中注册/清理）──
const keyboard = useKeyboard()

// ── 主加载流程 ──
async function loadAndInit() {
  loading.value = true
  mark('svg:load:start')
  await nextTick()
  const base = import.meta.env.BASE_URL || '/'
  const url = props.src.startsWith('/') ? base + props.src.slice(1) : props.src

  // 拉取 + 清洗 + 预处理（下沉到 SvgLoader.loadFromUrl，issue #19 P1）
  let loaded: Awaited<ReturnType<typeof svgLoader.loadFromUrl>>
  try {
    loaded = await timedAsync('svg:preprocess', () => svgLoader.loadFromUrl(url))
  } catch (e) {
    console.error('[SvgEditor] 获取 SVG 失败:', url, e)
    loading.value = false
    showError('加载 SVG 失败，请检查文件是否存在')
    return
  }
  const { svg, originalViewBox: vb, svgWidth: sw, svgHeight: sh } = loaded
  if (vb) originalViewBox.value = vb
  if (sw > 0) svgWidth.value = sw
  else svgWidth.value = DEFAULT_SVG_WIDTH
  if (sh > 0) svgHeight.value = sh
  else svgHeight.value = DEFAULT_SVG_HEIGHT
  const area = canvasRef.value?.canvasAreaRef
  if (!area) return
  await new Promise((r) => requestAnimationFrame(r))
  await new Promise((r) => requestAnimationFrame(r))
  const w = svgWidth.value || DEFAULT_SVG_WIDTH
  const h = svgHeight.value || DEFAULT_SVG_HEIGHT
  const canvasEl = area.querySelector('canvas')
  if (!canvasEl) return
  const fc = canvasMgr.init(canvasEl, w, h)
  fabricCanvasRef.value = fc

  // 集中暴露测试钩子（issue #15 第 1 条）
  exposeTestHooks(fc, canvasMgr, historyMgr)

  // 装载 SVG 对象（下沉到 mountSvgObjects，mergeArrows 作为对象级转换注入，issue #19 P1）
  mountSvgObjects(fc, svg, { transform: mergeArrows })
    .then(() => {
      canvasMgr.zoomFit()
      historyMgr.save(fc)
      refreshLayerList()
    })
    .catch((e) => {
      console.error('[SvgEditor] SVG 加载失败:', e)
    })
    .finally(() => {
      mark('svg:load:end')
      measure('svg:load', 'svg:load:start', 'svg:load:end')
      loading.value = false
    })

  keyboard.register(
    {
      undo,
      redo,
      copy: copyObj,
      paste: pasteObj,
      save,
      selectAll,
      bold: toggleBold,
      italic: toggleItalic,
      underline: toggleUnderline,
      zoomIn: () => canvasMgr.zoomIn(),
      zoomOut: () => canvasMgr.zoomOut(),
      zoomFit: () => canvasMgr.zoomFit(),
      group: groupSelected,
      ungroup: ungroupSelected,
    },
    {
      onSpaceDown: () => {
        spacePressed.value = true
        canvasMgr.setSpacePressed(true)
        fc.setCursor('grab')
      },
      onSpaceUp: () => {
        spacePressed.value = false
        canvasMgr.setSpacePressed(false)
      },
      onEscape: () => {
        spacePressed.value = false
        canvasMgr.setSpacePressed(false)
        emit('close')
      },
      onDelete: deleteObj,
      isEditableFocused: () =>
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA',
    }
  )
}

// ── 生命周期集中管理（issue #15 第 3 条）──
let _stopPerfMonitor: (() => void) | null = null

onMounted(() => {
  loadAndInit()
  nextTick(() => {
    overlayRef.value?.focus()
  })
  // 网页明暗监听下沉到 useTheme.mountUiThemeSync（监听 <html> class 变化，同步 chrome 明暗）
  mountUiThemeSync()
  // dev-only：启动 FPS + longtask 监测，生产构建不写入
  if (import.meta.env.DEV) {
    _stopPerfMonitor = initPerfMonitor({
      onFps: (fps) => {
        window.__perfFps = fps
      },
    })
  }
})

onUnmounted(() => {
  unmountUiThemeSync()
  _stopPerfMonitor?.()
  keyboard.cleanup()
  clearTestHooks()
  canvasMgr.dispose()
})
</script>

<template>
  <div
    class="editor-overlay"
    @click.self="emit('close')"
    @keydown.escape="emit('close')"
    tabindex="-1"
    ref="overlayRef"
  >
    <div class="editor-app" :class="uiTheme === 'light' ? 'theme-light' : 'theme-dark'">
      <!-- 错误提示 toast -->
      <Transition name="toast-fade">
        <div v-if="errorMessage" class="editor-error-toast" role="alert">{{ errorMessage }}</div>
      </Transition>
      <!-- 顶栏 -->
      <EditorToolbar
        :src="props.src"
        :zoomLevel="zoomLevel"
        :svgWidth="svgWidth"
        :svgHeight="svgHeight"
        :selectionInfo="selection.selectionInfo"
        :showThemeToggle="props.showThemeToggle"
        :themeMode="uiTheme"
        :svgDark="svgDark"
        :saving="saving"
        :canUndo="canUndo"
        :canRedo="canRedo"
        @undo="undo"
        @redo="redo"
        @copy="copyObj"
        @paste="pasteObj"
        @delete="deleteObj"
        @zoomIn="canvasMgr.zoomIn()"
        @zoomOut="canvasMgr.zoomOut()"
        @zoomFit="canvasMgr.zoomFit()"
        @previewDarkStart="setSvgDark(true)"
        @previewDarkEnd="setSvgDark(false)"
        @save="save"
        @close="emit('close')"
        @resize="handleResize"
      />

      <!-- 主体：三栏布局 -->
      <div class="editor-body">
        <!-- 左：元素清单 / 图层面板 -->
        <EditorLeftPanel
          :canvasObjects="canvasObjects"
          :collapsed="leftPanelCollapsed"
          :themeMode="uiTheme"
          @toggleCollapse="toggleLeftPanel"
          @addElement="addElement"
          @selectLayer="selectLayer"
          @toggleLayerVisibility="toggleLayerVisibility"
        />

        <!-- 中：画布 + 标尺 -->
        <EditorCanvas
          ref="canvasRef"
          :loading="loading"
          :zoomLevel="zoomLevel"
          :canvasWidth="svgWidth"
          :canvasHeight="svgHeight"
          :themeMode="uiTheme"
          :viewportVersion="viewportVersion"
          :fabricCanvas="fabricCanvasRef"
          @canvasWheel="(deltaY: number) => canvasMgr.injectWheel(deltaY)"
          @canvasAreaMouseEvent="
            (cx: number, cy: number, type: string) =>
              canvasMgr.injectMouseEvent(cx, cy, type as 'mousedown' | 'mousemove' | 'mouseup')
          "
          @resizePreview="onResizePreview"
          @resizeCommit="onResizeCommit"
          @middlePan="
            (type: string, cx: number, cy: number) =>
              canvasMgr.injectMiddlePan(type as 'mousedown' | 'mousemove' | 'mouseup', cx, cy)
          "
        />

        <!-- 右：属性面板（经 inject store 消费选中状态与编辑操作，仅保留外观/布局 props） -->
        <EditorContextPanel
          :themeMode="uiTheme"
          :collapsed="panelCollapsed"
          @toggleCollapse="togglePanel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 全屏遮罩 ── */
.editor-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(12px) saturate(1.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayIn 0.15s ease;
}
@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ── 编辑器应用容器（铺满视口） ── */
.editor-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.editor-app.theme-dark {
  background: #191919;
}
.editor-app.theme-light {
  background: #f0f1f3;
}

/* ── 主体：画布铺满，左右面板作为悬浮层覆盖其上 ── */
.editor-body {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

/* ── 错误提示 toast ── */
.editor-error-toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  max-width: 80vw;
  padding: 10px 18px;
  border-radius: 8px;
  background: #d32f2f;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
