<script setup lang="ts">
/**
 * 编辑器工具栏子组件
 *
 * 职责：渲染所有编辑按钮和控件
 * 通过 props 接收状态，通过 emit 向上传递操作
 */

import { ICONS } from '../../core/constants'

const props = defineProps<{
  src: string
  zoomLevel: number
  svgWidth: number
  svgHeight: number
  selectionInfo: string
  currentFill: string
  currentStroke: string
  currentFontSize: number
  currentFontWeight: string
  currentFontStyle: string
  currentUnderline: boolean
  currentTextAlign: string
  currentTextFill: string
  currentStrokeWidth: number
  currentStrokeDash: boolean
  currentRotation: number
  currentOpacity: number
  gradientType: string
  gradientAngle: number
  gradientColor1: string
  gradientColor2: string
  shadowEnabled: boolean
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
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
  (e: 'align', type: string): void
  (e: 'layerForward'): void
  (e: 'layerBackward'): void
  (e: 'layerToFront'): void
  (e: 'layerToBack'): void
  (e: 'distribute', dir: 'horizontal' | 'vertical'): void
  (e: 'group'): void
  (e: 'ungroup'): void
  (e: 'fill', hex: string): void
  (e: 'stroke', hex: string): void
  (e: 'strokeWidth', w: number): void
  (e: 'strokeDash'): void
  (e: 'fontSize', size: number): void
  (e: 'bold'): void
  (e: 'italic'): void
  (e: 'underline'): void
  (e: 'textAlign', align: string): void
  (e: 'textFill', hex: string): void
  (e: 'rotation', angle: number): void
  (e: 'opacity', value: number): void
  (e: 'gradientChange'): void
  (e: 'update:gradientType', value: string): void
  (e: 'update:gradientAngle', value: number): void
  (e: 'update:gradientColor1', value: string): void
  (e: 'update:gradientColor2', value: string): void
  (e: 'toggleShadow'): void
  (e: 'applyShadow'): void
  (e: 'update:shadowColor', value: string): void
  (e: 'update:shadowBlur', value: number): void
  (e: 'update:shadowOffsetX', value: number): void
  (e: 'update:shadowOffsetY', value: number): void
  (e: 'toggleTheme'): void
  (e: 'save'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="editor-toolbar">
    <span class="title">✏️ {{ src }}</span>
    <div class="sep" />
    <button v-if="canUndo" @click="emit('undo')" data-tip="撤销" aria-label="撤销 Ctrl+Z"><span v-html="ICONS.undo"></span></button>
    <button v-else disabled data-tip="不可撤销"><span v-html="ICONS.undo"></span></button>
    <button v-if="canRedo" @click="emit('redo')" data-tip="重做" aria-label="重做 Ctrl+Y"><span v-html="ICONS.redo"></span></button>
    <button v-else disabled data-tip="不可重做"><span v-html="ICONS.redo"></span></button>
    <div class="sep" />
    <button @click="emit('copy')" data-tip="复制" aria-label="复制 Ctrl+C"><span v-html="ICONS.copy"></span></button>
    <button @click="emit('paste')" data-tip="粘贴" aria-label="粘贴 Ctrl+V"><span v-html="ICONS.paste"></span></button>
    <button @click="emit('delete')" data-tip="删除" aria-label="删除 Delete"><span v-html="ICONS.trash"></span></button>
    <div class="sep" />
    <button @click="emit('zoomOut')" data-tip="缩小 (-)" aria-label="缩小 Ctrl+-"><span v-html="ICONS.zoomOut"></span></button>
    <span class="info" style="min-width:36px;cursor:pointer" @click="emit('zoomFit')" data-tip="点击重置">{{ zoomLevel }}%</span>
    <button @click="emit('zoomIn')" data-tip="放大 (+)" aria-label="放大 Ctrl+="><span v-html="ICONS.zoomIn"></span></button>
    <button @click="emit('zoomFit')" data-tip="适应画布" aria-label="适应画布 Ctrl+0"><span v-html="ICONS.zoomFit"></span></button>
    <div class="sep" />
    <span class="info canvas-size" data-tip="SVG 画布尺寸">{{ svgWidth }} × {{ svgHeight }}px</span>
    <div class="sep" />
    <div class="align-group">
      <button @click="emit('align', 'left')" data-tip="左对齐" aria-label="左对齐"><span v-html="ICONS.alignLeft"></span></button>
      <button @click="emit('align', 'centerH')" data-tip="水平居中" aria-label="水平居中"><span v-html="ICONS.alignCenter"></span></button>
      <button @click="emit('align', 'right')" data-tip="右对齐" aria-label="右对齐"><span v-html="ICONS.alignRight"></span></button>
      <button @click="emit('align', 'top')" data-tip="顶对齐" aria-label="顶对齐"><span v-html="ICONS.alignTop"></span></button>
      <button @click="emit('align', 'centerV')" data-tip="垂直居中" aria-label="垂直居中"><span v-html="ICONS.alignMiddle"></span></button>
      <button @click="emit('align', 'bottom')" data-tip="底对齐" aria-label="底对齐"><span v-html="ICONS.alignBottom"></span></button>
    </div>
    <div class="sep" />
    <div class="layer-group">
      <button @click="emit('layerForward')" data-tip="上移一层" aria-label="上移一层"><span v-html="ICONS.layerUp"></span></button>
      <button @click="emit('layerBackward')" data-tip="下移一层" aria-label="下移一层"><span v-html="ICONS.layerDown"></span></button>
      <button @click="emit('layerToFront')" data-tip="置顶" aria-label="置顶"><span v-html="ICONS.layerTop"></span></button>
      <button @click="emit('layerToBack')" data-tip="置底" aria-label="置底"><span v-html="ICONS.layerBottom"></span></button>
    </div>
    <div class="sep" />
    <div class="dist-group">
      <button @click="emit('distribute', 'horizontal')" data-tip="水平等间距分布" aria-label="水平等间距分布"><span v-html="ICONS.distributeH"></span></button>
      <button @click="emit('distribute', 'vertical')" data-tip="垂直等间距分布" aria-label="垂直等间距分布"><span v-html="ICONS.distributeV"></span></button>
    </div>
    <div class="sep" />
    <div class="group-btn">
      <button @click="emit('group')" data-tip="组合 (Ctrl+G)" aria-label="组合 Ctrl+G"><span v-html="ICONS.group"></span></button>
      <button @click="emit('ungroup')" data-tip="取消组合 (Ctrl+Shift+G)" aria-label="取消组合 Ctrl+Shift+G"><span v-html="ICONS.ungroup"></span></button>
    </div>
    <div class="sep" />
    <div class="rotation-group">
      <span class="label">旋转</span>
      <input type="number" class="rotation-input" :value="currentRotation" @change="emit('rotation', +($event.target as HTMLInputElement).value)" min="-360" max="360" step="15" aria-label="旋转角度" />
      <span class="label">°</span>
    </div>
    <div class="sep" />
    <div class="opacity-group">
      <span class="label">透明度</span>
      <input type="range" class="opacity-slider" :value="currentOpacity" @input="emit('opacity', +($event.target as HTMLInputElement).value)" min="0" max="100" step="1" aria-label="透明度" />
      <span class="info">{{ currentOpacity }}%</span>
    </div>
    <div class="sep" />
    <div class="gradient-group">
      <select class="gradient-select" :value="gradientType" @change="emit('update:gradientType', ($event.target as HTMLSelectElement).value); emit('gradientChange')" aria-label="渐变类型">
        <option value="none">纯色</option>
        <option value="linear">线性渐变</option>
        <option value="radial">径向渐变</option>
      </select>
      <template v-if="gradientType !== 'none'">
        <input type="color" :value="gradientColor1" @input="emit('update:gradientColor1', ($event.target as HTMLInputElement).value); emit('gradientChange')" aria-label="渐变颜色1" />
        <input type="color" :value="gradientColor2" @input="emit('update:gradientColor2', ($event.target as HTMLInputElement).value); emit('gradientChange')" aria-label="渐变颜色2" />
        <input v-if="gradientType === 'linear'" type="number" class="angle-input" :value="gradientAngle" @change="emit('update:gradientAngle', +($event.target as HTMLInputElement).value); emit('gradientChange')" min="0" max="360" step="15" aria-label="渐变角度" />
        <span v-if="gradientType === 'linear'" class="label">°</span>
      </template>
    </div>
    <div class="sep" />
    <div class="shadow-group">
      <button @click="emit('toggleShadow')" data-tip="阴影" :class="{ active: shadowEnabled }" aria-label="切换阴影"><span v-html="ICONS.shadow"></span></button>
      <template v-if="shadowEnabled">
        <input type="color" :value="shadowColor" @input="emit('update:shadowColor', ($event.target as HTMLInputElement).value); emit('applyShadow')" data-tip="阴影颜色" aria-label="阴影颜色" />
        <span class="label">模糊</span>
        <input type="number" class="shadow-input" :value="shadowBlur" @change="emit('update:shadowBlur', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="0" max="50" aria-label="阴影模糊" />
        <span class="label">X</span>
        <input type="number" class="shadow-input" :value="shadowOffsetX" @change="emit('update:shadowOffsetX', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="-50" max="50" aria-label="阴影X偏移" />
        <span class="label">Y</span>
        <input type="number" class="shadow-input" :value="shadowOffsetY" @change="emit('update:shadowOffsetY', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="-50" max="50" aria-label="阴影Y偏移" />
      </template>
    </div>
    <div class="spacer" />
    <span class="info">{{ selectionInfo }}</span>
    <div class="sep" />
    <div class="color-row">
      <span class="label">填充</span>
      <input type="color" :value="currentFill" @input="emit('fill', ($event.target as HTMLInputElement).value)" aria-label="填充颜色" />
      <span class="label">边框</span>
      <input type="color" :value="currentStroke" @input="emit('stroke', ($event.target as HTMLInputElement).value)" aria-label="边框颜色" />
      <span class="label">粗细</span>
      <select class="stroke-width-select" :value="currentStrokeWidth" @change="emit('strokeWidth', +($event.target as HTMLSelectElement).value)" aria-label="边框粗细">
        <option v-for="w in [0.5,1,1.5,2,2.5,3,4,5]" :key="w" :value="w">{{ w }}</option>
      </select>
      <button @click="emit('strokeDash')" data-tip="虚线" :class="{ active: currentStrokeDash }" aria-label="切换虚线"><span v-html="ICONS.dashed"></span></button>
    </div>
    <div class="sep" />
    <div class="text-format-group">
      <select class="font-size-select" :value="currentFontSize" @change="emit('fontSize', +($event.target as HTMLSelectElement).value)" aria-label="字号">
        <option v-for="s in [8,9,10,11,12,14,16,18,20,24,28,32,36,48,64,72,96]" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="emit('bold')" data-tip="加粗" :class="{ active: currentFontWeight === 'bold' }" aria-label="加粗 Ctrl+B"><span v-html="ICONS.bold"></span></button>
      <button @click="emit('italic')" data-tip="斜体" :class="{ active: currentFontStyle === 'italic' }" aria-label="斜体 Ctrl+I"><span v-html="ICONS.italic"></span></button>
      <button @click="emit('underline')" data-tip="下划线" :class="{ active: currentUnderline }" aria-label="下划线 Ctrl+U"><span v-html="ICONS.underline"></span></button>
      <input type="color" :value="currentTextFill" @input="emit('textFill', ($event.target as HTMLInputElement).value)" data-tip="文字颜色" aria-label="文字颜色" />
      <div class="sep" />
      <button @click="emit('textAlign', 'left')" data-tip="文字左对齐" :class="{ active: currentTextAlign === 'left' }" aria-label="左对齐"><span v-html="ICONS.textLeft"></span></button>
      <button @click="emit('textAlign', 'center')" data-tip="文字居中" :class="{ active: currentTextAlign === 'center' }" aria-label="居中"><span v-html="ICONS.textCenter"></span></button>
      <button @click="emit('textAlign', 'right')" data-tip="文字右对齐" :class="{ active: currentTextAlign === 'right' }" aria-label="右对齐"><span v-html="ICONS.textRight"></span></button>
    </div>
    <div class="sep" />
    <button v-if="showThemeToggle" @click="emit('toggleTheme')" :data-tip="themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'" class="theme-toggle-btn" aria-label="切换主题">
      <span v-if="themeMode === 'light'" v-html="ICONS.sun"></span>
      <span v-else v-html="ICONS.moon"></span>
    </button>
    <button class="btn-save" data-tip="保存 (Ctrl+S)" @click="emit('save')" :disabled="saving" aria-label="保存 Ctrl+S">{{ saving ? '保存中...' : '保存' }}</button>
    <button data-tip="关闭" @click="emit('close')" aria-label="关闭 Esc"><span v-html="ICONS.close"></span></button>
  </div>
</template>

<style scoped>
.editor-toolbar {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(180deg, #202020 0%, #1a1a1a 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0; flex-wrap: wrap;
}
.editor-toolbar .title {
  font-size: 12px; color: #888; font-weight: 500;
  white-space: nowrap; max-width: 180px;
  overflow: hidden; text-overflow: ellipsis;
}
.editor-toolbar .sep {
  width: 1px; height: 22px;
  background: rgba(255,255,255,0.08);
  margin: 0 3px; flex-shrink: 0;
}
.editor-toolbar button {
  min-width: 32px; height: 32px;
  border: none; border-radius: 8px;
  background: transparent; color: #999;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease; padding: 0 6px; position: relative;
}
.editor-toolbar button:hover { background: rgba(255,255,255,0.08); color: #e0e0e0; }
.editor-toolbar button:active { background: rgba(255,255,255,0.12); transform: scale(0.95); }
.editor-toolbar button:disabled { opacity: 0.3; cursor: not-allowed; }
.editor-toolbar button.active { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.editor-toolbar button span { display: flex; align-items: center; justify-content: center; }
.editor-toolbar button span svg { width: 16px; height: 16px; stroke-width: 1.8; }
.editor-toolbar .info {
  font-size: 11px; color: #666; min-width: 40px; text-align: center;
  font-variant-numeric: tabular-nums;
}
.editor-toolbar .canvas-size {
  background: rgba(255,255,255,0.04); padding: 3px 10px; border-radius: 6px;
  font-size: 11px; color: #777; font-variant-numeric: tabular-nums; letter-spacing: 0.3px;
}
.editor-toolbar .spacer { flex: 1; }
.editor-toolbar .btn-save {
  width: auto; padding: 0 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff; font-size: 12px; font-weight: 600; border: none;
  box-shadow: 0 1px 3px rgba(59,130,246,0.3);
}
.editor-toolbar .btn-save:hover {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  box-shadow: 0 2px 8px rgba(59,130,246,0.4);
}
.editor-toolbar .btn-save:disabled { opacity: 0.4; cursor: default; box-shadow: none; }
.align-group, .layer-group, .dist-group, .group-btn {
  display: flex; gap: 2px; background: rgba(255,255,255,0.03); padding: 2px; border-radius: 8px;
}
.rotation-group { display: flex; align-items: center; gap: 6px; }
.rotation-input {
  width: 48px; height: 26px; background: rgba(255,255,255,0.05);
  color: #ccc; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; font-size: 11px; padding: 0 6px; -moz-appearance: textfield;
}
.rotation-input:focus { border-color: #3b82f6; outline: none; }
.rotation-input::-webkit-inner-spin-button,
.rotation-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.opacity-group { display: flex; align-items: center; gap: 6px; }
.opacity-slider { width: 64px; height: 4px; cursor: pointer; accent-color: #3b82f6; border-radius: 2px; }
.gradient-group { display: flex; align-items: center; gap: 6px; }
.gradient-select {
  width: 76px; height: 26px; background: rgba(255,255,255,0.05);
  color: #ccc; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; font-size: 11px; padding: 0 6px;
}
.gradient-select:focus { border-color: #3b82f6; outline: none; }
.gradient-group input[type="color"],
.shadow-group input[type="color"],
.color-row input[type="color"],
.text-format-group input[type="color"] {
  width: 26px; height: 26px; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px; cursor: pointer; padding: 0; background: transparent;
}
.angle-input, .shadow-input {
  width: 42px; height: 26px; background: rgba(255,255,255,0.05);
  color: #ccc; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; font-size: 11px; padding: 0 6px; -moz-appearance: textfield;
}
.angle-input:focus, .shadow-input:focus { border-color: #3b82f6; outline: none; }
.shadow-group { display: flex; align-items: center; gap: 6px; }
.color-row { display: flex; align-items: center; gap: 6px; }
.color-row .label, .rotation-group .label, .opacity-group .label, .shadow-group .label {
  font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.5px;
}
.color-row .stroke-width-select,
.text-format-group .font-size-select {
  width: 48px; height: 26px; background: rgba(255,255,255,0.05);
  color: #ccc; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; font-size: 11px; padding: 0 6px;
}
.color-row .stroke-width-select:focus,
.text-format-group .font-size-select:focus { border-color: #3b82f6; outline: none; }
.text-format-group { display: flex; align-items: center; gap: 3px; }
.text-format-group button { min-width: 28px; height: 28px; }
</style>
