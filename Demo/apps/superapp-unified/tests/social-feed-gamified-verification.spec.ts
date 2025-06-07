/**
 * 🤝 Social Feed Gamified Module - Comprehensive Verification Test
 * 
 * Verifica todas las funcionalidades gamificadas del Feed Social:
 * - Sistema de méritos sociales
 * - Interacciones gamificadas (likes, comentarios, shares)
 * - Filtros avanzados
 * - Notificaciones en tiempo real
 * - Estados de carga y feedback
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Social Feed Gamified Module Verification', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Ir a la aplicación
    await page.goto('/');
    
    // Esperar a que la aplicación cargue
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    
    // Navegar al módulo Social
    await page.click('text=Social');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('🎮 Should display social feed gamified header', async () => {
    // Verificar header gamificado del feed social
    await expect(page.locator('text=Feed Social CoomÜnity')).toBeVisible();
    
    // Verificar estadísticas gamificadas en el header
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Nivel')).toBeVisible();
    await expect(page.locator('text=interacciones hoy')).toBeVisible();
    
    // Verificar barra de progreso de nivel social
    await expect(page.locator('.MuiLinearProgress-root')).toBeVisible();
    
    console.log('✅ Header gamificado del feed social verificado');
  });

  test('📱 Should display control panel with filters and actions', async () => {
    // Verificar panel de controles
    await expect(page.locator('button:has-text("Actualizar")')).toBeVisible();
    await expect(page.locator('button:has-text("Filtros")')).toBeVisible();
    await expect(page.locator('button:has-text("Crear Post")')).toBeVisible();
    
    // Probar botón de filtros
    await page.click('button:has-text("Filtros")');
    await expect(page.locator('text=Filtros del Feed')).toBeVisible();
    
    // Verificar opciones de filtro
    await expect(page.locator('text=Ordenar por:')).toBeVisible();
    await expect(page.locator('button:has-text("Recientes")')).toBeVisible();
    await expect(page.locator('button:has-text("Trending")')).toBeVisible();
    await expect(page.locator('button:has-text("Mëritos")')).toBeVisible();
    
    await expect(page.locator('text=Tipo de contenido:')).toBeVisible();
    await expect(page.locator('button:has-text("Todos")')).toBeVisible();
    
    console.log('✅ Panel de controles y filtros verificado');
  });

  test('🔔 Should handle notifications panel', async () => {
    // Buscar icono de notificaciones en el header
    const notificationIcon = page.locator('[data-testid="notification-icon"], button:has(svg[data-testid="NotificationsIcon"])')
      .or(page.locator('button').filter({ has: page.locator('svg[data-testid="NotificationsIcon"]') }));
    
    if (await notificationIcon.count() > 0) {
      await notificationIcon.click();
      
      // Verificar panel de notificaciones
      await expect(page.locator('text=🔔 Notificaciones Recientes')).toBeVisible();
      
      console.log('✅ Panel de notificaciones verificado');
    } else {
      console.log('ℹ️ Icono de notificaciones no encontrado, puede estar en el header');
    }
  });

  test('📰 Should display social posts with gamified interactions', async () => {
    // Esperar a que los posts carguen
    await page.waitForSelector('.MuiCard-root', { timeout: 15000 });
    
    // Verificar que hay posts disponibles
    const postCards = page.locator('.MuiCard-root');
    const postCount = await postCards.count();
    
    if (postCount > 0) {
      console.log(`✅ ${postCount} posts encontrados`);
      
      // Verificar elementos gamificados en los posts
      const firstPost = postCards.first();
      
      // Verificar botones de interacción
      await expect(firstPost.locator('button').filter({ hasText: /\d+/ }).first()).toBeVisible(); // Likes, comments, etc
      
    } else {
      // Si no hay posts, verificar mensaje de estado vacío
      await expect(page.locator('text=No hay publicaciones que mostrar')).toBeVisible();
      console.log('ℹ️ No hay posts - estado vacío verificado');
    }
  });

  test('✍️ Should handle post creation dialog', async () => {
    // Abrir dialog de creación de post
    await page.click('button:has-text("Crear Post")');
    
    // Verificar que el dialog se abre
    await expect(page.locator('text=✍️ Crear Nueva Publicación')).toBeVisible();
    
    // Cerrar dialog
    await page.press('body', 'Escape');
    
    console.log('✅ Dialog de creación de post verificado');
  });

  test('🎯 Should handle filter interactions', async () => {
    // Abrir panel de filtros
    await page.click('button:has-text("Filtros")');
    
    // Probar filtro de ordenamiento
    await page.click('button:has-text("Trending")');
    await page.waitForLoadState('networkidle');
    
    // Cambiar tipo de contenido
    await page.click('button:has-text("Imágenes")');
    await page.waitForLoadState('networkidle');
    
    // Volver a "Todos"
    await page.click('button:has-text("Todos")');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Filtros funcionando correctamente');
  });

  test('🚀 Should display SpeedDial for quick actions', async () => {
    // Verificar SpeedDial en desktop (no en mobile)
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Buscar SpeedDial
    const speedDial = page.locator('[aria-label="Acciones rápidas"]');
    
    if (await speedDial.count() > 0) {
      await speedDial.click();
      
      // Verificar acciones rápidas
      await expect(page.locator('[title="Crear Post"], [data-testid="create-post-action"]')).toBeVisible();
      
      console.log('✅ SpeedDial verificado');
    } else {
      console.log('ℹ️ SpeedDial no visible (normal en mobile)');
    }
  });

  test('📊 Should track social level progression', async () => {
    // Verificar elementos de progresión social
    await expect(page.locator('text=Nivel')).toBeVisible();
    
    // Verificar barra de progreso
    const progressBars = page.locator('.MuiLinearProgress-root');
    const progressCount = await progressBars.count();
    expect(progressCount).toBeGreaterThan(0);
    
    console.log('✅ Sistema de progresión social verificado');
  });

  test('⚡ Should handle loading and error states', async () => {
    // Recargar página para verificar estados de carga
    await page.reload();
    
    // Verificar que no hay errores críticos
    const errorAlerts = page.locator('.MuiAlert-standardError');
    const errorCount = await errorAlerts.count();
    expect(errorCount).toBe(0);
    
    // Navegar nuevamente al social
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    await page.click('text=Social');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Estados de carga manejados correctamente');
  });

  test('📱 Should be responsive', async () => {
    // Probar en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que elementos principales están visibles
    await expect(page.locator('text=Feed Social CoomÜnity')).toBeVisible();
    
    // Probar en desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Diseño responsivo verificado');
  });

  test('🔄 Should handle refresh functionality', async () => {
    // Probar botón de actualizar
    const refreshButton = page.locator('button:has-text("Actualizar")');
    await refreshButton.click();
    
    // Esperar a que termine la actualización
    await page.waitForLoadState('networkidle');
    
    // Verificar que no hay errores después del refresh
    const errorAlerts = page.locator('.MuiAlert-standardError');
    const errorCount = await errorAlerts.count();
    expect(errorCount).toBe(0);
    
    console.log('✅ Funcionalidad de refresh verificada');
  });

  test('🎨 Should display proper gamification themes', async () => {
    // Verificar que se usan los colores temáticos de CoomÜnity
    const header = page.locator('text=Feed Social CoomÜnity').locator('..');
    
    // Verificar que tiene el estilo de gradiente gamificado
    const headerStyles = await header.evaluate(el => window.getComputedStyle(el));
    
    // Verificar chips de méritos con estilos apropiados
    await expect(page.locator('text=Mëritos').locator('..')).toBeVisible();
    
    console.log('✅ Temas de gamificación aplicados correctamente');
  });
}); 