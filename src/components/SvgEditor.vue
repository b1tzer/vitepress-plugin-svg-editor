<script setup lang="ts">
/**
 * SVG 编辑器 — 容器层（Orchestrator）
 *
 * 布局参考：vue-fabric-editor 三栏布局（左-中-右 + 顶栏）
 * 左：EditorLeftPanel（元素清单 + 图层面板）
 * 中：EditorCanvas（Fabric.js 画布 + 标尺）
 * 右：EditorContextPanel（属性面板）
 * 顶：EditorToolbar（全局操作栏）
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as fabric from 'fabric'
import EditorToolbar from './sub/EditorToolbar.vue'
import EditorCanvas from './sub/EditorCanvas.vue'
import EditorLeftPanel from './sub/EditorLeftPanel.vue'
import EditorContextPanel from './sub/EditorContextPanel.vue'
import { LIGHT_TO_DARK, DARK_TO_LIGHT } from '../core/colors'
import { SvgLoader } from '../core/SvgLoader'
import { SvgSerializer } from '../core/SvgSerializer'
import { CanvasManager } from '../core/CanvasManager.ts'
import { HistoryManager } from '../core/HistoryManager.ts'
import { mergeArrows } from '../plugins/arrow-merger.ts'
import { VitePressSaveAdapter } from '../adapters/storage/VitePressSaveAdapter'
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter'
import type { IStorageAdapter } from '../adapters/storage/StorageAdapter'
import * as AlignPlugin from '../plugins/align.ts'
import * as LayerPlugin from '../plugins/layer.ts'
import * as TextFormatPlugin from '../plugins/text-format.ts'
import * as DistributePlugin from '../plugins/distribute.ts'
import { applyGradient } from '../plugins/gradient.ts'
import { toggleShadow, applyShadow } from '../plugins/shadow.ts'
import { FABRIC_TYPE, TEXT_TYPES } from '../core/FabricTypes.ts'
import { ensureObjectInteractive } from '../core/editor/Interactive'
import { createShape, convertTextToTextbox } from '../core/editor/ObjectFactory'
import { createKeyboardHandlers } from '../core/editor/KeyboardMap'
import { useEditorState } from '../composables/useEditorState'
import { mark, measure, timed, initPerfMonitor } from '../utils/perf'

// ── 存储适配器（根据插件配置的 storage 模式选择）──
const storageAdapter: IStorageAdapter = (typeof __SVG_EDITOR_STORAGE__ !== 'undefined' && __SVG_EDITOR_STORAGE__ === 'localStorage')
  ? new LocalStorageAdapter()
  : new VitePressSaveAdapter()
// ── 序列化器（统一后处理链，复用 SvgSerializer 而非手写）──
const serializer = new SvgSerializer()
// ── 加载器（含 sanitizeSvg XSS 清洗 + 文件大小校验，复用 SvgLoader 而非直接 preprocessSvg）──
const svgLoader = new SvgLoader()

const props = defineProps({
  src: { type: String, required: true },
  showThemeToggle: { type: Boolean, default: true },
})
const emit = defineEmits(['close', 'saved'])

// ── Vue 响应式状态 ──
const canvasRef = ref<any>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const saving = ref(false)
const svgWidth = ref(0)
const svgHeight = ref(0)
const selectionInfo = ref('')
const currentFill = ref('')
const currentStroke = ref('')
const currentFontSize = ref(12)
const currentFontWeight = ref('normal')
const currentFontStyle = ref('normal')
const currentUnderline = ref(false)
const currentTextAlign = ref('left')
const currentTextFill = ref('')
const currentStrokeWidth = ref(1)
const currentStrokeDash = ref(false)
const currentRotation = ref(0)
const currentOpacity = ref(100)
const gradientType = ref('none')
const gradientAngle = ref(0)
const gradientColor1 = ref('#1565C0')
const gradientColor2 = ref('#E3F2FD')
const shadowEnabled = ref(false)
const shadowColor = ref('#000000')
const shadowBlur = ref(5)
const shadowOffsetX = ref(3)
const shadowOffsetY = ref(3)
const originalViewBox = ref('')
const spacePressed = ref(false)
const isPanning = ref(false)
const themeMode = ref(
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
)
const panelCollapsed = ref(false)
const leftPanelCollapsed = ref(false)
const hasTextInSelection = ref(false)
function togglePanel() { panelCollapsed.value = !panelCollapsed.value }
function toggleLeftPanel() { leftPanelCollapsed.value = !leftPanelCollapsed.value }

// 画布对象列表（供图层面板使用）
const canvasObjects = ref<Array<{ id: string; type: string; name: string; visible: boolean }>>([])

// 核心管理器
const canvasMgr = new CanvasManager()
const historyMgr = new HistoryManager()
// 暴露到 window，供 E2E 测试 helper 直接保存/撤销快照（测试侧 add 操作需走快照才能被撤销）
;(window as any).__historyMgr = historyMgr
let _keyHandlerFn: any = null
let _keyUpHandler: any = null
let _stopPerfMonitor: (() => void) | null = null

const { zoomLevel, viewportVersion, canUndo, canRedo } = useEditorState(
  canvasMgr,
  historyMgr,
  {
    onSelectionChange: updateSelectionInfo,
    onModified: (command) => {
      if (command) historyMgr.record(command)
      else historyMgr.save(canvasMgr.canvas!, () => {}, () => {})
      refreshLayerList()
    },
  },
)

// ── 图层面板刷新 ──
function refreshLayerList() {
  const fc = canvasMgr.canvas
  if (!fc) { canvasObjects.value = []; return }
  canvasObjects.value = fc.getObjects().map((obj: any, i: number) => ({
    id: `layer-${i}`,
    type: obj.type || 'unknown',
    name: getObjectName(obj, i),
    visible: obj.visible !== false,
  }))
}

function getObjectName(obj: any, idx: number): string {
  if (TEXT_TYPES.includes(obj.type)) {
    return (obj.text || '').substring(0, 15) || '文本'
  }
  const typeMap: Record<string, string> = { rect: '矩形', circle: '圆', triangle: '三角', ellipse: '椭圆', line: '线条', path: '路径', polygon: '多边形', group: '组合' }
  return typeMap[obj.type] || obj.type || `元素 ${idx + 1}`
}

// ── 选择状态更新 ──
function updateSelectionInfo() {
  const fc = canvasMgr.canvas
  if (!fc) return
  const active = fc.getActiveObject()
  if (!active) { selectionInfo.value = ''; return }
  const isMulti = active.type === FABRIC_TYPE.ACTIVE_SELECTION
  selectionInfo.value = isMulti ? `${(active as any)._objects.length} 个选中` : active.type

  // 判断选中集合中是否包含文本对象（支持多选时显示文字对齐按钮）
  if (isMulti) {
    hasTextInSelection.value = (active as any)._objects.some(
      (o: any) => TEXT_TYPES.includes(o.type)
    )
  } else {
    hasTextInSelection.value = TEXT_TYPES.includes(active.type)
  }

  if (active.fill && typeof active.fill === 'string') currentFill.value = active.fill
  if (active.stroke && typeof active.stroke === 'string') currentStroke.value = active.stroke
  if (active.strokeWidth != null) currentStrokeWidth.value = active.strokeWidth
  currentStrokeDash.value = !!(active as any).strokeDashArray
  currentRotation.value = Math.round(active.angle || 0)
  currentOpacity.value = Math.round((active.opacity != null ? active.opacity : 1) * 100)

  const f = active.fill as any
  if (f && typeof f === 'object' && f.type) {
    gradientType.value = f.type
    gradientAngle.value = f.type === 'linear' ? Math.round(Math.atan2(f.coords?.y2 - f.coords?.y1, f.coords?.x2 - f.coords?.x1) * 180 / Math.PI) : 0
    const stops = f.colorStops || []
    if (stops[0]) gradientColor1.value = stops[0].color
    if (stops[1]) gradientColor2.value = stops[1].color
  } else { gradientType.value = 'none' }

  const s = active.shadow as any
  if (s) { shadowEnabled.value = true; shadowColor.value = s.color || '#000'; shadowBlur.value = s.blur || 5; shadowOffsetX.value = s.offsetX || 3; shadowOffsetY.value = s.offsetY || 3 }
  else { shadowEnabled.value = false }

  const textObj = TextFormatPlugin.getTextObjects(fc)[0]
  if (textObj) {
    if (textObj.fontSize) currentFontSize.value = textObj.fontSize
    if (textObj.fontWeight) currentFontWeight.value = textObj.fontWeight
    if (textObj.fontStyle) currentFontStyle.value = textObj.fontStyle
    if (textObj.underline !== undefined) currentUnderline.value = textObj.underline
    if (textObj.textAlign) currentTextAlign.value = textObj.textAlign
    if (textObj.fill && typeof textObj.fill === 'string') currentTextFill.value = textObj.fill
  }
}

// ── 工具栏操作 ──
function withSave(fn: (fc: any) => void) { const fc = canvasMgr.canvas; if (!fc) return; fn(fc); historyMgr.save(fc, () => {}, () => {}); refreshLayerList() }
function undo() { historyMgr.undo(canvasMgr.canvas!, () => { canvasMgr.rebuildWorkspace(svgWidth.value, svgHeight.value); refreshLayerList() }) }
function redo() { historyMgr.redo(canvasMgr.canvas!, () => { canvasMgr.rebuildWorkspace(svgWidth.value, svgHeight.value); refreshLayerList() }) }
function copyObj() {
  const a = canvasMgr.canvas?.getActiveObject()
  if (!a) return
  if (a.type === FABRIC_TYPE.ACTIVE_SELECTION) {
    // 多选（ActiveSelection）：保存子对象引用（粘贴时逐个 clone），
    // 避免对 ActiveSelection 本身二次 clone 触发 t2 is not iterable
    window._clipboard = (a as any).getObjects()
  } else {
    ;(a as any).clone((c: any) => { window._clipboard = c })
  }
}
function pasteObj() {
  if (!window._clipboard) return
  const fc = canvasMgr.canvas
  if (!fc) return
  const clipboard = window._clipboard

  const addAndSelect = (objs: any[]) => {
    if (!objs.length) return
    fc.discardActiveObject()
    objs.forEach((c: any) => {
      c.set({ left: (c.left || 0) + 20, top: (c.top || 0) + 20 })
      fc.add(c)
    })
    if (objs.length > 1) {
      fc.setActiveObject(new fabric.ActiveSelection(objs, { canvas: fc }))
    } else {
      fc.setActiveObject(objs[0])
    }
    fc.renderAll()
    withSave(() => {})
  }

  if (Array.isArray(clipboard)) {
    const sources = clipboard.filter((o: any) => !!o)
    if (!sources.length) return
    const clones: any[] = []
    let pending = sources.length
    sources.forEach((o: any) => {
      ;(o as any).clone((c: any) => {
        clones.push(c)
        pending -= 1
        if (pending === 0) addAndSelect(clones)
      })
    })
  } else {
    ;(clipboard as any).clone((c: any) => addAndSelect([c]))
  }
}
function deleteObj() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a) return; if (a.type === FABRIC_TYPE.ACTIVE_SELECTION) { (a as any).forEachObject((o: any) => fc!.remove(o)); fc!.discardActiveObject() } else fc!.remove(a); fc!.renderAll(); withSave(() => {}) }
function align(type: string) { withSave((fc: any) => (AlignPlugin as any)[`align${type.charAt(0).toUpperCase() + type.slice(1)}`](fc)) }
function applyFill(hex: string) { withSave((fc: any) => { const a = fc.getActiveObject(); if (a) a.set('fill', hex) }) }
function applyStroke(hex: string) { withSave((fc: any) => { const a = fc.getActiveObject(); if (a) a.set('stroke', hex) }) }
function applyTextFill(hex: string) { withSave((fc: any) => { TextFormatPlugin.applyTextFill(fc, hex); currentTextFill.value = hex }) }
function applyStrokeWidth(w: number) { withSave((fc: any) => { const a = fc.getActiveObject(); if (a) a.set('strokeWidth', w); currentStrokeWidth.value = w }) }
function toggleStrokeDash() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a) return; const next = !currentStrokeDash.value; (a as any).set('strokeDashArray', next ? [6, 3] : null); currentStrokeDash.value = next; fc!.renderAll(); withSave(() => {}) }
function applyFontSize(size: number) { withSave((fc: any) => TextFormatPlugin.applyFontSize(fc, size)); currentFontSize.value = size }
function toggleBold() { withSave((fc: any) => { currentFontWeight.value = TextFormatPlugin.toggleBold(fc) || 'normal' }) }
function toggleItalic() { withSave((fc: any) => { currentFontStyle.value = TextFormatPlugin.toggleItalic(fc) || 'normal' }) }
function toggleUnderline() { withSave((fc: any) => { currentUnderline.value = TextFormatPlugin.toggleUnderline(fc) }) }
function applyRotation(angle: number) { const a = canvasMgr.canvas?.getActiveObject(); if (!a) return; a.rotate(angle); currentRotation.value = angle; canvasMgr.canvas!.renderAll(); withSave(() => {}) }
function groupSelected() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a || a.type !== FABRIC_TYPE.ACTIVE_SELECTION) return; (a as any).toGroup(); fc!.renderAll(); withSave(() => {}) }
function ungroupSelected() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a || a.type !== FABRIC_TYPE.GROUP) return; (a as any).toActiveSelection(); fc!.renderAll(); withSave(() => {}) }
function selectAll() {
  const fc = canvasMgr.canvas
  if (!fc) return
  // 排除 workspace 背景 / clipPath 等 excludeFromExport 的内部对象，只全选用户可见元素
  const objs = fc.getObjects().filter((o: any) => !o.excludeFromExport)
  if (!objs.length) return
  fc.discardActiveObject()
  const sel = new fabric.ActiveSelection(objs, { canvas: fc })
  fc.setActiveObject(sel)
  fc.renderAll()
  updateSelectionInfo()
}
function applyOpacity(value: number) { const a = canvasMgr.canvas?.getActiveObject(); if (!a) return; a.set('opacity', value / 100); currentOpacity.value = value; canvasMgr.canvas!.renderAll(); withSave(() => {}) }
function applyGradientUI() { const fc = canvasMgr.canvas; if (!fc) return; applyGradient(fc, { type: gradientType.value as any, angle: gradientAngle.value, color1: gradientColor1.value, color2: gradientColor2.value }); withSave(() => {}) }
function toggleShadowUI() { const fc = canvasMgr.canvas; if (!fc) return; shadowEnabled.value = toggleShadow(fc); withSave(() => {}) }
function applyShadowUI() { const fc = canvasMgr.canvas; if (!fc) return; applyShadow(fc, { color: shadowColor.value, blur: shadowBlur.value, offsetX: shadowOffsetX.value, offsetY: shadowOffsetY.value }); withSave(() => {}) }

// ── 左侧面板：添加元素（使用逻辑坐标，viewport transform 负责缩放映射）──
function addElement(type: string) {
  const fc = canvasMgr.canvas
  if (!fc) return
  const centerX = svgWidth.value / 2
  const centerY = svgHeight.value / 2
  const obj = createShape(type, centerX, centerY)
  if (obj) {
    ensureObjectInteractive(obj)
    fc.add(obj)
    fc.setActiveObject(obj)
    fc.renderAll()
    withSave(() => {})
  }
}

// ── 图层面板：选择图层 ──
function selectLayer(id: string) {
  const fc = canvasMgr.canvas
  if (!fc) return
  const idx = parseInt(id.replace('layer-', ''))
  const obj = fc.getObjects()[idx]
  if (obj) { fc.setActiveObject(obj); fc.renderAll() }
}

// ── 图层面板：切换可见性 ──
function toggleLayerVisibility(id: string) {
  const fc = canvasMgr.canvas
  if (!fc) return
  const idx = parseInt(id.replace('layer-', ''))
  const obj = fc.getObjects()[idx]
  if (obj) { obj.set('visible', !obj.visible); fc.renderAll(); refreshLayerList() }
}

// ── 画布尺寸调整 ──
/**
 * 同步更新 originalViewBox 的宽高（保留 minX/minY）
 * 保存时 restoreViewBox 会用此值覆盖 Fabric 输出，确保修改画布尺寸后 SVG 实际尺寸生效。
 */
