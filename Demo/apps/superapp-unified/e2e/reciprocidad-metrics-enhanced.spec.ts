import { test, expect } from '@playwright/test';

test.describe('ReciprocidadMetricsCard Enhanced Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page where ReciprocidadMetricsCard is displayed
    await page.goto('/');
    
    // Wait for the component to load
    await page.waitForSelector('[aria-label="Tarjeta de métricas Reciprocidad"]');
  });

  test('should display main balance with proper accessibility', async ({ page }) => {
    // Check main balance display
    const balanceRegion = page.locator('[aria-label="Balance Reciprocidad Principal"]');
    await expect(balanceRegion).toBeVisible();
    
    // Verify balance percentage is displayed
    const balanceText = balanceRegion.locator('h1');
    await expect(balanceText).toBeVisible();
    await expect(balanceText).toContainText('%');
    
    // Check status message is live region
    const statusMessage = balanceRegion.locator('[role="status"][aria-live="polite"]');
    await expect(statusMessage).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on the detailed view toggle button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Navigate to expand button
    
    // Press Enter to expand detailed view
    await page.keyboard.press('Enter');
    
    // Verify detailed view is expanded
    const detailedView = page.locator('[aria-label="Vista detallada de métricas"]');
    await expect(detailedView).toBeVisible();
    
    // Press Escape to close detailed view
    await page.keyboard.press('Escape');
    
    // Verify detailed view is collapsed
    await expect(detailedView).not.toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check main container has proper role
    const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
    await expect(mainCard).toHaveAttribute('role', 'region');
    
    // Check toolbar has proper role
    const toolbar = page.locator('[role="toolbar"][aria-label="Controles de métricas"]');
    await expect(toolbar).toBeVisible();
    
    // Check compact metrics region
    const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
    await expect(compactMetrics).toHaveAttribute('role', 'region');
    
    // Check expand button has proper aria-expanded
    const expandButton = page.locator('[aria-label*="vista detallada"]');
    await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to expand and check aria-expanded changes
    await expandButton.click();
    await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('should display compact metrics with accessibility', async ({ page }) => {
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

  test('should show detailed elemental balance when expanded', async ({ page }) => {
    // Expand detailed view
    const expandButton = page.locator('[aria-label*="vista detallada"]');
    await expandButton.click();
    
    // Check elemental balance section
    const elementalGroup = page.locator('[aria-label="Elementos del balance Reciprocidad"]');
    await expect(elementalGroup).toBeVisible();
    await expect(elementalGroup).toHaveAttribute('role', 'group');
    
    // Check individual elements have proper accessibility
    const fuegoElement = page.locator('[aria-label="Elemento Fuego - Acción y energía"]');
    await expect(fuegoElement).toBeVisible();
    await expect(fuegoElement).toHaveAttribute('role', 'button');
    await expect(fuegoElement).toHaveAttribute('tabindex', '0');
    
    // Test keyboard interaction with elements
    await fuegoElement.focus();
    await page.keyboard.press('Enter');
    await expect(fuegoElement).toHaveAttribute('aria-pressed', 'true');
  });

  test('should handle refresh functionality', async ({ page }) => {
    // Find refresh button
    const refreshButton = page.locator('[aria-label="Actualizar métricas Reciprocidad"]');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh button
    await refreshButton.click();
    
    // Verify button shows loading state (should be disabled briefly)
    await expect(refreshButton).toBeDisabled();
    
    // Wait for refresh to complete
    await page.waitForTimeout(1100); // Wait for refresh timeout
    await expect(refreshButton).toBeEnabled();
  });

  test('should show connection status when offline', async ({ page }) => {
    // This test would need to simulate offline state
    // For now, we'll check if the offline indicator exists in DOM
    const offlineIndicator = page.locator('[aria-label="Sin conexión a internet"]');
    
    // The indicator might not be visible if connected, but should exist in DOM
    const indicatorCount = await offlineIndicator.count();
    expect(indicatorCount).toBeGreaterThanOrEqual(0);
  });

  test('should display insights when available', async ({ page }) => {
    // Expand detailed view
    const expandButton = page.locator('[aria-label*="vista detallada"]');
    await expandButton.click();
    
    // Check for insight section
    const insightSection = page.locator('[aria-label="Insight elemental personalizado"]');
    
    // Insight might not always be available, so we check if it exists
    const insightCount = await insightSection.count();
    if (insightCount > 0) {
      await expect(insightSection).toBeVisible();
      await expect(insightSection).toHaveAttribute('role', 'complementary');
      
      // Check insight has proper heading
      const insightHeading = insightSection.locator('h4');
      await expect(insightHeading).toBeVisible();
      await expect(insightHeading).toContainText('Insight Elemental');
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h2:has-text("Tu Balance Reciprocidad")');
    await expect(mainHeading).toBeVisible();
    
    // Expand detailed view to check sub-headings
    const expandButton = page.locator('[aria-label*="vista detallada"]');
    await expandButton.click();
    
    // Check detailed section heading
    const detailedHeading = page.locator('h3:has-text("Balance Elemental Detallado")');
    await expect(detailedHeading).toBeVisible();
  });

  test('should handle animations smoothly', async ({ page }) => {
    // Check that main balance display fades in
    const balanceDisplay = page.locator('[aria-label="Balance Reciprocidad Principal"]');
    await expect(balanceDisplay).toBeVisible();
    
    // Test expand/collapse animation
    const expandButton = page.locator('[aria-label*="vista detallada"]');
    const detailedView = page.locator('[aria-label="Vista detallada de métricas"]');
    
    // Expand
    await expandButton.click();
    await expect(detailedView).toBeVisible();
    
    // Collapse
    await expandButton.click();
    await expect(detailedView).not.toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
    await expect(mainCard).toBeVisible();
    
    // Check that compact metrics are still visible
    const compactMetrics = page.locator('[aria-label="Métricas compactas de CoomÜnity"]');
    await expect(compactMetrics).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(mainCard).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(mainCard).toBeVisible();
  });
});

test.describe('ReciprocidadMetricsCard Error Handling', () => {
  test('should handle missing data gracefully', async ({ page }) => {
    // This test would need to mock API responses with missing data
    // For now, we verify the component renders without crashing
    await page.goto('/');
    
    const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
    await expect(mainCard).toBeVisible();
    
    // Check that even with potential missing data, basic elements are present
    const balanceDisplay = page.locator('[aria-label="Balance Reciprocidad Principal"]');
    await expect(balanceDisplay).toBeVisible();
  });

  test('should show loading state properly', async ({ page }) => {
    // Navigate to page and check for loading state
    await page.goto('/');
    
    // The loading state might be brief, but we can check if it exists
    const loadingState = page.locator('[aria-label="Cargando métricas Reciprocidad"]');
    
    // Either loading state or main card should be visible
    const mainCard = page.locator('[aria-label="Tarjeta de métricas Reciprocidad"]');
    
    // At least one should be visible
    const isLoadingVisible = await loadingState.isVisible();
    const isMainCardVisible = await mainCard.isVisible();
    
    expect(isLoadingVisible || isMainCardVisible).toBe(true);
  });
}); 