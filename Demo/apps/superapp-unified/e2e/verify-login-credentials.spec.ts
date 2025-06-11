import { test, expect } from '@playwright/test';

test.describe('🔐 Verificación de Credenciales en Login', () => {
  
  test('debe mostrar las credenciales correctas de la SuperApp', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Verificar que los campos estén prellenados con las credenciales correctas
    const emailValue = await page.locator('#email').inputValue();
    const passwordValue = await page.locator('#password').inputValue();
    
    expect(emailValue).toBe('test@coomunity.com');
    expect(passwordValue).toBe('test123');
    
    console.log('✅ Campos prellenados con credenciales correctas de SuperApp');
    
    // Verificar que las credenciales en la información de desarrollo sean correctas
    const devInfo = page.locator('text=📋 Credenciales válidas:');
    await expect(devInfo).toBeVisible();
    
    // Verificar que aparece la credencial específica de SuperApp
    await expect(page.locator('text=test@coomunity.com / test123')).toBeVisible();
    
    // Verificar que aparece la aclaración sobre las diferencias
    await expect(page.locator('text=Para SuperApp CoomÜnity usar estas credenciales')).toBeVisible();
    await expect(page.locator('text=Diferentes del Gamifier Admin')).toBeVisible();
    
    console.log('✅ Información de desarrollo actualizada correctamente');
    
    // Verificar que NO aparecen las credenciales del Gamifier Admin
    await expect(page.locator('text=admin@gamifier.com')).not.toBeVisible();
    await expect(page.locator('text=user@gamifier.com')).not.toBeVisible();
    
    console.log('✅ Credenciales del Gamifier Admin eliminadas correctamente');
  });

  test('debe mostrar el estado correcto sin mock auth', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Verificar que muestra "Backend Real NestJS" y no modo mock
    await expect(page.locator('text=✅ Backend Real NestJS')).toBeVisible();
    await expect(page.locator('text=Deshabilitado')).toBeVisible(); // Mock Auth
    
    // Verificar que NO aparece modo mock
    await expect(page.locator('text=🔶 Modo Mock')).not.toBeVisible();
    await expect(page.locator('text=Habilitado')).not.toBeVisible();
    
    console.log('✅ Estado de desarrollo correcto mostrado');
  });
  
  test('puede hacer login exitoso con las nuevas credenciales', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Las credenciales ya deberían estar prellenadas, solo hacer clic en login
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que el login fue exitoso
    await loginResponsePromise;
    
    // Verificar que se redirige y no regresa al login
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    );
    
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    console.log('✅ Login exitoso con credenciales de SuperApp');
  });
}); 