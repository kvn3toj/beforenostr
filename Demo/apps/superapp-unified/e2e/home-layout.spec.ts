import { test, expect } from '@playwright/test';

test.describe('Home Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al home
    await page.goto('/');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('should display desktop layout with sidebar on desktop viewport', async ({ page }) => {
    // ✅ Verificar que estamos en viewport desktop (> 768px)
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(768);
    
    // ✅ Verificar que el sidebar desktop esté visible (más específico)
    const desktopSidebar = page.locator('[data-contextual="navigation-sidebar"]');
    await expect(desktopSidebar).toBeVisible();
    
    // ✅ Verificar que el sidebar contenga los módulos principales
    await expect(page.locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('text=ÜPlay')).toBeVisible();
    await expect(page.locator('text=Social')).toBeVisible();
    await expect(page.locator('text=Wallet')).toBeVisible();
    
    // ✅ Verificar que el drawer móvil NO esté visible en desktop
    const mobileDrawer = page.locator('[data-testid="mobile-navigation-menu"]');
    await expect(mobileDrawer).not.toBeVisible();
    
    // ✅ Verificar que el contenido principal esté presente
    await expect(page.locator('text=¡Hola, Administrador!')).toBeVisible();
    await expect(page.locator('text=Bien Común y Ayni')).toBeVisible();
    
    // ✅ Verificar que las métricas Ayni estén visibles
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Balance Ayni')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();
  });

  test('should have correct responsive layout structure', async ({ page }) => {
    // ✅ Verificar estructura del layout responsivo
    const appLayout = page.locator('[data-testid="app-layout"]');
    await expect(appLayout).toBeVisible();
    
    // ✅ Verificar que el layout tenga la clase correcta para desktop
    const layoutWrapper = page.locator('[data-responsive="flex-layout"]');
    await expect(layoutWrapper).toBeVisible();
    
    // ✅ Verificar que el breakpoint detection sea correcto
    const breakpointDetection = page.locator('[data-breakpoint-detection="desktop"]');
    await expect(breakpointDetection).toBeVisible();
  });

  test('should display wallet overview with correct data', async ({ page }) => {
    // ✅ Verificar que el wallet overview esté visible
    await expect(page.locator('text=125.075')).toBeVisible(); // Lükas
    await expect(page.locator('text=Lükas')).toBeVisible();
    await expect(page.locator('text=480')).toBeVisible(); // Créditos Ayni
    await expect(page.locator('text=+15.2% este mes')).toBeVisible();
  });

  test('should display ayni metrics correctly', async ({ page }) => {
    // ✅ Verificar métricas Ayni (más específicos)
    await expect(page.locator('text=485')).toBeVisible(); // Mëritos
    await expect(page.locator('text=23')).toBeVisible(); // Contribuciones Bien Común
    
    // ✅ Verificar elementos (Fuego, Agua, Tierra, Aire) - más específicos
    await expect(page.locator('text=Fuego')).toBeVisible();
    await expect(page.locator('text=Agua')).toBeVisible();
    await expect(page.locator('text=Tierra')).toBeVisible();
    await expect(page.locator('text=Aire')).toBeVisible();
  });

  test('should take screenshot for visual comparison', async ({ page }) => {
    // ✅ Tomar screenshot del home completo para comparación visual
    await expect(page).toHaveScreenshot('home-desktop-layout.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
}); 