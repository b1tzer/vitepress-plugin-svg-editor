<script setup lang="ts">
/**
 * 左侧面板子组件（Figma 式左侧边栏）
 *
 * 职责：元素清单 + 图层面板，支持标签切换和折叠
 * 参考：vue-fabric-editor 的 left-bar 设计
 * 所有图标使用 Lucide 风格 SVG（与 ICONS 库统一）
 */

import { ref, computed } from 'vue'
import { ICONS } from '../../core/shared/icons'

const props = defineProps<{
  canvasObjects: Array<{ id: string; type: string; name: string; visible: boolean }>
  collapsed: boolean
  themeMode: string
}>()

const emit = defineEmits<{
  (e: 'toggleCollapse'): void
  (e: 'addElement', type: string): void
  (e: 'toggleLayerVisibility', id: string): void
  (e: 'selectLayer', id: string): void
}>()

const activeTab = ref<'elements' | 'layers'>('elements')
const isLight = computed(() => props.themeMode === 'light')

/** 预置元素清单（icon 值为 ICONS 中的 key） */
const elementGroups = [
  {
    label: '基础形状',
    items: [
      { type: 'rect', name: '矩形', icon: 'shapeRect' },
      { type: 'circle', name: '圆形', icon: 'shapeCircle' },
      { type: 'triangle', name: '三角形', icon: 'shapeTriangle' },
      { type: 'ellipse', name: '椭圆', icon: 'shapeEllipse' },
      { type: 'line', name: '直线', icon: 'shapeLine' },
    ],
  },
  {
    label: '文本',
    items: [
      { type: 'text', name: '文本', icon: 'bold' },
      { type: 'textbox', name: '文本框', icon: 'textLeft' },
    ],
  },
]

const reversedLayers = computed(() => [...props.canvasObjects].reverse())

/** 图层类型图标 key */
function layerIconKey(type: string): string {
  return type === 'text' || type === 'textbox' ? 'bold' : 'shapes'
}
</script>

