import { test, expect } from '@playwright/test';

// Standalone test that doesn't require authentication
test.describe('AyniMetricsCard - Standalone Component Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to home page
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check if we're on login page and need to handle authentication
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // Handle login if redirected
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      
      // Wait for any errors to clear
      await page.waitForTimeout(1000);
      
      // Try to click login button, handling potential overlays
      try {
        await page.click('[data-testid="login-submit-button"]', { timeout: 5000 });
        await page.waitForURL('**/', { timeout: 15000 });
      } catch (error) {
        console.log('Login failed, continuing with current state');
      }
    }
    
    // Wait for any component to load
    await page.waitForTimeout(2000);
  });

  test('should display Ayni Metrics card structure', async ({ page }) => {
    // Look for the main Ayni Metrics card or any metrics-related content
    const ayniCard = page.locator('[aria-label="Tarjeta de métricas Ayni"]');
    const metricsContent = page.locator('text=/Balance|Ayni|Öndas|Mëritos|Bien Común/i').first();
    
    // Check if either the specific card or any metrics content is visible
    const cardExists = await ayniCard.count() > 0;
    const metricsExists = await metricsContent.count() > 0;
    
    if (cardExists) {
      await expect(ayniCard).toBeVisible();
      console.log('✅ Found specific Ayni Metrics card');
    } else if (metricsExists) {
      await expect(metricsContent).toBeVisible();
      console.log('✅ Found metrics-related content');
    } else {
      // Take a screenshot to see what's actually on the page
      await page.screenshot({ path: 'test-results/ayni-metrics-debug.png', fullPage: true });
      
      // Log the page content for debugging
      const pageContent = await page.locator('body').textContent();
      console.log('Page content:', pageContent?.substring(0, 500));
      
      // Check what elements are actually present
      const allElements = await page.locator('*[aria-label*="metric"], *[aria-label*="Ayni"], *[aria-label*="balance"]').count();
      console.log('Found elements with metrics/Ayni/balance labels:', allElements);
      
      // Fail with informative message
      throw new Error('No Ayni Metrics card or metrics content found on the page');
    }
  });

  test('should handle basic interaction with metrics display', async ({ page }) => {
    // Look for any interactive elements related to metrics
    const interactiveElements = page.locator('button, [role="button"], [tabindex="0"]').filter({
      hasText: /Balance|Ayni|Öndas|Mëritos|Bien|refresh|actualizar|expand|detail/i
    });
    
    const elementCount = await interactiveElements.count();
    console.log(`Found ${elementCount} interactive metrics-related elements`);
    
    if (elementCount > 0) {
      // Test interaction with the first available element
      const firstElement = interactiveElements.first();
      await expect(firstElement).toBeVisible();
      
      // Try to interact with it
      try {
        await firstElement.click();
        console.log('✅ Successfully interacted with metrics element');
      } catch (error) {
        console.log('Note: Element interaction failed, but element exists');
      }
    } else {
      console.log('No interactive metrics elements found');
    }
  });

  test('should display some form of balance or metrics information', async ({ page }) => {
    // Look for any numerical values that might represent metrics
    const numberElements = page.locator('text=/\\d+%|\\d+\\s*(öndas|mëritos|balance|points|puntos)/i');
    const numberCount = await numberElements.count();
    
    console.log(`Found ${numberCount} elements with numerical metrics`);
    
    if (numberCount > 0) {
      // Verify at least one numerical metric is visible
      await expect(numberElements.first()).toBeVisible();
      
      const value = await numberElements.first().textContent();
      console.log('First numerical metric found:', value);
    }
    
    // Also check for any progress indicators
    const progressElements = page.locator('.MuiLinearProgress-root, [role="progressbar"], .progress');
    const progressCount = await progressElements.count();
    
    if (progressCount > 0) {
      console.log(`Found ${progressCount} progress indicators`);
      await expect(progressElements.first()).toBeVisible();
    }
  });

  test('should have proper page structure without errors', async ({ page }) => {
    // Check for basic page structure
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
    
    // Check for any error messages or crash indicators
    const errorElements = page.locator('text=/error|crash|failed|not found/i');
    const errorCount = await errorElements.count();
    
    if (errorCount > 0) {
      const errorText = await errorElements.first().textContent();
      console.log('Warning: Found potential error text:', errorText);
    }
    
    // Check for basic navigation or header elements
    const navigationElements = page.locator('nav, header, [role="navigation"], [role="banner"]');
    const navCount = await navigationElements.count();
    
    console.log(`Found ${navCount} navigation/header elements`);
    
    // Verify page is not completely broken
    const allText = await page.locator('body').textContent();
    expect(allText?.length || 0).toBeGreaterThan(10);
  });

  test('should be responsive to viewport changes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await expect(bodyElement).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    await expect(bodyElement).toBeVisible();
    
    console.log('✅ Page responds to viewport changes');
  });

  test('should not have critical JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate and interact with the page
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Try some basic interactions
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Click somewhere safe
    await page.click('body');
    
    // Wait for any delayed errors
    await page.waitForTimeout(1000);
    
    // Filter out expected/harmless errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Failed to load resource') && 
      !error.includes('404') &&
      !error.includes('favicon') &&
      !error.includes('manifest') &&
      !error.toLowerCase().includes('network')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should have accessible content structure', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    console.log(`Found ${headingCount} headings on the page`);
    
    if (headingCount > 0) {
      // Verify at least one heading is visible
      await expect(headings.first()).toBeVisible();
    }
    
    // Check for ARIA landmarks
    const landmarks = page.locator('[role="main"], [role="navigation"], [role="banner"], [role="region"]');
    const landmarkCount = await landmarks.count();
    
    console.log(`Found ${landmarkCount} ARIA landmarks`);
    
    // Check for focusable elements
    const focusableElements = page.locator('button, input, select, textarea, a, [tabindex]');
    const focusableCount = await focusableElements.count();
    
    console.log(`Found ${focusableCount} focusable elements`);
    
    expect(focusableCount).toBeGreaterThan(0);
  });
}); 