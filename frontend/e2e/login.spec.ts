import { test, expect } from "@playwright/test"

test.describe("Login page", () => {
  test("renders login form elements", async ({ page }) => {
    await page.goto("/login")

    // Email input
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
    await expect(emailInput).toBeVisible()

    // Password input
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()

    // Submit button
    const submitButton = page.locator('button[type="submit"]').first()
    await expect(submitButton).toBeVisible()
  })
})
