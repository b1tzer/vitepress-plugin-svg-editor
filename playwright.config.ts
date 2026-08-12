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
      command: 'cd /data/home/lipingxie/project/java-world2/java-world && npm run dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      // build-preview.spec.ts 专用
      command: 'cd /data/home/lipingxie/project/java-world2/java-world && npm run build && npm run preview',
      port: 4173,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
  ],
})
