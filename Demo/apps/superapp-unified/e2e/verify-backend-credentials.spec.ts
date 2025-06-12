import { test, expect } from '@playwright/test';

test.describe('🔐 Verificación de Credenciales Backend NestJS', () => {
  
  test('debe usar credenciales correctas del backend NestJS', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Verificar que los campos estén prellenados con las credenciales correctas del backend
    const emailValue = await page.locator('#email').inputValue();
    const passwordValue = await page.locator('#password').inputValue();
    
    expect(emailValue).toBe('test@coomunity.com');
    expect(passwordValue).toBe('test123');
    
    console.log('✅ Campos prellenados con credenciales correctas del Backend NestJS');
    
    // Verificar que las credenciales en la información de desarrollo sean correctas
    const devInfo = page.locator('text=📋 Credenciales válidas:');
    await expect(devInfo).toBeVisible();
    
    // Verificar que aparece la credencial específica del Backend NestJS
    await expect(page.locator('text=test@coomunity.com / test123')).toBeVisible();
    
    // Verificar que aparece la aclaración sobre el Backend NestJS
    await expect(page.locator('text=Usuario jugador del Backend NestJS')).toBeVisible();
    await expect(page.locator('text=Usuario real del sistema CoomÜnity')).toBeVisible();
    
    console.log('✅ Información de desarrollo actualizada correctamente para Backend NestJS');
    
    // Verificar que NO aparecen las credenciales incorrectas de Admin
    await expect(page.locator('text=admin@gamifier.com')).not.toBeVisible();
    await expect(page.locator('text=admin123')).not.toBeVisible();
    
    console.log('✅ Credenciales incorrectas de Admin eliminadas correctamente');
  });

  test('debe conectar exitosamente con el backend NestJS', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Usar las credenciales prellenadas (que ahora son correctas)
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que el login fue exitoso
    const loginResponse = await loginResponsePromise;
    const responseBody = await loginResponse.json();
    
    expect(responseBody.access_token).toBeTruthy();
    expect(responseBody.user.email).toBe('test@coomunity.com');
    
    console.log('✅ Login exitoso con Backend NestJS usando credenciales correctas');
    
    // Verificar que se redirige correctamente
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    );
    
    // Verificar que hay datos en localStorage
    const userData = await page.evaluate(() => localStorage.getItem('coomunity_user'));
    const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
    
    expect(userData).toBeTruthy();
    expect(token).toBeTruthy();
    
    console.log('✅ Datos de usuario y token almacenados correctamente');
  });
}); 