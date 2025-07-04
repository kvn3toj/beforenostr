import { test, expect } from '@playwright/test';

/**
 * Test directo para el login usando estrategias más agresivas
 */
test('Login directo con credenciales de administrador', async ({ page }) => {
  // Configurar timeout más largo
  test.setTimeout(30000);

  // Paso 1: Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página de login
  await page.screenshot({ path: './test-results/direct-login-before.png' });

  // Paso 2: Analizar la estructura del DOM para encontrar los campos de login
  console.log('🔍 Analizando estructura del DOM');

  // Obtener HTML del formulario para análisis
  const formHTML = await page.evaluate(() => {
    const form = document.querySelector('form');
    return form ? form.outerHTML : 'No form found';
  });

  console.log('📋 HTML del formulario:');
  console.log(formHTML);

  // Paso 3: Usar JavaScript para llenar el formulario directamente
  console.log('🔐 Llenando formulario con JavaScript directo');

  const loginSuccess = await page.evaluate(() => {
    // Buscar todos los inputs
    const inputs = document.querySelectorAll('input');
    let emailInput = null;
    let passwordInput = null;
    let submitButton = null;

    // Identificar los campos por tipo
    for (const input of inputs) {
      if (input.type === 'email' || input.type === 'text' || input.name === 'email') {
        emailInput = input;
      } else if (input.type === 'password') {
        passwordInput = input;
      }
    }

    // Buscar el botón de submit
    submitButton = document.querySelector('button[type="submit"]');
    if (!submitButton) {
      // Si no encontramos un botón de tipo submit, buscar cualquier botón dentro del formulario
      const form = document.querySelector('form');
      if (form) {
        submitButton = form.querySelector('button');
      }
    }

    // Verificar si encontramos todos los elementos necesarios
    if (!emailInput || !passwordInput || !submitButton) {
      console.error('No se encontraron todos los elementos necesarios');
      return {
        success: false,
        emailFound: !!emailInput,
        passwordFound: !!passwordInput,
        submitFound: !!submitButton
      };
    }

    // Llenar los campos
    emailInput.value = 'admin@gamifier.com';
    passwordInput.value = 'admin123';

    // Disparar eventos para simular la interacción del usuario
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Hacer click en el botón de submit
    submitButton.click();

    return {
      success: true,
      emailFound: true,
      passwordFound: true,
      submitFound: true
    };
  });

  console.log('📋 Resultado del login directo:', loginSuccess);

  // Tomar screenshot después del intento de login
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './test-results/direct-login-after.png' });

  // Paso 4: Si el login directo no funcionó, intentar con una estrategia más agresiva
  if (!loginSuccess.success) {
    console.log('🔄 Intentando estrategia alternativa con selectores más específicos');

    // Obtener todos los inputs visibles
    const visibleInputs = await page.locator('input:visible').all();
    console.log(`📋 Inputs visibles encontrados: ${visibleInputs.length}`);

    if (visibleInputs.length >= 2) {
      // Asumir que el primer input es email y el segundo es password
      await visibleInputs[0].fill('admin@gamifier.com');
      console.log('✏️ Email ingresado: admin@gamifier.com');

      await visibleInputs[1].fill('admin123');
      console.log('✏️ Password ingresado: admin123');

      // Buscar un botón visible
      const visibleButtons = await page.locator('button:visible').all();
      if (visibleButtons.length > 0) {
        await visibleButtons[0].click();
        console.log('👆 Botón clickeado');
      }
    }
  }

  // Paso 5: Verificar si el login fue exitoso
  try {
    await page.waitForURL('http://localhost:3000/**', { timeout: 5000 });

    // Verificar si estamos en la página de login o en el dashboard
    const isStillOnLoginPage = page.url().includes('/login');
    console.log(`🔍 ¿Todavía en página de login? ${isStillOnLoginPage}`);

    if (!isStillOnLoginPage) {
      console.log('✅ Login completado exitosamente');

      // Tomar screenshot del dashboard
      await page.screenshot({ path: './test-results/direct-login-dashboard.png' });

      // Verificar si el menú lateral está presente
      const sidebar = await page.locator('aside, nav').first();
      if (await sidebar.count() > 0) {
        await sidebar.screenshot({ path: './test-results/direct-login-sidebar.png' });
        console.log('✅ Menú lateral capturado');

        // Buscar la sección "Gestión CoomÜnity"
        const sectionText = await page.locator('text="Gestión CoomÜnity"').count() > 0;
        console.log(`🔍 Sección "Gestión CoomÜnity" encontrada: ${sectionText}`);
      }
    } else {
      console.error('❌ Login fallido, todavía en página de login');
    }
  } catch (error) {
    console.error('❌ Error verificando login:', error);
  }
});
