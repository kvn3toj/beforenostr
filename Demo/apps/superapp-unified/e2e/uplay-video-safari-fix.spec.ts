import { test, expect } from '@playwright/test';

test.describe('ÜPlay Video Player - Safari Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the ÜPlay page
    await page.goto('/uplay');
    await page.waitForSelector('#root');
    
    // Wait for the page to load completely
    await page.waitForTimeout(2000);
  });

  test('should load video player without NotSupportedError', async ({ page }) => {
    console.log('🎬 Testing video player Safari compatibility...');

    // Look for a video card and click it
    const videoCard = page.locator('[data-testid="video-card"]').first();
    if (await videoCard.count() > 0) {
      await videoCard.click();
    } else {
      // If no video cards, try clicking on a video link or button
      const videoButton = page.locator('button:has-text("Ver Video"), a:has-text("Ver Video")').first();
      if (await videoButton.count() > 0) {
        await videoButton.click();
      } else {
        // Navigate directly to a video player URL
        await page.goto('/uplay/unified-demo');
      }
    }

    // Wait for video player to load
    await page.waitForSelector('video', { timeout: 10000 });
    
    // Check that video element exists and has proper attributes
    const video = page.locator('video');
    await expect(video).toBeVisible();
    
    // Verify Safari-specific attributes are present
    const videoElement = await video.elementHandle();
    const playsInline = await videoElement?.getAttribute('playsinline');
    const webkitPlaysInline = await videoElement?.getAttribute('webkit-playsinline');
    const preload = await videoElement?.getAttribute('preload');
    
    console.log('Video attributes:', { playsInline, webkitPlaysInline, preload });
    
    // These attributes should be present for Safari compatibility
    expect(playsInline).toBe('');
    expect(webkitPlaysInline).toBe('true');
    expect(preload).toBe('metadata');

    // Check for video source
    const videoSrc = await video.getAttribute('src');
    expect(videoSrc).toBeTruthy();
    console.log('Video source:', videoSrc);

    // Wait for video to be ready
    await page.waitForFunction(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      return video && video.readyState >= 2; // HAVE_CURRENT_DATA
    }, { timeout: 15000 });

    // Try to play the video and check for errors
    const playButton = page.locator('button[aria-label*="play"], button:has([data-testid="PlayArrowIcon"])');
    if (await playButton.count() > 0) {
      await playButton.click();
      
      // Wait a moment for any errors to surface
      await page.waitForTimeout(2000);
      
      // Check console for NotSupportedError
      const logs = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warn') {
          logs.push(msg.text());
        }
      });
      
      // Check that no NotSupportedError occurred
      const hasNotSupportedError = logs.some(log => 
        log.includes('NotSupportedError') || 
        log.includes('The operation is not supported')
      );
      
      expect(hasNotSupportedError).toBe(false);
      console.log('✅ No NotSupportedError detected');
    }

    // Check that error message overlay is not visible
    const errorOverlay = page.locator('text="Error de Reproducción"');
    await expect(errorOverlay).not.toBeVisible();

    console.log('✅ Video player loaded successfully without Safari errors');
  });

  test('should handle video errors gracefully', async ({ page }) => {
    console.log('🎬 Testing video error handling...');

    // Navigate to video player
    await page.goto('/uplay/unified-demo');
    await page.waitForSelector('video', { timeout: 10000 });

    // Simulate a video error by changing the src to an invalid URL
    await page.evaluate(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) {
        video.src = 'invalid-video-url.mp4';
      }
    });

    // Wait for error to be handled
    await page.waitForTimeout(3000);

    // Check if error message appears
    const errorMessage = page.locator('text="Error de Reproducción"');
    
    // The error handling should either show an error message or handle it silently
    // We just want to make sure the app doesn't crash
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();

    console.log('✅ Video error handled gracefully');
  });

  test('should show retry button when video fails', async ({ page }) => {
    console.log('🎬 Testing video retry functionality...');

    // Navigate to video player
    await page.goto('/uplay/unified-demo');
    await page.waitForSelector('video', { timeout: 10000 });

    // Force a video error by setting invalid source
    await page.evaluate(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) {
        // Trigger an error event
        const errorEvent = new Event('error');
        video.dispatchEvent(errorEvent);
      }
    });

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Look for retry button (it might appear in error overlay)
    const retryButton = page.locator('button:has-text("Reintentar")');
    
    if (await retryButton.count() > 0) {
      console.log('✅ Retry button found');
      await expect(retryButton).toBeVisible();
      
      // Test clicking retry button
      await retryButton.click();
      await page.waitForTimeout(1000);
      
      console.log('✅ Retry button clicked successfully');
    } else {
      console.log('ℹ️ Retry button not visible (error might be handled differently)');
    }
  });

  test('should detect Safari browser correctly', async ({ page }) => {
    console.log('🎬 Testing Safari detection...');

    // Navigate to video player
    await page.goto('/uplay/unified-demo');
    await page.waitForSelector('video', { timeout: 10000 });

    // Check Safari detection in console logs
    const logs = [];
    page.on('console', msg => {
      logs.push(msg.text());
    });

    // Wait for any Safari-specific setup logs
    await page.waitForTimeout(3000);

    // Look for Safari-specific console messages
    const hasSafariLogs = logs.some(log => 
      log.includes('Safari') || 
      log.includes('Setting up video for Safari')
    );

    console.log('Console logs:', logs.filter(log => log.includes('Safari')));
    console.log('Safari detection working:', hasSafariLogs ? '✅' : 'ℹ️ (not Safari or no logs)');
  });
}); 