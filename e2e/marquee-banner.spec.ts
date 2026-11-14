import { test, expect, type Locator, type Page } from '@playwright/test'

async function getBoundingRect(locator: Locator) {
  return locator.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })
}

function navRow(page: Page) {
  return page.locator('header > div').first()
}

test.describe('McAllen announcement bar', () => {
  for (const width of [375, 1440] as const) {
    test(`renders a slim bar above the navbar without clipping at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 812 })
      await page.goto('/')

      const banner = page.getByTestId('location-announcement')
      await expect(banner).toBeVisible()
      await expect(banner).toHaveAttribute('href', '/mcallen')

      const bannerBox = await getBoundingRect(banner)
      const navBox = await getBoundingRect(navRow(page))
      const logo = await getBoundingRect(
        page.getByLabel('Paradise Gym home')
      )

      expect(bannerBox.y).toBe(0)
      expect(bannerBox.x).toBe(0)
      expect(bannerBox.width).toBe(width)
      expect(bannerBox.height).toBeGreaterThanOrEqual(32)
      expect(bannerBox.height).toBeLessThanOrEqual(44)

      expect(navBox.y).toBeGreaterThanOrEqual(bannerBox.height)
      expect(logo.y).toBeGreaterThanOrEqual(navBox.y + 4)
      expect(logo.y + logo.height).toBeLessThanOrEqual(
        navBox.y + navBox.height - 4
      )

      const fontSize = await banner.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize)
      )
      expect(fontSize).toBeGreaterThanOrEqual(12)

      const animationName = await banner.evaluate(
        (element) => getComputedStyle(element).animationName
      )
      expect(animationName).toBe('none')

      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      )
      expect(documentWidth).toBeLessThanOrEqual(width)
    })
  }

  test('stays pinned to the top while the page scrolls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const banner = page.getByTestId('location-announcement')
    await page.evaluate(() => window.scrollTo(0, 2200))
    await page.waitForTimeout(300)

    await expect(banner).toBeVisible()
    expect((await getBoundingRect(banner)).y).toBe(0)
  })

  test('navigates to the McAllen page when tapped', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await page.getByTestId('location-announcement').click()

    await expect(page).toHaveURL(/\/mcallen$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /paradise gym mcallen/i })
    ).toBeVisible()
  })

  test('is absent on the McAllen page it promotes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcallen')

    await expect(page.getByTestId('location-announcement')).toHaveCount(0)
    await expect(page.locator('header > div').first()).toBeVisible()
  })

  test.describe('reduced motion', () => {
    for (const width of [320, 375, 1440] as const) {
      test(`renders a single static line inside the viewport at ${width}px`, async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize({ width, height: 812 })
        await page.goto('/')

        const banner = page.getByTestId('location-announcement')
        await expect(banner).toBeVisible()

        const line = await banner.evaluate((element) => {
          const visible = Array.from(element.querySelectorAll('span')).filter(
            (span) =>
              span.childElementCount === 0 &&
              getComputedStyle(span).display !== 'none'
          ) as HTMLElement[]
          const first = visible[0]
          const last = visible[visible.length - 1]
          const lineHeight = parseFloat(getComputedStyle(first).lineHeight)
          const firstRect = first.getBoundingClientRect()
          const lastRect = last.getBoundingClientRect()
          return {
            text: visible.map((span) => span.textContent?.trim() ?? '').join(' '),
            left: firstRect.left,
            right: lastRect.right,
            lines: Math.round(firstRect.height / lineHeight),
          }
        })

        expect(line.lines).toBe(1)
        expect(line.left).toBeGreaterThanOrEqual(12)
        expect(width - line.right).toBeGreaterThanOrEqual(12)
        expect(line.text).toMatch(/mcallen/i)
        expect(line.text).toMatch(/presale/i)

        const documentWidth = await page.evaluate(
          () => document.documentElement.scrollWidth
        )
        expect(documentWidth).toBeLessThanOrEqual(width)
      })
    }
  })
})

test.describe('McAllen grand opening copy', () => {
  for (const width of [320, 375] as const) {
    test(`keeps clear of the right edge at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 })
      await page.goto('/mcallen')

      const note = page.getByTestId('grand-opening-note')
      await expect(note).toBeVisible()
      await expect(note).toHaveText('Official Grand Opening Date — Coming Soon')

      const ink = await note.evaluate((element) => {
        const range = document.createRange()
        range.selectNodeContents(element)
        const rect = range.getBoundingClientRect()
        return { left: rect.left, right: rect.right }
      })

      expect(ink.left).toBeGreaterThanOrEqual(12)
      expect(width - ink.right).toBeGreaterThanOrEqual(16)

      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      )
      expect(documentWidth).toBeLessThanOrEqual(width)
    })
  }
})
