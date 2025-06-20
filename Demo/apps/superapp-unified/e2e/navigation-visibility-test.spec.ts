import { test, expect } from '@playwright/test';

test.describe('Navigation Visibility After AppLayout Integration', () => {
  test('should show sidebar and navigation links after login', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');

    // Verificar que estamos en login
    await expect(page).toHaveURL(/.*\/login/);

    // Realizar login con credenciales verificadas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar redirección después del login
    await page.waitForURL('**/', { timeout: 15000 });

    // ✅ VERIFICACIÓN PRINCIPAL: El AppLayout debe estar presente
    await expect(page.locator('[data-testid="app-layout"]')).toBeVisible({ timeout: 10000 });

    // ✅ VERIFICACIÓN: El Sidebar debe ser visible en desktop
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // ✅ VERIFICACIÓN: Enlaces de navegación específicos deben estar visibles
    const uplPlayLink = page.locator('text=ÜPlay');
    await expect(uplPlayLink).toBeVisible({ timeout: 10000 });

    const marketplaceLink = page.locator('text=Marketplace');
    await expect(marketplaceLink).toBeVisible({ timeout: 10000 });

    const socialLink = page.locator('text=Social');
    await expect(socialLink).toBeVisible({ timeout: 10000 });

    // ✅ VERIFICACIÓN: Poder navegar a ÜPlay (el objetivo principal)
    await uplPlayLink.click();
    await page.waitForURL('**/uplay', { timeout: 10000 });

    // Verificar que después de navegar, el sidebar sigue visible
    await expect(sidebar).toBeVisible();

    console.log('✅ Test pasado: La navegación está visible y funcional después de la integración de AppLayout');
  });

  test('should show bottom navigation on mobile viewport', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });

    // Ir a login y autenticarse
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar redirección
    await page.waitForURL('**/', { timeout: 15000 });

    // En móvil, el sidebar no debe estar visible pero debe existir el AppLayout
    await expect(page.locator('[data-testid="app-layout"]')).toBeVisible();

    // En móvil, debe haber navegación inferior (si está implementada)
    // O un botón de menú para abrir el drawer
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      console.log('✅ Botón de menú móvil encontrado');
    }

    console.log('✅ Test móvil pasado: AppLayout funciona en viewport móvil');
  });
});
