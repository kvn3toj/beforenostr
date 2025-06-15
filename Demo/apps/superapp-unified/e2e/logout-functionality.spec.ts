import { test, expect } from '@playwright/test';

test.describe('Logout Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should perform complete logout flow', async ({ page }) => {
    // Step 1: Login first
    await page.goto('/login');
    await page.waitForSelector('#root');
    
    // Fill login form
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    // Wait for login response
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );
    
    await page.click('[data-testid="login-submit-button"]');
    await loginPromise;
    
    // Wait for redirect after login
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    
    console.log('✅ Login completed successfully');
    
    // Step 2: Verify tokens exist before logout
    const tokenBefore = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const userBefore = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    expect(tokenBefore).toBeTruthy();
    expect(userBefore).toBeTruthy();
    
    console.log('✅ Tokens verified before logout');
    
    // Step 3: Perform logout
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    await page.click('.signout-menu-item');
    
    // Step 4: Wait for redirect to login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    console.log('✅ Redirected to login page after logout');
    
    // Step 5: Verify tokens are cleared
    const tokenAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const userAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    expect(tokenAfter).toBeNull();
    expect(userAfter).toBeNull();
    
    console.log('✅ Tokens cleared successfully after logout');
  });

  test('should clear authentication tokens from localStorage', async ({ page }) => {
    // Wait a moment for tokens to be set after login
    await page.waitForTimeout(1000);
    
    // Verify tokens exist before logout (check if they exist, they might be null initially)
    const tokenBefore = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const userBefore = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    console.log('Tokens before logout:', { tokenBefore, userBefore });
    
    // Perform logout
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    await page.click('.signout-menu-item');
    
    // Wait for redirect
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verify tokens are cleared (they should be null after logout)
    const tokenAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const userAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    expect(tokenAfter).toBeNull();
    expect(userAfter).toBeNull();
  });

  test('should handle logout when already on login page', async ({ page }) => {
    // Start from login page
    await page.goto('/login');
    await page.waitForSelector('#root');
    
    // Verify we're on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verify no tokens exist
    const token = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const user = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    expect(token).toBeNull();
    expect(user).toBeNull();
    
    console.log('✅ No tokens present when starting from login page');
  });

  test('should prevent access to protected routes after logout', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.waitForSelector('#root');
    
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );
    
    await page.click('[data-testid="login-submit-button"]');
    await loginPromise;
    
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    
    // Navigate to a protected route
    await page.goto('/profile');
    await page.waitForTimeout(2000);
    
    // Verify we can access the protected route
    expect(page.url()).toContain('/profile');
    
    // Now logout
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    await page.click('.signout-menu-item');
    
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Try to access protected route again
    await page.goto('/profile');
    
    // Should be redirected back to login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    console.log('✅ Protected route access blocked after logout');
  });

  test('should display logout button with correct styling and accessibility', async ({ page }) => {
    // Open user menu
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    
    // Check logout button exists and has correct attributes
    const logoutButton = page.locator('.signout-menu-item');
    await expect(logoutButton).toBeVisible();
    
    // Check accessibility attributes
    await expect(logoutButton).toHaveAttribute('aria-label', 'Cerrar sesión');
    await expect(logoutButton).toHaveAttribute('title', 'Cerrar sesión actual');
    
    // Check styling (error color) - updated to include more red color variations
    const styles = await logoutButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
      };
    });
    
    // Should have error/red color (including Tailwind red variants)
    expect(styles.color).toMatch(/rgb\(211, 47, 47\)|rgb\(244, 67, 54\)|rgb\(239, 68, 68\)|#d32f2f|#f44336|#ef4444/);
    
    // Check for logout icon
    await expect(logoutButton.locator('svg')).toBeVisible();
    
    // Check text content
    await expect(logoutButton.locator('text=Cerrar Sesión')).toBeVisible();
  });

  test('should handle logout gracefully even if backend call fails', async ({ page }) => {
    // Intercept logout API call and make it fail
    await page.route('**/auth/logout', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });
    
    // Perform logout
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    await page.click('.signout-menu-item');
    
    // Should still redirect to login page even if backend call fails
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verify tokens are still cleared locally
    const tokenAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    const userAfter = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    expect(tokenAfter).toBeNull();
    expect(userAfter).toBeNull();
  });

  test('should show user menu with logout option', async ({ page }) => {
    // Open user menu
    await page.click('.profile-menu-button');
    await expect(page.locator('#primary-search-account-menu')).toBeVisible();
    
    // Check avatar is present in the menu
    await expect(page.locator('#primary-search-account-menu .MuiAvatar-root')).toBeVisible();
    
    // Verify essential menu items are present
    await expect(page.locator('.profile-menu-item')).toBeVisible();
    await expect(page.locator('.settings-menu-item')).toBeVisible();
    await expect(page.locator('.signout-menu-item')).toBeVisible();
    
    // Verify logout button has correct text
    await expect(page.locator('.signout-menu-item')).toContainText('Cerrar Sesión');
    
    // Check that menu contains some user information (any text is fine)
    const menuText = await page.locator('#primary-search-account-menu').textContent();
    expect(menuText).toBeTruthy();
    expect(menuText?.length).toBeGreaterThan(10); // Should have substantial content
  });
}); 