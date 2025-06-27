import { test, expect } from '@playwright/test';

test.describe('Verificar Thumbnails de Videos', () => {
  test('thumbnails aparecen correctamente en ÜPlay', async ({ page }) => {
    console.log('🖼️ VERIFICANDO THUMBNAILS DE VIDEOS');

    // Navegar y hacer login
    await page.goto('http://localhost:3001');

    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('🔐 Haciendo login...');

      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');

      await page.waitForURL('**/', { timeout: 10000 });
      console.log('✅ Login exitoso');
    }

    // Navegar a ÜPlay
    console.log('🎮 Navegando a ÜPlay...');
    await page.click('text=ÜPlay');
    await page.waitForURL('**/uplay', { timeout: 10000 });
    console.log('✅ En página ÜPlay');

    // Esperar a que se carguen las cards de video
    await page.waitForTimeout(3000);

    // Buscar cards de video
    const videoCards = page.locator('.MuiCard-root');
    const cardCount = await videoCards.count();
    console.log(`📋 Cards de video encontradas: ${cardCount}`);

    expect(cardCount).toBeGreaterThan(0);

    // Verificar thumbnails en las primeras 3 cards
    for (let i = 0; i < Math.min(3, cardCount); i++) {
      const card = videoCards.nth(i);
      const thumbnail = card.locator('[data-testid="uplay-video-thumbnail"]');

      // Verificar que el thumbnail existe
      await expect(thumbnail).toBeVisible();

      // Obtener el src del thumbnail
      const src = await thumbnail.getAttribute('src');
      console.log(`🖼️ Card ${i + 1} thumbnail src: ${src?.substring(0, 100)}...`);

      // Verificar que no está usando el placeholder genérico por error
      expect(src).toBeTruthy();
      expect(src).not.toBe('/placeholder-video.svg');

      // Verificar que es una URL válida o data URL
      const isValidUrl = src?.startsWith('http') || src?.startsWith('data:image') || src?.startsWith('/');
      expect(isValidUrl).toBe(true);
    }

    // Tomar screenshot para verificación visual
    await page.screenshot({
      path: 'test-results/thumbnails-verification.png',
      fullPage: true
    });
    console.log('📸 Screenshot guardado: thumbnails-verification.png');

    // Verificar tipos específicos de thumbnails
    const thumbnails = page.locator('[data-testid="uplay-video-thumbnail"]');
    const thumbnailCount = await thumbnails.count();

    let youtubeCount = 0;
    let netflixCount = 0;
    let placeholderCount = 0;

    for (let i = 0; i < thumbnailCount; i++) {
      const src = await thumbnails.nth(i).getAttribute('src');
      if (src?.includes('img.youtube.com')) {
        youtubeCount++;
      } else if (src?.includes('netflix')) {
        netflixCount++;
      } else if (src?.includes('placeholder-video.svg') || src?.includes('data:image')) {
        placeholderCount++;
      }
    }

    console.log(`📊 Resumen de thumbnails:`);
    console.log(`   - YouTube: ${youtubeCount}`);
    console.log(`   - Netflix: ${netflixCount}`);
    console.log(`   - Placeholders: ${placeholderCount}`);
    console.log(`   - Total: ${thumbnailCount}`);

    // Al menos debe haber algunos thumbnails
    expect(thumbnailCount).toBeGreaterThan(0);
  });
});
