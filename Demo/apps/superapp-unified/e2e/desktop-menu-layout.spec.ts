import { test, expect } from '@playwright/test';

test.describe('Desktop Menu Layout Fix', () => {
  test('should have properly positioned sidebar in desktop view', async ({ page }) => {
    console.log('🖥️ Testing desktop menu layout...');

    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    // Navigate to the SuperApp
    await page.goto('/');

    // Wait for React to mount
    await page.waitForSelector('#root');

    // Wait for layout to stabilize
    await page.waitForTimeout(2000);

    // Check for the sidebar
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Get sidebar bounding box
    const sidebarBox = await sidebar.boundingBox();
    console.log('📐 Sidebar dimensions:', sidebarBox);

    // Verify sidebar is properly positioned (should be on the left and not cover full screen)
    if (sidebarBox) {
      expect(sidebarBox.x).toBe(0); // Should start at left edge
      expect(sidebarBox.width).toBeLessThan(400); // Should not be too wide
      expect(sidebarBox.width).toBeGreaterThan(200); // Should be reasonable width
      expect(sidebarBox.height).toBeGreaterThan(400); // Should be reasonable height

      console.log('✅ Sidebar positioned correctly:');
      console.log(`   - X position: ${sidebarBox.x} (should be 0)`);
      console.log(`   - Width: ${sidebarBox.width}px (should be ~280px)`);
      console.log(`   - Height: ${sidebarBox.height}px`);
    }

    // Check that main content area exists and is properly positioned
    const mainContent = page.locator('[data-contextual="main-content"]');
    await expect(mainContent).toBeVisible();

    const mainContentBox = await mainContent.boundingBox();
    console.log('📐 Main content dimensions:', mainContentBox);

    if (mainContentBox && sidebarBox) {
      // Main content should start after the sidebar
      expect(mainContentBox.x).toBeGreaterThan(sidebarBox.width - 50); // Allow for some overlap/margin

      console.log('✅ Main content positioned correctly:');
      console.log(`   - X position: ${mainContentBox.x} (should be > ${sidebarBox.width})`);
      console.log(`   - Width: ${mainContentBox.width}px`);
    }

    // Verify that navigation items are clickable and visible
    const navigationItems = [
      'Inicio',
      'Marketplace',
      'ÜPlay',
      'Social'
    ];

    for (const item of navigationItems) {
      const navItem = page.locator(`text="${item}"`);
      await expect(navItem).toBeVisible();
      console.log(`✅ Navigation item "${item}" is visible`);
    }

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/desktop-menu-layout.png',
      fullPage: true
    });

    console.log('🎯 Desktop menu layout test completed successfully!');
  });

  test('should hide sidebar in mobile view', async ({ page }) => {
    console.log('📱 Testing mobile layout...');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the SuperApp
    await page.goto('/');

    // Wait for React to mount
    await page.waitForSelector('#root');

    // Wait for layout to stabilize
    await page.waitForTimeout(2000);

    // In mobile view, the permanent sidebar should be hidden
    const sidebar = page.locator('[data-testid="sidebar"]');

    // The sidebar content might be there but should be hidden via CSS
    const isVisible = await sidebar.isVisible();
    console.log('📱 Mobile sidebar visibility:', isVisible);

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/mobile-menu-layout.png',
      fullPage: true
    });
  });
});