<template>
  <aside
    class="left-panel"
    :class="[isLight ? 'left-light' : 'left-dark', { collapsed }]"
    aria-label="左侧面板"
  >
    <!-- 折叠时：圆形展开按钮垂直居中 -->
    <button
      v-if="collapsed"
      class="floating-toggle"
      data-tip="展开左侧面板"
      @click="emit('toggleCollapse')"
      aria-label="展开左侧面板"
    >
      <span v-html="ICONS.chevronRight"></span>
    </button>

    <!-- 展开时：标签栏 + 内容区 + 圆形折叠按钮 -->
    <template v-else>
      <nav class="tab-nav">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'elements' }"
          @click="activeTab = 'elements'"
          data-tip="元素"
          aria-label="元素"
        >
          <span class="tab-icon" v-html="ICONS.shapes"></span>
          <span class="tab-label">元素</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'layers' }"
          @click="activeTab = 'layers'"
          data-tip="图层"
          aria-label="图层"
        >
          <span class="tab-icon" v-html="ICONS.layers"></span>
          <span class="tab-label">图层</span>
        </button>
      </nav>

      <div class="tab-content">
        <!-- 圆形折叠按钮（绝对定位在右边界） -->
        <button
          class="floating-toggle"
          data-tip="折叠左侧面板"
          @click="emit('toggleCollapse')"
          aria-label="折叠左侧面板"
        >
          <span v-html="ICONS.chevronLeft"></span>
        </button>

        <!-- 元素清单 -->
        <div v-if="activeTab === 'elements'" class="elements-view">
          <div class="section-search">
            <span class="search-icon" v-html="ICONS.search"></span>
            <input
              type="text"
              class="search-input"
              placeholder="搜索元素..."
              aria-label="搜索元素"
            />
          </div>
          <div v-for="group in elementGroups" :key="group.label" class="element-group">
            <div class="group-title">{{ group.label }}</div>
            <div class="element-grid">
              <button
                v-for="el in group.items"
                :key="el.type"
                class="element-card"
                @click="emit('addElement', el.type)"
                :data-tip="el.name"
                :aria-label="'添加' + el.name"
              >
                <span class="element-preview" v-html="ICONS[el.icon]"></span>
                <span class="element-name">{{ el.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 图层面板 -->
        <div v-if="activeTab === 'layers'" class="layers-view">
          <div class="layers-header">
            <span class="layers-count">{{ canvasObjects.length }} 个图层</span>
          </div>
          <div v-if="canvasObjects.length === 0" class="layers-empty">
            <span class="empty-hint">画布上还没有元素</span>
          </div>
          <div v-else class="layer-list">
            <div
              v-for="obj in reversedLayers"
              :key="obj.id"
              class="layer-item"
              @click="emit('selectLayer', obj.id)"
            >
              <span class="layer-type-icon" v-html="ICONS[layerIconKey(obj.type)]"></span>
              <span class="layer-name">{{ obj.name }}</span>
              <button
                class="layer-visibility-btn"
                @click.stop="emit('toggleLayerVisibility', obj.id)"
                :data-tip="obj.visible ? '隐藏' : '显示'"
                :aria-label="obj.visible ? '隐藏图层' : '显示图层'"
              >
                <span v-if="obj.visible" v-html="ICONS.eye"></span>
                <span v-else v-html="ICONS.eyeOff"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </aside>
</template>

<style scoped>
/* ── 根容器 ── */
.left-panel {
  position: relative;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  transition: width 0.2s ease;
  overflow: hidden;
}

.left-panel:not(.collapsed) {
  width: 360px;
}
.left-panel.collapsed {
  width: 40px;
}

/* ── 明暗主题 ── */
.left-dark {
  background: #1a1a1a;
}
.left-light {
  background: #f0f1f3;
}

/* ── 折叠按钮（20×64 直角竖条，参考站 close-btn 1:1 复刻）── */
.floating-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 20px;
  height: 64px;
  border: none;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  padding: 0;
  background: transparent;
}
/* 展开态：右边界外侧 */
.floating-toggle {
  right: -20px;
}
/* 折叠态：面板中间 */
.left-panel.collapsed .floating-toggle {
  right: auto;
  left: 50%;
  transform: translate(-50%, -50%);
}

.left-dark .floating-toggle {
  color: #999;
}
.left-dark .floating-toggle:hover {
  color: #5cadff;
}
.left-light .floating-toggle {
  color: #515a6e;
}
.left-light .floating-toggle:hover {
  color: #2d8cf0;
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

/* ── 标签导航（65px 竖排） ── */
.tab-nav {
  width: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0;
  flex-shrink: 0;
  border-right: 1px solid;
}
.left-dark .tab-nav {
  border-color: rgba(255, 255, 255, 0.05);
}
.left-light .tab-nav {
  border-color: rgba(0, 0, 0, 0.06);
}

.tab-btn {
  width: 53px;
  height: 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: all 0.15s ease;
  background: transparent;
}
.left-dark .tab-btn {
  color: #777;
}
.left-light .tab-btn {
  color: #888;
}
.left-dark .tab-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ccc;
}
.left-light .tab-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #555;
}
.left-dark .tab-btn.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}
.left-light .tab-btn.active {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon :deep(svg) {
  width: 20px;
  height: 20px;
  stroke-width: 1.8;
}
.tab-label {
  font-size: 12px;
}

/* ── 内容区 ── */
.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ── 搜索栏 ── */
.section-search {
  position: relative;
  margin: 12px 12px;
}
.search-icon {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.search-icon :deep(svg) {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  opacity: 0.5;
}
.search-input {
  width: 100%;
  height: 32px;
  padding: 0 10px 0 32px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}
.left-dark .search-input {
  background: rgba(255, 255, 255, 0.04);
  color: #ccc;
  border-color: rgba(255, 255, 255, 0.08);
}
.left-light .search-input {
  background: #fff;
  color: #333;
  border-color: rgba(0, 0, 0, 0.1);
}
.left-dark .search-input::placeholder {
  color: #555;
}
.left-light .search-input::placeholder {
  color: #aaa;
}

/* ── 元素视图 ── */
.elements-view {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 16px;
}

.element-group {
  margin-bottom: 16px;
}
.group-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.left-dark .group-title {
  color: #888;
}
.left-light .group-title {
  color: #666;
}

.element-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.element-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 4px;
  border: 1px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: transparent;
  min-height: 68px;
}
.left-dark .element-card {
  border-color: rgba(255, 255, 255, 0.06);
  color: #999;
}
.left-dark .element-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  color: #e0e0e0;
}
.left-light .element-card {
  border-color: rgba(0, 0, 0, 0.08);
  color: #666;
}
.left-light .element-card:hover {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.15);
  color: #333;
}

.element-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}
.element-preview :deep(svg) {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}
.element-name {
  font-size: 12px;
}

/* ── 图层视图 ── */
.layers-view {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 16px;
}

.layers-header {
  padding: 8px 4px;
}
.layers-count {
  font-size: 13px;
}
.left-dark .layers-count {
  color: #777;
}
.left-light .layers-count {
  color: #888;
}

.layers-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}
.empty-hint {
  font-size: 13px;
}
.left-dark .empty-hint {
  color: #555;
}
.left-light .empty-hint {
  color: #aaa;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.left-dark .layer-item:hover {
  background: rgba(255, 255, 255, 0.04);
}
.left-light .layer-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.layer-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}
.layer-type-icon :deep(svg) {
  width: 14px;
  height: 14px;
  stroke-width: 2;
}
.left-dark .layer-type-icon {
  color: #888;
}
.left-light .layer-type-icon {
  color: #999;
}

.layer-name {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.left-dark .layer-name {
  color: #ccc;
}
.left-light .layer-name {
  color: #333;
}

.layer-visibility-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.layer-visibility-btn:hover {
  opacity: 1;
}
.left-dark .layer-visibility-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.left-light .layer-visibility-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}
.layer-visibility-btn span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.layer-visibility-btn :deep(svg) {
  width: 15px;
  height: 15px;
  stroke-width: 1.8;
}
</style>
