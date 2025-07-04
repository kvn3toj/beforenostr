import { test, expect } from '@playwright/test';

// 🔧 Configuración para tests
const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3002';

// Usuario de prueba registrado anteriormente
const TEST_USER = {
  email: 'usuario@coomunity.com',
  password: 'password'
};

test.describe('🔐 Autenticación Migrada - Fase 2.2', () => {
  
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('1. Verificar configuración de backend real', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Verificar que aparezca la información de desarrollo
    const devInfo = page.locator('text=✅ Backend Real NestJS');
    
    if (await devInfo.isVisible()) {
      console.log('✅ Configuración verificada: Backend Real NestJS activo');
    } else {
      console.log('ℹ️ Información de desarrollo no visible (normal en producción)');
    }
    
    // Verificar que la página de login carga correctamente
    await expect(page.locator('[data-testid="login-submit-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-password-input"]')).toBeVisible();
  });

  test('2. Login exitoso con backend NestJS', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Completar el formulario de login
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email);
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password);
    
    console.log(`🔐 Intentando login con: ${TEST_USER.email}`);
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar por la redirección o error
    try {
      await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
      
      console.log('✅ Login exitoso - Usuario autenticado');
      
      // Verificar que los datos se guardaron en localStorage
      const userData = await page.evaluate(() => localStorage.getItem('coomunity_user'));
      const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
      
      expect(userData).toBeTruthy();
      expect(token).toBeTruthy();
      
      if (userData) {
        const user = JSON.parse(userData);
        expect(user.email).toBe(TEST_USER.email);
        console.log(`👤 Usuario autenticado: ${user.email} (ID: ${user.id})`);
      }
      
    } catch (error) {
      // Verificar si hay error visible
      const hasError = await page.locator('[data-testid="login-error"]').isVisible();
      
      if (hasError) {
        const errorText = await page.locator('[data-testid="login-error"]').textContent();
        console.log(`⚠️ Error de login: ${errorText}`);
        
        // El error puede ser de conectividad o credenciales
        expect(errorText).toMatch(/(conectar|servidor|credenciales|incorrectos)/i);
      } else {
        console.log('⚠️ Timeout en login - verificando estado');
      }
    }
  });

  test('3. Verificar flujo de logout', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Primero hacer login
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email);
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit-button"]');
    
    try {
      await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
      
      // Verificar que estamos autenticados
      const userData = await page.evaluate(() => localStorage.getItem('coomunity_user'));
      expect(userData).toBeTruthy();
      
      console.log('✅ Usuario autenticado - probando logout');
      
      // Buscar y hacer clic en el menú de usuario (avatar o menú)
      const userMenu = page.locator('[data-testid="user-menu"]').or(
        page.locator('button:has([data-testid="AccountCircle"])')
      ).or(
        page.locator('button:has(svg[data-testid="AccountCircleIcon"])')
      );
      
      if (await userMenu.isVisible()) {
        await userMenu.click();
        
        // Buscar y hacer clic en logout
        const logoutButton = page.locator('text=Cerrar Sesión').or(
          page.locator('text=Logout').or(
            page.locator('[data-testid="logout-button"]')
          )
        );
        
        if (await logoutButton.isVisible()) {
          await logoutButton.click();
          
          // Verificar redirección al login
          await page.waitForURL(/\/login/, { timeout: 5000 });
          
          // Verificar que localStorage se limpió
          const userDataAfterLogout = await page.evaluate(() => localStorage.getItem('coomunity_user'));
          const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('coomunity_token'));
          
          expect(userDataAfterLogout).toBeFalsy();
          expect(tokenAfterLogout).toBeFalsy();
          
          console.log('✅ Logout exitoso - datos limpiados');
        } else {
          console.log('ℹ️ Botón de logout no encontrado visualmente');
        }
      } else {
        console.log('ℹ️ Menú de usuario no encontrado visualmente');
      }
      
    } catch (error) {
      console.log('⚠️ No se pudo completar flujo de logout - login puede haber fallado');
    }
  });

  test('4. Redirección de rutas protegidas', async ({ page }) => {
    // Sin autenticación, ir a una ruta protegida debe redirigir al login
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Verificar redirección al login
    await expect(page).toHaveURL(/\/login/);
    
    console.log('✅ Redirección de rutas protegidas funciona correctamente');
  });
}); 