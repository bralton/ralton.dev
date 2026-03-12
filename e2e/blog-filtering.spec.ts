import { test, expect } from '@playwright/test'

test.describe('Blog Category Filtering', () => {
  // Use seeded category slug
  const testCategorySlug = 'technology'

  test('category page shows filtered posts', async ({ page }) => {
    await page.goto(`/blog/category/${testCategorySlug}`, { waitUntil: 'networkidle' })

    // Should have heading indicating category filter
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/technology/i)
  })

  test('category page shows post cards', async ({ page }) => {
    await page.goto(`/blog/category/${testCategorySlug}`, { waitUntil: 'networkidle' })

    // Should show at least one post (seeded data)
    const postCards = page.locator('article')
    await expect(postCards.first()).toBeVisible()
  })

  test('category page has "View all posts" link', async ({ page }) => {
    await page.goto(`/blog/category/${testCategorySlug}`, { waitUntil: 'networkidle' })

    // Find the "View all posts" link in the main content area (not nav)
    const viewAllLink = page.locator('main a[href="/blog"]')
    await expect(viewAllLink.first()).toBeVisible()

    // Click and verify navigation
    await viewAllLink.first().click()
    await expect(page).toHaveURL('/blog')
  })

  test('non-existent category returns 404', async ({ page }) => {
    const response = await page.goto('/blog/category/nonexistent-category-xyz', {
      waitUntil: 'networkidle',
    })

    expect(response?.status()).toBe(404)
  })
})

test.describe('Blog Tag Filtering', () => {
  // Use seeded tag slug
  const testTagSlug = 'react'

  test('tag page shows filtered posts', async ({ page }) => {
    await page.goto(`/blog/tag/${testTagSlug}`, { waitUntil: 'networkidle' })

    // Should have heading indicating tag filter
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/react/i)
  })

  test('tag page shows post cards', async ({ page }) => {
    await page.goto(`/blog/tag/${testTagSlug}`, { waitUntil: 'networkidle' })

    // Should show at least one post (seeded data)
    const postCards = page.locator('article')
    await expect(postCards.first()).toBeVisible()
  })

  test('tag page has "View all posts" link', async ({ page }) => {
    await page.goto(`/blog/tag/${testTagSlug}`, { waitUntil: 'networkidle' })

    // Find the "View all posts" link in the main content area (not nav)
    const viewAllLink = page.locator('main a[href="/blog"]')
    await expect(viewAllLink.first()).toBeVisible()
  })

  test('non-existent tag returns 404', async ({ page }) => {
    const response = await page.goto('/blog/tag/nonexistent-tag-xyz', {
      waitUntil: 'networkidle',
    })

    expect(response?.status()).toBe(404)
  })
})

test.describe('Filter Navigation Flow', () => {
  test('can navigate from post to category and back to all posts', async ({ page }) => {
    // Start at blog listing
    await page.goto('/blog', { waitUntil: 'networkidle' })
    await expect(page).toHaveURL('/blog')

    // Click on a post (the whole article is wrapped in a Link)
    const postLink = page.locator('article a').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/blog\/[\w-]+$/)

    // Click on a category (categories are clickable links on the individual post page)
    const categoryLink = page.locator('a[href^="/blog/category/"]').first()
    if ((await categoryLink.count()) > 0) {
      await categoryLink.click()
      await expect(page).toHaveURL(/\/blog\/category\/[\w-]+/)

      // Go back to all posts (use the link in main content, not nav)
      const viewAllLink = page.locator('main a[href="/blog"]').first()
      await viewAllLink.click()
      await expect(page).toHaveURL('/blog')
    }
  })
})
