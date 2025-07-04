import { test, expect } from '@playwright/test';

/**
 * Test que fuerza la habilitación del botón de login
 */
test('Login forzando habilitación del botón', async ({ page }) => {
  // Configurar timeout más largo
  test.setTimeout(30000);

  // Paso 1: Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página de login
  await page.screenshot({ path: './test-results/login-force-before.png' });

  // Paso 2: Analizar la estructura del formulario
  console.log('🔍 Analizando estructura del formulario');

  // Obtener HTML del formulario para análisis
  const formHTML = await page.evaluate(() => {
    const form = document.querySelector('form');
    return form ? form.outerHTML : 'No form found';
  });

  console.log('📋 HTML del formulario (resumido)');

  // Paso 3: Forzar el login con JavaScript
  console.log('🔐 Forzando login con JavaScript');

  const loginResult = await page.evaluate(() => {
    try {
      // Buscar los campos del formulario
      const emailInput = document.querySelector('input[name="email"], input[type="email"], input[id="email"]');
      const passwordInput = document.querySelector('input[name="password"], input[type="password"], input[id="password"]');
      const submitButton = document.querySelector('button[type="submit"]');

      if (!emailInput || !passwordInput || !submitButton) {
        return {
          success: false,
          error: 'No se encontraron todos los elementos del formulario',
          emailFound: !!emailInput,
          passwordFound: !!passwordInput,
          submitFound: !!submitButton
        };
      }

      // Llenar los campos
      emailInput.value = 'admin@gamifier.com';
      passwordInput.value = 'admin123';

      // Disparar eventos para activar validaciones
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Forzar habilitación del botón
      submitButton.disabled = false;

      // Simular el envío del formulario
      const form = document.querySelector('form');
      if (form) {
        // Crear un evento de envío de formulario
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);

        // Si el evento no fue cancelado, el formulario se envió correctamente
        if (!submitEvent.defaultPrevented) {
          console.log('Formulario enviado correctamente');
        }
      }

      // Hacer clic en el botón
      submitButton.click();

      return {
        success: true,
        emailValue: emailInput.value,
        passwordValue: passwordInput.value,
        buttonDisabled: submitButton.disabled
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  console.log('📋 Resultado del login forzado:', loginResult);

  // Esperar un momento para ver si ocurre la redirección
  await page.waitForTimeout(3000);

  // Tomar screenshot después del intento de login
  await page.screenshot({ path: './test-results/login-force-after.png' });

  // Paso 4: Intentar acceder directamente a la ruta del dashboard
  console.log('🔄 Intentando acceso directo al dashboard');

  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './test-results/login-force-dashboard.png' });

  // Paso 5: Intentar acceder directamente a la ruta del Portal Kanban Cósmico
  console.log('🔄 Intentando acceso directo al Portal Kanban Cósmico');

  await page.goto('http://localhost:3000/cosmic-kanban');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './test-results/login-force-kanban.png' });

  // Paso 6: Verificar si hay algún menú visible en la página actual
  console.log('🔍 Verificando si hay algún menú visible');

  const menuStructure = await page.evaluate(() => {
    // Buscar elementos de navegación
    const navElements = document.querySelectorAll('nav, aside, [role="navigation"]');

    if (navElements.length === 0) {
      return { found: false, message: 'No se encontraron elementos de navegación' };
    }

    // Analizar el primer elemento de navegación encontrado
    const nav = navElements[0];
    const menuItems = Array.from(nav.querySelectorAll('a, button')).map(item => {
      return {
        text: item.textContent?.trim() || '',
        href: item.getAttribute('href') || '',
        role: item.getAttribute('role') || ''
      };
    });

    // Buscar específicamente la sección "Gestión CoomÜnity"
    const allText = nav.textContent || '';
    const hasGestionCoomunity = allText.includes('Gestión CoomÜnity');

    return {
      found: true,
      items: menuItems,
      hasGestionCoomunity,
      allText
    };
  });

  console.log('📋 Estructura del menú:', menuStructure);

  // Paso 7: Intentar acceder a otras rutas para ver si alguna muestra el menú
  console.log('🔄 Intentando acceder a otras rutas');

  const routes = [
    '/users',
    '/roles',
    '/console',
    '/challenges',
    '/marketplace',
    '/transactions',
    '/notifications'
  ];

  for (const route of routes) {
    console.log(`🔍 Accediendo a ruta: ${route}`);
    await page.goto(`http://localhost:3000${route}`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `./test-results/login-force-${route.substring(1)}.png` });
  }
});
