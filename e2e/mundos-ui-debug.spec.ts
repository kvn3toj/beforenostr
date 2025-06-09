import { test, expect } from '@playwright/test';

test.describe('Mundos UI Debug - Verificación Manual', () => {
  test('should debug mundos page and network calls', async ({ page }) => {
    console.log('🔍 [DEBUG] Iniciando debug de página de Mundos...');
    
    // Interceptar todas las llamadas de red para debugging
    const networkCalls: Array<{ url: string; method: string; status?: number; response?: any }> = [];
    
    page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      console.log(`📡 [REQUEST] ${method} ${url}`);
      networkCalls.push({ url, method });
    });
    
    page.on('response', async (response) => {
      const url = response.url();
      const status = response.status();
      console.log(`📨 [RESPONSE] ${status} ${url}`);
      
      // Capturar respuestas del backend (puerto 3002)
      if (url.includes('3002')) {
        try {
          const responseData = await response.json();
          console.log(`📊 [DATA] Respuesta de ${url}:`, responseData);
          
          // Actualizar el registro de llamadas de red
          const callIndex = networkCalls.findIndex(call => call.url === url);
          if (callIndex !== -1) {
            networkCalls[callIndex].status = status;
            networkCalls[callIndex].response = responseData;
          }
        } catch (error) {
          console.log(`⚠️ [DATA] No se pudo parsear respuesta de ${url}:`, error.message);
        }
      }
    });
    
    // Interceptar errores de consola
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ [CONSOLE ERROR] ${msg.text()}`);
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'log' && msg.text().includes('[Mundos]')) {
        console.log(`📝 [MUNDOS LOG] ${msg.text()}`);
      }
    });
    
    // Navegar a la página principal primero
    console.log('🏠 [DEBUG] Navegando a página principal...');
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    // Navegar a la página de Mundos
    console.log('🌍 [DEBUG] Navegando a página de Mundos...');
    await page.goto('/mundos');
    await page.waitForSelector('#root');
    
    // Esperar a que se cargue completamente
    await page.waitForTimeout(5000);
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*\/mundos/);
    console.log('✅ [DEBUG] Navegación a /mundos exitosa');
    
    // Buscar elementos de la página
    console.log('🔍 [DEBUG] Analizando elementos de la página...');
    
    // Verificar si hay un título de página
    const pageTitle = page.locator('h1, h2, h3, h4').first();
    const titleText = await pageTitle.textContent();
    console.log(`📄 [DEBUG] Título de página: "${titleText}"`);
    
    // Verificar si hay una tabla o lista de mundos
    const tableRows = page.locator('tr, .MuiCard-root, [data-testid*="mundo"]');
    const rowCount = await tableRows.count();
    console.log(`📊 [DEBUG] Elementos de mundos encontrados: ${rowCount}`);
    
    // Verificar si hay indicadores de carga
    const loadingIndicators = page.locator('[data-testid*="loading"], .MuiCircularProgress-root, text=/cargando/i');
    const loadingCount = await loadingIndicators.count();
    console.log(`⏳ [DEBUG] Indicadores de carga: ${loadingCount}`);
    
    // Verificar si hay mensajes de error
    const errorMessages = page.locator('text=/error|fallo|problema/i');
    const errorCount = await errorMessages.count();
    console.log(`❌ [DEBUG] Mensajes de error visibles: ${errorCount}`);
    
    // Verificar si hay datos específicos de mundos
    const mundoDesarrollo = page.locator('text=Mundo de Desarrollo Profesional');
    const hasMundoDesarrollo = await mundoDesarrollo.isVisible();
    console.log(`🎯 [DEBUG] "Mundo de Desarrollo Profesional" visible: ${hasMundoDesarrollo}`);
    
    // Buscar cualquier texto que contenga "mundo"
    const mundoTexts = page.locator('text=/mundo/i');
    const mundoTextCount = await mundoTexts.count();
    console.log(`🌍 [DEBUG] Textos que contienen "mundo": ${mundoTextCount}`);
    
    // Esperar un poco más para capturar todas las llamadas de red
    await page.waitForTimeout(3000);
    
    // Resumen de llamadas de red
    console.log('\n📊 [DEBUG] RESUMEN DE LLAMADAS DE RED:');
    console.log(`Total de llamadas: ${networkCalls.length}`);
    
    const backendCalls = networkCalls.filter(call => call.url.includes('3002'));
    console.log(`Llamadas al backend (3002): ${backendCalls.length}`);
    
    const mundosCalls = networkCalls.filter(call => call.url.includes('/mundos'));
    console.log(`Llamadas a /mundos: ${mundosCalls.length}`);
    
    // Mostrar detalles de llamadas importantes
    backendCalls.forEach((call, index) => {
      console.log(`  ${index + 1}. ${call.method} ${call.url} - Status: ${call.status || 'pending'}`);
      if (call.response && call.url.includes('/mundos')) {
        console.log(`     Datos: ${JSON.stringify(call.response).substring(0, 200)}...`);
      }
    });
    
    // Resumen de errores de consola
    if (consoleErrors.length > 0) {
      console.log('\n❌ [DEBUG] ERRORES DE CONSOLA:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Tomar screenshot para análisis visual
    await page.screenshot({ path: 'test-results/mundos-debug-screenshot.png', fullPage: true });
    console.log('📸 [DEBUG] Screenshot guardado en test-results/mundos-debug-screenshot.png');
    
    // Verificaciones básicas
    expect(networkCalls.length).toBeGreaterThan(0);
    console.log('✅ [DEBUG] Al menos se realizaron algunas llamadas de red');
    
    // Si hay llamadas a /mundos, verificar que sean exitosas
    if (mundosCalls.length > 0) {
      const successfulMundosCalls = mundosCalls.filter(call => call.status && call.status >= 200 && call.status < 300);
      console.log(`✅ [DEBUG] Llamadas exitosas a /mundos: ${successfulMundosCalls.length}/${mundosCalls.length}`);
    } else {
      console.log('⚠️ [DEBUG] No se detectaron llamadas a /mundos - PROBLEMA IDENTIFICADO');
    }
    
    console.log('🎉 [DEBUG] Debug de página de Mundos completado');
  });
}); 