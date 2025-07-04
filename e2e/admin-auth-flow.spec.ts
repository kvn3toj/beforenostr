import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola y de página
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      console.error('Page error:', error.message);
    });
  });

  test('should complete admin login flow successfully', async ({ page }) => {
    // FASE 1: Navegar explícitamente a la página de login
    await page.goto('/login');
    
    // FASE 2: Verificar que la página de login cargó correctamente
    await expect(page.getByRole('heading', { name: /login|iniciar sesión/i })).toBeVisible();
    
    // FASE 3: Llenar credenciales del administrador
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // FASE 4: Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // FASE 5: Esperar la redirección a la página principal
    await page.waitForURL('**/');
    
    // FASE 6: Verificar que el dashboard principal se cargó (más específico)
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
  });

  test('should access admin dashboard after authentication', async ({ page }) => {
    // Flujo de autenticación completo
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
    
    // Verificar elementos del dashboard
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Usuarios')).toBeVisible();
    await expect(page.getByText('Contenido')).toBeVisible();
  });

  test('should navigate to users page from authenticated state', async ({ page }) => {
    // Flujo de autenticación completo
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
    
    // Navegar a la página de usuarios
    await page.goto('/users');
    await expect(page.getByText('Gestión de Usuarios')).toBeVisible();
  });

  test('should handle authentication errors correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Intentar login con credenciales incorrectas
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verificar que aparezca mensaje de error
    await expect(page.getByText(/error|incorrect|invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should identify specific console errors from wireframe resources', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.error('🔴 Console error:', msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
        console.warn('🟡 Console warning:', msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
      console.error('🔴 Page error:', error.message);
    });

    // Ejecutar flujo completo de autenticación
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
    
    // Esperar un momento para que se capturen todos los errores
    await page.waitForTimeout(2000);
    
    // Reportar errores encontrados
    console.log('\n📊 RESUMEN DE ERRORES:');
    console.log('Total errores:', errors.length);
    console.log('Total warnings:', warnings.length);
    
    if (errors.length > 0) {
      console.log('\n🔴 ERRORES ENCONTRADOS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n🟡 WARNINGS ENCONTRADOS:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    // No fallar el test - solo reportar información
    console.log('\n✅ Test completado - revisa los errores reportados arriba');
  });
}); 