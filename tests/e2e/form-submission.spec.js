import { test, expect } from '@playwright/test'

/**
 * End-to-End Tests for Form Submission
 * 
 * Tests the complete user journey:
 * 1. Load invitation creation page
 * 2. Fill in form fields
 * 3. Submit form and generate link
 * 4. Copy link to clipboard
 * 5. Verify link contains valid invitation data
 */

test.describe('Form Submission E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173/')
    
    // Verify we're on the create page
    await expect(page.locator('.form')).toBeVisible()
  })

  test('should complete full form submission flow', async ({ page }) => {
    // Fill in recipient name
    await page.fill('#recipient-name', 'Alice')
    
    // Fill in sender name
    await page.fill('#sender-name', 'Bob')
    
    // Fill in GIF URL
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for link to be generated
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Verify link is displayed
    const linkInput = page.locator('input[readonly]')
    const linkValue = await linkInput.inputValue()
    expect(linkValue).toContain('id=')
  })

  test('should validate required fields before submission', async ({ page }) => {
    // Try to submit without filling fields
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('.form__error')).toBeVisible()
    
    // Link should not be generated
    await expect(page.locator('.form__result')).not.toBeVisible()
  })

  test('should accept optional image URL', async ({ page }) => {
    // Fill in all required fields
    await page.fill('#recipient-name', 'Alice')
    await page.fill('#sender-name', 'Bob')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    // Fill in optional image URL
    await page.fill('#image-url', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for link to be generated
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Verify link is displayed
    const linkInput = page.locator('input[readonly]')
    const linkValue = await linkInput.inputValue()
    expect(linkValue).toContain('id=')
  })

  test('should generate valid base64 encoded invitation link', async ({ page }) => {
    // Fill form
    await page.fill('#recipient-name', 'Alice')
    await page.fill('#sender-name', 'Bob')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    // Submit
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get the generated link
    const linkInput = page.locator('input[readonly]')
    const linkValue = await linkInput.inputValue()
    
    // Extract the id parameter
    const urlParams = new URL(linkValue).searchParams
    const encodedId = urlParams.get('id')
    
    // Verify it looks like base64 (has valid base64 characters)
    expect(encodedId).toMatch(/^[A-Za-z0-9+/=]+$/)
  })

  test('should allow copying link to clipboard', async ({ context, page }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    
    // Fill form
    await page.fill('#recipient-name', 'Alice')
    await page.fill('#sender-name', 'Bob')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    // Submit
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Click copy button
    const copyButton = page.locator('button:has-text("Copy")')
    await copyButton.click()
    
    // Verify button shows copied feedback
    await expect(copyButton).toContainText('Copied')
  })

  test('should allow creating another invitation', async ({ page }) => {
    // Fill and submit form
    await page.fill('#recipient-name', 'Alice')
    await page.fill('#sender-name', 'Bob')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    await page.click('button[type="submit"]')
    
    // Wait for result
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Click create another button
    const createAnotherButton = page.locator('button:has-text("Create Another")')
    await createAnotherButton.click()
    await page.waitForTimeout(100)
    
    // Form should be reset
    const recipientInput = page.locator('#recipient-name')
    const senderInput = page.locator('#sender-name')
    const gifInput = page.locator('#gif-url')
    
    expect(await recipientInput.inputValue()).toBe('')
    expect(await senderInput.inputValue()).toBe('')
    expect(await gifInput.inputValue()).toBe('')
    
    // Result should be hidden
    await expect(page.locator('.form__result')).not.toBeVisible()
  })

  test('should show error for invalid GIF URL format', async ({ page }) => {
    // Fill form with invalid GIF URL
    await page.fill('#recipient-name', 'Alice')
    await page.fill('#sender-name', 'Bob')
    await page.fill('#gif-url', 'https://example.com/image.jpg')
    
    // Trigger validation by blurring
    await page.locator('#gif-url').blur()
    
    // Wait for error message
    await expect(page.locator('.form__error')).toBeVisible()
    
    // Try to submit
    await page.click('button[type="submit"]')
    
    // Link should not be generated
    await expect(page.locator('.form__result')).not.toBeVisible()
  })

  test('should validate recipient name field', async ({ page }) => {
    // Leave recipient name empty and blur
    await page.locator('#recipient-name').blur()
    
    // Should show error
    await expect(page.locator('.form__error')).toBeVisible()
  })

  test('should validate sender name field', async ({ page }) => {
    // Leave sender name empty and blur
    await page.locator('#sender-name').blur()
    
    // Should show error
    await expect(page.locator('.form__error')).toBeVisible()
  })
})
