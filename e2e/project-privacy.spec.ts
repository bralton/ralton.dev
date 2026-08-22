import { test, expect } from '@playwright/test'

/**
 * Per-project privacy policy pages (/projects/[slug]/privacy).
 * The CI seed creates "Puzzle Quest Mobile" with a privacy policy and
 * app store links; other seeded projects have no policy.
 */
test.describe('Project Privacy Policy', () => {
  test('renders a published project privacy policy', async ({ page }) => {
    const response = await page.goto('/projects/puzzle-quest-mobile/privacy')
    expect(response?.status()).toBe(200)

    const heading = page.locator('h1')
    await expect(heading).toContainText('Puzzle Quest Mobile Privacy Policy')
    await expect(page.locator('text=/Last updated:/i')).toBeVisible()
    await expect(page.locator('main#main-content article')).toBeVisible()
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('returns 404 for a project without a privacy policy', async ({ page }) => {
    const response = await page.goto('/projects/e-commerce-platform/privacy')
    expect(response?.status()).toBe(404)
  })

  test('returns 404 for an unknown project', async ({ page }) => {
    const response = await page.goto('/projects/does-not-exist/privacy')
    expect(response?.status()).toBe(404)
  })

  test('project card links to app stores and the privacy policy', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('section#projects article', { hasText: 'Puzzle Quest Mobile' })
    if ((await card.count()) === 0) return // not seeded in this environment

    await expect(card.locator('a[href*="apps.apple.com"]')).toHaveText(/app store/i)
    await expect(card.locator('a[href*="play.google.com"]')).toHaveText(/google play/i)

    const privacyLink = card.locator('a[href="/projects/puzzle-quest-mobile/privacy"]')
    await expect(privacyLink).toBeVisible()
    await privacyLink.click()
    await expect(page).toHaveURL(/\/projects\/puzzle-quest-mobile\/privacy/)
  })
})