function updateViewBox(w: number, h: number) {
  const vb = originalViewBox.value
  const ww = Math.max(1, Math.round(w))
  const hh = Math.max(1, Math.round(h))
  if (!vb) {
    originalViewBox.value = `0 0 ${ww} ${hh}`
    return
  }
  const parts = vb.split(/[\s,]+/).map(Number)
  const minX = parts.length >= 2 && !isNaN(parts[0]) ? parts[0] : 0
  const minY = parts.length >= 2 && !isNaN(parts[1]) ? parts[1] : 0
  originalViewBox.value = `${minX} ${minY} ${ww} ${hh}`
}

function applyCanvasSize(w: number, h: number) {
  svgWidth.value = w
  svgHeight.value = h
  canvasMgr.setLogicalSize(w, h)
}

function handleResize(w: number, h: number) {
  applyCanvasSize(w, h)
  updateViewBox(w, h)
}

/** resize handle 拖拽过程中实时预览（只改视觉，不改 viewBox，避免高频字符串/状态抖动） */
function onResizePreview(w: number, h: number) {
  applyCanvasSize(w, h)
}

/** resize handle 拖拽结束提交（同步 viewBox，保存后 SVG 尺寸真正生效） */
function onResizeCommit(w: number, h: number) {
  applyCanvasSize(w, h)
  updateViewBox(w, h)
}

