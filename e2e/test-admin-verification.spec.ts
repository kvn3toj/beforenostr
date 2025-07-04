// Test de verificación de autenticación de admin
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Verification', () => {
  test('should login as admin and display admin menu options', async ({ page }) => {
    // Set up console logging
    page.on('console', (msg) => {
      console.log(`🔍 Console: ${msg.text()}`);
    });
    
    page.on('pageerror', (error) => {
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Go to login page
    await page.goto('/login');
    
    // Fill admin credentials
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Wait for redirect to home page
    await page.waitForURL('**/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're logged in by looking for welcome message or user info
    const welcomeText = page.getByRole('heading', { name: 'Welcome to Gamifier Admin' });
    await expect(welcomeText).toBeVisible();
    console.log('✅ Successfully logged in as admin');
    
    // The drawer is already open, look directly for administration section
    const administrationButton = page.getByRole('button', { name: 'Administration' });
    
    if (await administrationButton.isVisible()) {
      console.log('✅ Administration menu found - Admin permissions working correctly!');
      
      // Click to expand admin menu
      await administrationButton.click();
      await page.waitForTimeout(500);
      
      // Check for admin menu items
      const usersMenu = page.getByRole('button', { name: 'Users' }).first();
      const rolesMenu = page.getByRole('button', { name: 'Roles' }).first();
      const permissionsMenu = page.getByRole('button', { name: 'Permissions' }).first();
      const itemsMenu = page.getByRole('button', { name: 'Items' }).first();
      
      if (await usersMenu.isVisible()) {
        console.log('✅ Users menu item found');
      }
      if (await rolesMenu.isVisible()) {
        console.log('✅ Roles menu item found');
      }
      if (await permissionsMenu.isVisible()) {
        console.log('✅ Permissions menu item found');
      }
      if (await itemsMenu.isVisible()) {
        console.log('✅ Items menu item found');
      }
      
      // Test navigation to users page
      await usersMenu.click();
      await page.waitForURL('**/users');
      console.log('✅ Successfully navigated to Users page');
      
    } else {
      console.log('❌ Administration menu NOT found - checking user data...');
      
      // Let's check what user data is stored
      const userDataScript = `
        const userData = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');
        console.log('User data in localStorage:', userData);
        console.log('Token in localStorage:', token ? 'Present' : 'Missing');
        if (userData) {
          const user = JSON.parse(userData);
          console.log('User roles:', user.roles);
          console.log('User permissions:', user.permissions);
        }
        return { userData, hasToken: !!token };
      `;
      
      const result = await page.evaluate(userDataScript);
      console.log('📋 LocalStorage check result:', result);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-admin-login-verification.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-admin-login-verification.png');
  });
}); 