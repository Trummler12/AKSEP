import { test, expect } from '@playwright/test'

test.describe('Navigation behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/.start')
  })

  test('redirects root to /.start', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/\.start$/)
  })

  test('desktop dropdown supports hover and keyboard navigation', async ({ page }) => {
    const programmTrigger = page.getByRole('menuitem', { name: 'Programm' })
    await programmTrigger.focus()
    await page.keyboard.press('ArrowDown')
    const programmMenu = page.getByRole('menu', { name: 'Programm Untermenü' })
    await expect(programmMenu).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(programmTrigger).toBeFocused()
    await expect(programmMenu).toBeHidden()
  })

  test('overflow menu appears on constrained width', async ({ page }) => {
    await page.setViewportSize({ width: 980, height: 720 })
    await page.getByRole('menuitem', { name: 'Programm' }).waitFor({ state: 'visible' })
    await page.evaluate(() => {
      const primary = document.querySelector<HTMLElement>('.navigation__primary')
      if (primary) {
        primary.style.setProperty('width', '260px', 'important')
        primary.style.setProperty('flex', '0 0 260px', 'important')
        primary.style.setProperty('maxWidth', '260px', 'important')
      }
      window.dispatchEvent(new Event('resize'))
    })
    const overflowTrigger = page.locator('button[aria-label="Weitere Navigation"]')
    await expect(overflowTrigger).toBeVisible()
    await expect(overflowTrigger).toBeEnabled({ timeout: 7000 })
    await overflowTrigger.focus()
    await page.keyboard.press('ArrowDown')
    const overflowMenu = page.getByRole('menu', { name: 'Weitere Navigation' })
    await expect(overflowMenu).toBeVisible()
    await expect(overflowMenu.getByRole('menuitem', { name: 'Mitmachen' }).first()).toBeVisible()
  })

  test('mobile drawer opens and accordions expand', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 720 })
    const mobileToggle = page.locator('button[aria-label="Navigation öffnen"]')
    await mobileToggle.waitFor({ state: 'visible' })
    await mobileToggle.click()
    const sheet = page.locator('.navigation__mobile-sheet')
    await expect(sheet).toBeVisible()

    const firstSection = sheet.getByRole('button', { name: 'Begriffe' })
    await firstSection.click()
    await expect(sheet.getByRole('link', { name: 'Rechts vs. Links' })).toBeVisible()

    await sheet.getByRole('button', { name: 'Schliessen' }).click()
    await expect(sheet).toBeHidden()
  })
})