// ── 主题切换 ──
function toggleTheme() {
  const fc = canvasMgr.canvas; if (!fc) return
  const from = themeMode.value, to = from === 'light' ? 'dark' : 'light'
  const mapping: any = from === 'light' ? LIGHT_TO_DARK : DARK_TO_LIGHT
  if (!mapping || !Object.keys(mapping).length) return
  themeMode.value = to
  function swapColor(hex: any): string { if (!hex || typeof hex !== 'string') return hex; return mapping[hex.toUpperCase()] || hex }
  fc.getObjects().forEach((obj: any) => {
    if (obj.excludeFromExport) return;
    (function processObject(o: any) {
      if (o.fill && typeof o.fill === 'string') o.set('fill', swapColor(o.fill))
      if (o.stroke && typeof o.stroke === 'string') o.set('stroke', swapColor(o.stroke))
      if (o._objects) o._objects.forEach(processObject)
    })(obj)
  })
  canvasMgr.updateWorkspaceTheme(to === 'light')
  fc.requestRenderAll()
}

// ── 保存 ──
async function save() {
  if (!canvasMgr.canvas) return
  saving.value = true
  const wasDark = themeMode.value === 'dark'
  if (wasDark) toggleTheme()
  try {
    const fc = canvasMgr.canvas!
    const svgText = timed('export:toSVG', () => serializer.serialize(fc, { originalViewBox: originalViewBox.value }))
    const result = await storageAdapter.save(svgText, props.src)
    if (result.success) { emit('saved'); emit('close') }
    else { alert('保存失败: ' + result.error) }
  } catch (e: any) { alert('保存失败: ' + e.message) }
  finally { if (wasDark) toggleTheme(); saving.value = false }
}

