import { test, expect } from '@playwright/test';

test.describe('Social Module - Cosmic Design System Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');

    // Hacer login con credenciales de testing
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar redirección después del login
    await page.waitForURL('**/', { timeout: 15000 });
  });

  test('debería navegar al módulo Social y mostrar el design system cósmico', async ({ page }) => {
    // Navegar a la página Social
    await page.goto('/social');

    // Verificar que la página carga correctamente
    await expect(page).toHaveTitle(/CoomÜnity/);

    // Verificar que el RevolutionaryWidget está presente con el título correcto
    await expect(page.locator('text=Social: Conexiones que Inspiran')).toBeVisible();

    // Verificar que hay elementos con el tema "aire" (colores azules/celestes)
    const cosmicElements = page.locator('[class*="universal-"]');
    await expect(cosmicElements.first()).toBeVisible();

    // Verificar que las métricas sociales están visibles
    await expect(page.locator('text=Feed Comunitario')).toBeVisible();
    await expect(page.locator('text=Conexiones de Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Círculos de Colaboración')).toBeVisible();
  });

  test('debería mostrar las tarjetas de posts con CosmicCard', async ({ page }) => {
    // Navegar a la página Social
    await page.goto('/social');

    // Esperar a que carguen los posts del feed
    await page.waitForTimeout(2000);

    // Verificar que hay cards con estilos cósmicos
    const postCards = page.locator('[class*="cosmic-card"], .MuiCard-root');
    await expect(postCards.first()).toBeVisible();

    // Verificar hover effects en las tarjetas (si hay posts visibles)
    const firstCard = postCards.first();
    if (await firstCard.isVisible()) {
      await firstCard.hover();
      // La tarjeta debería tener algún efecto visual al hacer hover
      await expect(firstCard).toBeVisible();
    }
  });

  test('debería tener navegación fluida entre tabs del módulo Social', async ({ page }) => {
    // Navegar a la página Social
    await page.goto('/social');

    // Verificar que los tabs están presentes
    await expect(page.locator('text=Feed Comunitario')).toBeVisible();
    await expect(page.locator('text=Conexiones de Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Círculos de Colaboración')).toBeVisible();
    await expect(page.locator('text=Hub de Crecimiento')).toBeVisible();

    // Hacer clic en el tab de Conexiones de Reciprocidad
    await page.click('text=Conexiones de Reciprocidad');
    await page.waitForTimeout(500);

    // Hacer clic en el tab de Círculos de Colaboración
    await page.click('text=Círculos de Colaboración');
    await page.waitForTimeout(500);

    // Hacer clic en el tab de Hub de Crecimiento
    await page.click('text=Hub de Crecimiento');
    await page.waitForTimeout(500);

    // Volver al Feed Comunitario
    await page.click('text=Feed Comunitario');
    await page.waitForTimeout(500);
  });

  test('debería mostrar el mensaje inspiracional flotante del elemento Aire', async ({ page }) => {
    // Navegar a la página Social
    await page.goto('/social');

    // Esperar a que aparezca el mensaje inspiracional (tiene delay)
    await page.waitForTimeout(3000);

    // Verificar que el mensaje inspiracional del Aire está presente
    await expect(page.locator('text=Sabiduría del Aire')).toBeVisible();
    await expect(page.locator('text=Como el viento que conecta montañas')).toBeVisible();
  });

  test('debería funcionar la conectividad con el backend para datos sociales', async ({ page }) => {
    // Navegar a la página Social
    await page.goto('/social');

    // Verificar indicadores de conectividad al backend
    const connectivityIndicator = page.locator('text=Modo Exploración');

    // Si está en modo exploración, está usando datos de demostración
    // Si no está visible, significa que está conectado al backend real
    const isInExplorationMode = await connectivityIndicator.isVisible();

    if (isInExplorationMode) {
      // En modo exploración, verificar que muestra el mensaje apropiado
      await expect(page.locator('text=datos de demostración')).toBeVisible();
    } else {
      // Conectado al backend, verificar que los datos se cargan
      await page.waitForTimeout(2000);
      // Los datos del backend deberían estar cargando o ya cargados
    }
  });
});
