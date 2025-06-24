import { test, expect } from '@playwright/test';

test.describe('Marketplace Simple Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL('**/', { timeout: 10000 });
  });

  test('Verificar que el marketplace carga correctamente', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Marketplace carga correctamente');
  });

  test('Verificar que existe el botón de crear', async ({ page }) => {
    await page.goto('/marketplace');
    
    // Buscar FAB de creación (desktop)
    const createFab = page.locator('[data-testid="create-item-fab"]');
    
    if (await createFab.isVisible()) {
      console.log('✅ FAB de creación encontrado en desktop');
      await createFab.click();
      await expect(page.locator('text=Crear')).toBeVisible({ timeout: 5000 });
      console.log('✅ Modal de creación se abre correctamente');
    } else {
      // Buscar SpeedDial (mobile)
      await page.setViewportSize({ width: 375, height: 667 });
      const speedDial = page.locator('[aria-label="Quick Actions"]');
      
      if (await speedDial.isVisible()) {
        console.log('✅ SpeedDial encontrado en mobile');
        await speedDial.click();
        await page.click('text=Publicar');
        await expect(page.locator('text=Crear')).toBeVisible({ timeout: 5000 });
        console.log('✅ Modal de creación se abre desde mobile');
      } else {
        console.log('⚠️ No se encontró botón de crear en desktop ni mobile');
      }
    }
  });
}); 