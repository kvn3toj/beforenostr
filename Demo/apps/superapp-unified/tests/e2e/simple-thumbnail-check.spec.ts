import { test, expect } from '@playwright/test';

test.describe('Simple Thumbnail Check', () => {
  test('verificar que aparecen imágenes en las cards de video', async ({ page }) => {
    console.log('🖼️ VERIFICACIÓN SIMPLE DE THUMBNAILS');

    // Navegar directo (ya no necesitamos login manual, el .env lo maneja)
    await page.goto('http://localhost:3001');

    // Esperar que se cargue y hacer login automáticamente si es necesario
    await page.waitForTimeout(3000);

    // Si estamos en login, login automáticamente
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('🔐 Haciendo login...');
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/', { timeout: 15000 });
    }

    // Navegar a ÜPlay
    console.log('🎮 Navegando a ÜPlay...');
    await page.click('text=ÜPlay');
    await page.waitForURL('**/uplay', { timeout: 10000 });

    // Esperar que se carguen las cards
    await page.waitForTimeout(5000);

    // Buscar ANY imágenes dentro de cards
    const cards = page.locator('.MuiCard-root');
    const cardCount = await cards.count();
    console.log(`📋 Cards encontradas: ${cardCount}`);

    if (cardCount > 0) {
      // Buscar imágenes dentro de las cards
      const images = page.locator('.MuiCard-root img');
      const imageCount = await images.count();
      console.log(`🖼️ Imágenes encontradas: ${imageCount}`);

      // Verificar src de las primeras imágenes
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        console.log(`🖼️ Imagen ${i + 1}:`);
        console.log(`   - src: ${src?.substring(0, 100)}...`);
        console.log(`   - alt: ${alt}`);

        // Verificar que tiene src válido
        expect(src).toBeTruthy();
      }

      // Verificar que al menos hay algunas imágenes
      expect(imageCount).toBeGreaterThan(0);
    }

    // Buscar específicamente elementos CardMedia de MUI
    const cardMedias = page.locator('.MuiCardMedia-root');
    const cardMediaCount = await cardMedias.count();
    console.log(`🎨 CardMedia components: ${cardMediaCount}`);

    // Tomar screenshot final
    await page.screenshot({
      path: 'test-results/simple-thumbnail-check.png',
      fullPage: true
    });

    console.log('📸 Screenshot guardado: simple-thumbnail-check.png');
    console.log('✅ Verificación completada');
  });
});
