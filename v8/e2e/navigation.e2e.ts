import { expect, test } from '@playwright/test'

test.describe('AKSEP navigation', () => {
  test('redirects / to /.start', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/.start')
    expect(new URL(page.url()).pathname).toBe('/.start')
  })

  test('opens dropdown on hover and supports keyboard navigation', async ({ page }) => {
    await page.goto('/.start')
    const programmTrigger = page.getByRole('menuitem', { name: 'Programm' })

    await programmTrigger.hover()
    await expect(page.getByRole('menuitem', { name: 'Präambel' })).toBeVisible()

    await programmTrigger.focus()
    await programmTrigger.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('menuitem', { name: 'Präambel' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(programmTrigger).toBeFocused()
  })

  test('moves items into overflow menu when viewport shrinks', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/.start')
    const overflowTrigger = page.getByRole('button', { name: /Weitere Navigation/ })
    await expect(overflowTrigger).toBeHidden()

    await page.setViewportSize({ width: 1000, height: 800 })
    await page.waitForTimeout(150)
    await expect(overflowTrigger).toBeVisible()
  })

  test('opens mobile drawer with accordions', async ({ page }) => {
    await page.setViewportSize({ width: 840, height: 900 })
    await page.goto('/.start')

    const mobileToggle = page.getByRole('button', { name: 'Menü öffnen' })
    await mobileToggle.click()
    const drawer = page.getByRole('dialog', { name: 'Menü' })
    await expect(drawer).toBeVisible()

    const programmAccordion = drawer.getByRole('button', { name: 'Programm' })
    await programmAccordion.click()
    await expect(drawer.getByRole('link', { name: 'Präambel' })).toBeVisible()

    await drawer.getByRole('button', { name: 'Schließen' }).click()
    await expect(drawer).toBeHidden()
  })
})
