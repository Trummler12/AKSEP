import { expect, test } from '@playwright/test'

test.describe('Desktop navigation interactions', () => {
  test('opens dropdown on hover and supports keyboard control', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/.start')

    const programmTrigger = page.getByRole('menuitem', { name: 'Programm' })
    const programmMenu = page.getByRole('menu', { name: 'Programm Untermenü' })

    await programmTrigger.hover()
    await expect(programmMenu).toBeVisible()

    await programmTrigger.focus()
    await programmTrigger.press('Escape')
    await expect(programmMenu).toHaveCount(0)

    await programmTrigger.press('ArrowDown')

    const praembelLink = page.getByRole('menuitem', { name: 'Präambel' })
    await expect(praembelLink).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(programmTrigger).toBeFocused()
    await expect(programmMenu).toHaveCount(0)
  })

  test('moves items into overflow menu when width shrinks', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/.start')

    const overflowContainer = page.locator('.navigation__overflow')
    await expect(overflowContainer).toHaveAttribute('data-visible', 'false')

    await page.addStyleTag({ content: '.navigation__inner { max-width: 760px !important; }' })
    await page.evaluate(() => window.dispatchEvent(new Event('resize')))
    await expect(overflowContainer).toHaveAttribute('data-visible', 'true')

    await expect(page.locator('nav .navigation__list').getByRole('menuitem', { name: 'Mitmachen' })).toHaveCount(0)

    const overflowTrigger = page.getByRole('button', { name: 'Weitere Navigation' })
    await expect(overflowTrigger).toBeVisible()
    await expect(overflowTrigger).toBeEnabled()
  })
})

test.describe('Mobile navigation drawer', () => {
  test.use({ viewport: { width: 480, height: 900 } })

  test('opens drawer and toggles accordions', async ({ page }) => {
    await page.goto('/.start')

    const openButton = page.getByRole('button', { name: 'Menü öffnen' })
    await openButton.click()

    const dialog = page.getByRole('dialog', { name: 'Menü' })
    await expect(dialog).toBeVisible()

    const programmSection = page.getByRole('button', { name: 'Programm' })
    await programmSection.click()

    await expect(page.getByRole('link', { name: 'Übersicht: Programm' })).toBeVisible()

    const closeButton = page.getByRole('button', { name: 'Menü schließen' })
    await closeButton.click()

    await expect(dialog).toHaveCount(0)
  })
})
