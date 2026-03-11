import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to contact section
    await page.locator('section#contact').scrollIntoViewIfNeeded()
  })

  test('shows validation errors for empty submission', async ({ page }) => {
    // Click submit without filling any fields
    await page.getByRole('button', { name: /send message/i }).click()

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
    // Fill in name and message, but with invalid email
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/message/i).fill('This is a test message.')

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click()

    // Email validation error should appear
    const emailError = page.locator('#email-error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText(/email/i)
  })

  test('shows validation error for short message', async ({ page }) => {
    // Fill in name and email, but with short message
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/message/i).fill('Hi')

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click()

    // Message validation error should appear (too short)
    const messageError = page.locator('#message-error')
    await expect(messageError).toBeVisible()
  })

  test('successful form submission shows success toast', async ({ page }) => {
    // Fill in valid form data
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page
      .getByLabel(/message/i)
      .fill('This is a test message for the contact form submission.')

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click()

    // Wait for the toast to appear
    const toast = page.locator('[data-state="open"]').filter({ hasText: /message sent/i })
    await expect(toast).toBeVisible({ timeout: 10000 })
  })

  test('form fields have proper accessibility attributes', async ({ page }) => {
    // Check name input
    const nameInput = page.getByLabel(/name/i)
    await expect(nameInput).toHaveAttribute('aria-required', 'true')

    // Check email input
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toHaveAttribute('aria-required', 'true')
    await expect(emailInput).toHaveAttribute('type', 'email')

    // Check message textarea
    const messageTextarea = page.getByLabel(/message/i)
    await expect(messageTextarea).toHaveAttribute('aria-required', 'true')
  })

  test('submit button shows loading state during submission', async ({ page }) => {
    // Fill in valid form data
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/message/i).fill('This is a test message for loading state verification.')

    // Submit the form and check for loading state
    const submitButton = page.getByRole('button', { name: /send message/i })
    await submitButton.click()

    // Button should show loading state (check for aria-busy or text change)
    // The button text changes to "Sending..." during submission
    await expect(submitButton).toContainText(/sending/i)
  })
})
