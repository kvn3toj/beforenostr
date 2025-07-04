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
    
    // Verificar que el formulario de login está presente usando data-testid robustos
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    
    console.log('✅ Mock auth desactivado correctamente - muestra login');
  });

  test('debe autenticarse con usuario real del backend', async ({ page }) => {
    // Ir al login
    await page.goto('/login');
    
    // Esperar a que el formulario esté completamente cargado
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    
    // Usar las credenciales correctas del backend NestJS con selectores robustos
    // Para Material UI TextField, necesitamos acceder al input dentro del componente
    await page.locator('[data-testid="login-email-input"] input').fill('user@gamifier.com');
    await page.locator('[data-testid="login-password-input"] input').fill('123456');
    
    // Configurar la espera de la respuesta de login ANTES de hacer clic
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && (response.status() === 200 || response.status() === 201),
      { timeout: 15000 }
    );
    
    // Hacer clic en el botón de submit usando data-testid
    await page.getByTestId('login-submit-button').click();
    
    // Esperar a que la llamada de login se complete exitosamente
    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(200); // Backend NestJS devuelve 200 para login exitoso
    
    // Esperar a que la URL cambie (redirección post-login) - ser más flexible
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 15000 }
    );
    
    // Verificar que hay datos en localStorage usando las claves correctas del AuthContext
    const userData = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    const token = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    
    expect(userData).toBeTruthy();
    expect(token).toBeTruthy();
    
    console.log('✅ Login exitoso con usuario real del backend');
  });

  test('debe mantener la sesión sin regresar al login', async ({ page }) => {
    // Ir al login y autenticarse
    await page.goto('/login');
    
    // Esperar a que el formulario esté completamente cargado
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    
    // Llenar credenciales usando selectores robustos
    // Para Material UI TextField, necesitamos acceder al input dentro del componente
    await page.locator('[data-testid="login-email-input"] input').fill('user@gamifier.com');
    await page.locator('[data-testid="login-password-input"] input').fill('123456');
    
    // Configurar espera de respuesta de login
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && (response.status() === 200 || response.status() === 201),
      { timeout: 15000 }
    );
    
    // Hacer clic en submit
    await page.getByTestId('login-submit-button').click();
    
    // Esperar autenticación exitosa
    await loginResponsePromise;
    
    // Esperar a que la URL cambie (redirección post-login) - ser más flexible
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 15000 }
    );
    
    // Verificar que está en la página principal (no en login)
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 5000 }
    );
    
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Recargar la página para probar persistencia de sesión
    await page.reload();
    
    // Esperar a que la página se recargue completamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que sigue autenticado después del reload (no redirige a login)
    // Dar tiempo para cualquier redirección automática
    await page.waitForTimeout(3000);
    
    const finalUrl = page.url();
    expect(finalUrl).not.toContain('/login');
    
    // Verificar que los datos de sesión siguen en localStorage usando las claves correctas
    const userData = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    const token = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
    
    expect(userData).toBeTruthy();
    expect(token).toBeTruthy();
    
    console.log('✅ Sesión persistente - no regresa al login');
  });
}); 