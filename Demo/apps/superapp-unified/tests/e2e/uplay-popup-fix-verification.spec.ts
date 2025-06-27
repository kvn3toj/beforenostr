import { test, expect } from '@playwright/test';

test.describe('🎮 UPlay Popup Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login as a regular user
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL('**/', { timeout: 15000 });
  });

  test('🔍 Verify popup fix: No infinite loading', async ({ page }) => {
    // Navigate to UPlay
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');

    // Wait for initial load and potential popup
    await page.waitForTimeout(5000);

    // Check for any "Sabiduría Integrada" popups
    const popups = await page.locator('[data-testid*="wisdom-integration"], .conscious-feedback-popup').all();
    const popupCount = popups.length;

    console.log(`📊 Found ${popupCount} wisdom integration popups`);

    // Should have at most 1 popup (not infinite)
    expect(popupCount).toBeLessThanOrEqual(1);

    // If popup exists, verify it's not stuck in loading state
    if (popupCount > 0) {
      const popup = popups[0];

      // Check for loading indicators
      const loadingIndicators = await popup.locator('.MuiCircularProgress-root, [data-testid*="loading"]').count();

      // Wait a bit more to see if loading disappears
      await page.waitForTimeout(3000);

      const persistentLoading = await popup.locator('.MuiCircularProgress-root, [data-testid*="loading"]').count();

      expect(persistentLoading).toBe(0);
      console.log('✅ No persistent loading state detected');
    }
  });

  test('🎨 Verify popup colors use SuperApp violet palette', async ({ page }) => {
    // Navigate to UPlay
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');

    // Wait for potential popup to appear
    await page.waitForTimeout(5000);

    // Look for any conscious feedback popups
    const popups = await page.locator('.conscious-feedback-popup, [data-testid*="wisdom-integration"]').all();

    if (popups.length > 0) {
      const popup = popups[0];

      // Check for violet color scheme
      const violetElements = await popup.locator('[style*="#6366f1"], [style*="#8b5cf6"], [style*="rgb(99, 102, 241)"], [style*="rgb(139, 92, 246)"]').count();

      // Should have violet themed elements
      expect(violetElements).toBeGreaterThan(0);
      console.log(`✅ Found ${violetElements} violet-themed elements in popup`);

      // Check background colors
      const backgroundColor = await popup.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.backgroundColor;
      });

      console.log(`🎨 Popup background color: ${backgroundColor}`);

      // Should not be using generic Material-UI colors (blue/red)
      expect(backgroundColor).not.toContain('rgb(25, 118, 210)'); // Material-UI primary blue
      expect(backgroundColor).not.toContain('rgb(211, 47, 47)'); // Material-UI error red
    }
  });

  test('⚡ Verify popup performance: No stacking or memory leaks', async ({ page }) => {
    // Navigate to UPlay
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait and interact multiple times to trigger potential issues
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(2000);

      // Interact with page to potentially trigger popups
      await page.click('body');
      await page.keyboard.press('Space');

      // Check popup count doesn't keep growing
      const currentPopups = await page.locator('.conscious-feedback-popup, [data-testid*="wisdom-integration"]').count();

      // Should never have more than 3 popups (the defined limit)
      expect(currentPopups).toBeLessThanOrEqual(3);

      console.log(`🔄 Iteration ${i + 1}: ${currentPopups} popups found`);
    }

    // Verify no popup-related errors
    const popupErrors = consoleErrors.filter(error =>
      error.includes('wisdom') ||
      error.includes('popup') ||
      error.includes('infinite') ||
      error.includes('Maximum update depth exceeded')
    );

    expect(popupErrors).toHaveLength(0);
    console.log('✅ No popup-related console errors detected');
  });

  test('🧘 Verify conscious learning functionality still works', async ({ page }) => {
    // Navigate to UPlay
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    // Look for UPlay components
    const uplayComponents = await page.locator('[data-testid*="uplay"], .uplay-').count();
    expect(uplayComponents).toBeGreaterThan(0);

    // Check that core UPlay functionality is not broken
    const videoCards = await page.locator('[data-testid*="video-card"], .video-card').count();
    const interactiveElements = await page.locator('button, [role="button"]').count();

    console.log(`📹 Found ${videoCards} video cards`);
    console.log(`🎮 Found ${interactiveElements} interactive elements`);

    // Basic functionality should be present
    expect(interactiveElements).toBeGreaterThan(0);
    console.log('✅ UPlay core functionality preserved');
  });
});
