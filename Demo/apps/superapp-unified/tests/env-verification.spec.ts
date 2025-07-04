import { test, expect } from '@playwright/test';

test.describe('🔧 VERIFICACIÓN DE VARIABLES DE ENTORNO', () => {
  test('🌐 Variables de entorno se cargan correctamente', async ({ page }) => {
    console.log('🔧 === VERIFICANDO VARIABLES DE ENTORNO ===');

    // 1. Navegar a la página de login donde se muestran las variables de desarrollo
    console.log('📍 Navegando a /login...');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // 2. Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Página de login cargada');

    // 3. Verificar que el texto de desarrollo está visible
    const developmentInfo = page.locator('text=Desarrollo:');
    await expect(developmentInfo).toBeVisible({ timeout: 5000 });
    console.log('✅ Sección de desarrollo encontrada');

    // 4. Capturar el texto completo de la sección de desarrollo
    const fullDevelopmentText = await page.locator('[data-testid="development-info"], text=Desarrollo:').locator('..').textContent();
    console.log('📋 Texto de desarrollo:', fullDevelopmentText);

    // 5. Verificar variables específicas
    const backendUrl = page.locator('text=/Backend:.*http:\/\/localhost:\d+/');
    await expect(backendUrl).toBeVisible({ timeout: 5000 });
    
    const backendUrlText = await backendUrl.textContent();
    console.log('🌐 Backend URL detectada:', backendUrlText);

    // 6. Verificar que es el puerto correcto (3002)
    expect(backendUrlText).toContain('3002');
    console.log('✅ Backend URL apunta al puerto correcto (3002)');

    // 7. Verificar Mock Auth
    const mockAuthStatus = page.locator('text=/Mock Auth:.*Deshabilitado/');
    await expect(mockAuthStatus).toBeVisible({ timeout: 5000 });
    console.log('✅ Mock Auth está deshabilitado');

    // 8. Verificar Status
    const realBackendStatus = page.locator('text=/Status:.*Backend Real/');
    await expect(realBackendStatus).toBeVisible({ timeout: 5000 });
    console.log('✅ Status indica Backend Real NestJS');

    // 9. Screenshot para documentación
    await page.screenshot({ 
      path: 'debug-env-verification.png', 
      fullPage: true 
    });

    console.log('🎉 Verificación de variables de entorno completada exitosamente');
  });

  test('🔌 Test de conexión real al backend', async ({ page }) => {
    console.log('🔌 === VERIFICANDO CONEXIÓN AL BACKEND ===');

    // Configurar interceptor para monitorear llamadas
    const apiCalls: string[] = [];
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('/auth/') || url.includes(':3002')) {
        apiCalls.push(`${route.request().method()} ${url}`);
        console.log(`🌐 API Call detected: ${route.request().method()} ${url}`);
      }
      route.continue();
    });

    // Navegar a login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Llenar y enviar formulario de login
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('admin@coomunity.com');
    await passwordInput.fill('admin123');
    await loginButton.click();

    // Esperar a que se haga la llamada
    await page.waitForTimeout(3000);

    console.log('📋 Llamadas API detectadas:', apiCalls);

    // Verificar que se hizo al menos una llamada al backend correcto
    const backendCalls = apiCalls.filter(call => call.includes('localhost:3002'));
    
    if (backendCalls.length > 0) {
      console.log('✅ Llamadas al backend NestJS detectadas:', backendCalls);
    } else {
      console.log('❌ No se detectaron llamadas al backend NestJS');
      console.log('🔍 Todas las llamadas:', apiCalls);
    }

    expect(backendCalls.length).toBeGreaterThan(0);
  });
}); 