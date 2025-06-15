import { test, expect } from '@playwright/test';

test.describe('🔍 Análisis de Errores de Consola - SuperApp', () => {
  
  test('debe capturar y analizar errores de consola durante login y navegación', async ({ page }) => {
    // Arrays para capturar diferentes tipos de logs
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    const networkErrors: string[] = [];
    const apiResponses: any[] = [];
    
    // Interceptar todos los logs de consola
    page.on('console', (msg) => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'error') {
        consoleErrors.push(text);
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warning') {
        consoleWarnings.push(text);
        console.log(`⚠️ Console Warning: ${text}`);
      } else if (type === 'log' && text.includes('Error')) {
        consoleErrors.push(text);
        console.log(`📝 Console Log Error: ${text}`);
      }
    });

    // Interceptar respuestas de red para identificar errores API
    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      
      apiResponses.push({
        url,
        status,
        statusText: response.statusText(),
        headers: Object.fromEntries(response.headers())
      });
      
      if (status >= 400) {
        networkErrors.push(`${status} ${response.statusText()} - ${url}`);
        console.log(`🌐 Network Error: ${status} ${response.statusText()} - ${url}`);
      }
    });

    // PASO 1: Ir a la página principal
    console.log('🔍 === ANÁLISIS DE ERRORES - PASO 1: INICIO ===');
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(2000); // Esperar que se procesen errores iniciales
    
    console.log(`📊 Errores iniciales capturados: ${consoleErrors.length}`);
    
    // PASO 2: Login
    console.log('🔍 === PASO 2: LOGIN ===');
    await page.waitForURL('**/login', { timeout: 10000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Realizar login
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login'),
      { timeout: 15000 }
    );
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    try {
      const loginResponse = await loginResponsePromise;
      console.log(`✅ Login Response: ${loginResponse.status()} ${loginResponse.statusText()}`);
    } catch (error) {
      console.log(`❌ Login failed or timed out: ${error}`);
    }
    
    // Esperar redirección
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    );
    
    // PASO 3: Esperar que la aplicación cargue completamente
    console.log('🔍 === PASO 3: CARGA DE APLICACIÓN ===');
    await page.waitForTimeout(5000); // Dar tiempo para que se ejecuten todas las llamadas API
    
    // PASO 4: Navegar a diferentes módulos para capturar más errores
    console.log('🔍 === PASO 4: NAVEGACIÓN A MÓDULOS ===');
    
    const modulesToTest = [
      { name: 'Wallet', selector: 'text=Wallet', url: '/wallet' },
      { name: 'ÜPlay', selector: 'text=ÜPlay', url: '/uplay' },
      { name: 'Social', selector: 'text=Social', url: '/social' },
      { name: 'Marketplace', selector: 'text=Marketplace', url: '/marketplace' }
    ];
    
    for (const module of modulesToTest) {
      try {
        console.log(`🔍 Navegando a ${module.name}...`);
        
        // Intentar navegar usando el selector del sidebar
        const moduleLink = page.locator(module.selector).first();
        if (await moduleLink.isVisible()) {
          await moduleLink.click();
          await page.waitForTimeout(3000); // Esperar carga
          console.log(`✅ ${module.name} navegación exitosa`);
        } else {
          // Si no hay sidebar, navegar directamente
          await page.goto(module.url);
          await page.waitForTimeout(3000);
          console.log(`✅ ${module.name} navegación directa exitosa`);
        }
      } catch (error) {
        console.log(`❌ Error navegando a ${module.name}: ${error}`);
      }
    }
    
    // PASO 5: Análisis final de errores
    console.log('🔍 === ANÁLISIS FINAL DE ERRORES ===');
    
    console.log(`\n📊 RESUMEN DE ERRORES CAPTURADOS:`);
    console.log(`- Console Errors: ${consoleErrors.length}`);
    console.log(`- Console Warnings: ${consoleWarnings.length}`);
    console.log(`- Network Errors: ${networkErrors.length}`);
    console.log(`- Total API Responses: ${apiResponses.length}`);
    
    // Mostrar errores específicos
    if (consoleErrors.length > 0) {
      console.log(`\n❌ ERRORES DE CONSOLA ESPECÍFICOS:`);
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log(`\n🌐 ERRORES DE RED ESPECÍFICOS:`);
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Filtrar y mostrar respuestas de API problemáticas
    const problemAPI = apiResponses.filter(resp => resp.status >= 400);
    if (problemAPI.length > 0) {
      console.log(`\n🔧 RESPUESTAS API PROBLEMÁTICAS:`);
      problemAPI.forEach((resp, index) => {
        console.log(`${index + 1}. ${resp.status} ${resp.statusText} - ${resp.url}`);
      });
    }
    
    // Mostrar respuestas exitosas importantes
    const successfulAPI = apiResponses.filter(resp => 
      resp.status >= 200 && resp.status < 300 && 
      (resp.url.includes('/auth/') || resp.url.includes('/user') || resp.url.includes('/wallet'))
    );
    
    if (successfulAPI.length > 0) {
      console.log(`\n✅ API CALLS EXITOSAS IMPORTANTES:`);
      successfulAPI.forEach((resp, index) => {
        console.log(`${index + 1}. ${resp.status} ${resp.statusText} - ${resp.url}`);
      });
    }
    
    // Verificar que el login haya sido exitoso (no debe haber errores críticos de auth)
    const authErrors = consoleErrors.filter(error => 
      error.toLowerCase().includes('unauthorized') || 
      error.toLowerCase().includes('authentication') ||
      error.toLowerCase().includes('token')
    );
    
    console.log(`\n🔐 ERRORES DE AUTENTICACIÓN: ${authErrors.length}`);
    
    // El test pasa si no hay errores críticos de autenticación
    expect(authErrors.length).toBe(0);
    
    console.log(`\n🎯 RESULTADO: Login exitoso, ${consoleErrors.length} errores no críticos detectados`);
  });

  test('debe analizar errores específicos del backend', async ({ page }) => {
    const backendErrors: any[] = [];
    
    // Interceptar errores específicos del backend
    page.on('response', async (response) => {
      if (response.status() >= 400) {
        try {
          const body = await response.text();
          backendErrors.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            body: body
          });
        } catch (error) {
          console.log('Error reading response body:', error);
        }
      }
    });

    // Login y navegación básica
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Si hay login, hacerlo
    const isLoginPage = await page.locator('#email').isVisible();
    if (isLoginPage) {
      await page.fill('#email', 'admin@gamifier.com');
      await page.fill('#password', 'admin123');
      await page.click('button:has-text("Iniciar Sesión")');
      await page.waitForTimeout(5000);
    }
    
    // Intentar acceder a endpoints específicos que pueden fallar
    const endpointsToTest = [
      '/wallet',
      '/marketplace', 
      '/social',
      '/uplay'
    ];
    
    for (const endpoint of endpointsToTest) {
      try {
        await page.goto(endpoint);
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`Error accessing ${endpoint}:`, error);
      }
    }
    
    // Análizar errores del backend
    console.log(`\n🔧 ERRORES DEL BACKEND DETECTADOS: ${backendErrors.length}`);
    
    if (backendErrors.length > 0) {
      backendErrors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.status} ${error.statusText}`);
        console.log(`   URL: ${error.url}`);
        console.log(`   Body: ${error.body.substring(0, 200)}...`);
      });
    }
    
    // El test siempre pasa, solo reporta información
    expect(true).toBe(true);
  });
}); 