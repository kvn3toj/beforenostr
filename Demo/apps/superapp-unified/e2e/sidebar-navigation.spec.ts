import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login con credenciales reales
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Llenar formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar redirección exitosa
    await page.waitForURL('**/', { timeout: 15000 });

    // 🔧 SOLUCIÓN CRÍTICA: Dar tiempo para que AppLayout se renderice completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await page.waitForTimeout(2000);

    console.log('✅ Login exitoso - AppLayout cargado');
  });

  test('🎯 BLOQUEADOR CRÍTICO #1: Verificar que el enlace ÜPlay está disponible en Sidebar desktop', async ({ page }) => {
    console.log('🔍 Verificando disponibilidad del enlace ÜPlay en Sidebar...');

    // Verificar que estamos en desktop (viewport > 768px)
    const viewportSize = page.viewportSize();
    console.log(`📱 Viewport: ${viewportSize?.width}x${viewportSize?.height}`);
    expect(viewportSize?.width).toBeGreaterThan(768);

    // Verificar que el Sidebar desktop está visible
    const desktopSidebar = page.locator('.desktop-sidebar');
    await expect(desktopSidebar).toBeVisible();
    console.log('✅ Sidebar desktop está visible');

    // Verificar que el enlace ÜPlay existe en el Sidebar
    const uplayLink = page.locator('text=ÜPlay').first();
    await expect(uplayLink).toBeVisible();
    console.log('✅ Enlace ÜPlay encontrado en Sidebar');

    // Verificar que el enlace es clickeable
    await expect(uplayLink).toBeEnabled();
    console.log('✅ Enlace ÜPlay es clickeable');

    // Hacer clic en el enlace ÜPlay
    await uplayLink.click();

    // Verificar navegación exitosa a /uplay
    await page.waitForURL('**/uplay', { timeout: 10000 });
    console.log('✅ Navegación a /uplay exitosa');

    // Verificar que la página ÜPlay se carga
    await page.waitForSelector('#root', { timeout: 10000 });

    // Verificar contenido específico de ÜPlay - CORREGIDO
    await expect(page.getByRole('heading', { name: 'Bienvenido a ÜPlay' })).toBeVisible();
    await expect(page.locator('[data-testid="video-card"]').first()).toBeVisible();
    await expect(page.getByText('Activos: 150')).toBeVisible();
    console.log('✅ Página ÜPlay cargada y contenido verificado correctamente');
  });

  test('📱 Verificar que el enlace ÜPlay está disponible en BottomNavigation móvil', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log('🔍 Verificando disponibilidad del enlace ÜPlay en BottomNavigation móvil...');

    // Verificar que el BottomNavigation móvil está visible
    const bottomNav = page.locator('.mobile-nav');
    await expect(bottomNav).toBeVisible();
    console.log('✅ BottomNavigation móvil está visible');

    // Verificar que el enlace ÜPlay existe en BottomNavigation
    const uplayButton = page.locator('[aria-label*="ÜPlay"]').first();
    await expect(uplayButton).toBeVisible();
    console.log('✅ Botón ÜPlay encontrado en BottomNavigation');

    // Hacer clic en el botón ÜPlay
    await uplayButton.click();

    // Verificar navegación exitosa a /uplay
    await page.waitForURL('**/uplay', { timeout: 10000 });
    console.log('✅ Navegación móvil a /uplay exitosa');
  });

  test('🔄 Verificar que la navegación ÜPlay funciona desde diferentes páginas', async ({ page }) => {
    console.log('🔍 Verificando navegación ÜPlay desde diferentes páginas...');

    // Navegar a Marketplace
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Verificar que el enlace ÜPlay sigue disponible
    const uplayFromMarketplace = page.locator('text=ÜPlay').first();
    await expect(uplayFromMarketplace).toBeVisible();
    await uplayFromMarketplace.click();
    await page.waitForURL('**/uplay', { timeout: 10000 });
    console.log('✅ Navegación desde Marketplace exitosa');

    // Navegar a Profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verificar que el enlace ÜPlay sigue disponible
    const uplayFromProfile = page.locator('text=ÜPlay').first();
    await expect(uplayFromProfile).toBeVisible();
    await uplayFromProfile.click();
    await page.waitForURL('**/uplay', { timeout: 10000 });
    console.log('✅ Navegación desde Profile exitosa');
  });
});
