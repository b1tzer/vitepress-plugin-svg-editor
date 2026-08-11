<script setup lang="ts">
/**
 * 编辑器画布子组件
 *
 * 职责：渲染 Fabric.js Canvas 元素 + 加载态提示
 * 父组件通过 ref 绑定 canvasEl 来获取 canvas 元素引用
 */

import { ref } from 'vue'

defineProps<{
  loading: boolean
}>()

const canvasContainerRef = ref<HTMLDivElement | null>(null)

defineExpose({ canvasContainerRef })
</script>

<template>
  <div class="editor-canvas" ref="canvasContainerRef">
    <canvas />
    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<style scoped>
.editor-canvas {
  flex: 1; position: relative; overflow: hidden;
}
.editor-canvas canvas {
  position: absolute; top: 0; left: 0;
  width: 100% !important; height: 100% !important;
}
.loading {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: #111; color: #555; font-size: 13px;
}
</style>
