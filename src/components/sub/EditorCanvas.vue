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

function onCanvasMouseDown(e: MouseEvent) {
  if (e.button === 1) return
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
})
onUnmounted(() => { _ro?.disconnect(); if (_af) cancelAnimationFrame(_af); _zw?.() })
</script>

<template>
  <div class="editor-canvas" :class="'theme-' + themeMode" ref="containerRef">
    <canvas ref="rulerCanvasRef" class="ruler-canvas" />
    <div class="canvas-scroll" ref="scrollRef"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown">
      <div class="canvas-area" ref="canvasAreaRef">
        <canvas class="fabric-canvas" />
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

/* canvas 填满整个视口容器（左/上偏移 24px = 标尺区域），由 CanvasManager 设置 Fabric canvas 尺寸 */
.canvas-scroll {
  position:absolute; top:24px; left:24px; right:0; bottom:0;
  overflow:hidden;
}
.canvas-area { width:100%; height:100%; }
.fabric-canvas { display:block; }

/* 加载态 */
.loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:rgba(17,17,17,.85); color:#666; font-size:14px; z-index:30; pointer-events:none; }
.loading-spinner { width:28px; height:28px; border:3px solid rgba(255,255,255,.1); border-top-color:#3b82f6; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
