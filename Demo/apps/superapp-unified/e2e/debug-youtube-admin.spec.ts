import { test, expect } from '@playwright/test';

test.describe('🔐 DEBUG con Credenciales de ADMIN', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔐 Iniciando login con credenciales de ADMIN...');
    
    // Capturar logs de navegador para debugging
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('🔧') || text.includes('✅') || text.includes('🚧') || text.includes('isPreviewEnvironment')) {
        console.log('🎯 [BROWSER]:', text);
      }
    });
    
    // Login con usuario admin del backend NestJS
    await page.goto('/login');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    console.log('📧 Llenando email de admin...');
    await page.fill('[data-testid="login-email-input"]', 'admin@gamifier.com');
    
    console.log('🔒 Llenando password de admin...');
    await page.fill('[data-testid="login-password-input"]', 'admin123');
    
    console.log('🚀 Haciendo clic en el botón de login...');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección exitosa
    console.log('⏳ Esperando redirección después del login...');
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root');
    console.log('✅ Login de admin completado exitosamente');
  });

  test('🎬 Verificar videos de YouTube con permisos de ADMIN', async ({ page }) => {
    console.log('🎯 Iniciando test con permisos de ADMIN...');

    // Capturar TODOS los logs de la consola
    const allLogs: string[] = [];
    const errorLogs: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      allLogs.push(text);
      
      if (msg.type() === 'error') {
        errorLogs.push(text);
        console.log('❌ [BROWSER ERROR]:', text);
      }
      
      // Logs importantes
      if (text.includes('🔧') || text.includes('✅') || text.includes('🎬') || text.includes('VITE_FORCE') || text.includes('isPreviewEnvironment') || text.includes('ACTIVANDO')) {
        console.log('🎯 [ADMIN BROWSER]:', text);
      }
    });

    // Navegar a ÜPlay
    console.log('🎬 Navegando a /uplay con permisos de admin...');
    await page.goto('/uplay');

    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar más tiempo para que se ejecuten todos los hooks
    await page.waitForTimeout(10000);

    // Buscar elementos específicos de YouTube
    const youtubeIframes = await page.locator('iframe[src*="youtube.com"]').count();
    const youtubeEmbeds = await page.locator('iframe[src*="embed"]').count();
    const previewIndicators = await page.locator('text=/Modo Preview.*YouTube/').count();
    
    console.log('\n📊 RESULTADOS CON ADMIN:');
    console.log(`  YouTube iframes: ${youtubeIframes}`);
    console.log(`  YouTube embeds: ${youtubeEmbeds}`);
    console.log(`  Preview indicators: ${previewIndicators}`);
    console.log(`  Total logs capturados: ${allLogs.length}`);
    console.log(`  Errores detectados: ${errorLogs.length}`);

    // Filtrar logs específicos de debugging
    const debugLogs = allLogs.filter(log => 
      log.includes('🔧 isPreviewEnvironment') || 
      log.includes('✅ ACTIVANDO modo YouTube') ||
      log.includes('🎬 Modo Preview ACTIVADO') ||
      log.includes('VITE_FORCE_YOUTUBE_VIDEOS')
    );

    if (debugLogs.length > 0) {
      console.log('\n🔧 LOGS DE DEBUG ENCONTRADOS:');
      debugLogs.forEach((log, index) => {
        console.log(`  ${index + 1}. ${log}`);
      });
    } else {
      console.log('\n⚠️ NO SE ENCONTRARON LOGS DE DEBUG');
      
      // Mostrar algunos logs para entender qué está pasando
      console.log('\nPrimeros 15 logs para diagnóstico:');
      allLogs.slice(0, 15).forEach((log, index) => {
        console.log(`  ${index + 1}. ${log}`);
      });
    }

    // Mostrar errores si los hay
    if (errorLogs.length > 0) {
      console.log('\n❌ ERRORES DETECTADOS:');
      errorLogs.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // Verificar que aparezca el indicador de preview
    if (previewIndicators > 0) {
      console.log('✅ Indicador de modo preview encontrado');
    }

    // Verificar que haya videos de YouTube
    if (youtubeIframes > 0) {
      console.log('✅ Videos de YouTube detectados');
      
      // Obtener la URL del primer iframe de YouTube
      const firstYouTubeIframe = page.locator('iframe[src*="youtube.com"]').first();
      const iframeSrc = await firstYouTubeIframe.getAttribute('src');
      console.log(`🎬 Primera URL de YouTube: ${iframeSrc}`);
    }

    // Capturar screenshot final
    await page.screenshot({ 
      path: 'test-results/debug-youtube-admin.png',
      fullPage: true 
    });

    // Al menos debe haber algunos logs y no demasiados errores
    expect(allLogs.length).toBeGreaterThan(10);
    expect(errorLogs.length).toBeLessThan(5);

    console.log('✅ Test con credenciales de admin completado');
  });
}); 