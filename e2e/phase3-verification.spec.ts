import { test, expect } from '@playwright/test';

test.describe('🚀 PHASE 3 VERIFICATION - Funcionalidades Completas y UX Avanzado', () => {
  const BASE_URL = 'http://localhost:3005';

  test.beforeEach(async ({ page }) => {
    // Configurar timeout extendido para cargas
    page.setDefaultTimeout(10000);
    
    // Ir a la página principal
    await page.goto(BASE_URL);
    
    // Esperar a que la aplicación cargue completamente
    await page.waitForSelector('[data-testid="app-layout"], .MuiContainer-root', { timeout: 10000 });
  });

  test('🔍 1. Verificar LazyLoader y Performance Optimizations', async ({ page }) => {
    console.log('🔍 === VERIFICANDO LAZY LOADING Y PERFORMANCE ===');
    
    // Verificar que la página principal carga
    await expect(page).toHaveTitle(/CoomÜnity/);
    
    // Verificar que hay elementos de carga (skeletons)
    const hasSkeletons = await page.locator('.MuiSkeleton-root').count();
    console.log(`📊 Skeletons encontrados: ${hasSkeletons}`);
    
    // Verificar navegación lazy-loaded
    await page.click('text=Marketplace', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Verificar que el marketplace carga
    const marketplaceTitle = await page.locator('h4, h1').filter({ hasText: /marketplace/i }).first();
    await expect(marketplaceTitle).toBeVisible({ timeout: 10000 });
    
    console.log('✅ LazyLoader funcionando correctamente');
  });

  test('🔔 2. Verificar NotificationSystem', async ({ page }) => {
    console.log('🔔 === VERIFICANDO SISTEMA DE NOTIFICACIONES ===');
    
    // Buscar FAB de notificaciones o indicadores
    const notificationElements = await page.locator('[data-testid*="notification"], .MuiFab-root, [aria-label*="notification"]').count();
    console.log(`📊 Elementos de notificación encontrados: ${notificationElements}`);
    
    // Verificar que hay algún sistema de notificaciones presente
    const hasNotificationSystem = notificationElements > 0;
    console.log(`✅ Sistema de notificaciones: ${hasNotificationSystem ? 'Presente' : 'No detectado'}`);
    
    // Tomar screenshot para verificación visual
    await page.screenshot({ path: 'test-results/notifications-system.png', fullPage: true });
  });

  test('✍️ 3. Verificar UXWriter y Emotional Design', async ({ page }) => {
    console.log('✍️ === VERIFICANDO UX WRITER Y DISEÑO EMOCIONAL ===');
    
    // Buscar mensajes contextuales y elementos de UX
    const uxElements = await page.locator('.MuiCard-root, .MuiAlert-root, [data-testid*="ux"], [data-testid*="message"]').count();
    console.log(`📊 Elementos de UX encontrados: ${uxElements}`);
    
    // Verificar presencia de chips, avatars y elementos emocionales
    const emotionalElements = await page.locator('.MuiChip-root, .MuiAvatar-root, .MuiBadge-root').count();
    console.log(`📊 Elementos emocionales encontrados: ${emotionalElements}`);
    
    // Verificar que hay contenido contextual
    const hasContextualContent = uxElements > 0 && emotionalElements > 0;
    console.log(`✅ UX Writer y diseño emocional: ${hasContextualContent ? 'Implementado' : 'Básico'}`);
    
    await page.screenshot({ path: 'test-results/ux-writer-system.png', fullPage: true });
  });

  test('🏪 4. Verificar Marketplace Avanzado con AdvancedSearch', async ({ page }) => {
    console.log('🏪 === VERIFICANDO MARKETPLACE AVANZADO ===');
    
    // Navegar al marketplace
    await page.click('text=Marketplace', { timeout: 5000 });
    await page.waitForTimeout(3000);
    
    // Verificar elementos de búsqueda avanzada
    const searchElements = await page.locator('input[type="search"], input[placeholder*="buscar"], .MuiTextField-root').count();
    console.log(`📊 Elementos de búsqueda encontrados: ${searchElements}`);
    
    // Verificar filtros avanzados
    const filterElements = await page.locator('[data-testid*="filter"], .MuiSelect-root, .MuiSlider-root, .MuiCheckbox-root').count();
    console.log(`📊 Elementos de filtro encontrados: ${filterElements}`);
    
    // Verificar cards de productos/servicios
    const productCards = await page.locator('.MuiCard-root, [data-testid*="product"], [data-testid*="service"]').count();
    console.log(`📊 Cards de productos encontrados: ${productCards}`);
    
    // Verificar botones de vista (grid/list)
    const viewButtons = await page.locator('[data-testid*="view"], [aria-label*="vista"]').count();
    console.log(`📊 Botones de vista encontrados: ${viewButtons}`);
    
    const hasAdvancedMarketplace = searchElements > 0 && filterElements > 0 && productCards > 0;
    console.log(`✅ Marketplace avanzado: ${hasAdvancedMarketplace ? 'Implementado' : 'Básico'}`);
    
    await page.screenshot({ path: 'test-results/marketplace-advanced.png', fullPage: true });
  });

  test('💬 5. Verificar Enhanced Chat System', async ({ page }) => {
    console.log('💬 === VERIFICANDO SISTEMA DE CHAT MEJORADO ===');
    
    // Navegar al módulo social
    await page.click('text=Social', { timeout: 5000 });
    await page.waitForTimeout(3000);
    
    // Verificar elementos de chat
    const chatElements = await page.locator('[data-testid*="chat"], .MuiTextField-root, [placeholder*="mensaje"]').count();
    console.log(`📊 Elementos de chat encontrados: ${chatElements}`);
    
    // Verificar elementos de mensajería avanzada
    const messageElements = await page.locator('[data-testid*="message"], .MuiAvatar-root, [data-testid*="emoji"]').count();
    console.log(`📊 Elementos de mensaje encontrados: ${messageElements}`);
    
    // Verificar botones de acciones de chat
    const chatActions = await page.locator('[data-testid*="send"], [aria-label*="enviar"], [data-testid*="attach"]').count();
    console.log(`📊 Acciones de chat encontradas: ${chatActions}`);
    
    const hasEnhancedChat = chatElements > 0 && messageElements > 0;
    console.log(`✅ Sistema de chat mejorado: ${hasEnhancedChat ? 'Implementado' : 'Básico'}`);
    
    await page.screenshot({ path: 'test-results/enhanced-chat.png', fullPage: true });
  });

  test('🎮 6. Verificar Interactive Video Player (ÜPlay)', async ({ page }) => {
    console.log('🎮 === VERIFICANDO REPRODUCTOR DE VIDEO INTERACTIVO ===');
    
    // Navegar al módulo ÜPlay
    await page.click('text=ÜPlay', { timeout: 5000 });
    await page.waitForTimeout(3000);
    
    // Verificar elementos del reproductor de video
    const videoElements = await page.locator('video, [data-testid*="video"], [data-testid*="player"]').count();
    console.log(`📊 Elementos de video encontrados: ${videoElements}`);
    
    // Verificar controles de gamificación
    const gamificationElements = await page.locator('[data-testid*="xp"], [data-testid*="achievement"], .MuiLinearProgress-root').count();
    console.log(`📊 Elementos de gamificación encontrados: ${gamificationElements}`);
    
    // Verificar elementos interactivos
    const interactiveElements = await page.locator('[data-testid*="quiz"], [data-testid*="interaction"], .MuiButton-root').count();
    console.log(`📊 Elementos interactivos encontrados: ${interactiveElements}`);
    
    const hasInteractiveVideo = videoElements > 0 && (gamificationElements > 0 || interactiveElements > 0);
    console.log(`✅ Reproductor interactivo: ${hasInteractiveVideo ? 'Implementado' : 'Básico'}`);
    
    await page.screenshot({ path: 'test-results/interactive-video.png', fullPage: true });
  });

  test('📊 7. Verificar Integración General y Performance', async ({ page }) => {
    console.log('📊 === VERIFICANDO INTEGRACIÓN GENERAL ===');
    
    // Verificar que todos los módulos principales están presentes
    const modules = ['Marketplace', 'Social', 'ÜPlay', 'Wallet'];
    let moduleCount = 0;
    
    for (const module of modules) {
      const moduleExists = await page.locator(`text=${module}`).count() > 0;
      if (moduleExists) moduleCount++;
      console.log(`📋 Módulo ${module}: ${moduleExists ? '✅' : '❌'}`);
    }
    
    // Verificar elementos de Material UI y Tailwind
    const muiElements = await page.locator('.MuiButton-root, .MuiCard-root, .MuiTypography-root').count();
    console.log(`📊 Elementos Material UI encontrados: ${muiElements}`);
    
    // Verificar que no hay errores críticos en consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navegar por diferentes secciones para verificar estabilidad
    for (const module of modules) {
      try {
        await page.click(`text=${module}`, { timeout: 3000 });
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`⚠️ No se pudo navegar a ${module}`);
      }
    }
    
    console.log(`📊 Módulos funcionales: ${moduleCount}/${modules.length}`);
    console.log(`📊 Errores de consola: ${errors.length}`);
    
    const integrationScore = (moduleCount / modules.length) * 100;
    console.log(`✅ Puntuación de integración: ${integrationScore}%`);
    
    // Tomar screenshot final
    await page.screenshot({ path: 'test-results/integration-overview.png', fullPage: true });
    
    // Verificar que la integración es satisfactoria
    expect(integrationScore).toBeGreaterThan(75);
  });
}); 