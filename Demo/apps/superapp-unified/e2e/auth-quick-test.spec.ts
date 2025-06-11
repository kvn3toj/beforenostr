import { test, expect } from '@playwright/test';

test.describe('🔐 Verificación Rápida de Autenticación Real', () => {
  
  test('debe mostrar login cuando no está autenticado (sin mock)', async ({ page }) => {
    // Limpiar cualquier estado previo
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Ir a la página principal
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que NO hay banner mock
    const mockBanner = page.locator('[data-testid="dev-auth-banner"]');
    await expect(mockBanner).not.toBeVisible();
    
    // Verificar que se redirige al login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verificar que el formulario de login está presente
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    console.log('✅ Mock auth desactivado correctamente - muestra login');
  });

  test('debe autenticarse con usuario real del backend', async ({ page }) => {
    // Ir al login
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Usar las credenciales correctas de la SuperApp
    await page.fill('#email', 'test@coomunity.com');
    await page.fill('#password', 'test123');
    
    // Interceptar la llamada de login
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que el login fue exitoso
    await loginResponsePromise;
    
    // Verificar que se redirige al dashboard (no regresa al login)
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    );
    
    // Verificar que hay datos en localStorage
    const userData = await page.evaluate(() => localStorage.getItem('coomunity_user'));
    const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
    
    expect(userData).toBeTruthy();
    expect(token).toBeTruthy();
    
    console.log('✅ Login exitoso con usuario real del backend');
  });

  test('debe mantener la sesión sin regresar al login', async ({ page }) => {
    // Ir al login y autenticarse
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    await page.fill('#email', 'test@coomunity.com');
    await page.fill('#password', 'test123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar autenticación exitosa
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    );
    
    // Esperar un tiempo para simular uso normal
    await page.waitForTimeout(5000);
    
    // Verificar que sigue autenticado (no regresa al login)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Recargar la página
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Verificar que sigue autenticado después del reload
    const finalUrl = page.url();
    expect(finalUrl).not.toContain('/login');
    
    console.log('✅ Sesión persistente - no regresa al login');
  });
}); 