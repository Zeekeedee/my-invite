import { test, expect } from '@playwright/test'

test.describe('Invitation visual regression', () => {
  // Shared static fixture HTML for visual snapshots
  const fixtureHtml = `
      <html>
        <head>
          <style>
            .invitation{display:flex;align-items:center;justify-content:center;width:800px;height:600px}
            .invitation__content{position:relative;z-index:5}
            .invitation__box{background:#fff;padding:32px;max-width:500px;text-align:center}
            .invitation__box--pixel{}
            .invitation__hearts{position:absolute;inset:0;display:flex;gap:12px;align-items:center;justify-content:center;pointer-events:none}
            .invitation__hearts-column{display:flex;flex-direction:column;gap:6px}
            .invitation__heart{width:24px;height:24px;color:#ff6b81}
            .invitation__pixel-border{position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);pointer-events:none;z-index:4;color:#2d3436}
            svg{display:block}
            use{stroke:#000;stroke-width:1px;fill:currentColor}
          </style>
        </head>
        <body>
          <div class="invitation">
            <div class="invitation__content">
              <svg class="invitation__pixel-border" aria-hidden="true" role="presentation" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="4" shape-rendering="crispEdges" stroke-linejoin="miter" /></svg>
              <div class="invitation__box invitation__box--pixel">
                <h1 class="invitation__title">Hi Friend!</h1>
                <p class="invitation__author">— from Someone</p>
              </div>
            </div>
            <div class="invitation__hearts" aria-hidden="true" role="presentation">
              <div class="invitation__hearts-column invitation__hearts-column--up">
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><symbol id="heart-symbol" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1 4.5 2.09C12.09 5 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></symbol></defs><use href="#heart-symbol" /></svg>
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart-symbol" /></svg>
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart-symbol" /></svg>
              </div>
              <div class="invitation__hearts-column invitation__hearts-column--down">
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart-symbol" /></svg>
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart-symbol" /></svg>
                <svg class="invitation__heart" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart-symbol" /></svg>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

  test('desktop invitation matches reference and DOM checks', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.setContent(fixtureHtml)
    const invitation = page.locator('.invitation')
    await expect(invitation).toBeVisible()

    // Capture screenshot of the invitation element and compare
    await expect(invitation).toHaveScreenshot('invitation-desktop.png')

    // DOM-level checks: hearts are 24x24 and pixel-class present
    const hearts = await page.locator('.invitation__heart')
    const count = await hearts.count()
    for (let i = 0; i < count; i++) {
      const box = await hearts.nth(i).boundingBox()
      if (box) {
        expect(Math.round(box.width)).toBe(24)
        expect(Math.round(box.height)).toBe(24)
      }
    }

    const boxHasClass = await page.locator('.invitation__box--pixel').count()
    expect(boxHasClass).toBeGreaterThan(0)
  })

  test('mobile invitation matches reference', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.setContent(fixtureHtml)
    const invitation = page.locator('.invitation')
    await expect(invitation).toBeVisible()
    await expect(invitation).toHaveScreenshot('invitation-mobile.png')
  })
})
