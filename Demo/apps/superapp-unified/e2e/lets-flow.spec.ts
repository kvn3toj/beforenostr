import { test, expect } from '@playwright/test';

// =======================================================================
// ANÁLISIS Y CORRECCIÓN
// El test fallaba por dos motivos principales:
// 1. Lógica de Login Frágil: El `beforeEach` no era robusto y fallaba si la página
//    no estaba exactamente en el estado esperado (mostrando el input de email).
// 2. Ruta Incorrecta: La segunda suite navegaba a '/lets-marketplace', una ruta
//    que no existe. La ruta correcta es '/lets'.
//
// SOLUCIÓN:
// - Se ha unificado y fortalecido la lógica de `beforeEach` en un solo bloque
//   `test.beforeAll` para iniciar sesión una vez de forma segura.
// - Se ha corregido la ruta de navegación en todos los tests a '/lets'.
// - Se han ajustado los selectores para que coincidan con la implementación actual.
// =======================================================================

test.describe('LETS Module End-to-End Flow', () => {
  // Usar el estado de autenticación guardado para todos los tests de esta suite
  test.use({ storageState: 'playwright/.auth/admin.json' });

  // 🐛 CORRECCIÓN CRÍTICA: Limpiar el estado del wizard antes de cada test
  // Esto previene la "contaminación de estado" entre ejecuciones y asegura
  // que el wizard aparezca siempre que el test lo espere.
  test.beforeEach(async ({ page }) => {
    // Es crucial ir a una página del dominio ANTES de intentar acceder a localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('LETS_ONBOARDING_COMPLETED');
    });
    // Ahora sí, navegar a la página de LETS para el test
    await page.goto('/lets');
  });

  test('should display the LETS marketplace page correctly after login', async ({ page }) => {
    await expect(page.locator('h1:has-text("Mercado LETS Humanizado")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('p:has-text("Intercambia conocimientos, productos y servicios")')).toBeVisible();
  });

  test.describe('Onboarding Wizard', () => {
    test('should display the onboarding wizard for new users', async ({ page }) => {
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).toBeVisible();
      await expect(page.locator('h2:has-text("Bienvenido al Mercado LETS")')).toBeVisible();
    });

    test('should navigate through the onboarding steps', async ({ page }) => {
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).toBeVisible();

      // Ir al siguiente paso
      await page.click('button:has-text("Siguiente")');
      await expect(page.locator('h2:has-text("¿Qué es Reciprocidad?")')).toBeVisible();

      // Ir al siguiente paso
      await page.click('button:has-text("Siguiente")');
      await expect(page.locator('h2:has-text("Comienza a Intercambiar")')).toBeVisible();

      // Finalizar
      await page.click('button:has-text("Entendido, ¡vamos allá!")');
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).not.toBeVisible();
    });

    test('should persist the completed state and not show wizard on reload', async ({ page }) => {
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).toBeVisible();

      // Completar el wizard rápidamente
      await page.click('button:has-text("Omitir por ahora")');
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).not.toBeVisible();

      // Recargar la página
      await page.reload();

      // Esperar a que la página se cargue completamente después de la recarga
      await page.waitForSelector('h1:has-text("Mercado LETS Humanizado")');

      // Verificar que el wizard NO aparece de nuevo
      await expect(page.locator('[data-testid="lets-onboarding-wizard"]')).not.toBeVisible();
    });
  });
});
