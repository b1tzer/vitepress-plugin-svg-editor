/**
 * vitepress-plugin-svg-editor — Client 端入口
 *
 * 导出 SvgDiagram / SvgEditor Vue 组件，供 VitePress theme 注册。
 * 注意：此文件从 src 源码直接导出，由消费方的 Vite 编译器处理 .vue 文件。
 */

export { default as SvgDiagram } from './src/components/SvgDiagram.vue'
export { default as SvgEditor } from './src/components/SvgEditor.vue'
