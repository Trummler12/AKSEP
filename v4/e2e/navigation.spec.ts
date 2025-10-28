import { test, expect } from '@playwright/test'

test.describe('Navigation and routing', () => {
  test('redirects / to /.start', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\.start$/)
    await expect(page.getByRole('heading', { name: /Informationspolitik/i })).toBeVisible()
  })

  test('desktop dropdown opens on hover and supports keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/.start')

    const programmTrigger = page.getByRole('menuitem', { name: 'Programm' })
    await programmTrigger.hover()
    await expect(page.getByRole('menuitem', { name: 'Präambel' })).toBeVisible()

    await programmTrigger.press('Escape')
    await expect(programmTrigger).toBeFocused()

    await programmTrigger.press('ArrowDown')
    await expect(page.getByRole('menuitem', { name: 'Präambel' })).toBeFocused()
  })

  test('items overflow into three-dots menu on narrow width', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto('/.start')
    const overflowButton = page.getByRole('button', { name: 'Weitere Navigation' })
    await expect(overflowButton).toBeVisible()

    await overflowButton.click()
    await expect(page.getByRole('menu').getByRole('link', { name: 'Aktuelles' })).toBeVisible()
  })

  test('mobile drawer opens and accordions expand', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 })
    await page.goto('/.start')

    await page.getByRole('button', { name: 'Navigation öffnen' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menü' })
    await expect(dialog).toBeVisible()

    const programmAccordion = dialog.getByRole('button', { name: 'Unterpunkte anzeigen' }).first()
    await programmAccordion.click()
    await expect(dialog.getByRole('link', { name: 'Präambel' })).toBeVisible()

    await dialog.getByRole('button', { name: 'Navigation schließen' }).click()
    await expect(dialog).not.toBeVisible()
  })
})
