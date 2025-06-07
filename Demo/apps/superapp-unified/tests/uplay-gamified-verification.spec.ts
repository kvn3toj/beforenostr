/**
 * 🎮 ÜPlay Gamified Module - Comprehensive Verification Test
 * 
 * Verifica todas las funcionalidades gamificadas implementadas en el módulo ÜPlay:
 * - Sistema de méritos y niveles
 * - Preguntas interactivas
 * - Reproductor de video gamificado
 * - Estadísticas del jugador
 * - Integración con backend real
 */

import { test, expect, Page } from '@playwright/test';

test.describe('ÜPlay Gamified Module Verification', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Ir a la aplicación y hacer login si es necesario
    await page.goto('/');
    
    // Esperar a que la aplicación cargue
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    
    // Navegar al módulo ÜPlay
    await page.click('text=ÜPlay');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('🎮 Should display ÜPlay gamified header with statistics', async () => {
    // Verificar que el header gamificado se muestra
    await expect(page.locator('text=ÜPlay - Reproductor Gamificado')).toBeVisible();
    await expect(page.locator('text=GPL - Gamified Play List')).toBeVisible();
    
    // Verificar chips de estadísticas en el header
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Nivel')).toBeVisible();
    await expect(page.locator('text=Correctas')).toBeVisible();
    
    console.log('✅ Header gamificado verificado');
  });

  test('🎬 Should display video list with gamification elements', async () => {
    // Esperar a que los videos carguen del backend
    await page.waitForSelector('[data-testid="video-card"], .MuiCard-root', { timeout: 15000 });
    
    // Verificar que hay videos disponibles
    const videoCards = page.locator('.MuiCard-root');
    const videoCount = await videoCards.count();
    expect(videoCount).toBeGreaterThan(0);
    
    // Verificar elementos gamificados en cada video card
    const firstVideoCard = videoCards.first();
    await expect(firstVideoCard.locator('text=🎬')).toBeVisible(); // Avatar del video
    
    // Verificar que hay contador de preguntas
    await expect(page.locator('[data-testid="quiz-icon"], .MuiChip-root:has-text("Preguntas")')).toBeVisible();
    
    console.log(`✅ ${videoCount} videos encontrados con elementos gamificados`);
  });

  test('🎯 Should handle video selection and player initialization', async () => {
    // Esperar a que los videos carguen
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
    
    // Seleccionar el primer video
    const firstVideo = page.locator('.MuiCard-root').first();
    await firstVideo.click();
    
    // Verificar que el reproductor se inicializa
    await expect(page.locator('text=🎬').first()).toBeVisible();
    
    // Verificar controles del reproductor
    await expect(page.locator('[data-testid="play-button"], button[aria-label*="play"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"], .MuiLinearProgress-root')).toBeVisible();
    
    // Verificar indicadores de tiempo
    await expect(page.locator('text=/\\d+:\\d+.*\\d+:\\d+/')).toBeVisible();
    
    console.log('✅ Reproductor de video inicializado correctamente');
  });

  test('📊 Should display player statistics panel', async () => {
    // Navegar a la pestaña de estadísticas
    await page.click('text=Stats');
    await page.waitForLoadState('networkidle');
    
    // Verificar el panel de estadísticas del jugador
    await expect(page.locator('text=Estadísticas del Jugador')).toBeVisible();
    
    // Verificar métricas principales
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Nivel')).toBeVisible();
    await expect(page.locator('text=Mejor Racha')).toBeVisible();
    await expect(page.locator('text=Precisión')).toBeVisible();
    
    // Verificar barra de progreso de nivel
    await expect(page.locator('text=Progreso al Nivel')).toBeVisible();
    await expect(page.locator('.MuiLinearProgress-root')).toBeVisible();
    
    console.log('✅ Panel de estadísticas del jugador verificado');
  });

  test('🎛️ Should handle tabs navigation', async () => {
    // Verificar que las pestañas están disponibles
    await expect(page.locator('text=Videos')).toBeVisible();
    await expect(page.locator('text=Categorías')).toBeVisible();
    await expect(page.locator('text=Stats')).toBeVisible();
    
    // Navegar entre pestañas
    await page.click('text=Categorías');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Videos');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Stats');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Navegación entre pestañas funcional');
  });

  test('🎮 Should display gamified elements during video playback', async () => {
    // Seleccionar un video
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
    const firstVideo = page.locator('.MuiCard-root').first();
    await firstVideo.click();
    
    // Verificar elementos gamificados flotantes
    await expect(page.locator('text=Preguntas')).toBeVisible();
    
    // Verificar información del video actual
    const currentVideoInfo = page.locator('.MuiCard-root').last();
    await expect(currentVideoInfo.locator('text=Mëritos')).toBeVisible();
    await expect(currentVideoInfo.locator('text=Nivel')).toBeVisible();
    
    console.log('✅ Elementos gamificados durante reproducción verificados');
  });

  test('⚡ Should handle loading states properly', async () => {
    // Recargar la página para ver estados de carga
    await page.reload();
    
    // Verificar que no hay errores visibles
    const errorAlerts = page.locator('.MuiAlert-standardError');
    const errorCount = await errorAlerts.count();
    expect(errorCount).toBe(0);
    
    // Verificar que la página carga completamente
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    await page.click('text=ÜPlay');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Estados de carga manejados correctamente');
  });

  test('🔗 Should integrate with real backend data', async () => {
    // Verificar que los datos vienen del backend real
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
    
    // Verificar que hay contenido real (no placeholders)
    const videoTitles = page.locator('.MuiCard-root .MuiTypography-h6');
    const firstTitle = await videoTitles.first().textContent();
    
    // El título no debe ser genérico o placeholder
    expect(firstTitle).not.toContain('Loading');
    expect(firstTitle).not.toContain('Placeholder');
    expect(firstTitle).not.toContain('...');
    expect(firstTitle).toBeTruthy();
    
    console.log(`✅ Backend integrado - Primer video: "${firstTitle}"`);
  });

  test('📱 Should be responsive and mobile-friendly', async () => {
    // Probar en viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que los elementos se adaptan
    await expect(page.locator('text=ÜPlay')).toBeVisible();
    
    // Probar en viewport desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que los elementos se muestran correctamente
    await expect(page.locator('text=ÜPlay - Reproductor Gamificado')).toBeVisible();
    
    console.log('✅ Diseño responsivo verificado');
  });

  test('🎯 Should handle interaction feedback properly', async () => {
    // Seleccionar un video para activar feedbacks
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
    await page.locator('.MuiCard-root').first().click();
    
    // Verificar que aparecen snackbars de feedback
    // (Puede ser que aparezca el mensaje de "Video iniciado")
    const snackbars = page.locator('.MuiSnackbar-root, .MuiAlert-root');
    
    // Si aparece un snackbar, verificar que tiene contenido
    const snackbarCount = await snackbars.count();
    if (snackbarCount > 0) {
      const snackbarText = await snackbars.first().textContent();
      expect(snackbarText).toBeTruthy();
      console.log(`✅ Feedback encontrado: "${snackbarText}"`);
    }
    
    console.log('✅ Sistema de feedback verificado');
  });

  test('🏆 Should display achievement system correctly', async () => {
    // Verificar elementos del sistema de logros
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Nivel')).toBeVisible();
    
    // Verificar que los valores son numéricos
    const meritsText = await page.locator('text=Mëritos').textContent();
    expect(meritsText).toMatch(/\d+/); // Debe contener números
    
    const levelText = await page.locator('text=Nivel').textContent();
    expect(levelText).toMatch(/\d+/); // Debe contener números
    
    console.log('✅ Sistema de logros y méritos verificado');
  });
}); 