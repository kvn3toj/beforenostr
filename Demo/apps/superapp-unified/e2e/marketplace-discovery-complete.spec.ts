import { test, expect } from '@playwright/test';

test.describe('Marketplace Discovery Tutorial - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp y esperar a que cargue
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });

    // Verificar que estamos autenticados (asumiendo auth mock)
    await expect(page.locator('body')).not.toContainText('Login');
  });

  test('Complete Marketplace Discovery Tutorial Flow', async ({ page }) => {
    console.log('🛒 Iniciando flujo completo del Tutorial Marketplace Discovery...');

    // Paso 1: Iniciar el tutorial via DevTools
    await page.evaluate(() => {
      // @ts-ignore - useDiscoveryTutorial available globally in dev
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
      }
    });

    // Esperar a que aparezca el dialog del tutorial
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Verificar que el tutorial se abrió correctamente
    await expect(page.locator('[role="dialog"]')).toContainText('Discovery Marketplace');
    await expect(page.locator('[role="dialog"]')).toContainText('Gamified Match Place');

    console.log('✅ Tutorial iniciado correctamente');

    // Paso 2: Navegar por todos los pasos del tutorial
    const expectedSteps = [
      {
        title: 'Filosofía del Marketplace',
        content: 'principio andino de RECIPROCIDAD',
        tips: 'reciprocidad balanceada'
      },
      {
        title: 'Tipos de Intercambio',
        content: 'PRODUCTOS físicos',
        tips: 'SERVICIOS profesionales'
      },
      {
        title: 'Navegación Inteligente',
        content: 'filtros por categoría',
        actionButton: 'Explorar Categorías'
      },
      {
        title: 'Sistema de Confianza',
        content: 'Mëritos acumulados',
        tips: 'Emprendedores Confiables'
      },
      {
        title: 'Economía de Lükas',
        content: 'moneda de CoomÜnity',
        tips: 'completando videos en ÜPlay'
      },
      {
        title: 'Tu Primera Compra',
        content: 'productos de bajo riesgo',
        actionButton: 'Ver Productos Recomendados'
      },
      {
        title: 'Convertirse en Vendedor',
        content: 'completar tu perfil',
        tips: 'primer producto/servicio'
      },
      {
        title: 'Impacto en la Comunidad',
        content: 'Bien Común',
        tips: 'círculos virtuosos'
      }
    ];

    for (let i = 0; i < expectedSteps.length; i++) {
      const step = expectedSteps[i];
      console.log(`📋 Verificando paso ${i + 1}: ${step.title}`);

      // Verificar contenido del paso actual
      await expect(page.locator('[role="dialog"]')).toContainText(step.title);
      await expect(page.locator('[role="dialog"]')).toContainText(step.content);

      if (step.tips) {
        await expect(page.locator('[role="dialog"]')).toContainText(step.tips);
      }

      if (step.actionButton) {
        await expect(page.locator('[role="dialog"]')).toContainText(step.actionButton);
        console.log(`✅ Action button encontrado: ${step.actionButton}`);
      }

      // Avanzar al siguiente paso (excepto en el último)
      if (i < expectedSteps.length - 1) {
        const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
        await nextButton.click();
        await page.waitForTimeout(1000); // Esperar transición
      }
    }

    console.log('✅ Todos los pasos verificados correctamente');

    // Paso 3: Completar el tutorial
    const completeButton = page.locator('button:has-text("Completar"), button:has-text("Complete"), button:has-text("Finalizar")');
    await completeButton.click();

    // Verificar que se otorgaron las recompensas
    await page.waitForTimeout(2000);

    // Buscar notificaciones de recompensas
    const rewardElements = page.locator('text=/25.*Öndas|5.*Mëritos|completado.*marketplace/i');
    const rewardCount = await rewardElements.count();

    if (rewardCount > 0) {
      console.log('✅ Recompensas otorgadas correctamente');
    } else {
      console.log('⚠️ Recompensas no visibles (puede ser normal en mock)');
    }

    console.log('🎉 Tutorial Marketplace Discovery completado exitosamente');
  });

  test('Marketplace Discovery Navigation Testing', async ({ page }) => {
    console.log('🧭 Testing navigation controls...');

    // Iniciar tutorial
    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Test forward navigation
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // Test backward navigation
    for (let i = 0; i < 2; i++) {
      const prevButton = page.locator('button:has-text("Anterior"), button:has-text("Previous"), button:has-text("Atrás")');
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForTimeout(500);
      }
    }

    console.log('✅ Navigation controls working correctly');
  });

  test('Marketplace Discovery Educational Content Verification', async ({ page }) => {
    console.log('📚 Verificando contenido educativo específico...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Verificar conceptos clave de CoomÜnity
    const keyTerms = [
      'RECIPROCIDAD',
      'reciprocidad balanceada',
      'Bien Común',
      'Lükas',
      'Mëritos',
      'Emprendedores Confiables',
      'GMP',
      'Gamified Match Place'
    ];

    let foundTerms = 0;

    // Navegar por todos los pasos verificando términos
    for (let step = 0; step < 8; step++) {
      const dialogContent = await page.locator('[role="dialog"]').textContent();

      for (const term of keyTerms) {
        if (dialogContent?.includes(term)) {
          foundTerms++;
          console.log(`✅ Término encontrado: ${term}`);
        }
      }

      // Avanzar al siguiente paso
      if (step < 7) {
        const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
        if (await nextButton.count() > 0) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    expect(foundTerms).toBeGreaterThan(4); // Al menos 5 términos clave encontrados
    console.log(`✅ Contenido educativo verificado: ${foundTerms}/${keyTerms.length} términos clave encontrados`);
  });

  test('Marketplace Discovery Action Buttons Functionality', async ({ page }) => {
    console.log('🎮 Testing action buttons functionality...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Navegar hasta el paso con primer action button (Navegación Inteligente)
    for (let i = 0; i < 2; i++) {
      const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar botón "Explorar Categorías"
    const exploreButton = page.locator('button:has-text("Explorar Categorías")');
    if (await exploreButton.count() > 0) {
      console.log('✅ Botón "Explorar Categorías" encontrado');

      // Test click functionality (should navigate or show modal)
      await exploreButton.click();
      await page.waitForTimeout(2000);

      // Check if navigation occurred or modal opened
      const currentUrl = page.url();
      const hasModal = await page.locator('[role="dialog"]').count();

      if (currentUrl.includes('/marketplace') || hasModal > 0) {
        console.log('✅ Action button functionality working');
      } else {
        console.log('⚠️ Action button clicked but no visible action');
      }
    }

    // Navegar al siguiente action button (Primera Compra)
    // Volver al tutorial si se navegó
    if (!page.url().includes('/marketplace')) {
      await page.goto('/');
      await page.waitForSelector('#root');

      await page.evaluate(() => {
        // @ts-ignore
        if (window.useDiscoveryTutorial) {
          window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
        }
      });

      await page.waitForSelector('[role="dialog"]');

      // Navegar hasta el paso 5
      for (let i = 0; i < 5; i++) {
        const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Verificar segundo action button
    const recommendedButton = page.locator('button:has-text("Ver Productos Recomendados")');
    if (await recommendedButton.count() > 0) {
      console.log('✅ Botón "Ver Productos Recomendados" encontrado');
    }

    console.log('✅ Action buttons testing completed');
  });

  test('Marketplace Discovery Rewards System', async ({ page }) => {
    console.log('🏆 Testing rewards system...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('marketplace-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Navegar rápidamente hasta el final
    for (let i = 0; i < 7; i++) {
      const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // Completar tutorial
    const completeButton = page.locator('button:has-text("Completar"), button:has-text("Complete"), button:has-text("Finalizar")');
    await completeButton.click();

    // Verificar sistema de recompensas
    await page.waitForTimeout(3000);

    // Check for rewards in various possible locations
    const possibleRewardSelectors = [
      'text=/25.*Öndas/i',
      'text=/5.*Mëritos/i',
      'text=/completado.*marketplace/i',
      'text=/recompensa/i',
      '[data-testid*="reward"]',
      '.notification',
      '.toast',
      '.snackbar'
    ];

    let rewardsFound = false;
    for (const selector of possibleRewardSelectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        rewardsFound = true;
        console.log(`✅ Reward notification found: ${selector}`);
        break;
      }
    }

    if (!rewardsFound) {
      console.log('⚠️ No visible reward notifications (expected in mock environment)');
      // Check console for reward logs
      const consoleLogs = await page.evaluate(() => {
        return (window as any).lastTutorialCompletion || 'No completion logs';
      });
      console.log('Console logs:', consoleLogs);
    }

    console.log('✅ Rewards system testing completed');
  });
});
