import { test, expect } from '@playwright/test';

/**
 * Test para verificar la presencia de la sección "Gestión CoomÜnity" y el "Portal Kanban Cósmico"
 * en el menú lateral del Gamifier Admin.
 */
test('Verificar sección Gestión CoomÜnity y Portal Kanban Cósmico en el menú', async ({ page }) => {
  // Paso 1: Navegar a la página de login del Gamifier Admin
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Paso 2: Realizar el login con credenciales de administrador
  await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
  await page.fill('[data-testid="login-password-input"] input', 'admin123');
  await page.click('[data-testid="login-submit-button"]');
  console.log('✅ Realizando login como administrador');

  // Paso 3: Esperar a que se complete la redirección después del login
  await page.waitForURL('http://localhost:3000/**');
  console.log('✅ Login completado, redirección exitosa');

  // Paso 4: Tomar screenshot para debugging
  await page.screenshot({ path: './test-results/menu-before-expand.png' });

  // Paso 5: Buscar y expandir la sección "Gestión CoomÜnity" si está colapsada
  const sectionTitle = page.locator('text=Gestión CoomÜnity');

  // Verificar si la sección existe
  const sectionExists = await sectionTitle.count() > 0;
  console.log(`🔍 Sección "Gestión CoomÜnity" encontrada: ${sectionExists}`);

  if (sectionExists) {
    // Si la sección existe pero está colapsada, expandirla
    const isExpanded = await page.evaluate(() => {
      const section = document.querySelector('text=Gestión CoomÜnity');
      if (section) {
        const parentElement = section.closest('[aria-expanded]');
        return parentElement ? parentElement.getAttribute('aria-expanded') === 'true' : false;
      }
      return false;
    });

    if (!isExpanded) {
      await sectionTitle.click();
      console.log('✅ Expandiendo la sección "Gestión CoomÜnity"');
    }
  }

  // Paso 6: Tomar screenshot después de expandir
  await page.screenshot({ path: './test-results/menu-after-expand.png' });

  // Paso 7: Verificar la presencia del "Portal Kanban Cósmico"
  const kanbanLink = page.locator('text=Portal Kanban Cósmico');
  const kanbanExists = await kanbanLink.count() > 0;
  console.log(`🔍 "Portal Kanban Cósmico" encontrado: ${kanbanExists}`);

  // Paso 8: Verificar todos los elementos del menú para debugging
  const menuItems = await page.locator('nav').locator('a, button').allTextContents();
  console.log('📋 Elementos del menú encontrados:', menuItems);

  // Paso 9: Verificar HTML del menú para debugging
  const menuHTML = await page.locator('nav').evaluate(nav => nav.outerHTML);
  console.log('📄 HTML del menú:', menuHTML);

  // Aserciones
  expect(sectionExists, 'La sección "Gestión CoomÜnity" debe estar presente en el menú').toBeTruthy();
  expect(kanbanExists, 'El "Portal Kanban Cósmico" debe estar presente en el menú').toBeTruthy();

  // Paso 10: Si encontramos el link, intentar navegar a él
  if (kanbanExists) {
    await kanbanLink.click();
    console.log('✅ Navegando al Portal Kanban Cósmico');

    // Esperar a que la URL cambie
    await page.waitForURL('**/cosmic-kanban');

    // Tomar screenshot de la página del kanban
    await page.screenshot({ path: './test-results/cosmic-kanban-page.png' });

    // Verificar que estamos en la página correcta
    expect(page.url()).toContain('/cosmic-kanban');
  }
});
