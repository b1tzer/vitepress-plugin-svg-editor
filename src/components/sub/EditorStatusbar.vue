<script setup lang="ts">
/**
 * 编辑器状态栏子组件
 *
 * 职责：显示缩放级别、选中对象信息、画布尺寸等底层状态
 */
defineProps<{
  zoomLevel: number
  svgWidth: number
  svgHeight: number
  selectionInfo: string
}>()
</script>

<template>
  <div class="editor-statusbar">
    <span class="info zoom" data-tip="缩放级别">{{ zoomLevel }}%</span>
    <span class="info size" data-tip="SVG 画布尺寸">{{ svgWidth }} × {{ svgHeight }}px</span>
    <span v-if="selectionInfo" class="info selection">{{ selectionInfo }}</span>
  </div>
</template>

<style scoped>
.editor-statusbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 12px;
  font-size: 12px;
  color: #888;
  background: #111;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  user-select: none;
}

.info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoom { min-width: 48px; }
.size { min-width: 120px; }
.selection { color: #aaa; font-weight: 500; }
</style>