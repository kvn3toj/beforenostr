import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Esperar a que el formulario de login esté visible
    await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 10000 });
  });

  test('should login successfully with user credentials', async ({ page }) => {
    console.log('🧪 Testing login with user credentials...');
    
    // Llenar el formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la URL cambie (redirección después del login exitoso)
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que estamos en la página principal
    expect(page.url()).toMatch(/\/$/);
    
    console.log('✅ User login successful');
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    console.log('🧪 Testing login with admin credentials...');
    
    // Llenar el formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la URL cambie (redirección después del login exitoso)
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que estamos en la página principal
    expect(page.url()).toMatch(/\/$/);
    
    console.log('✅ Admin login successful');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    console.log('🧪 Testing login with invalid credentials...');
    
    // Llenar el formulario con credenciales incorrectas
    await page.fill('[data-testid="login-email-input"] input', 'invalid@example.com');
    await page.fill('[data-testid="login-password-input"] input', 'wrongpassword');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que aparezca un mensaje de error
    await page.waitForSelector('text=/credenciales incorrectas|unauthorized|invalid/i', { timeout: 10000 });
    
    // Verificar que seguimos en la página de login
    expect(page.url()).toContain('/login');
    
    console.log('✅ Invalid credentials properly rejected');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    console.log('🧪 Testing network error handling...');
    
    // Interceptar la petición de login para simular un error de red
    await page.route('**/auth/login', route => {
      route.abort('failed');
    });
    
    // Llenar el formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que aparezca un mensaje de error de conexión
    await page.waitForSelector('text=/error de conexión|network|servidor/i', { timeout: 10000 });
    
    // Verificar que seguimos en la página de login
    expect(page.url()).toContain('/login');
    
    console.log('✅ Network error handled gracefully');
  });
}); 