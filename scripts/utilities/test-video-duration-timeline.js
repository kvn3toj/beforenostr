const { test, expect } = require('@playwright/test');

test.describe('Video Duration vs Timeline Verification', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Capture console logs and errors
    page.on('console', msg => {
      console.log(`>>> BROWSER CONSOLE [${msg.type()}]:`, msg.text());
    });
    
    page.on('pageerror', error => {
      console.log(`>>> BROWSER ERROR:`, error.message);
    });

    // Authentication flow
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
    
    console.log('>>> Authentication completed successfully');
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('Navigate to Items and verify video duration vs timeline', async () => {
    console.log('>>> Starting video duration verification test');

    // Navigate to Items
    await page.goto('/items');
    await page.waitForLoadState('networkidle');
    
    console.log('>>> Navigated to Items page');
    
    // Wait for items to load and find a video item
    await page.waitForSelector('[data-testid="items-list"], .MuiDataGrid-root, .video-item', { timeout: 10000 });
    
    // Look for the first video item or a specific one
    const videoItems = await page.locator('text=/video|Video|TED|YouTube/i').first();
    await videoItems.waitFor({ timeout: 5000 });
    
    console.log('>>> Found video items, clicking on first one');
    await videoItems.click();
    
    // Wait for navigation to video configuration
    await page.waitForLoadState('networkidle');
    
    // Look for the "Configuración" or "Questions" tab
    const configTab = page.locator('text=/Configuración|Questions|Preguntas/i');
    if (await configTab.count() > 0) {
      await configTab.click();
      console.log('>>> Clicked on Configuration/Questions tab');
    }
    
    // Wait for the video player and timeline to load
    await page.waitForSelector('iframe, video, [class*="video"], [class*="youtube"]', { timeout: 10000 });
    
    console.log('>>> Video player found, waiting for timeline');
    
    // Wait for timeline or questions interface
    await page.waitForSelector('[class*="timeline"], [class*="question"], [class*="duration"]', { timeout: 5000 });
    
    // Get video duration from player (if available)
    let videoDuration = null;
    
    // Try to get duration from YouTube iframe
    const iframe = page.locator('iframe').first();
    if (await iframe.count() > 0) {
      console.log('>>> YouTube iframe detected');
      
      // Wait a bit for the video to load
      await page.waitForTimeout(3000);
      
      // Try to get duration information from the page
      const durationInfo = await page.evaluate(() => {
        // Look for duration information in the DOM
        const durationElements = document.querySelectorAll('[class*="duration"], [data-duration], .video-duration');
        const timeElements = document.querySelectorAll('[class*="time"], .time-display');
        
        let foundDurations = [];
        
        durationElements.forEach(el => {
          if (el.textContent && el.textContent.match(/\d+:\d+/)) {
            foundDurations.push({
              type: 'duration-element',
              text: el.textContent,
              className: el.className
            });
          }
        });
        
        timeElements.forEach(el => {
          if (el.textContent && el.textContent.match(/\d+:\d+/)) {
            foundDurations.push({
              type: 'time-element', 
              text: el.textContent,
              className: el.className
            });
          }
        });
        
        return foundDurations;
      });
      
      console.log('>>> Duration information found:', durationInfo);
    }
    
    // Look for timeline duration information
    const timelineInfo = await page.evaluate(() => {
      const timelineElements = document.querySelectorAll('[class*="timeline"], [class*="question-time"], [class*="timestamp"]');
      let timelineData = [];
      
      timelineElements.forEach(el => {
        const text = el.textContent;
        if (text && text.match(/\d+:\d+|\d+\s*s|\d+\s*sec/)) {
          timelineData.push({
            text: text,
            className: el.className
          });
        }
      });
      
      return timelineData;
    });
    
    console.log('>>> Timeline information found:', timelineInfo);
    
    // Look for any duration display in the interface
    const allDurations = await page.evaluate(() => {
      const allText = document.body.innerText;
      const durationMatches = allText.match(/(\d+:\d+|\d+\s*s|\d+\s*sec|\d+\s*min)/g);
      return durationMatches || [];
    });
    
    console.log('>>> All duration strings found on page:', allDurations);
    
    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'debug-video-duration-timeline.png', 
      fullPage: true 
    });
    
    console.log('>>> Screenshot saved as debug-video-duration-timeline.png');
    
    // Check if video is actually playing by waiting and checking again
    console.log('>>> Waiting to see if video duration updates...');
    await page.waitForTimeout(5000);
    
    const updatedDurations = await page.evaluate(() => {
      const allText = document.body.innerText;
      const durationMatches = allText.match(/(\d+:\d+|\d+\s*s|\d+\s*sec|\d+\s*min)/g);
      return durationMatches || [];
    });
    
    console.log('>>> Updated duration strings after waiting:', updatedDurations);
    
    // Get the current URL to understand which video we're looking at
    const currentUrl = page.url();
    console.log('>>> Current URL:', currentUrl);
    
    // Extract video ID from URL if possible
    const videoIdMatch = currentUrl.match(/\/(\d+)$/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      console.log('>>> Video ID detected:', videoId);
      
      // Make a direct API call to get the expected duration
      const response = await page.evaluate(async (id) => {
        try {
          const res = await fetch(`http://localhost:3002/video-items/${id}`);
          return await res.json();
        } catch (error) {
          return { error: error.message };
        }
      }, videoId);
      
      console.log('>>> Backend video data:', response);
    }
  });
}); 