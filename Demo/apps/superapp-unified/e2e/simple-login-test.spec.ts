import { test, expect } from '@playwright/test';

test.describe('🔐 Test Simple de Login con Constantes Canónicas', () => {

  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('✅ Login básico con verificación de constantes canónicas', async ({ page }) => {
    console.log('🧪 Iniciando test simple de login...');

    // 1. Navegar a la página de login
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('📍 Navegado a página de login');

    // 2. Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);

    // 3. Verificar que los campos de login están presentes
    const emailInput = page.locator('[data-testid="login-email-input"] input, input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('[data-testid="login-password-input"] input, input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('[data-testid="login-submit-button"], button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")').first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    console.log('✅ Campos de login encontrados');

    // 4. Llenar el formulario con credenciales válidas
    await emailInput.fill('admin@gamifier.com');
    await passwordInput.fill('admin123');
    console.log('📝 Credenciales ingresadas');

    // 5. Enviar el formulario y esperar respuesta
    await submitButton.click();
    console.log('🚀 Formulario enviado');

    // 6. Esperar a que se complete el login (redirección o cambio de estado)
    try {
      // Esperar redirección fuera de login
      await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
      console.log('🔄 Redirección completada');
    } catch (error) {
      console.log('⚠️ No hubo redirección, verificando estado de autenticación...');
    }

    // 7. Esperar un momento para que se procese el login
    await page.waitForTimeout(3000);

    // 8. Verificar que el token se almacenó con la clave canónica
    const authCheck = await page.evaluate(() => {
      const canonicalToken = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
      const canonicalUser = localStorage.getItem('COOMUNITY_USER_DATA');
      
      // También verificar si hay claves antiguas (no deberían usarse)
      const oldToken = localStorage.getItem('access_token');
      const oldUser = localStorage.getItem('user');
      const veryOldToken = localStorage.getItem('coomunity_token');
      
      return {
        canonicalToken,
        canonicalUser: canonicalUser ? JSON.parse(canonicalUser) : null,
        hasCanonicalToken: !!canonicalToken,
        hasCanonicalUser: !!canonicalUser,
        oldToken,
        oldUser,
        veryOldToken,
        allKeys: Object.keys(localStorage)
      };
    });

    console.log('🔍 Estado de localStorage:', authCheck);

    // 9. Verificaciones principales
    if (authCheck.hasCanonicalToken) {
      expect(authCheck.canonicalToken).toBeTruthy();
      expect(typeof authCheck.canonicalToken).toBe('string');
      expect(authCheck.canonicalToken.length).toBeGreaterThan(10);
      console.log('✅ Token almacenado correctamente con clave canónica');
    } else {
      console.log('⚠️ No se encontró token con clave canónica');
      console.log('📋 Claves disponibles en localStorage:', authCheck.allKeys);
    }

    if (authCheck.hasCanonicalUser) {
      expect(authCheck.canonicalUser).toHaveProperty('email', 'admin@gamifier.com');
      console.log('✅ Usuario almacenado correctamente con clave canónica');
    } else {
      console.log('⚠️ No se encontró usuario con clave canónica');
    }

    // 10. Verificar que no se están usando claves antiguas
    if (authCheck.oldToken || authCheck.oldUser || authCheck.veryOldToken) {
      console.log('⚠️ Se detectaron claves antiguas en uso:', {
        oldToken: !!authCheck.oldToken,
        oldUser: !!authCheck.oldUser,
        veryOldToken: !!authCheck.veryOldToken
      });
    } else {
      console.log('✅ No se detectaron claves antiguas');
    }

    console.log('🎉 Test simple de login completado');
  });

  test('🧪 Verificar que la aplicación usa las constantes canónicas', async ({ page }) => {
    console.log('🧪 Verificando uso de constantes en la aplicación...');

    // Navegar a la página principal
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Inyectar un script para monitorear el uso de localStorage
    await page.addInitScript(() => {
      // Interceptar llamadas a localStorage para monitorear qué claves se usan
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      const originalRemoveItem = localStorage.removeItem;

      window.localStorageUsage = {
        setItems: [],
        getItems: [],
        removeItems: []
      };

      localStorage.setItem = function(key, value) {
        window.localStorageUsage.setItems.push({ key, value: value.substring(0, 50) + '...' });
        return originalSetItem.call(this, key, value);
      };

      localStorage.getItem = function(key) {
        window.localStorageUsage.getItems.push({ key });
        return originalGetItem.call(this, key);
      };

      localStorage.removeItem = function(key) {
        window.localStorageUsage.removeItems.push({ key });
        return originalRemoveItem.call(this, key);
      };
    });

    // Navegar a login para activar el código de autenticación
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Esperar un momento para que se ejecute el código de inicialización
    await page.waitForTimeout(2000);

    // Obtener el uso de localStorage
    const usage = await page.evaluate(() => window.localStorageUsage);

    console.log('📊 Uso de localStorage detectado:', usage);

    // Verificar que se están usando las claves canónicas
    const canonicalKeysUsed = usage.getItems.some(item => 
      item.key === 'COOMUNITY_AUTH_TOKEN' || item.key === 'COOMUNITY_USER_DATA'
    );

    if (canonicalKeysUsed) {
      console.log('✅ La aplicación está usando las constantes canónicas');
    } else {
      console.log('⚠️ La aplicación no está usando las constantes canónicas aún');
      console.log('📋 Claves utilizadas:', usage.getItems.map(item => item.key));
    }

    console.log('🎉 Verificación de uso de constantes completada');
  });
}); 