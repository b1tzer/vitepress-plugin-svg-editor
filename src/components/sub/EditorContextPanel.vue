<script setup lang="ts">
/**
 * 右侧属性面板子组件（Figma 式 Context-Aware Right Sidebar）
 *
 * 职责：根据选中对象类型动态展示属性工具（渐进式披露）
 * 始终占位固定宽度，避免 CLS 导致画布抖动
 * 支持折叠/展开（toggle），适配明暗主题
 */

import { computed, inject } from 'vue'
import { ICONS } from '../../core/shared/icons'
import { EditorStoreKey } from '../../composables/useEditorStore'

const props = defineProps<{
  themeMode: string
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleCollapse'): void
}>()

// 经 provide/inject 获取 editor store，直接消费选中状态与编辑操作（消除 prop drilling）
const store = inject(EditorStoreKey)!

const hasActiveSelection = computed(() => !!store.selection.selectionInfo)
const isTextSelected = computed(() => store.selection.hasTextInSelection)
const isLight = computed(() => props.themeMode === 'light')

// ── 渐变/阴影的 v-model 风格更新：先写 selection state，再触发对应操作 ──
function setGradientType(value: string) {
  store.selection.gradientType = value as 'none' | 'linear' | 'radial'
  store.applyGradientUI()
}
function setGradientColor1(value: string) {
  store.selection.gradientColor1 = value
  store.applyGradientUI()
}
function setGradientColor2(value: string) {
  store.selection.gradientColor2 = value
  store.applyGradientUI()
}
function setGradientAngle(value: number) {
  store.selection.gradientAngle = value
  store.applyGradientUI()
}
function setShadowColor(value: string) {
  store.selection.shadowColor = value
  store.applyShadowUI()
}
function setShadowBlur(value: number) {
  store.selection.shadowBlur = value
  store.applyShadowUI()
}
function setShadowOffsetX(value: number) {
  store.selection.shadowOffsetX = value
  store.applyShadowUI()
}
function setShadowOffsetY(value: number) {
  store.selection.shadowOffsetY = value
  store.applyShadowUI()
}
</script>

