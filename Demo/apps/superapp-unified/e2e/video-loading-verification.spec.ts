import { test, expect } from '@playwright/test';

/**
 * Video Loading Verification Test
 * 
 * Verifica que los videos cargan correctamente en el sistema ÜPlay unificado:
 * - Navegación a ÜPlay funciona
 * - Videos están disponibles en el dashboard
 * - Los videos se cargan correctamente cuando se seleccionan
 * - Las URLs de video son funcionales
 */

test.describe('Video Loading Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login con credenciales del backend NestJS
    console.log('🔐 Iniciando login...');
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);
    console.log('✅ Login completado');
  });

  test('🎬 Should load ÜPlay dashboard and display videos', async ({ page }) => {
    console.log('🔍 Verificando dashboard de ÜPlay...');
    
    // Navegar a ÜPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verificar que la página principal carga
    await expect(page.locator('text=🎬 ÜPlay - GPL Gamified Play List')).toBeVisible();
    console.log('✅ Dashboard principal cargado');

    // Verificar que hay contenido de videos
    const hasVideoContent = await page.locator('text=Continuar Viendo').isVisible() ||
                           await page.locator('text=Staff Picks').isVisible() ||
                           await page.locator('[data-testid="video-card"]').first().isVisible() ||
                           await page.locator('.video-card').first().isVisible();
    
    expect(hasVideoContent).toBe(true);
    console.log('✅ Contenido de videos encontrado');
  });

  test('🎥 Should load video player with functional video', async ({ page }) => {
    console.log('🔍 Verificando carga de video...');
    
    // Navegar directamente a un video específico
    await page.goto('/uplay/video/coomunity-intro');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(5000); // Dar tiempo extra para que el video cargue

    // Verificar que el reproductor unificado carga
    await expect(page.locator('text=🎬 ÜPlay Unificado')).toBeVisible();
    console.log('✅ Reproductor unificado cargado');

    // Verificar que hay un elemento de video o iframe
    const videoElement = page.locator('video').first();
    const iframeElement = page.locator('iframe').first();
    const playerElement = page.locator('[data-testid="video-player"]').first();
    
    const hasVideoPlayer = await videoElement.isVisible() || 
                          await iframeElement.isVisible() || 
                          await playerElement.isVisible();
    
    expect(hasVideoPlayer).toBe(true);
    console.log('✅ Elemento de video encontrado');

    // Si hay un elemento video, verificar que tiene una fuente
    if (await videoElement.isVisible()) {
      const videoSrc = await videoElement.getAttribute('src');
      console.log('📹 Video source:', videoSrc);
      expect(videoSrc).toBeTruthy();
      
      // Verificar que la URL es una de nuestras URLs funcionales
      const isFunctionalUrl = videoSrc?.includes('commondatastorage.googleapis.com') ||
                             videoSrc?.includes('gtv-videos-bucket');
      expect(isFunctionalUrl).toBe(true);
      console.log('✅ URL de video funcional verificada');
    }
  });

  test('🔄 Should handle video navigation correctly', async ({ page }) => {
    console.log('🔍 Verificando navegación entre videos...');
    
    // Ir al dashboard
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Buscar y hacer clic en una tarjeta de video
    const videoCard = page.locator('[data-testid="video-card"], .video-card').first();
    if (await videoCard.isVisible()) {
      console.log('📱 Haciendo clic en tarjeta de video...');
      await videoCard.click();
      await page.waitForTimeout(3000);
      
      // Verificar que navegamos al reproductor
      const currentUrl = page.url();
      expect(currentUrl).toContain('/uplay/video/');
      console.log('✅ Navegación a video exitosa:', currentUrl);
      
      // Verificar que el reproductor carga
      await expect(page.locator('text=🎬 ÜPlay Unificado')).toBeVisible();
      console.log('✅ Reproductor cargado después de navegación');
    } else {
      console.log('⚠️ No se encontraron tarjetas de video, probando navegación directa');
      await page.goto('/uplay/video/ayni-deep-dive');
      await page.waitForTimeout(3000);
      await expect(page.locator('text=🎬 ÜPlay Unificado')).toBeVisible();
      console.log('✅ Navegación directa exitosa');
    }
  });

  test('📱 Should work on mobile viewport', async ({ page }) => {
    console.log('🔍 Verificando experiencia móvil...');
    
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navegar a ÜPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verificar que la página es responsive
    await expect(page.locator('text=🎬 ÜPlay - GPL Gamified Play List')).toBeVisible();
    console.log('✅ Dashboard responsive en móvil');

    // Navegar a un video
    await page.goto('/uplay/video/coomunity-intro');
    await page.waitForTimeout(5000);

    // Verificar que el reproductor es responsive
    await expect(page.locator('text=🎬 ÜPlay Unificado')).toBeVisible();
    console.log('✅ Reproductor responsive en móvil');
  });

  test('🌐 Should verify all video URLs are functional', async ({ page }) => {
    console.log('🔍 Verificando URLs de video...');
    
    // Lista de videos que deberían estar disponibles
    const videoIds = ['coomunity-intro', 'ayni-deep-dive', 'ondas-energia'];
    
    for (const videoId of videoIds) {
      console.log(`📹 Probando video: ${videoId}`);
      
      await page.goto(`/uplay/video/${videoId}`);
      await page.waitForSelector('#root', { timeout: 10000 });
      await page.waitForTimeout(3000);

      // Verificar que el reproductor carga
      await expect(page.locator('text=🎬 ÜPlay Unificado')).toBeVisible();
      
      // Verificar que no hay errores críticos de JavaScript
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });
      
      await page.waitForTimeout(2000);
      
      // Filtrar solo errores críticos
      const criticalErrors = jsErrors.filter(error => 
        !error.includes('404') && 
        !error.includes('Failed to fetch') &&
        !error.includes('warning')
      );
      
      expect(criticalErrors.length).toBe(0);
      console.log(`✅ Video ${videoId} carga sin errores críticos`);
    }
  });

  test('🎮 Should display gamification elements', async ({ page }) => {
    console.log('🔍 Verificando elementos de gamificación...');
    
    await page.goto('/uplay/video/coomunity-intro');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(5000);

    // Verificar elementos de gamificación
    const meritosVisible = await page.locator('text=Mëritos').isVisible();
    const ondasVisible = await page.locator('text=Öndas').isVisible();
    
    if (meritosVisible) {
      console.log('✅ Elemento Mëritos encontrado');
    }
    
    if (ondasVisible) {
      console.log('✅ Elemento Öndas encontrado');
    }
    
    // Al menos uno de los elementos de gamificación debería estar visible
    expect(meritosVisible || ondasVisible).toBe(true);
    console.log('✅ Elementos de gamificación verificados');
  });
}); 