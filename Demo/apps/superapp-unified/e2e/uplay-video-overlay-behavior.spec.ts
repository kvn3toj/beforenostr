import { test, expect } from '@playwright/test';

test.describe('ÜPlay Video Overlay Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la aplicación
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Hacer login si es necesario
    const loginButton = page.locator('button:has-text("Entrar")');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[type="email"]', 'admin@gamifier.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }
    
    // Navegar a ÜPlay
    await page.click('text=ÜPlay');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que carguen los videos
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
  });

  test('🎯 Should hide video info overlay during playback and show on pause/hover', async ({ page }) => {
    console.log('🎮 Testing video overlay behavior...');
    
    // Seleccionar el primer video
    const firstVideo = page.locator('.MuiCard-root').first();
    await firstVideo.click();
    
    // Esperar a que aparezca el reproductor
    await page.waitForSelector('[data-testid="video-player"], iframe, video', { timeout: 10000 });
    
    // Verificar que el overlay de información esté visible inicialmente
    const videoOverlay = page.locator('.MuiCard-root').last(); // El overlay del video actual
    await expect(videoOverlay).toBeVisible();
    console.log('✅ Video overlay visible initially');
    
    // Hacer clic en play (si hay botón de play visible)
    const playButton = page.locator('button[aria-label*="play"], button:has(svg[data-testid="PlayArrowIcon"])');
    if (await playButton.isVisible()) {
      await playButton.click();
      console.log('🎬 Play button clicked');
      
      // Esperar 4 segundos para que el overlay se oculte
      await page.waitForTimeout(4000);
      
      // Verificar que el overlay de información se haya ocultado
      // (Para Zoom transition, el elemento puede seguir en el DOM pero invisible)
      const overlayOpacity = await videoOverlay.evaluate(el => window.getComputedStyle(el).opacity);
      expect(parseFloat(overlayOpacity)).toBeLessThan(1);
      console.log('✅ Video overlay hidden during playback');
      
      // Mover el mouse sobre el reproductor para que aparezca de nuevo
      const videoContainer = page.locator('[data-testid="video-player"], .MuiBox-root').first();
      await videoContainer.hover();
      
      // Esperar un poco para que la transición se complete
      await page.waitForTimeout(1000);
      
      // Verificar que el overlay reaparezca al hacer hover
      const overlayOpacityAfterHover = await videoOverlay.evaluate(el => window.getComputedStyle(el).opacity);
      expect(parseFloat(overlayOpacityAfterHover)).toBeGreaterThan(0.5);
      console.log('✅ Video overlay reappears on hover');
      
      // Hacer clic en pause para verificar que el overlay permanece visible
      const pauseButton = page.locator('button[aria-label*="pause"], button:has(svg[data-testid="PauseIcon"])');
      if (await pauseButton.isVisible()) {
        await pauseButton.click();
        console.log('⏸️ Pause button clicked');
        
        // Verificar que el overlay permanece visible cuando está pausado
        await page.waitForTimeout(1000);
        const overlayOpacityAfterPause = await videoOverlay.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(overlayOpacityAfterPause)).toBeGreaterThan(0.8);
        console.log('✅ Video overlay remains visible when paused');
      }
    }
  });

  test('🎬 Should handle video info overlay transitions smoothly', async ({ page }) => {
    console.log('🎮 Testing smooth overlay transitions...');
    
    // Seleccionar el primer video
    const firstVideo = page.locator('.MuiCard-root').first();
    await firstVideo.click();
    
    // Esperar a que aparezca el reproductor
    await page.waitForSelector('[data-testid="video-player"], iframe, video', { timeout: 10000 });
    
    // Verificar que hay elementos de información del video en el overlay
    const videoTitle = page.locator('h6, h5, h4').first();
    await expect(videoTitle).toBeVisible();
    console.log('✅ Video title visible in overlay');
    
    // Verificar que hay chips con información (duración, categorías, etc.)
    const chips = page.locator('.MuiChip-root');
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(0);
    console.log(`✅ ${chipCount} info chips visible in overlay`);
    
    // Verificar que hay botones de acción (like, share, notes)
    const actionButtons = page.locator('button:has(svg[data-testid="FavoriteIcon"]), button:has(svg[data-testid="ShareIcon"]), button:has(svg[data-testid="CommentIcon"])');
    const actionButtonCount = await actionButtons.count();
    expect(actionButtonCount).toBeGreaterThan(0);
    console.log(`✅ ${actionButtonCount} action buttons visible in overlay`);
    
    // Verificar que hay indicador de progreso
    const progressBar = page.locator('.MuiLinearProgress-root').last();
    await expect(progressBar).toBeVisible();
    console.log('✅ Progress indicator visible in overlay');
  });

  test('📱 Should not interfere with video controls', async ({ page }) => {
    console.log('🎮 Testing overlay doesn\'t interfere with controls...');
    
    // Seleccionar el primer video
    const firstVideo = page.locator('.MuiCard-root').first();
    await firstVideo.click();
    
    // Esperar a que aparezca el reproductor
    await page.waitForSelector('[data-testid="video-player"], iframe, video', { timeout: 10000 });
    
    // Verificar que los controles de video están accesibles
    const playPauseButton = page.locator('button[aria-label*="play"], button[aria-label*="pause"]');
    await expect(playPauseButton).toBeVisible();
    console.log('✅ Play/pause button accessible');
    
    // Verificar que la barra de progreso está accesible
    const progressSlider = page.locator('.MuiSlider-root');
    await expect(progressSlider.first()).toBeVisible();
    console.log('✅ Progress slider accessible');
    
    // Verificar que los controles de volumen están accesibles
    const volumeButton = page.locator('button:has(svg[data-testid="VolumeUpIcon"]), button:has(svg[data-testid="VolumeOffIcon"])');
    await expect(volumeButton).toBeVisible();
    console.log('✅ Volume controls accessible');
    
    // Verificar que el botón de fullscreen está accesible
    const fullscreenButton = page.locator('button:has(svg[data-testid="FullscreenIcon"])');
    await expect(fullscreenButton).toBeVisible();
    console.log('✅ Fullscreen button accessible');
  });
}); 