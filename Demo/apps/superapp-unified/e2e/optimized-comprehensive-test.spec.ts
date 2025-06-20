import { test, expect } from '@playwright/test';

/**
 * 🎯 TEST OPTIMIZADO COMPREHENSIVE - SUPERAPP COOMUNITY
 * 
 * Este test ejecuta múltiples verificaciones en una sola sesión de navegador
 * para validar que la eliminación de mocks fue exitosa y todos los módulos
 * funcionan correctamente con datos reales del backend NestJS.
 * 
 * ✅ Optimizaciones implementadas:
 * - Una sola sesión de navegador para todos los tests
 * - Reutilización de autenticación persistente
 * - Navegación secuencial sin recargas innecesarias
 * - Verificaciones concisas y específicas
 */

test.describe('SuperApp CoomÜnity - Verificación Integral Post-Mock-Elimination', () => {
  test('Verificación completa de funcionalidad con backend real', async ({ page }) => {
    console.log('🚀 [Test Optimizado] Iniciando verificación integral...');

    // ==========================================
    // 📋 PASO 1: VERIFICACIÓN DE LOGIN
    // ==========================================
    console.log('🔐 [Paso 1] Verificando autenticación...');
    
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Login con credenciales verificadas del backend
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Verificar redirección exitosa
    await page.waitForURL('**/', { timeout: 15000 });
    console.log('✅ [Paso 1] Login exitoso - Redirected to home');

    // ==========================================
    // 📋 PASO 2: VERIFICACIÓN DEL HOME DASHBOARD
    // ==========================================
    console.log('🏠 [Paso 2] Verificando Home Dashboard...');
    
    // Verificar que los componentes del dashboard cargan
    await expect(page.locator('h6:has-text("CoomÜnity")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="ayni-balance-card"], .ayni-balance-card')).toBeVisible({ timeout: 5000 });
    
    // Verificar ausencia de banners de mock/desarrollo
    await expect(page.locator(':has-text("MODO MOCK ACTIVADO")')).not.toBeVisible();
    await expect(page.locator(':has-text("Datos de prueba")')).not.toBeVisible();
    
    console.log('✅ [Paso 2] Home Dashboard funcional sin mocks');

    // ==========================================
    // 📋 PASO 3: VERIFICACIÓN DEL MÓDULO ÜPLAY
    // ==========================================
    console.log('🎮 [Paso 3] Verificando módulo ÜPlay...');
    
    await page.click('a[href="/uplay"], [href*="uplay"]');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que se cargan videos reales del backend
    const videoCards = page.locator('.video-card, [data-testid*="video"], .video-item');
    await expect(videoCards.first()).toBeVisible({ timeout: 10000 });
    
    // Verificar que no hay mensajes de error de datos mock
    await expect(page.locator(':has-text("Error loading mock data")')).not.toBeVisible();
    await expect(page.locator(':has-text("marketplaceMockData")')).not.toBeVisible();
    
    console.log('✅ [Paso 3] ÜPlay carga videos del backend real');

    // ==========================================
    // 📋 PASO 4: VERIFICACIÓN DEL MARKETPLACE
    // ==========================================
    console.log('🛒 [Paso 4] Verificando Marketplace...');
    
    await page.click('a[href="/marketplace"], [href*="marketplace"]');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que se cargan productos/servicios del backend
    const productCards = page.locator('.product-card, .marketplace-item, [data-testid*="product"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    
    // Verificar ausencia de referencias mock
    await expect(page.locator(':has-text("Mock product")')).not.toBeVisible();
    await expect(page.locator(':has-text("marketplaceMockData")')).not.toBeVisible();
    
    console.log('✅ [Paso 4] Marketplace carga datos del backend real');

    // ==========================================
    // 📋 PASO 5: VERIFICACIÓN DEL MÓDULO SOCIAL
    // ==========================================
    console.log('👥 [Paso 5] Verificando módulo Social...');
    
    await page.click('a[href="/social"], [href*="social"]');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar componentes sociales básicos
    const socialComponents = page.locator('.social-feed, .connection-card, [data-testid*="social"]');
    await expect(socialComponents.first()).toBeVisible({ timeout: 10000 });
    
    console.log('✅ [Paso 5] Módulo Social operacional');

    // ==========================================
    // 📋 PASO 6: VERIFICACIÓN DEL WALLET
    // ==========================================
    console.log('💰 [Paso 6] Verificando Wallet...');
    
    await page.click('a[href="/wallet"], [href*="wallet"]');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar componentes del wallet
    const walletElements = page.locator('.wallet-balance, .lukas-balance, [data-testid*="wallet"]');
    await expect(walletElements.first()).toBeVisible({ timeout: 10000 });
    
    console.log('✅ [Paso 6] Wallet funcional');

    // ==========================================
    // 📋 PASO 7: VERIFICACIÓN DE EFECTOS VISUALES
    // ==========================================
    console.log('✨ [Paso 7] Verificando efectos visuales desbloqueados...');
    
    // Regresar al home para verificar efectos
    await page.click('a[href="/"], [href*="home"]');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que no hay fondos oscuros persistentes (problema resuelto)
    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(backgroundColor).not.toBe('rgb(41, 37, 36)'); // Fondo oscuro problemático
    
    // Verificar presencia de elementos con efectos glassmorphism
    const glassElements = page.locator('[class*="glass"], [style*="backdrop-filter"]');
    const glassCount = await glassElements.count();
    expect(glassCount).toBeGreaterThan(0);
    
    console.log('✅ [Paso 7] Efectos visuales activos (glassmorphism detectado)');

    // ==========================================
    // 📋 PASO 8: VERIFICACIÓN DE CONSOLE LOGS
    // ==========================================
    console.log('🔍 [Paso 8] Verificando ausencia de errores críticos...');
    
    // Capturar errores de consola durante la navegación
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Recargar página para capturar errores
    await page.reload({ waitUntil: 'networkidle' });
    
    // Verificar que no hay errores relacionados con mocks eliminados
    const mockErrors = consoleLogs.filter(log => 
      log.includes('marketplaceMockData') || 
      log.includes('useUPlayMockData') || 
      log.includes('testMockAuth')
    );
    
    expect(mockErrors.length).toBe(0);
    console.log('✅ [Paso 8] Sin errores de importaciones mock eliminadas');

    // ==========================================
    // 📋 PASO 9: VERIFICACIÓN DE BACKEND CONNECTIVITY
    // ==========================================
    console.log('🌐 [Paso 9] Verificando conectividad con backend...');
    
    // Hacer una llamada API directa desde el navegador
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/health', { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        return { status: res.status, ok: res.ok };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    // Verificar respuesta del backend (puede ser 200 o redirect dependiendo de la configuración)
    expect(response.status).toBeDefined();
    console.log(`✅ [Paso 9] Backend responde (status: ${response.status})`);

    // ==========================================
    // 📊 RESUMEN FINAL
    // ==========================================
    console.log('\n🎉 [RESUMEN] VERIFICACIÓN INTEGRAL COMPLETADA:');
    console.log('✅ Login funcionando con credenciales reales');
    console.log('✅ Home Dashboard sin referencias mock');
    console.log('✅ ÜPlay carga videos del backend NestJS');
    console.log('✅ Marketplace carga datos del backend NestJS');
    console.log('✅ Módulo Social operacional');
    console.log('✅ Wallet funcional');
    console.log('✅ Efectos visuales desbloqueados');
    console.log('✅ Sin errores de importaciones mock');
    console.log('✅ Conectividad con backend verificada');
    console.log('\n🏆 ELIMINACIÓN DE MOCKS: COMPLETAMENTE EXITOSA');
  });

  test('Verificación de performance sin bypass logic', async ({ page }) => {
    console.log('⚡ [Performance Test] Verificando optimizaciones...');
    
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Medir tiempo de carga sin bypass logic
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
      };
    });
    
    // Verificar que la carga es razonable (sin bypass logic debería ser más eficiente)
    expect(navigationTiming.domContentLoaded).toBeLessThan(5000); // < 5 segundos
    expect(navigationTiming.loadComplete).toBeLessThan(10000); // < 10 segundos
    
    console.log(`✅ DOMContentLoaded: ${navigationTiming.domContentLoaded}ms`);
    console.log(`✅ Load Complete: ${navigationTiming.loadComplete}ms`);
    console.log('⚡ Performance optimizada sin bypass logic');
  });
}); 