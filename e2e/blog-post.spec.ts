import { test, expect } from '@playwright/test'

test.describe('Blog Post Page', () => {
  // Use the seeded post slug
  const testPostSlug = 'getting-started-with-nextjs'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${testPostSlug}`, { waitUntil: 'networkidle' })
  })

  test('renders blog post with title', async ({ page }) => {
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    await expect(title).not.toBeEmpty()
  })

  test('displays published date', async ({ page }) => {
    const date = page.locator('time')
    await expect(date).toBeVisible()
    await expect(date).toHaveAttribute('datetime')
  })

  test('displays reading time', async ({ page }) => {
    const readingTime = page.locator('text=/\\d+ min read/')
    await expect(readingTime).toBeVisible()
  })

  test('displays categories as clickable links', async ({ page }) => {
    const categoryLinks = page.locator('a[href^="/blog/category/"]')

    // Skip if no categories
    if ((await categoryLinks.count()) === 0) {
      test.skip()
      return
    }

    const firstCategory = categoryLinks.first()
    await expect(firstCategory).toBeVisible()

    // Click and verify navigation
    await firstCategory.click()
    await expect(page).toHaveURL(/\/blog\/category\/[\w-]+/)
  })

  test('displays tags as clickable links', async ({ page }) => {
    const tagLinks = page.locator('a[href^="/blog/tag/"]')

    // Skip if no tags
    if ((await tagLinks.count()) === 0) {
      test.skip()
      return
    }

    const firstTag = tagLinks.first()
    await expect(firstTag).toBeVisible()

    // Click and verify navigation
    await firstTag.click()
    await expect(page).toHaveURL(/\/blog\/tag\/[\w-]+/)
  })

  test('displays RSS link', async ({ page }) => {
    const rssLink = page.locator('a[href="/api/rss"]')
    await expect(rssLink).toBeVisible()
  })

  test('has correct Open Graph meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /.+/)

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute('content', /.+/)

    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveAttribute('content', 'article')
  })

  test('has Twitter card meta tags', async ({ page }) => {
    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image')
  })

  test('post content is rendered', async ({ page }) => {
    // Main article content area
    const content = page.locator('article .prose, main .prose')
    await expect(content).toBeVisible()
  })

  test('has back to blog link', async ({ page }) => {
    // Look for the back link in the main content area
    const backLink = page.locator('main a[href="/blog"]')
    await expect(backLink.first()).toBeVisible()
  })
})

test.describe('Blog Post 404', () => {
  test('returns 404 for non-existent post', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist-12345', {
      waitUntil: 'networkidle',
    })

    // Should return 404 status
    expect(response?.status()).toBe(404)
  })

  test('displays 404 page content for non-existent post', async ({ page }) => {
    await page.goto('/blog/this-post-does-not-exist-12345', {
      waitUntil: 'networkidle',
    })

    // Should show 404 content
    const notFoundText = page.locator('text=/not found|404/i')
    await expect(notFoundText.first()).toBeVisible()
  })
})
