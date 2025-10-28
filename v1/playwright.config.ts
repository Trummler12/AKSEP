import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4173' },
  webServer: [
    { command: 'npm run build', reuseExistingServer: false },
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 4173',
      port: 4173,
      reuseExistingServer: !process.env.CI
    }
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
})
