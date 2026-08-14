<script setup lang="ts">
/**
 * 编辑器画布子组件 — 逻辑画布（workspace Rect）方案 C
 *
 * 布局：
 *   .editor-canvas（棋盘格背景 + overflow:hidden）
 *   ├── .ruler-canvas（固定标尺层，pointer-events:none，z-index:10）
 *   ├── .canvas-scroll（fill 容器，overflow:hidden）
 *   │   └── canvas.fabric-canvas（Fabric.js 接管，尺寸 = viewport 容器尺寸）
 *   └── .loading（加载遮罩）
 *
 * 关键设计：
 *   - canvas 物理尺寸 = viewport 容器尺寸（自适应），由 CanvasManager.init 管控
 *   - workspace Rect（Fabric 内部对象）提供边界线、背景色和 clipPath 裁剪
 *   - DOM 层只负责容器布局和标尺绘制，画布内容/边界全由 Fabric 渲染管线处理
 */

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  loading: boolean
  zoomLevel: number
  canvasWidth: number
  canvasHeight: number
  themeMode: string
}>(), {
  canvasWidth: 800,
  canvasHeight: 600,
  themeMode: 'light',
})

const emit = defineEmits<{
  (e: 'canvasWheel', deltaY: number): void
  (e: 'canvasAreaMouseEvent', clientX: number, clientY: number, type: 'mousedown' | 'mousemove' | 'mouseup'): void
  (e: 'resizePreview', w: number, h: number): void
  (e: 'resizeCommit', w: number, h: number): void
  (e: 'middlePan', type: 'mousedown' | 'mousemove' | 'mouseup', clientX: number, clientY: number): void
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const scrollRef = ref<HTMLDivElement | null>(null)
const canvasAreaRef = ref<HTMLDivElement | null>(null)
const rulerCanvasRef = ref<HTMLCanvasElement | null>(null)
const RULER = 24

let _ro: ResizeObserver | null = null
let _af: number | null = null
let _zw: ReturnType<typeof watch> | null = null
let _lastRulerKey = ''

defineExpose({ canvasAreaRef, scrollRef })

// ── 画布尺寸调整手柄（DOM 层，非 Fabric 对象，避免与背景可交互语义冲突）──
// 手柄锚定 workspace 左上角 (0,0)，仅调整宽高，不移动内容。
// 提供三个手柄：右边缘中点（调宽）、下边缘中点（调高）、右下角（同时调宽高）。
const MIN_SIZE = 10
/** 手柄与画布边缘的间距（px），让手柄悬浮在边界外侧，避免紧贴边界造成误操作 */
const HANDLE_GAP = 8
/** 右侧手柄：垂直灰条 */
const BAR_R_W = 8
const BAR_R_H = 48
/** 底部手柄：水平灰条 */
const BAR_B_W = 48
const BAR_B_H = 8
/** 右下角手柄：L 形拐角（SVG 绘制，外接盒子尺寸；臂厚 = stroke-width 8，与长条一致） */
const CORNER_SIZE = 32
/** L 形描边内边缘到 viewBox 左/上边缘的距离（描边中心在 viewBox x/y=28，半宽 4 → 内边缘 24） */
const CORNER_INSET = 24

type HandleKey = 'r' | 'b' | 'br'
interface ResizeHandle { key: HandleKey; left: number; top: number; width: number; height: number; cursor: string }

const handles = ref<ResizeHandle[]>([])
let _rafId: number | null = null
let _draggingHandle: HandleKey | null = null
/** 上次手柄位置签名：viewportTransform 或画布尺寸未变化时跳过 DOM 更新，避免每帧无效的响应式/reflow */
let _lastHandleKey = ''

function clampSize(v: number): number {
  return Math.max(MIN_SIZE, Math.round(v))
}

/** 读取 Fabric 画布实例（CanvasManager 初始化时挂载到 window） */
function getFabricCanvas(): any {
  return (window as any).__fabricCanvas || null
}

/** 根据 viewportTransform 投影 workspace 三个手柄的屏幕坐标（相对 fabric canvas 左上角） */
function updateHandles() {
  const fc = getFabricCanvas()
  if (!fc) {
    if (handles.value.length) handles.value = []
    _lastHandleKey = ''
    return
  }
  const vt = fc.viewportTransform
  if (!vt || vt.length < 6) {
    if (handles.value.length) handles.value = []
    _lastHandleKey = ''
    return
  }
  const z = vt[0], tx = vt[4], ty = vt[5]
  const w = props.canvasWidth, h = props.canvasHeight
  // 去重：拖拽元素移动时 viewportTransform 不变，此时无需更新手柄 DOM；
  // 仅在缩放/平移（z/tx/ty 变化）或画布尺寸变化时，才触发 Vue 响应式 + DOM 写入，
  // 从而避免每帧无效 reflow 与 Fabric 的 canvas 渲染抢主线程。
  const key = `${Math.round(z * 100)},${Math.round(tx * 100)},${Math.round(ty * 100)},${w},${h}`
  if (key === _lastHandleKey) return
  _lastHandleKey = key

  // 手柄内边缘（靠近画布的一侧）统一距画布边界 HANDLE_GAP，
  // 让手柄整体悬浮在边界外侧，与画布之间保留真实空隙，避免误操作。
  const canvasRight = w * z + tx   // 画布右边界屏幕坐标
  const canvasBottom = h * z + ty  // 画布底边界屏幕坐标
  const gap = HANDLE_GAP

  handles.value = [
    { key: 'r',  left: canvasRight + gap, top: (h / 2) * z + ty - BAR_R_H / 2, width: BAR_R_W, height: BAR_R_H, cursor: 'ew-resize' },
    { key: 'b',  left: (w / 2) * z + tx - BAR_B_W / 2, top: canvasBottom + gap, width: BAR_B_W, height: BAR_B_H, cursor: 'ns-resize' },
    { key: 'br', left: canvasRight + gap - CORNER_INSET, top: canvasBottom + gap - CORNER_INSET, width: CORNER_SIZE, height: CORNER_SIZE, cursor: 'nwse-resize' },
  ]
}

/** 将鼠标 client 坐标换算为新的逻辑画布尺寸（相对 .canvas-area 左上角） */
function computeSize(e: MouseEvent): { w: number; h: number } | null {
  if (!_draggingHandle) return null
  const fc = getFabricCanvas()
  const area = canvasAreaRef.value
  if (!fc || !area) return null
  const vt = fc.viewportTransform
  if (!vt || vt.length < 6) return null
  const z = vt[0], tx = vt[4], ty = vt[5]
  const rect = area.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  const lx = (sx - tx) / z
  const ly = (sy - ty) / z
  let w = props.canvasWidth
  let h = props.canvasHeight
  if (_draggingHandle === 'r') w = clampSize(lx)
  else if (_draggingHandle === 'b') h = clampSize(ly)
  else if (_draggingHandle === 'br') { w = clampSize(lx); h = clampSize(ly) }
  return { w, h }
}

function onHandleMouseDown(key: HandleKey, e: MouseEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  _draggingHandle = key
  document.addEventListener('mousemove', onHandleMouseMove)
  document.addEventListener('mouseup', onHandleMouseUp)
}

function onHandleMouseMove(e: MouseEvent) {
  if (!_draggingHandle) return
  const size = computeSize(e)
  if (size) emit('resizePreview', size.w, size.h)
}

function onHandleMouseUp(e: MouseEvent) {
  if (!_draggingHandle) return
  const size = computeSize(e)
  _draggingHandle = null
  document.removeEventListener('mousemove', onHandleMouseMove)
  document.removeEventListener('mouseup', onHandleMouseUp)
  if (size) emit('resizeCommit', size.w, size.h)
}

/** rAF 循环持续同步手柄位置（覆盖缩放、平移、尺寸变化等所有 viewportTransform 变更） */
function startHandleLoop() {
  if (_rafId !== null) return
  const tick = () => {
    updateHandles()
    _rafId = requestAnimationFrame(tick)
  }
  _rafId = requestAnimationFrame(tick)
}

function stopHandleLoop() {
  if (_rafId !== null) { cancelAnimationFrame(_rafId); _rafId = null }
}

function drawRuler() {
  const cvs = rulerCanvasRef.value
  const container = containerRef.value
  if (!cvs || !container) return
  const dpr = window.devicePixelRatio || 1
  const w = container.clientWidth, h = container.clientHeight
  cvs.width = w * dpr; cvs.height = h * dpr
  cvs.style.width = w + 'px'; cvs.style.height = h + 'px'
  const ctx = cvs.getContext('2d'); if (!ctx) return
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h)

  const z = props.zoomLevel / 100
  const light = props.themeMode !== 'dark'
  const bg = light ? '#f0f1f3' : '#1e1e1e'
  const tColor = light ? '#bbb' : '#555'
  const fColor = light ? '#888' : '#777'

  ctx.fillStyle = bg
  ctx.fillRect(RULER, 0, w - RULER, RULER)
  ctx.fillRect(0, RULER, RULER, h - RULER)

  let step = 10
  for (const s of [1,2,5,10,20,50,100,200,500,1000]) { if (s * z >= 30) { step = s; break } }

  const key = `${step}_${w}_${h}_${light}`
  if (key === _lastRulerKey) return
  _lastRulerKey = key

  ctx.strokeStyle = tColor; ctx.fillStyle = fColor
  ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
  for (let x = RULER; x < w; x += step * z) {
    const v = Math.round((x - RULER) / z)
    if (v % (step * 5) === 0) {
      ctx.beginPath(); ctx.moveTo(x, RULER); ctx.lineTo(x, RULER - 10); ctx.stroke()
      ctx.fillText(String(v), x, RULER - 3)
    } else { ctx.beginPath(); ctx.moveTo(x, RULER); ctx.lineTo(x, RULER - 5); ctx.stroke() }
  }

  ctx.textBaseline = 'middle'; ctx.textAlign = 'right'
  for (let y = RULER; y < h; y += step * z) {
    const v = Math.round((y - RULER) / z)
    if (v % (step * 5) === 0) {
      ctx.beginPath(); ctx.moveTo(RULER, y); ctx.lineTo(RULER - 10, y); ctx.stroke()
      ctx.fillText(String(v), RULER - 3, y)
    } else { ctx.beginPath(); ctx.moveTo(RULER, y); ctx.lineTo(RULER - 5, y); ctx.stroke() }
  }

  ctx.fillStyle = light ? '#e8eaed' : '#2a2a2a'
  ctx.fillRect(0, 0, RULER, RULER)
  ctx.strokeStyle = light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.06)'
  ctx.strokeRect(0, 0, RULER, RULER)
  ctx.beginPath(); ctx.moveTo(RULER, RULER); ctx.lineTo(w, RULER); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(RULER, RULER); ctx.lineTo(RULER, h); ctx.stroke()
}

