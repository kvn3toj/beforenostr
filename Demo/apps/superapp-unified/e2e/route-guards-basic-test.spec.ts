import { test, expect } from '@playwright/test';

test.describe('Route Guards - Basic Test', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Navegar a la página de login primero para limpiar el estado
    await page.goto('http://localhost:3003/login');
    
    // Limpiar localStorage
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }
    });
    
    // Intentar acceder a la página principal (ruta protegida)
    await page.goto('http://localhost:3003/');
    
    // Esperar a que se complete la redirección
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verificar que estamos en la página de login
    expect(page.url()).toContain('/login');
    
    console.log('✅ Redirección funcionando: Usuario no autenticado redirigido a /login');
  });

  test('should allow access to login page without authentication', async ({ page }) => {
    // Navegar directamente a login
    await page.goto('http://localhost:3003/login');
    
    // Verificar que no hay redirección
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
    
    // Verificar que la página se carga
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Acceso a página pública funcionando: /login accesible sin autenticación');
  });

  test('should protect profile route', async ({ page }) => {
    // Navegar a login primero para limpiar estado
    await page.goto('http://localhost:3003/login');
    
    // Limpiar localStorage
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }
    });
    
    // Intentar acceder a perfil (ruta protegida)
    await page.goto('http://localhost:3003/profile');
    
    // Esperar redirección a login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verificar que estamos en login
    expect(page.url()).toContain('/login');
    
    console.log('✅ Protección de ruta funcionando: /profile redirige a /login');
  });

  test('should protect marketplace route', async ({ page }) => {
    // Navegar a login primero para limpiar estado
    await page.goto('http://localhost:3003/login');
    
    // Limpiar localStorage
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }
    });
    
    // Intentar acceder a marketplace (ruta protegida)
    await page.goto('http://localhost:3003/marketplace');
    
    // Esperar redirección a login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verificar que estamos en login
    expect(page.url()).toContain('/login');
    
    console.log('✅ Protección de ruta funcionando: /marketplace redirige a /login');
  });
}); 