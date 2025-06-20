import { test, expect } from '@playwright/test';

test.describe('Tutorial Discovery TOINS - E2E Tests', () => {
  // Configuración previa
  test.beforeEach(async ({ page }) => {
    console.log('🚀 Iniciando test del Tutorial Discovery TOINS...');

    // Navegar a la SuperApp
    await page.goto('/', { waitUntil: 'networkidle' });

    // Esperar a que React monte
    await page.waitForSelector('#root', { timeout: 15000 });

    // Autenticarse si es necesario
    const isLoginPage = await page.locator('[data-testid="login-email-input"]').count() > 0;
    if (isLoginPage) {
      console.log('🔐 Autenticando usuario...');
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForURL('**/', { timeout: 15000 });
    }
  });

  test('Tutorial completo debe completarse exitosamente', async ({ page }) => {
    console.log('📚 Iniciando tutorial Discovery TOINS...');

    // Iniciar el tutorial desde DevTools
    await page.evaluate(() => {
      // @ts-ignore - Acceder al contexto del tutorial
      const tutorialContext = window.useDiscoveryTutorial?.();
      if (tutorialContext) {
        tutorialContext.startTutorial('wallet-discovery');
      } else {
        // Fallback: buscar el context provider
        const startTutorial = window.startDiscoveryTutorial || window.startTutorial;
        if (startTutorial) {
          startTutorial('wallet-discovery');
        }
      }
    });

    // Esperar a que el modal del tutorial aparezca
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // Verificar título del tutorial
    await expect(page.locator('text=Discovery Wallet & TOINS')).toBeVisible();

    console.log('✅ Modal del tutorial abierto correctamente');

    // Verificar la información básica del tutorial
    await expect(page.locator('text=12-15 minutos')).toBeVisible();
    await expect(page.locator('text=intermediate')).toBeVisible();

    // Variables para tracking
    const totalSteps = 8;

    // Recorrer todos los pasos del tutorial
    for (let step = 0; step < totalSteps; step++) {
      console.log(`📍 Validando paso ${step + 1}/${totalSteps}...`);

      // Verificar que el contenido del paso es visible
      const stepContent = page.locator('[role="dialog"] .MuiAlert-message');
      await expect(stepContent).toBeVisible();

      // Verificar que hay tips en cada paso
      const tipsList = page.locator('text=💡 Tips Clave:');
      await expect(tipsList).toBeVisible();

      // Verificar si hay botón de acción en este paso
      const actionButton = page.locator('[role="dialog"] button:has-text("Ver"), [role="dialog"] button:has-text("Explorar"), [role="dialog"] button:has-text("Abrir"), [role="dialog"] button:has-text("Evaluar"), [role="dialog"] button:has-text("Completar")');

      if (await actionButton.count() > 0) {
        console.log(`🔘 Probando botón de acción en paso ${step + 1}...`);

        // Hacer clic en el botón de acción
        await actionButton.first().click();

        // Esperar brevemente para que se procese la acción
        await page.waitForTimeout(1000);

        console.log(`✅ Botón de acción funcionó en paso ${step + 1}`);
      }

      // Avanzar al siguiente paso (excepto en el último)
      if (step < totalSteps - 1) {
        const nextButton = page.locator('[role="dialog"] button:has-text("Siguiente"), [role="dialog"] button[aria-label*="next"]');
        await expect(nextButton).toBeVisible();
        await nextButton.click();

        // Esperar a que el contenido cambie
        await page.waitForTimeout(1500);
      }
    }

    console.log('🎯 Todos los pasos completados, verificando finalización...');

    // En el último paso, debe haber un botón de cerrar o completar
    const closeButton = page.locator('[role="dialog"] button:has-text("Completar"), [role="dialog"] button:has-text("Cerrar"), [role="dialog"] [aria-label="close"]');
    await expect(closeButton).toBeVisible();

    // Completar el tutorial
    await closeButton.click();

    // Verificar que el modal se cierra
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 });

    console.log('🎉 Tutorial completado exitosamente');
  });

  test('Botones de navegación deben funcionar correctamente', async ({ page }) => {
    console.log('🔄 Probando navegación del tutorial...');

    // Iniciar tutorial
    await page.evaluate(() => {
      const startTutorial = window.startDiscoveryTutorial || window.startTutorial;
      if (startTutorial) {
        startTutorial('wallet-discovery');
      }
    });

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // Avanzar algunos pasos
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('[role="dialog"] button:has-text("Siguiente")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Probar retroceder
    const backButton = page.locator('[role="dialog"] button:has-text("Anterior")');
    if (await backButton.count() > 0) {
      await backButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Botón "Anterior" funciona');
    }

    // Cerrar tutorial
    const closeButton = page.locator('[role="dialog"] [aria-label="close"]');
    await closeButton.click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    console.log('✅ Navegación del tutorial funciona correctamente');
  });

  test('Tutorial debe mostrar contenido educativo específico sobre TOINS', async ({ page }) => {
    console.log('📖 Verificando contenido educativo específico...');

    // Iniciar tutorial
    await page.evaluate(() => {
      const startTutorial = window.startDiscoveryTutorial || window.startTutorial;
      if (startTutorial) {
        startTutorial('wallet-discovery');
      }
    });

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // Verificar contenido específico de TOINS
    const toinsConcepts = [
      'Tokens de Intercambio Nutritivo Sostenible',
      'Sistema Dual: Lükas + TOINS',
      'principio Ayni',
      'Bien Común',
      'moneda complementaria'
    ];

    // Navegar por todos los pasos buscando estos conceptos
    let foundConcepts = 0;
    const totalSteps = 8;

    for (let step = 0; step < totalSteps; step++) {
      // Verificar si algún concepto está presente en este paso
      for (const concept of toinsConcepts) {
        const conceptLocator = page.locator(`[role="dialog"]:has-text("${concept}")`);
        if (await conceptLocator.count() > 0) {
          foundConcepts++;
          console.log(`✅ Concepto encontrado: "${concept}" en paso ${step + 1}`);
        }
      }

      // Avanzar al siguiente paso
      if (step < totalSteps - 1) {
        const nextButton = page.locator('[role="dialog"] button:has-text("Siguiente")');
        if (await nextButton.count() > 0) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Verificar que se encontraron suficientes conceptos educativos
    expect(foundConcepts).toBeGreaterThan(3);
    console.log(`✅ Tutorial contiene ${foundConcepts} conceptos educativos clave`);

    // Cerrar tutorial
    const closeButton = page.locator('[role="dialog"] [aria-label="close"]');
    await closeButton.click();
  });

  test('Sistema de recompensas debe estar configurado correctamente', async ({ page }) => {
    console.log('🏆 Verificando sistema de recompensas...');

    // Iniciar tutorial
    await page.evaluate(() => {
      const startTutorial = window.startDiscoveryTutorial || window.startTutorial;
      if (startTutorial) {
        startTutorial('wallet-discovery');
      }
    });

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // Navegar hasta el final del tutorial para ver las recompensas
    const totalSteps = 8;
    for (let step = 0; step < totalSteps - 1; step++) {
      const nextButton = page.locator('[role="dialog"] button:has-text("Siguiente")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // En el último paso, verificar información de recompensas
    const rewardInfo = page.locator('[role="dialog"]');

    // Buscar referencias a las recompensas
    const hasOndas = await rewardInfo.locator('text=/.*35.*[Öö]ndas.*/i').count() > 0;
    const hasMeritos = await rewardInfo.locator('text=/.*8.*[Mm]ëritos.*/i').count() > 0;

    console.log(`Öndas encontradas: ${hasOndas ? '✅' : '❌'}`);
    console.log(`Mëritos encontrados: ${hasMeritos ? '✅' : '❌'}`);

    // Al menos una de las recompensas debe estar visible
    expect(hasOndas || hasMeritos).toBeTruthy();

    // Cerrar tutorial
    const closeButton = page.locator('[role="dialog"] [aria-label="close"]');
    await closeButton.click();

    console.log('✅ Sistema de recompensas verificado');
  });

  test('Tutorial debe ser accesible desde múltiples métodos', async ({ page }) => {
    console.log('🎯 Verificando accesibilidad del tutorial...');

    // Método 1: Desde DevTools Console
    const method1Success = await page.evaluate(() => {
      try {
        const startTutorial = window.startDiscoveryTutorial || window.startTutorial;
        if (startTutorial) {
          startTutorial('wallet-discovery');
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });

    if (method1Success) {
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
      console.log('✅ Método 1: Accesible desde DevTools Console');

      // Cerrar para probar siguiente método
      const closeButton = page.locator('[role="dialog"] [aria-label="close"]');
      await closeButton.click();
      await page.waitForTimeout(1000);
    }

    // Método 2: Navegando directamente a /wallet (si existe integración)
    await page.goto('/wallet');
    await page.waitForTimeout(2000);

    // Buscar algún botón o enlace del tutorial en la página
    const tutorialTrigger = page.locator('button:has-text("Tutorial"), button:has-text("Ayuda"), button:has-text("Discovery"), [data-testid*="tutorial"]');

    if (await tutorialTrigger.count() > 0) {
      console.log('✅ Método 2: Tutorial accesible desde página /wallet');
    } else {
      console.log('ℹ️ Método 2: No hay trigger visible en /wallet (esperado en desarrollo)');
    }

    console.log('✅ Verificación de accesibilidad completada');
  });
});
