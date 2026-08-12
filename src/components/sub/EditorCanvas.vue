<script setup lang="ts">
/**
 * 编辑器画布子组件
 *
 * 布局（从外到内）：
 *   .editor-canvas（棋盘格背景 + overflow:hidden）
 *   ├── .ruler-canvas（固定标尺层，pointer-events:none，z-index:10）
 *   ├── .canvas-scroll（grid-template-areas:"stack" 可滚动容器）
 *   │   ├── .canvas-area（grid-area:stack，仅含 Fabric 画布）
 *   │   │   └── canvas.fabric-canvas（Fabric.js 接管）
 *   │   └── .resize-handles-overlay（grid-area:stack 同层叠加，CSS Grid 保证对齐）
 *   │       └── .rh-*（8 边 resize 手柄，尺寸固定不受缩放影响）
 *   └── .loading（加载遮罩）
 *
 * 关键设计：两个 grid item 共享同一 grid-area，
 * 拥有相同的 width/height、margin、place-self，
 * CSS Grid 自动将它们像素级叠加 —— 零 JS 坐标计算。
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
  (e: 'resize', w: number, h: number, dir: string): void
  (e: 'scroll', scrollLeft: number, scrollTop: number): void
  (e: 'canvasWheel', deltaY: number): void
  (e: 'canvasAreaMouseEvent', clientX: number, clientY: number, type: 'mousedown' | 'mousemove' | 'mouseup'): void
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const scrollRef = ref<HTMLDivElement | null>(null)
const canvasAreaRef = ref<HTMLDivElement | null>(null)
const rulerCanvasRef = ref<HTMLCanvasElement | null>(null)
const RULER = 24

let _ro: ResizeObserver | null = null
let _af: number | null = null
let _zw: ReturnType<typeof watch> | null = null
let _lastRulerKey = '' // P3: 缓存标尺参数，不变则跳过重绘

const resizing = ref(false)
const resizeDir = ref('')
const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0 })

defineExpose({ canvasAreaRef, scrollRef })

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

  // P3: step、尺寸、主题不变 → 无刻度变化，跳过重绘
  const key = `${step}_${w}_${h}_${light}`
  if (key === _lastRulerKey) return
  _lastRulerKey = key

  // 水平标尺（含坐标数字）
  ctx.strokeStyle = tColor; ctx.fillStyle = fColor
  ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
  for (let x = RULER; x < w; x += step * z) {
    const v = Math.round((x - RULER) / z)
    if (v % (step * 5) === 0) {
      ctx.beginPath(); ctx.moveTo(x, RULER); ctx.lineTo(x, RULER - 10); ctx.stroke()
      ctx.fillText(String(v), x, RULER - 3)
    } else { ctx.beginPath(); ctx.moveTo(x, RULER); ctx.lineTo(x, RULER - 5); ctx.stroke() }
  }

  // 垂直标尺
  ctx.textBaseline = 'middle'; ctx.textAlign = 'right'
  for (let y = RULER; y < h; y += step * z) {
    const v = Math.round((y - RULER) / z)
    if (v % (step * 5) === 0) {
      ctx.beginPath(); ctx.moveTo(RULER, y); ctx.lineTo(RULER - 10, y); ctx.stroke()
      ctx.fillText(String(v), RULER - 3, y)
    } else { ctx.beginPath(); ctx.moveTo(RULER, y); ctx.lineTo(RULER - 5, y); ctx.stroke() }
  }

  // 角标
  ctx.fillStyle = light ? '#e8eaed' : '#2a2a2a'
  ctx.fillRect(0, 0, RULER, RULER)
  ctx.strokeStyle = light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.06)'
  ctx.strokeRect(0, 0, RULER, RULER)
  ctx.beginPath(); ctx.moveTo(RULER, RULER); ctx.lineTo(w, RULER); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(RULER, RULER); ctx.lineTo(RULER, h); ctx.stroke()
}

// resize 拖拽
function onResizeDown(e: MouseEvent, dir: string) {
  e.preventDefault(); e.stopPropagation()
  resizing.value = true; resizeDir.value = dir
  resizeStart.value = { x: e.clientX, y: e.clientY, w: props.canvasWidth, h: props.canvasHeight }
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeUp)
}
function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  const dx = e.clientX - resizeStart.value.x, dy = e.clientY - resizeStart.value.y
  let nw = resizeStart.value.w, nh = resizeStart.value.h
  if (resizeDir.value.includes('e')) nw = Math.max(50, resizeStart.value.w + dx)
  if (resizeDir.value.includes('w')) nw = Math.max(50, resizeStart.value.w - dx)
  if (resizeDir.value.includes('s')) nh = Math.max(50, resizeStart.value.h + dy)
  if (resizeDir.value.includes('n')) nh = Math.max(50, resizeStart.value.h - dy)
  emit('resize', Math.round(nw), Math.round(nh), resizeDir.value)
}
function onResizeUp() { resizing.value = false; document.removeEventListener('mousemove', onResizeMove); document.removeEventListener('mouseup', onResizeUp) }

// ── 画布区域外滚轮/框选事件代理 ──
let _injectDragging = false // 是否正在注入框选拖拽

/** 滚轮缩放：来自 canvas-scroll 容器，转发到父组件处理 */
function onCanvasWheel(e: WheelEvent) {
  e.preventDefault()
  emit('canvasWheel', e.deltaY)
}

