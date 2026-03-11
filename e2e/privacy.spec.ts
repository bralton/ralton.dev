import { test, expect } from '@playwright/test'

test.describe('Privacy Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy')
  })

  test('privacy page renders at /privacy', async ({ page }) => {
    await expect(page).toHaveURL(/\/privacy/)
  })

  test('page has Privacy Policy heading', async ({ page }) => {
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Privacy Policy')
  })

  test('page includes key sections', async ({ page }) => {
    // Check for expected section headings
    const expectedSections = [
      'Overview',
      'Information I Collect',
      'How I Use Your Information',
      'Data Retention',
      'Third-Party Services',
      'Contact',
    ]

    for (const section of expectedSections) {
      const sectionHeading = page.locator(`h2:has-text("${section}")`)
      await expect(sectionHeading).toBeVisible()
    }
  })

  test('page has navigation', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()
  })

  test('page has footer', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('page has proper document structure', async ({ page }) => {
    // Should have main content area
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()

    // Should have an article element for the content
    const article = page.locator('article')
    await expect(article).toBeVisible()
  })

  test('page includes last updated date', async ({ page }) => {
    const lastUpdated = page.locator('text=/Last updated:/i')
    await expect(lastUpdated).toBeVisible()
  })

  test('privacy link in footer navigates to privacy page', async ({ page }) => {
    // Go back to homepage
    await page.goto('/')

    // Find and click the privacy link in footer
    const footer = page.locator('footer')
    const privacyLink = footer.locator('a[href="/privacy"]')
    await expect(privacyLink).toBeVisible()

    await privacyLink.click()

    // Should now be on privacy page
    await expect(page).toHaveURL(/\/privacy/)
  })
})
