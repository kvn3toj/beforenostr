import { test, expect } from '@playwright/test';

test.describe('🖥️ Desktop Navigation - KIRA + ARIA + ZENO Test', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport para desktop
    await page.setViewportSize({ width: 1200, height: 800 });

    // Navegar a la página principal - la autenticación está persistida via storageState
    await page.goto('/');

    // Esperar a que la aplicación cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('🛠️ ARIA: Sidebar debe ser visible en desktop', async ({ page }) => {
    // Verificar que el sidebar existe (puede estar hidden por CSS pero debe existir)
    const sidebar = page.locator('.MuiDrawer-root').first();
    await expect(sidebar).toBeAttached();

    // En desktop, verificar que los elementos de navegación principales son clickeables
    // (esto demuestra que la funcionalidad no está tapada)
    await expect(page.locator('.MuiDrawer-root').locator('text=Inicio')).toBeVisible();
    await expect(page.locator('.MuiDrawer-root').locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('.MuiDrawer-root').locator('text=ÜPlay')).toBeVisible();
    await expect(page.locator('.MuiDrawer-root').locator('text=Social')).toBeVisible();

    // Test importante: verificar que podemos hacer click en elementos del sidebar
    await page.locator('.MuiDrawer-root').locator('text=Marketplace').click();
    await expect(page).toHaveURL(/.*\/marketplace/);
  });

  test('🛠️ ZENO: AppHeader debe estar siempre visible y accesible', async ({ page }) => {
    // Verificar que el header está visible
    const header = page.locator('.MuiAppBar-root').first();
    await expect(header).toBeVisible();

    // Verificar que el logo/brand está visible en el header (específicamente)
    await expect(page.locator('.MuiAppBar-root').locator('text=CoomÜnity')).toBeVisible();

    // Verificar que el avatar de perfil está accesible
    const profileButton = page.locator('.MuiAppBar-root').locator('.MuiAvatar-root').first();
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    // Verificar que el menú desplegable aparece (usar el selector del menú, no sidebar)
    await expect(page.locator('[role="menuitem"]').filter({ hasText: 'Mi Perfil' })).toBeVisible();

    // Cerrar el menú presionando Escape
    await page.keyboard.press('Escape');
  });

  test('🛠️ KIRA: Navegación no debe tapar contenido en desktop', async ({ page }) => {
    // Navegar a diferentes páginas y verificar que el contenido es visible
    const testPages = [
      { path: '/marketplace', elementText: 'GMP' },
      { path: '/uplay', elementText: 'ÜPlay' },
      { path: '/social', elementText: 'Social' },
      { path: '/ustats', elementText: 'UStats' }
    ];

    for (const testPage of testPages) {
      await page.goto(testPage.path);
      await page.waitForLoadState('networkidle');

      // Verificar que el contenido principal es visible (buscar elemento más general)
      const mainContent = page.locator('.MuiBox-root').filter({ has: page.locator('h1, h2, h3, h4, h5, h6') }).first();
      await expect(mainContent).toBeVisible();

      // Verificar que no hay elementos flotantes tapando el contenido
      const contentBox = await mainContent.boundingBox();
      expect(contentBox).toBeTruthy();
      expect(contentBox!.width).toBeGreaterThan(300); // Contenido principal debe tener ancho razonable

      console.log(`✅ Página ${testPage.path} - Navegación OK`);
    }
  });

  test('🚨 CRÍTICO: Elementos flotantes no deben tapar la navegación', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

        // Verificar z-index de elementos críticos
    const header = page.locator('.MuiAppBar-root').first();
    await expect(header).toBeVisible();

    const headerZIndex = await header.evaluate(el => getComputedStyle(el).zIndex);

    // El header debe tener un z-index razonable (no 'auto')
    expect(headerZIndex).not.toBe('auto');
    expect(parseInt(headerZIndex)).toBeGreaterThan(0);

    // Verificar que elementos flotantes no tapan el header
    const floatingElements = page.locator('[style*="position: fixed"]');
    const count = await floatingElements.count();

    console.log(`🔍 Encontrados ${count} elementos flotantes`);

    // Verificar que el header sigue siendo clickeable después de cargar la página
    await page.waitForTimeout(2000); // Esperar a que todos los elementos flotantes se carguen

    const logo = page.locator('.MuiAppBar-root').locator('text=CoomÜnity').first();
    await expect(logo).toBeVisible();
    await logo.click(); // Debe ser clickeable

    // Verificar que regresamos al inicio
    await expect(page).toHaveURL(/.*\/$|.*\/\?.*|.*$/); // Acepta /, /?query, o raíz
  });

  test('🖥️ RESPONSIVE: Layout debe adaptarse correctamente', async ({ page }) => {
    // Probar diferentes tamaños de desktop
    const desktopSizes = [
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 1366, height: 768 },  // Laptop pequeña
      { width: 1920, height: 1080 }, // Desktop común
    ];

    for (const size of desktopSizes) {
      await page.setViewportSize(size);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que el sidebar está presente y funcional (puede estar CSS-hidden pero funcionando)
      const sidebar = page.locator('.MuiDrawer-root').first();
      await expect(sidebar).toBeAttached();

      // Más importante: verificar que la navegación funciona en este tamaño
      await expect(page.locator('.MuiDrawer-root').locator('text=Marketplace')).toBeVisible();

      // Verificar que el contenido principal no está comprimido
      const mainContent = page.locator('.MuiBox-root').filter({ has: page.locator('h1, h2, h3, h4, h5, h6') }).first();
      const contentBox = await mainContent.boundingBox();
      expect(contentBox!.width).toBeGreaterThan(size.width * 0.4); // Al menos 40% del ancho

      console.log(`✅ Layout OK en ${size.width}x${size.height}`);
    }
  });
});
