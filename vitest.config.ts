import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/components/**/*.test.ts', 'src/adapters/**/*.test.ts'],
    exclude: ['tests/*.spec.ts', 'tests/**/screenshots/**', 'node_modules/**', 'dist/**'],
    deps: {
      inline: ['vitepress'],
    },
    coverage: {
      provider: 'v8',
      include: ['src/core/**', 'src/adapters/**', 'src/plugins/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