<template>
  <aside
    class="context-panel"
    :class="[isLight ? 'context-light' : 'context-dark', { collapsed: collapsed }]"
    aria-label="属性面板"
  >
    <!-- 折叠/展开按钮：始终作为面板直接子元素，展开态凸出左边界、折叠态居中 -->
    <button
      class="floating-toggle"
      :data-tip="collapsed ? '展开属性面板' : '折叠属性面板'"
      @click="emit('toggleCollapse')"
      :aria-label="collapsed ? '展开属性面板' : '折叠属性面板'"
    >
      <span v-html="collapsed ? ICONS.chevronLeft : ICONS.chevronRight"></span>
    </button>

    <!-- 展开时：内容区（用 context-scroll 独立滚动，避免裁切凸出的折叠按钮） -->
    <div v-if="!collapsed" class="context-scroll">
      <div v-if="!hasActiveSelection" class="context-empty">
        <div class="empty-icon"><span v-html="ICONS.target"></span></div>
        <p class="empty-title">属性面板</p>
        <p class="empty-hint">
          选中画布上的对象
          <br />
          即可编辑属性
        </p>
      </div>

      <div v-else class="context-content">
        <div class="context-section-title">布局</div>
        <div class="tool-group">
          <button @click="store.align('left')" data-tip="左对齐" aria-label="左对齐">
            <span v-html="ICONS.alignLeft"></span>
          </button>
          <button @click="store.align('centerH')" data-tip="水平居中" aria-label="水平居中">
            <span v-html="ICONS.alignCenter"></span>
          </button>
          <button @click="store.align('right')" data-tip="右对齐" aria-label="右对齐">
            <span v-html="ICONS.alignRight"></span>
          </button>
        </div>
        <div class="tool-group">
          <button @click="store.align('top')" data-tip="顶对齐" aria-label="顶对齐">
            <span v-html="ICONS.alignTop"></span>
          </button>
          <button @click="store.align('centerV')" data-tip="垂直居中" aria-label="垂直居中">
            <span v-html="ICONS.alignMiddle"></span>
          </button>
          <button @click="store.align('bottom')" data-tip="底对齐" aria-label="底对齐">
            <span v-html="ICONS.alignBottom"></span>
          </button>
        </div>

        <div class="context-section-title">分布</div>
        <div class="tool-group">
          <button
            @click="store.distribute('horizontal')"
            data-tip="水平等间距分布"
            aria-label="水平等间距分布"
          >
            <span v-html="ICONS.distributeH"></span>
          </button>
          <button
            @click="store.distribute('vertical')"
            data-tip="垂直等间距分布"
            aria-label="垂直等间距分布"
          >
            <span v-html="ICONS.distributeV"></span>
          </button>
        </div>

        <div class="context-section-title">层级</div>
        <div class="tool-group">
          <button @click="store.layerForward()" data-tip="上移一层" aria-label="上移一层">
            <span v-html="ICONS.layerUp"></span>
          </button>
          <button @click="store.layerBackward()" data-tip="下移一层" aria-label="下移一层">
            <span v-html="ICONS.layerDown"></span>
          </button>
          <button @click="store.layerToFront()" data-tip="置顶" aria-label="置顶">
            <span v-html="ICONS.layerTop"></span>
          </button>
          <button @click="store.layerToBack()" data-tip="置底" aria-label="置底">
            <span v-html="ICONS.layerBottom"></span>
          </button>
        </div>
        <div class="tool-group">
          <button @click="store.groupSelected()" data-tip="组合 (Ctrl+G)" aria-label="组合 Ctrl+G">
            <span v-html="ICONS.group"></span>
          </button>
          <button
            @click="store.ungroupSelected()"
            data-tip="取消组合 (Ctrl+Shift+G)"
            aria-label="取消组合 Ctrl+Shift+G"
          >
            <span v-html="ICONS.ungroup"></span>
          </button>
        </div>

        <template v-if="!isTextSelected">
          <div class="context-section-title">填充与边框</div>
          <div class="prop-row">
            <span class="label">填充</span>
            <input
              type="color"
              :value="store.selection.currentFill"
              @input="store.applyFill(($event.target as HTMLInputElement).value)"
              aria-label="填充颜色"
            />
          </div>
          <div class="prop-row">
            <span class="label">边框</span>
            <input
              type="color"
              :value="store.selection.currentStroke"
              @input="store.applyStroke(($event.target as HTMLInputElement).value)"
              aria-label="边框颜色"
            />
          </div>
          <div class="prop-row">
            <span class="label">粗细</span>
            <select
              class="prop-select"
              :value="store.selection.currentStrokeWidth"
              @change="store.applyStrokeWidth(+($event.target as HTMLSelectElement).value)"
              aria-label="边框粗细"
            >
              <option v-for="w in [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]" :key="w" :value="w">
                {{ w }}px
              </option>
            </select>
          </div>
          <div class="prop-row">
            <span class="label">虚线</span>
            <button
              @click="store.toggleStrokeDash()"
              data-tip="虚线"
              :class="{ active: store.selection.currentStrokeDash }"
              aria-label="切换虚线"
            >
              <span v-html="ICONS.dashed"></span>
            </button>
          </div>

          <div class="context-section-title">变换</div>
          <div class="prop-row">
            <span class="label">旋转</span>
            <div class="prop-input-group">
              <input
                type="number"
                class="prop-number"
                :value="store.selection.currentRotation"
                @change="store.applyRotation(+($event.target as HTMLInputElement).value)"
                min="-360"
                max="360"
                step="15"
                aria-label="旋转角度"
              />
              <span class="label">°</span>
            </div>
          </div>
          <div class="prop-row">
            <span class="label">透明度</span>
            <div class="prop-input-group">
              <input
                type="range"
                class="prop-range"
                :value="store.selection.currentOpacity"
                @input="store.applyOpacity(+($event.target as HTMLInputElement).value)"
                min="0"
                max="100"
                step="1"
                aria-label="透明度"
              />
              <span class="info">{{ store.selection.currentOpacity }}%</span>
            </div>
          </div>

          <div class="context-section-title">渐变</div>
          <div class="prop-row">
            <span class="label">类型</span>
            <select
              class="prop-select"
              :value="store.selection.gradientType"
              @change="setGradientType(($event.target as HTMLSelectElement).value)"
              aria-label="渐变类型"
            >
              <option value="none">纯色</option>
              <option value="linear">线性渐变</option>
              <option value="radial">径向渐变</option>
            </select>
          </div>
          <template v-if="store.selection.gradientType !== 'none'">
            <div class="prop-row">
              <span class="label">颜色1</span>
              <input
                type="color"
                :value="store.selection.gradientColor1"
                @input="setGradientColor1(($event.target as HTMLInputElement).value)"
                aria-label="渐变颜色1"
              />
            </div>
            <div class="prop-row">
              <span class="label">颜色2</span>
              <input
                type="color"
                :value="store.selection.gradientColor2"
                @input="setGradientColor2(($event.target as HTMLInputElement).value)"
                aria-label="渐变颜色2"
              />
            </div>
            <div v-if="store.selection.gradientType === 'linear'" class="prop-row">
              <span class="label">角度</span>
              <div class="prop-input-group">
                <input
                  type="number"
                  class="prop-number"
                  :value="store.selection.gradientAngle"
                  @change="setGradientAngle(+($event.target as HTMLInputElement).value)"
                  min="0"
                  max="360"
                  step="15"
                  aria-label="渐变角度"
                />
                <span class="label">°</span>
              </div>
            </div>
          </template>

          <div class="context-section-title">阴影</div>
          <div class="prop-row">
            <span class="label">启用</span>
            <button
              @click="store.toggleShadowUI()"
              data-tip="阴影"
              :class="{ active: store.selection.shadowEnabled }"
              aria-label="切换阴影"
            >
              <span v-html="ICONS.shadow"></span>
            </button>
          </div>
          <template v-if="store.selection.shadowEnabled">
            <div class="prop-row">
              <span class="label">颜色</span>
              <input
                type="color"
                :value="store.selection.shadowColor"
                @input="setShadowColor(($event.target as HTMLInputElement).value)"
                aria-label="阴影颜色"
              />
            </div>
            <div class="prop-row">
              <span class="label">模糊</span>
              <input
                type="number"
                class="prop-number"
                :value="store.selection.shadowBlur"
                @change="setShadowBlur(+($event.target as HTMLInputElement).value)"
                min="0"
                max="50"
                aria-label="阴影模糊"
              />
            </div>
            <div class="prop-row">
              <span class="label">偏移X</span>
              <input
                type="number"
                class="prop-number"
                :value="store.selection.shadowOffsetX"
                @change="setShadowOffsetX(+($event.target as HTMLInputElement).value)"
                min="-50"
                max="50"
                aria-label="阴影X偏移"
              />
            </div>
            <div class="prop-row">
              <span class="label">偏移Y</span>
              <input
                type="number"
                class="prop-number"
                :value="store.selection.shadowOffsetY"
                @change="setShadowOffsetY(+($event.target as HTMLInputElement).value)"
                min="-50"
                max="50"
                aria-label="阴影Y偏移"
              />
            </div>
          </template>
        </template>

        <template v-if="isTextSelected">
          <div class="context-section-title">文字</div>
          <div class="prop-row">
            <span class="label">字号</span>
            <select
              class="prop-select"
              :value="store.selection.currentFontSize"
              @change="store.applyFontSize(+($event.target as HTMLSelectElement).value)"
              aria-label="字号"
            >
              <option
                v-for="s in [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96]"
                :key="s"
                :value="s"
              >
                {{ s }}
              </option>
            </select>
          </div>
          <div class="prop-row">
            <span class="label">样式</span>
            <div class="tool-group">
              <button
                @click="store.toggleBold()"
                data-tip="加粗"
                :class="{ active: store.selection.currentFontWeight === 'bold' }"
                aria-label="加粗 Ctrl+B"
              >
                <span v-html="ICONS.bold"></span>
              </button>
              <button
                @click="store.toggleItalic()"
                data-tip="斜体"
                :class="{ active: store.selection.currentFontStyle === 'italic' }"
                aria-label="斜体 Ctrl+I"
              >
                <span v-html="ICONS.italic"></span>
              </button>
              <button
                @click="store.toggleUnderline()"
                data-tip="下划线"
                :class="{ active: store.selection.currentUnderline }"
                aria-label="下划线 Ctrl+U"
              >
                <span v-html="ICONS.underline"></span>
              </button>
            </div>
          </div>
          <div class="prop-row">
            <span class="label">颜色</span>
            <input
              type="color"
              :value="store.selection.currentTextFill"
              @input="store.applyTextFill(($event.target as HTMLInputElement).value)"
              aria-label="文字颜色"
            />
          </div>
          <div class="prop-row">
            <span class="label">对齐</span>
            <div class="tool-group">
              <button
                @click="store.applyTextAlign('left')"
                data-tip="文字左对齐"
                :class="{ active: store.selection.currentTextAlign === 'left' }"
                aria-label="左对齐"
              >
                <span v-html="ICONS.textLeft"></span>
              </button>
              <button
                @click="store.applyTextAlign('center')"
                data-tip="文字居中"
                :class="{ active: store.selection.currentTextAlign === 'center' }"
                aria-label="居中"
              >
                <span v-html="ICONS.textCenter"></span>
              </button>
              <button
                @click="store.applyTextAlign('right')"
                data-tip="文字右对齐"
                :class="{ active: store.selection.currentTextAlign === 'right' }"
                aria-label="右对齐"
              >
                <span v-html="ICONS.textRight"></span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ── 根容器：始终占位固定宽度 ── */
