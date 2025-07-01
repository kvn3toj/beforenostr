import { test, expect } from '@playwright/test';

/**
 * Test para inspeccionar la estructura del menú y verificar la sección "Gestión CoomÜnity"
 */
test('Inspeccionar estructura del menú y sección Gestión CoomÜnity', async ({ page }) => {
  // Configurar timeout más largo
  test.setTimeout(60000);

  // Paso 1: Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página de login
  await page.screenshot({ path: './test-results/menu-inspection-login.png' });

  // Paso 2: Realizar login usando JavaScript directo
  console.log('🔐 Realizando login con JavaScript directo');

  await page.evaluate(() => {
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
    if (emailInput && passwordInput && submitButton) {
      // Llenar los campos
      emailInput.value = 'admin@gamifier.com';
      passwordInput.value = 'admin123';

      // Disparar eventos para simular la interacción del usuario
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Hacer click en el botón de submit
      submitButton.click();
    }
  });

  // Esperar a que se complete la redirección (si el login fue exitoso)
  try {
    await page.waitForURL('http://localhost:3000/**', { timeout: 10000 });
    console.log('✅ Redirección exitosa después del login');
  } catch (error) {
    console.error('❌ Error esperando redirección:', error);

    // Si falla la redirección, intentar con otra estrategia
    console.log('🔄 Intentando estrategia alternativa para login');

    // Obtener todos los inputs visibles
    const visibleInputs = await page.locator('input:visible').all();

    if (visibleInputs.length >= 2) {
      // Asumir que el primer input es email y el segundo es password
      await visibleInputs[0].fill('admin@gamifier.com');
      await visibleInputs[1].fill('admin123');

      // Buscar un botón visible
      const visibleButtons = await page.locator('button:visible').all();
      if (visibleButtons.length > 0) {
        await visibleButtons[0].click();

        // Esperar a que se complete la redirección
        try {
          await page.waitForURL('http://localhost:3000/**', { timeout: 10000 });
          console.log('✅ Redirección exitosa después del login alternativo');
        } catch (redirectError) {
          console.error('❌ Error esperando redirección alternativa:', redirectError);
        }
      }
    }
  }

  // Paso 3: Verificar si estamos en el dashboard
  const isStillOnLoginPage = page.url().includes('/login');
  if (isStillOnLoginPage) {
    console.error('❌ Login fallido, todavía en página de login');
    await page.screenshot({ path: './test-results/menu-inspection-login-failed.png' });
    return;
  }

  console.log('✅ Login completado exitosamente');

  // Tomar screenshot del dashboard
  await page.screenshot({ path: './test-results/menu-inspection-dashboard.png' });

  // Paso 4: Inspeccionar la estructura del menú
  console.log('🔍 Inspeccionando estructura del menú');

  // Esperar a que el menú lateral se cargue
  await page.waitForTimeout(2000);

  // Obtener la estructura del menú usando JavaScript
  const menuStructure = await page.evaluate(() => {
    // Función para extraer texto de un elemento
    const getText = (element) => {
      return element ? element.textContent.trim() : '';
    };

    // Buscar el menú lateral
    const sidebar = document.querySelector('aside, nav');
    if (!sidebar) return { error: 'No se encontró el menú lateral' };

    // Obtener todas las secciones del menú
    const sections = Array.from(sidebar.querySelectorAll('div > ul, div > div > ul, nav > ul')).map(section => {
      // Obtener el título de la sección (si existe)
      const sectionTitle = getText(section.previousElementSibling);

      // Obtener todos los elementos del menú en esta sección
      const menuItems = Array.from(section.querySelectorAll('li, a')).map(item => {
        return {
          text: getText(item),
          href: item.tagName === 'A' ? item.getAttribute('href') : (item.querySelector('a') ? item.querySelector('a').getAttribute('href') : null)
        };
      });

      return {
        title: sectionTitle,
        items: menuItems
      };
    });

    // Buscar específicamente la sección "Gestión CoomÜnity"
    const allText = sidebar.textContent;
    const hasGestionCoomunity = allText.includes('Gestión CoomÜnity');

    return {
      sections,
      hasGestionCoomunity,
      allText
    };
  });

  console.log('📋 Estructura del menú:', JSON.stringify(menuStructure, null, 2));

  // Paso 5: Verificar si la sección "Gestión CoomÜnity" está presente
  if (menuStructure.hasGestionCoomunity) {
    console.log('✅ Sección "Gestión CoomÜnity" encontrada en el texto del menú');
  } else {
    console.error('❌ Sección "Gestión CoomÜnity" NO encontrada en el texto del menú');

    // Buscar texto similar que podría estar presente
    const menuText = menuStructure.allText || '';
    console.log('📋 Texto completo del menú:', menuText);

    // Buscar secciones que podrían ser similares
    const possibleMatches = [
      'Gestión', 'Coomunity', 'Gestion', 'Comunidad', 'Community'
    ];

    for (const match of possibleMatches) {
      if (menuText.includes(match)) {
        console.log(`🔍 Encontrado texto similar: "${match}"`);
      }
    }
  }

  // Paso 6: Tomar screenshot del menú lateral
  try {
    const sidebar = await page.locator('aside, nav').first();
    if (await sidebar.count() > 0) {
      await sidebar.screenshot({ path: './test-results/menu-inspection-sidebar.png' });
      console.log('✅ Screenshot del menú lateral guardado');
    }
  } catch (error) {
    console.error('❌ Error tomando screenshot del menú lateral:', error);
  }

  // Paso 7: Verificar si el Portal Kanban Cósmico está presente
  try {
    const kanbanLink = await page.locator('a[href="/cosmic-kanban"], a:has-text("Portal Kanban Cósmico")').count() > 0;
    console.log(`🔍 Link "Portal Kanban Cósmico" encontrado: ${kanbanLink}`);

    if (kanbanLink) {
      // Intentar navegar al Portal Kanban Cósmico
      await page.click('a[href="/cosmic-kanban"], a:has-text("Portal Kanban Cósmico")');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: './test-results/menu-inspection-kanban.png' });
      console.log('✅ Navegado al Portal Kanban Cósmico');
    }
  } catch (error) {
    console.error('❌ Error verificando Portal Kanban Cósmico:', error);
  }
});