// ── 画布区域外滚轮/框选事件代理 ──
let _injectDragging = false

function onCanvasWheel(e: WheelEvent) {
  e.preventDefault()
  emit('canvasWheel', e.deltaY)
}

// ── 鼠标中键平移（Fabric 不响应中键 mouse:down，需在 DOM 层拦截）──
let _middlePanning = false

function onMiddlePanMouseMove(e: MouseEvent) {
  if (!_middlePanning) return
  emit('middlePan', 'mousemove', e.clientX, e.clientY)
}
function onMiddlePanMouseUp(e: MouseEvent) {
  if (!_middlePanning) return
  _middlePanning = false
  emit('middlePan', 'mouseup', e.clientX, e.clientY)
  document.removeEventListener('mousemove', onMiddlePanMouseMove)
  document.removeEventListener('mouseup', onMiddlePanMouseUp)
}

function onCanvasMouseDown(e: MouseEvent) {
  // 中键：进入平移（行业通识）
  if (e.button === 1) {
    e.preventDefault()
    e.stopPropagation()
    _middlePanning = true
    emit('middlePan', 'mousedown', e.clientX, e.clientY)
    document.addEventListener('mousemove', onMiddlePanMouseMove)
    document.addEventListener('mouseup', onMiddlePanMouseUp)
    return
  }
  if (e.button !== 0) return
  const target = e.target as HTMLElement
  if (!target) return
  if (target.tagName === 'CANVAS') return
  e.preventDefault()
  _injectDragging = true
  emit('canvasAreaMouseEvent', e.clientX, e.clientY, 'mousedown')
  document.addEventListener('mousemove', onCanvasOutsideMouseMove)
  document.addEventListener('mouseup', onCanvasOutsideMouseUp)
}
function onCanvasOutsideMouseMove(e: MouseEvent) {
  if (!_injectDragging) return
  emit('canvasAreaMouseEvent', e.clientX, e.clientY, 'mousemove')
}
function onCanvasOutsideMouseUp(e: MouseEvent) {
  if (!_injectDragging) return
  _injectDragging = false
  emit('canvasAreaMouseEvent', e.clientX, e.clientY, 'mouseup')
  document.removeEventListener('mousemove', onCanvasOutsideMouseMove)
  document.removeEventListener('mouseup', onCanvasOutsideMouseUp)
}

