import { test, expect } from '@playwright/test';

test.describe('Marketplace Product Page Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the SuperApp and login
    await page.goto('http://localhost:3001');

    // Login with real backend credentials
    await page.fill('[data-testid="login-email-input"] input', 'test@coomunity.com');
    await page.fill('[data-testid="login-password-input"] input', 'test123');
    await page.click('[data-testid="login-submit-button"]');

    // Wait for redirect to home page
    await page.waitForURL('**/', { timeout: 15000 });

    // Navigate to marketplace
    await page.click('text=Marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to product detail page when clicking on product card', async ({ page }) => {
    // Wait for marketplace items to load
    await page.waitForSelector('[data-testid="marketplace-card"]', { timeout: 10000 });

    // Get the first product card
    const firstProductCard = page.locator('[data-testid="marketplace-card"]').first();

    // Get the product ID from the first card
    const productId = await firstProductCard.getAttribute('data-product-id');
    expect(productId).toBeTruthy();

    // Click on the first product card
    await firstProductCard.click();

    // Verify navigation to product detail page
    await page.waitForURL(`**/marketplace/item/${productId}`, { timeout: 10000 });

    // Verify product detail page loads correctly
    await page.waitForSelector('[data-testid="product-detail-page"]', { timeout: 10000 });

    // Verify product title is visible
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

    // Verify product description is visible
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();

    // Verify product price is visible
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();

    // Verify seller information is visible
    await expect(page.locator('[data-testid="seller-info"]')).toBeVisible();
  });

  test('should handle navigation back to marketplace from product page', async ({ page }) => {
    // Navigate to a product page first
    await page.waitForSelector('[data-testid="marketplace-card"]', { timeout: 10000 });
    const firstProductCard = page.locator('[data-testid="marketplace-card"]').first();
    await firstProductCard.click();

    // Wait for product page to load
    await page.waitForSelector('[data-testid="product-detail-page"]', { timeout: 10000 });

    // Navigate back to marketplace
    await page.goBack();

    // Verify we're back on marketplace page
    await page.waitForSelector('[data-testid="marketplace-grid"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="marketplace-grid"]')).toBeVisible();
  });

  test('should display error message if product not found', async ({ page }) => {
    // Navigate directly to a non-existent product
    await page.goto('http://localhost:3001/marketplace/item/non-existent-product');

    // Wait for error state to load
    await page.waitForSelector('[data-testid="product-not-found"]', { timeout: 10000 });

    // Verify error message is displayed
    await expect(page.locator('[data-testid="product-not-found"]')).toBeVisible();
    await expect(page.locator('text=Product not found')).toBeVisible();
  });
});
