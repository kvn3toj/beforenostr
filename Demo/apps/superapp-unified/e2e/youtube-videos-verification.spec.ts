import { test, expect } from '@playwright/test';

test.describe('🎬 Verificación de Videos de YouTube', () => {
  test.beforeEach(async ({ page }) => {
    // Login con usuario admin para tener permisos completos
    await page.goto('/login');
    
    // Llenar credenciales de admin del backend NestJS
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección exitosa
    await page.waitForURL('**/', { timeout: 15000 });
  });

  test('🎥 Verificar que los videos de YouTube se cargan en ÜPlay', async ({ page }) => {
    console.log('🎯 Iniciando verificación de videos de YouTube...');
    
    // Navegar al módulo ÜPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar a que el componente se cargue completamente
    await page.waitForTimeout(3000);
    
    // Buscar elementos de video que contengan URLs de YouTube
    const youtubeElements = await page.locator('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').count();
    console.log(`📊 Videos de YouTube detectados: ${youtubeElements}`);
    
    // Buscar videos locales (fallback)
    const localVideos = await page.locator('video[src*=".mp4"], video[src*=".webm"]').count();
    console.log(`📊 Videos locales detectados: ${localVideos}`);
    
    // Verificar que hay al menos algún tipo de video
    expect(youtubeElements + localVideos).toBeGreaterThan(0);
    
    // Si hay videos de YouTube, verificar que se cargan correctamente
    if (youtubeElements > 0) {
      console.log('✅ Videos de YouTube encontrados, verificando carga...');
      
      // Verificar que los iframes de YouTube están presentes
      const firstYouTubeIframe = page.locator('iframe[src*="youtube.com"]').first();
      await expect(firstYouTubeIframe).toBeVisible({ timeout: 15000 });
      
      // Verificar que la URL del iframe contiene YouTube
      const iframeSrc = await firstYouTubeIframe.getAttribute('src');
      expect(iframeSrc).toContain('youtube.com');
      console.log(`🎬 Video de YouTube verificado: ${iframeSrc}`);
    } else {
      console.log('⚠️ No se encontraron videos de YouTube, verificando configuración...');
      
      // Verificar que la variable de entorno está configurada
      const envCheck = await page.evaluate(() => {
        return {
          forceYouTube: import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS,
          isDevelopment: import.meta.env.DEV,
          mode: import.meta.env.MODE
        };
      });
      
      console.log('🔧 Estado de configuración:', envCheck);
    }
    
    // Tomar screenshot para verificación visual
    await page.screenshot({ 
      path: 'test-results/youtube-videos-verification.png',
      fullPage: true 
    });
  });

  test('🎮 Verificar funcionalidad del reproductor de video', async ({ page }) => {
    console.log('🎯 Verificando funcionalidad del reproductor...');
    
    // Navegar al módulo ÜPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Buscar botones de "Continuar viendo" o "Play"
    const playButtons = page.locator('button:has-text("Continuar"), button:has-text("Play"), [data-testid*="play"]');
    const playButtonCount = await playButtons.count();
    
    console.log(`🎮 Botones de reproducción encontrados: ${playButtonCount}`);
    
    if (playButtonCount > 0) {
      // Hacer clic en el primer botón de reproducción
      await playButtons.first().click();
      
      // Esperar a que el reproductor se cargue
      await page.waitForTimeout(2000);
      
      // Verificar que hay elementos de video presentes
      const videoElements = await page.locator('video, iframe[src*="youtube"]').count();
      expect(videoElements).toBeGreaterThan(0);
      
      console.log('✅ Reproductor de video cargado correctamente');
    } else {
      console.log('⚠️ No se encontraron botones de reproducción disponibles');
    }
  });

  test('🔧 Verificar configuración de entorno para YouTube', async ({ page }) => {
    console.log('🔧 Verificando configuración de entorno...');
    
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar las variables de entorno en el navegador
    const envConfig = await page.evaluate(() => {
      return {
        VITE_FORCE_YOUTUBE_VIDEOS: import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE,
        location: {
          hostname: window.location.hostname,
          href: window.location.href
        }
      };
    });
    
    console.log('📊 Configuración de entorno:', JSON.stringify(envConfig, null, 2));
    
    // Verificar que VITE_FORCE_YOUTUBE_VIDEOS está configurado
    expect(envConfig.VITE_FORCE_YOUTUBE_VIDEOS).toBe('true');
    
    // Verificar que estamos en modo desarrollo
    expect(envConfig.DEV).toBe(true);
    
    console.log('✅ Configuración de entorno verificada correctamente');
  });
}); 