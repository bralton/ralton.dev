import { test, expect } from '@playwright/test'

test.describe('Social Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('social links navigation is visible', async ({ page }) => {
    const socialNav = page.locator('nav[aria-label="Social media links"]')
    await expect(socialNav).toBeVisible()
  })

  test('social links have accessible labels', async ({ page }) => {
    const socialNav = page.locator('nav[aria-label="Social media links"]')
    const links = socialNav.locator('a')

    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    // Each link should have an aria-label
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('aria-label')
    }
  })

  test('external social links have target="_blank"', async ({ page }) => {
    const socialNav = page.locator('nav[aria-label="Social media links"]')
    const links = socialNav.locator('a')

    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const href = await link.getAttribute('href')

      // External links (non-mailto) should have target="_blank"
      if (href && !href.startsWith('mailto:')) {
        await expect(link).toHaveAttribute('target', '_blank')
      }
    }
  })

  test('external social links have rel="noopener noreferrer"', async ({ page }) => {
    const socialNav = page.locator('nav[aria-label="Social media links"]')
    const links = socialNav.locator('a')

    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const href = await link.getAttribute('href')

      // External links (non-mailto) should have rel="noopener noreferrer"
      if (href && !href.startsWith('mailto:')) {
        const rel = await link.getAttribute('rel')
        expect(rel).toContain('noopener')
      }
    }
  })

  test('social links are in the footer', async ({ page }) => {
    // Social links should also appear in the footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Footer should contain social links
    const footerSocialNav = footer.locator('nav[aria-label="Social media links"]')
    await expect(footerSocialNav).toBeVisible()
  })

  test('social link icons are decorative (aria-hidden)', async ({ page }) => {
    const socialNav = page.locator('nav[aria-label="Social media links"]')
    const icons = socialNav.locator('svg')

    const count = await icons.count()

    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i)
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
