import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 10000 });

    // Wait for main content to be visible
    await page.waitForSelector('[data-testid="app-header"]', { timeout: 5000 });
  });

  test('should show hamburger menu button on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that hamburger menu button is visible
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"]');
    await expect(hamburgerButton).toBeVisible();

    // Verify it has correct aria-label
    await expect(hamburgerButton).toHaveAttribute('aria-label', 'Abrir menú de navegación');
  });

  test('should hide hamburger menu button on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    // Check that hamburger menu button is hidden
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"]');
    await expect(hamburgerButton).not.toBeVisible();
  });

  test('should open mobile drawer when hamburger menu is clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Click hamburger menu button
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"]');
    await hamburgerButton.click();

    // Wait for drawer to open and check if sidebar content is visible
    await page.waitForTimeout(500); // Wait for animation

    // Look for navigation items that should be in the mobile drawer
    const drawerNavigation = page.locator('.MuiDrawer-root .MuiDrawer-paper');
    await expect(drawerNavigation).toBeVisible();

    // Check for specific navigation items
    await expect(page.locator('text=Inicio')).toBeVisible();
    await expect(page.locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('text=ÜPlay')).toBeVisible();
  });

  test('should close mobile drawer when clicking outside', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open drawer
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"]');
    await hamburgerButton.click();

    // Wait for drawer to open
    await page.waitForTimeout(500);

    // Verify drawer is open
    const drawerNavigation = page.locator('.MuiDrawer-root .MuiDrawer-paper');
    await expect(drawerNavigation).toBeVisible();

    // Click on backdrop to close drawer
    const backdrop = page.locator('.MuiModal-backdrop');
    await backdrop.click();

    // Wait for drawer to close
    await page.waitForTimeout(500);

    // Verify drawer is closed
    await expect(drawerNavigation).not.toBeVisible();
  });

  test('should navigate correctly when clicking menu items in mobile drawer', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open drawer
    const hamburgerButton = page.locator('[data-testid="hamburger-menu"]');
    await hamburgerButton.click();

    // Wait for drawer to open
    await page.waitForTimeout(500);

    // Click on Marketplace navigation item
    await page.locator('text=Marketplace').click();

    // Wait for navigation
    await page.waitForTimeout(1000);

    // Verify we're on the marketplace page
    await expect(page).toHaveURL(/.*\/marketplace/);

    // Verify drawer closes after navigation (this is typical behavior)
    const drawerNavigation = page.locator('.MuiDrawer-root .MuiDrawer-paper');
    await expect(drawerNavigation).not.toBeVisible();
  });

  test('should show bottom navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that bottom navigation is visible on mobile
    const bottomNav = page.locator('[data-testid="bottom-navigation"]');
    await expect(bottomNav).toBeVisible();
  });

  test('should hide bottom navigation on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    // Check that bottom navigation is hidden on desktop
    const bottomNav = page.locator('[data-testid="bottom-navigation"]');
    await expect(bottomNav).not.toBeVisible();
  });
});
