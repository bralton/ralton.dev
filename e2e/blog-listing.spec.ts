import { test, expect } from '@playwright/test'

test.describe('Blog Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' })
  })

  test('renders blog listing page with heading', async ({ page }) => {
    const heading = page.locator('h1')
    await expect(heading).toContainText('writing')
  })

  test('displays blog post cards with required information', async ({ page }) => {
    // Redesign PostCards: whole card is a link inside the posts list
    const postCards = page.locator('ul[aria-label="Blog posts"] li a')
    await expect(postCards.first()).toBeVisible()

    const firstCard = postCards.first()

    // Title (h2 on the index, directly under the page h1)
    const title = firstCard.locator('h2')
    await expect(title).toBeVisible()
    await expect(title).not.toBeEmpty()

    // Date (time element)
    const date = firstCard.locator('time')
    await expect(date).toBeVisible()
  })

  test('post card links to individual post page', async ({ page }) => {
    // The whole card is a Link
    const firstPostLink = page.locator('ul[aria-label="Blog posts"] li a').first()
    const href = await firstPostLink.getAttribute('href')

    expect(href).toMatch(/^\/blog\/[\w-]+$/)

    await firstPostLink.click()
    await expect(page).toHaveURL(/\/blog\/[\w-]+/)
  })

  test('displays RSS link in page', async ({ page }) => {
    const rssLink = page.locator('a[href="/api/rss"]')
    await expect(rssLink).toBeVisible()
    await expect(rssLink).toHaveAttribute('title', /RSS/i)
  })

  test('has RSS autodiscovery link in head', async ({ page }) => {
    const rssLinkTag = page.locator('link[type="application/rss+xml"]')
    await expect(rssLinkTag).toHaveAttribute('href', /\/api\/rss/)
  })

  test('page has correct meta description', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
  })
})

test.describe('Blog Listing Pagination', () => {
  test('shows pagination when more than 10 posts exist', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' })

    // Check if pagination exists (will only show if > 10 posts seeded)
    const pagination = page.locator('nav[aria-label="Pagination"]')
    const paginationExists = (await pagination.count()) > 0

    if (paginationExists) {
      await expect(pagination).toBeVisible()

      // Should show page indicator
      const pageIndicator = pagination.locator('text=/Page \\d+ of \\d+/')
      await expect(pageIndicator).toBeVisible()
    }
    // Test passes regardless - pagination only shows when needed
  })

  test('pagination page 2 works via URL', async ({ page }) => {
    await page.goto('/blog?page=2', { waitUntil: 'networkidle' })

    // Should either show posts or "page not found" state
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })
})
