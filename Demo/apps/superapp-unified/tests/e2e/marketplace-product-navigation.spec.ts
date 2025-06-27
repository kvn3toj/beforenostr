import { test, expect } from '@playwright/test';

test.describe('Marketplace Product Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');

    // Wait for login to complete
    await page.waitForURL('/', { timeout: 15000 });

    // Navigate to marketplace
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to product detail when clicking on a product card', async ({ page }) => {
    // Wait for marketplace to load
    await page.waitForSelector('[data-testid="marketplace-container"]', { timeout: 10000 });

    // Look for product cards and click on the first one
    const productCards = page.locator('div[data-testid="marketplace-container"] .MuiCard-root');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Click on the first product card
    await productCards.first().click();

    // Wait for navigation to product detail page
    await page.waitForURL(/\/marketplace\/item\/.*/, { timeout: 10000 });

    // Verify we're on the product detail page
    expect(page.url()).toMatch(/\/marketplace\/item\/[^/]+$/);

    // Verify product detail page elements are visible
    await expect(page.locator('h1, h2, h3, h4')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Volver al Marketplace, text=Marketplace')).toBeVisible({ timeout: 5000 });
  });

  test('should be able to navigate back to marketplace from product detail', async ({ page }) => {
    // First navigate to a product detail
    await test.step('Navigate to product detail', async () => {
      await page.waitForSelector('[data-testid="marketplace-container"]', { timeout: 10000 });
      const productCards = page.locator('div[data-testid="marketplace-container"] .MuiCard-root');
      await productCards.first().click();
      await page.waitForURL(/\/marketplace\/item\/.*/, { timeout: 10000 });
    });

    // Then navigate back using the back button
    await test.step('Navigate back to marketplace', async () => {
      // Click on breadcrumb or back button
      const backButton = page.locator('button:has(svg), button:has-text("Marketplace"), button:has-text("Volver")').first();
      await backButton.click();

      // Wait for marketplace to load
      await page.waitForURL('/marketplace', { timeout: 10000 });

      // Verify we're back on the marketplace
      await expect(page.locator('[data-testid="marketplace-container"]')).toBeVisible({ timeout: 5000 });
    });
  });
});
