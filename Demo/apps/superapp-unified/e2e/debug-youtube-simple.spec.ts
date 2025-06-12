import { test, expect } from '@playwright/test';

test.describe('🔍 DEBUG SIMPLE: Logs del Navegador', () => {
  test('🔧 Capturar logs de la función isPreviewEnvironment', async ({ page }) => {
    console.log('🔍 Iniciando captura de logs...');

    // Capturar TODOS los logs de la consola
    const allLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      allLogs.push(text);
      // Imprimir inmediatamente los logs importantes
      if (text.includes('🔧') || text.includes('✅') || text.includes('ACTIVANDO') || text.includes('VITE_FORCE')) {
        console.log('🎯 [BROWSER]:', text);
      }
    });

    // Ir directamente a ÜPlay
    console.log('🔍 Navegando a /uplay...');
    await page.goto('/uplay');

    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un poco más para asegurar que se ejecuten todos los hooks
    await page.waitForTimeout(8000);

    // Filtrar solo los logs relevantes
    const debugLogs = allLogs.filter(log => 
      log.includes('🔧 isPreviewEnvironment') || 
      log.includes('✅ ACTIVANDO modo YouTube') ||
      log.includes('VITE_FORCE_YOUTUBE_VIDEOS')
    );

    console.log('\n📊 RESUMEN DE LOGS CAPTURADOS:');
    console.log(`Total logs: ${allLogs.length}`);
    console.log(`Debug logs relevantes: ${debugLogs.length}`);
    
    if (debugLogs.length > 0) {
      console.log('\n🔧 LOGS DE DEBUG ENCONTRADOS:');
      debugLogs.forEach((log, index) => {
        console.log(`  ${index + 1}. ${log}`);
      });
    } else {
      console.log('\n⚠️ NO SE ENCONTRARON LOGS DE DEBUG');
      console.log('Primeros 10 logs capturados:');
      allLogs.slice(0, 10).forEach((log, index) => {
        console.log(`  ${index + 1}. ${log}`);
      });
    }

    // Verificar que al menos detectamos algo
    expect(allLogs.length).toBeGreaterThan(0);

    // Capturar screenshot
    await page.screenshot({ 
      path: 'test-results/debug-youtube-simple.png',
      fullPage: true 
    });

    console.log('✅ Test de debugging completado');
  });
}); 