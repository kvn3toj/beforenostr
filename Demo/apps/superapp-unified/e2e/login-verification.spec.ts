import { test, expect } from '@playwright/test';

test.describe('Login Verification - Backend Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    console.log('🧪 Testing login with backend integration...');
    
    // Llenar el formulario de login con credenciales de JUGADOR (no admin)
    // La SuperApp es para usuarios finales, no administradores
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que el login se complete y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que estamos en la página principal
    await expect(page).toHaveURL('/');
    
    // Verificar que el usuario está autenticado (buscar elementos que solo aparecen cuando está logueado)
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Login successful - user authenticated');
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    console.log('🧪 Testing login with invalid credentials...');
    
    // Llenar el formulario con credenciales inválidas
    await page.fill('[data-testid="login-email-input"] input', 'invalid@example.com');
    await page.fill('[data-testid="login-password-input"] input', 'wrongpassword');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que aparezca un mensaje de error
    await expect(page.locator('text=Credenciales incorrectas')).toBeVisible({ timeout: 10000 });
    
    // Verificar que seguimos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    
    console.log('✅ Invalid credentials handled correctly');
  });

  test('should validate email format', async ({ page }) => {
    console.log('🧪 Testing email validation...');
    
    // Llenar el formulario con email inválido
    await page.fill('[data-testid="login-email-input"] input', 'invalid-email');
    await page.fill('[data-testid="login-password-input"] input', 'somepassword');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Verificar que aparece un mensaje de validación de email
    await expect(page.locator('text=email válido')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Email validation working correctly');
  });

  test('should handle backend connection errors', async ({ page }) => {
    console.log('🧪 Testing backend connection error handling...');
    
    // Interceptar las peticiones al backend y simular un error de red
    await page.route('**/auth/login', route => {
      route.abort('failed');
    });
    
    // Llenar el formulario con credenciales válidas de JUGADOR
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que aparezca un mensaje de error de conexión
    await expect(page.locator('text=Error de conexión')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Backend connection error handled correctly');
  });
}); 