import { test, expect } from '@playwright/test'

test.describe('Navigation (redesign)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('smooth scrolls to sections via nav links', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Plain nav links are hidden below the desk breakpoint')

    await page.click('nav[aria-label="Main navigation"] a[href="/#projects"]')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/#projects/)
  })

  test('desktop nav shows the three section links and CTA', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Plain nav links are hidden below the desk breakpoint')

    const nav = page.locator('nav[aria-label="Main navigation"]')
    for (const linkText of ['Projects', 'Experience', 'Writing']) {
      await expect(nav.locator(`a:has-text("${linkText}")`)).toBeVisible()
    }
    await expect(nav.locator('a[href="/#contact"]')).toBeVisible()
  })

  test('mobile nav shows only wordmark and CTA (no hamburger)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only behavior')

    const nav = page.locator('nav[aria-label="Main navigation"]')
    // CTA remains visible
    await expect(nav.locator('a[href="/#contact"]')).toBeVisible()
    // Plain section links are hidden
    await expect(nav.locator('a[href="/#projects"]')).toBeHidden()
    // No hamburger menu exists in the redesign
    await expect(page.getByRole('button', { name: /toggle menu/i })).toHaveCount(0)
  })

  test('contact CTA scrolls to contact section', async ({ page }) => {
    await page.click('nav[aria-label="Main navigation"] a[href="/#contact"]')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/#contact/)
  })

  test('skip link is visible on keyboard focus', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]')
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeVisible()
  })

  test('skip link navigates to main content', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]')
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeVisible()
    await skipLink.click()
    await expect(page.locator('main#main-content')).toBeVisible()
  })

  test('logo + wordmark links to homepage', async ({ page }) => {
    const logo = page.locator('nav[aria-label="Main navigation"] a[href="/"]').first()
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })
})
