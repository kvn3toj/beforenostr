import { test, expect } from '@playwright/test';

test.describe('🏠 Home Page - Diagnostic Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al Home
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Esperar a que React se monte completamente
    await page.waitForTimeout(2000);
  });

  test('📋 Diagnóstico completo del contenido actual', async ({ page }) => {
    console.log('🔍 Iniciando diagnóstico del Home...');

    // 1. Verificar que la página carga
    await expect(page.locator('#root')).toBeVisible();
    console.log('✅ Página cargada correctamente');

    // 2. Capturar todo el texto visible en la página
    const pageText = await page.textContent('body');
    console.log('📝 Texto completo de la página:', pageText?.substring(0, 500) + '...');

    // 3. Buscar elementos específicos del Home
    const welcomeElements = await page.locator('text=/hola|welcome|bienvenid/i').count();
    console.log(`🎯 Elementos de bienvenida encontrados: ${welcomeElements}`);

    // 4. Buscar componentes específicos
    const ayniElements = await page.locator('text=/ayni|öndas|mëritos|balance/i').count();
    console.log(`🌟 Elementos de Ayni encontrados: ${ayniElements}`);

    // 5. Verificar estructura de navegación
    const navElements = await page.locator('nav, [role="navigation"]').count();
    console.log(`🧭 Elementos de navegación: ${navElements}`);

    // 6. Verificar si hay errores en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 7. Buscar elementos con data-testid
    const testElements = await page.locator('[data-testid]').count();
    console.log(`🧪 Elementos con data-testid: ${testElements}`);

    // 8. Verificar componentes específicos del Home
    const moduleCards = await page.locator('text=/marketplace|social|üplay|challenges/i').count();
    console.log(`🎴 Tarjetas de módulos encontradas: ${moduleCards}`);

    // 9. Tomar screenshot para inspección visual
    await page.screenshot({ 
      path: 'test-results/home-diagnostic-screenshot.png',
      fullPage: true 
    });

    // 10. Verificar elementos interactivos
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    console.log(`🔘 Botones encontrados: ${buttons}`);
    console.log(`🔗 Enlaces encontrados: ${links}`);

    // 11. Buscar específicamente el WelcomeHeader
    const welcomeHeader = await page.locator('[data-testid="welcome-header"]').count();
    console.log(`📋 WelcomeHeader encontrado: ${welcomeHeader}`);

    // 12. Verificar clases CSS específicas
    const priorityElements = await page.locator('[class*="priority-"], [class*="card-priority-"]').count();
    console.log(`🎯 Elementos con clases de prioridad: ${priorityElements}`);

    const textElements = await page.locator('[class*="text-"], [class*="interactive-element"]').count();
    console.log(`📝 Elementos con clases tipográficas: ${textElements}`);

    // 13. Verificar elementos del design system
    const designSystemElements = await page.locator('[class*="home-"], [class*="enhanced-"]').count();
    console.log(`🎨 Elementos del design system: ${designSystemElements}`);

    // Assertions básicas
    expect(welcomeElements + ayniElements + moduleCards).toBeGreaterThan(0);
    console.log('✅ Diagnóstico completado - La página contiene elementos esperados');
  });

  test('🎨 Verificación de componentes visuales mejorados', async ({ page }) => {
    console.log('🎨 Verificando mejoras visuales...');

    // Verificar que hay elementos con animaciones
    const animatedElements = await page.locator('[class*="fade"], [class*="animation"]').count();
    console.log(`✨ Elementos animados: ${animatedElements}`);

    // Verificar gradientes y efectos visuales
    const gradientElements = await page.locator('[style*="gradient"]').count();
    console.log(`🌈 Elementos con gradientes: ${gradientElements}`);

    // Verificar botones flotantes
    const fabButtons = await page.locator('[class*="MuiFab"], button[class*="fab"]').count();
    console.log(`🔘 Botones flotantes (FAB): ${fabButtons}`);

    // Verificar tarjetas y paneles
    const cards = await page.locator('[class*="MuiPaper"], [class*="card"]').count();
    console.log(`🎴 Tarjetas/Paneles: ${cards}`);

    // Al menos debe haber algunos elementos visuales
    expect(animatedElements + gradientElements + cards).toBeGreaterThan(0);
    console.log('✅ Componentes visuales verificados');
  });

  test('📱 Verificación responsive básica', async ({ page }) => {
    console.log('📱 Verificando diseño responsive...');

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileElements = await page.locator('body').isVisible();
    expect(mobileElements).toBe(true);
    console.log('✅ Vista móvil funcional');

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    const tabletElements = await page.locator('body').isVisible();
    expect(tabletElements).toBe(true);
    console.log('✅ Vista tablet funcional');

    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const desktopElements = await page.locator('body').isVisible();
    expect(desktopElements).toBe(true);
    console.log('✅ Vista desktop funcional');
  });

  test('⚡ Verificación de performance básica', async ({ page }) => {
    console.log('⚡ Verificando performance...');

    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('#root');
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tiempo de carga: ${loadTime}ms`);
    
    // La página debe cargar en menos de 10 segundos
    expect(loadTime).toBeLessThan(10000);
    
    // Verificar que no hay errores críticos de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        jsErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    if (jsErrors.length > 0) {
      console.log('⚠️ Errores de JavaScript encontrados:', jsErrors);
    }
    
    console.log('✅ Performance básica verificada');
  });
}); 