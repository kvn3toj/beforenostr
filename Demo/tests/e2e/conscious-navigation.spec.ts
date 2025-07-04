import { test, expect } from '@playwright/test';

test.describe('🌿 Navegación Consciente Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Configurar viewport móvil para probar navegación bottom
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('🔍 Debe mostrar navegación consciente solo en móvil', async ({ page }) => {
    // Verificar que la navegación está visible en móvil
    const consciousNav = page.locator('[data-testid="conscious-bottom-navigation"]');
    await expect(consciousNav).toBeVisible();

    // Verificar que tiene los 5 elementos
    const navActions = page.locator('[data-contextual="conscious-navigation-action"]');
    await expect(navActions).toHaveCount(5);

    // Cambiar a desktop y verificar que se oculta
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(consciousNav).toBeHidden();
  });

  test('🔥 ÜPlay - Elemento Fuego', async ({ page }) => {
    const uplayTab = page.locator('[data-nav-target="/uplay"]');

    // Verificar propiedades del elemento Fuego
    await expect(uplayTab).toHaveAttribute('data-element', 'Fuego');
    await expect(uplayTab).toHaveAttribute('title', /Aprendizaje gamificado.*Elemento: Fuego/);

    // Navegar a ÜPlay
    await uplayTab.click();
    await expect(page).toHaveURL('/uplay');

    // Verificar estado activo
    await expect(uplayTab).toHaveClass(/active/);
  });

  test('💧 LETS - Elemento Agua', async ({ page }) => {
    const letsTab = page.locator('[data-nav-target="/lets"]');

    // Verificar propiedades del elemento Agua
    await expect(letsTab).toHaveAttribute('data-element', 'Agua');
    await expect(letsTab).toHaveAttribute('title', /Intercambio consciente.*Elemento: Agua/);

    // Navegar a LETS
    await letsTab.click();
    await expect(page).toHaveURL('/lets');

    // Verificar estado activo
    await expect(letsTab).toHaveClass(/active/);
  });

  test('💨 ÜStats - Elemento Aire', async ({ page }) => {
    const ustatsTab = page.locator('[data-nav-target="/ustats"]');

    // Verificar propiedades del elemento Aire
    await expect(ustatsTab).toHaveAttribute('data-element', 'Aire');
    await expect(ustatsTab).toHaveAttribute('title', /Métricas conscientes.*Elemento: Aire/);

    // Navegar a ÜStats
    await ustatsTab.click();
    await expect(page).toHaveURL('/ustats');

    // Verificar estado activo
    await expect(ustatsTab).toHaveClass(/active/);
  });

  test('🌍 ÜSocial - Elemento Tierra', async ({ page }) => {
    const socialTab = page.locator('[data-nav-target="/social"]');

    // Verificar propiedades del elemento Tierra
    await expect(socialTab).toHaveAttribute('data-element', 'Tierra');
    await expect(socialTab).toHaveAttribute('title', /Comunidad consciente.*Elemento: Tierra/);

    // Navegar a ÜSocial
    await socialTab.click();
    await expect(page).toHaveURL('/social');

    // Verificar estado activo
    await expect(socialTab).toHaveClass(/active/);
  });

  test('✨ ÜMarket - Elemento Éter (Destacado)', async ({ page }) => {
    const marketTab = page.locator('[data-nav-target="/marketplace"]');

    // Verificar propiedades del elemento Éter
    await expect(marketTab).toHaveAttribute('data-element', 'Éter');
    await expect(marketTab).toHaveAttribute('title', /Mercado consciente.*Elemento: Éter/);

    // Navegar a ÜMarket
    await marketTab.click();
    await expect(page).toHaveURL('/marketplace');

    // Verificar estado activo Y destacado
    await expect(marketTab).toHaveClass(/active/);
    await expect(marketTab).toHaveClass(/highlight-action/);
  });

  test('🌊 Transiciones suaves entre elementos', async ({ page }) => {
    // Navegar por todos los elementos y verificar transiciones
    const elements = [
      { tab: '[data-nav-target="/uplay"]', url: '/uplay', element: 'Fuego' },
      { tab: '[data-nav-target="/lets"]', url: '/lets', element: 'Agua' },
      { tab: '[data-nav-target="/ustats"]', url: '/ustats', element: 'Aire' },
      { tab: '[data-nav-target="/social"]', url: '/social', element: 'Tierra' },
      { tab: '[data-nav-target="/marketplace"]', url: '/marketplace', element: 'Éter' },
    ];

    for (const el of elements) {
      await page.locator(el.tab).click();

      // Verificar navegación exitosa
      await expect(page).toHaveURL(el.url);

      // Verificar elemento activo
      await expect(page.locator(el.tab)).toHaveClass(/active/);

      // Verificar que otros elementos no están activos
      const otherTabs = page.locator('[data-contextual="conscious-navigation-action"]')
        .locator(`not([data-nav-target="${el.url}"])`);

      for (let i = 0; i < await otherTabs.count(); i++) {
        await expect(otherTabs.nth(i)).not.toHaveClass(/active/);
      }

      // Pequeña pausa para permitir animaciones
      await page.waitForTimeout(200);
    }
  });

  test('🎨 Efectos visuales conscientes', async ({ page }) => {
    // Verificar backdrop consciente
    const paper = page.locator('[data-testid="conscious-bottom-navigation"]');

    // Verificar estilos de glassmorphism
    const paperStyles = await paper.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter,
        position: styles.position,
        zIndex: styles.zIndex,
      };
    });

    expect(paperStyles.position).toBe('fixed');
    expect(paperStyles.zIndex).toBe('1000');
    expect(paperStyles.backdropFilter).toContain('blur');

    // Verificar altura consciente (80px)
    const navContainer = page.locator('[data-contextual="conscious-navigation-container"]');
    const height = await navContainer.evaluate(el => window.getComputedStyle(el).height);
    expect(height).toBe('80px');
  });

  test('🔮 Sistema de badges conscientes (preparado)', async ({ page }) => {
    // Verificar que el hook de badges está preparado pero sin badges activos
    const badgeElements = page.locator('.MuiBadge-badge');
    await expect(badgeElements).toHaveCount(0); // No hay badges por defecto

    // Verificar que la estructura está lista para badges futuros
    const navActions = page.locator('[data-contextual="conscious-navigation-action"]');
    await expect(navActions).toHaveCount(5);
  });

  test('♿ Accesibilidad de navegación consciente', async ({ page }) => {
    // Verificar labels descriptivos
    await expect(page.locator('[data-nav-target="/uplay"]'))
      .toHaveAttribute('aria-label', /Navegar a ÜPlay.*Aprendizaje gamificado/);

    await expect(page.locator('[data-nav-target="/marketplace"]'))
      .toHaveAttribute('aria-label', /Navegar a ÜMarket.*Mercado consciente/);

    // Verificar role de navegación
    const nav = page.locator('[data-testid="conscious-bottom-navigation"]');
    await expect(nav).toHaveAttribute('role', 'navigation');
    await expect(nav).toHaveAttribute('aria-label', 'Navegación móvil principal CoomÜnity');

    // Verificar navegación por teclado
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // El primer elemento debería estar enfocado
    const firstTab = page.locator('[data-nav-target="/uplay"]');
    await expect(firstTab).toBeFocused();
  });

  test('📱 Responsive behavior correcto', async ({ page }) => {
    // Probar diferentes breakpoints
    const breakpoints = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 768, height: 1024, name: 'iPad' }, // Debería estar oculto
      { width: 1200, height: 800, name: 'Desktop' }, // Debería estar oculto
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      const nav = page.locator('[data-testid="conscious-bottom-navigation"]');

      if (bp.width < 768) { // md breakpoint
        await expect(nav).toBeVisible();
      } else {
        await expect(nav).toBeHidden();
      }
    }
  });

  test('🎭 Filosofía CoomÜnity en elementos', async ({ page }) => {
    // Verificar que cada elemento mantiene su correspondencia filosófica
    const elements = [
      { selector: '[data-element="Fuego"]', description: 'Aprendizaje gamificado' },
      { selector: '[data-element="Agua"]', description: 'Intercambio consciente' },
      { selector: '[data-element="Aire"]', description: 'Métricas conscientes' },
      { selector: '[data-element="Tierra"]', description: 'Comunidad consciente' },
      { selector: '[data-element="Éter"]', description: 'Mercado consciente' },
    ];

    for (const element of elements) {
      const tab = page.locator(element.selector);
      await expect(tab).toHaveAttribute('title', new RegExp(element.description));
    }
  });

});
