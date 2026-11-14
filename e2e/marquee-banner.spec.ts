import { test, expect } from '@playwright/test'

test.describe('McAllen pre-sale note', () => {
  test('lives in the menu instead of a header row', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByTestId('location-announcement')).toHaveCount(0)
    await page.getByTestId('mobile-menu-button').click()
    await expect(page.getByText('McAllen pre-sale is open')).toBeVisible()
    await page.getByRole('dialog').getByRole('button', { name: /mcallen/i }).click()
    await expect(page).toHaveURL(/\/mcallen$/)
  })
})
