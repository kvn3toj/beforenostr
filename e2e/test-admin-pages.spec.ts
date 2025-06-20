import { test, expect } from '@playwright/test';

test.describe('Admin Pages Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🔴 Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      console.error('🔴 Page Error:', error.message);
    });
    
    page.on('requestfailed', (request) => {
      console.error('🔴 Request Failed:', request.url(), request.failure()?.errorText);
    });
    
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    
    // Verificar que estamos en el dashboard usando un selector más específico
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('should load Users page correctly', async ({ page }) => {
    console.log('🔍 Testing Users page...');
    
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página cargó
    await expect(page.getByRole('heading', { name: /usuarios|users/i })).toBeVisible();
    
    // Verificar que hay una tabla o contenido
    const hasTable = await page.locator('table').isVisible();
    const hasContent = await page.locator('[data-testid="users-content"], .users-content').isVisible();
    
    console.log('✅ Users page loaded, has table:', hasTable, 'has content:', hasContent);
    
    await page.screenshot({ path: 'debug-users-page.png' });
  });

  test('should load Mundos page correctly', async ({ page }) => {
    console.log('🔍 Testing Mundos page...');
    
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página cargó
    await expect(page.getByRole('heading', { name: /mundos|worlds/i })).toBeVisible();
    
    // Verificar que hay contenido
    const hasTable = await page.locator('table').isVisible();
    const hasContent = await page.locator('[data-testid="mundos-content"], .mundos-content').isVisible();
    
    console.log('✅ Mundos page loaded, has table:', hasTable, 'has content:', hasContent);
    
    await page.screenshot({ path: 'debug-mundos-page.png' });
  });

  test('should load Playlists page correctly', async ({ page }) => {
    console.log('🔍 Testing Playlists page...');
    
    await page.goto('/playlists');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página cargó
    await expect(page.getByRole('heading', { name: /playlists|listas/i })).toBeVisible();
    
    // Verificar que hay contenido
    const hasTable = await page.locator('table').isVisible();
    const hasContent = await page.locator('[data-testid="playlists-content"], .playlists-content').isVisible();
    
    console.log('✅ Playlists page loaded, has table:', hasTable, 'has content:', hasContent);
    
    await page.screenshot({ path: 'debug-playlists-page.png' });
  });

  test('should load Roles page correctly', async ({ page }) => {
    console.log('🔍 Testing Roles page...');
    
    await page.goto('/roles');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página cargó
    await expect(page.getByRole('heading', { name: /roles|permisos/i })).toBeVisible();
    
    // Verificar que hay contenido
    const hasTable = await page.locator('table').isVisible();
    const hasContent = await page.locator('[data-testid="roles-content"], .roles-content').isVisible();
    
    console.log('✅ Roles page loaded, has table:', hasTable, 'has content:', hasContent);
    
    await page.screenshot({ path: 'debug-roles-page.png' });
  });

  test('should test all menu navigation', async ({ page }) => {
    console.log('🔍 Testing menu navigation...');
    
    // Verificar que el menú está visible
    const menuItems = [
      { text: /usuarios|users/i, url: '/users' },
      { text: /mundos|worlds/i, url: '/mundos' },
      { text: /playlists|listas/i, url: '/playlists' },
      { text: /roles|permisos/i, url: '/roles' }
    ];
    
    for (const item of menuItems) {
      console.log(`🔍 Testing navigation to ${item.url}...`);
      
      // Buscar el enlace del menú
      const menuLink = page.getByRole('link', { name: item.text });
      if (await menuLink.isVisible()) {
        await menuLink.click();
        await page.waitForURL(`**${item.url}`);
        await page.waitForLoadState('networkidle');
        
        console.log(`✅ Successfully navigated to ${item.url}`);
      } else {
        console.log(`⚠️ Menu item for ${item.url} not found`);
      }
      
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: 'debug-menu-navigation.png' });
  });
}); 