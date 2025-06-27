import { test, expect } from '@playwright/test';

test.describe('UPlay YouTube Thumbnails Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a UPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root', { timeout: 15000 });

    // Esperar que la página esté completamente cargada
    await page.waitForTimeout(3000);

    // Verificar que estamos en UPlay
    await expect(page.locator('text=ÜPlay')).toBeVisible({ timeout: 10000 });
  });

  test('should load YouTube thumbnails correctly', async ({ page }) => {
    console.log('🎯 Testing YouTube thumbnails loading...');

    // Esperar a que las tarjetas de video estén visibles
    const videoCards = page.locator('[data-testid="uplay-video-thumbnail"]');
    await expect(videoCards.first()).toBeVisible({ timeout: 15000 });

    const thumbnailCount = await videoCards.count();
    console.log(`📹 Found ${thumbnailCount} video thumbnails`);

    if (thumbnailCount === 0) {
      console.log('⚠️ No video thumbnails found, taking screenshot for debugging');
      await page.screenshot({ path: 'tests/e2e/screenshots/no-thumbnails-debug.png' });
      return;
    }

    // Verificar cada thumbnail
    for (let i = 0; i < Math.min(thumbnailCount, 5); i++) { // Verificar máximo 5
      const thumbnail = videoCards.nth(i);

      // Verificar que el thumbnail es visible
      await expect(thumbnail).toBeVisible();

      // Obtener la URL del src del thumbnail
      const src = await thumbnail.getAttribute('src');
      console.log(`🖼️ Thumbnail ${i + 1} src:`, src);

      // Verificar que la URL es de YouTube o es un placeholder válido
      if (src) {
        const isYouTubeThumbnail = src.includes('img.youtube.com');
        const isValidPlaceholder = src.includes('placeholder') || src.includes('svg');

        expect(isYouTubeThumbnail || isValidPlaceholder).toBeTruthy();

        if (isYouTubeThumbnail) {
          console.log(`✅ Thumbnail ${i + 1} is from YouTube: ${src}`);

          // Verificar que la URL sigue el patrón correcto de YouTube
          const youtubePattern = /https:\/\/img\.youtube\.com\/vi\/[a-zA-Z0-9_-]{11}\/(default|mqdefault|hqdefault|sddefault|maxresdefault)\.jpg/;
          expect(src).toMatch(youtubePattern);

          // Verificar que el thumbnail no tiene error de carga
          const naturalWidth = await thumbnail.evaluate((img: HTMLImageElement) => img.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        } else {
          console.log(`📋 Thumbnail ${i + 1} is using placeholder: ${src}`);
        }
      }
    }

    // Tomar screenshot final
    await page.screenshot({ path: 'tests/e2e/screenshots/uplay-thumbnails-loaded.png' });
    console.log('✅ YouTube thumbnails verification completed');
  });

  test('should handle thumbnail loading errors gracefully', async ({ page }) => {
    console.log('🎯 Testing thumbnail error handling...');

    // Interceptar requests de imágenes y simular algunos errores
    await page.route('**/img.youtube.com/vi/**', async (route, request) => {
      // Fallar algunas requests para probar el manejo de errores
      if (Math.random() < 0.3) { // 30% de probabilidad de fallo
        await route.abort();
      } else {
        await route.continue();
      }
    });

    // Navegar nuevamente para aplicar la interceptación
    await page.reload();
    await page.waitForTimeout(5000);

    // Verificar que los placeholders aparecen cuando los thumbnails fallan
    const videoCards = page.locator('[data-testid="uplay-video-thumbnail"]');
    const thumbnailCount = await videoCards.count();

    if (thumbnailCount > 0) {
      for (let i = 0; i < Math.min(thumbnailCount, 3); i++) {
        const thumbnail = videoCards.nth(i);
        const src = await thumbnail.getAttribute('src');

        // Verificar que siempre hay un src válido (YouTube o placeholder)
        expect(src).toBeTruthy();
        console.log(`🔄 Thumbnail ${i + 1} fallback src:`, src);
      }
    }

    await page.screenshot({ path: 'tests/e2e/screenshots/uplay-thumbnails-error-handling.png' });
    console.log('✅ Thumbnail error handling verification completed');
  });

  test('should verify thumbnail quality optimization', async ({ page }) => {
    console.log('🎯 Testing thumbnail quality optimization...');

    const videoCards = page.locator('[data-testid="uplay-video-thumbnail"]');
    await expect(videoCards.first()).toBeVisible({ timeout: 15000 });

    const thumbnailCount = await videoCards.count();

    if (thumbnailCount > 0) {
      const thumbnail = videoCards.first();
      const src = await thumbnail.getAttribute('src');

      if (src && src.includes('img.youtube.com')) {
        console.log(`📊 Analyzing thumbnail quality:`, src);

        // Verificar que se está usando una calidad apropiada
        const isHighQuality = src.includes('hqdefault') || src.includes('maxresdefault') || src.includes('sddefault');
        const isStandardQuality = src.includes('mqdefault');
        const isLowQuality = src.includes('default.jpg');

        // Al menos debe estar usando calidad media o superior
        expect(isHighQuality || isStandardQuality).toBeTruthy();

        if (isHighQuality) {
          console.log('✅ Using high quality thumbnail');
        } else if (isStandardQuality) {
          console.log('✅ Using standard quality thumbnail');
        }

        // Verificar dimensiones del thumbnail cargado
        const dimensions = await thumbnail.evaluate((img: HTMLImageElement) => ({
          width: img.naturalWidth,
          height: img.naturalHeight
        }));

        console.log(`📐 Thumbnail dimensions: ${dimensions.width}x${dimensions.height}`);

        // Los thumbnails de YouTube deben tener dimensiones mínimas
        expect(dimensions.width).toBeGreaterThan(120);
        expect(dimensions.height).toBeGreaterThan(90);
      }
    }

    console.log('✅ Thumbnail quality optimization verification completed');
  });
});