// ── 主加载流程 ──
async function loadAndInit() {
  loading.value = true
  mark('svg:load:start')
  onUnmounted(() => {
    if (_keyHandlerFn) { document.removeEventListener('keydown', _keyHandlerFn); document.removeEventListener('keyup', _keyUpHandler!) }
    canvasMgr.dispose()
  })
  await nextTick()
  const base = import.meta.env.BASE_URL || '/'
  const url = props.src.startsWith('/') ? base + props.src.slice(1) : props.src
  let svgText: string
  try { const resp = await fetch(url); if (!resp.ok) throw new Error(`HTTP ${resp.status}`); svgText = await resp.text() }
  catch (e) { console.error('[SvgEditor] 获取 SVG 失败:', url, e); loading.value = false; return }
  const { svg, originalViewBox: vb, svgWidth: sw, svgHeight: sh } = timed('svg:preprocess', () => svgLoader.load(svgText, themeMode.value))
  if (vb) originalViewBox.value = vb
  if (sw > 0) svgWidth.value = sw; else svgWidth.value = 800
  if (sh > 0) svgHeight.value = sh; else svgHeight.value = 500
  const area = canvasRef.value?.canvasAreaRef
  if (!area) return
  await new Promise(r => requestAnimationFrame(r))
  await new Promise(r => requestAnimationFrame(r))
  // canvas 物理尺寸由 CanvasManager.init 根据 viewport 容器自适应
  const w = svgWidth.value || 800
  const h = svgHeight.value || 500
  const canvasEl = area.querySelector('canvas')
  if (!canvasEl) return
  const fc = canvasMgr.init(canvasEl, w, h, themeMode.value as 'light' | 'dark')

  fabric.loadSVGFromString(svg).then(({ objects }: any) => {
    try {
      const merged = mergeArrows(objects)
      const converted = merged.map(convertTextToTextbox)
      converted.forEach((obj: any) => { ensureObjectInteractive(obj); fc.add(obj) })
      fc.getObjects().forEach((o: any) => {
        if (o.excludeFromExport) return
        ensureObjectInteractive(o)
      })
      canvasMgr.zoomFit()
      historyMgr.save(fc, () => {}, () => {}); refreshLayerList()
    } catch (e) { console.error('[SvgEditor] SVG 加载失败:', e) }
    finally {
      mark('svg:load:end')
      measure('svg:load', 'svg:load:start', 'svg:load:end')
      loading.value = false
    }  })
  const keyboardHandlers = createKeyboardHandlers(
    {
      undo, redo,
      copy: copyObj, paste: pasteObj,
      save, selectAll,
      bold: toggleBold, italic: toggleItalic, underline: toggleUnderline,
      zoomIn: () => canvasMgr.zoomIn(), zoomOut: () => canvasMgr.zoomOut(), zoomFit: () => canvasMgr.zoomFit(),
      group: groupSelected, ungroup: ungroupSelected,
    },
    {
      onSpaceDown: () => { spacePressed.value = true; canvasMgr.setSpacePressed(true); fc.setCursor('grab') },
      onSpaceUp: () => { spacePressed.value = false; canvasMgr.setSpacePressed(false) },
      onEscape: () => { spacePressed.value = false; canvasMgr.setSpacePressed(false); emit('close') },
      onDelete: deleteObj,
      isEditableFocused: () => document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA',
    },
  )
  _keyHandlerFn = keyboardHandlers.onKeyDown
  _keyUpHandler = keyboardHandlers.onKeyUp
  document.addEventListener('keydown', _keyHandlerFn); document.addEventListener('keyup', _keyUpHandler)
}

