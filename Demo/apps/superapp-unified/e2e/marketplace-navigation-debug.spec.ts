import { test, expect } from '@playwright/test';

test.describe('Marketplace Navigation Debug', () => {
  test('debug marketplace navigation after login', async ({ page }) => {
    console.log('🔍 Starting marketplace navigation debug...');
    
    // Set up console logging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('auth') || msg.text().includes('marketplace')) {
        console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Monitor network requests
    page.on('response', response => {
      if (response.url().includes('auth') || response.url().includes('marketplace') || response.url().includes('users')) {
        console.log(`🌐 Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Step 1: Go to login
    console.log('1️⃣ Navigating to login...');
    await page.goto('/login');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    console.log(`📍 At login page: ${page.url()}`);
    
    // Step 2: Perform login
    console.log('2️⃣ Logging in...');
    const emailInput = page.locator('[data-testid="login-email-input"] input');
    const passwordInput = page.locator('[data-testid="login-password-input"] input');
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    
    await emailInput.clear();
    await emailInput.fill('admin@gamifier.com');
    await passwordInput.clear();
    await passwordInput.fill('admin123');
    await submitButton.click();
    
    // Step 3: Wait for redirection
    console.log('3️⃣ Waiting for login redirection...');
    await page.waitForTimeout(5000);
    console.log(`📍 After login: ${page.url()}`);
    
    // Check localStorage for authentication
    const authData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('coomunity_token'),
        user: localStorage.getItem('coomunity_user'),
        allKeys: Object.keys(localStorage)
      };
    });
    
    console.log('🔑 Authentication data:', JSON.stringify(authData, null, 2));
    
    // Step 4: Try to navigate to marketplace directly
    console.log('4️⃣ Navigating to marketplace...');
    await page.goto('/marketplace');
    await page.waitForTimeout(3000);
    
    console.log(`📍 After marketplace navigation: ${page.url()}`);
    
    // Take screenshots
    await page.screenshot({ path: 'debug-marketplace-nav.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    // Step 5: Check if we're actually on marketplace or redirected elsewhere
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log(`🗺️ Current pathname: ${currentPath}`);
    
    if (currentPath !== '/marketplace') {
      console.log('❌ Not on marketplace page - checking page content...');
      const bodyText = await page.textContent('body');
      console.log(`📄 Page content preview: ${bodyText?.substring(0, 500)}...`);
      
      // Check if we're back on login page
      const isLoginPage = await page.locator('[data-testid="login-email-input"]').count();
      console.log(`🔐 Is login page? ${isLoginPage > 0}`);
      
      // Check for any error messages
      const errorMessages = await page.locator('[role="alert"], .error, .MuiAlert-root').count();
      console.log(`❌ Error messages found: ${errorMessages}`);
      
    } else {
      console.log('✅ Successfully on marketplace page');
      
      // Look for the create button
      const createButtons = await page.locator('[data-testid="create-item-button"]').count();
      console.log(`🔍 Create buttons found: ${createButtons}`);
      
      if (createButtons === 0) {
        // Look for any buttons that might be the create button
        const allButtons = await page.locator('button').count();
        console.log(`🔲 Total buttons on page: ${allButtons}`);
        
        // Look for text that might indicate marketplace functionality
        const bodyText = await page.textContent('body');
        const hasMarketplaceTerms = bodyText?.includes('Publicar') || bodyText?.includes('Servicio') || bodyText?.includes('Producto');
        console.log(`📝 Has marketplace terms: ${hasMarketplaceTerms}`);
      }
    }
    
    // Final verification - try alternative selectors for the create button
    console.log('5️⃣ Looking for create button with alternative selectors...');
    
    const alternativeSelectors = [
      '[data-testid="create-item-button"]',
      'button:has-text("Publicar Servicio")',
      'button:has-text("Publicar")',
      'button:has-text("Crear")',
      'button:has-text("Nuevo")'
    ];
    
    for (const selector of alternativeSelectors) {
      const count = await page.locator(selector).count();
      console.log(`🔍 Selector "${selector}": ${count} matches`);
    }
  });
}); 