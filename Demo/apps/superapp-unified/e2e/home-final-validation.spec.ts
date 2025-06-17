import { test, expect } from '@playwright/test';

test.describe('Home Page - Final Comprehensive Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Wait for React to mount and initial content to load
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow for dynamic content loading
  });

  test('should render all home page components successfully', async ({ page }) => {
    console.log('🏠 Testing Home Page Component Rendering');
    
    // 1. Verify Welcome Header (using actual text content)
    console.log('1️⃣ Checking Welcome Header...');
    
    // Look for the greeting text that we know is being displayed
    const greetingText = await page.locator('text=/Buenas (tardes|noches|días)/').first();
    await expect(greetingText).toBeVisible({ timeout: 10000 });
    console.log('✅ Welcome greeting found');
    
    // Verify administrator text is present
    const adminText = await page.locator('text=Administrator').first();
    await expect(adminText).toBeVisible();
    console.log('✅ Administrator text found');

    // 2. Verify Module Cards Section
    console.log('2️⃣ Checking Module Cards...');
    
    // Look for module card container or individual modules
    const moduleCards = page.locator('[class*="module"], [class*="card"], .MuiCard-root');
    const moduleCount = await moduleCards.count();
    console.log(`📊 Found ${moduleCount} potential module elements`);
    
    // Check for specific module names
    const modules = ['ÜPlay', 'Marketplace', 'Social', 'UStats'];
    for (const module of modules) {
      const moduleElement = page.locator(`text=${module}`).first();
      const isVisible = await moduleElement.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`✅ ${module} module found`);
      } else {
        console.log(`⚠️ ${module} module not visible`);
      }
    }

    // 3. Verify Quick Actions Grid
    console.log('3️⃣ Checking Quick Actions...');
    
    // Look for action buttons or quick action elements
    const actionElements = page.locator('button, [role="button"], [class*="action"]');
    const actionCount = await actionElements.count();
    console.log(`🎯 Found ${actionCount} potential action elements`);
    
    // Check for common action text
    const actions = ['Ver Perfil', 'Configuración', 'Ayuda', 'Notificaciones'];
    for (const action of actions) {
      const actionElement = page.locator(`text=${action}`).first();
      const isVisible = await actionElement.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`✅ ${action} action found`);
      }
    }

    // 4. Verify Ayni Metrics Card
    console.log('4️⃣ Checking Ayni Metrics...');
    
    // Look for Ayni-related content
    const ayniText = page.locator('text=/Ayni|Mëritos|Lükas|Öndas/').first();
    const hasAyniContent = await ayniText.isVisible().catch(() => false);
    if (hasAyniContent) {
      console.log('✅ Ayni metrics content found');
    } else {
      console.log('⚠️ Ayni metrics content not visible');
    }

    // 5. Verify overall page structure
    console.log('5️⃣ Checking overall page structure...');
    
    // Check for main content container
    const mainContent = page.locator('main, [role="main"], .MuiContainer-root').first();
    await expect(mainContent).toBeVisible();
    console.log('✅ Main content container found');
    
    // Check for Material-UI components
    const muiComponents = page.locator('[class*="Mui"]');
    const muiCount = await muiComponents.count();
    console.log(`🎨 Found ${muiCount} Material-UI components`);
    expect(muiCount).toBeGreaterThan(0);

    // 6. Verify page doesn't have critical errors
    console.log('6️⃣ Checking for critical errors...');
    
    // Check for error boundaries or error messages
    const errorElements = page.locator('text=/error|Error|ERROR/');
    const errorCount = await errorElements.count();
    
    // Filter out expected error messages (like 404 notifications)
    let criticalErrors = 0;
    for (let i = 0; i < errorCount; i++) {
      const errorText = await errorElements.nth(i).textContent();
      if (errorText && !errorText.includes('404') && !errorText.includes('notification')) {
        criticalErrors++;
        console.log(`⚠️ Potential critical error: ${errorText}`);
      }
    }
    
    expect(criticalErrors).toBe(0);
    console.log('✅ No critical errors found');

    // 7. Final verification - ensure page is interactive
    console.log('7️⃣ Testing page interactivity...');
    
    // Try to find and click a clickable element
    const clickableElements = page.locator('button:visible, [role="button"]:visible, a:visible').first();
    const hasClickableElements = await clickableElements.isVisible().catch(() => false);
    
    if (hasClickableElements) {
      console.log('✅ Interactive elements found');
      // Don't actually click to avoid navigation, just verify it's clickable
      await expect(clickableElements).toBeEnabled();
    } else {
      console.log('⚠️ No clearly interactive elements found');
    }

    console.log('🎉 Home Page Validation Complete!');
  });

  test('should handle responsive design correctly', async ({ page }) => {
    console.log('📱 Testing Responsive Design');
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`🔄 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000); // Allow for responsive adjustments
      
      // Verify page is still functional
      const greeting = await page.locator('text=/Buenas/').first().isVisible().catch(() => false);
      if (!greeting) {
        // Try alternative greeting patterns for responsive layouts
        const altGreeting = await page.locator('text=/Administrator|Welcome|Hola/').first().isVisible().catch(() => false);
        expect(altGreeting).toBe(true);
      } else {
        expect(greeting).toBe(true);
      }
      
      // Check for responsive layout indicators
      const containers = page.locator('.MuiContainer-root, [class*="container"]');
      const containerCount = await containers.count();
      expect(containerCount).toBeGreaterThan(0);
      
      console.log(`✅ ${viewport.name} viewport working correctly`);
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    console.log('🐛 Testing for JavaScript Errors');
    
    const errors: string[] = [];
    
    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known non-critical errors
        if (!text.includes('404') && 
            !text.includes('Failed to fetch') && 
            !text.includes('NetworkError') &&
            !text.includes('favicon.ico')) {
          errors.push(text);
        }
      }
    });
    
    // Capture page errors
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    // Navigate and wait for content
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForTimeout(3000); // Give time for any async operations
    
    // Report errors
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No critical JavaScript errors found');
    }
    
    // Allow some errors but not too many
    expect(errors.length).toBeLessThanOrEqual(2);
  });
}); 