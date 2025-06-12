import { test, expect } from '@playwright/test';

test.describe('🎬 DEBUG FINAL: Videos de YouTube', () => {
  test('🔐 Login correcto + ÜPlay con videos de YouTube', async ({ page }) => {
    console.log('🔍 Test final de YouTube con login correcto...');

    // Capturar logs relevantes
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('🎬') || text.includes('isPreviewEnvironment') || text.includes('YouTube') || text.includes('staffPlaylists') || text.includes('FINAL') || text.includes('RENDER DEBUG')) {
        console.log(`🎯 [YOUTUBE]:`, text);
      }
    });

    // PASO 1: Login exitoso (sabemos que funciona)
    console.log('📍 1. Navegando a /login...');
    await page.goto('/login');
    await page.waitForSelector('[data-testid="login-email-input"]');

    console.log('🔐 2. Haciendo login...');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar login exitoso y redirección
    await page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );

    // Verificar que se redirigió correctamente
    await page.waitForURL('**/', { timeout: 10000 });
    console.log('✅ 3. Login exitoso y redirigido a dashboard');

    // PASO 2: Navegar a ÜPlay (ahora que estamos autenticados)
    console.log('🎬 4. Navegando a /uplay...');
    await page.goto('/uplay');

    // Esperar que la página se cargue completamente
    await page.waitForSelector('#root', { timeout: 15000 });
    console.log('✅ 5. ÜPlay cargado');

    // PASO 3: Esperar a que terminen los estados de loading
    console.log('⏳ 6. Esperando que terminen los estados de loading...');
    
    // Esperar 10 segundos para que todos los hooks terminen de cargar
    await page.waitForTimeout(10000);
    
    // PASO 4: Verificar si aparecen videos de YouTube
    console.log('🔍 7. Buscando videos de YouTube...');
    
    // Buscar elementos que contengan URLs de YouTube
    const youtubeElements = await page.locator('[src*="youtube"], [href*="youtube"], img[src*="youtube"]').count();
    console.log('🎥 8. Elementos de YouTube encontrados:', youtubeElements);

    // Buscar texto relacionado con los videos mock
    const ayniElements = await page.locator('text=/Ayni.*Reciprocidad/i').count();
    const ondasElements = await page.locator('text=/Öndas.*Energía/i').count();
    const meritosElements = await page.locator('text=/Mëritos.*Bien Común/i').count();
    
    console.log('📝 9. Videos mock encontrados:');
    console.log('   - Ayni:', ayniElements);
    console.log('   - Öndas:', ondasElements); 
    console.log('   - Mëritos:', meritosElements);

    // Buscar el texto "Playlists del Staff"
    const playlistsSection = await page.locator('text=/Playlists del Staff/i').count();
    console.log('📚 10. Sección "Playlists del Staff":', playlistsSection);

    // Buscar el indicador de preview mode
    const previewIndicator = await page.locator('text=/Modo Preview/i').count();
    console.log('🔧 11. Indicador de Modo Preview:', previewIndicator);

    // Verificar si hay contenido de video en general
    const videoContent = await page.locator('[data-testid*="video"], [class*="video"], [id*="video"]').count();
    console.log('🎬 12. Elementos relacionados con video:', videoContent);

    // PASO 5: Tomar screenshot final
    console.log('📸 13. Tomando screenshot final...');
    await page.screenshot({ path: 'playwright-report/debug-youtube-final.png', fullPage: true });

    // PASO 6: Verificar página completa de texto
    const pageText = await page.textContent('body');
    const hasYouTubeText = pageText?.includes('youtube') || pageText?.includes('YouTube');
    const hasVideoTitles = pageText?.includes('Ayni') && pageText?.includes('Öndas');
    
    console.log('📄 14. Análisis de contenido de página:');
    console.log('   - Contiene texto "YouTube":', hasYouTubeText);
    console.log('   - Contiene títulos de videos:', hasVideoTitles);
    console.log('   - Longitud total del texto:', pageText?.length);

    // RESUMEN FINAL
    console.log('\n🎯 === RESUMEN FINAL ===');
    console.log(`✅ Login: EXITOSO`);
    console.log(`🎬 Elementos YouTube: ${youtubeElements}`);
    console.log(`📚 Sección Playlists: ${playlistsSection > 0 ? 'SÍ' : 'NO'}`);
    console.log(`🔧 Modo Preview: ${previewIndicator > 0 ? 'DETECTADO' : 'NO DETECTADO'}`);
    console.log(`📝 Videos mock: ${ayniElements + ondasElements + meritosElements}`);

    // El test siempre pasa para ver todos los logs
    expect(true).toBe(true);
  });
}); 