import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('smooth scrolls to sections via nav links', async ({ page, isMobile }) => {
    // Desktop nav links are hidden on mobile, need to use mobile menu instead
    test.skip(isMobile, 'Use mobile menu toggle test for mobile navigation')

    // Click the About nav link
    await page.click('nav[aria-label="Main navigation"] a[href="/#about"]')

    // Wait a moment for smooth scroll
    await page.waitForTimeout(500)

    // Verify the About section is in view (URL hash updated)
    await expect(page).toHaveURL(/\/#about/)
  })

  test('mobile menu toggle shows and hides menu', async ({ page, isMobile }) => {
    // This test only applies to mobile viewport
    test.skip(!isMobile, 'Mobile menu only visible on mobile devices')

    // Find the mobile menu toggle button
    const menuButton = page.getByRole('button', { name: /toggle menu/i })
    await expect(menuButton).toBeVisible()

    // Click to open menu
    await menuButton.click()

    // Wait for sheet animation and look for mobile nav by aria-label
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]')
    await expect(mobileNav).toBeVisible({ timeout: 5000 })

    // Click a nav link to close the menu
    await mobileNav.locator('a[href="/#about"]').click()

    // Menu should close (check that nav is no longer visible)
    await expect(mobileNav).not.toBeVisible({ timeout: 5000 })
  })

  test('skip link is visible on keyboard focus', async ({ page }) => {
    // Skip link should be initially hidden (sr-only)
    const skipLink = page.locator('a[href="#main-content"]')

    // Tab to focus on the skip link
    await page.keyboard.press('Tab')

    // Skip link should now be visible
    await expect(skipLink).toBeVisible()
  })

  test('skip link navigates to main content', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]')

    // Focus and click the skip link
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeVisible()
    await skipLink.click()

    // Main content should receive focus or be in view
    const mainContent = page.locator('main#main-content')
    await expect(mainContent).toBeVisible()
  })

  test('desktop navigation links are visible on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav only visible on desktop')

    const desktopNav = page.locator('nav[aria-label="Main navigation"] ul.hidden.md\\:flex')
    await expect(desktopNav).toBeVisible()

    // Check that all nav links are present (in order)
    const expectedLinks = [
      'About',
      'Skills',
      'GitHub',
      'Projects',
      'Blog',
      'Experience',
      'Education',
      'Contact',
    ]
    for (const linkText of expectedLinks) {
      const link = desktopNav.locator(`a:has-text("${linkText}")`)
      await expect(link).toBeVisible()
    }
  })

  test('logo links to homepage', async ({ page, isMobile }) => {
    // On mobile, logo may be hidden to save space
    test.skip(isMobile, 'Logo visibility varies on mobile')

    const logo = page.locator('nav[aria-label="Main navigation"] a[href="/"]').first()
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('blog link navigates to blog page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav only visible on desktop')

    const blogLink = page.locator('nav[aria-label="Main navigation"] a[href="/blog"]')
    await expect(blogLink).toBeVisible()

    await blogLink.click()
    await expect(page).toHaveURL('/blog')
  })
})
