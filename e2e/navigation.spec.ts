import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('smooth scrolls to sections via nav links', async ({ page }) => {
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

    // The mobile nav menu should be visible
    const mobileNav = page.locator('#mobile-nav-menu')
    await expect(mobileNav).toBeVisible()

    // Click a nav link to close the menu
    await page.click('#mobile-nav-menu a[href="/#about"]')

    // Menu should close
    await expect(mobileNav).not.toBeVisible()
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

    // Check that all nav links are present
    const expectedLinks = [
      'About',
      'Experience',
      'Education',
      'Projects',
      'Skills',
      'GitHub',
      'Contact',
    ]
    for (const linkText of expectedLinks) {
      const link = desktopNav.locator(`a:has-text("${linkText}")`)
      await expect(link).toBeVisible()
    }
  })

  test('logo links to homepage', async ({ page }) => {
    const logo = page.locator('nav[aria-label="Main navigation"] a[href="/"]').first()
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })
})
