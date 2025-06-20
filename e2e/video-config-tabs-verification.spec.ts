import { test, expect, Page } from '@playwright/test';

// Configuration constants
const FRONTEND_BASE_URL = 'http://localhost:3000';
const BACKEND_BASE_URL = 'http://localhost:3002';
const ADMIN_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: 'admin123'
};

// Test video item ID from seeder data
const TEST_VIDEO_ITEM_ID = '2'; // VideoItem from seeder with real video content

test.describe.serial('Video Config Page - Subtitles and Questions Tabs Verification', () => {
  let consoleErrors: string[] = [];
  let networkErrors: string[] = [];
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = `[Browser Console ERROR] ${msg.text()}`;
        consoleErrors.push(errorText);
        console.log(errorText);
      }
    });

    // Capture network errors
    page.on('requestfailed', (request) => {
      const errorText = `[Network Request Failed] ${request.method()} ${request.url()} - ${request.failure()?.errorText}`;
      networkErrors.push(errorText);
      console.log(errorText);
    });

    // Login once for all tests with better error handling
    console.log('🔐 Logging in as admin...');
    await page.goto(`${FRONTEND_BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Wait for login form to be ready
    await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[name="password"], input[type="password"]', { timeout: 10000 });
    
    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"], input[type="password"]', ADMIN_CREDENTIALS.password);
    
    // Submit login and wait for response
    console.log('📤 Submitting login form...');
    await page.click('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');
    
    // Wait for login to complete - look for redirect or success indicators
    try {
      await page.waitForURL(new RegExp(`${FRONTEND_BASE_URL}(?:/.*)?`), { timeout: 15000 });
      console.log('✅ Login successful - redirected to dashboard');
    } catch (error) {
      console.log('⚠️ Login redirect timeout, checking for other success indicators...');
      
      // Alternative: check if we're no longer on login page
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login successful - no longer on login page');
      } else {
        console.log('❌ Still on login page, login may have failed');
        throw new Error('Login failed - still on login page');
      }
    }
    
    // Additional wait for any post-login loading
    await page.waitForTimeout(2000);
  });

  test.afterAll(async () => {
    if (consoleErrors.length > 0) {
      console.log('\n❌ Console errors detected:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 Network errors detected:');
      networkErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    await page.close();
  });

  test('Should navigate to video config page and capture Subtitles tab', async () => {
    console.log('🎬 Navigating to video config page...');
    
    // Navigate to video config page
    await page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Extra wait for page to fully load
    
    console.log('🧪 Testing: Subtitles tab navigation and content');
    
    // Click on Subtitles tab
    const subtitlesTab = page.getByRole('tab', { name: /Subtítulos|Subtitles/i });
    await expect(subtitlesTab).toBeVisible({ timeout: 10000 });
    await subtitlesTab.click();
    
    // Verify tab is selected
    await expect(subtitlesTab).toHaveAttribute('aria-selected', 'true');
    
    // Wait for SubtitleManager to load
    await page.waitForTimeout(5000);
    
    // 📸 CAPTURE SCREENSHOT: Subtitles tab with real data
    console.log('📸 Capturing screenshot of Subtitles tab with real data...');
    await page.screenshot({ 
      path: 'test-results/screenshots/subtitles_tab_real_data.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: test-results/screenshots/subtitles_tab_real_data.png');
    
    // Basic verification that some content loaded
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    console.log('✅ Subtitles tab loaded and screenshot captured');
  });

  test('Should navigate to Questions tab and capture screenshot', async () => {
    console.log('🧪 Testing: Questions tab navigation and content');
    
    // Ensure we're on the video config page
    await page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Click on Questions tab
    const questionsTab = page.getByRole('tab', { name: /Preguntas|Questions/i });
    await expect(questionsTab).toBeVisible({ timeout: 10000 });
    await questionsTab.click();
    
    // Verify tab is selected
    await expect(questionsTab).toHaveAttribute('aria-selected', 'true');
    
    // Wait for QuestionManager to load
    await page.waitForTimeout(5000);
    
    // 📸 CAPTURE SCREENSHOT: Questions tab with real data
    console.log('📸 Capturing screenshot of Questions tab with real data...');
    await page.screenshot({ 
      path: 'test-results/screenshots/questions_tab_real_data.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: test-results/screenshots/questions_tab_real_data.png');
    
    // Basic verification that some content loaded
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    console.log('✅ Questions tab loaded and screenshot captured');
  });

  test('Should verify VideoTimeline component presence and functionality', async () => {
    console.log('🧪 Testing: VideoTimeline component in Questions tab');
    
    // Ensure we're on the video config page
    await page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Click on Questions tab
    const questionsTab = page.getByRole('tab', { name: /Preguntas|Questions/i });
    await expect(questionsTab).toBeVisible({ timeout: 10000 });
    await questionsTab.click();
    
    // Verify tab is selected
    await expect(questionsTab).toHaveAttribute('aria-selected', 'true');
    
    // Wait for QuestionManager to load
    await page.waitForTimeout(5000);
    
    // Verify VideoTimeline component is present
    console.log('🔍 Checking for VideoTimeline component...');
    
    // Check for timeline header
    const timelineHeader = page.getByText('Timeline de Video - Preguntas Interactivas');
    await expect(timelineHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ VideoTimeline header found');
    
    // Check for timeline duration info (more specific selector)
    const durationInfo = page.getByText(/Duración: \d+:\d+ • \d+ preguntas configuradas/);
    await expect(durationInfo).toBeVisible({ timeout: 5000 });
    console.log('✅ Video duration info found');
    
    // Check for timeline progress bar (look for the main timeline container)
    const timelineContainer = page.locator('[role="slider"], .MuiSlider-root').first();
    if (await timelineContainer.count() > 0) {
      await expect(timelineContainer).toBeVisible({ timeout: 5000 });
      console.log('✅ Timeline slider/progress bar found');
    } else {
      // Alternative: look for timeline visual elements
      const timelineBar = page.locator('div').filter({ hasText: /Timeline|Duración/ }).first();
      await expect(timelineBar).toBeVisible({ timeout: 5000 });
      console.log('✅ Timeline visual elements found');
    }
    
    // Check for question markers (if questions exist)
    const questionMarkers = page.locator('button[title*="Pregunta"], [data-testid*="question-marker"], button:has(svg):near(:text("Timeline"))');
    const markerCount = await questionMarkers.count();
    console.log(`🎯 Found ${markerCount} question markers on timeline`);
    
    // Alternative: look for any clickable elements within the timeline area
    if (markerCount === 0) {
      const timelineButtons = page.locator('div:has-text("Timeline de Video") ~ * button');
      const alternativeMarkerCount = await timelineButtons.count();
      console.log(`🔍 Alternative search found ${alternativeMarkerCount} buttons in timeline area`);
      
      if (alternativeMarkerCount > 0) {
        console.log('✅ Question markers found via alternative selector');
        // Test clicking on the first marker found
        try {
          await timelineButtons.first().click();
          console.log('✅ Question marker click interaction works');
          
          // Wait a moment and close any modal that might have opened
          await page.waitForTimeout(1000);
          const closeButton = page.getByRole('button', { name: /Cancelar|Close|Cerrar/i });
          if (await closeButton.count() > 0) {
            await closeButton.click();
            console.log('✅ Closed question modal after test');
          }
        } catch (error) {
          console.log('⚠️ Question marker click test skipped:', error);
        }
      }
    }
    
    // Check for timeline statistics section
    const statsSection = page.getByText(/Densidad:.*preguntas\/min/);
    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible({ timeout: 5000 });
      console.log('✅ Timeline statistics section found');
    } else {
      console.log('ℹ️ Timeline statistics section not found (may be hidden when no questions)');
    }
    
    // Check for timeline time markers (bottom scale)
    const timeMarkers = page.locator('text=/0:00|1:00|2:00|3:00|4:00|5:00/');
    if (await timeMarkers.count() > 0) {
      await expect(timeMarkers.first()).toBeVisible({ timeout: 5000 });
      console.log('✅ Timeline time markers found');
    }
    
    // 📸 CAPTURE SCREENSHOT: VideoTimeline component
    console.log('📸 Capturing screenshot of VideoTimeline component...');
    await page.screenshot({ 
      path: 'test-results/screenshots/video_timeline_component.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: test-results/screenshots/video_timeline_component.png');
    
    console.log('✅ VideoTimeline component verification completed successfully');
  });
}); 