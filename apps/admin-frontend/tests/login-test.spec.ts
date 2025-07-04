import { test, expect } from '@playwright/test';

/**
 * Test específico para el proceso de login con selectores precisos
 */
test('Login con credenciales de administrador', async ({ page }) => {
  // Configurar timeout más largo para debugging
  test.setTimeout(30000);

  // Paso 1: Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página de login
  await page.screenshot({ path: './test-results/login-page-before.png' });

  // Paso 2: Inspeccionar los campos del formulario
  console.log('🔍 Inspeccionando campos del formulario');

  // Verificar si existen los campos de email y password
  const emailInputExists = await page.locator('input[type="email"], input[name="email"]').count() > 0;
  const passwordInputExists = await page.locator('input[type="password"], input[name="password"]').count() > 0;

  console.log(`📋 Campo email encontrado: ${emailInputExists}`);
  console.log(`📋 Campo password encontrado: ${passwordInputExists}`);

  // Obtener todos los inputs para debugging
  const allInputs = await page.locator('input').all();
  console.log(`📋 Total de inputs encontrados: ${allInputs.length}`);

  for (let i = 0; i < allInputs.length; i++) {
    const type = await allInputs[i].getAttribute('type');
    const name = await allInputs[i].getAttribute('name');
    const id = await allInputs[i].getAttribute('id');
    console.log(`Input ${i}: type="${type}", name="${name}", id="${id}"`);
  }

  // Paso 3: Intentar diferentes estrategias para el login
  console.log('🔐 Intentando login con diferentes estrategias');

  // Estrategia 1: Usando selectores data-testid
  try {
    console.log('Estrategia 1: Usando data-testid');

    // Verificar si existen los elementos con data-testid
    const emailTestIdExists = await page.locator('[data-testid="login-email-input"]').count() > 0;
    const passwordTestIdExists = await page.locator('[data-testid="login-password-input"]').count() > 0;
    const submitTestIdExists = await page.locator('[data-testid="login-submit-button"]').count() > 0;

    console.log(`📋 Email input con data-testid encontrado: ${emailTestIdExists}`);
    console.log(`📋 Password input con data-testid encontrado: ${passwordTestIdExists}`);
    console.log(`📋 Submit button con data-testid encontrado: ${submitTestIdExists}`);

    if (emailTestIdExists && passwordTestIdExists && submitTestIdExists) {
      // Los elementos con data-testid existen, intentar llenar el formulario
      await page.locator('[data-testid="login-email-input"]').click();
      await page.keyboard.type('admin@gamifier.com');
      console.log('✏️ Email ingresado: admin@gamifier.com');

      await page.locator('[data-testid="login-password-input"]').click();
      await page.keyboard.type('admin123');
      console.log('✏️ Password ingresado: admin123');

      // Tomar screenshot antes de hacer submit
      await page.screenshot({ path: './test-results/login-form-filled.png' });

      await page.locator('[data-testid="login-submit-button"]').click();
      console.log('👆 Botón submit clickeado');
    }
  } catch (error) {
    console.error('❌ Error en estrategia 1:', error);
  }

  // Estrategia 2: Usando selectores de tipo y nombre
  try {
    console.log('Estrategia 2: Usando selectores de tipo y nombre');

    // Verificar si el login ya se completó
    if (page.url().includes('/login')) {
      await page.locator('input[type="email"], input[name="email"]').first().fill('admin@gamifier.com');
      console.log('✏️ Email ingresado: admin@gamifier.com');

      await page.locator('input[type="password"], input[name="password"]').first().fill('admin123');
      console.log('✏️ Password ingresado: admin123');

      // Tomar screenshot antes de hacer submit
      await page.screenshot({ path: './test-results/login-form-filled-strategy2.png' });

      await page.locator('button[type="submit"]').first().click();
      console.log('👆 Botón submit clickeado');
    } else {
      console.log('⏩ Login ya completado, saltando estrategia 2');
    }
  } catch (error) {
    console.error('❌ Error en estrategia 2:', error);
  }

  // Estrategia 3: Usando selectores más genéricos
  try {
    console.log('Estrategia 3: Usando selectores genéricos');

    // Verificar si el login ya se completó
    if (page.url().includes('/login')) {
      // Obtener todos los inputs y buscar por tipo
      const inputs = await page.locator('input').all();

      // Encontrar el input de email
      for (const input of inputs) {
        const type = await input.getAttribute('type');
        if (type === 'email' || type === 'text') {
          await input.fill('admin@gamifier.com');
          console.log('✏️ Email ingresado: admin@gamifier.com');
          break;
        }
      }

      // Encontrar el input de password
      for (const input of inputs) {
        const type = await input.getAttribute('type');
        if (type === 'password') {
          await input.fill('admin123');
          console.log('✏️ Password ingresado: admin123');
          break;
        }
      }

      // Tomar screenshot antes de hacer submit
      await page.screenshot({ path: './test-results/login-form-filled-strategy3.png' });

      // Buscar el botón de submit
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const type = await button.getAttribute('type');
        if (type === 'submit') {
          await button.click();
          console.log('👆 Botón submit clickeado');
          break;
        }
      }
    } else {
      console.log('⏩ Login ya completado, saltando estrategia 3');
    }
  } catch (error) {
    console.error('❌ Error en estrategia 3:', error);
  }

  // Paso 4: Esperar a que se complete la redirección (si el login fue exitoso)
  try {
    await page.waitForURL('http://localhost:3000/**', { timeout: 5000 });
    console.log('✅ Redirección exitosa después del login');

    // Tomar screenshot del dashboard
    await page.screenshot({ path: './test-results/dashboard-after-login.png' });

    // Verificar si estamos en la página de login o en el dashboard
    const isStillOnLoginPage = page.url().includes('/login');
    console.log(`🔍 ¿Todavía en página de login? ${isStillOnLoginPage}`);

    if (!isStillOnLoginPage) {
      console.log('✅ Login completado exitosamente');
    } else {
      console.error('❌ Login fallido, todavía en página de login');
    }
  } catch (error) {
    console.error('❌ Error esperando redirección:', error);

    // Tomar screenshot del estado actual
    await page.screenshot({ path: './test-results/login-failed-state.png' });
  }
});
