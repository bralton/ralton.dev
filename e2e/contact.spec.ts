import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    // Scroll to contact section
    await page.locator('section#contact').scrollIntoViewIfNeeded()
  })

  test('shows validation errors for empty submission', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Click submit without filling any fields
    await contactSection.getByRole('button', { name: /send message/i }).click()

    // Validation errors should appear
    const nameError = page.locator('#name-error')
    await expect(nameError).toBeVisible()
    await expect(nameError).toHaveAttribute('role', 'alert')

    const emailError = page.locator('#email-error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toHaveAttribute('role', 'alert')

    const messageError = page.locator('#message-error')
    await expect(messageError).toBeVisible()
    await expect(messageError).toHaveAttribute('role', 'alert')
  })

  test('shows validation error for invalid email format', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Fill in name and message, but with invalid email
    await contactSection.getByLabel(/^name/i).fill('Test User')
    await contactSection.getByLabel(/^email/i).fill('invalid-email')
    await contactSection.getByLabel(/^message/i).fill('This is a test message.')

    // Submit the form
    await contactSection.getByRole('button', { name: /send message/i }).click()

    // Email validation error should appear
    const emailError = page.locator('#email-error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText(/email/i)
  })

  test('shows validation error for short message', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Fill in name and email, but with short message
    await contactSection.getByLabel(/^name/i).fill('Test User')
    await contactSection.getByLabel(/^email/i).fill('test@example.com')
    await contactSection.getByLabel(/^message/i).fill('Hi')

    // Submit the form
    await contactSection.getByRole('button', { name: /send message/i }).click()

    // Message validation error should appear (too short)
    const messageError = page.locator('#message-error')
    await expect(messageError).toBeVisible()
  })

  test('successful form submission shows success toast', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Mock the contact API to return success
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({ status: 200, json: { success: true } })
    })

    // Fill in valid form data
    await contactSection.getByLabel(/^name/i).fill('Test User')
    await contactSection.getByLabel(/^email/i).fill('test@example.com')
    await contactSection
      .getByLabel(/^message/i)
      .fill('This is a test message for the contact form submission.')

    // Submit the form
    await contactSection.getByRole('button', { name: /send message/i }).click()

    // Wait for the toast to appear
    const toast = page.locator('[data-state="open"]').filter({ hasText: /message sent/i })
    await expect(toast).toBeVisible({ timeout: 10000 })
  })

  test('form fields have proper accessibility attributes', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Check name input
    const nameInput = contactSection.getByLabel(/^name/i)
    await expect(nameInput).toHaveAttribute('aria-required', 'true')

    // Check email input
    const emailInput = contactSection.getByLabel(/^email/i)
    await expect(emailInput).toHaveAttribute('aria-required', 'true')
    await expect(emailInput).toHaveAttribute('type', 'email')

    // Check message textarea
    const messageTextarea = contactSection.getByLabel(/^message/i)
    await expect(messageTextarea).toHaveAttribute('aria-required', 'true')
  })

  test('submit button has aria-busy attribute for accessibility', async ({ page }) => {
    const contactSection = page.locator('section#contact')

    // Verify the button has the aria-busy attribute (starts as false)
    const submitButton = contactSection.getByRole('button', { name: /send message/i })
    await expect(submitButton).toHaveAttribute('aria-busy', 'false')
  })
})
