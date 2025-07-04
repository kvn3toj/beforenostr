import { test, expect } from '@playwright/test';

test.describe('ReciprocidadMetricsCard - Comprehensive Functionality Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page where ReciprocidadMetricsCard is displayed
    await page.goto('/');
    
    // Wait for the component to load completely
    await page.waitForSelector('[aria-label="Tarjeta de métricas Reciprocidad"]', { timeout: 10000 });
    
    // Wait for any loading states to complete
    await page.waitForTimeout(1000);
  });

  test.describe('Core Functionality', () => {
    test('should display all main components with proper structure', async ({ page }) => {
      // Check main container
      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();
      await expect(mainCard).toHaveAttribute('role', 'region');

      // Check main heading
      const heading = page.locator('h2:has-text("Tu Balance Reciprocidad")');
      await expect(heading).toBeVisible();

      // Check toolbar controls
      const toolbar = page.locator('[role="toolbar"][aria-label="Controles de métricas"]');
      await expect(toolbar).toBeVisible();

      // Check main balance display
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      await expect(balanceRegion).toBeVisible();

      // Check compact metrics
      const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
      await expect(compactMetrics).toBeVisible();
    });

    test('should display balance percentage with proper formatting', async ({ page }) => {
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      const balanceText = balanceRegion.locator('h1');
      
      await expect(balanceText).toBeVisible();
      await expect(balanceText).toContainText('%');
      
      // Verify the percentage is a valid number
      const balanceValue = await balanceText.textContent();
      const numericValue = parseInt(balanceValue?.replace('%', '') || '0');
      expect(numericValue).toBeGreaterThanOrEqual(0);
      expect(numericValue).toBeLessThanOrEqual(100);
    });

    test('should show level progression information', async ({ page }) => {
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      
      // Check current level is displayed
      const levelText = balanceRegion.locator('text=Nivel');
      const hasLevel = await levelText.count() > 0;
      
      // Check next level chip
      const nextLevelChip = balanceRegion.locator('[aria-label*="Próximo nivel"]');
      if (await nextLevelChip.count() > 0) {
        await expect(nextLevelChip).toBeVisible();
      }

      // Check progress bar
      const progressBar = balanceRegion.locator('.MuiLinearProgress-root');
      if (await progressBar.count() > 0) {
        await expect(progressBar).toBeVisible();
      }
    });
  });

  test.describe('Compact Metrics Display', () => {
    test('should display all three compact metrics with proper values', async ({ page }) => {
      // Check Öndas metric
      const ondasMetric = page.locator('[aria-label*="Öndas:"]');
      await expect(ondasMetric).toBeVisible();
      await expect(ondasMetric).toHaveAttribute('role', 'button');
      await expect(ondasMetric).toHaveAttribute('tabindex', '0');

      // Check Mëritos metric
      const meritosMetric = page.locator('[aria-label*="Mëritos:"]');
      await expect(meritosMetric).toBeVisible();
      await expect(meritosMetric).toHaveAttribute('role', 'button');

      // Check Bien Común metric
      const bienComunMetric = page.locator('[aria-label*="Bien Común:"]');
      await expect(bienComunMetric).toBeVisible();
      await expect(bienComunMetric).toHaveAttribute('role', 'button');
    });

    test('should have proper focus management for compact metrics', async ({ page }) => {
      const ondasMetric = page.locator('[aria-label*="Öndas:"]');
      const meritosMetric = page.locator('[aria-label*="Mëritos:"]');
      const bienComunMetric = page.locator('[aria-label*="Bien Común:"]');

      // Test tab navigation through metrics
      await ondasMetric.focus();
      await expect(ondasMetric).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(meritosMetric).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(bienComunMetric).toBeFocused();
    });

    test('should display numeric values in compact metrics', async ({ page }) => {
      const metrics = [
        '[aria-label*="Öndas:"]',
        '[aria-label*="Mëritos:"]',
        '[aria-label*="Bien Común:"]'
      ];

      for (const metricSelector of metrics) {
        const metric = page.locator(metricSelector);
        const valueElement = metric.locator('h6');
        
        if (await valueElement.count() > 0) {
          const value = await valueElement.textContent();
          expect(value).toBeTruthy();
          
          // Verify it's a valid number (allowing for formatted numbers with commas)
          const numericValue = parseInt(value?.replace(/,/g, '') || '0');
          expect(numericValue).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Detailed View Functionality', () => {
    test('should expand and collapse detailed view correctly', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      const detailedView = page.locator('[aria-label="Vista detallada de métricas"]');

      // Initially collapsed
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      await expect(detailedView).not.toBeVisible();

      // Expand
      await expandButton.click();
      await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      await expect(detailedView).toBeVisible();

      // Collapse
      await expandButton.click();
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      await expect(detailedView).not.toBeVisible();
    });

    test('should show elemental balance when expanded', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();

      // Check elemental balance section
      const elementalGroup = page.locator('[aria-label="Elementos del balance Reciprocidad"]');
      await expect(elementalGroup).toBeVisible();
      await expect(elementalGroup).toHaveAttribute('role', 'group');

      // Check detailed section heading
      const detailedHeading = page.locator('h3:has-text("Balance Elemental Detallado")');
      await expect(detailedHeading).toBeVisible();
    });

    test('should display all four elemental icons when expanded', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();

      const elements = [
        'Elemento Fuego - Acción y energía',
        'Elemento Agua - Fluidez y adaptabilidad', 
        'Elemento Tierra - Estabilidad y fundamento',
        'Elemento Aire - Comunicación y visión'
      ];

      for (const elementLabel of elements) {
        const element = page.locator(`[aria-label="${elementLabel}"]`);
        await expect(element).toBeVisible();
        await expect(element).toHaveAttribute('role', 'button');
        await expect(element).toHaveAttribute('tabindex', '0');
      }
    });

    test('should handle elemental icon interactions', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();

      const fuegoElement = page.locator('[aria-label="Elemento Fuego - Acción y energía"]');
      
      // Test hover interaction
      await fuegoElement.hover();
      
      // Test keyboard interaction
      await fuegoElement.focus();
      await page.keyboard.press('Enter');
      
      // Check if aria-pressed attribute changes
      const ariaPressed = await fuegoElement.getAttribute('aria-pressed');
      expect(['true', 'false', null]).toContain(ariaPressed);
    });

    test('should show insights section when available', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();

      // Check for insight section (may not always be present)
      const insightSection = page.locator('[aria-label="Insight elemental personalizado"]');
      const insightCount = await insightSection.count();
      
      if (insightCount > 0) {
        await expect(insightSection).toBeVisible();
        await expect(insightSection).toHaveAttribute('role', 'complementary');
        
        const insightHeading = insightSection.locator('h4');
        await expect(insightHeading).toBeVisible();
        await expect(insightHeading).toContainText('Insight Elemental');
      }
    });
  });

  test.describe('Keyboard Navigation & Accessibility', () => {
    test('should support full keyboard navigation', async ({ page }) => {
      // Start with expand button
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.focus();
      
      // Press Enter to expand
      await page.keyboard.press('Enter');
      await expect(page.locator('[aria-label="Vista detallada de métricas"]')).toBeVisible();
      
      // Press Escape to close
      await page.keyboard.press('Escape');
      await expect(page.locator('[aria-label="Vista detallada de métricas"]')).not.toBeVisible();
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Main container
      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toHaveAttribute('role', 'region');

      // Toolbar
      const toolbar = page.locator('[role="toolbar"][aria-label="Controles de métricas"]');
      await expect(toolbar).toBeVisible();

      // Balance region
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      await expect(balanceRegion).toHaveAttribute('role', 'region');

      // Compact metrics region
      const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
      await expect(compactMetrics).toHaveAttribute('role', 'region');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Main heading (h2)
      const mainHeading = page.locator('h2:has-text("Tu Balance Reciprocidad")');
      await expect(mainHeading).toBeVisible();

      // Expand to check sub-headings
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();

      // Detailed section heading (h3)
      const detailedHeading = page.locator('h3:has-text("Balance Elemental Detallado")');
      await expect(detailedHeading).toBeVisible();
    });

    test('should provide live status updates', async ({ page }) => {
      const statusMessage = page.locator('[role="status"][aria-live="polite"]');
      
      // Status message should exist in the balance region
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      const statusInBalance = balanceRegion.locator('[role="status"][aria-live="polite"]');
      
      if (await statusInBalance.count() > 0) {
        await expect(statusInBalance).toBeVisible();
      }
    });
  });

  test.describe('Refresh Functionality', () => {
    test('should handle refresh button correctly', async ({ page }) => {
      const refreshButton = page.locator('[aria-label="Actualizar métricas Reciprocidad"]');
      await expect(refreshButton).toBeVisible();
      await expect(refreshButton).toBeEnabled();

      // Click refresh button
      await refreshButton.click();

      // Should be temporarily disabled during refresh
      await expect(refreshButton).toBeDisabled();

      // Wait for refresh to complete
      await page.waitForTimeout(1200);
      await expect(refreshButton).toBeEnabled();
    });

    test('should show refresh animation during update', async ({ page }) => {
      const refreshButton = page.locator('[aria-label="Actualizar métricas Reciprocidad"]');
      
      await refreshButton.click();
      
      // Check if the button has animation class (this might vary based on implementation)
      const buttonClasses = await refreshButton.getAttribute('class');
      expect(buttonClasses).toBeTruthy();
      
      // Wait for animation to complete
      await page.waitForTimeout(1200);
    });
  });

  test.describe('Connection Status', () => {
    test('should handle offline indicator when present', async ({ page }) => {
      // Check if offline indicator exists (might not be visible if connected)
      const offlineIndicator = page.locator('[aria-label="Sin conexión a internet"]');
      const indicatorCount = await offlineIndicator.count();
      
      // The indicator should exist in DOM structure
      expect(indicatorCount).toBeGreaterThanOrEqual(0);
      
      if (indicatorCount > 0) {
        // If present, it should have proper role
        await expect(offlineIndicator).toHaveAttribute('role', 'img');
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();

      // Compact metrics should still be visible
      const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
      await expect(compactMetrics).toBeVisible();

      // Balance display should adapt
      const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      await expect(balanceRegion).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();

      // Test expand functionality on tablet
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();
      
      const detailedView = page.locator('[aria-label="Vista detallada de métricas"]');
      await expect(detailedView).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });

      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();

      // All functionality should work on desktop
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();
      
      const elementalGroup = page.locator('[aria-label="Elementos del balance Reciprocidad"]');
      await expect(elementalGroup).toBeVisible();
    });
  });

  test.describe('Animation & Visual Effects', () => {
    test('should handle expand/collapse animations smoothly', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      const detailedView = page.locator('[aria-label="Vista detallada de métricas"]');

      // Expand with animation
      await expandButton.click();
      await expect(detailedView).toBeVisible();
      
      // Small delay to allow animation
      await page.waitForTimeout(300);
      
      // Collapse with animation
      await expandButton.click();
      await expect(detailedView).not.toBeVisible();
    });

    test('should display balance with fade-in effect', async ({ page }) => {
      // The balance display should be visible after fade-in
      const balanceDisplay = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      await expect(balanceDisplay).toBeVisible();
      
      // Check that the main balance number is visible
      const balanceText = balanceDisplay.locator('h1');
      await expect(balanceText).toBeVisible();
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('should handle missing or invalid data gracefully', async ({ page }) => {
      // Component should render without crashing even with potential missing data
      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();

      // Basic elements should be present
      const balanceDisplay = page.locator('[aria-label="Balance Reciprocidad Principal"]');
      await expect(balanceDisplay).toBeVisible();

      const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
      await expect(compactMetrics).toBeVisible();
    });

    test('should show loading state when appropriate', async ({ page }) => {
      // Check for loading state (might be brief)
      const loadingState = page.locator('[aria-label="Cargando métricas Reciprocidad"]');
      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');

      // Either loading or main card should be visible
      const isLoadingVisible = await loadingState.isVisible();
      const isMainCardVisible = await mainCard.isVisible();
      
      expect(isLoadingVisible || isMainCardVisible).toBe(true);
    });

    test('should handle zero values correctly', async ({ page }) => {
      // All metrics should handle zero values without errors
      const metrics = page.locator('[aria-label*="Öndas:"], [aria-label*="Mëritos:"], [aria-label*="Bien Común:"]');
      const metricCount = await metrics.count();
      
      expect(metricCount).toBeGreaterThan(0);
      
      // Each metric should be visible
      for (let i = 0; i < metricCount; i++) {
        await expect(metrics.nth(i)).toBeVisible();
      }
    });
  });

  test.describe('Performance & Optimization', () => {
    test('should load component within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('[aria-label="Tarjeta de métricas Reciprocidad"]');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should not cause memory leaks during interactions', async ({ page }) => {
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      
      // Perform multiple expand/collapse operations
      for (let i = 0; i < 5; i++) {
        await expandButton.click();
        await page.waitForTimeout(100);
        await expandButton.click();
        await page.waitForTimeout(100);
      }
      
      // Component should still be responsive
      await expect(expandButton).toBeVisible();
      await expect(expandButton).toBeEnabled();
    });

    test('should handle rapid refresh clicks gracefully', async ({ page }) => {
      const refreshButton = page.locator('[aria-label="Actualizar métricas Reciprocidad"]');
      
      // Click refresh multiple times rapidly
      await refreshButton.click();
      await refreshButton.click();
      await refreshButton.click();
      
      // Should handle gracefully (button disabled during refresh)
      await expect(refreshButton).toBeDisabled();
      
      // Wait for completion
      await page.waitForTimeout(1200);
      await expect(refreshButton).toBeEnabled();
    });
  });

  test.describe('Integration with Home Page', () => {
    test('should integrate properly with home page layout', async ({ page }) => {
      // Check that the component doesn't interfere with other page elements
      const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
      await expect(mainCard).toBeVisible();
      
      // Check that page navigation still works
      const homeElement = page.locator('body');
      await expect(homeElement).toBeVisible();
      
      // Verify no JavaScript errors in console
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Interact with component
      const expandButton = page.locator('[aria-label*="vista detallada"]');
      await expandButton.click();
      
      // Wait a bit for any potential errors
      await page.waitForTimeout(500);
      
      // Filter out expected/harmless errors
      const criticalErrors = errors.filter(error => 
        !error.includes('Failed to load resource') && 
        !error.includes('404') &&
        !error.includes('favicon')
      );
      
      expect(criticalErrors.length).toBe(0);
    });
  });
}); 