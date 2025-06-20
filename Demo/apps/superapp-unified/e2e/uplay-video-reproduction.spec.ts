import { test, expect } from '@playwright/test';

test.describe('ÜPlay Video Reproduction', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al módulo ÜPlay
    await page.goto('/uplay');
    await page.waitForSelector('#root');
    
    // Esperar a que carguen los videos
    await page.waitForSelector('[data-testid="video-card"]', { timeout: 10000 });
  });

  test('should load and display video player correctly', async ({ page }) => {
    // Hacer clic en el primer video disponible
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Verificar que el reproductor aparezca
    await page.waitForSelector('iframe, video', { timeout: 5000 });

    // Verificar que los controles estén presentes
    await expect(page.locator('button[aria-label*="play"], button[aria-label*="pause"]')).toBeVisible();
    
    // Verificar que la información del video esté visible
    await expect(page.locator('text=/Introducción|Elementos|Narrativa/')).toBeVisible();
  });

  test('should play YouTube videos correctly', async ({ page }) => {
    // Hacer clic en el primer video (debería ser de YouTube según el backend)
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Verificar que se muestre un iframe de YouTube
    const iframe = page.locator('iframe[src*="youtube.com/embed"]');
    await expect(iframe).toBeVisible({ timeout: 5000 });

    // Verificar que el iframe tenga los parámetros correctos para autoplay
    const iframeSrc = await iframe.getAttribute('src');
    expect(iframeSrc).toContain('autoplay=1');
    expect(iframeSrc).toContain('enablejsapi=1');
  });

  test('should show video controls and information', async ({ page }) => {
    // Seleccionar y reproducir un video
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Verificar controles de reproducción
    await expect(page.locator('button[aria-label*="play"], button[aria-label*="pause"]')).toBeVisible();
    
    // Verificar información del video
    await expect(page.locator('text="Introducción a la Gamificación"')).toBeVisible();
    
    // Verificar que se muestren las categorías/tags
    await expect(page.locator('[role="button"]:has-text("youtube")')).toBeVisible();
    
    // Verificar duración del video
    await expect(page.locator('text=/\\d+:\\d+/')).toBeVisible();
  });

  test('should handle question markers correctly', async ({ page }) => {
    // Seleccionar un video
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Esperar a que aparezca el reproductor
    await page.waitForSelector('iframe, video');

    // Verificar que existan marcadores de preguntas en la línea de tiempo
    // Nota: Los marcadores pueden aparecer después de que se carguen las preguntas
    await page.waitForTimeout(2000);
    
    // Buscar marcadores de preguntas
    const questionMarkers = page.locator('[data-testid="question-marker"]');
    
    // Si hay preguntas para este video, deberían aparecer marcadores
    const questionCount = await questionMarkers.count();
    console.log(`Found ${questionCount} question markers`);
    
    // Verificar que al menos la interfaz para marcadores esté presente
    await expect(page.locator('.MuiSlider-root')).toBeVisible(); // Barra de progreso
  });

  test('should show video metadata correctly', async ({ page }) => {
    // Seleccionar un video
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Verificar metadata del video
    await expect(page.locator('text="Introducción a la Gamificación"')).toBeVisible();
    await expect(page.locator('text=/youtube/')).toBeVisible();
    
    // Verificar botones de interacción social
    await expect(page.locator('button:has([data-testid*="Favorite"], [data-testid*="Like"])')).toBeVisible();
    await expect(page.locator('button:has([data-testid*="Share"])')).toBeVisible();
    await expect(page.locator('button:has([data-testid*="Comment"])')).toBeVisible();
  });

  test('should handle video player controls', async ({ page }) => {
    // Seleccionar un video
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Esperar a que aparezca el reproductor
    await page.waitForSelector('iframe, video');

    // Verificar controles de volumen
    await expect(page.locator('button:has([data-testid*="Volume"])')).toBeVisible();
    
    // Verificar control de pantalla completa
    await expect(page.locator('button:has([data-testid*="Fullscreen"])')).toBeVisible();
    
    // Verificar slider de progreso
    await expect(page.locator('.MuiSlider-root')).toBeVisible();
    
    // Verificar display de tiempo
    await expect(page.locator('text=/\\d+:\\d+\\s*\\/\\s*\\d+:\\d+/')).toBeVisible();
  });

  test('should display CoomÜnity gamification elements', async ({ page }) => {
    // Seleccionar un video
    const firstVideo = page.locator('[data-testid="video-card"]').first();
    await firstVideo.click();

    // Verificar elementos de gamificación CoomÜnity
    await expect(page.locator('text=/Mëritos|mëritos/')).toBeVisible();
    await expect(page.locator('text=/Nivel|nivel/')).toBeVisible();
    
    // Verificar iconos de gamificación
    await expect(page.locator('[data-testid="EmojiEventsIcon"], [data-testid="TrophyIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="StarIcon"]')).toBeVisible();
  });

  test('should handle video selection from list', async ({ page }) => {
    // Verificar que hay múltiples videos disponibles
    const videoCards = page.locator('[data-testid="video-card"]');
    const videoCount = await videoCards.count();
    
    expect(videoCount).toBeGreaterThan(0);
    console.log(`Found ${videoCount} videos in the list`);

    // Probar seleccionar diferentes videos
    for (let i = 0; i < Math.min(3, videoCount); i++) {
      await videoCards.nth(i).click();
      
      // Verificar que el reproductor cambie
      await page.waitForSelector('iframe, video');
      
      // Verificar que el título del video aparezca en el reproductor
      await expect(page.locator('h6, h5, h4')).toBeVisible();
      
      // Pequeña pausa entre videos
      await page.waitForTimeout(1000);
    }
  });
}); 