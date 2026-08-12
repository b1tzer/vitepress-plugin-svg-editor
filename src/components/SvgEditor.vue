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
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as fabric from 'fabric'
import EditorToolbar from './sub/EditorToolbar.vue'
import EditorCanvas from './sub/EditorCanvas.vue'
import EditorLeftPanel from './sub/EditorLeftPanel.vue'
import EditorContextPanel from './sub/EditorContextPanel.vue'
import { ICONS, LIGHT_TO_DARK, DARK_TO_LIGHT } from '../core/constants.ts'
import { preprocessSvg } from '../core/preprocessor.ts'
import { cleanFabricSvg, rgbToHex, hexToCssVars, restoreViewBox } from '../core/postprocessor.ts'
import { CanvasManager } from '../core/CanvasManager.ts'
import { HistoryManager } from '../core/HistoryManager.ts'
import { mergeArrows } from '../plugins/arrow-merger.ts'
import { VitePressSaveAdapter } from '../adapters/storage/VitePressSaveAdapter'
import * as AlignPlugin from '../plugins/align.ts'
import * as LayerPlugin from '../plugins/layer.ts'
import * as TextFormatPlugin from '../plugins/text-format.ts'
import * as DistributePlugin from '../plugins/distribute.ts'
import { applyGradient } from '../plugins/gradient.ts'
import { toggleShadow, applyShadow } from '../plugins/shadow.ts'

// ── 存储适配器 ──
const storageAdapter = new VitePressSaveAdapter()

const props = defineProps({
  src: { type: String, required: true },
  showThemeToggle: { type: Boolean, default: true },
})
const emit = defineEmits(['close', 'saved'])

// ── Vue 响应式状态 ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canvasRef = ref<any>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const saving = ref(false)
const zoomLevel = ref(100)
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
const canUndo = ref(false)
const canRedo = ref(false)
const panelCollapsed = ref(false)
const leftPanelCollapsed = ref(false)
function togglePanel() { panelCollapsed.value = !panelCollapsed.value }
function toggleLeftPanel() { leftPanelCollapsed.value = !leftPanelCollapsed.value }

// 显示尺寸 = 逻辑尺寸 × 当前缩放比（物理 resize 模型，无 Fabric viewport zoom）
const displayWidth = computed(() => Math.round(svgWidth.value * zoomLevel.value / 100))
const displayHeight = computed(() => Math.round(svgHeight.value * zoomLevel.value / 100))

// 画布对象列表（供图层面板使用）
const canvasObjects = ref<Array<{ id: string; type: string; name: string; visible: boolean }>>([])

// 核心管理器
const canvasMgr = new CanvasManager()
const historyMgr = new HistoryManager()
let _keyHandlerFn: any = null
let _keyUpHandler: any = null

