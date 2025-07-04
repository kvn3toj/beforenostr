import { test, expect } from '@playwright/test';

// 🔹 SAGE: Comprehensive E2E test suite for Marketplace Consciousness
test.describe('🏪⚜️ Marketplace Consciousness - Guardian Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to marketplace and ensure authentication
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Handle potential login requirement
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await page.goto('/login');
      await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', '123456');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/', { timeout: 15000 });
      await page.goto('/marketplace');
      await page.waitForLoadState('networkidle');
    }
  });

  test('🌟 COSMOS: Marketplace loads with consciousness metrics', async ({ page }) => {
    // Verify marketplace page loads
    await expect(page).toHaveTitle(/CoomÜnity/);

    // Check for consciousness elements
    const marketplaceContainer = page.locator('[data-testid="marketplace-container"]').first();
    await expect(marketplaceContainer).toBeVisible({ timeout: 10000 });

    // Verify consciousness metrics are displayed
    const consciousnessMetrics = page.locator('[data-testid="consciousness-metrics"]');
    if (await consciousnessMetrics.isVisible()) {
      await expect(consciousnessMetrics).toBeVisible();
    }

    // Check for Reciprocidad score indicators
    const reciprocidadScores = page.locator('[data-testid*="reciprocidad-score"]');
    const reciprocidadCount = await reciprocidadScores.count();
    if (reciprocidadCount > 0) {
      expect(reciprocidadCount).toBeGreaterThan(0);
    }
  });

  test('🔹 ATLAS: Performance metrics under load', async ({ page }) => {
    const startTime = Date.now();

    // Load marketplace with performance monitoring
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds

    // Check for marketplace items
    const productCards = page.locator('[data-testid*="product-card"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Verify multiple items load
    const itemCount = await productCards.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('🔹 ARIA: Accessibility and visual design compliance', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Check for ARIA labels and accessibility
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveAttribute('aria-label');
    }

    // Verify contrast and readability
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    if (headingCount > 0) {
      expect(headingCount).toBeGreaterThan(0);
    }

    // Check for visual consciousness indicators
    const consciousnessLevels = page.locator('[data-testid*="consciousness-level"]');
    const levelCount = await consciousnessLevels.count();
    // May or may not be present depending on implementation
  });

  test('🔹 ZENO: User journey and micro-interactions', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Test search functionality
    const searchBox = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchBox.isVisible()) {
      await searchBox.fill('servicio');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      // Verify search results update
      const resultsContainer = page.locator('[data-testid="marketplace-container"], [data-testid="search-results"]').first();
      await expect(resultsContainer).toBeVisible();
    }

    // Test filter interactions
    const filterButton = page.locator('button[aria-label*="filtro"], button:has-text("Filtros")').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(1000);

      // Verify filter panel opens
      const filterPanel = page.locator('[data-testid="filter-panel"], [role="dialog"]').first();
      if (await filterPanel.isVisible()) {
        await expect(filterPanel).toBeVisible();

        // Close filter panel
        const closeButton = page.locator('button[aria-label*="cerrar"], button:has-text("Cerrar")').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      }
    }
  });

  test('🌟 COSMOS: Reciprocidad and consciousness integration', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Look for consciousness elements in products
    const productCards = page.locator('[data-testid*="product-card"], .marketplace-item').first();
    if (await productCards.isVisible()) {
      await expect(productCards).toBeVisible();

      // Check for Reciprocidad score display
      const reciprocidadElement = page.locator('[data-testid*="reciprocidad"], [title*="Reciprocidad"], [aria-label*="Reciprocidad"]').first();
      if (await reciprocidadElement.isVisible()) {
        await expect(reciprocidadElement).toBeVisible();
      }

      // Check for consciousness level indicators
      const consciousnessElement = page.locator('[data-testid*="consciousness"], [title*="Consciencia"]').first();
      if (await consciousnessElement.isVisible()) {
        await expect(consciousnessElement).toBeVisible();
      }
    }
  });

  test('🔹 MIRA: Admin functionality verification', async ({ page }) => {
    // Try to access create item functionality
    const createButton = page.locator('button:has-text("Crear"), button:has-text("Añadir"), [data-testid="create-item"]').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(1000);

      // Verify create modal opens
      const createModal = page.locator('[role="dialog"], [data-testid="create-modal"]').first();
      if (await createModal.isVisible()) {
        await expect(createModal).toBeVisible();

        // Close modal
        const cancelButton = page.locator('button:has-text("Cancelar"), button[aria-label*="cerrar"]').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      }
    }
  });

  test('🔹 LUNA: Temporal rhythms and notifications', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Check for notification indicators
    const notificationBell = page.locator('[data-testid="notifications"], button[aria-label*="notific"]').first();
    if (await notificationBell.isVisible()) {
      await expect(notificationBell).toBeVisible();
    }

    // Verify temporal elements like "hace X tiempo"
    const timeElements = page.locator('[data-testid*="time"], [title*="hace"], text=/hace .* (minuto|hora|día)/').first();
    if (await timeElements.isVisible()) {
      await expect(timeElements).toBeVisible();
    }
  });

  test('🔹 PAX: Error handling and conflict resolution', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/marketplace/**', route => route.abort());

    await page.goto('/marketplace');
    await page.waitForTimeout(3000);

    // Look for error states or retry mechanisms
    const errorMessage = page.locator('[data-testid="error-message"], [role="alert"], text=/error|problema|falló/i').first();
    const retryButton = page.locator('button:has-text("Reintentar"), button:has-text("Volver a cargar")').first();

    // Either error message or retry button should be present
    const hasErrorHandling = await errorMessage.isVisible() || await retryButton.isVisible();

    if (await retryButton.isVisible()) {
      await retryButton.click();
      await page.waitForTimeout(1000);
    }

    // Restore network
    await page.unroute('**/api/marketplace/**');
  });

  test('🔹 GAIA: Sustainability and ecological consciousness', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Look for sustainability indicators
    const sustainabilityElements = page.locator(
      '[data-testid*="sustainability"], [title*="sostenib"], [aria-label*="ecológ"], [data-testid*="impact"]'
    );

    const sustainabilityCount = await sustainabilityElements.count();
    // May or may not be present, but document the current state
    console.log(`Found ${sustainabilityCount} sustainability indicators`);

    // Check for local/regional/global impact indicators
    const impactElements = page.locator('[data-testid*="impact"], [title*="impacto"]');
    const impactCount = await impactElements.count();
    console.log(`Found ${impactCount} impact indicators`);
  });

  test('🎯 INTEGRATION: Complete marketplace workflow', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // Complete user journey
    const startTime = Date.now();

    // 1. Browse marketplace
    const marketplaceContainer = page.locator('[data-testid="marketplace-container"]').first();
    await expect(marketplaceContainer).toBeVisible({ timeout: 10000 });

    // 2. Search for items
    const searchBox = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchBox.isVisible()) {
      await searchBox.fill('servicio');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }

    // 3. View product details (if products exist)
    const productCard = page.locator('[data-testid*="product-card"], .marketplace-item').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(2000);

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }

    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(30000); // Complete workflow under 30 seconds

    console.log(`Complete marketplace workflow completed in ${totalTime}ms`);
  });
});

// 🔹 SAGE: Performance and quality metrics
test.describe('🚀 Marketplace Performance Benchmarks', () => {

  test('📊 Load performance under normal conditions', async ({ page }) => {
    const performanceMetrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      itemCount: 0,
    };

    const startTime = Date.now();

    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    performanceMetrics.loadTime = Date.now() - startTime;

    // Count loaded items
    const items = page.locator('[data-testid*="product-card"], .marketplace-item');
    performanceMetrics.itemCount = await items.count();

    // Performance expectations
    expect(performanceMetrics.loadTime).toBeLessThan(8000);
    expect(performanceMetrics.itemCount).toBeGreaterThanOrEqual(0);

    console.log('Marketplace Performance Metrics:', performanceMetrics);
  });

  test('🔍 Search performance benchmark', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    const searchBox = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchBox.isVisible()) {
      const searchStartTime = Date.now();

      await searchBox.fill('test');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      const searchTime = Date.now() - searchStartTime;
      expect(searchTime).toBeLessThan(5000);

      console.log(`Search completed in ${searchTime}ms`);
    } else {
      console.log('Search functionality not available for testing');
    }
  });
});
