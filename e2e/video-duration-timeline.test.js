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
    
    // Wait for dashboard to load - looking for menu icon in top left corner
    await page.waitForSelector('[data-testid="menu-icon"], .menu-icon, [class*="MenuIcon"], button[aria-label*="menu"], button[aria-label*="Menu"]', { timeout: 10000 });
    console.log('>>> Authentication completed successfully - menu icon found');
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('Navigate to specific video config and verify duration vs timeline', async () => {
    console.log('>>> Starting video duration verification test for video ID 35 (TED video we fixed)');

    // Navigate directly to the specific video configuration page
    await page.goto('/items/35/config');
    await page.waitForLoadState('networkidle');
    
    console.log('>>> Navigated to video 35 configuration page');
    
    // Take a screenshot to see the initial page structure
    await page.screenshot({ path: 'debug-video-35-config-initial.png' });
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);
    
    // Look for tabs - Questions, Video, etc.
    console.log('>>> Looking for configuration tabs...');
    const tabSelectors = [
      'button:has-text("Questions")',
      'button:has-text("Preguntas")', 
      'tab[aria-label*="question"]',
      '[role="tab"]:has-text("Questions")',
      '[role="tab"]:has-text("Preguntas")',
      'button:has-text("Video")',
      '.MuiTab-root:has-text("Questions")',
      '.MuiTab-root:has-text("Preguntas")'
    ];
    
    let questionsTabFound = false;
    for (const selector of tabSelectors) {
      const tabs = await page.locator(selector).all();
      if (tabs.length > 0) {
        console.log(`>>> Found ${tabs.length} tabs with selector: ${selector}`);
        console.log('>>> Clicking on Questions/Preguntas tab');
        await tabs[0].click();
        await page.waitForLoadState('networkidle');
        questionsTabFound = true;
        break;
      }
    }
    
    if (!questionsTabFound) {
      console.log('>>> No specific Questions tab found, proceeding with current view');
    }
    
    // Take a screenshot after clicking the tab
    await page.screenshot({ path: 'debug-video-35-after-tab-click.png' });
    
    // Look for video player/iframe
    console.log('>>> Looking for video player...');
    
    const videoSelectors = [
      'iframe[src*="youtube"]',
      'iframe[src*="embed"]', 
      'video',
      '[class*="player"]',
      '[class*="youtube"]',
      '[class*="video"]'
    ];
    
    let videoFound = false;
    for (const selector of videoSelectors) {
      const videos = await page.locator(selector).all();
      if (videos.length > 0) {
        console.log(`>>> Found ${videos.length} video elements with selector: ${selector}`);
        videoFound = true;
        break;
      }
    }
    
    if (videoFound) {
      console.log('>>> Video player detected, waiting for it to load...');
      await page.waitForTimeout(5000); // Give video time to load
    } else {
      console.log('>>> No video player found, continuing with timeline analysis');
    }
    
    // Get backend data for video 35
    console.log('>>> Getting backend data for video 35...');
    const backendVideoData = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:1111/video-items/35');
        const data = await response.json();
        return data;
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('>>> Backend video data:', JSON.stringify(backendVideoData, null, 2));
    
    // Get backend questions data for video 35
    console.log('>>> Getting backend questions data for video 35...');
    const backendQuestionsData = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:1111/questions/search?videoItemId=35');
        const data = await response.json();
        return data;
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('>>> Backend questions data:', JSON.stringify(backendQuestionsData, null, 2));
    
    // Look for timeline elements and duration displays
    console.log('>>> Analyzing timeline and duration elements on page...');
    
    const timelineAnalysis = await page.evaluate(() => {
      const results = {
        durationElements: [],
        timelineElements: [],
        timeDisplays: [],
        allTimeStrings: []
      };
      
      // Find all elements with duration-related content
      const durationSelectors = [
        '[class*="duration"]',
        '[data-duration]', 
        '.video-duration',
        '[class*="time"]',
        '.time-display',
        '[class*="timeline"]',
        '[class*="question-time"]',
        '[class*="timestamp"]'
      ];
      
      durationSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.match(/\d+:\d+|\d+\s*s|\d+\s*sec|\d+\s*min/)) {
            results.durationElements.push({
              selector: selector,
              text: text,
              className: el.className,
              id: el.id
            });
          }
        });
      });
      
      // Find all text content that looks like time
      const allText = document.body.innerText;
      const timeMatches = allText.match(/(\d+:\d+|\d+\s*s|\d+\s*sec|\d+\s*min)/g);
      if (timeMatches) {
        results.allTimeStrings = [...new Set(timeMatches)]; // Remove duplicates
      }
      
      // Look for specific timeline or progress elements
      const timelineElements = document.querySelectorAll('[class*="timeline"], [class*="progress"], [class*="slider"]');
      timelineElements.forEach(el => {
        results.timelineElements.push({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent?.trim().substring(0, 100) // First 100 chars
        });
      });
      
      return results;
    });
    
    console.log('>>> Timeline analysis results:', JSON.stringify(timelineAnalysis, null, 2));
    
    // Take a final screenshot with full page
    await page.screenshot({ 
      path: 'debug-video-28-final-analysis.png', 
      fullPage: true 
    });
    
    // Wait a bit more and check if any durations update (indicating video is playing)
    console.log('>>> Waiting to see if any time displays update (indicating video playback)...');
    await page.waitForTimeout(5000);
    
    const updatedTimelineAnalysis = await page.evaluate(() => {
      const allText = document.body.innerText;
      const timeMatches = allText.match(/(\d+:\d+|\d+\s*s|\d+\s*sec|\d+\s*min)/g);
      return timeMatches ? [...new Set(timeMatches)] : [];
    });
    
    console.log('>>> Updated time strings after waiting:', updatedTimelineAnalysis);
    
    // Summary and comparison
    console.log('\n>>> === DURATION VERIFICATION SUMMARY ===');
    console.log('>>> Backend video duration:', backendVideoData?.duration ? `${backendVideoData.duration} seconds` : 'Not found');
    console.log('>>> Backend questions count:', backendQuestionsData?.length || 0);
    console.log('>>> Frontend time strings found:', timelineAnalysis.allTimeStrings);
    console.log('>>> Timeline elements found:', timelineAnalysis.timelineElements.length);
    
    // Convert backend duration to MM:SS format for comparison
    if (backendVideoData?.duration) {
      const minutes = Math.floor(backendVideoData.duration / 60);
      const seconds = backendVideoData.duration % 60;
      const expectedTimeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      console.log('>>> Expected time string from backend:', expectedTimeString);
      
      const foundExpectedTime = timelineAnalysis.allTimeStrings.some(timeStr => 
        timeStr.includes(expectedTimeString) || timeStr.includes(`${backendVideoData.duration}s`)
      );
      
      console.log('>>> Does frontend show expected duration?', foundExpectedTime ? 'YES' : 'NO');
      
      if (!foundExpectedTime) {
        console.log('>>> ⚠️  INCONSISTENCY DETECTED: Frontend duration does not match backend duration');
        console.log('>>> Backend says:', `${backendVideoData.duration} seconds (${expectedTimeString})`);
        console.log('>>> Frontend shows:', timelineAnalysis.allTimeStrings);
      } else {
        console.log('>>> ✅ Duration consistency verified');
      }
    }
    
    console.log('>>> === END SUMMARY ===\n');
  });
}); 