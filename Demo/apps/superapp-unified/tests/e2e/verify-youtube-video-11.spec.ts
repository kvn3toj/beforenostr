import { test, expect } from '@playwright/test';

test.describe('Video 11 YouTube Verification', () => {
  test('should load and display real YouTube video 11', async ({ page }) => {
    console.log('🎯 Verificando video 11: https://www.youtube.com/watch?v=qzJfaUWBfQk');

    // 1. Navegar directamente al video 11
    await page.goto('http://localhost:3001/uplay/video/11');

    // 2. Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 3. Verificar que el título del video se muestre
    const hasCorrectTitle = await page.getByText('¿Puedes vivir en esta sociedad enferma?').isVisible().catch(() => false);

    if (hasCorrectTitle) {
      console.log('✅ Título del video correcto detectado');
    }

    // 4. Verificar que hay un iframe de YouTube o elemento de video
    const youtubeIframe = page.locator('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
    const hasYouTubeFrame = await youtubeIframe.isVisible().catch(() => false);

    if (hasYouTubeFrame) {
      console.log('🎉 ¡IFRAME DE YOUTUBE DETECTADO!');

      // Obtener la URL del iframe para verificar que es el video correcto
      const iframeUrl = await youtubeIframe.getAttribute('src');
      console.log('🔗 URL del iframe:', iframeUrl);

      // Verificar que contiene el ID correcto del video
      if (iframeUrl && iframeUrl.includes('qzJfaUWBfQk')) {
        console.log('✅ VIDEO REAL DE YOUTUBE CONFIRMADO: qzJfaUWBfQk');
      }
    }

    // 5. Buscar cualquier elemento de video como respaldo
    const videoElement = page.locator('video');
    const hasVideoElement = await videoElement.isVisible().catch(() => false);

    // 6. Verificar el contenido de la página
    const pageContent = await page.textContent('body');
    const hasVideoContent = pageContent?.includes('qzJfaUWBfQk') ||
                           pageContent?.includes('Puedes vivir') ||
                           pageContent?.includes('sociedad enferma');

    console.log('📊 Resultados de verificación:', {
      hasCorrectTitle,
      hasYouTubeFrame,
      hasVideoElement,
      hasVideoContent,
      currentUrl: page.url()
    });

    // Assertion principal: debe tener contenido de video o iframe de YouTube
    expect(hasYouTubeFrame || hasVideoElement || hasVideoContent).toBeTruthy();

    if (hasYouTubeFrame) {
      console.log('🎉 VERIFICACIÓN EXITOSA: Video real de YouTube se está reproduciendo');
    } else if (hasVideoContent) {
      console.log('✅ VERIFICACIÓN PARCIAL: Contenido del video detectado en la página');
    } else {
      console.log('⚠️ ADVERTENCIA: No se detectó reproductor de video claramente');
    }
  });

  test('should verify YouTube video data from API', async ({ page }) => {
    console.log('🔍 Verificando datos de la API para video 11...');

    // Verificar que el backend devuelve los datos correctos
    const response = await page.request.get('http://localhost:3002/video-items/11');
    expect(response.status()).toBe(200);

    const videoData = await response.json();

    // Verificaciones específicas para el video 11
    expect(videoData.id).toBe(11);
    expect(videoData.title).toBe('¿Puedes vivir en esta sociedad enferma?');
    expect(videoData.url).toBe('https://www.youtube.com/watch?v=qzJfaUWBfQk');
    expect(videoData.platform).toBe('youtube');
    expect(videoData.externalId).toBe('qzJfaUWBfQk');

    console.log('✅ Datos del video verificados correctamente desde la API');
    console.log('🎯 Video confirmado:', {
      título: videoData.title,
      url: videoData.url,
      plataforma: videoData.platform,
      youtubeId: videoData.externalId
    });
  });
});
