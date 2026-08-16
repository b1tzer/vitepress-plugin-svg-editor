import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/node/index', 'src/plugins/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  externals: ['vite', 'vue', 'fabric', 'vitepress', 'markdown-it', /^@types\/.*/],
})