canvasMgr.onZoomChange((z: number) => { zoomLevel.value = z })
canvasMgr.onSelectionChange(() => { updateSelectionInfo() })
canvasMgr.onModified(() => { historyMgr.save(canvasMgr.canvas!, () => {}, () => {}); refreshLayerList() })
historyMgr.onStateChange(() => { canUndo.value = historyMgr.canUndo(); canRedo.value = historyMgr.canRedo() })

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
  if (obj.type === 'text' || obj.type === 'textbox') {
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
  const isMulti = active.type === 'activeSelection'
  selectionInfo.value = isMulti ? `${(active as any)._objects.length} 个选中` : active.type

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
function undo() { historyMgr.undo(canvasMgr.canvas!, () => {}); refreshLayerList() }
function redo() { historyMgr.redo(canvasMgr.canvas!, () => {}); refreshLayerList() }
function copyObj() { const a = canvasMgr.canvas?.getActiveObject(); if (a) (a as any).clone((c: any) => { window._clipboard = c }) }
function pasteObj() { if (!window._clipboard) return; const fc = canvasMgr.canvas; window._clipboard.clone((c: any) => { c.set({ left: c.left + 20, top: c.top + 20 }); fc!.add(c); fc!.setActiveObject(c); fc!.renderAll(); withSave(() => {}) }) }
function deleteObj() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a) return; if (a.type === 'activeSelection') { (a as any).forEachObject((o: any) => fc!.remove(o)); fc!.discardActiveObject() } else fc!.remove(a); fc!.renderAll(); withSave(() => {}) }
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
function groupSelected() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a || a.type !== 'activeSelection') return; (a as any).toGroup(); fc!.renderAll(); withSave(() => {}) }
function ungroupSelected() { const fc = canvasMgr.canvas; const a = fc?.getActiveObject(); if (!a || a.type !== 'group') return; (a as any).toActiveSelection(); fc!.renderAll(); withSave(() => {}) }
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
  let obj: any = null
  switch (type) {
    case 'rect': obj = new fabric.Rect({ left: centerX - 40, top: centerY - 30, width: 80, height: 60, fill: '#3b82f6', stroke: '', strokeWidth: 0, rx: 4, ry: 4 }); break
    case 'circle': obj = new fabric.Circle({ left: centerX, top: centerY, radius: 35, fill: '#10b981', stroke: '', strokeWidth: 0 }); break
    case 'triangle': obj = new fabric.Triangle({ left: centerX, top: centerY - 30, width: 70, height: 60, fill: '#f59e0b', stroke: '', strokeWidth: 0 }); break
    case 'ellipse': obj = new fabric.Ellipse({ left: centerX, top: centerY, rx: 45, ry: 30, fill: '#8b5cf6', stroke: '', strokeWidth: 0 }); break
    case 'line': {
      const points = [centerX - 40, centerY, centerX + 40, centerY]
      obj = new fabric.Line(points, { stroke: '#ef4444', strokeWidth: 2 })
      break
    }
    case 'text': obj = new fabric.Text('文本', { left: centerX - 20, top: centerY - 10, fontSize: 24, fill: '#000', fontFamily: 'sans-serif' }); break
    case 'textbox': obj = new fabric.Textbox('文本框', { left: centerX - 40, top: centerY - 15, width: 120, fontSize: 16, fill: '#000', fontFamily: 'sans-serif' }); break
  }
  if (obj) {
    ensureInteractive(obj)
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
  fc.set('backgroundColor', to === 'dark' ? '#1a1a1a' : '#ffffff')
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
    let svgText = fc.toSVG()
    svgText = cleanFabricSvg(svgText); svgText = rgbToHex(svgText)
    svgText = restoreViewBox(svgText, originalViewBox.value); svgText = hexToCssVars(svgText)
    const result = await storageAdapter.save(svgText, props.src)
    if (result.success) { emit('saved'); emit('close') }
    else { alert('保存失败: ' + result.error) }
  } catch (e: any) { alert('保存失败: ' + e.message) }
  finally { if (wasDark) toggleTheme(); saving.value = false }
}

// ── 画布 resize ──
function onResizeCanvas(w: number, h: number, dir: string) {
  // 手柄拖拽产出的是显示像素（display px），需换算为逻辑尺寸
  const newLogicalW = Math.round(w * 100 / zoomLevel.value)
  const newLogicalH = Math.round(h * 100 / zoomLevel.value)
  // 计算本次尺寸变化（逻辑坐标）
  const dw = newLogicalW - svgWidth.value
  const dh = newLogicalH - svgHeight.value
  svgWidth.value = newLogicalW
  svgHeight.value = newLogicalH
  canvasMgr.setLogicalSize(svgWidth.value, svgHeight.value)
  // 北边/西边 resize：平移所有元素，保持与对边（底边/右边）相对位置不变
  if (dir.includes('w')) canvasMgr.translateAllObjects(dw, 0)
  if (dir.includes('n')) canvasMgr.translateAllObjects(0, dh)
}

