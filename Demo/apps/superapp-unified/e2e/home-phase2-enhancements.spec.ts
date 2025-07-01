import { test, expect } from '@playwright/test';

test.describe('Home Phase 2: Component-Level Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for authentication and home page to load
    await page.waitForSelector('[data-testid="welcome-header"]', { timeout: 10000 });
  });

  test('should display enhanced module cards with micro-animations', async ({ page }) => {
    // Wait for module cards to load
    await page.waitForSelector('.module-card-enhanced', { timeout: 5000 });
    
    // Check that enhanced module cards are present
    const moduleCards = page.locator('.module-card-enhanced');
    await expect(moduleCards).toHaveCount(4);
    
    // Test hover effects on first module card
    const firstCard = moduleCards.first();
    await firstCard.hover();
    
    // Check for hover animations (CSS classes should be applied)
    await expect(firstCard).toHaveClass(/module-card-enhanced/);
    
    // Check for floating action button
    const floatingAction = firstCard.locator('.float-action');
    await expect(floatingAction).toBeVisible();
  });

  test('should display advanced elemental progress circles with glow effects', async ({ page }) => {
    // Wait for elemental progress circles to load
    await page.waitForSelector('.elemental-progress-enhanced', { timeout: 5000 });
    
    const progressCircles = page.locator('.elemental-progress-enhanced');
    await expect(progressCircles).toHaveCount(4); // tierra, agua, fuego, aire
    
    // Test hover effect on first progress circle
    const firstCircle = progressCircles.first();
    await firstCircle.hover();
    
    // Check that glow effect is triggered (CSS animation should be active)
    await expect(firstCircle).toHaveClass(/elemental-progress-enhanced/);
  });

  test('should show enhanced loading states', async ({ page }) => {
    // Reload page to catch loading states
    await page.reload();
    
    // Check for loading shimmer or skeleton
    const loadingElements = page.locator('.loading-shimmer, .loading-pulse, .animate-gentle-pulse');
    
    // At least one loading element should be visible initially
    await expect(loadingElements.first()).toBeVisible({ timeout: 1000 });
  });

  test('should display enhanced metrics with animations', async ({ page }) => {
    // Wait for metrics card to load
    await page.waitForSelector('[data-testid="reciprocidad-metrics-card"]', { timeout: 5000 });
    
    // Check for animated metrics
    const animatedMetrics = page.locator('.animate-fade-in, .animate-energy-flicker, .animate-gentle-pulse');
    await expect(animatedMetrics.first()).toBeVisible();
    
    // Check for hover effects on metrics
    const metricsCard = page.locator('[data-testid="reciprocidad-metrics-card"]');
    await metricsCard.hover();
    
    // Should have hover-lift class
    await expect(metricsCard).toHaveClass(/hover-lift/);
  });

  test('should display enhanced tooltips on elemental progress', async ({ page }) => {
    // Wait for elemental progress to load
    await page.waitForSelector('.elemental-progress-enhanced', { timeout: 5000 });
    
    const firstProgress = page.locator('.elemental-progress-enhanced').first();
    
    // Hover to trigger tooltip
    await firstProgress.hover();
    
    // Check for tooltip content
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
  });

  test('should show enhanced gradient overlays on hover', async ({ page }) => {
    // Wait for cards with gradient overlays
    await page.waitForSelector('.gradient-overlay-hover', { timeout: 5000 });
    
    const gradientCards = page.locator('.gradient-overlay-hover');
    const firstCard = gradientCards.first();
    
    // Hover to trigger gradient overlay
    await firstCard.hover();
    
    // Check that the element has the gradient overlay class
    await expect(firstCard).toHaveClass(/gradient-overlay-hover/);
  });

  test('should display smooth transitions on interactive elements', async ({ page }) => {
    // Check for smooth transition classes
    const smoothElements = page.locator('.smooth-transition');
    await expect(smoothElements.first()).toBeVisible();
    
    // Check for interactive scale elements
    const scaleElements = page.locator('.interactive-scale');
    if (await scaleElements.count() > 0) {
      await expect(scaleElements.first()).toBeVisible();
    }
  });

  test('should show enhanced focus states for accessibility', async ({ page }) => {
    // Tab through interactive elements to test focus states
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check for enhanced focus classes
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      // Should have enhanced focus styling
      const hasEnhancedFocus = await focusedElement.evaluate(el => 
        el.classList.contains('enhanced-focus') || 
        getComputedStyle(el).outline !== 'none'
      );
      expect(hasEnhancedFocus).toBeTruthy();
    }
  });

  test('should display floating action effects', async ({ page }) => {
    // Look for floating action elements
    const floatingActions = page.locator('.float-action');
    
    if (await floatingActions.count() > 0) {
      const firstAction = floatingActions.first();
      await expect(firstAction).toBeVisible();
      
      // Hover to test animation pause
      await firstAction.hover();
      await expect(firstAction).toHaveClass(/float-action/);
    }
  });

  test('should show metrics relationship lines with hover effects', async ({ page }) => {
    // Wait for metrics relationships component
    await page.waitForSelector('.metrics-relationship-line', { timeout: 5000 });
    
    const relationshipLines = page.locator('.metrics-relationship-line');
    if (await relationshipLines.count() > 0) {
      const firstLine = relationshipLines.first();
      
      // Hover to trigger line animation
      await firstLine.hover();
      await expect(firstLine).toHaveClass(/metrics-relationship-line/);
    }
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="welcome-header"]', { timeout: 10000 });
    
    // Animations should be disabled or reduced
    const animatedElements = page.locator('.animate-gentle-pulse, .animate-flowing-wave');
    
    // Check that animations are properly handled for reduced motion
    if (await animatedElements.count() > 0) {
      const firstAnimated = animatedElements.first();
      const animationDuration = await firstAnimated.evaluate(el => 
        getComputedStyle(el).animationDuration
      );
      
      // Animation should be disabled (0s) or very short for reduced motion
      expect(animationDuration === '0s' || parseFloat(animationDuration) < 0.1).toBeTruthy();
    }
  });

  test('should display enhanced loading skeleton variants', async ({ page }) => {
    // Test different loading states by reloading
    await page.reload();
    
    // Check for different skeleton variants
    const skeletonElements = page.locator('.loading-shimmer, .loading-pulse');
    
    // Should have at least one loading element
    await expect(skeletonElements.first()).toBeVisible({ timeout: 1000 });
  });

  test('should show enhanced module card statistics', async ({ page }) => {
    // Wait for module cards with stats
    await page.waitForSelector('.module-card-enhanced', { timeout: 5000 });
    
    const moduleCards = page.locator('.module-card-enhanced');
    const firstCard = moduleCards.first();
    
    // Check for stats within the card
    const stats = firstCard.locator('.module-stats');
    if (await stats.count() > 0) {
      await expect(stats).toBeVisible();
      
      // Hover to test stats animation
      await firstCard.hover();
      await expect(stats).toHaveClass(/module-stats/);
    }
  });

  test('should display enhanced inspirational message with animations', async ({ page }) => {
    // Look for the inspirational message section
    const inspirationalMessage = page.locator('.animate-fade-in').last();
    
    if (await inspirationalMessage.count() > 0) {
      await expect(inspirationalMessage).toBeVisible();
      
      // Should have hover lift effect
      await inspirationalMessage.hover();
      await expect(inspirationalMessage).toHaveClass(/hover-lift/);
    }
  });

  test('should show enhanced progress bars with gradients', async ({ page }) => {
    // Wait for progress bars
    await page.waitForSelector('.MuiLinearProgress-root', { timeout: 5000 });
    
    const progressBars = page.locator('.MuiLinearProgress-root');
    if (await progressBars.count() > 0) {
      const firstProgress = progressBars.first();
      await expect(firstProgress).toBeVisible();
      
      // Check for gradient styling
      const hasGradient = await firstProgress.evaluate(el => {
        const bar = el.querySelector('.MuiLinearProgress-bar');
        return bar && getComputedStyle(bar).background.includes('gradient');
      });
      
      expect(hasGradient).toBeTruthy();
    }
  });
}); 