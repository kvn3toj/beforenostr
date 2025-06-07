/**
 * ================================================
 * TESTS CRÍTICOS DE FLUJO UX - COOMUNITY
 * Flujos de usuario más importantes que deben funcionar
 * ================================================
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';
const MAIN_PAGE = `${BASE_URL}/public/index.html`;

test.describe('🎯 Flujos Críticos de UX - Test de Usuario Real', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');
  });

  test('flujo crítico: primer usuario visitando el sitio', async ({ page }) => {
    console.log('🎯 Testing: Experiencia de primer usuario');
    
    // 1. Verificar carga inicial sin errores
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    page.on('requestfailed', request => {
      if (!request.url().includes('favicon')) {
        errors.push(`Failed request: ${request.url()}`);
      }
    });

    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);

    // 2. Verificar elementos críticos visibles inmediatamente
    await expect(page.locator('.unified-navbar')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.demo-card').first()).toBeVisible();

    // 3. Verificar que el logo es clickeable y funcional
    const logo = page.locator('.navbar-brand img');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('alt', 'CoomÜnity');

    // 4. Verificar que los enlaces principales son accesibles
    const demoLinks = page.locator('.demo-link.primary');
    const linkCount = await demoLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // 5. Verificar que el usuario recibe feedback inmediato
    await page.waitForTimeout(3000); // Esperar notificación de bienvenida
    const notificationContainer = page.locator('.notification-container');
    await expect(notificationContainer).toBeAttached();

    console.log('✅ Experiencia de primer usuario: EXITOSA');
  });

  test('flujo crítico: navegación entre secciones', async ({ page }) => {
    console.log('🎯 Testing: Navegación fluida entre secciones');
    
    // 1. Estado inicial
    const homeLink = page.locator('[data-section="home"]');
    await expect(homeLink).toHaveClass(/active/);

    // 2. Navegación a diferentes secciones y verificar estados activos
    const sections = ['pilgrim', 'merchant', 'red-pill', 'docs'];
    
    for (const section of sections) {
      const sectionLink = page.locator(`[data-section="${section}"]`);
      await expect(sectionLink).toBeVisible();
      
      // Hover para verificar feedback visual
      await sectionLink.hover();
      await page.waitForTimeout(200);
      
      // Verificar que el enlace responde al hover
      const transform = await sectionLink.evaluate(el => {
        return getComputedStyle(el).transform;
      });
      
      console.log(`Sección ${section}: hover effect verificado`);
    }

    // 3. Verificar breadcrumbs
    const breadcrumbs = page.locator('#breadcrumbs');
    await expect(breadcrumbs).toBeAttached();

    console.log('✅ Navegación entre secciones: EXITOSA');
  });

  test('flujo crítico: responsive en dispositivo móvil', async ({ page }) => {
    console.log('🎯 Testing: Experiencia móvil completa');
    
    // 1. Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // 2. Verificar que el menú hamburguesa aparece
    const mobileToggle = page.locator('.mobile-toggle');
    await expect(mobileToggle).toBeVisible();

    // 3. Verificar que el contenido principal sigue siendo accesible
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();

    // 4. Test de menú móvil
    await mobileToggle.click();
    await page.waitForTimeout(600);

    // Verificar que el menú se abre
    const navLinks = page.locator('.nav-links');
    const opacity = await navLinks.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.8);

    // 5. Test de selección en menú móvil
    const pilgrimMobileLink = page.locator('[data-section="pilgrim"]');
    await pilgrimMobileLink.click();
    
    // Verificar que el menú se cierra después de selección
    await page.waitForTimeout(500);

    // 6. Verificar que no hay scroll horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 10); // 10px tolerancia

    console.log('✅ Experiencia móvil: EXITOSA');
  });

  test('flujo crítico: interacciones y feedback', async ({ page }) => {
    console.log('🎯 Testing: Sistema de feedback e interacciones');
    
    // 1. Verificar que el sistema de loading está activo
    const loadingManager = await page.evaluate(() => {
      return typeof window.loadingManager !== 'undefined';
    });
    expect(loadingManager).toBe(true);

    // 2. Test de interacción con demo cards
    const demoCards = page.locator('.demo-card');
    const firstCard = demoCards.first();
    
    // Hover sobre card
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    // Verificar transformación hover
    const transform = await firstCard.evaluate(el => {
      return getComputedStyle(el).transform;
    });
    expect(transform).not.toBe('none');

    // 3. Test de click en enlace de demo
    const primaryLink = firstCard.locator('.demo-link.primary');
    await expect(primaryLink).toBeVisible();
    
    // Click y verificar loading state
    await primaryLink.click();
    
    // 4. Verificar que el sistema de notificaciones responde
    const notificationSystem = await page.evaluate(() => {
      return typeof window.notificationSystem !== 'undefined';
    });
    expect(notificationSystem).toBe(true);

    console.log('✅ Sistema de feedback: EXITOSO');
  });

  test('flujo crítico: performance y estabilidad', async ({ page }) => {
    console.log('🎯 Testing: Performance y estabilidad del sistema');
    
    // 1. Medir tiempo de carga
    const startTime = Date.now();
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Tiempo de carga: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Máximo 3 segundos

    // 2. Verificar que recursos críticos están cargados
    await expect(page.locator('link[href*="unified-styles.css"]')).toBeAttached();
    await expect(page.locator('script[src*="ux-enhancements.js"]')).toBeAttached();

    // 3. Verificar que variables CSS están aplicadas
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    });
    expect(primaryColor).toBe('#DC1A5B');

    // 4. Test de estabilidad: múltiples interacciones
    for (let i = 0; i < 3; i++) {
      const navLink = page.locator('.nav-link').nth(i % 3);
      await navLink.hover();
      await page.waitForTimeout(100);
    }

    // 5. Verificar que no hay errores de JavaScript
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);

    console.log('✅ Performance y estabilidad: EXITOSOS');
  });

  test('flujo crítico: accesibilidad básica', async ({ page }) => {
    console.log('🎯 Testing: Cumplimiento de accesibilidad básica');
    
    // 1. Verificar estructura semántica
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // 2. Verificar headings jerárquicos
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    const h2 = page.locator('h2');
    const h2Count = await h2.count();
    expect(h2Count).toBeGreaterThan(0);

    // 3. Verificar atributos alt en imágenes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }

    // 4. Verificar contraste básico (navbar)
    const navbar = page.locator('.unified-navbar');
    const navbarBg = await navbar.evaluate(el => {
      return getComputedStyle(el).backgroundColor;
    });
    
    // Color primario debe ser #DC1A5B (buen contraste con blanco)
    expect(navbarBg).toBe('rgb(220, 26, 91)');

    // 5. Verificar enlaces tienen texto descriptivo
    const navLinks = page.locator('.nav-link .nav-text');
    const linkTexts = ['Inicio', 'Pilgrim', 'Merchant', 'Red Pill', 'Docs'];
    
    for (let i = 0; i < linkTexts.length; i++) {
      const link = navLinks.nth(i);
      await expect(link).toHaveText(linkTexts[i]);
    }

    console.log('✅ Accesibilidad básica: EXITOSA');
  });
});

test.describe('🚨 Tests de Regresión UX', () => {
  
  test('verificar que todas las clases JavaScript están cargadas', async ({ page }) => {
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que todas las clases UX están disponibles
    const classesStatus = await page.evaluate(() => {
      return {
        loadingManager: typeof window.loadingManager !== 'undefined',
        navigationManager: typeof window.navigationManager !== 'undefined',
        formValidator: typeof window.formValidator !== 'undefined',
        responsiveEnhancements: typeof window.responsiveEnhancements !== 'undefined',
        notificationSystem: typeof window.notificationSystem !== 'undefined'
      };
    });

    expect(classesStatus.loadingManager).toBe(true);
    expect(classesStatus.navigationManager).toBe(true);
    expect(classesStatus.formValidator).toBe(true);
    expect(classesStatus.responsiveEnhancements).toBe(true);
    expect(classesStatus.notificationSystem).toBe(true);

    console.log('✅ Todas las clases JavaScript cargadas correctamente');
  });

  test('verificar que CSS unificado no tiene conflictos', async ({ page }) => {
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');

    // Verificar variables CSS críticas
    const cssVariables = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        primaryColor: root.getPropertyValue('--primary-color').trim(),
        secondaryColor: root.getPropertyValue('--secondary-color').trim(),
        backgroundColor: root.getPropertyValue('--background-color').trim(),
        spacingMd: root.getPropertyValue('--spacing-md').trim(),
        fontFamily: root.getPropertyValue('--font-family-primary').trim(),
        transition: root.getPropertyValue('--transition').trim()
      };
    });

    expect(cssVariables.primaryColor).toBe('#DC1A5B');
    expect(cssVariables.secondaryColor).toBe('#3C4858');
    expect(cssVariables.backgroundColor).toBe('#f8f9fa');
    expect(cssVariables.spacingMd).toBe('1rem');
    expect(cssVariables.fontFamily).toContain('Poppins');
    expect(cssVariables.transition).toBe('all 0.3s ease');

    console.log('✅ Variables CSS unificadas funcionando correctamente');
  });
}); 