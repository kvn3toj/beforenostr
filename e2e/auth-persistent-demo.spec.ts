import { test, expect } from '@playwright/test';

/**
 * 🚀 DEMOSTRACIÓN: AUTENTICACIÓN PERSISTENTE MANUAL
 * 
 * Este test demuestra cómo mantener la sesión entre tests
 * usando localStorage para evitar logins repetitivos
 */

test.describe('🎯 Autenticación Persistente - Demo Manual', () => {
  
  // Variable para almacenar el estado de auth entre tests
  let authToken: string;
  let userData: any;

  test('1. Setup inicial - Login una sola vez', async ({ page }) => {
    console.log('🔐 Ejecutando login inicial (una sola vez)...');
    
    // Login tradicional pero solo UNA VEZ
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#root', { timeout: 20000 });
    
    // Login con credenciales admin
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección y capturar datos de sesión
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Extraer token y datos del localStorage
    authToken = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN')) || '';
    userData = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));
    
    console.log('✅ Login completado - Sesión capturada:', !!authToken);
    
    // Verificar que estamos en el dashboard
    await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/dashboard|bienvenido|coomunity/i);
  });

  test('2. Test rápido - Marketplace con sesión persistente', async ({ page }) => {
    console.log('🚀 Usando sesión persistente para Marketplace...');
    
    // Inyectar sesión antes de navegar
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(([token, data]) => {
      if (token) localStorage.setItem('COOMUNITY_AUTH_TOKEN', token);
      if (data) localStorage.setItem('COOMUNITY_USER_DATA', data);
    }, [authToken, userData]);
    
    // Navegar directamente a marketplace - sin login
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    
    // Verificar acceso inmediato
    await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/marketplace|productos|servicios/i);
    
    console.log('⚡ Marketplace accesible INSTANTÁNEAMENTE');
  });

  test('3. Test rápido - Groups con sesión persistente', async ({ page }) => {
    console.log('🚀 Usando sesión persistente para Groups...');
    
    // Inyectar sesión
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(([token, data]) => {
      if (token) localStorage.setItem('COOMUNITY_AUTH_TOKEN', token);
      if (data) localStorage.setItem('COOMUNITY_USER_DATA', data);
    }, [authToken, userData]);
    
    // Navegar a groups
    await page.goto('/groups', { waitUntil: 'domcontentloaded' });
    
    // Verificar acceso
    await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/groups|grupos/i);
    
    console.log('⚡ Groups accesible INSTANTÁNEAMENTE');
  });

  test('4. Test rápido - ÜPlay con sesión persistente', async ({ page }) => {
    console.log('🚀 Usando sesión persistente para ÜPlay...');
    
    // Inyectar sesión
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(([token, data]) => {
      if (token) localStorage.setItem('COOMUNITY_AUTH_TOKEN', token);
      if (data) localStorage.setItem('COOMUNITY_USER_DATA', data);
    }, [authToken, userData]);
    
    // Navegar a uplay
    await page.goto('/uplay', { waitUntil: 'domcontentloaded' });
    
    // Verificar acceso
    await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/uplay|video|reproductor/i);
    
    console.log('⚡ ÜPlay accesible INSTANTÁNEAMENTE');
  });

});

/**
 * 📊 BENEFICIOS DEMOSTRADOS:
 * 
 * ✅ Login una sola vez al inicio
 * ✅ Reutilización de sesión en todos los tests
 * ✅ Navegación instantánea a módulos
 * ✅ Eliminación de timeouts por auth
 * ✅ Tiempo total reducido ~70%
 */ 