import { test, expect } from '@playwright/test';

test.describe('UPlay Videos Loading - Mock System Fixed', () => {
  test('should load and display videos from mock data in UPlay', async ({ page }) => {
    console.log('🎬 Testing UPlay video loading with fixed mock system...');

    // Navigate to the SuperApp
    await page.goto('/');

    // Wait for React to mount
    await page.waitForSelector('#root');

    // Navigate to UPlay
    await page.goto('/uplay');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for potential async operations
    await page.waitForTimeout(3000);

    // Check for videos loading
    const hasVideoContent = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      return {
        hasReciprocidad: bodyText.includes('Reciprocidad'),
        hasBienComun: bodyText.includes('Bien Común'),
        hasOndas: bodyText.includes('Öndas'),
        hasVideoTitles: bodyText.includes('Introducción') || bodyText.includes('Principios'),
        hasVideoElements: document.querySelectorAll('[data-testid*="video"], .video-card, [class*="video"]').length > 0,
        hasLoadingText: bodyText.includes('Cargando'),
        bodyTextLength: bodyText.length
      };
    });

    console.log('📋 Page content analysis:', hasVideoContent);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/uplay-videos-loading.png', fullPage: true });

    // Check that we have CoomÜnity content
    expect(hasVideoContent.hasReciprocidad || hasVideoContent.hasBienComun || hasVideoContent.hasOndas).toBe(true);

    // The page should have substantial content
    expect(hasVideoContent.bodyTextLength).toBeGreaterThan(100);

    // Should not be stuck in permanent loading state
    expect(hasVideoContent.hasLoadingText).toBe(false);
  });
});
