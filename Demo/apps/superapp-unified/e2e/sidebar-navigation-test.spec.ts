import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation - New ÜPlay Links', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la autenticación se complete y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
  });

  test('🎮 Navegación a ÜPlay Horizontal Demo desde el menú lateral', async ({ page }) => {
    console.log('🔍 Verificando navegación a Horizontal Demo...');
    
    // Buscar el enlace en el sidebar
    const horizontalDemoLink = page.locator('[data-testid="sidebar"]').locator('text=ÜPlay Horizontal Demo');
    
    // Verificar que el enlace existe
    await expect(horizontalDemoLink).toBeVisible();
    console.log('✅ Enlace "ÜPlay Horizontal Demo" encontrado en el sidebar');
    
    // Hacer clic en el enlace
    await horizontalDemoLink.click();
    
    // Esperar a que la navegación se complete
    await page.waitForURL('**/uplay/horizontal-demo', { timeout: 10000 });
    console.log('✅ Navegación a /uplay/horizontal-demo completada');
    
    // Verificar que la página se cargó correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar elementos específicos de la página Horizontal Demo
    await expect(page.locator('h1')).toContainText('Reproductor Horizontal ÜPlay');
    await expect(page.locator('text=GPL - Gamified Play List')).toBeVisible();
    await expect(page.locator('text=Video Demo')).toBeVisible();
    
    console.log('✅ Página Horizontal Demo cargada correctamente');
  });

  test('🎯 Navegación a ÜPlay Gamified desde el menú lateral', async ({ page }) => {
    console.log('🔍 Verificando navegación a ÜPlay Gamified...');
    
    // Buscar el enlace en el sidebar
    const gamifiedLink = page.locator('[data-testid="sidebar"]').locator('text=ÜPlay Gamified');
    
    // Verificar que el enlace existe
    await expect(gamifiedLink).toBeVisible();
    console.log('✅ Enlace "ÜPlay Gamified" encontrado en el sidebar');
    
    // Hacer clic en el enlace
    await gamifiedLink.click();
    
    // Esperar a que la navegación se complete
    await page.waitForURL('**/uplay-gamified', { timeout: 10000 });
    console.log('✅ Navegación a /uplay-gamified completada');
    
    // Verificar que la página se cargó correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar elementos específicos de la página ÜPlay Gamified
    await expect(page.locator('text=ÜPlay - Reproductor Gamificado')).toBeVisible();
    await expect(page.locator('text=GPL - Gamified Play List')).toBeVisible();
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Nivel')).toBeVisible();
    
    console.log('✅ Página ÜPlay Gamified cargada correctamente');
  });

  test('🔄 Navegación entre las páginas ÜPlay', async ({ page }) => {
    console.log('🔍 Verificando navegación entre páginas ÜPlay...');
    
    // Ir a ÜPlay Gamified
    const gamifiedLink = page.locator('[data-testid="sidebar"]').locator('text=ÜPlay Gamified');
    await gamifiedLink.click();
    await page.waitForURL('**/uplay-gamified', { timeout: 10000 });
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('text=ÜPlay - Reproductor Gamificado')).toBeVisible();
    console.log('✅ En página ÜPlay Gamified');
    
    // Navegar a Horizontal Demo
    const horizontalDemoLink = page.locator('[data-testid="sidebar"]').locator('text=ÜPlay Horizontal Demo');
    await horizontalDemoLink.click();
    await page.waitForURL('**/uplay/horizontal-demo', { timeout: 10000 });
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Reproductor Horizontal ÜPlay');
    console.log('✅ En página Horizontal Demo');
    
    // Navegar a ÜPlay principal
    const uplayMainLink = page.locator('[data-testid="sidebar"]').locator('text=ÜPlay').first();
    await uplayMainLink.click();
    await page.waitForURL('**/play', { timeout: 10000 });
    
    // Verificar que estamos en la página principal de ÜPlay
    await expect(page.locator('text=ÜPlay')).toBeVisible();
    console.log('✅ En página ÜPlay principal');
    
    console.log('✅ Navegación entre páginas ÜPlay completada exitosamente');
  });

  test('📱 Verificar que los enlaces funcionan en móvil', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    console.log('🔍 Verificando navegación móvil...');
    
    // En móvil, el sidebar está en un drawer que necesita ser abierto
    // Buscar el botón de menú móvil
    const menuButton = page.locator('[data-testid="mobile-navigation-menu"]').locator('button').first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Buscar el enlace en el drawer móvil
    const horizontalDemoLink = page.locator('text=ÜPlay Horizontal Demo');
    await expect(horizontalDemoLink).toBeVisible();
    
    // Hacer clic en el enlace
    await horizontalDemoLink.click();
    
    // Verificar navegación
    await page.waitForURL('**/uplay/horizontal-demo', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Reproductor Horizontal ÜPlay');
    
    console.log('✅ Navegación móvil funcionando correctamente');
  });
}); 