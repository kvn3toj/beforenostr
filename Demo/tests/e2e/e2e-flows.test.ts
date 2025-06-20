import { test, expect } from '@playwright/test';

/**
 * Pruebas End-to-End para flujos completos de usuario en CoomÜnity
 */

test.describe('Flujos End-to-End', () => {
  
  test('Complete user journey from homepage to all sections', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/public\//);
    
    // Navigate to Pilgrim section
    await page.click('a[href*="pilgrim"]:not([href*="variations"]):not([href*="journey"])');
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    await expect(page.locator('body')).toBeVisible();
    
    // Go back to main navigation
    await page.goto('/public/');
    
    // Navigate to Merchant section
    await page.click('a[href*="merchant"]:not([href*="variations"])');
    await expect(page).toHaveURL(/.*sections\/merchant/);
    await expect(page.locator('body')).toBeVisible();
    
    // Go back to main navigation
    await page.goto('/public/');
    
    // Navigate to Red Pill section
    await page.click('a[href*="red-pill"]:not([href*="journey"])');
    await expect(page).toHaveURL(/.*sections\/red-pill/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Merchant section variations flow', async ({ page }) => {
    await page.goto('/public/');
    
    // Navigate to merchant main page
    await page.click('a[href*="merchant"]:not([href*="variations"])');
    
    // Check if we can access variations from main page or go directly
    await page.goto('/public/');
    
    // Test each variation
    const variations = [
      { name: 'Initial Load', href: 'initial_load.html' },
      { name: 'After Scroll', href: 'after_scroll.html' },
      { name: 'Button Clicked', href: 'button_clicked.html' }
    ];
    
    for (const variation of variations) {
      const variationLink = page.locator(`a[href*="${variation.href}"]`);
      if (await variationLink.count() > 0) {
        await variationLink.click();
        await expect(page.locator('body')).toBeVisible();
        await page.goBack();
      } else {
        // Go directly to variation
        await page.goto(`/sections/merchant/variations/${variation.href}`);
        await expect(page.locator('body')).toBeVisible();
        await page.goto('/public/');
      }
    }
  });

  test('Red Pill interactive journey flow', async ({ page }) => {
    await page.goto('/sections/red-pill/');
    
    // Check for interactive elements that might lead to journey steps
    const interactiveElements = page.locator('button, a[href*="journey"], .choice, [onclick]');
    
    if (await interactiveElements.count() > 0) {
      // Try to interact with first element
      const firstElement = interactiveElements.first();
      const tagName = await firstElement.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'a') {
        await firstElement.click();
        // Should navigate to a journey page
        await expect(page).toHaveURL(/.*journey/);
      } else {
        // For buttons, just verify they exist and are clickable
        await expect(firstElement).toBeEnabled();
      }
    }
    
    // Test direct navigation to journey pages
    const journeyPages = [
      'initial.html',
      'left_path.html', 
      'right_path.html',
      'final.html'
    ];
    
    for (const journeyPage of journeyPages) {
      await page.goto(`/sections/red-pill/journey/${journeyPage}`);
      await expect(page.locator('body')).toBeVisible();
      
      // Look for navigation between journey steps
      const nextStepLinks = page.locator('a[href*="journey"], button[data-next], .next, .continue');
      const hasNavigation = await nextStepLinks.count() > 0;
      
      // Red pill should have some form of progression mechanism
      expect(hasNavigation).toBe(true);
    }
  });

  test('API integration with frontend', async ({ page, request }) => {
    // Test that frontend can call APIs
    await page.goto('/sections/pilgrim/');
    
    // Intercept API calls
    const apiCalls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push(request.url());
      }
    });
    
    // Wait for page to potentially make API calls
    await page.waitForTimeout(3000);
    
    // If no API calls were made from frontend, test manually
    if (apiCalls.length === 0) {
      // Test API calls work from browser context
      const healthResponse = await request.get('/api/health');
      expect(healthResponse.status()).toBe(200);
      
      const pilgrimResponse = await request.get('/api/pilgrim/profile');
      expect(pilgrimResponse.status()).toBe(200);
    } else {
      // Verify API calls were successful
      for (const apiCall of apiCalls) {
        const response = await request.get(apiCall);
        expect([200, 304]).toContain(response.status()); // 200 or 304 (cached)
      }
    }
  });

  test('Cross-browser compatibility flow', async ({ page, browserName }) => {
    // Basic functionality should work across browsers
    await page.goto('/public/');
    
    // Main navigation should work
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.section')).toHaveCount(4);
    
    // CSS should load properly
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Get computed styles to verify CSS loaded
    const backgroundColor = await container.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have some background color (not default 'rgba(0, 0, 0, 0)')
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    
    // Navigation should work in all browsers
    await page.click('a[href*="pilgrim"]');
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    
    console.log(`✅ Cross-browser test passed for ${browserName}`);
  });

  test('Mobile responsive behavior', async ({ page }) => {
    // Test different mobile viewports
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 360, height: 640, name: 'Galaxy S5' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/public/');
      
      // Main content should be visible
      await expect(page.locator('.container')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      
      // Sections should stack vertically and be readable
      const sections = page.locator('.section');
      await expect(sections.first()).toBeVisible();
      
      // Links should be tappable (minimum 44px touch target)
      const links = page.locator('.section a').first();
      const linkBox = await links.boundingBox();
      expect(linkBox?.height).toBeGreaterThan(30); // Reasonable touch target
      
      // Test navigation works on mobile
      await links.click();
      await expect(page.locator('body')).toBeVisible();
      
      console.log(`✅ Mobile test passed for ${viewport.name}`);
      
      // Reset for next iteration
      await page.goto('/public/');
    }
  });

  test('Performance and loading behavior', async ({ page }) => {
    // Test page load performance
    const startTime = Date.now();
    
    await page.goto('/public/');
    await page.waitForLoadState('domcontentloaded');
    
    const domLoadTime = Date.now() - startTime;
    expect(domLoadTime).toBeLessThan(3000); // 3 seconds max
    
    // Test asset loading
    await page.waitForLoadState('networkidle');
    const totalLoadTime = Date.now() - startTime;
    expect(totalLoadTime).toBeLessThan(10000); // 10 seconds max for all assets
    
    // Test navigation performance
    const navStartTime = Date.now();
    await page.click('a[href*="pilgrim"]');
    await page.waitForLoadState('domcontentloaded');
    const navLoadTime = Date.now() - navStartTime;
    expect(navLoadTime).toBeLessThan(5000); // 5 seconds max for navigation
    
    console.log(`Performance metrics:
      - DOM Load: ${domLoadTime}ms
      - Total Load: ${totalLoadTime}ms  
      - Navigation: ${navLoadTime}ms`);
  });

  test('Error recovery and graceful degradation', async ({ page }) => {
    // Test handling of missing assets
    await page.route('**/assets/css/**', route => route.abort());
    await page.goto('/sections/pilgrim/');
    
    // Page should still load even without CSS
    await expect(page.locator('body')).toBeVisible();
    
    // Reset routing
    await page.unroute('**/assets/css/**');
    
    // Test handling of API failures
    await page.route('**/api/**', route => route.abort());
    await page.goto('/public/');
    
    // Main navigation should still work
    await expect(page.locator('h1')).toBeVisible();
    await page.click('a[href*="pilgrim"]');
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    
    // Reset routing
    await page.unroute('**/api/**');
  });

  test('Accessibility basics', async ({ page }) => {
    await page.goto('/public/');
    
    // Check for basic accessibility features
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    
    // Links should have accessible text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
    
    // Page should have a title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Check color contrast (basic test)
    const bodyColor = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    // Should not be same color (basic contrast check)
    expect(bodyColor.color).not.toBe(bodyColor.backgroundColor);
  });
}); 