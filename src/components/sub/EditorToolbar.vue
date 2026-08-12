<script setup lang="ts">
/**
 * 编辑器工具栏子组件（单行顶栏）
 *
 * 职责：全局操作栏（撤销/重做/复制/粘贴/删除/缩放 + 保存/关闭）
 * 参考：vue-fabric-editor 的 top bar 设计，状态信息内联
 */

import { computed } from 'vue'
import { ICONS } from '../../core/constants'

const props = defineProps<{
  src: string
  zoomLevel: number
  svgWidth: number
  svgHeight: number
  selectionInfo: string
  showThemeToggle: boolean
  themeMode: string
  saving: boolean
  canUndo: boolean
  canRedo: boolean
}>()

const emit = defineEmits<{
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'copy'): void
  (e: 'paste'): void
  (e: 'delete'): void
  (e: 'zoomIn'): void
  (e: 'zoomOut'): void
  (e: 'zoomFit'): void
  (e: 'toggleTheme'): void
  (e: 'save'): void
  (e: 'close'): void
  (e: 'resize', w: number, h: number): void
}>()

const isLight = computed(() => props.themeMode === 'light')

// 画布尺寸本地编辑态（失焦/回车时提交 emit('resize', w, h)）
import { ref, watch } from 'vue'
const editingWidth = ref(props.svgWidth)
const editingHeight = ref(props.svgHeight)
watch(() => props.svgWidth, (v) => { editingWidth.value = v })
watch(() => props.svgHeight, (v) => { editingHeight.value = v })
function commitResize() {
  const w = Math.max(10, editingWidth.value)
  const h = Math.max(10, editingHeight.value)
  editingWidth.value = w
  editingHeight.value = h
  emit('resize', w, h)
}
</script>

<template>
  <header class="editor-toolbar" :class="isLight ? 'toolbar-light' : 'toolbar-dark'">
    <!-- 左侧：Logo + 基础操作 -->
    <div class="toolbar-left">
      <span class="title">✏️ {{ src }}</span>
      <span class="sep" />
      <button :disabled="!canUndo" @click="emit('undo')" data-tip="撤销 Ctrl+Z" aria-label="撤销 Ctrl+Z"><span v-html="ICONS.undo"></span></button>
      <button :disabled="!canRedo" @click="emit('redo')" data-tip="重做 Ctrl+Y" aria-label="重做 Ctrl+Y"><span v-html="ICONS.redo"></span></button>
      <span class="sep" />
      <button @click="emit('copy')" data-tip="复制 Ctrl+C" aria-label="复制 Ctrl+C"><span v-html="ICONS.copy"></span></button>
      <button @click="emit('paste')" data-tip="粘贴 Ctrl+V" aria-label="粘贴 Ctrl+V"><span v-html="ICONS.paste"></span></button>
      <button @click="emit('delete')" data-tip="删除 Delete" aria-label="删除 Delete"><span v-html="ICONS.trash"></span></button>
      <span class="sep" />
      <button @click="emit('zoomOut')" data-tip="缩小 Ctrl+-" aria-label="缩小 Ctrl+-"><span v-html="ICONS.zoomOut"></span></button>
      <span class="zoom-badge" @click="emit('zoomFit')" data-tip="点击重置缩放" role="button" tabindex="0" aria-label="缩放比例 点击重置">{{ zoomLevel }}%</span>
      <button @click="emit('zoomIn')" data-tip="放大 Ctrl+=" aria-label="放大 Ctrl+="><span v-html="ICONS.zoomIn"></span></button>
      <button @click="emit('zoomFit')" data-tip="适应画布 Ctrl+0" aria-label="适应画布 Ctrl+0"><span v-html="ICONS.zoomFit"></span></button>
    </div>

    <!-- 中间：画布信息 -->
    <div class="toolbar-center">
      <span class="size-group">
        <input class="size-input" type="number" v-model.number="editingWidth"
          :min="10" :max="10000" step="10"
          @blur="commitResize" @keydown.enter="($event.target as HTMLInputElement).blur()"
          aria-label="画布宽度" />
        <span class="size-sep">×</span>
        <input class="size-input" type="number" v-model.number="editingHeight"
          :min="10" :max="10000" step="10"
          @blur="commitResize" @keydown.enter="($event.target as HTMLInputElement).blur()"
          aria-label="画布高度" />
        <span class="size-unit">px</span>
      </span>
      <span class="info-selection">{{ selectionInfo || '未选中' }}</span>
    </div>

    <!-- 右侧：主题 + 保存 + 关闭 -->
    <div class="toolbar-right">
      <button v-if="showThemeToggle" @click="emit('toggleTheme')" :data-tip="themeMode === 'light' ? '暗色模式' : '亮色模式'" class="theme-btn" aria-label="切换主题">
        <span v-if="themeMode === 'light'" v-html="ICONS.sun"></span>
        <span v-else v-html="ICONS.moon"></span>
      </button>
      <button class="btn-save" @click="emit('save')" :disabled="saving" data-tip="保存 Ctrl+S" aria-label="保存 Ctrl+S">{{ saving ? '保存中…' : '保存' }}</button>
      <button class="btn-close" @click="emit('close')" data-tip="关闭 Esc" aria-label="关闭 Esc"><span v-html="ICONS.close"></span></button>
    </div>
  </header>
</template>

<style scoped>
/* ── 根容器：单行水平布局 ── */
.editor-toolbar {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 12px;
  flex-shrink: 0;
}

