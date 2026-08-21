import { defineConfig } from '@playwright/test'

// E2E 服务端口改为可配置：优先读环境变量 PORT，未指定时回退到默认 5173。
// 例如端口被占用时可 `PORT=5180 pnpm test` 切换，preview 服务与 baseURL 会自动跟随。
const PORT = process.env.PORT || '5173'
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  // 并发执行：E2E 已切换到 preview 静态服务（无 HMR/按需编译，天然抗并发），
  // overlay 残留（关闭按钮选择器错误）也已修复，可安全并行提速。
  // 每个 worker 拥有独立浏览器 context，window.__fabricCanvas 等测试钩子互不串扰。
  workers: 4,
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      // 生产构建 + 预览服务器（替代 dev server）：
      //   - SVG_EDITOR_E2E=1 注入 __SVG_EDITOR_E2E__，让静态产物也能暴露
      //     window.__fabricCanvas 等测试钩子（详见 src/core/shared/testHooks.ts）。
      //   - preview 是静态服务，无 HMR 心跳、无按需编译，加载快、内存低、天然抗并发，
      //     避免 dev server 在 8 worker 下被压垮（ERR_CONNECTION_REFUSED）的根因。
      command: `cd examples/basic && SVG_EDITOR_E2E=1 vitepress build docs && vitepress preview docs --port ${PORT}`,
      port: Number(PORT),
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  projects: [
    { name: 'chromium', testIgnore: /performance-regression\.spec\.ts/ },
    { name: 'firefox', testIgnore: /performance-regression\.spec\.ts/ },
    {
      name: 'perf',
      use: { browserName: 'chromium' },
      testMatch: /performance-regression\.spec\.ts/,
    },
  ],
})
