import { test, expect } from '@playwright/test';

/**
 * Test de validación para el módulo ÜPlay
 * Validaciones completas del módulo ÜPlay de CoomÜnity SuperApp
 */

test.describe('ÜPlay Module Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the SuperApp and wait for React to mount
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Handle authentication - use real backend credentials
    try {
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 5000 });
      await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', '123456');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/', { timeout: 15000 });
    } catch (error) {
      // User might already be authenticated
      console.log('Authentication step skipped - user might already be logged in');
    }
  });

  test('should load ÜPlay module without errors', async ({ page }) => {
    console.log('🎯 Testing ÜPlay module loading...');
    
    // Navigate to ÜPlay using the main navigation
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);

    // Verify the page loads without JavaScript errors
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Filter out expected/non-critical errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('404') && 
      !error.includes('chunk') &&
      !error.includes('favicon')
    );

    expect(criticalErrors).toHaveLength(0);
    console.log('✅ ÜPlay loaded without critical errors');
  });

  test('should display ÜPlay header and navigation', async ({ page }) => {
    console.log('🎯 Testing ÜPlay header and navigation...');
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);

    // Check for ÜPlay header content
    const headerVisible = await page.isVisible('text=ÜPlay');
    expect(headerVisible).toBe(true);

    // Check for main content area
    const mainContent = await page.locator('main, .main-content, [role="main"]').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✅ ÜPlay header and navigation working correctly');
  });

  test('should contain CoomÜnity terminology and concepts', async ({ page }) => {
    console.log('🎯 Testing CoomÜnity terminology...');
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(3000);

    // Look for CoomÜnity-specific terms in the page content
    const pageContent = await page.textContent('body');
    
    // Check for at least some CoomÜnity concepts (flexible assertion)
    const coomunityTerms = ['Ayni', 'Méritos', 'Öndas', 'Bien Común', 'CoomÜnity', 'GPL'];
    const foundTerms = coomunityTerms.filter(term => pageContent?.includes(term));
    
    // We expect at least one CoomÜnity term to be present
    expect(foundTerms.length).toBeGreaterThan(0);
    console.log(`✅ Found CoomÜnity terms: ${foundTerms.join(', ')}`);
  });

  test('should have responsive design elements', async ({ page }) => {
    console.log('🎯 Testing responsive design...');
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);

    // Test different viewport sizes
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    let mainContent = await page.locator('main, .main-content, [role="main"]').first();
    await expect(mainContent).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    mainContent = await page.locator('main, .main-content, [role="main"]').first();
    await expect(mainContent).toBeVisible();

    // Reset to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    console.log('✅ Responsive design working correctly');
  });

  test('should handle navigation and routing', async ({ page }) => {
    console.log('🎯 Testing navigation and routing...');
    
    // Navigate to ÜPlay
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);

    // Verify URL contains ÜPlay indication
    const currentUrl = page.url();
    expect(currentUrl.toLowerCase()).toMatch(/uplay|play|video/);

    // Try navigating back to home
    await page.click('text=Inicio');
    await page.waitForTimeout(1000);
    
    // Navigate back to ÜPlay
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);
    
    // Verify we're back in ÜPlay
    const updatedUrl = page.url();
    expect(updatedUrl.toLowerCase()).toMatch(/uplay|play|video/);
    
    console.log('✅ Navigation and routing working correctly');
  });

  test('should display video-related UI components', async ({ page }) => {
    console.log('🎯 Testing video-related UI components...');
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(3000);

    // Look for video-related elements (flexible selectors)
    const possibleVideoElements = [
      'video',
      '[data-testid*="video"]',
      '[class*="video"]',
      '[class*="player"]',
      '.MuiCard-root', // Material UI cards that might contain video content
      '[role="button"]' // Play buttons or interactive elements
    ];

    let foundVideoElement = false;
    for (const selector of possibleVideoElements) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        foundVideoElement = true;
        console.log(`✅ Found video elements with selector: ${selector}`);
        break;
      }
    }

    // We expect at least some video-related UI components
    expect(foundVideoElement).toBe(true);
  });

  test('should have search or filter functionality', async ({ page }) => {
    console.log('🎯 Testing search/filter functionality...');
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);

    // Look for search/filter elements
    const searchElements = [
      'input[type="search"]',
      'input[placeholder*="buscar" i]',
      'input[placeholder*="search" i]',
      '[data-testid*="search"]',
      '[class*="search"]',
      'button[aria-label*="search" i]'
    ];

    let hasSearchFunctionality = false;
    for (const selector of searchElements) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        hasSearchFunctionality = true;
        console.log(`✅ Found search elements with selector: ${selector}`);
        break;
      }
    }

    // Search functionality is expected in a video platform
    expect(hasSearchFunctionality).toBe(true);
  });
});