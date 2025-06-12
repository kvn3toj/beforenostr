import { test, expect } from '@playwright/test';

test.describe('🔍 DEBUG: Flujo Completo de Autenticación', () => {
  test('🔐 Verificar paso a paso qué pasa después del login', async ({ page }) => {
    console.log('🔍 Iniciando debug completo del flujo de auth...');

    // Capturar logs importantes
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Auth') || text.includes('signIn') || text.includes('login') || text.includes('checkAuth')) {
        console.log(`🎯 [AUTH LOG]:`, text);
      }
    });

    // Ir a login
    console.log('📍 1. Navegando a /login...');
    await page.goto('/login');
    await page.waitForSelector('[data-testid="login-email-input"]');

    // Verificar localStorage inicial
    const initialStorage = await page.evaluate(() => ({
      user: localStorage.getItem('coomunity_user'),
      token: localStorage.getItem('coomunity_token'),
    }));
    console.log('🗄️ 2. localStorage inicial:', initialStorage);

    // Hacer login
    console.log('🔐 3. Enviando formulario de login...');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar respuesta de login
    const loginResponse = await page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );

    console.log('✅ 4. Login response recibida:', loginResponse.status());
    const loginData = await loginResponse.json();
    console.log('📦 5. Login data:', {
      hasToken: !!loginData.access_token,
      hasUser: !!loginData.user,
      userEmail: loginData.user?.email,
    });

    // Esperar un momento para que React procese
    await page.waitForTimeout(2000);

    // Verificar localStorage después del login
    const postLoginStorage = await page.evaluate(() => ({
      user: localStorage.getItem('coomunity_user'),
      token: localStorage.getItem('coomunity_token'),
    }));
    console.log('🗄️ 6. localStorage después del login:', {
      hasUser: !!postLoginStorage.user,
      hasToken: !!postLoginStorage.token,
      userParsed: postLoginStorage.user ? JSON.parse(postLoginStorage.user) : null,
    });

    // Verificar la URL actual
    const currentUrl = page.url();
    console.log('📍 7. URL actual:', currentUrl);
    
    // Verificar si sigue en login o se redirigió
    const isStillInLogin = currentUrl.includes('/login');
    console.log('🔄 8. ¿Sigue en login?:', isStillInLogin);

    if (isStillInLogin) {
      console.log('❌ PROBLEMA: Usuario no fue redirigido después del login exitoso');
      
      // Verificar si hay errores en la página
      const errorElements = await page.locator('[role="alert"], .error, .alert-error').count();
      console.log('🚨 9. Elementos de error encontrados:', errorElements);

      if (errorElements > 0) {
        const errorText = await page.locator('[role="alert"], .error, .alert-error').first().textContent();
        console.log('📝 10. Texto del error:', errorText);
      }

      // Forzar navegación manual a /uplay para probar
      console.log('🔄 11. Intentando navegación manual a /uplay...');
      await page.goto('/uplay');
      await page.waitForTimeout(3000);
      
      const uplayUrl = page.url();
      console.log('📍 12. URL después de navegación manual:', uplayUrl);
      
      if (uplayUrl.includes('/login')) {
        console.log('❌ PROBLEMA CONFIRMADO: Incluso navegación manual regresa a login');
        
        // Verificar el estado de autenticación en React
        const authState = await page.evaluate(() => {
          // Intentar acceder al contexto de React (puede no funcionar)
          return {
            storageUser: localStorage.getItem('coomunity_user'),
            storageToken: localStorage.getItem('coomunity_token'),
            windowLocation: window.location.href,
          };
        });
        console.log('🔍 13. Estado de autenticación final:', authState);
      } else {
        console.log('✅ ÉXITO: Navegación manual a /uplay funcionó');
      }
    } else {
      console.log('✅ ÉXITO: Usuario fue redirigido correctamente');
    }

    // Tomar screenshot para evidencia
    await page.screenshot({ path: 'playwright-report/debug-auth-flow.png', fullPage: true });
    console.log('📸 Screenshot guardado');

    // El test siempre pasa para ver los logs
    expect(true).toBe(true);
  });
}); 