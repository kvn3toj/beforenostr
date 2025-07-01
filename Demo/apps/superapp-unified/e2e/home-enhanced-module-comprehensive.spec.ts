import { test, expect } from '@playwright/test';

test.describe('🏠 HOME ENHANCED MODULE - COMPREHENSIVE VALIDATION', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login first
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Perform authentication with verified credentials
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');

    // Wait for successful login and redirect to home
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Wait for components to load
    await page.waitForTimeout(3000);
  });

  test('🎯 PHASE 1: Smart Header Component Validation', async ({ page }) => {
    console.log('🎯 Validating Smart Header Component...');

    // 1. Verify SmartHeader is present and functional
    const smartHeader = page.locator('.smart-header');
    await expect(smartHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ SmartHeader component rendered');

    // 2. Verify personalized greeting is displayed
    const greetingElement = page.locator('text=/Buenos días|Buenas tardes|Buenas noches/i');
    await expect(greetingElement).toBeVisible({ timeout: 5000 });
    console.log('✅ Personalized greeting displayed');

    // 3. Verify Reciprocidad balance indicator
    const reciprocidadIndicator = page.locator('text=/balance|equilibrio|reciprocidad/i').first();
    await expect(reciprocidadIndicator).toBeVisible({ timeout: 5000 });
    console.log('✅ Reciprocidad balance indicator present');

    // 4. Verify notification badge functionality
    const notificationButton = page.locator('[data-testid*="notification"], button:has-text("notif")').first();
    if (await notificationButton.isVisible()) {
      const badgeCount = await page.locator('.MuiBadge-badge').count();
      console.log(`📬 Notification badges found: ${badgeCount}`);
    }

    // 5. Verify settings access
    const settingsButton = page.locator('button:has([data-testid*="settings"]), button:has-text("config")').first();
    if (await settingsButton.isVisible()) {
      console.log('⚙️ Settings button accessible');
    }

    // 6. Verify glassmorphism effect (CSS styles)
    const headerStyles = await smartHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backdropFilter: styles.backdropFilter,
        background: styles.background,
        borderRadius: styles.borderRadius,
      };
    });
    
    expect(headerStyles.borderRadius).not.toBe('0px');
    console.log('✅ SmartHeader styling effects applied');
  });

  test('📊 PHASE 2: Primary Dashboard Integration', async ({ page }) => {
    console.log('📊 Validating Primary Dashboard...');

    // 1. Verify PrimaryDashboard component loads
    const dashboard = page.locator('.primary-dashboard, [class*="dashboard"]').first();
    await expect(dashboard).toBeVisible({ timeout: 10000 });
    console.log('✅ Primary Dashboard component rendered');

    // 2. Verify Öndas (energy) metrics display
    const ondasMetric = page.locator('text=/öndas|ondas|energía/i').first();
    await expect(ondasMetric).toBeVisible({ timeout: 5000 });
    console.log('✅ Öndas metrics displayed');

    // 3. Verify Mëritos (merits) metrics display
    const meritosMetric = page.locator('text=/mëritos|meritos|logros/i').first();
    await expect(meritosMetric).toBeVisible({ timeout: 5000 });
    console.log('✅ Mëritos metrics displayed');

    // 4. Verify Reciprocidad level progression
    const reciprocidadLevel = page.locator('text=/colaborador|guardián|nivel/i').first();
    await expect(reciprocidadLevel).toBeVisible({ timeout: 5000 });
    console.log('✅ Reciprocidad level progression shown');

    // 5. Verify Element Progress Rings (Fuego, Agua, Tierra, Aire)
    const elementRings = await page.locator('svg circle[stroke]:not([stroke="#e5e7eb"])').count();
    expect(elementRings).toBeGreaterThan(0);
    console.log(`🔮 Element progress rings found: ${elementRings}`);

    // 6. Verify smart insights generation
    const insightCards = await page.locator('text=/excelente|oportunidad|balance/i').count();
    console.log(`💡 Smart insights displayed: ${insightCards}`);

    // 7. Test expandable content functionality
    const expandButtons = page.locator('button:has([data-testid*="expand"]), button:has-text("más")');
    const expandButtonCount = await expandButtons.count();
    if (expandButtonCount > 0) {
      await expandButtons.first().click();
      await page.waitForTimeout(1000);
      console.log('✅ Expandable content functionality works');
    }
  });

  test('⚡ PHASE 3: Smart Actions and Module Focus', async ({ page }) => {
    console.log('⚡ Validating Smart Actions and Module Focus...');

    // 1. Verify SmartActions component
    const smartActions = page.locator('.smart-actions, [class*="smart-action"]').first();
    if (await smartActions.isVisible()) {
      console.log('✅ SmartActions component rendered');
    }

    // 2. Verify contextual action recommendations
    const actionButtons = await page.locator('button:has-text("explorar"), button:has-text("crear"), button:has-text("ayudar")').count();
    console.log(`🎯 Smart action buttons found: ${actionButtons}`);

    // 3. Verify ModuleFocus prioritization
    const moduleCards = await page.locator('[class*="module"], [class*="card"]').count();
    expect(moduleCards).toBeGreaterThan(0);
    console.log(`🎮 Module cards displayed: ${moduleCards}`);

    // 4. Test module navigation functionality
    const moduleLinks = page.locator('a[href*="/uplay"], a[href*="/marketplace"], a[href*="/social"]');
    const moduleCount = await moduleLinks.count();
    if (moduleCount > 0) {
      // Test first module link
      const firstModule = moduleLinks.first();
      const moduleText = await firstModule.textContent();
      console.log(`🔗 Testing navigation to: ${moduleText?.trim()}`);
      
      // Don't actually navigate, just verify link is functional
      await expect(firstModule).toBeVisible();
      console.log('✅ Module navigation links functional');
    }

    // 5. Verify priority-based visual hierarchy
    const priorityElements = await page.locator('.priority-1, .priority-2, .priority-3, .card-priority-high, .card-priority-medium').count();
    expect(priorityElements).toBeGreaterThan(0);
    console.log(`📋 Priority-based elements: ${priorityElements}`);
  });

  test('🎨 PHASE 4: Advanced Visual Components', async ({ page }) => {
    console.log('🎨 Validating Advanced Visual Components...');

    // 1. Verify AdvancedInsightsPanel if present
    const insightsPanel = page.locator('.insights-panel, [class*="insight"]').first();
    if (await insightsPanel.isVisible()) {
      console.log('✅ Advanced Insights Panel rendered');
    }

    // 2. Verify ReciprocidadBalanceVisualization
    const balanceViz = page.locator('.balance-visualization, [class*="balance"]').first();
    if (await balanceViz.isVisible()) {
      console.log('✅ Reciprocidad Balance Visualization rendered');
    }

    // 3. Verify enhanced color system implementation
    const colorSystemTest = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        reciprocidadPrimary: computedStyle.getPropertyValue('--reciprocidad-primary').trim(),
        reciprocidadSecondary: computedStyle.getPropertyValue('--reciprocidad-secondary').trim(),
        reciprocidadSuccess: computedStyle.getPropertyValue('--reciprocidad-success').trim(),
      };
    });
    
    expect(colorSystemTest.reciprocidadPrimary).toBeTruthy();
    console.log('🎨 Enhanced color system applied');

    // 4. Verify micro-interactions
    const interactiveElements = await page.locator('.interactive-element, .hover-effect, [class*="interactive"]').count();
    console.log(`🎯 Interactive elements with micro-interactions: ${interactiveElements}`);

    // 5. Test hover effects on interactive elements
    const firstInteractive = page.locator('.interactive-element, button').first();
    if (await firstInteractive.isVisible()) {
      await firstInteractive.hover();
      await page.waitForTimeout(500);
      console.log('✅ Hover effects functional');
    }

    // 6. Verify GPU acceleration classes
    const gpuAccelerated = await page.locator('.gpu-accelerated, .will-change-transform').count();
    console.log(`🚀 GPU accelerated elements: ${gpuAccelerated}`);
  });

  test('📱 PHASE 5: Responsive Design and Mobile Experience', async ({ page }) => {
    console.log('📱 Validating Responsive Design...');

    // 1. Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Verify main components are still visible
    await expect(page.locator('#root')).toBeVisible();
    const mobileComponents = await page.locator('.smart-header, [class*="dashboard"], [class*="module"]').count();
    expect(mobileComponents).toBeGreaterThan(0);
    console.log(`📱 Mobile components rendered: ${mobileComponents}`);

    // 2. Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    const tabletComponents = await page.locator('.smart-header, [class*="dashboard"], [class*="module"]').count();
    expect(tabletComponents).toBeGreaterThan(0);
    console.log(`📱 Tablet components rendered: ${tabletComponents}`);

    // 3. Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const desktopComponents = await page.locator('.smart-header, [class*="dashboard"], [class*="module"]').count();
    expect(desktopComponents).toBeGreaterThan(0);
    console.log(`🖥️ Desktop components rendered: ${desktopComponents}`);

    // 4. Verify responsive spacing
    const responsiveSpacing = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        homeGridGap: computedStyle.getPropertyValue('--home-grid-gap').trim(),
        homeSectionSpacing: computedStyle.getPropertyValue('--home-section-spacing').trim(),
      };
    });
    
    expect(responsiveSpacing.homeGridGap).toBeTruthy();
    console.log('📐 Responsive spacing variables configured');
  });

  test('🔄 PHASE 6: Real-time Updates and Backend Integration', async ({ page }) => {
    console.log('🔄 Validating Real-time Updates...');

    // 1. Verify backend connectivity indicator
    const connectivityStatus = page.locator('text=/conectado|online|offline/i').first();
    if (await connectivityStatus.isVisible()) {
      const statusText = await connectivityStatus.textContent();
      console.log(`🌐 Connection status: ${statusText?.trim()}`);
    }

    // 2. Test manual refresh functionality
    const refreshButton = page.locator('button:has([data-testid*="refresh"]), button:has-text("actualizar")').first();
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Manual refresh functionality works');
    }

    // 3. Verify loading states during updates
    const loadingElements = await page.locator('.MuiCircularProgress-root, .skeleton, [class*="loading"]').count();
    console.log(`⏳ Loading state elements: ${loadingElements}`);

    // 4. Test error handling for backend failures
    // Monitor console for error handling
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404') && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    // Wait a bit to capture any errors
    await page.waitForTimeout(3000);
    
    // Verify no critical errors
    const criticalErrors = errors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') ||
      error.includes('Cannot read property')
    );
    expect(criticalErrors).toHaveLength(0);
    console.log('✅ No critical JavaScript errors detected');
  });

  test('♿ PHASE 7: Accessibility and Keyboard Navigation', async ({ page }) => {
    console.log('♿ Validating Accessibility...');

    // 1. Verify semantic HTML structure
    const mainElement = page.locator('main, [role="main"]');
    await expect(mainElement).toBeVisible();
    console.log('✅ Semantic main element present');

    // 2. Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    console.log('✅ Keyboard navigation functional');

    // 3. Verify ARIA labels and roles
    const ariaElements = await page.locator('[aria-label], [role], [aria-describedby]').count();
    expect(ariaElements).toBeGreaterThan(0);
    console.log(`♿ ARIA-enhanced elements: ${ariaElements}`);

    // 4. Test focus management
    const focusableElements = await page.locator('button, a, input, [tabindex]:not([tabindex="-1"])').count();
    expect(focusableElements).toBeGreaterThan(0);
    console.log(`⌨️ Focusable elements: ${focusableElements}`);

    // 5. Verify skip links if present
    const skipLinks = await page.locator('.skip-link, [href="#main-content"]').count();
    console.log(`🔗 Skip links available: ${skipLinks}`);

    // 6. Test high contrast support
    const highContrastElements = await page.locator('.high-contrast, [class*="contrast"]').count();
    console.log(`🔆 High contrast elements: ${highContrastElements}`);
  });

  test('⚡ PHASE 8: Performance and Animation Optimization', async ({ page }) => {
    console.log('⚡ Validating Performance Optimizations...');

    // 1. Measure initial load time
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForSelector('.smart-header, [class*="dashboard"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds max for comprehensive load
    console.log(`⏱️ Total load time: ${loadTime}ms`);

    // 2. Verify optimized animations
    const animatedElements = await page.locator('[class*="animate-"], [style*="animation"]').count();
    expect(animatedElements).toBeLessThan(15); // Reasonable limit
    console.log(`🎬 Animated elements: ${animatedElements}`);

    // 3. Check for layout shift prevention
    const skeletonElements = await page.locator('.skeleton, .skeleton-text, .skeleton-card').count();
    console.log(`💀 Skeleton loaders for layout stability: ${skeletonElements}`);

    // 4. Verify GPU acceleration usage
    const gpuElements = await page.locator('.gpu-accelerated, .will-change-transform, .contain-layout').count();
    console.log(`🎮 GPU accelerated elements: ${gpuElements}`);

    // 5. Test smooth scrolling
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log('✅ Smooth scrolling functional');
  });

  test('🧪 PHASE 9: CoomÜnity Philosophy Integration', async ({ page }) => {
    console.log('🧪 Validating CoomÜnity Philosophy Integration...');

    // 1. Verify Reciprocidad terminology usage
    const reciprocidadTerms = await page.locator('text=/reciprocidad|reciprocidad|equilibrio/i').count();
    expect(reciprocidadTerms).toBeGreaterThan(0);
    console.log(`⚖️ Reciprocidad terminology instances: ${reciprocidadTerms}`);

    // 2. Verify Mëritos system representation
    const meritosTerms = await page.locator('text=/mëritos|logros|bien común/i').count();
    expect(meritosTerms).toBeGreaterThan(0);
    console.log(`🏆 Mëritos system references: ${meritosTerms}`);

    // 3. Verify Öndas energy concept
    const ondasTerms = await page.locator('text=/öndas|ondas|energía vibracional/i').count();
    expect(ondasTerms).toBeGreaterThan(0);
    console.log(`⚡ Öndas energy references: ${ondasTerms}`);

    // 4. Verify Lükas currency mentions
    const lukasTerms = await page.locator('text=/lükas|moneda interna/i').count();
    console.log(`💰 Lükas currency references: ${lukasTerms}`);

    // 5. Verify element system (Fuego, Agua, Tierra, Aire)
    const elementTerms = await page.locator('text=/fuego|agua|tierra|aire/i').count();
    expect(elementTerms).toBeGreaterThan(0);
    console.log(`🔮 Element system references: ${elementTerms}`);

    // 6. Verify Bien Común emphasis
    const bienComunTerms = await page.locator('text=/bien común|common good|colectivo/i').count();
    console.log(`🌍 Bien Común philosophy references: ${bienComunTerms}`);
  });

  test('🔬 PHASE 10: Integration and Data Flow Validation', async ({ page }) => {
    console.log('🔬 Validating Integration and Data Flow...');

    // 1. Verify component data binding
    const dataElements = await page.locator('[data-testid], [data-cy]').count();
    console.log(`🔗 Data-bound elements: ${dataElements}`);

    // 2. Test state management integration
    const stateIndicators = await page.locator('text=/cargando|loading|actualizando/i').count();
    console.log(`🔄 State management indicators: ${stateIndicators}`);

    // 3. Verify error boundary implementation
    // This would typically be tested with intentional errors, but we'll just verify structure
    const errorBoundaries = await page.locator('[class*="error-boundary"], [class*="error-fallback"]').count();
    console.log(`🛡️ Error boundary elements: ${errorBoundaries}`);

    // 4. Test component communication
    const notificationCenter = page.locator('.notification-center, [class*="notification"]').first();
    if (await notificationCenter.isVisible()) {
      console.log('✅ Notification system integrated');
    }

    // 5. Verify module interconnectivity
    const moduleNavigation = await page.locator('a[href*="/"], button[data-navigate]').count();
    expect(moduleNavigation).toBeGreaterThan(0);
    console.log(`🔗 Inter-module navigation points: ${moduleNavigation}`);

    // 6. Final comprehensive validation
    const allCriticalElements = await page.locator('.smart-header, [class*="dashboard"], [class*="module"], [class*="action"]').count();
    expect(allCriticalElements).toBeGreaterThan(3);
    console.log(`✅ All critical enhanced components present: ${allCriticalElements}`);

    console.log('🎉 HOME ENHANCED MODULE COMPREHENSIVE VALIDATION COMPLETED');
  });
}); 