import DefaultTheme from 'vitepress/theme'
import { SvgDiagram, SvgEditor } from 'vitepress-plugin-svg-editor/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SvgDiagram', SvgDiagram)
    app.component('SvgEditor', SvgEditor)
  },
}
