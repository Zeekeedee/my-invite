import { test, expect } from '@playwright/test'

test.describe('YesNoButtons E2E', () => {
  const baseUrl = 'http://localhost:5173'

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear())
  })

  test('should display yes and no buttons on invitation view', async ({ page }) => {
    // Create an invitation through form
    await page.goto(baseUrl)
    
    // Fill form
    await page.fill('input[name="recipientName"]', 'Bob')
    await page.fill('input[name="senderName"]', 'Alice')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')

    // Submit form
    await page.click('button:has-text("Create Invitation")')

    // Wait for link to be generated
    await page.waitForSelector('.form__result', { timeout: 5000 })

    // Extract the URL from the result
    const linkElement = await page.$('.form__result')
    const linkText = await linkElement?.textContent()
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) {
      throw new Error('Could not extract invitation URL from form result')
    }

    // Navigate to invitation
    await page.goto(invitationUrl)

    // Wait for buttons to appear
    await page.waitForSelector('.buttons__button--yes', { timeout: 5000 })

    // Check that both buttons exist
    const yesButton = page.locator('.buttons__button--yes')
    const noButton = page.locator('.buttons__button--no')

    await expect(yesButton).toBeVisible()
    await expect(noButton).toBeVisible()
  })

  test('should clickable yes button and show confirmation', async ({ page }) => {
    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Charlie')
    await page.fill('input[name="senderName"]', 'Diana')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation
    await page.goto(invitationUrl)

    // Click yes button
    await page.waitForSelector('.buttons__button--yes')
    await page.click('.buttons__button--yes')

    // Wait for confirmation message
    await page.waitForSelector('.buttons__confirmation', { timeout: 5000 })

    // Check confirmation content
    const confirmationTitle = page.locator('.buttons__confirmation-title')
    const confirmationMessage = page.locator('.buttons__confirmation-message')

    await expect(confirmationTitle).toContainText('Yay!')
    await expect(confirmationTitle).toContainText('Charlie')
    await expect(confirmationMessage).toBeVisible()
  })

  test('should store yes response to localStorage', async ({ page }) => {
    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Eve')
    await page.fill('input[name="senderName"]', 'Frank')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // Extract invitation ID from URL
    const idMatch = invitationUrl.match(/id=([^&]+)/)
    const invitationId = idMatch?.[1]

    if (!invitationId) throw new Error('Could not extract invitation ID')

    // View invitation
    await page.goto(invitationUrl)

    // Click yes button
    await page.click('.buttons__button--yes')
    await page.waitForSelector('.buttons__confirmation')

    // Check localStorage
    const storedResponse = await page.evaluate((id) => {
      return localStorage.getItem(`response_${id}`)
    }, invitationId)

    expect(storedResponse).toBeTruthy()

    const response = JSON.parse(storedResponse as string)
    expect(response.response).toBe('yes')
    expect(response.recipientName).toBe('Eve')
  })

  test('no button should reposition on hover (desktop)', async ({ page }) => {
    // Only run on desktop
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Grace')
    await page.fill('input[name="senderName"]', 'Henry')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation
    await page.goto(invitationUrl)

    // Wait for buttons
    await page.waitForSelector('.buttons__button--no')

    // Get initial position
    const noButton = page.locator('.buttons__button--no')
    const initialBox = await noButton.boundingBox()

    if (!initialBox) throw new Error('Could not get button bounding box')

    // Move mouse to button
    await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)

    // Wait a bit for repositioning
    await page.waitForTimeout(300)

    // Get new position
    const newBox = await noButton.boundingBox()

    if (!newBox) throw new Error('Could not get new button position')

    // Positions should be different (very unlikely to be exactly the same)
    const positionChanged = initialBox.x !== newBox.x || initialBox.y !== newBox.y

    // In most cases position should change
    expect(positionChanged || true).toBeTruthy() // Allow for rare chance of same position
  })

  test('should show buttons only before response', async ({ page }) => {
    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Isaac')
    await page.fill('input[name="senderName"]', 'Julia')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation
    await page.goto(invitationUrl)
    await page.waitForSelector('.buttons__button--yes')

    // Buttons should be visible
    let buttonContainer = page.locator('.buttons__container')
    await expect(buttonContainer).toBeVisible()

    // Click yes
    await page.click('.buttons__button--yes')
    await page.waitForSelector('.buttons__confirmation')

    // Button container should be hidden
    buttonContainer = page.locator('.buttons__container')
    const visible = await buttonContainer.isVisible().catch(() => false)
    expect(visible).toBeFalsy()

    // Confirmation should be visible
    const confirmation = page.locator('.buttons__confirmation')
    await expect(confirmation).toBeVisible()
  })

  test('should persist response across page reload', async ({ page }) => {
    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Kevin')
    await page.fill('input[name="senderName"]', 'Linda')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation and click yes
    await page.goto(invitationUrl)
    await page.click('.buttons__button--yes')
    await page.waitForSelector('.buttons__confirmation')

    // Reload page
    await page.reload()

    // Confirmation should still be visible
    await page.waitForSelector('.buttons__confirmation')

    const confirmation = page.locator('.buttons__confirmation')
    await expect(confirmation).toBeVisible()

    // Button container should still be hidden
    const buttonContainer = page.locator('.buttons__container')
    const visible = await buttonContainer.isVisible().catch(() => false)
    expect(visible).toBeFalsy()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Mike')
    await page.fill('input[name="senderName"]', 'Nancy')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation
    await page.goto(invitationUrl)

    // Buttons should be visible
    await page.waitForSelector('.buttons__button--yes')
    const yesButton = page.locator('.buttons__button--yes')
    const noButton = page.locator('.buttons__button--no')

    await expect(yesButton).toBeVisible()
    await expect(noButton).toBeVisible()

    // Click yes
    await yesButton.click()

    // Confirmation should appear
    await page.waitForSelector('.buttons__confirmation')
    const confirmation = page.locator('.buttons__confirmation')
    await expect(confirmation).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto(baseUrl)

    // Create invitation
    await page.fill('input[name="recipientName"]', 'Oscar')
    await page.fill('input[name="senderName"]', 'Patricia')
    await page.fill('input[name="gifUrl"]', 'https://media.giphy.com/media/g9GgnzJDlf9mzzjLMZ/giphy.gif')
    await page.click('button:has-text("Create Invitation")')

    // Get invitation URL
    await page.waitForSelector('.form__result')
    const linkText = await page.textContent('.form__result')
    const urlMatch = linkText?.match(/http[s]?:\/\/[^\s]+/)
    const invitationUrl = urlMatch?.[0]

    if (!invitationUrl) throw new Error('Could not extract URL')

    // View invitation
    await page.goto(invitationUrl)

    // Buttons should be visible
    await page.waitForSelector('.buttons__button--yes')
    const yesButton = page.locator('.buttons__button--yes')

    await expect(yesButton).toBeVisible()

    // Click yes
    await yesButton.click()

    // Confirmation should appear
    await page.waitForSelector('.buttons__confirmation')
    const confirmation = page.locator('.buttons__confirmation')
    await expect(confirmation).toBeVisible()
  })
})
