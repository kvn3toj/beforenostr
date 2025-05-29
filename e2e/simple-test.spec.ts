import { test, expect } from '@playwright/test';

test.describe('Simple System Test', () => {
  test('should load the login page', async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.error('Browser page error:', error.message);
    });

    // Navegar a la página de login
    await page.goto('/login');
    
    // Verificar que la página de login se carga usando selectores más específicos
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should successfully login and reach dashboard', async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.error('Browser page error:', error.message);
    });

    // Navegar a la página de login
    await page.goto('/login');
    
    // Verificar conectividad del backend desde el navegador
    const backendTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3002/health');
        const data = await response.json();
        return { success: true, status: response.status, data };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('Backend connectivity test:', backendTest);
    
    // Llenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Hacer clic en login
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    
    // Verificar que llegamos al dashboard
    await expect(page.getByText('Welcome to Gamifier Admin')).toBeVisible();
  });

  test('should access profile page after login', async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.error('Browser page error:', error.message);
    });

    // Login primero
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Ahora ir a la página de perfil
    await page.goto('/profile');
    
    // Verificar que la página de perfil se carga
    await expect(page.getByText('Mi Perfil')).toBeVisible();
  });
}); 