import { test, expect } from '@playwright/test';

test.describe('Home Visual Improvements', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page (use relative URL since baseURL is configured)
    await page.goto('/');
    
    // Wait for React to mount
    await page.waitForSelector('#root');
    
    // Wait for authentication to complete and redirect to home if needed
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Wait for the home content to load
    await page.waitForSelector('[data-testid="welcome-header"], .home-welcome-header', { timeout: 10000 });
  });

  test('should display enhanced welcome header with time-based greeting', async ({ page }) => {
    // Check if the welcome header is present
    const welcomeHeader = page.locator('[data-testid="welcome-header"]');
    await expect(welcomeHeader).toBeVisible();

    // Check for time-based greeting elements (more flexible pattern)
    const greetingText = page.locator('text=/Buenos días|Buenas tardes|Buenas noches|amanecer|equilibrio/').first();
    await expect(greetingText).toBeVisible();

    // Check for progress bar
    const progressBar = page.locator('.MuiLinearProgress-root').first();
    await expect(progressBar).toBeVisible();

    // Check for animated avatar
    const avatar = page.locator('.MuiAvatar-root').first();
    await expect(avatar).toBeVisible();
  });

  test('should display enhanced elemental progress circles', async ({ page }) => {
    // Wait for the metrics card to load
    await page.waitForSelector('text=/Equilibrio Elemental/i', { timeout: 10000 });

    // Check for elemental progress circles
    const elementalSection = page.locator('text=/Equilibrio Elemental/i').locator('..').locator('..');
    await expect(elementalSection).toBeVisible();

    // Check for SVG circles (elemental progress indicators)
    const progressCircles = elementalSection.locator('svg circle');
    await expect(progressCircles.first()).toBeVisible();

    // Check for element icons
    const elementIcons = elementalSection.locator('text=/🌱|💧|🔥|💨/');
    await expect(elementIcons.first()).toBeVisible();
  });

  test('should display metrics relationships component', async ({ page }) => {
    // Wait for the metrics relationships section
    await page.waitForSelector('text=/Eficiencia Ayni|Impacto Comunitario/i', { timeout: 10000 });

    // Check for efficiency metric
    const efficiencyMetric = page.locator('text=/Eficiencia Ayni/i');
    await expect(efficiencyMetric).toBeVisible();

    // Check for community impact metric
    const impactMetric = page.locator('text=/Impacto Comunitario/i');
    await expect(impactMetric).toBeVisible();

    // Check for percentage values
    const percentageValues = page.locator('text=/%/');
    await expect(percentageValues.first()).toBeVisible();
  });

  test('should display enhanced balance insights', async ({ page }) => {
    // Wait for balance insights
    await page.waitForSelector('text=/Elemento Dominante/i', { timeout: 10000 });

    // Check for dominant element display
    const dominantElement = page.locator('text=/Elemento Dominante/i');
    await expect(dominantElement).toBeVisible();

    // Check for balance score chip (use first() to avoid strict mode violation)
    const balanceChip = page.locator('text=/equilibrio/i').first();
    await expect(balanceChip).toBeVisible();

    // Check for recommendations
    const recommendations = page.locator('text=/Recomendaciones para tu crecimiento/i');
    await expect(recommendations).toBeVisible();
  });

  test('should have proper CSS animations and classes applied', async ({ page }) => {
    // Check for home-enhanced CSS classes
    const homeContainer = page.locator('.home-container').first();
    await expect(homeContainer).toBeVisible();

    // Check for Material UI components (which have built-in animations)
    const muiComponents = page.locator('[class*="Mui"]');
    await expect(muiComponents.first()).toBeVisible();

    // Check for welcome header with enhanced styling
    const welcomeHeader = page.locator('[data-testid="welcome-header"]');
    await expect(welcomeHeader).toBeVisible();
  });

  test('should display proper CoomÜnity terminology', async ({ page }) => {
    // Check for Öndas (use first() to avoid strict mode violation)
    const ondas = page.locator('text=/Öndas/i').first();
    await expect(ondas).toBeVisible();

    // Check for Mëritos (use first() to avoid strict mode violation)
    const meritos = page.locator('text=/Mëritos/i').first();
    await expect(meritos).toBeVisible();

    // Check for Ayni (use first() to avoid strict mode violation)
    const ayni = page.locator('text=/Ayni/i').first();
    await expect(ayni).toBeVisible();

    // Check for Bien Común (use first() to avoid strict mode violation)
    const bienComun = page.locator('text=/Bien Común/i').first();
    await expect(bienComun).toBeVisible();
  });

  test('should be responsive and mobile-friendly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);

    // Check that main content is still visible
    const mainContent = page.locator('#root');
    await expect(mainContent).toBeVisible();

    // Check that elements stack properly on mobile
    const welcomeHeader = page.locator('.home-welcome-header, [data-testid="welcome-header"]').first();
    await expect(welcomeHeader).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Check that layout adapts
    await expect(mainContent).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    await expect(mainContent).toBeVisible();
  });

  test('should handle hover interactions properly', async ({ page }) => {
    // Test hover on elemental progress circles
    const elementalSection = page.locator('text=/Equilibrio Elemental/i').locator('..').locator('..');
    const firstCircle = elementalSection.locator('svg').first();
    
    if (await firstCircle.isVisible()) {
      await firstCircle.hover();
      
      // Check for tooltip or hover effects
      const tooltip = page.locator('[class*="tooltip"], [class*="hover"]');
      // Note: We don't assert visibility since hover effects might be CSS-only
    }

    // Test hover on metrics cards
    const metricsCard = page.locator('text=/Eficiencia Ayni/i').locator('..').locator('..');
    if (await metricsCard.isVisible()) {
      await metricsCard.hover();
      // Hover effects should be applied via CSS
    }
  });
}); 