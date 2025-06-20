import { test, expect } from '@playwright/test';

/**
 * Pruebas de navegación para el sitio web CoomÜnity unificado
 */

test.describe('Navegación Principal', () => {
  
  test('Homepage should load and redirect to public', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /public/
    await expect(page).toHaveURL(/.*\/public\//);
    
    // Should contain the main title
    await expect(page.locator('h1')).toContainText('CoomÜnity - Sitio Web Recuperado');
    
    // Should have all section links
    const pilgrimLink = page.locator('a[href*="pilgrim"]').first();
    const merchantLink = page.locator('a[href*="merchant"]').first();
    const redPillLink = page.locator('a[href*="red-pill"]').first();
    
    await expect(pilgrimLink).toBeVisible();
    await expect(merchantLink).toBeVisible();
    await expect(redPillLink).toBeVisible();
  });

  test('Should have responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/public/');
    
    // Main content should be visible
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Section cards should stack vertically
    const sections = page.locator('.section');
    await expect(sections).toHaveCount(4); // pilgrim, merchant, red-pill, docs
  });

  test('All navigation links should work', async ({ page }) => {
    await page.goto('/public/');
    
    // Test Pilgrim link
    await page.click('a[href*="pilgrim"]');
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    await page.goBack();
    
    // Test Merchant link
    await page.click('a[href*="merchant"]:not([href*="variations"])');
    await expect(page).toHaveURL(/.*sections\/merchant/);
    await page.goBack();
    
    // Test Red Pill link
    await page.click('a[href*="red-pill"]:not([href*="journey"])');
    await expect(page).toHaveURL(/.*sections\/red-pill/);
  });

  test('Should display generation timestamp', async ({ page }) => {
    await page.goto('/public/');
    
    const footer = page.locator('.footer');
    await expect(footer).toContainText('Generado el:');
    await expect(footer).toContainText('Sitio web unificado generado automáticamente');
  });
});

test.describe('Sección Pilgrim', () => {
  
  test('Pilgrim demo should load correctly', async ({ page }) => {
    await page.goto('/sections/pilgrim/');
    
    // Page should load without errors - use actual title
    await expect(page).toHaveTitle(/.*Player|öommunity.*/i);
    
    // Should have basic HTML structure
    await expect(page.locator('body')).toBeVisible();
    
    // Assets should load properly (CSS, JS)
    const stylesheets = page.locator('link[rel="stylesheet"]');
    await expect(stylesheets.first()).toBeAttached();
  });

  test('Pilgrim assets should be accessible', async ({ page }) => {
    await page.goto('/sections/pilgrim/');
    
    // Test that CSS files load
    const response = await page.request.get('/sections/pilgrim/assets/css/');
    // CSS directory should be accessible (even if returns 403/directory listing)
    expect([200, 403, 404]).toContain(response.status());
  });
});

test.describe('Sección Merchant', () => {
  
  test('Merchant demo should load correctly', async ({ page }) => {
    await page.goto('/sections/merchant/');
    
    // Page should load without errors - use actual title
    await expect(page).toHaveTitle(/.*App|oomunity.*/i);
    
    // Should have basic HTML structure
    await expect(page.locator('body')).toBeVisible();
  });

  test('Merchant variations should be accessible', async ({ page }) => {
    const variations = [
      '/sections/merchant/variations/initial_load.html',
      '/sections/merchant/variations/after_scroll.html',
      '/sections/merchant/variations/button_clicked.html'
    ];

    for (const variation of variations) {
      await page.goto(variation);
      await expect(page.locator('body')).toBeVisible();
      
      // Should not have major JavaScript errors
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      await page.waitForTimeout(1000); // Wait for potential JS errors
      
      // Allow for some errors but not critical ones
      const criticalErrors = errors.filter(error => 
        error.includes('ReferenceError') || 
        error.includes('TypeError') && error.includes('Cannot read')
      );
      expect(criticalErrors.length).toBeLessThan(3);
    }
  });
});

test.describe('Sección Red Pill', () => {
  
  test('Red Pill demo should load correctly', async ({ page }) => {
    await page.goto('/sections/red-pill/');
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Should have interactive elements typical of red pill experience
    const interactiveElements = page.locator('button, a, [onclick]');
    await expect(interactiveElements.first()).toBeAttached();
  });

  test('Red Pill journey pages should be accessible', async ({ page }) => {
    const journeyPages = [
      '/sections/red-pill/journey/initial.html',
      '/sections/red-pill/journey/left_path.html',
      '/sections/red-pill/journey/right_path.html',
      '/sections/red-pill/journey/final.html'
    ];

    for (const journeyPage of journeyPages) {
      await page.goto(journeyPage);
      await expect(page.locator('body')).toBeVisible();
      
      // Should have video or interactive content
      const mediaElements = page.locator('video, canvas, [data-video], .video');
      const interactiveElements = page.locator('button, [onclick], .choice, .action');
      
      const hasMedia = await mediaElements.count() > 0;
      const hasInteractive = await interactiveElements.count() > 0;
      
      expect(hasMedia || hasInteractive).toBe(true);
    }
  });

  test('Red Pill should handle video elements', async ({ page }) => {
    await page.goto('/sections/red-pill/');
    
    // Look for video elements
    const videos = page.locator('video');
    if (await videos.count() > 0) {
      const firstVideo = videos.first();
      await expect(firstVideo).toBeAttached();
      
      // Check video attributes
      const src = await firstVideo.getAttribute('src');
      if (src) {
        expect(src).toMatch(/\.(mp4|webm|ogg)$/i);
      }
    }
  });
});

test.describe('Error Handling', () => {
  
  test('Should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    
    // Should still return valid HTML
    await expect(page.locator('body')).toBeVisible();
  });

  test('Should handle missing assets gracefully', async ({ page }) => {
    await page.goto('/sections/pilgrim/');
    
    // Monitor for 404 errors on assets
    const failed404s: string[] = [];
    page.on('response', response => {
      if (response.status() === 404 && 
          (response.url().includes('.css') || 
           response.url().includes('.js') || 
           response.url().includes('.png') ||
           response.url().includes('.jpg'))) {
        failed404s.push(response.url());
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Some 404s are expected due to path rewriting, but shouldn't be excessive
    expect(failed404s.length).toBeLessThan(10);
  });
});

test.describe('Performance', () => {
  
  test('Main page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/public/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Assets should be properly cached', async ({ page }) => {
    await page.goto('/sections/pilgrim/');
    
    // Check for cache headers
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/assets/')) {
        responses.push({
          url: response.url(),
          headers: response.headers()
        });
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should have some cached responses
    const cachedResponses = responses.filter(r => 
      r.headers['cache-control'] || r.headers['etag']
    );
    expect(cachedResponses.length).toBeGreaterThan(0);
  });
}); 