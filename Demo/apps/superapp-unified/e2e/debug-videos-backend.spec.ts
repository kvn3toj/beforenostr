import { test, expect } from '@playwright/test';

test.describe('🔥 DEBUG: Videos del Backend en ÜPlay', () => {
  test('🔍 Verificar logs y datos del backend', async ({ page }) => {
    console.log('🔥 Iniciando test de debugging...');

    // Capturar logs de la consola
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      if (text.includes('🔥 DEBUG') || text.includes('🚧 FORZANDO')) {
        console.log('🔥 [BROWSER LOG]:', text);
      }
    });

    // Ir a la página de ÜPlay
    console.log('🔥 Navegando a /play...');
    await page.goto('/play');

    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });

    // Esperar un poco para que se ejecuten los hooks
    await page.waitForTimeout(5000);

    // Verificar si aparecieron nuestros logs de debugging
    const debugLogs = consoleMessages.filter(msg => 
      msg.includes('🔥 DEBUG UPlayMobileHome') || 
      msg.includes('🚧 FORZANDO isPreviewEnvironment') ||
      msg.includes('🔥 Procesando videos del backend')
    );

    console.log('🔥 Logs de debugging encontrados:', debugLogs.length);
    debugLogs.forEach(log => console.log('  -', log));

    // Verificar que al menos aparecieron nuestros logs
    expect(debugLogs.length).toBeGreaterThan(0);

    // Capturar screenshot para inspección manual
    await page.screenshot({ path: 'test-results/debug-uplay-backend.png', fullPage: true });

    // Buscar cualquier elemento que contenga texto de YouTube o títulos de videos del backend
    const videoTitles = await page.locator('*:has-text("Mecánicas de Recompensa")').count();
    const youtubeTitles = await page.locator('*:has-text("Introducción a la Gamificación")').count();
    const narrativaTitles = await page.locator('*:has-text("Narrativa y Storytelling")').count();
    
    console.log('🔥 Videos encontrados:');
    console.log('  - "Mecánicas de Recompensa":', videoTitles);
    console.log('  - "Introducción a la Gamificación":', youtubeTitles);
    console.log('  - "Narrativa y Storytelling":', narrativaTitles);

    // Al menos uno de estos títulos debería aparecer si los datos del backend se están usando
    const totalBackendVideos = videoTitles + youtubeTitles + narrativaTitles;
    console.log('🔥 Total videos del backend detectados:', totalBackendVideos);

    // Si no hay videos del backend, imprimir información de debug adicional
    if (totalBackendVideos === 0) {
      console.log('⚠️ No se detectaron videos del backend. Información de debug:');
      
      // Verificar qué texto hay en la página
      const pageText = await page.textContent('body');
      console.log('📄 Contenido parcial de la página:', pageText?.substring(0, 500));

      // Verificar si hay algún error
      const errorMessages = consoleMessages.filter(msg => 
        msg.toLowerCase().includes('error') || 
        msg.toLowerCase().includes('failed')
      );
      console.log('❌ Errores en consola:', errorMessages);
    }

    // Para debug - imprimir todos los logs de la consola al final
    console.log('📝 Todos los logs de la consola:');
    consoleMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg}`);
    });
  });
}); 