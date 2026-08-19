import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      'examples/**/dist/**',
    ],
  },
  // 基础 JS 推荐规则
  js.configs.recommended,
  // TypeScript 推荐规则
  ...tseslint.configs.recommended,
  // Vue 3 推荐规则（flat 配置）
  ...pluginVue.configs['flat/recommended'],
  // 全局环境：同时覆盖浏览器端（.vue/client）与 Node 端（插件/构建脚本）
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vite define 注入的构建时常量（类型声明见 src/env.d.ts）
        __SVG_EDITOR_STORAGE__: 'readonly',
        __SVG_EDITOR_SAVE_ENDPOINT__: 'readonly',
        __SVG_EDITOR_E2E__: 'readonly',
        __SVG_EDITOR_MAP_HEX_TO_VAR__: 'readonly',
      },
    },
  },
  // .vue 文件：外层用 vue-eslint-parser，内层委托 tseslint 解析 <script lang="ts">
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },
  // 项目定制规则
  {
    rules: {
      // Fabric.js 类型边界较宽松，显式 any 降为 warn（标准之上仍保留提醒）
      '@typescript-eslint/no-explicit-any': 'warn',
      // 未使用变量降为 warn，允许下划线前缀参数
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 组件名不强制 multi-word（SvgEditor / SvgDiagram 等为单词组件）
      'vue/multi-word-component-names': 'off',
      // 源码中 console 需提醒（测试与示例除外）
      'no-console': 'warn',
    },
  },
  // 测试与示例文件允许 console（测试输出属正常行为）
  {
    files: ['tests/**', '**/*.test.ts', '**/*.spec.ts', 'examples/**'],
    rules: {
      'no-console': 'off',
    },
  },
  // Prettier 冲突规则关闭（必须放在最后）
  eslintConfigPrettier
)
