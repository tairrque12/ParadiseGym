import { test, expect, type Locator, type Page } from '@playwright/test'

const MEMBERSHIP_JOIN_URL =
  'https://onlinejoin.abcfitness.com/signup/plan?club=32265'

async function scrollToSelector(page: Page, selector: string) {
  await page.waitForSelector(selector)
  await page.evaluate((target) => {
    document.querySelector(target)?.scrollIntoView()
  }, selector)
}

async function getBoundingRect(locator: Locator) {
  return locator.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })
}

const NAV_SECTIONS = [
  { link: 'Amenities', id: 'amenities' },
  { link: 'Pricing', id: 'pricing' },
  { link: 'Reviews', id: 'reviews' },
  { link: 'Hours', id: 'hours' },
] as const

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/tour-request', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
  })

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

  test('navbar gallery link opens the gallery page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Gallery', exact: true })
      .click()

    await expect(page).toHaveURL(/\/gallery$/)
    await expect(page.getByRole('heading', { name: /the gym/i })).toBeVisible()
    await expect(page.locator('#gallery')).toHaveCount(0)
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

    await expect(page.getByText('7,500')).toBeVisible()
    await expect(page.getByText('70+')).toBeVisible()
  })

  test('membership CTAs link directly to ABC Fitness', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    for (const name of [
      /request membership/i,
      /12 month contract/i,
      /month to month/i,
      /1 year paid in full/i,
      /one month/i,
      /week pass/i,
      /day pass/i,
    ]) {
      const link = page.getByRole('link', { name })
      await expect(link).toHaveAttribute('href', MEMBERSHIP_JOIN_URL)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('pricing section stacks cleanly on mobile viewport', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await scrollToSelector(page, '#pricing')

    await expect(page.getByText('Recurring', { exact: true })).toBeVisible()
    await expect(page.getByText('Single Payment', { exact: true })).toBeVisible()
    await expect(page.getByText('12 Month Contract')).toBeVisible()
    await expect(page.getByText('Day Pass')).toBeVisible()
    await expect(page.getByText('$17.99')).toBeVisible()
    await expect(page.getByText(/discounts available/i)).toBeVisible()
  })

  for (const width of [375, 768, 1440] as const) {
    test(`pricing section has no overlapping layout at ${width}px`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const pricing = page.locator('#pricing')
      await expect(pricing).toBeVisible()
      await scrollToSelector(page, '#pricing')

      const heading = page.getByRole('heading', { name: /membership options/i })
      const recurringBadge = page.getByText('Recurring', { exact: true })
      const singlePaymentBadge = page.getByText('Single Payment', { exact: true })
      const firstRecurringPrice = page.getByText('$39.99/mo')
      const firstSinglePaymentPrice = page.getByText('$499.99')

      await expect(heading).toBeVisible()
      await expect(recurringBadge).toBeVisible()
      await expect(singlePaymentBadge).toBeVisible()

      const headingBox = await getBoundingRect(heading)
      const recurringBox = await getBoundingRect(recurringBadge)
      const singlePaymentBox = await getBoundingRect(singlePaymentBadge)
      const recurringPriceBox = await getBoundingRect(firstRecurringPrice)
      const singlePaymentPriceBox = await getBoundingRect(firstSinglePaymentPrice)

      expect(headingBox).toBeTruthy()
      expect(recurringBox).toBeTruthy()
      expect(singlePaymentBox).toBeTruthy()
      expect(recurringPriceBox).toBeTruthy()
      expect(singlePaymentPriceBox).toBeTruthy()

      expect(headingBox!.y + headingBox!.height).toBeLessThanOrEqual(
        recurringBox!.y + 2
      )
      expect(recurringBox!.y + recurringBox!.height).toBeLessThanOrEqual(
        recurringPriceBox!.y + 2
      )

      if (width < 1024) {
        expect(recurringPriceBox!.y + recurringPriceBox!.height).toBeLessThanOrEqual(
          singlePaymentBox!.y + 2
        )
        expect(singlePaymentBox!.y + singlePaymentBox!.height).toBeLessThanOrEqual(
          singlePaymentPriceBox!.y + 2
        )
      } else {
        expect(Math.abs(recurringBox!.y - singlePaymentBox!.y)).toBeLessThanOrEqual(4)
        expect(Math.abs(recurringPriceBox!.y - singlePaymentPriceBox!.y)).toBeLessThanOrEqual(
          120
        )
      }
    })
  }

  for (const width of [375, 768, 1440] as const) {
    test(`hero and gym facts stay separated at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const heroHeading = page.getByRole('heading', { name: /paradise gym/i }).first()
      const gymFactsLabel = page.getByText('SQ FT', { exact: true })

      const heroBox = await getBoundingRect(heroHeading)
      const gymFactsBox = await getBoundingRect(gymFactsLabel)

      expect(heroBox).toBeTruthy()
      expect(gymFactsBox).toBeTruthy()
      expect(heroBox!.y + heroBox!.height).toBeLessThanOrEqual(gymFactsBox!.y + 2)
    })
  }

  for (const width of [375, 768, 1440] as const) {
    test(`reviews heading stays clear of quote accents at ${width}px`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const reviews = page.locator('#reviews')
      await scrollToSelector(page, '#reviews')

      const heading = page.getByRole('heading', { name: /what our members say/i })
      const firstQuote = page.locator('#reviews blockquote').first()

      await expect(heading).toBeVisible()
      await expect(firstQuote).toBeVisible()

      const headingBox = await getBoundingRect(heading)
      const quoteBox = await getBoundingRect(firstQuote)

      expect(headingBox).toBeTruthy()
      expect(quoteBox).toBeTruthy()

      if (width < 1024) {
        expect(headingBox!.y + headingBox!.height).toBeLessThanOrEqual(
          quoteBox!.y + 2
        )
      } else {
        expect(headingBox!.x + headingBox!.width).toBeLessThanOrEqual(quoteBox!.x + 2)
      }
    })
  }

  test('tour flow from navbar opens modal, submits, and closes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await page.getByRole('button', { name: /free tour/i }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByLabel(/first name/i).fill('Elena')
    await dialog.getByLabel(/last name/i).fill('Rivera')
    await dialog.getByLabel(/email/i).fill('elena@example.com')
    await dialog.getByLabel(/phone/i).fill('956-244-6692')
    await dialog.getByRole('button', { name: /request tour/i }).click()

    await expect(dialog.getByText(/tour requested/i)).toBeVisible()
    await expect(dialog).toBeHidden({ timeout: 5000 })
  })

  test('escape closes an open modal', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /free gym tour/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('tour modal date and time selection works on mobile viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await page.getByTestId('mobile-menu-button').click()
    await page.getByRole('button', { name: /free tour/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel(/preferred time/i)).toBeDisabled()

    await dialog.getByLabel(/preferred date/i).fill('2026-07-12')
    await expect(dialog.getByLabel(/preferred time/i)).toBeEnabled()

    await dialog.getByLabel(/preferred time/i).selectOption('10:00 AM')

    await expect(dialog.getByLabel(/preferred time/i)).toHaveValue('10:00 AM')
  })
})
