import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      // 开发服务器：examples/basic 自包含样例（不依赖外部文档站）
      command: 'cd examples/basic && pnpm docs:dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      // build-preview.spec.ts 专用：生产构建 + 预览
      command: 'cd examples/basic && pnpm docs:build && pnpm docs:preview',
      port: 4173,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
  projects: [
    { name: 'chromium', testIgnore: /performance-regression\.spec\.ts/ },
    { name: 'firefox', testIgnore: /performance-regression\.spec\.ts/ },
    { name: 'perf', use: { browserName: 'chromium' }, testMatch: /performance-regression\.spec\.ts/ },
  ],
})
