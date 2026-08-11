/**
 * vitepress-plugin-svg-editor — Client 端入口（向后兼容）
 *
 * 重新导出 src/client/index.ts 中的公共 API。
 * 推荐直接使用 import { enhanceApp } from 'vitepress-plugin-svg-editor/client'
 */

export { SvgDiagram, SvgEditor, enhanceAppWithSvgEditor, enhanceApp } from './src/client/index'
