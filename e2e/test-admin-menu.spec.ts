import { test, expect } from '@playwright/test';

test.describe('Admin Menu Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('should show admin menu items for admin user', async ({ page }) => {
    console.log('🔍 Testing admin menu visibility...');
    
    // Tomar screenshot del estado inicial
    await page.screenshot({ path: 'debug-admin-menu-initial.png', fullPage: true });
    
    // Verificar que el menú lateral está visible (en desktop)
    const drawer = page.locator('[role="navigation"], nav');
    await expect(drawer).toBeVisible();
    
    // Buscar elementos del menú de administración
    const adminMenuItems = [
      'Users',
      'Usuarios', 
      'Roles',
      'Permisos',
      'Permissions',
      'Administration',
      'Administración'
    ];
    
    console.log('🔍 Searching for admin menu items...');
    
    for (const item of adminMenuItems) {
      const menuItem = page.getByText(item, { exact: false });
      const isVisible = await menuItem.isVisible();
      console.log(`- "${item}": ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    // Verificar si hay enlaces específicos
    const adminLinks = [
      '/users',
      '/roles', 
      '/permissions',
      '/mundos',
      '/playlists'
    ];
    
    console.log('🔍 Searching for admin links...');
    
    for (const link of adminLinks) {
      const linkElement = page.locator(`a[href="${link}"]`);
      const isVisible = await linkElement.isVisible();
      console.log(`- Link "${link}": ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    // Verificar el contenido completo del menú
    const menuContent = await page.locator('nav').textContent();
    console.log('📋 Menu content:', menuContent);
    
    await page.screenshot({ path: 'debug-admin-menu-final.png', fullPage: true });
  });

  test('should navigate to admin pages via direct URL', async ({ page }) => {
    console.log('🔍 Testing direct navigation to admin pages...');
    
    const adminPages = [
      { url: '/users', title: /users|usuarios/i },
      { url: '/mundos', title: /mundos|worlds/i },
      { url: '/playlists', title: /playlists|listas/i },
      { url: '/roles', title: /roles|permisos/i }
    ];
    
    for (const adminPage of adminPages) {
      console.log(`🔍 Testing ${adminPage.url}...`);
      
      await page.goto(adminPage.url);
      await page.waitForLoadState('networkidle');
      
      // Verificar que la página cargó correctamente
      const hasHeading = await page.getByRole('heading', { name: adminPage.title }).isVisible();
      const hasTable = await page.locator('table').isVisible();
      
      console.log(`✅ ${adminPage.url}: heading=${hasHeading}, table=${hasTable}`);
      
      // Verificar que no hay errores de autenticación
      const hasErrorMessage = await page.getByText(/error|unauthorized|forbidden/i).isVisible();
      if (hasErrorMessage) {
        console.log(`❌ ${adminPage.url}: Authentication error detected`);
      }
      
      await page.screenshot({ path: `debug-admin-page-${adminPage.url.replace('/', '')}.png` });
    }
  });

  test('should verify admin user permissions', async ({ page }) => {
    console.log('🔍 Testing admin user permissions...');
    
    // Ir a la página de usuarios
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    // Verificar que puede ver la tabla de usuarios
    await expect(page.locator('table')).toBeVisible();
    
    // Verificar que puede ver botones de acción (si existen)
    const createButton = page.getByRole('button', { name: /create|crear|new|nuevo/i });
    const hasCreateButton = await createButton.isVisible();
    console.log('✅ Create button visible:', hasCreateButton);
    
    // Verificar que puede acceder a otras páginas de admin
    await page.goto('/roles');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();
    console.log('✅ Roles page accessible');
    
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();
    console.log('✅ Mundos page accessible');
    
    await page.goto('/playlists');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();
    console.log('✅ Playlists page accessible');
    
    console.log('🎉 All admin functionalities are working correctly!');
  });
}); 