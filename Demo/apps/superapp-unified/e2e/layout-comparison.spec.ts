import { test, expect } from '@playwright/test';

test.describe('Layout Comparison Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show desktop layout with sidebar on large viewport', async ({ page }) => {
    // ✅ Configurar viewport desktop (1280x720)
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // ✅ Verificar que el sidebar esté visible
    const sidebar = page.locator('[data-contextual="navigation-sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // ✅ Verificar que NO hay drawer móvil visible
    const mobileDrawer = page.locator('[data-testid="mobile-navigation-menu"]');
    await expect(mobileDrawer).not.toBeVisible();
    
    // ✅ Verificar breakpoint detection
    const breakpointDetection = page.locator('[data-breakpoint-detection="desktop"]');
    await expect(breakpointDetection).toBeVisible();
    
    // ✅ Screenshot del layout desktop
    await expect(page).toHaveScreenshot('layout-desktop-1280x720.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should show mobile layout without sidebar on small viewport', async ({ page }) => {
    // ✅ Configurar viewport móvil (375x667 - iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    
    // ✅ Verificar que el sidebar NO esté visible
    const sidebar = page.locator('[data-contextual="navigation-sidebar"]');
    await expect(sidebar).not.toBeVisible();
    
    // ✅ Verificar breakpoint detection móvil
    const breakpointDetection = page.locator('[data-breakpoint-detection="mobile"]');
    await expect(breakpointDetection).toBeVisible();
    
    // ✅ Screenshot del layout móvil
    await expect(page).toHaveScreenshot('layout-mobile-375x667.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should show correct layout at breakpoint boundary (768px)', async ({ page }) => {
    // ✅ Configurar viewport en el límite del breakpoint (767px = móvil)
    await page.setViewportSize({ width: 767, height: 600 });
    
    // ✅ Verificar que es móvil (< 768px)
    const breakpointDetection = page.locator('[data-breakpoint-detection="mobile"]');
    await expect(breakpointDetection).toBeVisible();
    
    // ✅ Cambiar a 768px (desktop)
    await page.setViewportSize({ width: 768, height: 600 });
    await page.waitForTimeout(500); // Esperar a que se aplique el cambio
    
    // ✅ Verificar que ahora es desktop (≥ 768px)
    const desktopDetection = page.locator('[data-breakpoint-detection="desktop"]');
    await expect(desktopDetection).toBeVisible();
    
    // ✅ Verificar que el sidebar aparece
    const sidebar = page.locator('[data-contextual="navigation-sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test('should maintain layout consistency across different desktop sizes', async ({ page }) => {
    const desktopSizes = [
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 1280, height: 720, name: 'desktop-standard' },
      { width: 1920, height: 1080, name: 'desktop-large' },
    ];

    for (const size of desktopSizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(300);
      
      // ✅ Verificar que el sidebar esté visible en todos los tamaños desktop
      const sidebar = page.locator('[data-contextual="navigation-sidebar"]');
      await expect(sidebar).toBeVisible();
      
      // ✅ Verificar detección de desktop
      const breakpointDetection = page.locator('[data-breakpoint-detection="desktop"]');
      await expect(breakpointDetection).toBeVisible();
      
      // ✅ Screenshot para cada tamaño
      await expect(page).toHaveScreenshot(`layout-${size.name}-${size.width}x${size.height}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
}); 