/** 画布外 mousedown → 开始注入框选事件链 */
function onCanvasMouseDown(e: MouseEvent) {
  // 中键拖拽平移容器（保留原有行为）
  onScrollMouseDown(e)
  if (e.button !== 0) return
  // 如果点击的是 Fabric canvas 自身或其 resize 手柄子元素，不干预
  const target = e.target as HTMLElement
  if (!target) return
  if (target.tagName === 'CANVAS' || target.classList.contains('fabric-canvas')) return
  if (target.classList.contains('rh')) return
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

// 中键拖拽平移滚动容器
function onScrollMouseDown(e: MouseEvent) {
  if (e.button !== 1) return
  e.preventDefault()
  const s = scrollRef.value; if (!s) return
  const sx = e.clientX, sy = e.clientY, ox = s.scrollLeft, oy = s.scrollTop
  const mm = (ev: MouseEvent) => { s.scrollLeft = ox + sx - ev.clientX; s.scrollTop = oy + sy - ev.clientY }
  const mu = () => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu) }
  document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu)
}

onMounted(() => {
  _ro = new ResizeObserver(() => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  if (containerRef.value) _ro.observe(containerRef.value)
  _zw = watch(() => props.zoomLevel, () => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  watch(() => props.themeMode, () => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  nextTick(() => { if (_af) cancelAnimationFrame(_af); _af = requestAnimationFrame(drawRuler) })
  document.addEventListener('contextmenu', (e) => { if (resizing.value) e.preventDefault() })
})
onUnmounted(() => { _ro?.disconnect(); if (_af) cancelAnimationFrame(_af); _zw?.() })
</script>

<template>
  <div class="editor-canvas" :class="'theme-' + themeMode" ref="containerRef">
    <canvas ref="rulerCanvasRef" class="ruler-canvas" />
    <div class="canvas-scroll" ref="scrollRef"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown"
      @scroll="emit('scroll', ($event.target as HTMLElement).scrollLeft, ($event.target as HTMLElement).scrollTop)">
      <div class="canvas-area" ref="canvasAreaRef"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
        <canvas class="fabric-canvas" />
      </div>
      <!-- resize 手柄层：同一 grid-area 自然叠加于 canvas-area 上方，尺寸/位置完全由 CSS Grid 驱动 -->
      <div class="resize-handles-overlay"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
        <div class="rh rh-n" @mousedown="onResizeDown($event,'n')" title="向上拖拽调整高度" />
        <div class="rh rh-s" @mousedown="onResizeDown($event,'s')" title="向下拖拽调整高度" />
        <div class="rh rh-w" @mousedown="onResizeDown($event,'w')" title="向左拖拽调整宽度" />
        <div class="rh rh-e" @mousedown="onResizeDown($event,'e')" title="向右拖拽调整宽度" />
        <div class="rh rh-nw" @mousedown="onResizeDown($event,'nw')" title="拖拽调整宽高" />
        <div class="rh rh-ne" @mousedown="onResizeDown($event,'ne')" title="拖拽调整宽高" />
        <div class="rh rh-sw" @mousedown="onResizeDown($event,'sw')" title="拖拽调整宽高" />
        <div class="rh rh-se" @mousedown="onResizeDown($event,'se')" title="拖拽调整宽高" />
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
  background-color:#e8e8e8;
  background-image:linear-gradient(45deg,#d4d4d4 25%,transparent 25%),linear-gradient(-45deg,#d4d4d4 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d4d4d4 75%),linear-gradient(-45deg,transparent 75%,#d4d4d4 75%);
  background-size:20px 20px; background-position:0 0,0 10px,10px -10px,-10px 0; }
.editor-canvas.theme-dark {
  background-color:#1a1a1a;
  background-image:linear-gradient(45deg,#2a2a2a 25%,transparent 25%),linear-gradient(-45deg,#2a2a2a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2a2a 75%),linear-gradient(-45deg,transparent 75%,#2a2a2a 75%); }
.ruler-canvas { pointer-events:none; position:absolute; top:0; left:0; z-index:10; }

/* 滚动容器：左/上偏移 = 标尺宽度；grid-template-areas 让 canvas-area 和手柄层自动叠加 */
.canvas-scroll {
  position:absolute; top:24px; left:24px; right:0; bottom:0;
  overflow:auto;
  display:grid;
  grid-template-areas: "stack";
}

/* 画布区域：grid-area:stack 确保与手柄层共享同一格位 */
.canvas-area {
  grid-area: stack;
  position:relative; margin:48px;
  outline:1px solid rgba(128,128,128,.25);
  place-self:center;
}

/* 手柄层：同一 grid-area，同尺寸同 margin，CSS Grid 保证像素级对齐，零 JS 参与 */
.resize-handles-overlay {
  grid-area: stack;
  position:relative;
  margin:48px;
  place-self:center;
  z-index:20;
  pointer-events:none;
}

/* resize 手柄：灰色小长条，尺寸固定不受缩放影响 */
.rh { position:absolute; z-index:20; background:rgba(128,128,128,.12); transition:background .15s; pointer-events:auto; }
.rh:hover { background:rgba(59,130,246,.35); }
/* 四边手柄 */
.rh-n, .rh-s { left:4px; right:4px; height:6px; cursor:ns-resize; border-radius:3px; }
.rh-w, .rh-e { top:4px; bottom:4px; width:6px; cursor:ew-resize; border-radius:3px; }
.rh-n { top:-3px; } .rh-s { bottom:-3px; } .rh-w { left:-3px; } .rh-e { right:-3px; }
/* 四角手柄 */
.rh-nw,.rh-ne,.rh-sw,.rh-se { width:8px; height:8px; background:rgba(128,128,128,.25); border:1px solid rgba(128,128,128,.3); border-radius:2px; }
.rh-nw { top:-4px; left:-4px; cursor:nwse-resize; }
.rh-ne { top:-4px; right:-4px; cursor:nesw-resize; }
.rh-sw { bottom:-4px; left:-4px; cursor:nesw-resize; }
.rh-se { bottom:-4px; right:-4px; cursor:nwse-resize; }
.rh-nw:hover,.rh-ne:hover,.rh-sw:hover,.rh-se:hover { background:rgba(59,130,246,.4); border-color:rgba(59,130,246,.6); }

/* 加载态 */
.loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:rgba(17,17,17,.85); color:#666; font-size:14px; z-index:30; pointer-events:none; }
.loading-spinner { width:28px; height:28px; border:3px solid rgba(255,255,255,.1); border-top-color:#3b82f6; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
