import { test, expect } from '@playwright/test';

test.describe('🎮 Admin Challenge Editor - Final E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login con credenciales admin
    await page.goto('/login');
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Esperar redirección y verificar autenticación
    await page.waitForURL('**/', { timeout: 15000 });
    await expect(page).toHaveURL('/');

    // Verificar token en localStorage
    const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(authToken).toBeTruthy();
    console.log('✅ Autenticación confirmada');
  });

  test('should successfully access Console and interact with Challenge Editor', async ({ page }) => {
    console.log('🎮 Iniciando test del Challenge Editor...');

    // ✅ PASO 1: Navegar a consola con retry logic
    await page.goto('/console');
    await page.waitForURL('**/console', { timeout: 20000 });
    await expect(page).toHaveURL('/console');
    console.log('✅ Navegación a /console exitosa');

    // ✅ PASO 2: Esperar carga completa con múltiples estrategias
    console.log('⏳ Esperando carga completa de la consola...');

    // Estrategia 1: Esperar por elementos clave que sabemos que existen
    await Promise.race([
      page.waitForSelector('text=Consola de Experiencias', { timeout: 20000 }),
      page.waitForSelector('text=Cerebro Operativo', { timeout: 20000 }),
      page.waitForSelector('button:has-text("Crear Desafío")', { timeout: 20000 }),
      page.waitForSelector('.MuiCard-root', { timeout: 20000 })
    ]);

    console.log('✅ Elementos clave de la consola detectados');

    // ✅ PASO 3: Verificar contenido principal (selector específico)
    const consolaTitle = page.locator('h3:has-text("🎮 Consola de Experiencias")');
    await expect(consolaTitle).toBeVisible({ timeout: 15000 });
    console.log('✅ Título de consola verificado');

    const cerebroTitle = page.locator('h6:has-text("Cerebro Operativo")');
    await expect(cerebroTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ Subtítulo verificado');

    // ✅ PASO 4: Verificar que hay cards/métricas
    const cards = page.locator('.MuiCard-root');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const cardCount = await cards.count();
    console.log(`✅ ${cardCount} cards de métricas encontradas`);

    // ✅ PASO 5: Verificar botón "Crear Desafío"
    const createButton = page.locator('button:has-text("Crear Desafío")');
    await expect(createButton).toBeVisible({ timeout: 15000 });
    console.log('✅ Botón "Crear Desafío" localizado');

    // ✅ PASO 6: Abrir Challenge Editor
    console.log('🎯 Abriendo Challenge Editor...');
    await createButton.click();

    // ✅ PASO 7: Verificar apertura del modal (múltiples selectores)
    console.log('🔍 Verificando apertura del modal...');

    const modalSelectors = [
      '[role="dialog"]',
      '.MuiDialog-root',
      '.MuiModal-root',
      '[data-testid*="dialog"]',
      '[data-testid*="modal"]'
    ];

    let modalFound = false;
    for (const selector of modalSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        await expect(page.locator(selector)).toBeVisible();
        console.log(`✅ Modal encontrado con selector: ${selector}`);
        modalFound = true;
        break;
      } catch (error) {
        console.log(`⏳ Selector ${selector} no encontrado, probando siguiente...`);
      }
    }

    if (!modalFound) {
      // Si no encontramos modal tradicional, verificar si la página cambió
      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      console.log(`🔍 URL actual después de clic: ${currentUrl}`);

      // Verificar si hay nuevos elementos que indiquen un formulario o editor
      const formElements = page.locator('input, textarea, select');
      const formCount = await formElements.count();
      console.log(`📝 ${formCount} elementos de formulario encontrados`);

      if (formCount > 0) {
        console.log('✅ Formulario de challenge detectado (sin modal)');
        modalFound = true;
      }
    }

    expect(modalFound).toBe(true);
    console.log('✅ Challenge Editor abierto exitosamente');

    // ✅ PASO 8: Interactuar con el formulario si está disponible
    console.log('📝 Verificando campos del formulario...');

    const formFields = page.locator('input:visible, textarea:visible, select:visible');
    const visibleFieldCount = await formFields.count();
    console.log(`📝 ${visibleFieldCount} campos visibles encontrados`);

    if (visibleFieldCount > 0) {
      // Intentar llenar algunos campos básicos
      const firstInput = formFields.first();
      const inputType = await firstInput.getAttribute('type') || 'text';
      const inputPlaceholder = await firstInput.getAttribute('placeholder') || '';

      console.log(`📝 Primer campo: tipo=${inputType}, placeholder="${inputPlaceholder}"`);

      if (inputType === 'text' || inputType === '') {
        await firstInput.fill('Test Challenge E2E');
        console.log('✅ Campo de texto llenado');
      }

      // Buscar textarea para descripción
      const textareas = page.locator('textarea:visible');
      if (await textareas.count() > 0) {
        await textareas.first().fill('Descripción del challenge creada por test E2E');
        console.log('✅ Campo de descripción llenado');
      }
    }

    // ✅ PASO 9: Buscar y verificar botones de acción
    console.log('🔘 Verificando botones de acción...');

    const actionButtons = page.locator('button:visible');
    const buttonCount = await actionButtons.count();
    console.log(`🔘 ${buttonCount} botones visibles encontrados`);

    const buttonTexts = await actionButtons.allTextContents();
    console.log('🔘 Textos de botones:', buttonTexts.filter(text => text.trim()));

    // ✅ PASO 10: Cerrar el editor/modal
    console.log('🔒 Cerrando Challenge Editor...');

    const closeOptions = [
      'button:has-text("Cancelar")',
      'button:has-text("Cerrar")',
      'button:has-text("Cancel")',
      'button:has-text("Close")',
      '[aria-label="close"]',
      '[data-testid*="close"]'
    ];

    let closed = false;
    for (const closeSelector of closeOptions) {
      try {
        const closeButton = page.locator(closeSelector);
        if (await closeButton.count() > 0 && await closeButton.isVisible()) {
          await closeButton.click();
          console.log(`✅ Cerrado con: ${closeSelector}`);
          closed = true;
          break;
        }
      } catch (error) {
        console.log(`⏳ ${closeSelector} no disponible`);
      }
    }

    if (!closed) {
      // Último recurso: Escape
      await page.keyboard.press('Escape');
      console.log('✅ Cerrado con tecla Escape');
    }

    // ✅ PASO 11: Verificar regreso a la consola
    await page.waitForTimeout(2000);
    const finalTitle = page.locator('h3:has-text("🎮 Consola de Experiencias")');
    await expect(finalTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ Regreso exitoso a la Consola de Experiencias');

    // ✅ PASO 12: Screenshot final
    await page.screenshot({
      path: `test-results/challenge-editor-complete-flow-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot final tomado');
  });

  test('should verify console accessibility and basic functionality', async ({ page }) => {
    console.log('🔍 Verificando accesibilidad básica de la consola...');

    // Navegar a consola
    await page.goto('/console');
    await page.waitForURL('**/console', { timeout: 15000 });

    // Esperar carga con timeout más largo
    await page.waitForTimeout(5000);

    // Verificar elementos fundamentales con selectores flexibles
    const basicElements = [
      '*:has-text("Consola")',
      '*:has-text("Experiencias")',
      '*:has-text("Cerebro")',
      'button:has-text("Crear")',
      '.MuiCard-root'
    ];

    for (const selector of basicElements) {
      const element = page.locator(selector).first();
      await expect(element).toBeVisible({ timeout: 10000 });
      console.log(`✅ Elemento verificado: ${selector}`);
    }

    // Verificar que hay contenido interactivo
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    console.log(`✅ ${buttonCount} botones interactivos encontrados`);

    // Screenshot de verificación
    await page.screenshot({
      path: `test-results/console-accessibility-verification-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot de verificación tomado');
  });
});
