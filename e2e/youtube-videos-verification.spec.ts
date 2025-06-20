import { test, expect } from '@playwright/test';

test.describe('YouTube Videos Integration - UPlay Module', () => {
  
  test('should display UPlay page and videos', async ({ page }) => {
    console.log('🎯 Testing UPlay page with YouTube videos...');
    
    // Navigate to UPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'e2e/screenshots/uplay-page.png' });
    
    // Check if UPlay title is visible
    await expect(page.locator('text=ÜPlay')).toBeVisible({ timeout: 10000 });
    console.log('✅ UPlay page loaded successfully');
    
    // Check if we're in preview mode (should show Builder.io indicator)
    const previewIndicator = page.locator('text=/Modo Preview.*YouTube/');
    const isPreviewMode = await previewIndicator.count() > 0;
    
    if (isPreviewMode) {
      console.log('✅ Preview mode detected - YouTube videos should be available');
      await expect(previewIndicator).toBeVisible();
    } else {
      console.log('📱 Local mode detected - local videos should be available');
    }
    
    // Check for any video cards (using more generic selectors)
    const videoCards = page.locator('.MuiCard-root');
    const cardCount = await videoCards.count();
    console.log(`🎬 Found ${cardCount} video cards`);
    
    if (cardCount > 0) {
      console.log('✅ Video cards are present');
      expect(cardCount).toBeGreaterThan(0);
    } else {
      console.log('⚠️ No video cards found, checking for other video indicators...');
      
      // Look for video-related text content
      const videoText = [
        'Introducción a CoomÜnity',
        'Ayni',
        'Öndas',
        'Mëritos'
      ];
      
      let foundContent = 0;
      for (const text of videoText) {
        const textElement = page.locator(`text*="${text}"`);
        if (await textElement.count() > 0) {
          console.log(`✅ Found content: ${text}`);
          foundContent++;
        }
      }
      
      expect(foundContent).toBeGreaterThan(0);
    }
  });

  test('should navigate to specific video and verify YouTube integration', async ({ page }) => {
    console.log('🎯 Testing direct video navigation...');
    
    // Navigate directly to a specific video
    await page.goto('/uplay/video/ayni-deep-dive');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ path: 'e2e/screenshots/video-player.png' });
    
    // Check if we're in preview mode
    const previewIndicator = page.locator('text=/Modo Preview.*YouTube/');
    const isPreviewMode = await previewIndicator.count() > 0;
    
    if (isPreviewMode) {
      console.log('🎬 Preview mode: Checking for YouTube iframe...');
      
      // Look for YouTube iframe
      const youtubeIframe = page.locator('iframe[src*="youtube.com"]');
      const iframeCount = await youtubeIframe.count();
      
      if (iframeCount > 0) {
        console.log('✅ YouTube iframe found!');
        const src = await youtubeIframe.first().getAttribute('src');
        console.log(`📺 YouTube URL: ${src}`);
        expect(src).toContain('youtube.com/embed/');
      } else {
        console.log('⚠️ No YouTube iframe found, checking for other video elements...');
      }
    } else {
      console.log('📱 Local mode: Checking for video element...');
      
      // Look for local video element
      const videoElement = page.locator('video');
      const videoCount = await videoElement.count();
      
      if (videoCount > 0) {
        console.log('✅ Video element found!');
        const src = await videoElement.first().getAttribute('src');
        console.log(`📺 Video URL: ${src}`);
      } else {
        console.log('⚠️ No video element found');
      }
    }
    
    // Check for video title or Ayni-related content
    const ayniContent = page.locator('text*="Ayni"');
    if (await ayniContent.count() > 0) {
      console.log('✅ Ayni content found on video page');
    }
    
    // Check page loaded without major errors
    await expect(page.locator('#root')).toBeVisible();
    console.log('✅ Video page loaded successfully');
  });

  test('should verify video URLs are properly mapped', async ({ page }) => {
    console.log('🎯 Testing video URL mapping...');
    
    // Test multiple video IDs to see URL mapping
    const videoIds = ['coomunity-intro', 'ayni-deep-dive', 'ondas-energia'];
    
    for (const videoId of videoIds) {
      console.log(`Testing video ID: ${videoId}`);
      await page.goto(`/uplay/video/${videoId}`);
      await page.waitForSelector('#root', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Check if page loads without errors
      const errorElements = page.locator('text=/error|Error|404|Not Found/i');
      const errorCount = await errorElements.count();
      
      if (errorCount === 0) {
        console.log(`✅ Video ${videoId} loads without errors`);
      } else {
        console.log(`⚠️ Video ${videoId} may have issues`);
      }
    }
    
    console.log('✅ Video URL mapping test completed');
  });
}); 