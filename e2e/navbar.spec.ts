import { test, expect, type Locator, type Page } from '@playwright/test'

async function box(locator: Locator) {
  const value = await locator.boundingBox()
  expect(value).toBeTruthy()
  return value!
}

function contrastRatio(foreground: string, background: string) {
  const parse = (color: string) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!match) return [255, 255, 255]
    return [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  const channel = (value: number) => {
    const scaled = value / 255
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
  }
  const luminance = (color: string) => {
    const [red, green, blue] = parse(color)
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  }
  const lighter = Math.max(luminance(foreground), luminance(background))
  const darker = Math.min(luminance(foreground), luminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

async function assertAtLeast44(locator: Locator) {
  const count = await locator.count()
  for (let index = 0; index < count; index++) {
    const target = locator.nth(index)
    if (!(await target.isVisible())) continue
    const { width, height } = await box(target)
    expect(width).toBeGreaterThanOrEqual(44)
    expect(height).toBeGreaterThanOrEqual(44)
  }
}

async function openMenu(page: Page) {
  await page.getByTestId('mobile-menu-button').click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  for (const width of [360, 390, 430] as const) {
    test(`mobile header is one row at most 64px wide ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')

      const header = page.getByRole('banner')
      const headerBox = await box(header)
      expect(headerBox.height).toBeLessThanOrEqual(64)
      expect(headerBox.y).toBe(0)

      const logo = await box(page.getByRole('banner').getByRole('link', { name: 'Paradise Gym home' }))
      const menu = await box(page.getByTestId('mobile-menu-button'))
      expect(Math.abs(logo.y - menu.y)).toBeLessThan(12)
      expect(page.getByTestId('mobile-header-join')).toHaveCount(0)
      expect(page.locator('header').getByTestId('location-announcement')).toHaveCount(0)
    })
  }

  for (const width of [1280, 1440] as const) {
    test(`desktop header stays on one line at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const header = page.getByRole('banner')
      const headerBox = await box(header)
      expect(headerBox.height).toBeLessThanOrEqual(72)

      const controls = header.locator('a, button')
      const count = await controls.count()
      const tops: number[] = []
      for (let index = 0; index < count; index++) {
        const control = controls.nth(index)
        if (!(await control.isVisible())) continue
        tops.push((await box(control)).y)
      }
      expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(20)
      await expect(header.getByRole('link', { name: 'Gallery' })).toHaveCount(0)
      await expect(header.getByText('Secure checkout by ABC Fitness')).toHaveCount(0)
      await expect(header.getByText(/Opens ABC Fitness/i)).toHaveCount(0)
    })
  }

  test('menu is modal, covers the header, and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const menuButton = page.getByTestId('mobile-menu-button')
    await menuButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const overlay = page.locator('[data-slot="sheet-overlay"]')
    const overlayBox = await box(overlay)
    expect(overlayBox.y).toBeLessThanOrEqual(0)
    expect(overlayBox.height).toBeGreaterThanOrEqual(844)

    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const active = document.activeElement
      return Boolean(active?.closest('[data-slot="sheet-content"]'))
    })
    expect(inside).toBe(true)

    for (let step = 0; step < 8; step++) await page.keyboard.press('Tab')
    const stillInside = await page.evaluate(() => {
      const active = document.activeElement
      return Boolean(active?.closest('[data-slot="sheet-content"]'))
    })
    expect(stillInside).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(menuButton).toBeFocused()
  })

  test('keeps McAllen nav links on /mcallen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/mcallen')
    await openMenu(page)

    const nav = page.getByRole('dialog').getByRole('navigation', { name: 'Mobile' })
    for (const [name, href] of [
      ['Amenities', '/mcallen#amenities'],
      ['Pricing', '/mcallen#pricing'],
      ['Reviews', '/mcallen#reviews'],
      ['Hours', '/mcallen#hours'],
    ] as const) {
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute('href', href)
    }
  })

  test('hides the sticky bar while hero CTAs are on screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const hero = page.locator('[data-hero-cta]')
    const bar = page.getByTestId('mobile-action-bar')
    await expect(hero).toBeVisible()
    await expect(bar).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect(hero).not.toBeInViewport()
    await expect(bar).toBeVisible()
    await expect(bar.getByRole('link', { name: 'Join', exact: true })).toBeVisible()
    await expect(bar.getByRole('button', { name: 'Tour' })).toBeVisible()
  })

  test('header and menu controls are at least 44px and meet contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await assertAtLeast44(page.getByRole('banner').locator('a, button'))
    await openMenu(page)
    await assertAtLeast44(page.getByRole('dialog').locator('a, button'))

    const sample = await page.getByTestId('mobile-join').evaluate((element) => {
      const style = getComputedStyle(element)
      return { color: style.color, background: style.backgroundColor }
    })
    expect(contrastRatio(sample.color, sample.background)).toBeGreaterThanOrEqual(4.5)

    const link = page.getByRole('dialog').getByRole('link', { name: 'Pricing' })
    const linkSample = await link.evaluate((element) => {
      const style = getComputedStyle(element)
      const parent = getComputedStyle(element.parentElement ?? element)
      return { color: style.color, background: parent.backgroundColor }
    })
    const background = linkSample.background === 'rgba(0, 0, 0, 0)' ? 'rgb(10, 10, 10)' : linkSample.background
    expect(contrastRatio(linkSample.color, background)).toBeGreaterThanOrEqual(4.5)
  })
})
