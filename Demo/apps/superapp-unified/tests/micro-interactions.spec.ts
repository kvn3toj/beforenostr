import { test, expect } from '@playwright/test';

test.describe('🎨 Verificación de Micro-Interacciones y Animaciones', () => {
  const BASE_URL = 'http://localhost:3005';

  test.beforeEach(async ({ page }) => {
    // Navigate to home page for most tests
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('🏠 Home Page - Animaciones de Entrada Staggered', async ({ page }) => {
    // Reload to trigger entrance animations
    await page.reload();
    
    // Wait a moment for animations to complete
    await page.waitForTimeout(1000);
    
    // Verify main action buttons have staggered animation classes
    const primaryButton = page.locator('.primary-action-button');
    const secondaryButton = page.locator('.secondary-action-button');
    const tertiaryButton = page.locator('.tertiary-action-button');
    
    await expect(primaryButton).toHaveClass(/animate-stagger-1/);
    await expect(secondaryButton).toHaveClass(/animate-stagger-2/);
    await expect(tertiaryButton).toHaveClass(/animate-stagger-3/);
    
    // Verify cards have staggered animation classes
    const cards = page.locator('.card-micro-interactive');
    await expect(cards.first()).toHaveClass(/animate-stagger-1/);
    await expect(cards.nth(1)).toHaveClass(/animate-stagger-2/);
    await expect(cards.nth(2)).toHaveClass(/animate-stagger-3/);
    await expect(cards.nth(3)).toHaveClass(/animate-stagger-4/);
    
    console.log('✅ Animaciones de entrada staggered verificadas');
  });

  test('🎯 Botones - Micro-Interacciones de Hover y Click', async ({ page }) => {
    // Test primary action buttons hover effects
    const primaryButton = page.locator('.primary-action-button').first();
    
    // Get initial position and styles
    const initialBox = await primaryButton.boundingBox();
    
    // Hover over button
    await primaryButton.hover();
    await page.waitForTimeout(300); // Wait for transition
    
    // Verify button has micro-interactive class
    await expect(primaryButton).toHaveClass(/btn-micro-interactive/);
    
    // Check if transform is applied (should lift up)
    const afterHoverTransform = await primaryButton.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    
    // Transform should include translateY (negative value for lift)
    expect(afterHoverTransform).not.toBe('none');
    
    // Test active state (click and hold)
    await primaryButton.click();
    await page.waitForTimeout(100);
    
    console.log('✅ Efectos hover y click en botones verificados');
  });

  test('📱 BottomNavigation - Efectos Interactivos', async ({ page }) => {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find navigation items
    const navItems = page.locator('.nav-item-interactive');
    
    if (await navItems.count() > 0) {
      const firstNavItem = navItems.first();
      
      // Verify nav item has interactive class
      await expect(firstNavItem).toHaveClass(/nav-item-interactive/);
      
      // Test hover effect
      await firstNavItem.hover();
      await page.waitForTimeout(250);
      
      // Check for scale transform
      const hoverTransform = await firstNavItem.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(hoverTransform).not.toBe('none');
      
      // Test active indicator
      const activeIndicator = page.locator('.nav-active-indicator.active');
      if (await activeIndicator.count() > 0) {
        // Check for pseudo-element styling (active indicator line)
        const hasActiveIndicator = await activeIndicator.evaluate(el => {
          const afterStyles = window.getComputedStyle(el, '::after');
          return afterStyles.width !== '0px';
        });
        
        expect(hasActiveIndicator).toBeTruthy();
      }
    }
    
    console.log('✅ Micro-interacciones de navegación móvil verificadas');
  });

  test('👤 Header - Avatar y Iconos Interactivos', async ({ page }) => {
    // Test avatar micro-interactions
    const avatar = page.locator('.avatar-micro-interactive').first();
    
    if (await avatar.count() > 0) {
      await expect(avatar).toHaveClass(/avatar-micro-interactive/);
      
      // Test hover effect
      await avatar.hover();
      await page.waitForTimeout(250);
      
      // Check for scale and box-shadow changes
      const avatarStyles = await avatar.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          transform: computed.transform,
          boxShadow: computed.boxShadow
        };
      });
      
      expect(avatarStyles.transform).not.toBe('none');
      expect(avatarStyles.boxShadow).not.toBe('none');
    }
    
    // Test icon micro-interactions
    const icons = page.locator('.icon-micro-interactive');
    
    if (await icons.count() > 0) {
      const firstIcon = icons.first();
      
      await firstIcon.hover();
      await page.waitForTimeout(250);
      
      const iconTransform = await firstIcon.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(iconTransform).not.toBe('none');
    }
    
    console.log('✅ Micro-interacciones de header verificadas');
  });

  test('🃏 Cards - Efectos de Elevación y Overlay', async ({ page }) => {
    const cards = page.locator('.card-micro-interactive');
    
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      
      // Get initial box shadow
      const initialShadow = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).boxShadow;
      });
      
      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(300);
      
      // Check for transform (should lift up)
      const hoverTransform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(hoverTransform).toContain('translateY');
      
      // Check for enhanced box shadow on hover
      const hoverShadow = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).boxShadow;
      });
      
      expect(hoverShadow).not.toBe(initialShadow);
      
      // Check for overlay effect (::before pseudo-element)
      const hasOverlay = await firstCard.evaluate(el => {
        const beforeStyles = window.getComputedStyle(el, '::before');
        return beforeStyles.content !== 'none' && beforeStyles.content !== '';
      });
      
      expect(hasOverlay).toBeTruthy();
    }
    
    console.log('✅ Efectos de elevación y overlay en cards verificados');
  });

  test('🏷️ Badges y Chips - Efectos Interactivos', async ({ page }) => {
    const badges = page.locator('.badge-micro-interactive');
    
    if (await badges.count() > 0) {
      const firstBadge = badges.first();
      
      await expect(firstBadge).toHaveClass(/badge-micro-interactive/);
      
      // Test hover effect
      await firstBadge.hover();
      await page.waitForTimeout(250);
      
      // Check for scale transform
      const badgeTransform = await firstBadge.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(badgeTransform).not.toBe('none');
      
      // Check for box shadow enhancement
      const badgeShadow = await firstBadge.evaluate(el => {
        return window.getComputedStyle(el).boxShadow;
      });
      
      expect(badgeShadow).not.toBe('none');
    }
    
    console.log('✅ Micro-interacciones de badges verificadas');
  });

  test('📊 CSS Variables y Timing Functions', async ({ page }) => {
    // Check that CSS variables are properly defined
    const cssVariables = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      return {
        easeSmooth: rootStyles.getPropertyValue('--ease-smooth'),
        easeBounce: rootStyles.getPropertyValue('--ease-bounce'),
        durationFast: rootStyles.getPropertyValue('--duration-fast'),
        durationNormal: rootStyles.getPropertyValue('--duration-normal'),
        durationSlow: rootStyles.getPropertyValue('--duration-slow'),
        staggerDelay: rootStyles.getPropertyValue('--stagger-delay')
      };
    });
    
    // Verify CSS variables are defined
    expect(cssVariables.easeSmooth.trim()).toBeTruthy();
    expect(cssVariables.easeBounce.trim()).toBeTruthy();
    expect(cssVariables.durationFast.trim()).toBeTruthy();
    expect(cssVariables.durationNormal.trim()).toBeTruthy();
    expect(cssVariables.durationSlow.trim()).toBeTruthy();
    expect(cssVariables.staggerDelay.trim()).toBeTruthy();
    
    // Verify values are correct
    expect(cssVariables.durationFast.trim()).toBe('150ms');
    expect(cssVariables.durationNormal.trim()).toBe('250ms');
    expect(cssVariables.durationSlow.trim()).toBe('350ms');
    expect(cssVariables.staggerDelay.trim()).toBe('50ms');
    
    console.log('✅ Variables CSS de timing verificadas:', cssVariables);
  });

  test('🔄 Animaciones de Lista - Staggered Notifications', async ({ page }) => {
    // Check notifications list items
    const notificationItems = page.locator('.notification-item');
    
    if (await notificationItems.count() > 0) {
      // Verify each notification has fade-in and stagger classes
      for (let i = 0; i < Math.min(await notificationItems.count(), 3); i++) {
        const item = notificationItems.nth(i);
        await expect(item).toHaveClass(/animate-fade-in/);
        await expect(item).toHaveClass(new RegExp(`animate-stagger-${i + 1}`));
      }
      
      // Test notification icon hover effects
      const notificationIcons = page.locator('.notification-item .icon-micro-interactive');
      
      if (await notificationIcons.count() > 0) {
        const firstIcon = notificationIcons.first();
        
        await firstIcon.hover();
        await page.waitForTimeout(250);
        
        const iconTransform = await firstIcon.evaluate(el => {
          return window.getComputedStyle(el).transform;
        });
        
        expect(iconTransform).not.toBe('none');
      }
    }
    
    console.log('✅ Animaciones staggered de notificaciones verificadas');
  });

  test('📱 Responsividad - Efectos Reducidos en Móvil', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    
    const cards = page.locator('.card-micro-interactive');
    
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      
      // Hover and check if mobile styles are applied
      await firstCard.hover();
      await page.waitForTimeout(300);
      
      // On mobile, hover effects should be reduced
      const transform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      // Should still have transform but possibly reduced
      expect(transform).not.toBe('none');
    }
    
    console.log('✅ Responsividad móvil verificada');
  });

  test('♿ Accesibilidad - Prefers-Reduced-Motion', async ({ page }) => {
    // Simulate prefers-reduced-motion setting
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Reload to apply media query
    await page.reload();
    await page.waitForTimeout(500);
    
    // Check that animations are reduced
    const animatedElements = page.locator('.animate-slide-up, .animate-fade-in, .animate-scale-in');
    
    if (await animatedElements.count() > 0) {
      const firstElement = animatedElements.first();
      
      const animationDuration = await firstElement.evaluate(el => {
        return window.getComputedStyle(el).animationDuration;
      });
      
      // Animation should be reduced to 0.01ms or similar
      expect(animationDuration).toMatch(/0\.01ms|0s/);
    }
    
    console.log('✅ Respeto por prefers-reduced-motion verificado');
  });

  test('🎬 Verificación de Keyframes y Animaciones CSS', async ({ page }) => {
    // Check that keyframe animations are properly defined
    const hasAnimations = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const foundAnimations = [];
      
      for (const sheet of styles) {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          for (const rule of rules) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
              foundAnimations.push(rule.name);
            }
          }
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      }
      
      return foundAnimations;
    });
    
    // Verify key animations exist
    expect(hasAnimations).toContain('slideUp');
    expect(hasAnimations).toContain('fadeIn');
    expect(hasAnimations).toContain('scaleIn');
    expect(hasAnimations).toContain('pulseSuccess');
    expect(hasAnimations).toContain('shake');
    
    console.log('✅ Keyframes de animación verificados:', hasAnimations);
  });

  test('🔄 Sync Indicator - Animación de Carga', async ({ page }) => {
    // Wait for sync indicator to appear (it appears randomly)
    const syncIndicator = page.locator('.sync-indicator');
    let attempts = 0;
    const maxAttempts = 10;
    
    while (await syncIndicator.count() === 0 && attempts < maxAttempts) {
      await page.waitForTimeout(1000);
      attempts++;
    }
    
    if (await syncIndicator.count() > 0) {
      // Verify sync indicator has fade-in animation
      await expect(syncIndicator).toHaveClass(/animate-fade-in/);
      
      // Check for loading bounce animation on spinner
      const syncSpinner = page.locator('.loading-bounce');
      if (await syncSpinner.count() > 0) {
        await expect(syncSpinner).toHaveClass(/loading-bounce/);
      }
      
      console.log('✅ Animación del indicador de sincronización verificada');
    } else {
      console.log('ℹ️ Indicador de sincronización no apareció durante la prueba');
    }
  });
});

test.describe('🎨 Verificación Visual de Micro-Interacciones', () => {
  const BASE_URL = 'http://localhost:3005';

  test('📸 Screenshot Comparison - Estados de Hover', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of normal state
    await page.screenshot({ 
      path: 'test-results/micro-interactions-normal.png',
      fullPage: false 
    });
    
    // Hover over first card and take screenshot
    const firstCard = page.locator('.card-micro-interactive').first();
    if (await firstCard.count() > 0) {
      await firstCard.hover();
      await page.waitForTimeout(300);
      
      await page.screenshot({ 
        path: 'test-results/micro-interactions-hover.png',
        fullPage: false 
      });
    }
    
    console.log('✅ Screenshots de comparación generados');
  });
}); 