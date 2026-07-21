import { test, expect } from '@playwright/test'

test.describe('Homepage (redesign)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('renders Hero section with name and headline', async ({ page }) => {
    const heroSection = page.locator('section#hero')
    await expect(heroSection).toBeVisible()

    const h1 = heroSection.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).not.toBeEmpty()

    const h2 = heroSection.locator('h2')
    await expect(h2).toBeVisible()
    await expect(h2).not.toBeEmpty()
  })

  test('renders GitHub proof panel in hero when data exists', async ({ page }) => {
    const proofPanel = page.locator('aside[aria-label="GitHub activity and career stats"]')
    // Panel only renders when GitHub/experience/education data exists
    if ((await proofPanel.count()) > 0) {
      await expect(proofPanel).toBeVisible()
    }
  })

  test('retired v1 sections are gone', async ({ page }) => {
    await expect(page.locator('section#about')).toHaveCount(0)
    await expect(page.locator('section#skills')).toHaveCount(0)
    await expect(page.locator('section#education')).toHaveCount(0)
    await expect(page.locator('section#github')).toHaveCount(0)
    await expect(page.locator('section#latest-posts')).toHaveCount(0)
  })

  test('renders Projects section with expandable cards when projects exist', async ({ page }) => {
    const projectsSection = page.locator('section#projects')
    if ((await projectsSection.count()) === 0) return // no projects seeded

    await expect(projectsSection).toBeVisible()
    await expect(projectsSection.locator('h2#projects-heading')).toBeVisible()

    // Cards expose a collapsed full write-up via <details>
    const firstCard = projectsSection.locator('article').first()
    await expect(firstCard).toBeVisible()
    const details = firstCard.locator('details')
    await expect(details).toHaveCount(1)
    await expect(details).not.toHaveAttribute('open', '')

    // Whole-card click expands the write-up
    await firstCard.locator('h3').click()
    await expect(details).toHaveAttribute('open', '')

    // Clicking again collapses it
    await firstCard.locator('h3').click()
    await expect(details).not.toHaveAttribute('open', '')
  })

  test('renders Experience section with timeline and sidebar', async ({ page }) => {
    const experienceSection = page.locator('section#experience')
    await expect(experienceSection).toBeVisible()
    await expect(experienceSection.locator('h2#experience-heading')).toBeVisible()

    // Timeline renders at least one role
    const timeline = experienceSection.locator('ol[aria-label="Work experience history"] li')
    await expect(timeline.first()).toBeVisible()
  })

  test('renders Writing section when posts exist', async ({ page }) => {
    const writingSection = page.locator('section#writing')
    if ((await writingSection.count()) === 0) return // no posts seeded

    await expect(writingSection).toBeVisible()
    await expect(writingSection.locator('h2#writing-heading')).toBeVisible()

    // "all posts →" link to /blog
    await expect(writingSection.locator('a[href="/blog"]').first()).toBeVisible()

    // At least one post card
    await expect(
      writingSection.locator('ul[aria-label="Latest blog posts"] li').first()
    ).toBeVisible()
  })

  test('renders Contact section with form and social links', async ({ page }) => {
    const contactSection = page.locator('section#contact')
    await expect(contactSection).toBeVisible()
    await expect(contactSection.locator('form')).toBeVisible()
  })

  test('renders CTA buttons that are accessible', async ({ page }) => {
    const heroSection = page.locator('section#hero')
    const ctaButtons = heroSection.locator('a').filter({ has: page.locator('text=/./') })
    expect(await ctaButtons.count()).toBeGreaterThan(0)
    await expect(ctaButtons.first()).toHaveAttribute('href')
  })

  test('main content has correct id for skip link', async ({ page }) => {
    const mainContent = page.locator('main#main-content')
    await expect(mainContent).toBeVisible()
  })
})
