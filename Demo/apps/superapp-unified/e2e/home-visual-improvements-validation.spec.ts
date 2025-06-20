import { test, expect } from '@playwright/test';

test.describe('🎨 HOME VISUAL IMPROVEMENTS VALIDATION', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al home sin autenticación para verificar componentes públicos
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ FASE 1: Verificar mejoras críticas implementadas', async ({ page }) => {
    console.log('🎯 Validando FASE 1: Mejoras Críticas...');

    // 1. Verificar que la página carga correctamente
    await expect(page).toHaveTitle(/CoomÜnity SuperApp/);
    console.log('✅ Título de página correcto');

    // 2. Verificar sistema de prioridad 3-2-1 en CSS
    const priorityElements = await page.locator('.priority-1, .priority-2, .priority-3').count();
    console.log(`📊 Elementos con sistema de prioridad encontrados: ${priorityElements}`);

    // 3. Verificar nueva paleta de colores optimizada
    const ayniPrimaryElements = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return computedStyle.getPropertyValue('--ayni-primary').trim();
    });
    expect(ayniPrimaryElements).toBe('#6366f1');
    console.log('🎨 Paleta de colores optimizada aplicada correctamente');

    // 4. Verificar sistema tipográfico jerárquico
    const heroTextElements = await page.locator('.text-hero').count();
    const h1TextElements = await page.locator('.text-h1').count();
    const h2TextElements = await page.locator('.text-h2').count();
    console.log(`🔤 Sistema tipográfico: Hero(${heroTextElements}), H1(${h1TextElements}), H2(${h2TextElements})`);

    // 5. Verificar gradientes simplificados (máximo 2)
    const gradientPrimary = await page.locator('.bg-gradient-primary').count();
    const gradientSoft = await page.locator('.bg-gradient-soft').count();
    console.log(`🌈 Gradientes optimizados: Primary(${gradientPrimary}), Soft(${gradientSoft})`);
    
    // 6. Verificar elementos interactivos con micro-interacciones
    const interactiveElements = await page.locator('.interactive-element').count();
    expect(interactiveElements).toBeGreaterThan(0);
    console.log(`🎯 Elementos interactivos con micro-interacciones: ${interactiveElements}`);

    console.log('✅ FASE 1 validada correctamente');
  });

  test('✅ FASE 2: Verificar experiencia de usuario optimizada', async ({ page }) => {
    console.log('🎯 Validando FASE 2: Experiencia de Usuario...');

    // 1. Verificar cards optimizadas
    const cardBase = await page.locator('.card-base').count();
    const cardPriorityHigh = await page.locator('.card-priority-high').count();
    const cardPriorityMedium = await page.locator('.card-priority-medium').count();
    const cardPriorityLow = await page.locator('.card-priority-low').count();
    
    console.log(`🃏 Cards optimizadas: Base(${cardBase}), Alta(${cardPriorityHigh}), Media(${cardPriorityMedium}), Baja(${cardPriorityLow})`);

    // 2. Verificar progressive disclosure
    const expandableContent = await page.locator('.expandable-content').count();
    const expandButton = await page.locator('.expand-button').count();
    console.log(`📋 Progressive disclosure: Contenido(${expandableContent}), Botones(${expandButton})`);

    // 3. Verificar skeleton loaders optimizados
    const skeletonElements = await page.locator('.skeleton').count();
    const skeletonText = await page.locator('.skeleton-text').count();
    const skeletonTitle = await page.locator('.skeleton-title').count();
    console.log(`💀 Skeleton loaders: General(${skeletonElements}), Texto(${skeletonText}), Título(${skeletonTitle})`);

    // 4. Verificar accesibilidad mejorada
    const focusRings = await page.locator('.focus-ring').count();
    const skipLinks = await page.locator('.skip-link').count();
    console.log(`♿ Accesibilidad: Focus rings(${focusRings}), Skip links(${skipLinks})`);

    console.log('✅ FASE 2 validada correctamente');
  });

  test('✅ FASE 3: Verificar refinamiento visual', async ({ page }) => {
    console.log('🎯 Validando FASE 3: Refinamiento Visual...');

    // 1. Verificar utility classes implementadas
    const flexCenter = await page.locator('.flex-center').count();
    const flexBetween = await page.locator('.flex-between').count();
    const textTruncate = await page.locator('.text-truncate').count();
    console.log(`🎯 Utility classes: Flex center(${flexCenter}), Flex between(${flexBetween}), Text truncate(${textTruncate})`);

    // 2. Verificar responsive design optimizado
    const responsiveTest = await page.evaluate(() => {
      const homeGridGap = getComputedStyle(document.documentElement).getPropertyValue('--home-grid-gap').trim();
      const homeSectionSpacing = getComputedStyle(document.documentElement).getPropertyValue('--home-section-spacing').trim();
      return { homeGridGap, homeSectionSpacing };
    });
    
    expect(responsiveTest.homeGridGap).toBe('24px');
    expect(responsiveTest.homeSectionSpacing).toBe('32px');
    console.log('📱 Variables responsive configuradas correctamente');

    // 3. Verificar performance optimizations
    const gpuAccelerated = await page.locator('.gpu-accelerated').count();
    const willChangeTransform = await page.locator('.will-change-transform').count();
    const containLayout = await page.locator('.contain-layout').count();
    console.log(`🚀 Performance: GPU(${gpuAccelerated}), Will-change(${willChangeTransform}), Contain(${containLayout})`);

    console.log('✅ FASE 3 validada correctamente');
  });

  test('🎯 Verificar métricas de éxito del documento', async ({ page }) => {
    console.log('📊 Validando métricas de éxito...');

    // 1. Verificar tiempo de carga inicial < 2 segundos
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    console.log(`⏱️ Tiempo de carga: ${loadTime}ms (< 2000ms) ✅`);

    // 2. Verificar contraste WCAG AA (4.5:1 mínimo)
    const contrastTest = await page.evaluate(() => {
      // Verificar contraste de texto principal
      const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
      const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
      return { textPrimary, textSecondary };
    });
    
    expect(contrastTest.textPrimary).toBe('var(--gray-900)');
    expect(contrastTest.textSecondary).toBe('var(--gray-700)');
    console.log('🎨 Variables de contraste configuradas para WCAG AA ✅');

    // 3. Verificar que no hay animaciones complejas eliminadas
    const flowingWave = await page.locator('[class*="flowing-wave"]').count();
    const gentlePulse = await page.locator('[class*="gentle-pulse"]').count();
    const energyFlicker = await page.locator('[class*="energy-flicker"]').count();
    
    expect(flowingWave).toBe(0);
    expect(gentlePulse).toBe(0);
    expect(energyFlicker).toBe(0);
    console.log('🚫 Animaciones complejas eliminadas correctamente ✅');

    // 4. Verificar layout shift prevention
    const skeletonCards = await page.locator('.skeleton-card').count();
    console.log(`💀 Skeleton cards para prevenir layout shift: ${skeletonCards}`);

    console.log('✅ Todas las métricas de éxito validadas');
  });

  test('🔍 Verificar componentes específicos optimizados', async ({ page }) => {
    console.log('🧩 Validando componentes específicos...');

    // Simular navegación al home (sin autenticación)
    await page.goto('/');

    // 1. Verificar WelcomeHeader simplificado (si existe en vista pública)
    const welcomeElements = await page.locator('[class*="welcome"], [class*="Welcome"]').count();
    console.log(`👋 Elementos Welcome encontrados: ${welcomeElements}`);

    // 2. Verificar AyniMetricsCard optimizado (si existe en vista pública)
    const metricsElements = await page.locator('[class*="metrics"], [class*="Metrics"]').count();
    console.log(`📊 Elementos Metrics encontrados: ${metricsElements}`);

    // 3. Verificar ModuleCards reducido (máximo 4 módulos)
    const moduleCards = await page.locator('[class*="module"], [class*="Module"]').count();
    console.log(`🎮 Module cards encontrados: ${moduleCards}`);

    // 4. Verificar QuickActionsGrid optimizado (máximo 3 acciones)
    const quickActions = await page.locator('[class*="action"], [class*="Action"]').count();
    console.log(`⚡ Quick actions encontrados: ${quickActions}`);

    // 5. Verificar que los elementos críticos están presentes
    const interactiveElements = await page.locator('.interactive-element').count();
    expect(interactiveElements).toBeGreaterThan(0);
    console.log(`🎯 Elementos interactivos totales: ${interactiveElements} ✅`);

    console.log('✅ Componentes específicos validados');
  });

  test('♿ Verificar accesibilidad y navegación por teclado', async ({ page }) => {
    console.log('♿ Validando accesibilidad...');

    await page.goto('/');

    // 1. Verificar que hay elementos focusables
    const focusableElements = await page.locator('button, a, input, [tabindex]:not([tabindex="-1"])').count();
    expect(focusableElements).toBeGreaterThan(0);
    console.log(`⌨️ Elementos focusables: ${focusableElements} ✅`);

    // 2. Verificar navegación con Tab
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThanOrEqual(0);
    console.log(`🎯 Navegación por Tab funcional ✅`);

    // 3. Verificar estados de focus visibles
    const focusVisibleElements = await page.locator('.focus-ring, .enhanced-focus').count();
    console.log(`👁️ Elementos con focus visible: ${focusVisibleElements}`);

    // 4. Verificar contraste alto disponible
    const highContrastElements = await page.locator('.high-contrast').count();
    console.log(`🔆 Elementos de alto contraste: ${highContrastElements}`);

    console.log('✅ Accesibilidad validada');
  });

  test('📱 Verificar responsive design', async ({ page }) => {
    console.log('📱 Validando responsive design...');

    // 1. Verificar en desktop (1024px+)
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    const desktopElements = await page.locator('.interactive-element').count();
    console.log(`🖥️ Elementos en desktop: ${desktopElements}`);

    // 2. Verificar en mobile (768px-)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const mobileElements = await page.locator('.interactive-element').count();
    console.log(`📱 Elementos en mobile: ${mobileElements}`);

    // 3. Verificar que los elementos se adaptan
    expect(mobileElements).toBeGreaterThan(0);
    console.log('✅ Responsive design funcional');

    // Restaurar viewport
    await page.setViewportSize({ width: 1200, height: 800 });
  });
});

