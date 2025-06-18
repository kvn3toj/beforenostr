import { test, expect } from '@playwright/test';

test.describe('Visual Diagnosis - Homepage States', () => {
  test('should capture homepage in different states and browsers', async ({ page, browserName }) => {
    console.log(`🔍 Testing in ${browserName}`);
    
    // 1. Clear all storage to simulate fresh user
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // 2. Navigate to homepage
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // 3. Check if we need to login
    const loginForm = page.locator('[data-testid="login-email-input"]');
    const isLoginFormVisible = await loginForm.isVisible().catch(() => false);
    
    if (isLoginFormVisible) {
      console.log('🔐 Login form detected, authenticating...');
      
      // Login with admin credentials
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');
      
      // Wait for redirect to home
      await page.waitForURL('**/', { timeout: 15000 });
      await page.waitForSelector('#root', { timeout: 15000 });
    }
    
    // 4. Wait for data to load and capture initial state
    await page.waitForTimeout(3000);
    
    // 5. Check backend connectivity
    const backendStatus = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:1111/health');
        const data = await response.json();
        return { available: true, data };
      } catch (error) {
        return { available: false, error: error.message };
      }
    });
    
    console.log('🌐 Backend Status:', backendStatus);
    
    // 6. Check what data is being used
    const dataState = await page.evaluate(() => {
      // Check localStorage for auth data
      const authToken = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
      const userData = localStorage.getItem('COOMUNITY_USER_DATA');
      
      // Check if offline mode alert is visible
      const offlineAlert = document.querySelector('[role="alert"]');
      const isOfflineMode = offlineAlert && offlineAlert.textContent?.includes('Modo Offline');
      
      return {
        hasAuthToken: !!authToken,
        hasUserData: !!userData,
        isOfflineMode,
        offlineAlertText: offlineAlert?.textContent || null
      };
    });
    
    console.log('📊 Data State:', dataState);
    
    // 7. Capture screenshot with detailed filename
    const screenshotName = `visual-diagnosis-${browserName}-${dataState.isOfflineMode ? 'offline' : 'online'}-${Date.now()}.png`;
    await page.screenshot({ 
      path: screenshotName,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${screenshotName}`);
    
    // 8. Check specific UI elements that differ between states
    const uiElements = await page.evaluate(() => {
      // Check for progress metrics
      const ondasElement = document.querySelector('text=485, text=1250');
      const meritosElement = document.querySelector('text=85%, text=23');
      const walletElement = document.querySelector('text=125.075, text=480');
      
      // Check for loading states
      const loadingElements = document.querySelectorAll('[role="progressbar"], .MuiSkeleton-root');
      
      // Check for error states
      const errorElements = document.querySelectorAll('[role="alert"][severity="error"]');
      
      return {
        hasProgressMetrics: !!(ondasElement || meritosElement),
        hasWalletData: !!walletElement,
        loadingElementsCount: loadingElements.length,
        errorElementsCount: errorElements.length,
        pageTitle: document.title,
        welcomeMessage: document.querySelector('h4, h5, h6')?.textContent || null
      };
    });
    
    console.log('🎯 UI Elements State:', uiElements);
    
    // 9. Test data refresh if in offline mode
    if (dataState.isOfflineMode) {
      console.log('🔄 Testing data refresh in offline mode...');
      
      const refreshButton = page.locator('button:has-text("Reintentar")');
      if (await refreshButton.isVisible()) {
        await refreshButton.click();
        await page.waitForTimeout(2000);
        
        // Capture after refresh attempt
        await page.screenshot({ 
          path: `visual-diagnosis-${browserName}-after-refresh-${Date.now()}.png`,
          fullPage: true 
        });
      }
    }
    
    // 10. Assertions to validate the diagnosis
    expect(uiElements.pageTitle).toContain('CoomÜnity');
    expect(uiElements.welcomeMessage).toBeTruthy();
    
    // Log final summary
    console.log('📋 DIAGNOSIS SUMMARY:');
    console.log(`   Browser: ${browserName}`);
    console.log(`   Backend Available: ${backendStatus.available}`);
    console.log(`   Data Mode: ${dataState.isOfflineMode ? 'OFFLINE (Mock Data)' : 'ONLINE (Real Data)'}`);
    console.log(`   Has Progress Metrics: ${uiElements.hasProgressMetrics}`);
    console.log(`   Has Wallet Data: ${uiElements.hasWalletData}`);
    console.log(`   Loading Elements: ${uiElements.loadingElementsCount}`);
    console.log(`   Error Elements: ${uiElements.errorElementsCount}`);
  });
  
  test('should compare data loading between browsers', async ({ page, browserName }) => {
    // This test specifically focuses on data loading differences
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Login if needed
    const loginForm = page.locator('[data-testid="login-email-input"]');
    const isLoginFormVisible = await loginForm.isVisible().catch(() => false);
    
    if (isLoginFormVisible) {
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/', { timeout: 15000 });
    }
    
    // Wait for different loading phases
    const loadingPhases = [500, 1000, 2000, 3000, 5000];
    
    for (const delay of loadingPhases) {
      await page.waitForTimeout(delay);
      
      const loadingState = await page.evaluate(() => {
        const skeletons = document.querySelectorAll('.MuiSkeleton-root');
        const progressBars = document.querySelectorAll('[role="progressbar"]');
        const dataElements = document.querySelectorAll('[data-testid*="metric"], [data-testid*="balance"]');
        
        return {
          skeletonsCount: skeletons.length,
          progressBarsCount: progressBars.length,
          dataElementsCount: dataElements.length,
          timestamp: Date.now()
        };
      });
      
      console.log(`⏱️ ${browserName} at ${delay}ms:`, loadingState);
      
      if (delay === 3000) {
        await page.screenshot({ 
          path: `loading-comparison-${browserName}-${delay}ms.png`,
          fullPage: true 
        });
      }
    }
  });
}); 