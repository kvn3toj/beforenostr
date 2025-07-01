import { test, expect } from '@playwright/test';

test.describe('🖥️ Desktop Navigation - KIRA + ARIA + ZENO Test', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport para desktop
    await page.setViewportSize({ width: 1200, height: 800 });

    // Navegar a la página principal y hacer login
    await page.goto('/');

    // Login si es necesario
    const loginButton = page.locator('text=Iniciar Sesión').first();
    if (await loginButton.isVisible()) {
      await page.goto('/login');
      await page.fill('[data-testid="login-email-input"] input', 'test@coomunity.com');
      await page.fill('[data-testid="login-password-input"] input', 'test123');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/');
    }
  });

  test('🛠️ ARIA: Sidebar debe ser visible en desktop', async ({ page }) => {
    // Verificar que el sidebar está visible en desktop
    const sidebar = page.locator('[role="navigation"]').first();
    await expect(sidebar).toBeVisible();

    // Verificar elementos de navegación principales
    await expect(page.locator('text=Inicio')).toBeVisible();
    await expect(page.locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('text=ÜPlay')).toBeVisible();
    await expect(page.locator('text=Social')).toBeVisible();
  });

  test('🛠️ ZENO: AppHeader debe estar siempre visible y accesible', async ({ page }) => {
    // Verificar que el header está visible
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Verificar que el logo está visible
    await expect(page.locator('text=CoomÜnity')).toBeVisible();

    // Verificar que el menú de perfil está accesible
    const profileButton = page.locator('[aria-label*="perfil"]').or(page.locator('img[alt*="Usuario"]')).first();
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    // Verificar que el menú desplegable aparece
    await expect(page.locator('text=Mi Perfil')).toBeVisible();

    // Cerrar el menú
    await page.keyboard.press('Escape');
  });

  test('🛠️ KIRA: Navegación no debe tapar contenido en desktop', async ({ page }) => {
    // Navegar a diferentes páginas y verificar que el contenido es visible
    const testPages = [
      { path: '/marketplace', element: 'text=Marketplace' },
      { path: '/uplay', element: 'text=ÜPlay' },
      { path: '/social', element: 'text=Social' },
      { path: '/ustats', element: 'text=UStats' }
    ];

    for (const testPage of testPages) {
      await page.goto(testPage.path);

      // Verificar que el contenido principal es visible
      const mainContent = page.locator('main').first();
      await expect(mainContent).toBeVisible();

      // Verificar que no hay elementos flotantes tapando el contenido
      const contentBox = await mainContent.boundingBox();
      expect(contentBox).toBeTruthy();
      expect(contentBox!.width).toBeGreaterThan(300); // Contenido principal debe tener ancho razonable

      // Verificar que el header sigue siendo accesible
      const header = page.locator('header').first();
      await expect(header).toBeVisible();

      console.log(`✅ Página ${testPage.path} - Navegación OK`);
    }
  });

  test('🚨 CRÍTICO: Elementos flotantes no deben tapar la navegación', async ({ page }) => {
    await page.goto('/');

    // Verificar z-index de elementos críticos
    const header = page.locator('header').first();
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

    const logo = page.locator('text=CoomÜnity').first();
    await expect(logo).toBeVisible();
    await logo.click(); // Debe ser clickeable

    // Verificar que regresamos al inicio
    await expect(page).toHaveURL('/');
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

      // Verificar que el sidebar es visible en todos los tamaños desktop
      const sidebar = page.locator('[role="navigation"]').first();
      await expect(sidebar).toBeVisible();

      // Verificar que el contenido principal no está comprimido
      const mainContent = page.locator('main').first();
      const contentBox = await mainContent.boundingBox();
      expect(contentBox!.width).toBeGreaterThan(size.width * 0.4); // Al menos 40% del ancho

      console.log(`✅ Layout OK en ${size.width}x${size.height}`);
    }
  });
});
