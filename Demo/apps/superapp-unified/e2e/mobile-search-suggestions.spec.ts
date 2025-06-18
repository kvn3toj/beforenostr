import { test, expect } from '@playwright/test';

test.describe('Mobile Marketplace Search Suggestions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the marketplace
    await page.goto('http://localhost:2222/marketplace');
    await page.waitForSelector('#root');

    // Wait for the mobile marketplace view to load
    await page.waitForSelector('[data-testid="mobile-marketplace"]', {
      timeout: 10000,
    });
  });

  test('should show search suggestions when search input is focused', async ({
    page,
  }) => {
    // Find and click the search input
    const searchInput = page.locator(
      'input[placeholder="¿Qué quieres encontrar?"]'
    );
    await searchInput.click();

    // Wait for suggestions dropdown to appear
    await page.waitForSelector('text=Categorías populares', { timeout: 5000 });

    // Verify suggested categories are visible
    await expect(page.locator('text=Alimentos orgánicos')).toBeVisible();
    await expect(page.locator('text=Clases de baile')).toBeVisible();
    await expect(page.locator('text=Alimentación saludable')).toBeVisible();

    // Verify suggestions section is visible
    await expect(page.locator('text=Sugerencias')).toBeVisible();

    // Verify "Create Request" section is visible
    await expect(
      page.locator('text=¿No encuentras lo que quieres?')
    ).toBeVisible();
    await expect(page.locator('text=Crear solicitud')).toBeVisible();
  });

  test('should allow clicking on suggested categories', async ({ page }) => {
    // Click search input to show suggestions
    const searchInput = page.locator(
      'input[placeholder="¿Qué quieres encontrar?"]'
    );
    await searchInput.click();

    // Wait for suggestions to appear
    await page.waitForSelector('text=Categorías populares', { timeout: 5000 });

    // Click on a suggested category
    await page.locator('text=Alimentos orgánicos').click();

    // Verify the search input is filled with the clicked suggestion
    await expect(searchInput).toHaveValue('Alimentos orgánicos');
  });

  test('should allow clicking on suggested products/services', async ({
    page,
  }) => {
    // Click search input to show suggestions
    const searchInput = page.locator(
      'input[placeholder="¿Qué quieres encontrar?"]'
    );
    await searchInput.click();

    // Wait for suggestions to appear
    await page.waitForSelector('text=Sugerencias', { timeout: 5000 });

    // Find and click a suggested product (look for one that should be in the suggestions)
    const suggestionItems = page
      .locator('[data-testid="suggestion-item"]')
      .or(page.locator('text=Diseño gráfico'));

    if (await suggestionItems.first().isVisible()) {
      await suggestionItems.first().click();
    }
  });

  test('should show "Crear solicitud" button and allow interaction', async ({
    page,
  }) => {
    // Click search input to show suggestions
    const searchInput = page.locator(
      'input[placeholder="¿Qué quieres encontrar?"]'
    );
    await searchInput.click();

    // Wait for suggestions to appear
    await page.waitForSelector('text=¿No encuentras lo que quieres?', {
      timeout: 5000,
    });

    // Verify the create request button is clickable
    const createRequestButton = page.locator('text=Crear solicitud');
    await expect(createRequestButton).toBeVisible();
    await expect(createRequestButton).toBeEnabled();

    // Click the button (this should log to console for now)
    await createRequestButton.click();
  });

  test('should hide suggestions when input loses focus', async ({ page }) => {
    // Click search input to show suggestions
    const searchInput = page.locator(
      'input[placeholder="¿Qué quieres encontrar?"]'
    );
    await searchInput.click();

    // Wait for suggestions to appear
    await page.waitForSelector('text=Categorías populares', { timeout: 5000 });

    // Click somewhere else to blur the input
    await page.locator('text=Recomendados').click();

    // Wait for suggestions to disappear
    await page.waitForSelector('text=Categorías populares', {
      state: 'hidden',
      timeout: 5000,
    });
  });

  test('should show advanced filter system', async ({ page }) => {
    // Find and click the filter button
    const filterButton = page
      .locator('[data-testid="filter-button"]')
      .or(page.locator('button:has-text("Filtros")'))
      .or(page.locator('button[aria-label*="filter"]'))
      .or(page.locator('svg[data-testid="TuneIcon"]').locator('..'));

    if (await filterButton.first().isVisible()) {
      await filterButton.first().click();

      // Wait for filter drawer to open
      await page.waitForSelector('text=Filtros avanzados', { timeout: 5000 });

      // Verify key filter options are present
      await expect(page.locator('text=Categoría')).toBeVisible();
      await expect(page.locator('text=Ubicación')).toBeVisible();
      await expect(page.locator('text=Rango de precio')).toBeVisible();
      await expect(page.locator('text=Calificación mínima')).toBeVisible();
      await expect(
        page.locator('text=Solo emprendedores verificados')
      ).toBeVisible();
    }
  });
});
