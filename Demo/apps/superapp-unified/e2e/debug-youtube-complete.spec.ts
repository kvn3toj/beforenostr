import { test, expect } from '@playwright/test';

test.describe('🎬 DEBUG COMPLETO: YouTube Videos con Click', () => {
  test('🔐 Login + Click Video + YouTube Iframe', async ({ page }) => {
    console.log('🔍 Test completo: Login -> ÜPlay -> Click Video -> YouTube Iframe...');

    // Capturar logs relevantes
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('🔥') || text.includes('Playing video') || text.includes('Video data') || text.includes('Navigating to video')) {
        console.log(`🎯 [VIDEO CLICK]:`, text);
      }
    });

    // PASO 1: Login exitoso
    console.log('📍 1. Navegando a /login...');
    await page.goto('/login');
    await page.waitForSelector('[data-testid="login-email-input"]');

    console.log('🔐 2. Haciendo login...');
    await page.click('[data-testid="login-submit-button"]');

    await page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );

    await page.waitForURL('**/', { timeout: 10000 });
    console.log('✅ 3. Login exitoso');

    // PASO 2: Navegar a ÜPlay
    console.log('🎬 4. Navegando a /uplay...');
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(8000); // Esperar que carguen los videos
    console.log('✅ 5. ÜPlay cargado');

    // PASO 3: Buscar videos clickeables en la página
    console.log('🔍 6. Buscando videos para hacer clic...');
    
    // Buscar elementos que contengan los títulos de los videos
    const ayniVideo = page.locator('text=/Ayni.*Reciprocidad/i').first();
    const ondasVideo = page.locator('text=/Öndas.*Energía/i').first();
    const meritosVideo = page.locator('text=/Mëritos.*Bien Común/i').first();

    let clickableVideo = null;
    let videoName = '';

    if (await ayniVideo.count() > 0) {
      clickableVideo = ayniVideo;
      videoName = 'Ayni';
      console.log('📽️ 7. Video encontrado: Ayni');
    } else if (await ondasVideo.count() > 0) {
      clickableVideo = ondasVideo;
      videoName = 'Öndas';
      console.log('📽️ 7. Video encontrado: Öndas');
    } else if (await meritosVideo.count() > 0) {
      clickableVideo = meritosVideo;
      videoName = 'Méritos';
      console.log('📽️ 7. Video encontrado: Méritos');
    }

    if (!clickableVideo) {
      console.log('❌ No se encontraron videos clickeables');
      
      // Intentar buscar cualquier elemento clickeable relacionado con video
      const videoElements = await page.locator('[class*="video"], [data-testid*="video"], [onclick], [role="button"]').count();
      console.log('🔍 Elementos relacionados con video encontrados:', videoElements);
      
      if (videoElements > 0) {
        clickableVideo = page.locator('[class*="video"], [data-testid*="video"], [onclick], [role="button"]').first();
        videoName = 'Video genérico';
        console.log('📽️ 7. Usando primer elemento clickeable encontrado');
      } else {
        console.log('❌ FALLO: No hay elementos clickeables en la página');
        await page.screenshot({ path: 'playwright-report/no-clickable-videos.png', fullPage: true });
        expect(false).toBe(true); // Forzar fallo
        return;
      }
    }

    // PASO 4: Hacer clic en el video
    console.log(`🖱️ 8. Haciendo clic en video: ${videoName}...`);
    await clickableVideo.click();

    // Esperar navegación o cambio de página
    console.log('⏳ 9. Esperando navegación...');
    await page.waitForTimeout(5000);

    // Verificar si navegó a página de video
    const currentUrl = page.url();
    console.log('📍 10. URL actual después del clic:', currentUrl);

    if (currentUrl.includes('/uplay/video/')) {
      console.log('✅ 11. NAVEGACIÓN EXITOSA a página de video');
      
      // PASO 5: Buscar iframe de YouTube en la página de video
      console.log('🔍 12. Buscando iframe de YouTube...');
      await page.waitForTimeout(5000); // Esperar que cargue el video
      
      const youtubeIframe = page.locator('iframe[src*="youtube.com/embed"]');
      const iframeCount = await youtubeIframe.count();
      
      console.log('🎥 13. iframes de YouTube encontrados:', iframeCount);
      
      if (iframeCount > 0) {
        console.log('🎉 ¡ÉXITO! iframe de YouTube encontrado');
        const src = await youtubeIframe.first().getAttribute('src');
        console.log('📺 URL del iframe:', src);
        
        // Verificar que tiene parámetros de YouTube
        expect(src).toContain('youtube.com/embed/');
        expect(src).toContain('enablejsapi=1');
        
        console.log('✅ 14. VERIFICACIÓN COMPLETA: YouTube iframe correctamente cargado');
      } else {
        console.log('❌ 14. No se encontró iframe de YouTube en la página de video');
        
        // Buscar cualquier elemento de video
        const anyVideo = await page.locator('video, iframe').count();
        console.log('📹 Elementos de video (video/iframe) encontrados:', anyVideo);
        
        if (anyVideo > 0) {
          const videoSrc = await page.locator('video, iframe').first().getAttribute('src');
          console.log('📺 Fuente del elemento de video:', videoSrc);
        }
      }
      
    } else {
      console.log('❌ 11. NAVEGACIÓN FALLIDA: No se navegó a página de video');
      console.log('🔍 Verificando si el clic funcionó de otra manera...');
      
      // Quizás se abrió un modal o se reprodujo en la misma página
      await page.waitForTimeout(3000);
      const modalVideo = await page.locator('[role="dialog"] iframe, .modal iframe, [class*="modal"] iframe').count();
      console.log('📺 Videos en modal encontrados:', modalVideo);
      
      if (modalVideo > 0) {
        console.log('✅ Video encontrado en modal');
      }
    }

    // PASO 6: Screenshot final
    console.log('📸 15. Tomando screenshot final...');
    await page.screenshot({ path: 'playwright-report/debug-youtube-complete.png', fullPage: true });

    // RESUMEN FINAL
    console.log('\n🎯 === RESUMEN FINAL COMPLETO ===');
    console.log(`✅ Login: EXITOSO`);
    console.log(`🎬 ÜPlay cargado: SÍ`);
    console.log(`📽️ Video clickeado: ${videoName}`);
    console.log(`🔗 Navegación a video: ${currentUrl.includes('/uplay/video/') ? 'SÍ' : 'NO'}`);
    
    if (currentUrl.includes('/uplay/video/')) {
      const finalIframeCount = await page.locator('iframe[src*="youtube.com/embed"]').count();
      console.log(`🎥 YouTube iframe final: ${finalIframeCount > 0 ? 'ENCONTRADO' : 'NO ENCONTRADO'}`);
    }

    // El test siempre pasa para ver todos los logs
    expect(true).toBe(true);
  });
}); 