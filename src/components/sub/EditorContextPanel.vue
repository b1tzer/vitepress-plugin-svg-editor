<script setup lang="ts">
/**
 * 右侧属性面板子组件（Figma 式 Context-Aware Right Sidebar）
 *
 * 职责：根据选中对象类型动态展示属性工具（渐进式披露）
 * 始终占位固定宽度，避免 CLS 导致画布抖动
 * 支持折叠/展开（toggle），适配明暗主题
 */

import { computed } from 'vue'
import { ICONS } from '../../core/constants'

const props = defineProps<{
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
  themeMode: string
  collapsed: boolean
}>()

const emit = defineEmits<{
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
  (e: 'toggleCollapse'): void
}>()

const hasActiveSelection = computed(() => !!props.selectionInfo)
const isTextSelected = computed(() => {
  const info = props.selectionInfo.toLowerCase()
  return info.includes('text') || info.includes('textbox')
})
const isLight = computed(() => props.themeMode === 'light')
</script>

<template>
  <aside
    class="context-panel"
    :class="[isLight ? 'context-light' : 'context-dark', { collapsed: collapsed }]"
    aria-label="属性面板"
  >
    <!-- 折叠时只显示一条窄条 + 展开按钮 -->
    <template v-if="collapsed">
      <button class="floating-toggle" data-tip="展开属性面板" @click="emit('toggleCollapse')" aria-label="展开属性面板">
        <span v-html="ICONS.chevronRight"></span>
      </button>
    </template>

    <!-- 展开时：正常内容 + 折叠按钮 -->
    <template v-else>
      <button class="floating-toggle" data-tip="折叠属性面板" @click="emit('toggleCollapse')" aria-label="折叠属性面板">
        <span v-html="ICONS.chevronLeft"></span>
      </button>

      <div v-if="!hasActiveSelection" class="context-empty">
        <div class="empty-icon"><span v-html="ICONS.target"></span></div>
        <p class="empty-title">属性面板</p>
        <p class="empty-hint">选中画布上的对象<br />即可编辑属性</p>
      </div>

      <div v-else class="context-content">
        <div class="context-section-title">布局</div>
        <div class="tool-group">
          <button @click="emit('align', 'left')" data-tip="左对齐" aria-label="左对齐"><span v-html="ICONS.alignLeft"></span></button>
          <button @click="emit('align', 'centerH')" data-tip="水平居中" aria-label="水平居中"><span v-html="ICONS.alignCenter"></span></button>
          <button @click="emit('align', 'right')" data-tip="右对齐" aria-label="右对齐"><span v-html="ICONS.alignRight"></span></button>
        </div>
        <div class="tool-group">
          <button @click="emit('align', 'top')" data-tip="顶对齐" aria-label="顶对齐"><span v-html="ICONS.alignTop"></span></button>
          <button @click="emit('align', 'centerV')" data-tip="垂直居中" aria-label="垂直居中"><span v-html="ICONS.alignMiddle"></span></button>
          <button @click="emit('align', 'bottom')" data-tip="底对齐" aria-label="底对齐"><span v-html="ICONS.alignBottom"></span></button>
        </div>

        <div class="context-section-title">分布</div>
        <div class="tool-group">
          <button @click="emit('distribute', 'horizontal')" data-tip="水平等间距分布" aria-label="水平等间距分布"><span v-html="ICONS.distributeH"></span></button>
          <button @click="emit('distribute', 'vertical')" data-tip="垂直等间距分布" aria-label="垂直等间距分布"><span v-html="ICONS.distributeV"></span></button>
        </div>

        <div class="context-section-title">层级</div>
        <div class="tool-group">
          <button @click="emit('layerForward')" data-tip="上移一层" aria-label="上移一层"><span v-html="ICONS.layerUp"></span></button>
          <button @click="emit('layerBackward')" data-tip="下移一层" aria-label="下移一层"><span v-html="ICONS.layerDown"></span></button>
          <button @click="emit('layerToFront')" data-tip="置顶" aria-label="置顶"><span v-html="ICONS.layerTop"></span></button>
          <button @click="emit('layerToBack')" data-tip="置底" aria-label="置底"><span v-html="ICONS.layerBottom"></span></button>
        </div>
        <div class="tool-group">
          <button @click="emit('group')" data-tip="组合 (Ctrl+G)" aria-label="组合 Ctrl+G"><span v-html="ICONS.group"></span></button>
          <button @click="emit('ungroup')" data-tip="取消组合 (Ctrl+Shift+G)" aria-label="取消组合 Ctrl+Shift+G"><span v-html="ICONS.ungroup"></span></button>
        </div>

        <template v-if="!isTextSelected">
          <div class="context-section-title">填充与边框</div>
          <div class="prop-row">
            <span class="label">填充</span>
            <input type="color" :value="currentFill" @input="emit('fill', ($event.target as HTMLInputElement).value)" aria-label="填充颜色" />
          </div>
          <div class="prop-row">
            <span class="label">边框</span>
            <input type="color" :value="currentStroke" @input="emit('stroke', ($event.target as HTMLInputElement).value)" aria-label="边框颜色" />
          </div>
          <div class="prop-row">
            <span class="label">粗细</span>
            <select class="prop-select" :value="currentStrokeWidth" @change="emit('strokeWidth', +($event.target as HTMLSelectElement).value)" aria-label="边框粗细">
              <option v-for="w in [0.5,1,1.5,2,2.5,3,4,5]" :key="w" :value="w">{{ w }}px</option>
            </select>
          </div>
          <div class="prop-row">
            <span class="label">虚线</span>
            <button @click="emit('strokeDash')" data-tip="虚线" :class="{ active: currentStrokeDash }" aria-label="切换虚线"><span v-html="ICONS.dashed"></span></button>
          </div>

          <div class="context-section-title">变换</div>
          <div class="prop-row">
            <span class="label">旋转</span>
            <div class="prop-input-group">
              <input type="number" class="prop-number" :value="currentRotation" @change="emit('rotation', +($event.target as HTMLInputElement).value)" min="-360" max="360" step="15" aria-label="旋转角度" />
              <span class="label">°</span>
            </div>
          </div>
          <div class="prop-row">
            <span class="label">透明度</span>
            <div class="prop-input-group">
              <input type="range" class="prop-range" :value="currentOpacity" @input="emit('opacity', +($event.target as HTMLInputElement).value)" min="0" max="100" step="1" aria-label="透明度" />
              <span class="info">{{ currentOpacity }}%</span>
            </div>
          </div>

          <div class="context-section-title">渐变</div>
          <div class="prop-row"><span class="label">类型</span><select class="prop-select" :value="gradientType" @change="emit('update:gradientType', ($event.target as HTMLSelectElement).value); emit('gradientChange')" aria-label="渐变类型"><option value="none">纯色</option><option value="linear">线性渐变</option><option value="radial">径向渐变</option></select></div>
          <template v-if="gradientType !== 'none'">
            <div class="prop-row"><span class="label">颜色1</span><input type="color" :value="gradientColor1" @input="emit('update:gradientColor1', ($event.target as HTMLInputElement).value); emit('gradientChange')" aria-label="渐变颜色1" /></div>
            <div class="prop-row"><span class="label">颜色2</span><input type="color" :value="gradientColor2" @input="emit('update:gradientColor2', ($event.target as HTMLInputElement).value); emit('gradientChange')" aria-label="渐变颜色2" /></div>
            <div v-if="gradientType === 'linear'" class="prop-row"><span class="label">角度</span><div class="prop-input-group"><input type="number" class="prop-number" :value="gradientAngle" @change="emit('update:gradientAngle', +($event.target as HTMLInputElement).value); emit('gradientChange')" min="0" max="360" step="15" aria-label="渐变角度" /><span class="label">°</span></div></div>
          </template>

          <div class="context-section-title">阴影</div>
          <div class="prop-row"><span class="label">启用</span><button @click="emit('toggleShadow')" data-tip="阴影" :class="{ active: shadowEnabled }" aria-label="切换阴影"><span v-html="ICONS.shadow"></span></button></div>
          <template v-if="shadowEnabled">
            <div class="prop-row"><span class="label">颜色</span><input type="color" :value="shadowColor" @input="emit('update:shadowColor', ($event.target as HTMLInputElement).value); emit('applyShadow')" aria-label="阴影颜色" /></div>
            <div class="prop-row"><span class="label">模糊</span><input type="number" class="prop-number" :value="shadowBlur" @change="emit('update:shadowBlur', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="0" max="50" aria-label="阴影模糊" /></div>
            <div class="prop-row"><span class="label">偏移X</span><input type="number" class="prop-number" :value="shadowOffsetX" @change="emit('update:shadowOffsetX', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="-50" max="50" aria-label="阴影X偏移" /></div>
            <div class="prop-row"><span class="label">偏移Y</span><input type="number" class="prop-number" :value="shadowOffsetY" @change="emit('update:shadowOffsetY', +($event.target as HTMLInputElement).value); emit('applyShadow')" min="-50" max="50" aria-label="阴影Y偏移" /></div>
          </template>
        </template>

        <template v-if="isTextSelected">
          <div class="context-section-title">文字</div>
          <div class="prop-row"><span class="label">字号</span><select class="prop-select" :value="currentFontSize" @change="emit('fontSize', +($event.target as HTMLSelectElement).value)" aria-label="字号"><option v-for="s in [8,9,10,11,12,14,16,18,20,24,28,32,36,48,64,72,96]" :key="s" :value="s">{{ s }}</option></select></div>
          <div class="prop-row"><span class="label">样式</span><div class="tool-group"><button @click="emit('bold')" data-tip="加粗" :class="{ active: currentFontWeight === 'bold' }" aria-label="加粗 Ctrl+B"><span v-html="ICONS.bold"></span></button><button @click="emit('italic')" data-tip="斜体" :class="{ active: currentFontStyle === 'italic' }" aria-label="斜体 Ctrl+I"><span v-html="ICONS.italic"></span></button><button @click="emit('underline')" data-tip="下划线" :class="{ active: currentUnderline }" aria-label="下划线 Ctrl+U"><span v-html="ICONS.underline"></span></button></div></div>
          <div class="prop-row"><span class="label">颜色</span><input type="color" :value="currentTextFill" @input="emit('textFill', ($event.target as HTMLInputElement).value)" aria-label="文字颜色" /></div>
          <div class="prop-row"><span class="label">对齐</span><div class="tool-group"><button @click="emit('textAlign', 'left')" data-tip="文字左对齐" :class="{ active: currentTextAlign === 'left' }" aria-label="左对齐"><span v-html="ICONS.textLeft"></span></button><button @click="emit('textAlign', 'center')" data-tip="文字居中" :class="{ active: currentTextAlign === 'center' }" aria-label="居中"><span v-html="ICONS.textCenter"></span></button><button @click="emit('textAlign', 'right')" data-tip="文字右对齐" :class="{ active: currentTextAlign === 'right' }" aria-label="右对齐"><span v-html="ICONS.textRight"></span></button></div></div>
        </template>
      </div>
    </template>
  </aside>
