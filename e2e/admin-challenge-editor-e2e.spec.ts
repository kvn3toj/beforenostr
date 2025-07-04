import { test, expect } from '@playwright/test';

test.describe('🎮 Admin Challenge Editor - Real Implementation', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');

    // Realizar login exitoso con admin credentials
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Esperar redirección exitosa
    await page.waitForURL('**/', { timeout: 15000 });
    await expect(page).toHaveURL('/');

    // Verificar autenticación exitosa
    const authData = await page.evaluate(() => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');
      return { token, userData };
    });

    expect(authData.token).toBeTruthy();
    expect(authData.userData).toBeTruthy();

    console.log('✅ Autenticación exitosa confirmada');
  });

  test('should successfully open and interact with Challenge Editor', async ({ page }) => {
    // ✅ PASO 1: Navegar a la Consola de Experiencias
    console.log('🎮 Navegando a la Consola de Experiencias...');
    await page.goto('/console');
    await page.waitForURL('**/console', { timeout: 15000 });
    await expect(page).toHaveURL('/console');

    // ✅ PASO 2: Verificar que la Consola cargó correctamente
    await expect(page.locator('h1')).toContainText('🎮 Consola de Experiencias');
    await expect(page.locator('h2')).toContainText('Cerebro Operativo de CoomÜnity');
    console.log('✅ Consola de Experiencias cargada correctamente');

    // ⏳ Esperar a que todos los componentes carguen
    await page.waitForTimeout(3000);

    // ✅ PASO 3: Verificar métricas del dashboard
    const metricsCards = page.locator('.MuiCard-root');
    await expect(metricsCards).toHaveCount(5); // Basado en los hallazgos
    console.log('✅ 5 cards de métricas verificadas');

    // ✅ PASO 4: Verificar desafíos activos
    const activeChallenge = page.locator('text=Desafío de Reciprocidad');
    await expect(activeChallenge).toBeVisible();
    console.log('✅ Desafío activo "Desafío de Reciprocidad" visible');

    // ✅ PASO 5: Abrir Challenge Editor
    console.log('🎯 Abriendo Challenge Editor...');
    const createButton = page.locator('button:has-text("Crear Desafío")');
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();

    // ✅ PASO 6: Verificar que se abre el modal/dialog del Challenge Editor
    console.log('🔍 Verificando apertura del Challenge Editor...');

    // Buscar diferentes tipos de modales/dialogs
    const modal = page.locator('[role="dialog"], .MuiDialog-root, .modal, [data-testid*="dialog"], [data-testid*="modal"]');
    await expect(modal).toBeVisible({ timeout: 15000 });
    console.log('✅ Modal del Challenge Editor abierto');

    // ✅ PASO 7: Verificar elementos del formulario en el Challenge Editor
    console.log('📝 Verificando elementos del formulario...');

    // Esperar un poco para que el formulario cargue completamente
    await page.waitForTimeout(2000);

    // Buscar campos de formulario típicos para challenges
    const formFields = page.locator('input, textarea, select, [role="textbox"], [role="combobox"]');
    const fieldCount = await formFields.count();
    console.log(`📝 Encontrados ${fieldCount} campos de formulario`);
    expect(fieldCount).toBeGreaterThan(0);

    // Buscar específicamente campos típicos de un challenge
    const titleField = page.locator('input[name="title"], input[name="name"], input[placeholder*="título"], input[placeholder*="nombre"]').first();
    const descriptionField = page.locator('textarea[name="description"], textarea[placeholder*="descripción"]').first();

    if (await titleField.count() > 0) {
      console.log('✅ Campo de título encontrado');
      await titleField.fill('Test Challenge E2E');
    }

    if (await descriptionField.count() > 0) {
      console.log('✅ Campo de descripción encontrado');
      await descriptionField.fill('Challenge creado por test E2E automatizado');
    }

    // ✅ PASO 8: Buscar botones de acción en el modal
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button:has-text("Save"), button[type="submit"]').first();
    const cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Cerrar"), button:has-text("Cancel"), button:has-text("Close")').first();

    if (await saveButton.count() > 0) {
      console.log('✅ Botón de guardar encontrado');
      // No hacer clic para evitar crear datos de prueba
    }

    if (await cancelButton.count() > 0) {
      console.log('✅ Botón de cancelar encontrado');
      await expect(cancelButton).toBeVisible();
    }

    // ✅ PASO 9: Tomar screenshot del Challenge Editor para documentación
    await page.screenshot({
      path: `test-results/challenge-editor-opened-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot del Challenge Editor tomado');

    // ✅ PASO 10: Cerrar el modal
    console.log('🔒 Cerrando Challenge Editor...');
    if (await cancelButton.count() > 0) {
      await cancelButton.click();
    } else {
      // Buscar botón de cerrar alternativo
      const closeButton = page.locator('[aria-label="close"], .close-button, [data-testid*="close"]').first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
      } else {
        // Presionar Escape como último recurso
        await page.keyboard.press('Escape');
      }
    }

    // Verificar que el modal se cerró
    await expect(modal).toBeHidden({ timeout: 10000 });
    console.log('✅ Challenge Editor cerrado exitosamente');

    // ✅ PASO 11: Verificar que regresamos a la consola
    await expect(page.locator('h1')).toContainText('🎮 Consola de Experiencias');
    console.log('✅ Regreso exitoso a la Consola de Experiencias');
  });

  test('should verify console navigation and features availability', async ({ page }) => {
    // Test para verificar todas las características disponibles en la consola

    console.log('🔍 Verificando características disponibles en la consola...');

    // Navegar a consola
    await page.goto('/console');
    await page.waitForURL('**/console', { timeout: 15000 });

    // Verificar elementos principales
    await expect(page.locator('h1')).toContainText('🎮 Consola de Experiencias');

    // Verificar botones principales
    const buttons = ['Crear Desafío', 'Actualizar', 'Configuración'];
    for (const buttonText of buttons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
      console.log(`✅ Botón "${buttonText}" disponible`);
    }

    // Verificar métricas visibles
    const metricsTexts = ['Desafíos Activos', 'Total Participantes', 'IER (Reciprocidad)', 'Engagement'];
    for (const metricText of metricsTexts) {
      const metric = page.locator(`*:has-text("${metricText}")`);
      await expect(metric).toBeVisible();
      console.log(`✅ Métrica "${metricText}" visible`);
    }

    // Verificar sección de desafíos activos
    await expect(page.locator('text=Desafíos Activos (1)')).toBeVisible();
    await expect(page.locator('text=Desafío de Reciprocidad')).toBeVisible();
    console.log('✅ Sección de desafíos activos verificada');

    // Tomar screenshot final
    await page.screenshot({
      path: `test-results/console-features-verification-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot de verificación de características tomado');
  });
});
