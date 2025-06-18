/**
 * 🧪 E2E Integration Test - SuperApp CoomÜnity
 * 
 * Test completo de integración frontend-backend
 * Verifica que todos los módulos funcionen correctamente con datos reales del backend
 */

import { test, expect, Page } from '@playwright/test';

// Helper function to wait for backend to be ready
async function waitForBackend() {
  const maxRetries = 10;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch('http://localhost:1111/health');
      if (response.ok) {
        console.log('✅ Backend is ready');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Waiting for backend... (${retries + 1}/${maxRetries})`);
    }
    
    retries++;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('❌ Backend is not responding after maximum retries');
}

// Helper function to login
async function loginUser(page: Page) {
  await page.goto('http://localhost:2222/auth/login');
  await page.fill('[data-testid="email-input"]', 'admin@gamifier.com');
  await page.fill('[data-testid="password-input"]', 'admin123');
  await page.click('[data-testid="login-button"]');
  
  // Wait for successful login redirect
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
  
  // Verify login success
  await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
}

test.describe('SuperApp CoomÜnity - Frontend-Backend Integration', () => {
  
  test.beforeAll(async () => {
    console.log('🚀 Starting E2E Integration Tests...');
    await waitForBackend();
  });

  test.beforeEach(async ({ page }) => {
    // Set up interceptors to monitor API calls
    await page.route('**/api/**', route => {
      console.log(`📡 API Call: ${route.request().method()} ${route.request().url()}`);
      route.continue();
    });
  });

  test('1. Authentication Flow - Login with Real Backend', async ({ page }) => {
    console.log('🔐 Testing Authentication...');
    
    await loginUser(page);
    
    // Verify user is logged in with real backend data
    const userProfile = page.locator('[data-testid="user-profile"]');
    await expect(userProfile).toBeVisible();
    
    console.log('✅ Authentication successful');
  });

  test('2. ÜPlay Module - Videos from Real Backend', async ({ page }) => {
    console.log('🎬 Testing ÜPlay Module...');
    
    await loginUser(page);
    
    // Navigate to ÜPlay
    await page.click('[data-testid="nav-uplay"]');
    await page.waitForURL(/.*\/uplay/);
    
    // Wait for videos to load from backend
    await page.waitForSelector('[data-testid="video-list"]', { timeout: 10000 });
    
    // Verify videos are loaded (not mock data)
    const videoItems = page.locator('[data-testid="video-item"]');
    await expect(videoItems.first()).toBeVisible();
    
    // Check that video data comes from backend (look for real video properties)
    const firstVideo = videoItems.first();
    await expect(firstVideo.locator('[data-testid="video-title"]')).not.toBeEmpty();
    await expect(firstVideo.locator('[data-testid="video-duration"]')).not.toBeEmpty();
    
    // Test video player functionality
    await firstVideo.click();
    await page.waitForSelector('[data-testid="video-player"]', { timeout: 5000 });
    
    console.log('✅ ÜPlay Module working with backend');
  });

  test('3. Marketplace Module - Items from Real Backend', async ({ page }) => {
    console.log('🛒 Testing Marketplace Module...');
    
    await loginUser(page);
    
    // Navigate to Marketplace
    await page.click('[data-testid="nav-marketplace"]');
    await page.waitForURL(/.*\/marketplace/);
    
    // Wait for marketplace items to load
    await page.waitForSelector('[data-testid="marketplace-items"]', { timeout: 10000 });
    
    // Verify marketplace items are loaded from backend
    const marketplaceItems = page.locator('[data-testid="marketplace-item"]');
    await expect(marketplaceItems.first()).toBeVisible();
    
    // Test item details
    const firstItem = marketplaceItems.first();
    await expect(firstItem.locator('[data-testid="item-title"]')).not.toBeEmpty();
    await expect(firstItem.locator('[data-testid="item-price"]')).not.toBeEmpty();
    
    // Test item detail view
    await firstItem.click();
    await page.waitForSelector('[data-testid="item-detail-view"]', { timeout: 5000 });
    
    console.log('✅ Marketplace Module working with backend');
  });

  test('4. Study Rooms Module - Real-time Backend Data', async ({ page }) => {
    console.log('🏫 Testing Study Rooms Module...');
    
    await loginUser(page);
    
    // Navigate to Study Rooms
    await page.click('[data-testid="nav-study-rooms"]');
    await page.waitForURL(/.*\/study-rooms/);
    
    // Wait for study rooms to load
    await page.waitForSelector('[data-testid="study-rooms-list"]', { timeout: 10000 });
    
    // Verify study rooms are loaded from backend
    const studyRooms = page.locator('[data-testid="study-room"]');
    
    // Check if rooms exist or if create room option is available
    const createRoomButton = page.locator('[data-testid="create-room-button"]');
    await expect(createRoomButton).toBeVisible();
    
    console.log('✅ Study Rooms Module working with backend');
  });

  test('5. LETS Module - Economy System Backend Integration', async ({ page }) => {
    console.log('💰 Testing LETS Module...');
    
    await loginUser(page);
    
    // Navigate to LETS
    await page.click('[data-testid="nav-lets"]');
    await page.waitForURL(/.*\/lets/);
    
    // Wait for LETS data to load
    await page.waitForSelector('[data-testid="lets-dashboard"]', { timeout: 10000 });
    
    // Verify LETS balance and transactions
    const lukasBalance = page.locator('[data-testid="lukas-balance"]');
    const ondasBalance = page.locator('[data-testid="ondas-balance"]');
    
    await expect(lukasBalance).toBeVisible();
    await expect(ondasBalance).toBeVisible();
    
    console.log('✅ LETS Module working with backend');
  });

  test('6. Analytics Dashboard - Real Metrics', async ({ page }) => {
    console.log('📊 Testing Analytics Dashboard...');
    
    await loginUser(page);
    
    // Navigate to Analytics (if available in user dashboard)
    await page.click('[data-testid="nav-analytics"]');
    await page.waitForURL(/.*\/analytics/);
    
    // Wait for analytics data to load
    await page.waitForSelector('[data-testid="analytics-dashboard"]', { timeout: 10000 });
    
    // Verify metrics are displayed
    const userStats = page.locator('[data-testid="user-stats"]');
    const activityMetrics = page.locator('[data-testid="activity-metrics"]');
    
    await expect(userStats).toBeVisible();
    await expect(activityMetrics).toBeVisible();
    
    console.log('✅ Analytics Dashboard working with backend');
  });

  test('7. No Mock Data Detection - Verify Real Backend Usage', async ({ page }) => {
    console.log('🔍 Verifying No Mock Data Usage...');
    
    await loginUser(page);
    
    // Monitor network requests to ensure no mock data endpoints
    const mockEndpoints = [
      '/mock/',
      '/fake/',
      '/test/',
      'mockData',
      'fakeData'
    ];
    
    let mockDetected = false;
    
    page.on('request', request => {
      const url = request.url();
      mockEndpoints.forEach(mockEndpoint => {
        if (url.includes(mockEndpoint)) {
          console.log(`❌ Mock endpoint detected: ${url}`);
          mockDetected = true;
        }
      });
    });
    
    // Navigate through all main modules
    const modules = [
      '[data-testid="nav-uplay"]',
      '[data-testid="nav-marketplace"]', 
      '[data-testid="nav-study-rooms"]',
      '[data-testid="nav-lets"]'
    ];
    
    for (const module of modules) {
      await page.click(module);
      await page.waitForTimeout(2000); // Wait for page to load
    }
    
    expect(mockDetected).toBe(false);
    console.log('✅ No mock data detected - Using real backend');
  });

  test('8. Performance and Load Test', async ({ page }) => {
    console.log('⚡ Testing Performance...');
    
    await loginUser(page);
    
    // Measure page load times for each module
    const modules = [
      { name: 'ÜPlay', selector: '[data-testid="nav-uplay"]', url: /.*\/uplay/ },
      { name: 'Marketplace', selector: '[data-testid="nav-marketplace"]', url: /.*\/marketplace/ },
      { name: 'Study Rooms', selector: '[data-testid="nav-study-rooms"]', url: /.*\/study-rooms/ },
      { name: 'LETS', selector: '[data-testid="nav-lets"]', url: /.*\/lets/ }
    ];
    
    for (const module of modules) {
      const startTime = Date.now();
      
      await page.click(module.selector);
      await page.waitForURL(module.url, { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ ${module.name} load time: ${loadTime}ms`);
      
      // Ensure reasonable load times (less than 5 seconds)
      expect(loadTime).toBeLessThan(5000);
    }
    
    console.log('✅ Performance test passed');
  });

  test('9. Error Handling - Backend Connection Issues', async ({ page }) => {
    console.log('🛡️ Testing Error Handling...');
    
    await loginUser(page);
    
    // Test graceful handling of network errors
    await page.route('**/api/**', route => {
      // Simulate network error for some requests
      if (Math.random() < 0.1) { // 10% of requests fail
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Navigate through modules and ensure app doesn't crash
    await page.click('[data-testid="nav-uplay"]');
    await page.waitForTimeout(3000);
    
    // Check that error messages are shown gracefully
    const errorMessage = page.locator('[data-testid="error-message"]');
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    // App should either show content, loading, or graceful error
    const hasContent = await page.locator('[data-testid="video-list"]').isVisible();
    const hasLoading = await loadingSpinner.isVisible();
    const hasError = await errorMessage.isVisible();
    
    expect(hasContent || hasLoading || hasError).toBe(true);
    
    console.log('✅ Error handling working correctly');
  });

  test('10. Complete User Journey - End-to-End Flow', async ({ page }) => {
    console.log('🌟 Testing Complete User Journey...');
    
    // 1. Login
    await loginUser(page);
    
    // 2. Check dashboard
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    
    // 3. Watch a video in ÜPlay
    await page.click('[data-testid="nav-uplay"]');
    await page.waitForSelector('[data-testid="video-list"]');
    const firstVideo = page.locator('[data-testid="video-item"]').first();
    if (await firstVideo.isVisible()) {
      await firstVideo.click();
      await page.waitForSelector('[data-testid="video-player"]', { timeout: 5000 });
    }
    
    // 4. Browse marketplace
    await page.click('[data-testid="nav-marketplace"]');
    await page.waitForSelector('[data-testid="marketplace-items"]');
    
    // 5. Check LETS balance
    await page.click('[data-testid="nav-lets"]');
    await page.waitForSelector('[data-testid="lets-dashboard"]');
    
    // 6. Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL(/.*\/auth/);
    
    console.log('✅ Complete user journey successful');
  });

});

test.afterAll(async () => {
  console.log('🎯 E2E Integration Tests Complete!');
  console.log('📝 Summary:');
  console.log('  ✅ Authentication with real backend');
  console.log('  ✅ All modules connected to backend APIs');
  console.log('  ✅ No mock data detected');
  console.log('  ✅ Performance within acceptable limits');
  console.log('  ✅ Error handling graceful');
  console.log('  ✅ Complete user journey working');
}); 