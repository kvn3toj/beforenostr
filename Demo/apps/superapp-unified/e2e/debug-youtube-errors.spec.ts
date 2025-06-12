import { test, expect } from '@playwright/test';

test.describe('🔍 DEBUG: Captura de Errores JavaScript', () => {
  test('🚨 Verificar errores y logs completos', async ({ page }) => {
    console.log('🔍 Iniciando captura completa de errores...');

    // Arrays para capturar todos los logs y errores
    const allLogs: string[] = [];
    const jsErrors: string[] = [];
    const networkErrors: string[] = [];

    // Capturar TODOS los logs de consola
    page.on('console', (msg) => {
      const text = msg.text();
      allLogs.push(`[${msg.type().toUpperCase()}] ${text}`);
      console.log(`🎯 [BROWSER ${msg.type().toUpperCase()}]:`, text);
    });

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      const errorText = `JavaScript Error: ${error.message}`;
      jsErrors.push(errorText);
      console.log('🚨 [JS ERROR]:', errorText);
    });

    // Capturar errores de red
    page.on('requestfailed', (request) => {
      const errorText = `Network Error: ${request.url()} - ${request.failure()?.errorText}`;
      networkErrors.push(errorText);
      console.log('🌐 [NETWORK ERROR]:', errorText);
    });

    // Ir a login con credenciales de admin
    console.log('📍 Navegando a /login...');
    await page.goto('/login');

    // Verificar que las credenciales están pre-llenadas
    await page.waitForSelector('[data-testid="login-email-input"]');
    console.log('✅ Formulario de login cargado');

    // Hacer login
    await page.click('[data-testid="login-submit-button"]');
    console.log('🚀 Login enviado...');

    // Esperar redirección
    await page.waitForURL('**/', { timeout: 15000 });
    console.log('✅ Redirección completada');

    // Navegar a ÜPlay
    console.log('🎬 Navegando a /uplay...');
    await page.goto('/uplay');

    // Esperar que la página se cargue completamente
    await page.waitForSelector('#root', { timeout: 15000 });
    console.log('✅ Página ÜPlay cargada');

    // Esperar un poco más para que React monte todos los componentes
    await page.waitForTimeout(5000);
    console.log('⏳ Tiempo adicional para montaje de componentes...');

    // Verificar si hay contenido en la página
    const pageContent = await page.textContent('body');
    console.log('📄 Contenido de la página tiene texto:', pageContent ? pageContent.length > 100 : false);

    // Buscar elementos específicos de ÜPlay
    const uplayElements = await page.locator('text=/ÜPlay|Playlists|staffPlaylists|videos|YouTube/i').count();
    console.log('🎬 Elementos relacionados con ÜPlay encontrados:', uplayElements);

    // Buscar específicamente por videos de YouTube
    const youtubeElements = await page.locator('[src*="youtube"], [href*="youtube"], iframe[src*="youtube"]').count();
    console.log('🎥 Elementos de YouTube encontrados:', youtubeElements);

    // Verificar si hay errores acumulados
    console.log('\n📊 RESUMEN DE DEBUGGING:');
    console.log('  - Total de logs capturados:', allLogs.length);
    console.log('  - Errores JavaScript:', jsErrors.length);
    console.log('  - Errores de red:', networkErrors.length);
    
    if (jsErrors.length > 0) {
      console.log('\n🚨 ERRORES JAVASCRIPT DETECTADOS:');
      jsErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED DETECTADOS:');
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // Tomar screenshot final
    console.log('📸 Tomando screenshot final...');
    await page.screenshot({ path: 'playwright-report/debug-youtube-errors.png', fullPage: true });

    // El test pasa siempre para que podamos ver los logs
    expect(true).toBe(true);
  });
}); 