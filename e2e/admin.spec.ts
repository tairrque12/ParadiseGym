import { test, expect } from '@playwright/test'

const adminEmail = process.env.ADMIN_TEST_EMAIL
const adminPassword = process.env.ADMIN_TEST_PASSWORD
const hasAdminCredentials = Boolean(adminEmail && adminPassword)

test.describe('Admin portal', () => {
  test('redirects unauthenticated users from /admin to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login$/)
    await expect(
      page.getByRole('heading', { name: /admin login/i })
    ).toBeVisible()
  })

  test('login page is usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/admin/login')

    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test.describe('authenticated flows', () => {
    test.skip(!hasAdminCredentials, 'Requires ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD')

    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.getByLabel(/email/i).fill(adminEmail!)
      await page.getByLabel(/password/i).fill(adminPassword!)
      await page.getByRole('button', { name: /sign in/i }).click()
      await expect(page).toHaveURL(/\/admin$/)
    })

    test('shows both request tabs after login', async ({ page }) => {
      await expect(
        page.getByRole('tab', { name: /membership requests/i })
      ).toBeVisible()
      await expect(
        page.getByRole('tab', { name: /tour requests/i })
      ).toBeVisible()
    })

    test('switches between membership and tour tabs', async ({ page }) => {
      await expect(page.getByRole('columnheader', { name: /membership type/i })).toBeVisible()

      await page.getByRole('tab', { name: /tour requests/i }).click()
      await expect(page.getByRole('columnheader', { name: /preferred date/i })).toBeVisible()
    })

    test('updates membership status and persists after refresh', async ({
      page,
    }) => {
      const statusSelect = page.getByLabel(/update status/i).first()
      const currentValue = await statusSelect.inputValue()
      const nextValue = currentValue === 'new' ? 'contacted' : 'new'

      await statusSelect.selectOption(nextValue)
      await page.waitForTimeout(500)

      await page.reload()
      await expect(page.getByLabel(/update status/i).first()).toHaveValue(nextValue)

      await statusSelect.selectOption(currentValue)
    })

    test('logs out and clears access to /admin', async ({ page }) => {
      await page.getByRole('button', { name: /log out/i }).click()
      await expect(page).toHaveURL(/\/admin\/login$/)

      await page.goto('/admin')
      await expect(page).toHaveURL(/\/admin\/login$/)
    })

    test('dashboard is usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })

      await expect(page.getByLabel(/search requests/i)).toBeVisible()
      await expect(page.getByRole('tab', { name: /membership requests/i })).toBeVisible()

      const table = page.locator('table').first()
      await expect(table).toBeVisible()
      await expect(table).toHaveCSS('min-width', /px/)
    })
  })
})