onMounted(() => {
  _ro = new ResizeObserver(() => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  if (containerRef.value) _ro.observe(containerRef.value)
  _zw = watch(() => props.zoomLevel, () => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  watch(() => props.themeMode, () => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  nextTick(() => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  startHandleLoop()
})
onUnmounted(() => { _ro?.disconnect(); if (_af) cancelAnimationFrame(_af); _zw?.(); stopHandleLoop() })
</script>

<template>
  <div class="editor-canvas" :class="'theme-' + themeMode" ref="containerRef">
    <canvas ref="rulerCanvasRef" class="ruler-canvas" />
    <div class="canvas-scroll" ref="scrollRef"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown">
      <div class="canvas-area" ref="canvasAreaRef">
        <canvas class="fabric-canvas" />
        <template v-for="handle in handles" :key="handle.key">
          <div
            class="resize-handle"
            :class="'handle-' + handle.key"
            :style="{ left: handle.left + 'px', top: handle.top + 'px', width: handle.width + 'px', height: handle.height + 'px', cursor: handle.cursor }"
            @mousedown="onHandleMouseDown(handle.key, $event)"
          >
            <svg v-if="handle.key === 'br'" viewBox="0 0 32 32" class="corner-shape" aria-hidden="true">
              <path d="M 28 6 L 28 28 L 6 28" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </template>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <div class="loading-spinner" />
      <span>加载中...</span>
    </div>
  </div>
</template>

<style scoped>
.editor-canvas { flex:1; position:relative; overflow:hidden;
  /* 棋盘格方格大小（px），修改此变量即可整体调整方格尺寸（明暗主题共用） */
  --grid-size: 35px;
  background-color:#e8e8e8;
  background-image:linear-gradient(45deg,#d4d4d4 25%,transparent 25%),linear-gradient(-45deg,#d4d4d4 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d4d4d4 75%),linear-gradient(-45deg,transparent 75%,#d4d4d4 75%);
  background-size:var(--grid-size) var(--grid-size); background-position:0 0,0 calc(var(--grid-size) / 2),calc(var(--grid-size) / 2) calc(var(--grid-size) / -2),calc(var(--grid-size) / -2) 0; }
.editor-canvas.theme-dark {
  background-color:#1a1a1a;
  background-image:linear-gradient(45deg,#2a2a2a 25%,transparent 25%),linear-gradient(-45deg,#2a2a2a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2a2a 75%),linear-gradient(-45deg,transparent 75%,#2a2a2a 75%);
  background-size:var(--grid-size) var(--grid-size); background-position:0 0,0 calc(var(--grid-size) / 2),calc(var(--grid-size) / 2) calc(var(--grid-size) / -2),calc(var(--grid-size) / -2) 0; }
.ruler-canvas { pointer-events:none; position:absolute; top:0; left:0; z-index:10; }

/* canvas 填满整个视口容器（左/上偏移 24px = 标尺区域），由 CanvasManager 设置 Fabric canvas 尺寸 */
.canvas-scroll {
  position:absolute; top:24px; left:24px; right:0; bottom:0;
  overflow:hidden;
}
.canvas-area { width:100%; height:100%; position:relative; }
.fabric-canvas { display:block; }

/* 画布尺寸调整手柄（DOM 层）— 带透明度的灰色小条（无描边，边缘颜色与填充一致） */
.resize-handle {
  position: absolute;
  box-sizing: border-box;
  z-index: 20;
  transition: background 0.15s ease, color 0.15s ease;
}

/* 右侧/底部长条：半透明灰色圆角条 */
.handle-r,
.handle-b {
  background: rgba(128, 128, 128, 0.45);
  border-radius: 4px;
}
/* 右下角 L 形拐角：SVG 用 currentColor 继承文字颜色 */
.handle-br { color: rgba(128, 128, 128, 0.45); }
.handle-br .corner-shape { display: block; width: 100%; height: 100%; }

/* hover：颜色与 SVG 元素激活（选中）边框色 #0078d4 一致，去掉放大效果 */
.handle-r:hover,
.handle-b:hover { background: #0078d4; }
.handle-br:hover { color: #0078d4; }

.editor-canvas.theme-dark .handle-r,
.editor-canvas.theme-dark .handle-b { background: rgba(180, 180, 180, 0.4); }
.editor-canvas.theme-dark .handle-br { color: rgba(180, 180, 180, 0.4); }

/* 加载态 */
.loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:rgba(17,17,17,.85); color:#666; font-size:14px; z-index:30; pointer-events:none; }
.loading-spinner { width:28px; height:28px; border:3px solid rgba(255,255,255,.1); border-top-color:#3b82f6; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
