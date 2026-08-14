/**
 * useCanvas — 画布初始化与生命周期管理
 *
 * 职责：
 *   - 加载 SVG 并初始化 Fabric.js 画布
 *   - 管理 zoomLevel / svgWidth / svgHeight / selectionInfo 响应式状态
 *   - 提供 init(src) / dispose() 生命周期方法
 */

import { ref, computed, type Ref } from 'vue'
import * as fabric from 'fabric'
import type { DIContainer } from '../di/container'
import { preprocessSvg } from '../core/preprocessor'
import { mergeArrows } from '../plugins/arrow-merger'
import { FABRIC_TYPE, HOLLOW_SHAPE_TYPES, TEXT_TYPES } from '../core/FabricTypes'

export function useCanvas(container: DIContainer) {
  const { canvasMgr } = container

  // ── 响应式状态 ──
  const loading = ref(true)
  const zoomLevel = ref(100)
  const svgWidth = ref(0)
  const svgHeight = ref(0)
  const selectionInfo = ref('')
  const originalViewBox = ref('')
  const themeMode = ref<'light' | 'dark'>(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )
  const canvasObjects = ref<any[]>([])

  const displayWidth = computed(() => Math.round(svgWidth.value * zoomLevel.value / 100))
  const displayHeight = computed(() => Math.round(svgHeight.value * zoomLevel.value / 100))

  // ── 事件订阅 ──
  canvasMgr.onZoomChange((z: number) => { zoomLevel.value = z })
  canvasMgr.onSelectionChange(() => { updateSelectionInfo() })

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

  function updateSelectionInfo() {
    const fc = canvasMgr.canvas
    if (!fc) return
    const active = fc.getActiveObject()
    if (!active) { selectionInfo.value = ''; return }
    const isMulti = active.type === FABRIC_TYPE.ACTIVE_SELECTION
    selectionInfo.value = isMulti ? `${(active as any)._objects.length} 个选中` : active.type
  }

  // ── 主加载流程 ──
  async function init(src: string, canvasAreaEl: HTMLElement | null): Promise<void> {
    loading.value = true

    const base = import.meta.env.BASE_URL || '/'
    const url = src.startsWith('/') ? base + src.slice(1) : src

    let svgText: string
    try {
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      svgText = await resp.text()
    } catch (e) {
      console.error('[useCanvas] 获取 SVG 失败:', url, e)
      loading.value = false
      return
    }

    const result = preprocessSvg(svgText, themeMode.value)
    if (result.originalViewBox) originalViewBox.value = result.originalViewBox
    if (result.svgWidth > 0) svgWidth.value = result.svgWidth; else svgWidth.value = 800
    if (result.svgHeight > 0) svgHeight.value = result.svgHeight; else svgHeight.value = 500

    if (!canvasAreaEl) return
    await new Promise(r => requestAnimationFrame(r))
    await new Promise(r => requestAnimationFrame(r))

    const w = svgWidth.value || 800
    const h = svgHeight.value || 500
    const canvasEl = canvasAreaEl.querySelector('canvas')
    if (!canvasEl) return

    const fc = canvasMgr.init(canvasEl, w, h)

    fabric.loadSVGFromString(result.svg).then(({ objects }: any) => {
      try {
        const merged = mergeArrows(objects)
        const converted = merged.map((obj: any) => {
          if (obj.type === FABRIC_TYPE.TEXT) {
            try {
              return new fabric.Textbox(obj.text || '', { left: obj.left || 0, top: obj.top || 0, width: Math.max((obj.width || 80) + 20, 40), fontSize: obj.fontSize || 12, fontFamily: obj.fontFamily || 'sans-serif', fontWeight: obj.fontWeight || 'normal', fontStyle: obj.fontStyle || 'normal', fill: obj.fill || '#000', stroke: obj.stroke || '', strokeWidth: obj.strokeWidth || 0, textAlign: obj.textAlign || 'left', lineHeight: obj.lineHeight || 1.16, charSpacing: obj.charSpacing || 0, opacity: obj.opacity ?? 1, angle: obj.angle || 0, originX: obj.originX || 'left', originY: obj.originY || 'top', selectable: true, evented: true, editable: true, splitByGrapheme: true })
            } catch (e) { return obj }
          }
          return obj
        })
        converted.forEach((obj: any) => {
          obj.set({ selectable: true, evented: true, perPixelTargetFind: false })
          if (!obj.fill || obj.fill === 'none' || obj.fill === 'transparent') {
            if (HOLLOW_SHAPE_TYPES.includes(obj.type)) {
              obj.set({ fill: 'rgba(0,0,0,0.001)' })
            }
          }
          if (obj._objects) obj._objects.forEach((c: any) => c.set({ selectable: true, evented: true }))
          fc.add(obj)
        })
        canvasMgr.zoomFit()
        refreshLayerList()
      } catch (e) {
        console.error('[useCanvas] SVG 加载失败:', e)
      } finally {
        loading.value = false
      }
    })
  }

  function dispose(): void {
    canvasMgr.dispose()
  }

  return {
    // state
    loading,
    zoomLevel,
    svgWidth,
    svgHeight,
    selectionInfo,
    originalViewBox,
    themeMode,
    canvasObjects,
    displayWidth,
    displayHeight,
    // methods
    init,
    dispose,
    refreshLayerList,
    updateSelectionInfo,
    selectLayer: (id: string) => {
      const fc = canvasMgr.canvas
      if (!fc) return
      const idx = parseInt(id.replace('layer-', ''))
      const obj = fc.getObjects()[idx]
      if (obj) { fc.setActiveObject(obj); fc.renderAll() }
    },
    toggleLayerVisibility: (id: string) => {
      const fc = canvasMgr.canvas
      if (!fc) return
      const idx = parseInt(id.replace('layer-', ''))
      const obj = fc.getObjects()[idx]
      if (obj) { obj.set('visible', !obj.visible); fc.renderAll(); refreshLayerList() }
    },
    onResizeCanvas: (w: number, h: number) => {
      svgWidth.value = Math.round(w * 100 / zoomLevel.value)
      svgHeight.value = Math.round(h * 100 / zoomLevel.value)
      canvasMgr.setLogicalSize(svgWidth.value, svgHeight.value)
    },
  }
}