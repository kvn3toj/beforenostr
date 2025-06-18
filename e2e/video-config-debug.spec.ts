import { test, expect } from '@playwright/test';

const FRONTEND_BASE_URL = 'http://localhost:3333';
const ADMIN_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: '123456'
};

test.describe('Video Config Page Debug', () => {
  test('Should debug navigation to video config page', async ({ page }) => {
    console.log('🔐 Starting login process...');
    
    // Navigate to login page
    await page.goto(`${FRONTEND_BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of login page
    await page.screenshot({ path: 'debug-login-page.png', fullPage: true });
    
    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"], input[type="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');
    
    // Wait for redirect
    await page.waitForURL(/^(?!.*\/login).*$/, { timeout: 10000 });
    console.log('✅ Login successful, current URL:', page.url());
    
    // Take screenshot after login
    await page.screenshot({ path: 'debug-after-login.png', fullPage: true });
    
    // Navigate to home page first to ensure we're in the right state
    await page.goto(`${FRONTEND_BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    console.log('📍 Navigated to home page');
    
    // Take screenshot of home page
    await page.screenshot({ path: 'debug-home-page.png', fullPage: true });
    
    // Now try to navigate to video config page
    console.log('🎬 Attempting to navigate to video config page...');
    await page.goto(`${FRONTEND_BASE_URL}/items/1/config`);
    await page.waitForLoadState('networkidle');
    
    console.log('📍 Current URL after navigation:', page.url());
    
    // Take screenshot of video config page
    await page.screenshot({ path: 'debug-video-config-page.png', fullPage: true });
    
    // Check what's actually on the page
    const pageTitle = await page.title();
    console.log('📄 Page title:', pageTitle);
    
    const bodyText = await page.locator('body').textContent();
    console.log('📝 Page content (first 500 chars):', bodyText?.substring(0, 500));
    
    // Check for any error messages
    const errorElements = await page.locator('[role="alert"], .error, .MuiAlert-root').count();
    console.log('🚨 Error elements found:', errorElements);
    
    if (errorElements > 0) {
      const errorTexts = await page.locator('[role="alert"], .error, .MuiAlert-root').allTextContents();
      console.log('🚨 Error messages:', errorTexts);
    }
    
    // Check for loading indicators
    const loadingElements = await page.locator('[role="progressbar"], .MuiCircularProgress-root').count();
    console.log('⏳ Loading indicators:', loadingElements);
    
    // Check for main content areas
    const mainContent = await page.locator('main, [role="main"], .main-content').count();
    console.log('📄 Main content areas:', mainContent);
    
    // Check for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], .sidebar, .menu').count();
    console.log('🧭 Navigation elements:', navElements);
    
    // Check for any headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('📋 Headings found:', headings);
    
    // Check for tabs specifically
    const tabs = await page.locator('[role="tab"]').count();
    console.log('📑 Tabs found:', tabs);
    
    if (tabs > 0) {
      const tabTexts = await page.locator('[role="tab"]').allTextContents();
      console.log('📑 Tab texts:', tabTexts);
    }
    
    // Always pass - this is just for debugging
    expect(true).toBe(true);
  });
}); 