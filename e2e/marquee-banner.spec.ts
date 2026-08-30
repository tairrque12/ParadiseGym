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

test.describe('New location marquee banner', () => {
  for (const width of [375, 1440] as const) {
    test(`renders above the navbar without clipping at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 812 })
      await page.goto('/')

      const banner = page.getByTestId('new-location-marquee')
      await expect(banner).toBeVisible()

      const bannerBox = await getBoundingRect(banner)
      const navBox = await getBoundingRect(navRow(page))
      const logo = await getBoundingRect(
        page.getByLabel('Paradise Gym home')
      )

      // Pinned to the very top, full width, and slim.
      expect(bannerBox.y).toBe(0)
      expect(bannerBox.x).toBe(0)
      expect(bannerBox.width).toBe(width)
      expect(bannerBox.height).toBeGreaterThanOrEqual(32)
      expect(bannerBox.height).toBeLessThanOrEqual(44)

      // The nav row starts below the banner, and the logo is not crowded.
      expect(navBox.y).toBeGreaterThanOrEqual(bannerBox.height)
      expect(logo.y).toBeGreaterThanOrEqual(navBox.y + 4)
      expect(logo.y + logo.height).toBeLessThanOrEqual(
        navBox.y + navBox.height - 4
      )

      const fontSize = await banner.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize)
      )
      expect(fontSize).toBeGreaterThanOrEqual(12)

      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      )
      expect(documentWidth).toBeLessThanOrEqual(width)
    })
  }

  test('keeps scrolling seamlessly and stays pinned while the page scrolls', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const banner = page.getByTestId('new-location-marquee')
    const track = page.getByTestId('marquee-track')

    const animation = await track.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        name: style.animationName,
        duration: style.animationDuration,
        timing: style.animationTimingFunction,
        iterations: style.animationIterationCount,
      }
    })
    expect(animation.name).not.toBe('none')
    expect(animation.timing).toBe('linear')
    expect(animation.iterations).toBe('infinite')
    expect(parseFloat(animation.duration)).toBeGreaterThanOrEqual(20)

    // Two identical runs mean the -50% keyframe lands on a seamless repeat.
    const runWidths = await track.evaluate((element) =>
      Array.from(element.children).map((child) =>
        Math.round(child.getBoundingClientRect().width)
      )
    )
    expect(runWidths).toHaveLength(2)
    expect(runWidths[0]).toBe(runWidths[1])

    await page.evaluate(() => window.scrollTo(0, 2200))
    await page.waitForTimeout(300)

    await expect(banner).toBeVisible()
    expect((await getBoundingRect(banner)).y).toBe(0)
  })

  test('navigates to the McAllen page when tapped', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await page.getByTestId('new-location-marquee').click()

    await expect(page).toHaveURL(/\/mcallen$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /paradise gym mcallen/i })
    ).toBeVisible()
  })

  test('is absent on the McAllen page it promotes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcallen')

    await expect(page.getByTestId('new-location-marquee')).toHaveCount(0)
    await expect(page.locator('header > div').first()).toBeVisible()
  })

  test.describe('reduced motion', () => {
    for (const width of [320, 375, 1440] as const) {
      test(`renders static, single-line copy inside the viewport at ${width}px`, async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize({ width, height: 812 })
        await page.goto('/')

        await expect(page.getByTestId('marquee-track')).toBeHidden()

        const fallback = page.getByTestId('marquee-static')
        await expect(fallback).toBeVisible()

        const line = await fallback.evaluate((element) => {
          const visible = Array.from(element.querySelectorAll('span')).find(
            (span) => getComputedStyle(span).display !== 'none'
          ) as HTMLElement
          const rect = visible.getBoundingClientRect()
          const lineHeight = parseFloat(getComputedStyle(visible).lineHeight)
          return {
            text: visible.textContent?.trim() ?? '',
            left: rect.left,
            right: rect.right,
            lines: Math.round(rect.height / lineHeight),
          }
        })

        expect(line.lines).toBe(1)
        expect(line.left).toBeGreaterThanOrEqual(12)
        expect(width - line.right).toBeGreaterThanOrEqual(12)
        expect(line.text).toMatch(/mcallen/i)

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
