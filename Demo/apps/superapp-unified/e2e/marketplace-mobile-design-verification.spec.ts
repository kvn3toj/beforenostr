import { test, expect } from '@playwright/test';

test.describe('Marketplace Mobile Design Verification', () => {
  test('should match Builder.io mobile design specification', async ({
    page,
  }) => {
    // Set mobile viewport to match the design
    await page.setViewportSize({ width: 360, height: 800 });

    // Navigate to marketplace
    await page.goto('/marketplace');

    // Wait for React to mount
    await page.waitForSelector('#root');

    // Verify mobile layout is active
    await expect(
      page.locator('[data-testid="mobile-marketplace"]')
    ).toBeVisible({ timeout: 10000 });

    // Verify status bar exists
    await expect(page.locator('text=9:30')).toBeVisible();

    // Verify top app bar with ÜMarket title
    await expect(page.locator('text=ÜMarket')).toBeVisible();

    // Verify consumer/provider toggle
    await expect(page.locator('text=Consumidor')).toBeVisible();
    await expect(page.locator('text=Proveedor')).toBeVisible();

    // Verify search bar
    await expect(
      page.locator('input[placeholder*="Qué quieres encontrar"]')
    ).toBeVisible();

    // Verify categories section
    await expect(page.locator('text=Categoría').first()).toBeVisible();
    await expect(page.locator('text=Ver todo')).toBeVisible();

    // Verify Recomendados section
    await expect(page.locator('text=Recomendados')).toBeVisible();

    // Verify Categorías section
    await expect(page.locator('text=Categorías')).toBeVisible();

    // Take screenshot for visual comparison
    await page.screenshot({
      path: 'marketplace-mobile-design-verification.png',
      fullPage: true,
    });
  });

  test('should show consumer tab as selected by default', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    // Check that Consumidor button has active styling
    const consumerButton = page.locator('text=Consumidor');
    await expect(consumerButton).toBeVisible();

    // Check background color indicates active state
    const consumerButtonStyles = await consumerButton.evaluate((el) => {
      return window.getComputedStyle(el.parentElement || el);
    });

    // Should have purple background when active
    expect(consumerButtonStyles.backgroundColor).toContain('rgb(116, 0, 86)');
  });

  test('should toggle between consumer and provider roles', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    // Click Proveedor button
    await page.click('text=Proveedor');

    // Wait for state change
    await page.waitForTimeout(300);

    // Verify Proveedor is now selected
    const proveedorButton = page.locator('text=Proveedor');
    const proveedorButtonStyles = await proveedorButton.evaluate((el) => {
      return window.getComputedStyle(el.parentElement || el);
    });

    expect(proveedorButtonStyles.backgroundColor).toContain('rgb(116, 0, 86)');
  });

  test('should have interactive search functionality', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    const searchInput = page.locator(
      'input[placeholder*="Qué quieres encontrar"]'
    );

    // Type in search box
    await searchInput.fill('producto test');

    // Verify input value
    await expect(searchInput).toHaveValue('producto test');

    // Submit search
    await searchInput.press('Enter');

    // Wait for search to process
    await page.waitForTimeout(500);
  });

  test('should display category icons and labels', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    // Verify multiple category labels are present
    const categoryLabels = page.locator('text=Categoría');
    await expect(categoryLabels).toHaveCount(4, { timeout: 5000 });

    // Verify "Ver todo" button exists
    await expect(page.locator('text=Ver todo')).toBeVisible();
  });

  test('should have proper mobile responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    // Verify container has proper mobile constraints
    const container = page.locator('[data-testid="mobile-marketplace"]');
    const containerBox = await container.boundingBox();

    if (containerBox) {
      expect(containerBox.width).toBeLessThanOrEqual(360);
    }

    // Verify elements are properly stacked vertically
    const statusBar = page.locator('text=9:30');
    const header = page.locator('text=ÜMarket');
    const toggle = page.locator('text=Consumidor');

    const statusBarBox = await statusBar.boundingBox();
    const headerBox = await header.boundingBox();
    const toggleBox = await toggle.boundingBox();

    if (statusBarBox && headerBox && toggleBox) {
      expect(statusBarBox.y).toBeLessThan(headerBox.y);
      expect(headerBox.y).toBeLessThan(toggleBox.y);
    }
  });

  test('should match color scheme from Builder.io design', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/marketplace');
    await page.waitForSelector('#root');

    // Check main container background
    const container = page.locator('[data-testid="mobile-marketplace"]');
    const containerStyles = await container.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    expect(containerStyles.backgroundColor).toBe('rgb(255, 255, 255)');

    // Check status bar background
    const statusBar = page.locator('text=9:30').locator('..');
    const statusBarStyles = await statusBar.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    expect(statusBarStyles.backgroundColor).toBe('rgb(254, 247, 255)');
  });
});
