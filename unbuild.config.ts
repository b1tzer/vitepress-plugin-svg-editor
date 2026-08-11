import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/node/index', name: 'node/index' },
  ],
  declaration: false,
  clean: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  externals: [
    'vite',
    'vue',
    'fabric',
    'vitepress',
    'markdown-it',
    /^@types\/.*/,
  ],
})
