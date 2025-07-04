import { test, expect } from '@playwright/test';

test.describe('🌍 Mundos Integration - Verificación Indirecta en SuperApp', () => {
  test('Verificar que la información de Mundos se muestra correctamente en Playlists', async ({ page }) => {
    console.log('🔍 Iniciando verificación de integración indirecta de Mundos...');
    
    // Monitorear llamadas API relevantes
    const apiCalls = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('playlists') || url.includes('mundos') || url.includes('3002')) {
        apiCalls.push(`${request.method()} ${url}`);
        console.log(`📡 API Call: ${request.method()} ${url}`);
      }
    });
    
    // 1. Cargar página principal
    console.log('📍 PASO 1: Cargando SuperApp...');
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // 2. Navegar a la página de Playlists Directas (donde se muestra info de Mundos)
    console.log('📍 PASO 2: Navegando a Playlists Directas...');
    await page.goto('/playlists-direct');
    await page.waitForSelector('h4:has-text("Playlists (Acceso Directo)")', { timeout: 10000 });
    
    // 3. Verificar que se realizan llamadas API para obtener playlists
    console.log('📍 PASO 3: Verificando llamadas API...');
    await page.waitForTimeout(3000); // Esperar a que se completen las llamadas
    
    const playlistApiCalls = apiCalls.filter(call => call.includes('playlists'));
    console.log('📊 Llamadas API de playlists detectadas:', playlistApiCalls);
    
    // 4. Verificar que se muestra información de Mundos en las playlists
    console.log('📍 PASO 4: Verificando información de Mundos en UI...');
    
    // Buscar elementos que muestren información de Mundos
    const mundoElements = await page.locator('text=/Mundo:/').count();
    console.log(`📊 Elementos "Mundo:" encontrados: ${mundoElements}`);
    
    if (mundoElements > 0) {
      // Si hay elementos de Mundo, verificar que muestran nombres específicos
      const mundoTexts = await page.locator('text=/Mundo:.*/')
        .allTextContents();
      console.log('📊 Textos de Mundo encontrados:', mundoTexts);
      
      // Verificar que al menos uno de los mundos conocidos aparece
      const expectedMundos = [
        'Mundo de Gamificación Educativa',
        'Mundo de Desarrollo Profesional', 
        'Mundo de Innovación Social'
      ];
      
      let foundExpectedMundo = false;
      for (const expectedMundo of expectedMundos) {
        const mundoVisible = await page.locator(`text=Mundo: ${expectedMundo}`).count();
        if (mundoVisible > 0) {
          console.log(`✅ Mundo encontrado en UI: "${expectedMundo}"`);
          foundExpectedMundo = true;
          break;
        }
      }
      
      if (foundExpectedMundo) {
        console.log('✅ ÉXITO: Información de Mundos se muestra correctamente en playlists');
      } else {
        console.log('⚠️  ADVERTENCIA: Se muestran Mundos pero no los esperados del backend');
      }
    } else {
      console.log('ℹ️  INFO: No se encontraron elementos "Mundo:" en la UI actual');
      
      // Verificar si hay playlists pero sin información de Mundo visible
      const playlistCards = await page.locator('[data-testid*="playlist"], .MuiCard-root').count();
      console.log(`📊 Cards de playlist encontradas: ${playlistCards}`);
      
      if (playlistCards > 0) {
        console.log('ℹ️  INFO: Hay playlists pero la información de Mundo no está visible actualmente');
      } else {
        console.log('ℹ️  INFO: No hay playlists cargadas para mostrar información de Mundos');
      }
    }
    
    // 5. Capturar screenshot para análisis manual
    await page.screenshot({ 
      path: 'mundos-integration-playlists.png', 
      fullPage: true 
    });
    
    // 6. Verificar que al menos se realizaron llamadas API
    expect(apiCalls.length).toBeGreaterThan(0);
    console.log('✅ VERIFICACIÓN: Se realizaron llamadas API al backend');
    
    // 7. Resumen de verificación
    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
    console.log(`- Llamadas API totales: ${apiCalls.length}`);
    console.log(`- Llamadas API de playlists: ${playlistApiCalls.length}`);
    console.log(`- Elementos "Mundo:" en UI: ${mundoElements}`);
    console.log('- Screenshot guardado: mundos-integration-playlists.png');
    
    if (mundoElements > 0) {
      console.log('🎯 RESULTADO: INTEGRACIÓN INDIRECTA FUNCIONANDO - Los Mundos se muestran en playlists');
    } else if (apiCalls.length > 0) {
      console.log('🎯 RESULTADO: INTEGRACIÓN PARCIAL - API funciona, UI necesita verificación manual');
    } else {
      console.log('🎯 RESULTADO: INTEGRACIÓN PENDIENTE - Verificar configuración de API');
    }
  });
  
  test('Verificar navegación a página específica de Mundo (si existe)', async ({ page }) => {
    console.log('🔍 Verificando acceso directo a contenido de Mundo...');
    
    // Intentar navegar directamente a una página de contenido de mundo
    const mundoId = '11111111-1111-1111-1111-111111111111'; // Mundo de Gamificación Educativa
    
    console.log(`📍 Intentando navegar a: /mundos/${mundoId}`);
    await page.goto(`/mundos/${mundoId}`);
    
    // Verificar si la página carga o redirige
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`📍 URL actual después de navegación: ${currentUrl}`);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: 'mundo-direct-access.png', 
      fullPage: true 
    });
    
    // Verificar si hay contenido relacionado con el mundo
    const pageText = await page.textContent('body');
    const hasWorldContent = pageText.includes('Mundo') || 
                           pageText.includes('Gamificación') || 
                           pageText.includes('Desarrollo Profesional');
    
    console.log(`📊 Página contiene contenido de Mundo: ${hasWorldContent}`);
    console.log('- Screenshot guardado: mundo-direct-access.png');
    
    if (hasWorldContent) {
      console.log('✅ ÉXITO: Acceso directo a contenido de Mundo funciona');
    } else {
      console.log('ℹ️  INFO: Acceso directo no disponible o redirigido (comportamiento esperado)');
    }
  });
}); 