.toolbar-dark {
  background: #202020;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.toolbar-light {
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

/* ── 三栏布局 ── */
.toolbar-left, .toolbar-center, .toolbar-right {
  display: flex; align-items: center; gap: 4px;
}
.toolbar-left  { flex: 0 0 auto; }
.toolbar-center { flex: 1; justify-content: center; gap: 10px; }
.toolbar-right { flex: 0 0 auto; }

/* ── 标题 ── */
.title {
  font-size: 14px; font-weight: 500;
  white-space: nowrap; max-width: 150px;
  overflow: hidden; text-overflow: ellipsis;
}
.toolbar-dark  .title { color: #ccc; }
.toolbar-light .title { color: #333; }

/* ── 分隔符 ── */
.sep {
  width: 1px; height: 20px; margin: 0 2px; flex-shrink: 0;
}
.toolbar-dark  .sep { background: rgba(255,255,255,0.08); }
.toolbar-light .sep { background: rgba(0,0,0,0.1); }

/* ── 通用按钮 ── */
.editor-toolbar button {
  min-width: 30px; height: 30px;
  border: none; border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease; padding: 0 5px;
}
.editor-toolbar button:disabled { opacity: 0.25; cursor: not-allowed; }
.editor-toolbar button span { display: flex; align-items: center; justify-content: center; }
.editor-toolbar button span svg { width: 15px; height: 15px; stroke-width: 1.8; }

.toolbar-dark  button { background: transparent; color: #999; }
.toolbar-dark  button:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #e0e0e0; }
.toolbar-dark  button:active:not(:disabled) { transform: scale(0.95); }
.toolbar-light button { background: transparent; color: #555; }
.toolbar-light button:hover:not(:disabled) { background: rgba(0,0,0,0.06); color: #222; }
.toolbar-light button:active:not(:disabled) { transform: scale(0.95); }

/* ── 缩放徽章 ── */
.zoom-badge {
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  padding: 2px 8px; border-radius: 4px;
  min-width: 40px; text-align: center;
  font-variant-numeric: tabular-nums;
  transition: background 0.15s;
}
.toolbar-dark  .zoom-badge { color: #aaa; background: rgba(255,255,255,0.04); }
.toolbar-dark  .zoom-badge:hover { background: rgba(255,255,255,0.08); color: #e0e0e0; }
.toolbar-light .zoom-badge { color: #555; background: rgba(0,0,0,0.04); }
.toolbar-light .zoom-badge:hover { background: rgba(0,0,0,0.08); color: #222; }

/* ── 信息标签 ── */
.info-tag, .info-selection {
  font-size: 13px; font-variant-numeric: tabular-nums;
  padding: 2px 8px; border-radius: 4px;
}
.toolbar-dark  .info-tag       { color: #777; background: rgba(255,255,255,0.03); }
.toolbar-dark  .info-selection { color: #888; }
.toolbar-light .info-tag       { color: #888; background: rgba(0,0,0,0.03); }
.toolbar-light .info-selection { color: #555; }

/* ── 画布尺寸输入组 ── */
.size-group {
  display: flex; align-items: center; gap: 3px;
}
.size-input {
  width: 56px; height: 24px;
  text-align: center; font-size: 13px; font-variant-numeric: tabular-nums;
  border: 1px solid transparent; border-radius: 4px;
  padding: 0 4px; outline: none;
  font-family: inherit;
  /* 隐藏 spinner（Chrome/Safari/Firefox） */
  -moz-appearance: textfield;
}
.size-input::-webkit-inner-spin-button,
.size-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.size-sep { font-size: 12px; user-select: none; }
.size-unit { font-size: 11px; user-select: none; }
.toolbar-dark  .size-input { color: #aaa; background: rgba(255,255,255,0.04); }
.toolbar-dark  .size-input:focus { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #e0e0e0; }
.toolbar-light .size-input { color: #555; background: rgba(0,0,0,0.04); }
.toolbar-light .size-input:focus { border-color: rgba(0,0,0,0.15); background: rgba(0,0,0,0.06); color: #222; }
.toolbar-dark  .size-sep, .toolbar-dark  .size-unit { color: #666; }
.toolbar-light .size-sep, .toolbar-light .size-unit { color: #999; }

/* ── 保存按钮 ── */
.btn-save {
  width: auto !important; padding: 0 14px !important;
  min-width: 52px !important; height: 28px !important;
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: #fff !important; font-size: 14px; font-weight: 600;
  border-radius: 6px; box-shadow: 0 1px 3px rgba(59,130,246,0.3);
}
.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
  box-shadow: 0 2px 8px rgba(59,130,246,0.4);
}
.btn-save:disabled { opacity: 0.4; cursor: default; box-shadow: none; }

/* ── 关闭按钮 ── */
.btn-close:hover:not(:disabled) { background: rgba(239,68,68,0.15) !important; color: #ef4444 !important; }

/* ── Tooltip：hover 500ms 后弹出，mouseleave 立即消失 ── */
[data-tip] { position: relative; }
[data-tip]::after {
  content: attr(data-tip);
  position: absolute; bottom: calc(100% + 6px); left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px; border-radius: 4px;
  font-size: 12px; line-height: 1.4; white-space: nowrap;
  pointer-events: none; z-index: 9999;
  opacity: 0;
  transition: opacity 0.15s ease;
}
[data-tip]:hover::after {
  opacity: 1;
  transition-delay: 0.5s;
}
.toolbar-dark  [data-tip]::after { background: rgba(255,255,255,0.9); color: #222; }
.toolbar-light [data-tip]::after { background: rgba(0,0,0,0.78); color: #fff; }
</style>