.context-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 30;
  width: 220px;
  /* 允许折叠按钮凸出到面板左边界外，滚动下沉到 .context-scroll */
  overflow: visible;
  padding: 0;
  transition: width 0.2s ease;
}

/* 展开内容的滚动容器：独立滚动，避免裁切凸出的折叠按钮 */
.context-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── 折叠状态：缩成窄条 ── */
.context-panel.collapsed {
  width: 40px;
  overflow: hidden;
}

/* ── 亮色/暗色主题 ── */
.context-panel.context-light {
  background: linear-gradient(180deg, #f0f1f3 0%, #e8eaed 100%);
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}
.context-panel.context-dark {
  background: linear-gradient(180deg, #1e1e1e 0%, #1c1c1c 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}

/* ── 折叠按钮（圆角胶囊把手，凸出面板边界，z-index 高于标尺层）── */
.floating-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -20px;
  z-index: 20;
  width: 20px;
  height: 64px;
  border: 1px solid;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  padding: 0;
}
/* 折叠态：按钮在面板内部居中 */
.context-panel.collapsed .floating-toggle {
  left: 50%;
  transform: translate(-50%, -50%);
}

.context-light .floating-toggle {
  color: #5f6b7a;
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
}
.context-light .floating-toggle:hover {
  color: #2563eb;
  background: #ffffff;
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.18);
}
.context-dark .floating-toggle {
  color: #aab0b8;
  background: rgba(45, 45, 45, 0.92);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.context-dark .floating-toggle:hover {
  color: #60a5fa;
  background: rgba(58, 58, 58, 0.95);
  border-color: rgba(96, 165, 250, 0.42);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
}
.floating-toggle span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.floating-toggle span svg {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

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
.empty-icon {
  margin-bottom: 12px;
  opacity: 0.5;
}
.empty-icon span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-icon :deep(svg) {
  width: 40px;
  height: 40px;
  stroke-width: 1.5;
}
.empty-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.context-light .empty-title {
  color: #555;
}
.context-dark .empty-title {
  color: #888;
}
.empty-hint {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}
.context-light .empty-hint {
  color: #999;
}
.context-dark .empty-hint {
  color: #555;
}

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
.context-light .context-section-title {
  color: #999;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.context-dark .context-section-title {
  color: #555;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.context-section-title:first-child {
  margin-top: 0;
}

/* ── 工具按钮组 ── */
.tool-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tool-group button {
  min-width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  padding: 0 4px;
}
.context-light .tool-group button {
  background: rgba(0, 0, 0, 0.04);
  color: #666;
}
.context-light .tool-group button:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #333;
}
.context-light .tool-group button.active {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}
.context-dark .tool-group button {
  background: rgba(255, 255, 255, 0.03);
  color: #999;
}
.context-dark .tool-group button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}
.context-dark .tool-group button.active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}
.tool-group button:active {
  transform: scale(0.95);
}
.tool-group button span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-group button span svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

