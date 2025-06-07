import { test, expect } from '@playwright/test';

test.describe('🔍 DEBUG - Verificación Rápida de Autenticación', () => {
  
  test('🔍 Debug página de login y llamadas al backend', async ({ page }) => {
    console.log('🔍 === DEBUGGING LOGIN PAGE ===');
    
    // Capturar todas las llamadas de red
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
      console.log(`🌐 REQUEST: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
      responses.push(`${response.status()} ${response.url()}`);
      console.log(`📡 RESPONSE: ${response.status()} ${response.url()}`);
    });

    // Ir a login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    console.log('📍 URL actual:', page.url());
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'debug-01-login-page.png', fullPage: true });
    
    // Verificar elementos del formulario
    const emailInput = page.locator('[data-testid="login-email-input"]');
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    
    console.log('📝 Campos encontrados:');
    console.log(`- Email input: ${await emailInput.count()}`);
    console.log(`- Password input: ${await passwordInput.count()}`);
    console.log(`- Submit button: ${await submitButton.count()}`);
    
    if (await emailInput.count() > 0) {
      // Llenar formulario
      await emailInput.fill('test@example.com');
      await passwordInput.fill('test123');
      
      console.log('✏️ Formulario llenado con datos de prueba');
      
      // Tomar screenshot con datos
      await page.screenshot({ path: 'debug-02-form-filled.png', fullPage: true });
      
      // Preparar para interceptar respuesta
      const loginPromise = page.waitForResponse(
        response => response.url().includes('/auth/login'),
        { timeout: 10000 }
      ).catch(() => null);
      
      // Hacer click en submit
      console.log('🚀 Haciendo click en submit...');
      await submitButton.click();
      
      // Esperar un poco para ver qué pasa
      await page.waitForTimeout(3000);
      
      // Tomar screenshot después de submit
      await page.screenshot({ path: 'debug-03-after-submit.png', fullPage: true });
      
      // Verificar si hubo llamada al backend
      const loginResponse = await loginPromise;
      
      if (loginResponse) {
        console.log(`✅ Login response detectada: ${loginResponse.status()}`);
        const responseBody = await loginResponse.text();
        console.log(`📄 Response body: ${responseBody.substring(0, 200)}...`);
      } else {
        console.log('❌ No se detectó llamada a /auth/login');
      }
      
      // Verificar errores en consola
      const logs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
          console.log(`🚨 CONSOLE ERROR: ${msg.text()}`);
        }
      });
      
    }
    
    console.log('\n📊 RESUMEN DE LLAMADAS:');
    console.log('Requests:', requests.filter(r => r.includes('3002')));
    console.log('Responses:', responses.filter(r => r.includes('3002')));
    
    // Verificar variables de entorno en la página
    const envVars = await page.evaluate(() => {
      return {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_ENABLE_MOCK_AUTH: import.meta.env.VITE_ENABLE_MOCK_AUTH,
        DEV: import.meta.env.DEV
      };
    });
    
    console.log('\n🔧 VARIABLES DE ENTORNO EN EL FRONTEND:');
    console.log(JSON.stringify(envVars, null, 2));
  });
}); 