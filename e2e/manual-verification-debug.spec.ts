import { test, expect } from '@playwright/test';

test.describe('Manual Verification Debug - Mundos Integration', () => {
  test('Step 1: Verify SuperApp loads and navigation is visible', async ({ page }) => {
    console.log('🔍 STEP 1: Loading SuperApp and checking navigation...');
    
    // Navigate to SuperApp
    await page.goto('/');
    
    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Take screenshot of initial load
    await page.screenshot({ path: 'debug-step1-initial-load.png', fullPage: true });
    
    // Check if main navigation is visible
    const navigation = await page.locator('nav, [role="navigation"], .MuiAppBar-root, .navigation').first();
    const isNavigationVisible = await navigation.isVisible().catch(() => false);
    
    console.log(`📍 Navigation visible: ${isNavigationVisible}`);
    
    if (isNavigationVisible) {
      // Get all navigation text content
      const navText = await navigation.textContent();
      console.log(`📍 Navigation content: "${navText}"`);
      
      // Look for Mundos/Worlds links specifically
      const mundosLink = await page.locator('text=Mundos').first().isVisible().catch(() => false);
      const worldsLink = await page.locator('text=Worlds').first().isVisible().catch(() => false);
      const mundosIcon = await page.locator('[href="/mundos"], [href*="mundos"]').first().isVisible().catch(() => false);
      
      console.log(`📍 "Mundos" link visible: ${mundosLink}`);
      console.log(`📍 "Worlds" link visible: ${worldsLink}`);
      console.log(`📍 Mundos route link visible: ${mundosIcon}`);
    }
    
    // Check if user is authenticated
    const userInfo = await page.locator('text=mock-user, text=Super Admin, [data-testid*="user"]').first().isVisible().catch(() => false);
    console.log(`📍 User authentication visible: ${userInfo}`);
    
    expect(isNavigationVisible).toBe(true);
  });

  test('Step 2: Direct navigation to /mundos', async ({ page }) => {
    console.log('🔍 STEP 2: Direct navigation to /mundos...');
    
    // Set up network monitoring
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('mundos') || request.url().includes('3002')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        });
        console.log(`📡 API Call detected: ${request.method()} ${request.url()}`);
      }
    });
    
    // Navigate directly to /mundos
    await page.goto('/mundos');
    
    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Wait a bit for any API calls to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot of mundos page
    await page.screenshot({ path: 'debug-step2-mundos-page.png', fullPage: true });
    
    // Check page content
    const pageContent = await page.textContent('body');
    console.log(`📍 Page contains "Mundos": ${pageContent.includes('Mundos')}`);
    console.log(`📍 Page contains "Mundo": ${pageContent.includes('Mundo')}`);
    console.log(`📍 Page contains "Desarrollo": ${pageContent.includes('Desarrollo')}`);
    console.log(`📍 Page contains error: ${pageContent.includes('Error') || pageContent.includes('error')}`);
    
    // Check for loading states
    const isLoading = await page.locator('text=Loading, text=Cargando, [data-testid*="loading"]').first().isVisible().catch(() => false);
    console.log(`📍 Loading state visible: ${isLoading}`);
    
    // Log all API calls made
    console.log(`📡 Total API calls detected: ${apiCalls.length}`);
    apiCalls.forEach((call, index) => {
      console.log(`📡 Call ${index + 1}: ${call.method} ${call.url} at ${call.timestamp}`);
    });
    
    // Check console for any errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('useMundosQuery')) {
        logs.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    if (logs.length > 0) {
      console.log('📍 Console logs related to mundos:');
      logs.forEach(log => console.log(`  ${log}`));
    }
  });

  test('Step 3: Check useMundosQuery execution', async ({ page }) => {
    console.log('🔍 STEP 3: Checking useMundosQuery hook execution...');
    
    // Navigate to mundos page
    await page.goto('/mundos');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Inject script to check React Query state
    const reactQueryState = await page.evaluate(() => {
      // Try to access React Query devtools or state
      const queryClient = window.__REACT_QUERY_CLIENT__;
      if (queryClient) {
        const queries = queryClient.getQueryCache().getAll();
        return queries.map(query => ({
          queryKey: query.queryKey,
          state: query.state.status,
          data: query.state.data ? 'Has data' : 'No data',
          error: query.state.error ? query.state.error.message : null
        }));
      }
      return 'React Query client not found';
    });
    
    console.log('📍 React Query state:', JSON.stringify(reactQueryState, null, 2));
    
    // Check for specific mundos query
    await page.waitForTimeout(2000);
    
    // Look for any mundos-related elements
    const mundosElements = await page.locator('[data-testid*="mundo"], [class*="mundo"], text=Mundo').count();
    console.log(`📍 Mundos-related elements found: ${mundosElements}`);
  });

  test('Step 4: Backend connectivity verification', async ({ page }) => {
    console.log('🔍 STEP 4: Backend connectivity verification...');
    
    // Test direct backend call
    const response = await page.request.get('http://localhost:1111/mundos');
    const status = response.status();
    const data = await response.json().catch(() => null);
    
    console.log(`📍 Direct backend call status: ${status}`);
    console.log(`📍 Backend data received:`, JSON.stringify(data, null, 2));
    
    expect(status).toBe(200);
    expect(data).toBeTruthy();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
}); 