/* ── 属性行 ── */
.prop-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  min-height: 30px;
}
.context-light .prop-row .label {
  color: #555;
}
.context-dark .prop-row .label {
  color: #777;
}
.prop-row .label {
  font-size: 13px;
  flex-shrink: 0;
}
.prop-row input[type='color'] {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  background: transparent;
}
.context-light .prop-row input[type='color'] {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.context-dark .prop-row input[type='color'] {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.prop-row .prop-select {
  width: 64px;
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  padding: 0 6px;
}
.context-light .prop-row .prop-select {
  background: #fff;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.context-dark .prop-row .prop-select {
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.prop-row .prop-select:focus {
  border-color: #3b82f6;
  outline: none;
}
.prop-row .prop-number {
  width: 52px;
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  padding: 0 6px;
  -moz-appearance: textfield;
}
.context-light .prop-row .prop-number {
  background: #fff;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.context-dark .prop-row .prop-number {
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.prop-row .prop-number:focus {
  border-color: #3b82f6;
  outline: none;
}
.prop-row .prop-number::-webkit-inner-spin-button,
.prop-row .prop-number::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.prop-row .prop-range {
  width: 64px;
  height: 4px;
  cursor: pointer;
  accent-color: #3b82f6;
}
.context-light .prop-row .info {
  color: #999;
}
.context-dark .prop-row .info {
  color: #666;
}
.prop-row .info {
  font-size: 12px;
  min-width: 30px;
  text-align: right;
}
.prop-row .prop-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Tooltip：hover 500ms 后弹出，mouseleave 立即消失 ── */
[data-tip] {
  position: relative;
}
[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.15s ease;
}
[data-tip]:hover::after {
  opacity: 1;
  transition-delay: 0.5s;
}
.context-light [data-tip]::after {
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
}
.context-dark [data-tip]::after {
  background: rgba(255, 255, 255, 0.9);
  color: #222;
}
</style>