onMounted(loadAndInit)
onMounted(() => { nextTick(() => { overlayRef.value?.focus() }) })
onMounted(() => {
  // dev-only：启动 FPS + longtask 监测，实时观察编辑器运行时的卡顿与掉帧
  _stopPerfMonitor = initPerfMonitor({
    onFps: (fps) => { (window as any).__perfFps = fps },
  })
})
onUnmounted(() => { _stopPerfMonitor?.() })
</script>

<template>
  <div class="editor-overlay" @click.self="emit('close')" @keydown.escape="emit('close')" tabindex="-1" ref="overlayRef">
    <div class="editor-app" :class="themeMode === 'light' ? 'theme-light' : 'theme-dark'">
      <!-- 顶栏 -->
      <EditorToolbar
        :src="props.src"
        :zoomLevel="zoomLevel"
        :svgWidth="svgWidth"
        :svgHeight="svgHeight"
        :selectionInfo="selectionInfo"
        :showThemeToggle="props.showThemeToggle"
        :themeMode="themeMode"
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
        @toggleTheme="toggleTheme"
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
          :themeMode="themeMode"
          @toggleCollapse="toggleLeftPanel"
          @addElement="addElement"
          @selectLayer="selectLayer"
          @toggleLayerVisibility="toggleLayerVisibility"
        />

        <!-- 中：画布 + 标尺 -->
        <EditorCanvas ref="canvasRef" :loading="loading" :zoomLevel="zoomLevel"
          :canvasWidth="svgWidth" :canvasHeight="svgHeight"
          :themeMode="themeMode" :viewportVersion="viewportVersion"
          @canvasWheel="(deltaY: number) => canvasMgr.injectWheel(deltaY)"
          @canvasAreaMouseEvent="(cx: number, cy: number, type: string) => canvasMgr.injectMouseEvent(cx, cy, type as 'mousedown' | 'mousemove' | 'mouseup')"
          @resizePreview="onResizePreview"
          @resizeCommit="onResizeCommit"
          @middlePan="(type: string, cx: number, cy: number) => canvasMgr.injectMiddlePan(type as 'mousedown' | 'mousemove' | 'mouseup', cx, cy)" />

        <!-- 右：属性面板 -->
        <EditorContextPanel
          :selectionInfo="selectionInfo"
          :hasTextInSelection="hasTextInSelection"
          :currentFill="currentFill"
          :currentStroke="currentStroke"
          :currentFontSize="currentFontSize"
          :currentFontWeight="currentFontWeight"
          :currentFontStyle="currentFontStyle"
          :currentUnderline="currentUnderline"
          :currentTextAlign="currentTextAlign"
          :currentTextFill="currentTextFill"
          :currentStrokeWidth="currentStrokeWidth"
          :currentStrokeDash="currentStrokeDash"
          :currentRotation="currentRotation"
          :currentOpacity="currentOpacity"
          :gradientType="gradientType"
          :gradientAngle="gradientAngle"
          :gradientColor1="gradientColor1"
          :gradientColor2="gradientColor2"
          :shadowEnabled="shadowEnabled"
          :shadowColor="shadowColor"
          :shadowBlur="shadowBlur"
          :shadowOffsetX="shadowOffsetX"
          :shadowOffsetY="shadowOffsetY"
          :themeMode="themeMode"
          :collapsed="panelCollapsed"
          @toggleCollapse="togglePanel"
          @align="align"
          @layerForward="withSave((fc:any)=>LayerPlugin.forward(fc))"
          @layerBackward="withSave((fc:any)=>LayerPlugin.backward(fc))"
          @layerToFront="withSave((fc:any)=>LayerPlugin.toFront(fc))"
          @layerToBack="withSave((fc:any)=>LayerPlugin.toBack(fc))"
          @distribute="(dir:string)=>withSave((fc:any)=>dir==='horizontal'?DistributePlugin.distributeHorizontal(fc):DistributePlugin.distributeVertical(fc))"
          @group="groupSelected"
          @ungroup="ungroupSelected"
          @fill="applyFill"
          @stroke="applyStroke"
          @strokeWidth="applyStrokeWidth"
          @strokeDash="toggleStrokeDash"
          @fontSize="applyFontSize"
          @bold="toggleBold"
          @italic="toggleItalic"
          @underline="toggleUnderline"
          @textAlign="(a:string)=>withSave((fc:any)=>{currentTextAlign=TextFormatPlugin.applyTextAlign(fc,a)})"
          @textFill="applyTextFill"
          @rotation="applyRotation"
          @opacity="applyOpacity"
          @gradientChange="applyGradientUI"
          @update:gradientType="gradientType=$event"
          @update:gradientAngle="gradientAngle=$event"
          @update:gradientColor1="gradientColor1=$event"
          @update:gradientColor2="gradientColor2=$event"
          @toggleShadow="toggleShadowUI"
          @applyShadow="applyShadowUI"
          @update:shadowColor="shadowColor=$event"
          @update:shadowBlur="shadowBlur=$event"
          @update:shadowOffsetX="shadowOffsetX=$event"
          @update:shadowOffsetY="shadowOffsetY=$event"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 全屏遮罩 ── */
.editor-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(12px) saturate(1.2);
  display: flex; align-items: center; justify-content: center;
  animation: overlayIn 0.15s ease;
}
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

/* ── 编辑器应用容器（铺满视口） ── */
.editor-app {
  width: 100vw; height: 100vh;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.editor-app.theme-dark  { background: #191919; }
.editor-app.theme-light { background: #f0f1f3; }

/* ── 主体：三栏弹性布局 ── */
.editor-body {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-height: 0;
}
</style>
