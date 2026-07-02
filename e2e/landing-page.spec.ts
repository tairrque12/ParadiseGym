import { test, expect } from '@playwright/test'

const NAV_SECTIONS = [
  { link: 'Amenities', id: 'amenities' },
  { link: 'Pricing', id: 'pricing' },
  { link: 'Reviews', id: 'reviews' },
  { link: 'Hours', id: 'hours' },
] as const

test.describe('Landing page', () => {
  test('renders at 375px mobile viewport without console errors', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /paradise gym/i })).toBeVisible()
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('navbar links scroll to correct sections', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    for (const { link, id } of NAV_SECTIONS) {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', {
        name: link,
        exact: true,
      }).click()

      await expect(page.locator(`#${id}`)).toBeInViewport()
    }
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt, `Image ${i} missing alt text`).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(0)
    }
  })

  test('respects prefers-reduced-motion for stat counters', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await page.locator('#amenities').scrollIntoViewIfNeeded()

    await expect(page.getByText('7,500')).toBeVisible()
    await expect(page.getByText('70+')).toBeVisible()
  })
})
