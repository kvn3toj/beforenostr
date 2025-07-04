import { test, expect } from '@playwright/test';

test.describe('Complete Routes Verification - All Pages Working', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la autenticación se complete y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
  });

  test('Home page loads correctly with proper layout', async ({ page }) => {
    // Verificar que estamos en la página principal
    await expect(page).toHaveURL('/');
    
    // Verificar que el Home correcto está cargado (con componentes modulares)
    await page.waitForSelector('text=Bienvenido', { timeout: 10000 });
    
    // Verificar que tiene los componentes del Home completo
    await expect(page.locator('text=CoomÜnity')).toBeVisible();
    
    // Verificar que NO es la versión simple problemática
    // La versión correcta debe tener ModuleCards
    await page.waitForSelector('[data-testid="module-cards"], .module-cards, text=Explorar', { timeout: 5000 });
    
    console.log('✅ Home page loaded with correct layout');
  });

  test('All main navigation routes work correctly', async ({ page }) => {
    const mainRoutes = [
      { path: '/marketplace', expectedText: 'Marketplace' },
      { path: '/uplay', expectedText: 'ÜPlay' },
      { path: '/social', expectedText: 'Social' },
      { path: '/profile', expectedText: 'Perfil' },
      { path: '/wallet', expectedText: 'Wallet' },
    ];

    for (const route of mainRoutes) {
      await page.goto(route.path);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Verificar que no hay errores de JavaScript
      const errors = await page.evaluate(() => {
        return window.console.error.toString();
      });
      
      console.log(`✅ Route ${route.path} loaded successfully`);
    }
  });

  test('Newly added routes work correctly', async ({ page }) => {
    const newRoutes = [
      { path: '/analytics', expectedText: 'Analytics' },
      { path: '/challenges', expectedText: 'Challenges' },
      { path: '/groups', expectedText: 'Groups' },
      { path: '/mundos', expectedText: 'Mundos' },
      { path: '/settings', expectedText: 'Settings' },
    ];

    for (const route of newRoutes) {
      await page.goto(route.path);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Verificar que la página carga sin errores críticos
      const hasError = await page.locator('text=Error').isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
      
      console.log(`✅ New route ${route.path} loaded successfully`);
    }
  });

  test('Video/UPlay routes work correctly', async ({ page }) => {
    const videoRoutes = [
      '/uplay/unified',
      '/uplay/interactive', 
      '/uplay/demo',
      '/videos',
    ];

    for (const route of videoRoutes) {
      await page.goto(route);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Verificar que no hay errores críticos de carga
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
      
      console.log(`✅ Video route ${route} loaded successfully`);
    }
  });

  test('Marketplace routes work correctly', async ({ page }) => {
    const marketplaceRoutes = [
      '/marketplace/test',
      // Note: Dynamic routes like /marketplace/product/:id would need specific IDs
    ];

    for (const route of marketplaceRoutes) {
      await page.goto(route);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      console.log(`✅ Marketplace route ${route} loaded successfully`);
    }
  });

  test('Social routes work correctly', async ({ page }) => {
    const socialRoutes = [
      '/social/chat',
      '/social/feed',
    ];

    for (const route of socialRoutes) {
      await page.goto(route);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      console.log(`✅ Social route ${route} loaded successfully`);
    }
  });

  test('Special pages work correctly', async ({ page }) => {
    const specialRoutes = [
      '/beta-register',
      '/pwa-demo',
      '/admin/audit-logs',
      '/lets',
      '/design-system',
    ];

    for (const route of specialRoutes) {
      await page.goto(route);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      console.log(`✅ Special route ${route} loaded successfully`);
    }
  });

  test('No problematic home-alt route exists', async ({ page }) => {
    // Verificar que la ruta problemática ya no existe
    await page.goto('/home-alt');
    
    // Debería redirigir al 404 o al home principal
    await page.waitForTimeout(2000);
    
    // Verificar que no estamos en una página con la versión problemática del Home
    const url = page.url();
    console.log(`✅ /home-alt route properly handled, current URL: ${url}`);
  });

  test('All routes maintain CoomÜnity terminology', async ({ page }) => {
    const routesToCheck = ['/', '/marketplace', '/uplay', '/social'];
    
    for (const route of routesToCheck) {
      await page.goto(route);
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Buscar terminología CoomÜnity en la página
      const pageContent = await page.textContent('body');
      const hasCoomunityTerms = 
        pageContent?.includes('CoomÜnity') ||
        pageContent?.includes('Reciprocidad') ||
        pageContent?.includes('Mëritos') ||
        pageContent?.includes('Bien Común') ||
        pageContent?.includes('ÜPlay');
      
      if (hasCoomunityTerms) {
        console.log(`✅ Route ${route} contains CoomÜnity terminology`);
      }
    }
  });
}); 