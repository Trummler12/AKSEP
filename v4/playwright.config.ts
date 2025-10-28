import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:5173' },
  webServer: [
    { command: 'npm run build', reuseExistingServer: false },
    { command: 'npm run preview', port: 5173, reuseExistingServer: !process.env.CI }
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
})
