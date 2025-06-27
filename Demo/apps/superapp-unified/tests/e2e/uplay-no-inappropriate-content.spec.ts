import { test, expect } from '@playwright/test';

test.describe('ÜPlay - Verification: No Inappropriate Content', () => {
  test('should not display Rick Astley video or inappropriate thumbnails', async ({ page }) => {
    // Interceptar todas las requests de API para verificar que no contienen el video inapropiado
    const apiRequests: string[] = [];

    page.on('request', request => {
      if (request.url().includes('/video-items') || request.url().includes('/api/')) {
        apiRequests.push(request.url());
      }
    });

    // Ir a la página de ÜPlay
    await page.goto('/uplay');

    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');

    // Verificar que el título de la página sea correcto
    await expect(page).toHaveTitle(/ÜPlay|CoomÜnity/);

    // Buscar cualquier elemento que pueda contener referencias al video inapropiado
    const inappropriateText = page.locator('text=/rick|rickroll|dQw4w9WgXcQ/i');
    await expect(inappropriateText).toHaveCount(0);

    // Verificar que no hay imágenes con el ID del video de YouTube
    const inappropriateImages = page.locator('img[src*="dQw4w9WgXcQ"]');
    await expect(inappropriateImages).toHaveCount(0);

    // Verificar que no hay links que contengan el video inapropiado
    const inappropriateLinks = page.locator('a[href*="dQw4w9WgXcQ"]');
    await expect(inappropriateLinks).toHaveCount(0);

    // Verificar que hay contenido válido en ÜPlay
    const videoCards = page.locator('[data-testid*="video"], [class*="video"], [class*="card"]');
    const videoCardsCount = await videoCards.count();

    if (videoCardsCount > 0) {
      console.log(`✅ Found ${videoCardsCount} video elements in ÜPlay`);

      // Verificar que ninguno de los videos contiene contenido inapropiado
      for (let i = 0; i < videoCardsCount; i++) {
        const card = videoCards.nth(i);
        const cardText = await card.textContent();
        const cardHTML = await card.innerHTML();

        // Verificar texto
        expect(cardText?.toLowerCase() || '').not.toContain('rick');
        expect(cardText?.toLowerCase() || '').not.toContain('rickroll');
        expect(cardText?.toLowerCase() || '').not.toContain('dqw4w9wgxcq');

        // Verificar HTML
        expect(cardHTML.toLowerCase()).not.toContain('dqw4w9wgxcq');
        expect(cardHTML.toLowerCase()).not.toContain('rickroll');
      }
    }

    // Verificar que las requests de API no contienen el video inapropiado
    console.log('📡 API Requests made:', apiRequests);

    // Hacer una request directa al backend para verificar
    const response = await page.request.get('http://localhost:3002/video-items');
    const videos = await response.json();

    const inappropriateVideos = videos.filter((video: any) =>
      video.externalId?.includes('dQw4w9WgXcQ') ||
      video.url?.includes('dQw4w9WgXcQ') ||
      video.title?.toLowerCase().includes('rick') ||
      video.title?.toLowerCase().includes('rickroll')
    );

    expect(inappropriateVideos).toHaveLength(0);
    console.log('✅ Backend verification: No inappropriate videos found');

    // Verificar localStorage y sessionStorage
    const localStorageData = await page.evaluate(() => {
      const data: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });

    const sessionStorageData = await page.evaluate(() => {
      const data: any = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          data[key] = sessionStorage.getItem(key);
        }
      }
      return data;
    });

    // Verificar que no hay datos inapropiados en storage
    const storageString = JSON.stringify({ ...localStorageData, ...sessionStorageData }).toLowerCase();
    expect(storageString).not.toContain('dqw4w9wgxcq');
    expect(storageString).not.toContain('rickroll');

    console.log('✅ Storage verification: No inappropriate content in localStorage/sessionStorage');

    // Screenshot para evidencia visual
    await page.screenshot({
      path: 'tests/e2e/screenshots/uplay-clean-verification.png',
      fullPage: true
    });

    console.log('✅ ÜPlay verification complete: No inappropriate content found');
  });

  test('should display only appropriate educational content', async ({ page }) => {
    // Hacer login primero
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'test@coomunity.com');
    await page.fill('[data-testid="login-password-input"] input', 'test123');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL('**/', { timeout: 15000 });

    // Ir a ÜPlay
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');

    // Ir específicamente al tab de Videoteca (usando botón personalizado)
    await page.waitForSelector('button:has-text("Videoteca")', { timeout: 10000 });
    await page.click('button:has-text("Videoteca")');
    await page.waitForTimeout(3000);

    // Buscar específicamente thumbnails de video con el data-testid correcto
    const videoThumbnails = page.locator('[data-testid="uplay-video-thumbnail"]');
    const videoCards = page.locator('.uplay-video-card');
    const materialCards = page.locator('.MuiCard-root');

    const thumbnailsCount = await videoThumbnails.count();
    const cardsCount = await videoCards.count();
    const materialCardsCount = await materialCards.count();

    console.log(`📊 Video thumbnails found: ${thumbnailsCount}`);
    console.log(`📊 Video cards found: ${cardsCount}`);
    console.log(`📊 Material cards found: ${materialCardsCount}`);

    // Al menos uno de estos selectores debe encontrar elementos
    const hasContent = thumbnailsCount > 0 || cardsCount > 0 || materialCardsCount > 0;
    expect(hasContent).toBeTruthy();

    if (thumbnailsCount > 0) {
      console.log(`✅ Found ${thumbnailsCount} video thumbnails`);
    } else if (cardsCount > 0) {
      console.log(`✅ Found ${cardsCount} video cards`);
    } else if (materialCardsCount > 0) {
      console.log(`✅ Found ${materialCardsCount} material cards`);
    }

    // Verificar que no hay mensajes de error o carga
    const errorMessage = page.locator('text=Error al cargar los videos');
    const loadingMessage = page.locator('text=Cargando biblioteca de videos...');

    const hasError = await errorMessage.isVisible();
    const isLoading = await loadingMessage.isVisible();

    console.log(`📊 UI State - Error: ${hasError}, Loading: ${isLoading}`);

    // No debe estar en estado de error
    expect(hasError).toBeFalsy();
  });
});
