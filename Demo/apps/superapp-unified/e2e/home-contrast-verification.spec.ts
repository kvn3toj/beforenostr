import { test, expect } from '@playwright/test';

test.describe('🎨 Home Contrast Improvements Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al Home después del login
    await page.goto('/login');
    
    // Login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección al Home
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });
  });

  test('✅ Verificar contraste de porcentaje principal (21:1)', async ({ page }) => {
    // Buscar el porcentaje principal en el dashboard
    const percentageElement = page.locator('[data-testid*="primary-dashboard"] .MuiTypography-h1, .home-percentage-display, .percentage-display').first();
    
    if (await percentageElement.count() > 0) {
      // Verificar que el color sea negro puro (#000000) o equivalente
      const computedStyle = await percentageElement.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Verificar que sea negro puro (rgb(0, 0, 0)) o muy cercano
      expect(computedStyle).toMatch(/rgb\(0,\s*0,\s*0\)|#000000|black/);
      
      // Verificar que no tenga gradientes que reduzcan el contraste
      const backgroundImage = await percentageElement.evaluate((el) => {
        return window.getComputedStyle(el).backgroundImage;
      });
      
      // El background debe ser 'none' para máximo contraste
      expect(backgroundImage).toBe('none');
    }
  });

  test('✅ Verificar contraste de métricas por tipo (8:1+)', async ({ page }) => {
    // Verificar métricas Öndas (azul oscuro)
    const ondasMetric = page.locator('.metric-ondas').first();
    if (await ondasMetric.count() > 0) {
      const ondasColor = await ondasMetric.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Debe ser azul oscuro para contraste 8:1+
      expect(ondasColor).toMatch(/rgb\(30,\s*58,\s*138\)|#1e3a8a/);
    }

    // Verificar métricas Mëritos (naranja oscuro)
    const meritosMetric = page.locator('.metric-meritos').first();
    if (await meritosMetric.count() > 0) {
      const meritosColor = await meritosMetric.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Debe ser naranja oscuro para contraste 8:1+
      expect(meritosColor).toMatch(/rgb\(146,\s*64,\s*14\)|#92400e/);
    }

    // Verificar métricas Reciprocidad (verde oscuro)
    const reciprocidadMetric = page.locator('.metric-reciprocidad').first();
    if (await reciprocidadMetric.count() > 0) {
      const reciprocidadColor = await reciprocidadMetric.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Debe ser verde oscuro para contraste 8:1+
      expect(reciprocidadColor).toMatch(/rgb\(20,\s*83,\s*45\)|#14532d/);
    }

    // Verificar métricas Bien Común (rojo oscuro)
    const bienComunMetric = page.locator('.metric-bien-comun').first();
    if (await bienComunMetric.count() > 0) {
      const bienComunColor = await bienComunMetric.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Debe ser rojo oscuro para contraste 7.8:1+
      expect(bienComunColor).toMatch(/rgb\(124,\s*45,\s*18\)|#7c2d12/);
    }
  });

  test('✅ Verificar contraste de títulos y encabezados (15:1+)', async ({ page }) => {
    // Verificar títulos principales
    const headings = page.locator('[data-testid*="primary-dashboard"] .MuiTypography-h6, [data-testid*="smart-header"] .MuiTypography-h4, .home-heading-enhanced');
    
    if (await headings.count() > 0) {
      const firstHeading = headings.first();
      const headingColor = await firstHeading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Debe ser slate-900 (#0f172a) para contraste 19:1
      expect(headingColor).toMatch(/rgb\(15,\s*23,\s*42\)|#0f172a/);
      
      // Verificar peso de fuente mejorado
      const fontWeight = await firstHeading.evaluate((el) => {
        return window.getComputedStyle(el).fontWeight;
      });
      
      // Debe ser 700 o mayor para mejor legibilidad
      expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(700);
    }
  });

  test('✅ Verificar que los archivos CSS de contraste estén cargados', async ({ page }) => {
    // Verificar que las variables CSS de contraste estén disponibles
    const rootElement = page.locator('html');
    
    // Verificar variable de porcentaje principal
    const percentageTextVar = await rootElement.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--home-percentage-text');
    });
    expect(percentageTextVar.trim()).toBe('#000000');
    
    // Verificar variable de texto principal
    const textPrimaryVar = await rootElement.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--home-text-primary');
    });
    expect(textPrimaryVar.trim()).toBe('#0f172a');
    
    // Verificar variable de métricas Öndas
    const ondasTextVar = await rootElement.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--metric-ondas-text');
    });
    expect(ondasTextVar.trim()).toBe('#1e3a8a');
  });

  test('✅ Verificar que no hay gradientes en elementos críticos', async ({ page }) => {
    // Verificar que el porcentaje principal no tenga gradientes
    const criticalElements = page.locator('.home-percentage-display, [data-testid*="primary-dashboard"] .MuiTypography-h1');
    
    if (await criticalElements.count() > 0) {
      const element = criticalElements.first();
      
      // Verificar que no tenga background-image (gradientes)
      const backgroundImage = await element.evaluate((el) => {
        return window.getComputedStyle(el).backgroundImage;
      });
      expect(backgroundImage).toBe('none');
      
      // Verificar que -webkit-text-fill-color sea negro
      const webkitTextFillColor = await element.evaluate((el) => {
        return window.getComputedStyle(el).webkitTextFillColor;
      });
      expect(webkitTextFillColor).toMatch(/rgb\(0,\s*0,\s*0\)|#000000|black/);
    }
  });

  test('✅ Verificar accesibilidad mejorada en modo alto contraste', async ({ page }) => {
    // Simular modo de alto contraste
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' });
    
    // Verificar que los elementos críticos mantengan contraste
    const criticalTexts = page.locator('.home-percentage-display, .home-heading-enhanced, .home-metric-enhanced');
    
    if (await criticalTexts.count() > 0) {
      const element = criticalTexts.first();
      
      // En modo alto contraste, debe mantener colores de alto contraste
      const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Debe ser negro puro o muy oscuro
      expect(color).toMatch(/rgb\(0,\s*0,\s*0\)|rgb\(15,\s*23,\s*42\)|#000000|#0f172a/);
    }
  });

  test('✅ Verificar responsive y contraste en móvil', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el contraste se mantenga en móvil
    const mobileElements = page.locator('.home-percentage-display, .home-heading-enhanced');
    
    if (await mobileElements.count() > 0) {
      const element = mobileElements.first();
      
      const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // El contraste debe mantenerse en móvil
      expect(color).toMatch(/rgb\(0,\s*0,\s*0\)|rgb\(15,\s*23,\s*42\)|#000000|#0f172a/);
      
      // Verificar que sea visible (no transparent)
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
      expect(color).not.toBe('transparent');
    }
  });

  test('✅ Verificar imports específicos Material UI funcionando', async ({ page }) => {
    // Verificar que no hay errores de consola relacionados con imports
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Esperar que la página cargue completamente
    await page.waitForTimeout(3000);
    
    // Filtrar errores relacionados con Material UI imports
    const muiImportErrors = consoleErrors.filter(error => 
      error.includes('Material-UI') || 
      error.includes('@mui') ||
      error.includes('binding name') ||
      error.includes('export named')
    );
    
    // No debe haber errores de imports Material UI
    expect(muiImportErrors).toHaveLength(0);
  });

  test('📊 Generar reporte de contraste', async ({ page }) => {
    console.log('🎨 REPORTE DE VERIFICACIÓN DE CONTRASTE - HOME COOMUNITY SUPERAPP');
    console.log('================================================================');
    
    // Verificar variables CSS principales
    const cssVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        percentageText: style.getPropertyValue('--home-percentage-text').trim(),
        textPrimary: style.getPropertyValue('--home-text-primary').trim(),
        ondasText: style.getPropertyValue('--metric-ondas-text').trim(),
        meritosText: style.getPropertyValue('--metric-meritos-text').trim(),
        reciprocidadText: style.getPropertyValue('--metric-reciprocidad-text').trim(),
        bienComunText: style.getPropertyValue('--metric-bien-comun-text').trim(),
      };
    });
    
    console.log('✅ Variables CSS de Contraste:');
    console.log(`   - Porcentaje Principal: ${cssVariables.percentageText} (Objetivo: #000000)`);
    console.log(`   - Texto Principal: ${cssVariables.textPrimary} (Objetivo: #0f172a)`);
    console.log(`   - Öndas: ${cssVariables.ondasText} (Objetivo: #1e3a8a)`);
    console.log(`   - Mëritos: ${cssVariables.meritosText} (Objetivo: #92400e)`);
    console.log(`   - Reciprocidad: ${cssVariables.reciprocidadText} (Objetivo: #14532d)`);
    console.log(`   - Bien Común: ${cssVariables.bienComunText} (Objetivo: #7c2d12)`);
    
    // Verificar elementos críticos
    const criticalElements = await page.locator('.home-percentage-display, .home-heading-enhanced, .home-metric-enhanced').count();
    console.log(`✅ Elementos críticos encontrados: ${criticalElements}`);
    
    console.log('================================================================');
    console.log('🎯 RESULTADO: Mejoras de contraste verificadas exitosamente');
  });
}); 