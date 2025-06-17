import { test, expect } from '@playwright/test';

test.describe('🚀 Home Page - Phase 3 Enhancements Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección a la página principal
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Esperar a que React se monte completamente
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000); // Tiempo adicional para animaciones
  });

  test('✅ Verificar que no hay errores de undefined ondas', async ({ page }) => {
    // Escuchar errores de consola
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Esperar a que la página se cargue completamente
    await page.waitForTimeout(3000);

    // Verificar que no hay errores relacionados con 'ondas.toLocaleString'
    const ondasErrors = consoleErrors.filter(error => 
      error.includes('ondas') && error.includes('toLocaleString')
    );
    
    expect(ondasErrors).toHaveLength(0);
    console.log('✅ No se encontraron errores de ondas.toLocaleString()');
  });

  test('🎯 Verificar elementos de Phase 3 - Real-time Updates', async ({ page }) => {
    // Verificar que existe el indicador de conexión al backend
    const connectionAlert = page.locator('.MuiAlert-root').first();
    await expect(connectionAlert).toBeVisible();
    
    // Verificar que existe el botón de actualizar
    const updateButton = page.locator('button:has-text("Actualizar"), button:has-text("Reintentar")');
    await expect(updateButton).toBeVisible();
    
    console.log('✅ Indicadores de conexión y actualización presentes');
  });

  test('🔝 Verificar Scroll-to-Top Button', async ({ page }) => {
    // Hacer scroll hacia abajo para activar el botón
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    
    // Esperar un momento para que aparezca el botón
    await page.waitForTimeout(1000);
    
    // Verificar que el botón de scroll-to-top aparece
    const scrollButton = page.locator('[aria-label*="scroll"], .MuiFab-root').last();
    await expect(scrollButton).toBeVisible();
    
    console.log('✅ Botón scroll-to-top funcional');
  });

  test('📱 Verificar Responsive Design', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Verificar que la página se adapta correctamente
    const container = page.locator('.home-container');
    await expect(container).toBeVisible();
    
    // Verificar que los elementos principales están presentes
    const welcomeHeader = page.locator('text=CoomÜnity, text=Bienvenido').first();
    await expect(welcomeHeader).toBeVisible();
    
    console.log('✅ Diseño responsive funcional');
  });

  test('🎨 Verificar Loading States', async ({ page }) => {
    // Recargar la página para ver los estados de carga
    await page.reload();
    
    // Verificar que no hay errores durante la carga
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Esperar a que la página se cargue
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores críticos
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('undefined') || error.includes('Cannot read properties')
    );
    
    expect(criticalErrors).toHaveLength(0);
    console.log('✅ Estados de carga sin errores críticos');
  });

  test('🎯 Verificar Métricas Ayni sin errores', async ({ page }) => {
    // Buscar el componente de métricas Ayni
    const metricsCard = page.locator('[class*="ayni"], [class*="metrics"]').first();
    
    // Si no se encuentra por clase, buscar por contenido
    const ondasElement = page.locator('text=/Öndas|ondas/i').first();
    const meritosElement = page.locator('text=/Mëritos|meritos/i').first();
    
    // Verificar que al menos uno de los elementos está presente
    const hasMetrics = await ondasElement.isVisible() || await meritosElement.isVisible();
    expect(hasMetrics).toBe(true);
    
    console.log('✅ Métricas Ayni se muestran correctamente');
  });

  test('🔄 Verificar funcionalidad de refresh', async ({ page }) => {
    // Buscar y hacer clic en el botón de actualizar
    const refreshButton = page.locator('button:has-text("Actualizar"), button:has-text("Reintentar")').first();
    
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Esperar un momento para la actualización
      await page.waitForTimeout(2000);
      
      // Verificar que la página sigue funcionando
      const container = page.locator('.home-container');
      await expect(container).toBeVisible();
      
      console.log('✅ Funcionalidad de refresh operativa');
    } else {
      console.log('ℹ️ Botón de refresh no visible (posible modo offline)');
    }
  });

  test('🌟 Verificar mensaje inspiracional', async ({ page }) => {
    // Buscar el mensaje inspiracional flotante
    const inspirationalMessage = page.locator('text=/Reflexión del día|En cada acción de Ayni/i');
    
    // Esperar a que aparezca (tiene delay de animación)
    await page.waitForTimeout(3000);
    
    // Verificar que el mensaje está presente
    const isVisible = await inspirationalMessage.isVisible();
    expect(isVisible).toBe(true);
    
    console.log('✅ Mensaje inspiracional presente');
  });

  test('🎯 Verificar navegación y handlers', async ({ page }) => {
    // Verificar que los elementos de navegación están presentes
    const moduleCards = page.locator('[class*="module"], [class*="card"]');
    const moduleCount = await moduleCards.count();
    
    // Debe haber al menos algunos módulos/cards
    expect(moduleCount).toBeGreaterThan(0);
    
    // Verificar que no hay errores al interactuar
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Hacer scroll para activar eventos
    await page.evaluate(() => {
      window.scrollTo(0, 300);
    });
    
    await page.waitForTimeout(1000);
    
    // Verificar que no hay errores de handlers
    const handlerErrors = consoleErrors.filter(error => 
      error.includes('handler') || error.includes('callback')
    );
    
    expect(handlerErrors).toHaveLength(0);
    console.log('✅ Navegación y handlers funcionando correctamente');
  });

  test('📊 Verificar datos normalizados', async ({ page }) => {
    // Verificar que los datos se muestran correctamente formateados
    const numberElements = page.locator('text=/[0-9,]+/');
    const numberCount = await numberElements.count();
    
    // Debe haber números formateados en la página
    expect(numberCount).toBeGreaterThan(0);
    
    // Verificar que no hay "NaN" o "undefined" en la página
    const nanElements = page.locator('text=/NaN|undefined/i');
    const nanCount = await nanElements.count();
    
    expect(nanCount).toBe(0);
    
    console.log('✅ Datos normalizados y formateados correctamente');
  });
});

