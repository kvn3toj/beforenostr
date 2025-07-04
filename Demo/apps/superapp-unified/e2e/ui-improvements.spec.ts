import { test, expect } from '@playwright/test';

test.describe('🎨 UI Improvements - Logo y Duplicaciones', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('🎯 Logo simplificado debe aparecer solo en sidebar', async ({ page }) => {
    // Verificar que el logo simple está en el sidebar
    const sidebarLogo = page.locator('.MuiDrawer-root img[alt="CoomÜnity Logo"]');
    await expect(sidebarLogo).toBeVisible();
    await expect(sidebarLogo).toHaveAttribute('src', '/coomunity-logo-simple.svg');

    // Verificar que NO hay logo duplicado en el header
    const headerLogo = page.locator('.MuiAppBar-root img[alt="CoomÜnity Logo"]');
    await expect(headerLogo).not.toBeVisible();

    // Verificar que NO hay texto "CoomÜnity" duplicado en el header
    const headerText = page.locator('.MuiAppBar-root').locator('text=CoomÜnity');
    await expect(headerText).not.toBeVisible();
  });

  test('🧹 Header debe estar limpio y minimalista', async ({ page }) => {
    // El header debe contener solo:
    // 1. Botón de menú mobile (hidden en desktop)
    // 2. Notificaciones
    // 3. Avatar del usuario

    const header = page.locator('.MuiAppBar-root');
    await expect(header).toBeVisible();

    // Verificar botón de notificaciones (con Badge)
    const notificationsButton = header.locator('.MuiIconButton-root').filter({ has: page.locator('.MuiBadge-root') });
    await expect(notificationsButton).toBeVisible();

    // Verificar avatar del usuario
    const userAvatar = header.locator('.MuiAvatar-root');
    await expect(userAvatar).toBeVisible();
  });

  test('📱 Sidebar debe contener toda la navegación principal', async ({ page }) => {
    const sidebar = page.locator('.MuiDrawer-root');

    // Verificar elementos principales de navegación
    const navItems = [
      'Inicio',
      'Marketplace',
      'LETS',
      'ÜPlay',
      'Social',
      'Retos',
      'Billetera',
      'Estadísticas'
    ];

    for (const item of navItems) {
      await expect(sidebar.locator(`text=${item}`)).toBeVisible();
    }

    // Verificar información del usuario en sidebar
    await expect(sidebar.locator('.MuiAvatar-root')).toBeVisible();
    await expect(sidebar.locator('text=Mi Perfil')).toBeVisible();
    await expect(sidebar.locator('text=Configuración')).toBeVisible();
  });

  test('⚡ Performance: Logo optimizado debe cargar rápido', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Esperar a que el logo cargue
    await page.locator('img[src="/coomunity-logo-simple.svg"]').waitFor();

    const loadTime = Date.now() - startTime;

    // El logo optimizado debe cargar en menos de 2 segundos
    expect(loadTime).toBeLessThan(2000);

    console.log(`✅ Logo cargado en ${loadTime}ms`);
  });
});
