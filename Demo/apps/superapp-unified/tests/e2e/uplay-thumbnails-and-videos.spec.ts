import { test, expect } from '@playwright/test';

/**
 * This test suite verifies the functionality of the UPlay/Videoteca feature.
 * It ensures that video thumbnails are unique and that clicking a thumbnail
 * plays the correct corresponding video.
 */
test.describe('UPlay - Thumbnails and Video Playback Verification', () => {

  /**
   * Before each test, log in and navigate to the UPlay section.
   */
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:3001/login');

    // 2. Fill in credentials and submit the form using robust locators
    await page.locator('[data-testid="login-email-input"] input').fill('user@gamifier.com');
    await page.locator('[data-testid="login-password-input"] input').fill('123456');
    await page.locator('[data-testid="login-submit-button"]').click();

    // 3. Wait for successful login and redirection to the home page
    await page.waitForURL('http://localhost:3001/', { timeout: 15000 });

    // 4. Navigate to the UPlay/Videoteca section
    // IMPORTANT: This selector might need adjustment if the UI changes.
    await page.getByRole('button', { name: 'ÜPlay' }).click();
    await page.waitForURL('http://localhost:3001/uplay', { timeout: 10000 });
  });

  /**
   * This is the main test case. It verifies two critical features:
   * 1. Thumbnails on the UPlay page are unique for each video.
   * 2. Clicking a thumbnail opens and plays the correct video.
   */
  test('should display unique thumbnails and play the correct video', async ({ page }) => {
    // Wait for at least one video card thumbnail to be visible
    await expect(page.locator('[data-testid="uplay-video-thumbnail"]').first()).toBeVisible();

    // Get all video thumbnail locators to test a subset
    const allThumbnails = await page.locator('[data-testid="uplay-video-thumbnail"]').all();

    // Limit to the first 5 videos to keep the test execution fast
    const thumbnailsToTest = allThumbnails.slice(0, 5);

    expect(thumbnailsToTest.length).toBeGreaterThan(0);

    // --- Step 1: Verify that thumbnail image sources are unique ---
    const thumbnailSources = new Set<string>();
    for (const thumbnail of thumbnailsToTest) {
      const src = await thumbnail.getAttribute('src');
      expect(src).toBeTruthy();
      // Use the base URL (without query params) for uniqueness check
      const baseUrl = src!.split('?')[0];
      thumbnailSources.add(baseUrl);
    }

    // The number of unique URLs should match the number of thumbnails tested.
    // This assertion fails if multiple cards are showing the same image.
    expect(thumbnailSources.size).toBe(thumbnailsToTest.length);

    // --- Step 2: Verify that clicking each thumbnail plays the correct video ---
    for (let i = 0; i < thumbnailsToTest.length; i++) {
      // Re-fetch the locator inside the loop to avoid stale element issues after navigation
      const thumbnailLocator = page.locator('[data-testid="uplay-video-thumbnail"]').nth(i);
      const src = await thumbnailLocator.getAttribute('src');

      // Extract the YouTube video ID from the thumbnail URL to verify against the player
      const match = src!.match(/vi\/([a-zA-Z0-9_-]+)\//);
      expect(match).not.toBeNull();
      const expectedVideoId = match![1];

      // Click the thumbnail to open the video player
      await thumbnailLocator.click();

      // The player should be an iframe pointing to YouTube
      const videoPlayerIframe = page.locator('iframe[src*="youtube.com/embed"]');

      // Wait for the player to become visible and verify the video ID in its source URL
      await expect(videoPlayerIframe).toBeVisible({ timeout: 10000 });
      await expect(videoPlayerIframe).toHaveAttribute('src', new RegExp(expectedVideoId));

      // Go back to the UPlay page to test the next thumbnail
      await page.goBack();
      await page.waitForURL('http://localhost:3001/uplay');
    }
  });
});