test.describe('Home Page Phase 3 - Advanced Visual Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for React to mount
    await page.waitForSelector('#root');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
  });

  test('should display Phase 3 visual enhancements', async ({ page }) => {
    // Check for gradient mesh background
    const container = page.locator('.gradient-mesh-bg').first();
    await expect(container).toBeVisible();

    // Check for floating elements
    const floatingElements = page.locator('.floating-element');
    await expect(floatingElements.first()).toBeVisible();

    // Check for glassmorphism cards
    const glassmorphismCards = page.locator('.glassmorphism-card');
    await expect(glassmorphismCards.first()).toBeVisible();
  });

  test('should display Ayni Balance Visualization component', async ({ page }) => {
    // Check if the Ayni Balance Visualization is present
    const ayniVisualization = page.locator('text=Balance Ayni');
    await expect(ayniVisualization).toBeVisible();

    // Check for the circular progress indicator
    const balanceCircle = page.locator('.ayni-balance-circle');
    await expect(balanceCircle).toBeVisible();

    // Check for elemental indicators
    const elementIndicators = page.locator('text=Fuego');
    await expect(elementIndicators.first()).toBeVisible();
  });

  test('should display and interact with Insights floating action button', async ({ page }) => {
    // Check if the insights button is visible
    const insightsButton = page.locator('[data-testid="insights-fab"], button:has(svg[data-testid="PsychologyIcon"])');
    await expect(insightsButton.first()).toBeVisible();

    // Click the insights button
    await insightsButton.first().click();

    // Wait for the insights panel to appear
    await page.waitForTimeout(500);

    // Check if the insights panel is visible
    const insightsPanel = page.locator('text=Insights Inteligentes');
    await expect(insightsPanel).toBeVisible();

    // Check for insights content
    const insightCards = page.locator('.recommendation-card, .insights-panel');
    await expect(insightCards.first()).toBeVisible();
  });

  test('should close insights panel when clicking backdrop', async ({ page }) => {
    // Open insights panel
    const insightsButton = page.locator('[data-testid="insights-fab"], button:has(svg[data-testid="PsychologyIcon"])');
    await insightsButton.first().click();
    await page.waitForTimeout(500);

    // Verify panel is open
    const insightsPanel = page.locator('text=Insights Inteligentes');
    await expect(insightsPanel).toBeVisible();

    // Click on backdrop to close
    const backdrop = page.locator('body').first();
    await backdrop.click({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);

    // Verify panel is closed
    await expect(insightsPanel).not.toBeVisible();
  });

  test('should display advanced animations and effects', async ({ page }) => {
    // Check for animated elements
    const animatedElements = page.locator('.animate-gentle-pulse, .animate-flowing-wave, .animate-energy-flicker');
    await expect(animatedElements.first()).toBeVisible();

    // Check for interactive cards with advanced effects
    const interactiveCards = page.locator('.interactive-card-advanced');
    await expect(interactiveCards.first()).toBeVisible();

    // Check for floating elements with different delays
    const floatingDelayed = page.locator('.floating-element-delayed');
    await expect(floatingDelayed.first()).toBeVisible();

    const floatingSlow = page.locator('.floating-element-slow');
    await expect(floatingSlow.first()).toBeVisible();
  });

  test('should display progress rings and advanced loading states', async ({ page }) => {
    // Check for progress rings
    const progressRings = page.locator('.progress-ring');
    if (await progressRings.count() > 0) {
      await expect(progressRings.first()).toBeVisible();
    }

    // Check for advanced loading states
    const loadingElements = page.locator('.loading-dots-advanced, .skeleton-shimmer-advanced');
    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).toBeVisible();
    }
  });

  test('should verify CoomÜnity terminology in Phase 3 components', async ({ page }) => {
    // Check for Ayni-related terminology
    await expect(page.locator('text=Ayni')).toBeVisible();
    
    // Check for elemental terminology
    const elements = ['Fuego', 'Agua', 'Tierra', 'Aire'];
    for (const element of elements) {
      const elementText = page.locator(`text=${element}`);
      if (await elementText.count() > 0) {
        await expect(elementText.first()).toBeVisible();
      }
    }

    // Check for Mëritos and other CoomÜnity concepts
    const concepts = ['Mëritos', 'Bien Común', 'Lükas', 'Öndas'];
    for (const concept of concepts) {
      const conceptText = page.locator(`text=${concept}`);
      if (await conceptText.count() > 0) {
        await expect(conceptText.first()).toBeVisible();
      }
    }
  });

  test('should handle responsive design for Phase 3 components', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check if components are still visible and properly arranged
    const container = page.locator('.gradient-mesh-bg').first();
    await expect(container).toBeVisible();

    const ayniVisualization = page.locator('text=Balance Ayni');
    await expect(ayniVisualization).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    await expect(container).toBeVisible();
    await expect(ayniVisualization).toBeVisible();

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
  });

  test('should verify accessibility features in Phase 3 components', async ({ page }) => {
    // Check for reduced motion support
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForSelector('#root');

    // Verify components still work with reduced motion
    const container = page.locator('.gradient-mesh-bg').first();
    await expect(container).toBeVisible();

    // Check for proper ARIA labels and accessibility
    const insightsButton = page.locator('[data-testid="insights-fab"], button:has(svg[data-testid="PsychologyIcon"])');
    if (await insightsButton.count() > 0) {
      await expect(insightsButton.first()).toBeVisible();
      
      // Check if button is focusable
      await insightsButton.first().focus();
      await expect(insightsButton.first()).toBeFocused();
    }
  });
}); 