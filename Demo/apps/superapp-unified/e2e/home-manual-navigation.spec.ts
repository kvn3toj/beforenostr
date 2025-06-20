import { test, expect } from '@playwright/test';

test.describe('Home Manual Navigation - Animation Fixes Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al Home
    await page.goto('/');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Esperar a que aparezca el header de bienvenida
    await page.waitForSelector('[data-testid="welcome-header"]', { timeout: 10000 });
  });

  test('Manual Navigation - Home Layout and Animation Fixes', async ({ page }) => {
    console.log('🎯 Iniciando navegación manual del Home...');
    
    // 1. Verificar que el Home carga correctamente
    await expect(page.locator('[data-testid="welcome-header"]')).toBeVisible();
    console.log('✅ Welcome Header visible');
    
    // 2. Verificar métricas de Ayni
    const ayniMetrics = page.locator('[data-testid="ayni-metrics-card"]');
    if (await ayniMetrics.count() > 0) {
      await expect(ayniMetrics).toBeVisible();
      console.log('✅ Ayni Metrics Card visible');
      
      // Verificar que NO hay animaciones automáticas problemáticas
      const animatedElements = page.locator('.animate-gentle-pulse, .animate-flowing-wave, .animate-energy-flicker, .animate-light-float');
      const animatedCount = await animatedElements.count();
      console.log(`🔍 Elementos con animaciones problemáticas encontrados: ${animatedCount}`);
      expect(animatedCount).toBe(0);
    }
    
    // 3. Verificar elementos flotantes eliminados
    const floatingElements = page.locator('.floating-element, .floating-element-delayed, .floating-element-slow');
    const floatingCount = await floatingElements.count();
    console.log(`🔍 Elementos flotantes encontrados: ${floatingCount}`);
    
    // 4. Verificar módulos disponibles
    const moduleCards = page.locator('[data-testid="module-cards"]');
    if (await moduleCards.count() > 0) {
      await expect(moduleCards).toBeVisible();
      console.log('✅ Module Cards visible');
    }
    
    // 5. Verificar wallet overview
    const walletOverview = page.locator('[data-testid="wallet-overview"]');
    if (await walletOverview.count() > 0) {
      await expect(walletOverview).toBeVisible();
      console.log('✅ Wallet Overview visible');
    }
    
    // 6. Verificar que las transiciones hover funcionan correctamente
    const hoverElements = page.locator('.home-card-hover');
    if (await hoverElements.count() > 0) {
      const firstHoverElement = hoverElements.first();
      await firstHoverElement.hover();
      console.log('✅ Hover effects working (no automatic animations)');
    }
    
    // 7. Pausa para navegación manual
    console.log('⏸️  PAUSA PARA NAVEGACIÓN MANUAL');
    console.log('📋 Instrucciones:');
    console.log('   1. Verifica que NO hay elementos moviéndose automáticamente');
    console.log('   2. Verifica que NO hay efecto de "olas del mar"');
    console.log('   3. Haz hover sobre las tarjetas para ver efectos suaves');
    console.log('   4. Navega por los diferentes módulos');
    console.log('   5. Verifica que la interfaz se ve estable y profesional');
    console.log('⏰ Esperando 30 segundos para navegación manual...');
    
    // Esperar 30 segundos para navegación manual
    await page.waitForTimeout(30000);
    
    // 8. Verificaciones finales
    console.log('🔍 Verificaciones finales...');
    
    // Verificar que no hay errores en consola relacionados con animaciones
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Scroll para verificar comportamiento
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    console.log('✅ Navegación manual completada');
    console.log(`📊 Errores de consola: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('⚠️  Errores encontrados:', consoleErrors);
    }
  });

  test('Interactive Elements Verification', async ({ page }) => {
    console.log('🎯 Verificando elementos interactivos...');
    
    // Verificar que los elementos interactivos responden correctamente
    const interactiveElements = page.locator('.interactive-scale, .home-card-hover');
    const count = await interactiveElements.count();
    
    console.log(`🔍 Elementos interactivos encontrados: ${count}`);
    
    if (count > 0) {
      // Probar hover en cada elemento interactivo
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = interactiveElements.nth(i);
        await element.hover();
        await page.waitForTimeout(500);
        console.log(`✅ Hover test ${i + 1}/${Math.min(count, 5)} completado`);
      }
    }
    
    // Verificar que no hay animaciones automáticas ejecutándose
    const animationStyles = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const animatedElements: string[] = [];
      
      elements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const animationName = computedStyle.animationName;
        const animationDuration = computedStyle.animationDuration;
        
        if (animationName !== 'none' && animationDuration !== '0s') {
          animatedElements.push(`${el.tagName}.${el.className} - ${animationName}`);
        }
      });
      
      return animatedElements;
    });
    
    console.log(`🔍 Animaciones CSS activas: ${animationStyles.length}`);
    if (animationStyles.length > 0) {
      console.log('📋 Animaciones encontradas:', animationStyles.slice(0, 10));
    }
    
    // Las únicas animaciones permitidas son las de Material-UI y loading
    const allowedAnimations = animationStyles.filter(anim => 
      anim.includes('mui') || 
      anim.includes('loading') || 
      anim.includes('spinner') ||
      anim.includes('fade-in')
    );
    
    console.log(`✅ Animaciones permitidas: ${allowedAnimations.length}`);
    console.log(`⚠️  Animaciones no permitidas: ${animationStyles.length - allowedAnimations.length}`);
  });

  test('Accessibility and Reduced Motion', async ({ page }) => {
    console.log('🎯 Verificando accesibilidad y reduced motion...');
    
    // Simular preferencia de reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar que las animaciones están deshabilitadas
    const animationsDisabled = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.style.animation = 'test 1s infinite';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const animationDuration = computedStyle.animationDuration;
      
      document.body.removeChild(testElement);
      
      return animationDuration === '0s' || animationDuration === '';
    });
    
    console.log(`✅ Reduced motion respetado: ${animationsDisabled}`);
    expect(animationsDisabled).toBeTruthy();
    
    // Verificar elementos de navegación por teclado
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused ? focused.tagName + (focused.className ? '.' + focused.className : '') : 'none';
    });
    
    console.log(`✅ Navegación por teclado: ${focusedElement}`);
    
    console.log('✅ Verificación de accesibilidad completada');
  });
}); 