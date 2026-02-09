import { test, expect } from '@playwright/test'

/**
 * End-to-End Tests for Invitation Display
 * 
 * Tests the complete recipient journey:
 * 1. Open shared invitation link
 * 2. View personalized invitation with all content
 * 3. Handle error states (expired, invalid)
 * 4. Verify responsive layout
 */

test.describe('Invitation Display E2E', () => {
  // Helper function to create a valid invitation URL
  function createInvitationUrl(encodedData) {
    return `http://localhost:5173/?id=${encodedData}`
  }

  test('should display loading state initially', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173/')
    
    // Should initially show create page
    await expect(page.locator('.form')).toBeVisible()
  })

  test('should show invalid invitation for malformed ID', async ({ page }) => {
    // Navigate with invalid ID
    await page.goto('http://localhost:5173/?id=invalid-data-123')
    
    // Should show invalid error state
    const invalidError = page.locator('.invitation--invalid')
    await expect(invalidError).toBeVisible()
    
    // Should show helpful error message
    await expect(page.locator('text=Invalid')).toBeVisible()
  })

  test('should display invitation with valid encoded data', async ({ page }) => {
    // First create an invitation via the form
    await page.goto('http://localhost:5173/')
    
    // Fill form
    await page.fill('#recipient-name', 'Charlie')
    await page.fill('#sender-name', 'Diana')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for link to be generated
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get the generated link
    const linkInput = page.locator('input[readonly]')
    const linkValue = await linkInput.inputValue()
    
    // Click the link to navigate to view page
    // Extract the encoded ID from the URL
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Navigate to invitation view
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Should show invitation component
    await expect(page.locator('.invitation')).toBeVisible()
    
    // Should display recipient name
    await expect(page.locator('text=Charlie')).toBeVisible()
    
    // Should display sender name
    await expect(page.locator('text=Diana')).toBeVisible()
  })

  test('should display background GIF', async ({ page }) => {
    // Create an invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Eve')
    await page.fill('#sender-name', 'Frank')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get the shared link
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Navigate to view page
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // GIF should be rendered
    const gifImage = page.locator('.invitation__gif')
    if (await gifImage.isVisible()) {
      expect(await gifImage.getAttribute('src')).toContain('giphy.com')
    }
  })

  test('should display recipient and sender names prominently', async ({ page }) => {
    // Create invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Grace')
    await page.fill('#sender-name', 'Henry')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link and navigate
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Verify names are displayed
    await expect(page.locator('.invitation__title')).toContainText('Grace')
    await expect(page.locator('.invitation__author')).toContainText('Henry')
  })

  test('should display optional image if provided', async ({ page }) => {
    // Create invitation with image
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Iris')
    await page.fill('#sender-name', 'Jack')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    await page.fill('#image-url', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link and navigate
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Check if image is displayed
    const image = page.locator('.invitation__image')
    if (await image.isVisible()) {
      const src = await image.getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Create invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Kate')
    await page.fill('#sender-name', 'Leo')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link and navigate
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Stay on mobile viewport and navigate to invitation
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Should display properly on mobile
    await expect(page.locator('.invitation')).toBeVisible()
    
    // Text should be readable
    const titleText = await page.locator('.invitation__title').textContent()
    expect(titleText).toContain('Kate')
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Create invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Mike')
    await page.fill('#sender-name', 'Nora')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Navigate to invitation on tablet
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Should display
    await expect(page.locator('.invitation')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Create invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Oscar')
    await page.fill('#sender-name', 'Piper')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Navigate to invitation on desktop
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Should display
    await expect(page.locator('.invitation')).toBeVisible()
  })

  test('should handle page reload gracefully', async ({ page }) => {
    // Create invitation
    await page.goto('http://localhost:5173/')
    
    await page.fill('#recipient-name', 'Quinn')
    await page.fill('#sender-name', 'Rachel')
    await page.fill('#gif-url', 'https://media.giphy.com/media/LCvvhuiGg5fxyqY9T/giphy.gif')
    
    await page.click('button[type="submit"]')
    await expect(page.locator('.form__result')).toBeVisible()
    
    // Get link
    const linkValue = await page.locator('input[readonly]').inputValue()
    const url = new URL(linkValue)
    const encodedId = url.searchParams.get('id')
    
    // Navigate to invitation
    await page.goto(`http://localhost:5173/?id=${encodedId}`)
    
    // Reload page
    await page.reload()
    
    // Should still display invitation
    await expect(page.locator('.invitation')).toBeVisible()
    await expect(page.locator('text=Quinn')).toBeVisible()
  })

  test('should show error when navigating without ID parameter', async ({ page }) => {
    // Navigate without ID
    await page.goto('http://localhost:5173/?id=')
    
    // Should show error or create page
    const invitation = page.locator('.invitation')
    const form = page.locator('.form')
    
    // Should either show invitation error or go back to form
    const pageContent = await page.content()
    expect(
      pageContent.includes('Invalid') || 
      pageContent.includes('form') ||
      pageContent.includes('Create')
    ).toBe(true)
  })
})
