import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders Hero section with name and headline', async ({ page }) => {
    const heroSection = page.locator('section#hero')
    await expect(heroSection).toBeVisible()

    // Hero should have a heading with the name
    const h1 = heroSection.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).not.toBeEmpty()

    // Hero should have a headline (h2)
    const h2 = heroSection.locator('h2')
    await expect(h2).toBeVisible()
    await expect(h2).not.toBeEmpty()
  })

  test('renders About section', async ({ page }) => {
    const aboutSection = page.locator('section#about')
    await expect(aboutSection).toBeVisible()

    const heading = aboutSection.locator('h2#about-heading')
    await expect(heading).toBeVisible()
  })

  test('renders Experience section', async ({ page }) => {
    const experienceSection = page.locator('section#experience')
    await expect(experienceSection).toBeVisible()

    const heading = experienceSection.locator('h2#experience-heading')
    await expect(heading).toBeVisible()
  })

  test('renders Education section', async ({ page }) => {
    const educationSection = page.locator('section#education')
    await expect(educationSection).toBeVisible()

    const heading = educationSection.locator('h2#education-heading')
    await expect(heading).toBeVisible()
  })

  test('renders Projects section', async ({ page }) => {
    const projectsSection = page.locator('section#projects')
    await expect(projectsSection).toBeVisible()

    const heading = projectsSection.locator('h2#projects-heading')
    await expect(heading).toBeVisible()
  })

  test('renders Skills section', async ({ page }) => {
    const skillsSection = page.locator('section#skills')
    await expect(skillsSection).toBeVisible()

    const heading = skillsSection.locator('h2#skills-heading')
    await expect(heading).toBeVisible()
  })

  test('renders GitHub activity section', async ({ page }) => {
    const githubSection = page.locator('section#github')
    await expect(githubSection).toBeVisible()

    const heading = githubSection.locator('h2#github-heading')
    await expect(heading).toBeVisible()
  })

  test('renders CTA buttons that are accessible', async ({ page }) => {
    const heroSection = page.locator('section#hero')

    // Check for CTA buttons (links styled as buttons)
    const ctaButtons = heroSection.locator('a').filter({ has: page.locator('text=/./') })
    const count = await ctaButtons.count()

    // Should have at least one CTA button
    expect(count).toBeGreaterThan(0)

    // Each button should have an href
    const firstButton = ctaButtons.first()
    await expect(firstButton).toHaveAttribute('href')
  })

  test('main content has correct id for skip link', async ({ page }) => {
    const mainContent = page.locator('main#main-content')
    await expect(mainContent).toBeVisible()
  })
})
