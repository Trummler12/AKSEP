import { expect, test } from '@playwright/test'

const heroHeading = 'Für eine informierte und transparente Politik'

test.describe('AKSEP navigation & routing', () => {
  test('redirects / to /.start', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/\.start$/)
    await expect(page.getByRole('heading', { name: heroHeading, level: 1 })).toBeVisible()
  })

  test('desktop dropdown supports hover and keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/.start')

    const begriffeTrigger = page
      .locator('.navigation__trigger', { hasText: 'Begriffe' })
      .first()
    await begriffeTrigger.hover()
    const firstSubItem = page
      .locator('.navigation__dropdown-link', { hasText: 'Warum Begriffklärungen wichtig sind' })
      .first()
    await expect(firstSubItem).toBeVisible()

    await begriffeTrigger.focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator(':focus')).toHaveAttribute('data-nav-subitem', 'true')

    await page.keyboard.press('Escape')
    await expect(begriffeTrigger).toBeFocused()
  })

  test('items overflow into three-dots menu on narrow viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('/.start')

    await page.waitForFunction(() =>
      Boolean((window as typeof window & { __AKSEP_OVERFLOW_DEBUG?: unknown }).__AKSEP_OVERFLOW_DEBUG),
    )
    await page.evaluate(() => {
      ;(window as typeof window & {
        __AKSEP_OVERFLOW_DEBUG?: { setOverflow: (keys: string[] | null) => void }
      }).__AKSEP_OVERFLOW_DEBUG?.setOverflow(['mitmachen', 'aktuelles'])
    })

    const overflowTrigger = page.locator('.navigation__overflow-trigger')
    await expect(overflowTrigger).toHaveAttribute('data-visible', 'true')
    await expect(overflowTrigger).toHaveAttribute('data-overflowing', 'true')
    await expect(overflowTrigger).toBeEnabled()
    await expect(overflowTrigger).toBeVisible()

    await overflowTrigger.click()
    const overflowMenu = page.locator('.navigation__overflow-menu')
    await expect(overflowMenu).toBeVisible()
    await expect(overflowMenu).toContainText('Mitmachen')

    await page.evaluate(() => {
      ;(window as typeof window & {
        __AKSEP_OVERFLOW_DEBUG?: { setOverflow: (keys: string[] | null) => void }
      }).__AKSEP_OVERFLOW_DEBUG?.setOverflow(null)
    })
  })

  test('mobile drawer opens via hamburger toggle', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 })
    await page.goto('/.start')

    const mobileToggle = page.locator('.navigation__mobile-toggle')
    await expect(mobileToggle).toBeVisible()
    await mobileToggle.click()

    const drawer = page.locator('.navigation__mobile-drawer')
    await expect(drawer).toBeVisible()

    const programmButton = drawer.getByRole('button', { name: 'Programm' })
    await programmButton.click()
    const panelId = await programmButton.getAttribute('aria-controls')
    const programmPanel = drawer.locator(`#${panelId}`)
    await expect(programmPanel).toBeVisible()

    await page.locator('.navigation__mobile-close').click()
    await expect(drawer).toBeHidden()
  })
})
