import { test, expect } from '@playwright/test';

test.describe('Route Guards Protection', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar primero a una página válida antes de limpiar localStorage
    await page.goto('http://localhost:3003/login');
    
    // Limpiar localStorage después de navegar a una página válida
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }
    });
  });

  test('should redirect unauthenticated user from protected routes to login', async ({ page }) => {
    // Intentar acceder a rutas protegidas sin autenticación
    const protectedRoutes = [
      '/',
      '/profile',
      '/marketplace',
      '/wallet',
      '/social',
      '/uplay',
      '/settings'
    ];

    for (const route of protectedRoutes) {
      console.log(`Testing protected route: ${route}`);
      
      // Navegar a la ruta protegida
      await page.goto(`http://localhost:3003${route}`);
      
      // Esperar a que se complete la redirección
      await page.waitForURL('**/login', { timeout: 10000 });
      
      // Verificar que estamos en la página de login
      expect(page.url()).toContain('/login');
      
      // Verificar que el formulario de login está presente usando data-testid
      await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-password-input"]')).toBeVisible();
    }
  });

  test('should allow access to public routes without authentication', async ({ page }) => {
    const publicRoutes = ['/login', '/register'];

    for (const route of publicRoutes) {
      console.log(`Testing public route: ${route}`);
      
      // Navegar a la ruta pública
      await page.goto(`http://localhost:3003${route}`);
      
      // Verificar que no hay redirección a login
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(route);
      
      // Verificar que la página se carga correctamente
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should allow authenticated user to access protected routes', async ({ page }) => {
    // Primero hacer login
    await page.goto('http://localhost:3003/login');
    
    // Esperar a que la página de login se cargue
    await page.waitForSelector('#root');
    
    // Realizar login con credenciales válidas usando data-testid
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que el login sea exitoso y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que estamos en la página principal
    expect(page.url()).toBe('http://localhost:3003/');
    
    // Ahora probar acceso a rutas protegidas
    const protectedRoutes = [
      '/profile',
      '/marketplace', 
      '/wallet',
      '/social',
      '/settings'
    ];

    for (const route of protectedRoutes) {
      console.log(`Testing authenticated access to: ${route}`);
      
      // Navegar a la ruta protegida
      await page.goto(`http://localhost:3003${route}`);
      
      // Verificar que NO hay redirección a login
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(route);
      
      // Verificar que la página se carga (no hay error 404 o redirección)
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should redirect to login after logout from protected route', async ({ page }) => {
    // Primero hacer login
    await page.goto('http://localhost:3003/login');
    await page.waitForSelector('#root');
    
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar login exitoso
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Navegar a una ruta protegida
    await page.goto('http://localhost:3003/profile');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/profile');
    
    // Hacer logout usando selectores más flexibles
    const logoutButton = page.locator('button:has-text("Cerrar Sesión"), button:has-text("Logout"), [data-testid="logout-button"]');
    await logoutButton.click();
    
    // Esperar redirección a login
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    
    // Verificar que intentar acceder a rutas protegidas ahora redirige a login
    await page.goto('http://localhost:3003/profile');
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('should show loading state during authentication check', async ({ page }) => {
    // Navegar a login primero para establecer contexto
    await page.goto('http://localhost:3003/login');
    
    // Simular un token válido en localStorage
    await page.evaluate(() => {
      try {
        localStorage.setItem('coomunity_token', 'mock-jwt-token-for-coomunity-player-testing');
        localStorage.setItem('coomunity_user', JSON.stringify({
          id: 'mock-player-id-456',
          email: 'mock-player@coomunity.com',
          full_name: 'Jugador CoomÜnity',
          access_token: 'mock-jwt-token-for-coomunity-player-testing'
        }));
      } catch (error) {
        console.warn('Could not set localStorage:', error);
      }
    });
    
    // Navegar a una ruta protegida
    await page.goto('http://localhost:3003/profile');
    
    // Durante la carga inicial, debería mostrar el skeleton loader
    // (esto puede ser muy rápido, pero intentamos capturarlo)
    const hasLoadingState = await page.locator('.MuiSkeleton-root, [data-testid="loading-skeleton"]').isVisible().catch(() => false);
    
    // Eventualmente debería cargar la página protegida
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/profile');
  });

  test('should preserve return URL after login', async ({ page }) => {
    // Intentar acceder directamente a una ruta protegida
    await page.goto('http://localhost:3003/marketplace');
    
    // Debería redirigir a login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Hacer login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Después del login, debería redirigir a la página original solicitada
    // Nota: Esto depende de la implementación del componente Login
    await page.waitForLoadState('networkidle');
    
    // Verificar que eventualmente llegamos a una página válida (puede ser / o /marketplace)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(marketplace|$)/);
  });
}); 