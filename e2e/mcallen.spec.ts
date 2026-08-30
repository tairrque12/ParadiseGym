import { test, expect, type Locator, type Page } from '@playwright/test'

const MCALLEN_JOIN_URL =
  'https://onlinejoin.abcfitness.com/signup/plan?club=32367'

function locationLink(page: Page, name: RegExp) {
  return page
    .getByRole('navigation', { name: /gym locations/i })
    .getByRole('link', { name })
}

async function getBoundingRect(locator: Locator) {
  return locator.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })
}

test.describe('McAllen page', () => {
  test('is reachable from the homepage marquee banner', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await page.getByTestId('new-location-marquee').click()

    await expect(page).toHaveURL(/\/mcallen$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /paradise gym mcallen/i })
    ).toBeVisible()
    await expect(locationLink(page, /mcallen/i)).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  test('is reachable from the nav location switcher and links back home', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await locationLink(page, /mcallen/i).click()
    await expect(page).toHaveURL(/\/mcallen$/)

    await locationLink(page, /harlingen/i).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(
      page.getByRole('link', { name: 'Request Membership' })
    ).toBeVisible()
    await expect(page.getByText('Week Pass')).toBeVisible()
  })

  test('shows McAllen-specific content and coming soon opening messaging', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/mcallen')

    await expect(page.getByText('Pre-Sale Now Open')).toBeVisible()
    await expect(page.getByTestId('grand-opening-note')).toHaveText(
      'Official Grand Opening Date — Coming Soon'
    )

    await expect(page.getByTestId('presale-countdown')).toHaveCount(0)
    await expect(page.getByText(/opening in/i)).toHaveCount(0)

    await expect(
      page.getByRole('link', { name: /lock in founding member pricing/i })
    ).toHaveAttribute('href', MCALLEN_JOIN_URL)

    await expect(page.locator('#hours').getByText(/hours coming soon/i)).toBeVisible()
    await expect(
      page.locator('#hours').getByText('1001 N. Jackson Road, McAllen, TX 78501')
    ).toBeVisible()
    await expect(page.getByText('Mon – Fri')).toHaveCount(0)
    await expect(page.getByText('Week Pass')).toHaveCount(0)
    await expect(page.getByText('Day Pass')).toHaveCount(0)
  })

  test('puts pre-sale pricing directly below the hero', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/mcallen')

    const sectionIds = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > section')).map(
        (section) => section.id
      )
    )
    expect(sectionIds[1]).toBe('pricing')

    const heading = page.getByRole('heading', {
      name: /pre-sale membership options/i,
    })
    const amenities = page.locator('#amenities')

    const headingBox = await getBoundingRect(heading)
    const amenitiesBox = await getBoundingRect(amenities)

    expect(headingBox.y).toBeLessThan(amenitiesBox.y)

    const pricingLinks = page.locator('#pricing a')
    await expect(pricingLinks).toHaveCount(3)

    for (const [name, price] of [
      [/1 year paid in full/i, '$499.99'],
      [/12 month contract/i, '$39.99/mo'],
      [/month to month/i, '$49.99/mo'],
    ] as const) {
      const card = page.locator('#pricing').getByRole('link', { name })
      await expect(card).toHaveAttribute('href', MCALLEN_JOIN_URL)
      await expect(card).toHaveAttribute('target', '_blank')
      await expect(card).toHaveAttribute('rel', 'noopener noreferrer')
      await expect(card).toContainText(price)
      await expect(card).toContainText('Join Now')
    }
  })

  test('renders cleanly at 375px with prices prominent', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcallen')

    await expect(locationLink(page, /mcallen/i)).toBeVisible()
    await expect(page.getByTestId('grand-opening-note')).toBeVisible()

    const cards = page.locator('#pricing a')
    await expect(cards).toHaveCount(3)

    let previousBottom = 0
    for (let index = 0; index < 3; index++) {
      const card = cards.nth(index)
      const box = await getBoundingRect(card)

      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(375)
      expect(box.y).toBeGreaterThanOrEqual(previousBottom - 2)
      previousBottom = box.y + box.height
    }

    const priceSize = await page
      .locator('#pricing a')
      .first()
      .locator('text=$499.99')
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
    expect(priceSize).toBeGreaterThanOrEqual(40)

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    )
    expect(documentWidth).toBeLessThanOrEqual(375)
    expect(consoleErrors).toEqual([])
  })
})
