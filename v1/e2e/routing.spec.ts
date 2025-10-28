import { expect, test } from '@playwright/test'

test('redirects from root to /.start', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('**/.start')
  await expect(page).toHaveURL(/\/\.start$/)
})
