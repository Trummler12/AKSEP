import { test, expect } from '@playwright/test'

test.describe('navigation behaviour', () => {
  test('desktop dropdown hover and keyboard interaction', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await expect(page).toHaveURL(/\.start$/)

    const dropdownTrigger = page.getByRole('button', { name: 'Begriffe' })
    await dropdownTrigger.hover()
    await expect(page.getByRole('menu', { name: 'Begriffe Menü' })).toBeVisible()

    await dropdownTrigger.focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('menuitem', { name: /Warum Begriffklärungen/i })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dropdownTrigger).toBeFocused()
  })

  test('moves overflowing items into overflow menu', async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { __forceOverflowWidth?: number }).__forceOverflowWidth = 240
    })
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/.start')
    const overflowButton = page.getByRole('button', { name: 'Weitere Navigation' })
    await expect(overflowButton).toBeVisible()
    await overflowButton.click()
    await expect(page.getByRole('link', { name: 'Mitmachen' })).toBeVisible()
  })

  test('mobile drawer opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 720 })
    await page.goto('/.start')
    const toggle = page.getByRole('button', { name: /Navigation/ })
    await toggle.click()
    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' })
    await expect(mobileNav).toBeVisible()
    const begriffeSummary = mobileNav.locator('summary', { hasText: 'Begriffe' })
    await begriffeSummary.click()
    await expect(page.getByRole('link', { name: 'Warum Begriffklärungen wichtig sind' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(mobileNav).toBeHidden()
  })

  test('root path redirects to /.start', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\.start$/)
  })
})
