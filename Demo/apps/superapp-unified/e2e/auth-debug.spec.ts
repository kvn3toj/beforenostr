/**
 * 🔧 Test de Debug de Autenticación
 * 
 * Test específico para verificar cada paso del flujo de autenticación
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Debug', () => {
  test('debug login process step by step', async ({ page }) => {
    console.log('🔍 Starting detailed authentication debug...');
    
    // Set up console logging to capture any errors
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('response', response => {
      if (response.url().includes('auth') || response.url().includes('login')) {
        console.log(`🌐 Auth Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Step 1: Navigate to login page
    console.log('1️⃣ Navigating to login page...');
    await page.goto('/login');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    console.log(`📍 Current URL after /login navigation: ${page.url()}`);
    
    // Take a screenshot of the login page
    await page.screenshot({ path: 'debug-login-page.png', fullPage: true });
    console.log('📸 Login page screenshot saved');
    
    // Step 2: Fill in the form
    console.log('2️⃣ Filling login form...');
    
    const emailInput = page.locator('[data-testid="login-email-input"] input');
    const passwordInput = page.locator('[data-testid="login-password-input"] input');
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    
    // Check if form elements are visible
    const emailVisible = await emailInput.isVisible();
    const passwordVisible = await passwordInput.isVisible();
    const submitVisible = await submitButton.isVisible();
    
    console.log(`📧 Email input visible: ${emailVisible}`);
    console.log(`🔒 Password input visible: ${passwordVisible}`);
    console.log(`🚀 Submit button visible: ${submitVisible}`);
    
    if (!emailVisible || !passwordVisible || !submitVisible) {
      console.log('❌ Login form elements not found - checking page content...');
      const bodyText = await page.textContent('body');
      console.log(`📄 Page content preview: ${bodyText?.substring(0, 500)}...`);
      return;
    }
    
    // Clear and fill form
    await emailInput.clear();
    await emailInput.fill('admin@gamifier.com');
    await passwordInput.clear();
    await passwordInput.fill('admin123');
    
    console.log('✅ Form filled with admin credentials');
    
    // Step 3: Submit the form
    console.log('3️⃣ Submitting login form...');
    await submitButton.click();
    
    // Wait and observe what happens
    await page.waitForTimeout(5000);
    
    console.log(`🔄 URL after form submission: ${page.url()}`);
    
    // Take a screenshot after form submission
    await page.screenshot({ path: 'debug-after-submit.png', fullPage: true });
    console.log('📸 After-submit screenshot saved');
    
    // Check if we're still on login page or redirected
    if (page.url().includes('/login')) {
      console.log('⚠️ Still on login page - checking for error messages...');
      
      // Look for error messages
      const errorElements = page.locator('[role="alert"], .error, .MuiAlert-root');
      const errorCount = await errorElements.count();
      console.log(`❌ Found ${errorCount} error elements`);
      
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorElements.nth(i).textContent();
        console.log(`❌ Error ${i + 1}: ${errorText}`);
      }
      
      // Check for any validation messages
      const validationMessages = page.locator('[role="alert"], .MuiFormHelperText-root');
      const validationCount = await validationMessages.count();
      console.log(`⚠️ Found ${validationCount} validation messages`);
      
      for (let i = 0; i < validationCount; i++) {
        const validationText = await validationMessages.nth(i).textContent();
        console.log(`⚠️ Validation ${i + 1}: ${validationText}`);
      }
      
    } else {
      console.log('✅ Redirected away from login page');
      
      // Wait a bit more to ensure full page load
      await page.waitForTimeout(3000);
      
      console.log(`🎯 Final URL: ${page.url()}`);
      
      // Take final screenshot
      await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
      console.log('📸 Final state screenshot saved');
    }
    
    // Try to check local storage for tokens
    const tokenData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        authKeys: Object.keys(localStorage).filter(key => 
          key.includes('token') || key.includes('auth') || key.includes('user')
        )
      };
    });
    
    console.log('🔑 Local storage auth data:', JSON.stringify(tokenData, null, 2));
  });
}); 