</template>

<style scoped>
/* ── 根容器：始终占位固定宽度 ── */
.context-panel {
  position: relative;
  width: 220px;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  transition: width 0.2s ease;
}

/* ── 折叠状态：缩成窄条 ── */
.context-panel.collapsed {
  width: 40px;
  overflow: hidden;
}

/* ── 亮色/暗色主题 ── */
.context-panel.context-light {
  background: linear-gradient(180deg, #f0f1f3 0%, #e8eaed 100%);
  border-left: 1px solid rgba(0,0,0,0.08);
}
.context-panel.context-dark {
  background: linear-gradient(180deg, #1e1e1e 0%, #1c1c1c 100%);
  border-left: 1px solid rgba(255,255,255,0.06);
}

/* ── 折叠按钮（20×64 直角竖条，参考站 right-btn 1:1 复刻）── */
.floating-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -20px;
  z-index: 1;
  width: 20px; height: 64px;
  border: none; border-radius: 0;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s ease;
  padding: 0;
  background: transparent;
}
/* 折叠态：按钮在面板内部居中 */
.context-panel.collapsed .floating-toggle {
  left: 50%;
  transform: translate(-50%, -50%);
}

.context-light .floating-toggle { color: #515a6e; }
.context-light .floating-toggle:hover { color: #2d8cf0; }
.context-dark  .floating-toggle { color: #999; }
.context-dark  .floating-toggle:hover { color: #5cadff; }
.floating-toggle span { display: flex; align-items: center; justify-content: center; }
.floating-toggle span svg { width: 14px; height: 14px; stroke-width: 2.5; }

/* ── 空状态 ── */
.context-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px 16px;
  text-align: center;
}
.empty-icon { margin-bottom: 12px; opacity: 0.5; }
.empty-icon span { display: flex; align-items: center; justify-content: center; }
.empty-icon :deep(svg) { width: 40px; height: 40px; stroke-width: 1.5; }
.empty-title { font-size: 16px; font-weight: 600; margin: 0 0 8px 0; }
.context-light .empty-title { color: #555; }
.context-dark  .empty-title { color: #888; }
.empty-hint { font-size: 13px; line-height: 1.6; margin: 0; }
.context-light .empty-hint { color: #999; }
.context-dark  .empty-hint { color: #555; }

/* ── 有内容时的布局 ── */
.context-content {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── 分区标题 ── */
.context-section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 14px;
  margin-bottom: 8px;
  padding-bottom: 4px;
}
.context-light .context-section-title { color: #999; border-bottom: 1px solid rgba(0,0,0,0.06); }
.context-dark  .context-section-title { color: #555; border-bottom: 1px solid rgba(255,255,255,0.04); }
.context-section-title:first-child { margin-top: 0; }

/* ── 工具按钮组 ── */
.tool-group {
  display: flex; gap: 4px; flex-wrap: wrap;
}
.tool-group button {
  min-width: 28px; height: 28px;
  border: none; border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease; padding: 0 4px;
}
.context-light .tool-group button { background: rgba(0,0,0,0.04); color: #666; }
.context-light .tool-group button:hover { background: rgba(0,0,0,0.08); color: #333; }
.context-light .tool-group button.active { background: rgba(59,130,246,0.12); color: #2563eb; }
.context-dark  .tool-group button { background: rgba(255,255,255,0.03); color: #999; }
.context-dark  .tool-group button:hover { background: rgba(255,255,255,0.08); color: #e0e0e0; }
.context-dark  .tool-group button.active { background: rgba(59,130,246,0.2); color: #60a5fa; }
.tool-group button:active { transform: scale(0.95); }
.tool-group button span { display: flex; align-items: center; justify-content: center; }
.tool-group button span svg { width: 15px; height: 15px; stroke-width: 1.8; }

/* ── 属性行 ── */
.prop-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 5px 0; min-height: 30px;
}
.context-light .prop-row .label { color: #555; }
.context-dark  .prop-row .label { color: #777; }
.prop-row .label { font-size: 13px; flex-shrink: 0; }
.prop-row input[type="color"] {
  width: 28px; height: 28px; border-radius: 6px; cursor: pointer; padding: 0; background: transparent;
}
.context-light .prop-row input[type="color"] { border: 1px solid rgba(0,0,0,0.12); }
.context-dark  .prop-row input[type="color"] { border: 1px solid rgba(255,255,255,0.1); }
.prop-row .prop-select {
  width: 64px; height: 28px; border-radius: 6px; font-size: 13px; padding: 0 6px;
}
.context-light .prop-row .prop-select { background: #fff; color: #333; border: 1px solid rgba(0,0,0,0.1); }
.context-dark  .prop-row .prop-select { background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid rgba(255,255,255,0.08); }
.prop-row .prop-select:focus { border-color: #3b82f6; outline: none; }
.prop-row .prop-number {
  width: 52px; height: 28px; border-radius: 6px; font-size: 13px; padding: 0 6px;
  -moz-appearance: textfield;
}
.context-light .prop-row .prop-number { background: #fff; color: #333; border: 1px solid rgba(0,0,0,0.1); }
.context-dark  .prop-row .prop-number { background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid rgba(255,255,255,0.08); }
.prop-row .prop-number:focus { border-color: #3b82f6; outline: none; }
.prop-row .prop-number::-webkit-inner-spin-button,
.prop-row .prop-number::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.prop-row .prop-range { width: 64px; height: 4px; cursor: pointer; accent-color: #3b82f6; }
.context-light .prop-row .info { color: #999; }
.context-dark  .prop-row .info { color: #666; }
.prop-row .info { font-size: 12px; min-width: 30px; text-align: right; }
.prop-row .prop-input-group { display: flex; align-items: center; gap: 4px; }
</style>