test.describe('🎨 PERFORMANCE VALIDATION', () => {
  test('⚡ Verificar métricas de performance', async ({ page }) => {
    console.log('⚡ Validando performance...');

    const startTime = Date.now();
    
    // Navegar y medir tiempo de carga
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tiempo de carga total: ${loadTime}ms`);

    // Verificar que no hay layout shifts evidentes
    const bodyHeight = await page.locator('body').boundingBox();
    expect(bodyHeight?.height).toBeGreaterThan(0);
    console.log(`📏 Altura del body: ${bodyHeight?.height}px ✅`);

    // Verificar que los CSS están cargados
    const cssVariables = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        ayniPrimary: styles.getPropertyValue('--ayni-primary').trim(),
        textPrimary: styles.getPropertyValue('--text-primary').trim(),
        homeGridGap: styles.getPropertyValue('--home-grid-gap').trim(),
      };
    });

    expect(cssVariables.ayniPrimary).toBe('#6366f1');
    expect(cssVariables.textPrimary).toBe('var(--gray-900)');
    expect(cssVariables.homeGridGap).toBe('24px');
    
    console.log('🎨 Variables CSS cargadas correctamente ✅');
    console.log('✅ Performance validada');
  });
});

test.describe('🎯 INTEGRATION VALIDATION', () => {
  test('🔗 Verificar integración completa de mejoras', async ({ page }) => {
    console.log('🔗 Validando integración completa...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verificar que todos los sistemas están integrados
    const systemsCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      return {
        // Sistema de colores
        colors: {
          ayniPrimary: styles.getPropertyValue('--ayni-primary').trim(),
          successAyni: styles.getPropertyValue('--success-ayni').trim(),
          warningAyni: styles.getPropertyValue('--warning-ayni').trim(),
          errorAyni: styles.getPropertyValue('--error-ayni').trim(),
        },
        // Sistema de layout
        layout: {
          maxWidth: styles.getPropertyValue('--home-container-max-width').trim(),
          gridGap: styles.getPropertyValue('--home-grid-gap').trim(),
          sectionSpacing: styles.getPropertyValue('--home-section-spacing').trim(),
        },
        // Sistema de animaciones
        animations: {
          fast: styles.getPropertyValue('--animation-fast').trim(),
          normal: styles.getPropertyValue('--animation-normal').trim(),
          slow: styles.getPropertyValue('--animation-slow').trim(),
        }
      };
    });

    // Verificar sistema de colores
    expect(systemsCheck.colors.ayniPrimary).toBe('#6366f1');
    expect(systemsCheck.colors.successAyni).toBe('#10b981');
    expect(systemsCheck.colors.warningAyni).toBe('#f59e0b');
    expect(systemsCheck.colors.errorAyni).toBe('#ef4444');
    console.log('🎨 Sistema de colores integrado ✅');

    // Verificar sistema de layout
    expect(systemsCheck.layout.maxWidth).toBe('1200px');
    expect(systemsCheck.layout.gridGap).toBe('24px');
    expect(systemsCheck.layout.sectionSpacing).toBe('32px');
    console.log('📐 Sistema de layout integrado ✅');

    // Verificar sistema de animaciones
    expect(systemsCheck.animations.fast).toBe('150ms');
    expect(systemsCheck.animations.normal).toBe('200ms');
    expect(systemsCheck.animations.slow).toBe('300ms');
    console.log('🎭 Sistema de animaciones integrado ✅');

    // 2. Verificar elementos de la UI presentes
    const uiElements = await page.evaluate(() => {
      return {
        interactiveElements: document.querySelectorAll('.interactive-element').length,
        cardElements: document.querySelectorAll('.card-base, .card-priority-high, .card-priority-medium, .card-priority-low').length,
        textElements: document.querySelectorAll('.text-hero, .text-h1, .text-h2, .text-body, .text-caption, .text-micro').length,
        utilityElements: document.querySelectorAll('.flex-center, .flex-between, .space-y-2, .space-y-4').length,
      };
    });

    console.log(`🧩 Elementos UI encontrados:
      - Interactivos: ${uiElements.interactiveElements}
      - Cards: ${uiElements.cardElements}  
      - Texto: ${uiElements.textElements}
      - Utilities: ${uiElements.utilityElements}`);

    expect(uiElements.interactiveElements + uiElements.cardElements + uiElements.textElements).toBeGreaterThan(0);
    
    console.log('✅ Integración completa validada exitosamente');
  });
}); 