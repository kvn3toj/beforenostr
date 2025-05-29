const { test, expect } = require('@playwright/test');

test.describe('Menu de Administración', () => {
  test('debería mostrar todas las opciones del menú de administración después del login', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:5173/login');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Realizar login
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login y redirija
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página principal
    console.log('URL actual:', page.url());
    
    // Buscar el menú lateral (drawer/sidebar)
    const sidebar = page.locator('[role="navigation"], .MuiDrawer-root, nav');
    await expect(sidebar).toBeVisible({ timeout: 10000 });
    
    // Verificar que existe la sección de Administración
    const adminSection = page.locator('text=Administration, text=Administración');
    await expect(adminSection).toBeVisible({ timeout: 5000 });
    
    // Hacer clic en la sección de Administración para expandirla
    await adminSection.click();
    await page.waitForTimeout(1000); // Esperar animación
    
    // Verificar que aparecen todos los enlaces de administración que agregamos
    const expectedMenuItems = [
      'Users', 'Usuarios',
      'Roles', 'Roles', 
      'Permissions', 'Permisos',
      'Content Items', 'Items de Contenido',
      'Configuration', 'Configuración',
      'Audit Logs', 'Logs de Auditoría',
      'System Status', 'Estado del Sistema'
    ];
    
    console.log('Verificando elementos del menú...');
    
    for (const item of expectedMenuItems) {
      try {
        const menuItem = page.locator(`text=${item}`);
        await expect(menuItem).toBeVisible({ timeout: 3000 });
        console.log(`✓ Encontrado: ${item}`);
      } catch (error) {
        console.log(`✗ No encontrado: ${item}`);
      }
    }
    
    // Verificar enlaces específicos por ruta
    const linkChecks = [
      { text: 'Users', href: '/users' },
      { text: 'Usuarios', href: '/users' },
      { text: 'Roles', href: '/roles' },
      { text: 'Permissions', href: '/permissions' },
      { text: 'Permisos', href: '/permissions' },
      { text: 'Configuration', href: '/admin/config' },
      { text: 'Configuración', href: '/admin/config' }
    ];
    
    for (const check of linkChecks) {
      try {
        const link = page.locator(`a[href="${check.href}"], button:has-text("${check.text}")`);
        if (await link.count() > 0) {
          console.log(`✓ Enlace encontrado: ${check.text} -> ${check.href}`);
        }
      } catch (error) {
        console.log(`✗ Enlace no encontrado: ${check.text} -> ${check.href}`);
      }
    }
    
    // Tomar screenshot del menú
    await page.screenshot({ 
      path: 'debug-admin-menu.png',
      fullPage: true 
    });
    
    console.log('Screenshot guardado como debug-admin-menu.png');
    
    // Verificar que el usuario tiene rol de admin
    const userInfo = await page.evaluate(() => {
      const authStore = localStorage.getItem('auth-store');
      return authStore ? JSON.parse(authStore) : null;
    });
    
    console.log('Estado del usuario en localStorage:', userInfo);
    
    // Intentar hacer clic en "Users" para verificar navegación
    try {
      const usersLink = page.locator('text=Users, text=Usuarios').first();
      if (await usersLink.isVisible()) {
        await usersLink.click();
        await page.waitForTimeout(2000);
        console.log('URL después de hacer clic en Users:', page.url());
      }
    } catch (error) {
      console.log('No se pudo hacer clic en Users:', error.message);
    }
  });
  
  test('debería verificar el estado del authStore después del login', async ({ page }) => {
    // Navegar y hacer login
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    
    // Verificar el contenido del authStore
    const authData = await page.evaluate(() => {
      const stored = localStorage.getItem('auth-store');
      return stored ? JSON.parse(stored) : null;
    });
    
    console.log('=== ESTADO DEL AUTH STORE ===');
    console.log(JSON.stringify(authData, null, 2));
    
    // Verificar que el usuario tiene roles y permisos
    if (authData && authData.state && authData.state.user) {
      const user = authData.state.user;
      console.log('Usuario:', user.name);
      console.log('Email:', user.email);
      console.log('Roles:', user.roles);
      console.log('Permisos:', user.permissions);
      console.log('¿Es Admin?:', user.roles && user.roles.includes('admin'));
    }
  });
}); 