// ── 主加载流程 ──
async function loadAndInit() {
  loading.value = true
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
  const { svg, originalViewBox: vb, svgWidth: sw, svgHeight: sh } = preprocessSvg(svgText, themeMode.value)
  if (vb) originalViewBox.value = vb
  if (sw > 0) svgWidth.value = sw; else svgWidth.value = 800
  if (sh > 0) svgHeight.value = sh; else svgHeight.value = 500
  const area = canvasRef.value?.canvasAreaRef
  if (!area) return
  await new Promise(r => requestAnimationFrame(r))
  await new Promise(r => requestAnimationFrame(r))
  // 使用 SVG 实际尺寸初始化画布（而非容器尺寸）
  const w = svgWidth.value || 800
  const h = svgHeight.value || 500
  const canvasEl = area.querySelector('canvas')
  if (!canvasEl) return
  const fc = canvasMgr.init(canvasEl, w, h)

  fabric.loadSVGFromString(svg).then(({ objects }: any) => {
    try {
      const merged = mergeArrows(objects)
      const converted = merged.map(convertToTextbox)
      converted.forEach((obj: any) => { ensureInteractive(obj); fc.add(obj) })
      fc.getObjects().forEach((o: any) => { o.set({ selectable: true, evented: true }); if (o._objects) o._objects.forEach((c: any) => c.set({ selectable: true, evented: true })) })
      canvasMgr.zoomFit()
      // 通过滚动容器居中画布内容（而非 viewportTransform 平移），确保编辑器坐标 = 导出坐标
      nextTick(() => {
        const s = canvasRef.value?.scrollRef
        if (s && s.scrollWidth > s.clientWidth) s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2
        if (s && s.scrollHeight > s.clientHeight) s.scrollTop = (s.scrollHeight - s.clientHeight) / 2
      })
      historyMgr.save(fc, () => {}, () => {}); refreshLayerList()
    } catch (e) { console.error('[SvgEditor] SVG 加载失败:', e) }
    finally { loading.value = false }
  })
  _keyHandlerFn = (e: KeyboardEvent) => {
    if (e.key === ' ' && !e.repeat) { e.preventDefault(); spacePressed.value = true; canvasMgr.setSpacePressed(true); fc.setCursor('grab'); return }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
      if (e.key === 'y') { e.preventDefault(); redo() }
      if (e.key === 'c') { e.preventDefault(); copyObj() }
      if (e.key === 'v') { e.preventDefault(); pasteObj() }
      if (e.key === 's') { e.preventDefault(); save() }
      if (e.key === 'b') { e.preventDefault(); toggleBold() }
      if (e.key === 'i') { e.preventDefault(); toggleItalic() }
      if (e.key === 'u') { e.preventDefault(); toggleUnderline() }
      if (e.key === '=' || e.key === '+') { e.preventDefault(); canvasMgr.zoomIn() }
      if (e.key === '-') { e.preventDefault(); canvasMgr.zoomOut() }
      if (e.key === '0') { e.preventDefault(); canvasMgr.zoomFit() }
      if (e.key === 'g' && !e.shiftKey) { e.preventDefault(); groupSelected() }
      if (e.key === 'g' && e.shiftKey) { e.preventDefault(); ungroupSelected() }
    }
    if (e.key === 'Delete' || e.key === 'Backspace') { if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { e.preventDefault(); deleteObj() } }
    if (e.key === 'Escape') { spacePressed.value = false; canvasMgr.setSpacePressed(false); emit('close') }
  }
  _keyUpHandler = (e: KeyboardEvent) => { if (e.key === ' ') { spacePressed.value = false; canvasMgr.setSpacePressed(false) } }
  document.addEventListener('keydown', _keyHandlerFn); document.addEventListener('keyup', _keyUpHandler)
}

function convertToTextbox(obj: any): any {
  if (!obj) return obj
  if (obj.type === 'text') { try { return new fabric.Textbox(obj.text || '', { left: obj.left||0, top: obj.top||0, width: Math.max((obj.width||80)+20,40), fontSize: obj.fontSize||12, fontFamily: obj.fontFamily||'sans-serif', fontWeight: obj.fontWeight||'normal', fontStyle: obj.fontStyle||'normal', fill: obj.fill||'#000', stroke: obj.stroke||'', strokeWidth: obj.strokeWidth||0, textAlign: obj.textAlign||'left', lineHeight: obj.lineHeight||1.16, charSpacing: obj.charSpacing||0, opacity: obj.opacity??1, angle: obj.angle||0, originX: obj.originX||'left', originY: obj.originY||'top', selectable: true, evented: true, editable: true, splitByGrapheme: true }) } catch (e) { return obj } }
  if (obj._objects) obj._objects = obj._objects.map(convertToTextbox)
  return obj
}
function ensureInteractive(o: any): void { o.set({ selectable: true, evented: true, perPixelTargetFind: false }); if (!o.fill || o.fill === 'none' || o.fill === 'transparent') { if (o.type === 'rect' || o.type === 'path' || o.type === 'polygon' || o.type === 'circle' || o.type === 'ellipse') o.set({ fill: 'rgba(0,0,0,0.001)' }) }; if (o._objects) o._objects.forEach(ensureInteractive) }

onMounted(loadAndInit)
onMounted(() => { nextTick(() => { overlayRef.value?.focus() }) })
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
          :canvasWidth="displayWidth" :canvasHeight="displayHeight"
          @resize="onResizeCanvas"
          @canvasWheel="(deltaY: number) => canvasMgr.injectWheel(deltaY)"
          @canvasAreaMouseEvent="(cx: number, cy: number, type: string) => canvasMgr.injectMouseEvent(cx, cy, type as 'mousedown' | 'mousemove' | 'mouseup')" />

        <!-- 右：属性面板 -->
        <EditorContextPanel
          :selectionInfo="selectionInfo"
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
