import { test, expect } from '@playwright/test';

/**
 * Test mejorado para verificar la presencia de la sección "Gestión CoomÜnity"
 * usando múltiples estrategias de selección.
 */
test('Diagnóstico avanzado del menú y sección Gestión CoomÜnity', async ({ page }) => {
  // Configurar timeout más largo para debugging
  test.setTimeout(60000);

  // Paso 1: Navegar a la página de login del Gamifier Admin
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Paso 2: Realizar el login con credenciales de administrador
  try {
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    console.log('✅ Realizando login como administrador');
  } catch (error) {
    console.error('❌ Error en el login:', error);
    // Intentar con selectores alternativos
    try {
      await page.fill('input[type="email"]', 'admin@gamifier.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      console.log('✅ Login realizado con selectores alternativos');
    } catch (error2) {
      console.error('❌ Error en login alternativo:', error2);
      await page.screenshot({ path: './test-results/login-error.png' });
      throw error2;
    }
  }

  // Paso 3: Esperar a que se complete la redirección después del login
  await page.waitForURL('http://localhost:3000/**', { timeout: 30000 });
  console.log('✅ Login completado, redirección exitosa');

  // Paso 4: Tomar screenshot para debugging
  await page.screenshot({ path: './test-results/dashboard-after-login.png' });

  // Paso 5: Diagnóstico completo de la estructura del menú
  console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DEL MENÚ');

  // Verificar todos los elementos h6 (posibles títulos de sección)
  const allSectionTitles = await page.locator('h6').allTextContents();
  console.log('📋 Títulos de sección encontrados (h6):', allSectionTitles);

  // Verificar todos los elementos de navegación
  const allNavItems = await page.locator('nav li').allTextContents();
  console.log('📋 Elementos de navegación encontrados:', allNavItems);

  // Buscar específicamente texto que contenga "Gestión" o "CoomÜnity"
  const gestionElements = await page.locator('text=/Gestión/i').allTextContents();
  console.log('🔍 Elementos con texto "Gestión":', gestionElements);

  const coomElements = await page.locator('text=/CoomÜnity/i').allTextContents();
  console.log('🔍 Elementos con texto "CoomÜnity":', coomElements);

  // Verificar elementos colapsables
  const collapsibleElements = await page.locator('[aria-expanded]').allTextContents();
  console.log('🔍 Elementos colapsables:', collapsibleElements);

  // Paso 6: Intentar diferentes estrategias para encontrar y expandir la sección

  // Estrategia 1: Buscar por texto exacto
  const exactMatch = page.locator('text="Gestión CoomÜnity"');
  const exactMatchCount = await exactMatch.count();
  console.log(`🔍 Estrategia 1 - Coincidencia exacta: ${exactMatchCount}`);

  // Estrategia 2: Buscar por texto parcial
  const partialMatch = page.locator('text=/Gestión/');
  const partialMatchCount = await partialMatch.count();
  console.log(`🔍 Estrategia 2 - Coincidencia parcial "Gestión": ${partialMatchCount}`);

  // Estrategia 3: Buscar por estructura del DOM
  const menuSections = await page.locator('nav h6, nav [role="button"]').allTextContents();
  console.log('🔍 Estrategia 3 - Secciones de menú por estructura DOM:', menuSections);

  // Paso 7: Intentar expandir secciones colapsadas
  const collapsibleButtons = page.locator('nav [aria-expanded="false"]');
  const collapsibleCount = await collapsibleButtons.count();
  console.log(`🔍 Encontrados ${collapsibleCount} elementos colapsables`);

  // Expandir todos los elementos colapsables
  for (let i = 0; i < collapsibleCount; i++) {
    const button = collapsibleButtons.nth(i);
    const text = await button.textContent();
    console.log(`🔍 Expandiendo elemento colapsable ${i}: "${text}"`);
    await button.click();
    await page.waitForTimeout(500); // Pequeña pausa para animación
  }

  // Paso 8: Tomar screenshot después de expandir todo
  await page.screenshot({ path: './test-results/menu-all-expanded.png' });

  // Paso 9: Verificar nuevamente por "Portal Kanban Cósmico" después de expandir
  const allLinks = await page.locator('a').allTextContents();
  console.log('📋 Todos los enlaces después de expandir:', allLinks);

  const kanbanMatches = allLinks.filter(text => text.includes('Kanban'));
  console.log('🔍 Enlaces que contienen "Kanban":', kanbanMatches);

  // Paso 10: Verificar HTML completo del menú para análisis manual
  const menuHTML = await page.locator('nav').evaluate(nav => nav.outerHTML);

  // Guardar HTML en un archivo para análisis
  await page.evaluate((html) => {
    localStorage.setItem('menuDiagnosticHTML', html);
  }, menuHTML);

  console.log('📄 HTML del menú guardado en localStorage para análisis');

  // Paso 11: Intentar acceder directamente a la página del Kanban
  console.log('🔍 Intentando acceso directo a /cosmic-kanban');
  await page.goto('http://localhost:3000/cosmic-kanban');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './test-results/direct-access-kanban.png' });

  // Verificar si estamos en la página correcta
  const currentUrl = page.url();
  console.log(`📍 URL actual: ${currentUrl}`);

  // Si fuimos redirigidos a login, el acceso directo falló
  const isOnKanbanPage = currentUrl.includes('/cosmic-kanban');
  console.log(`✅ ¿Estamos en la página del Kanban? ${isOnKanbanPage}`);

  // Reportar hallazgos
  console.log('\n🔍 RESUMEN DEL DIAGNÓSTICO:');
  console.log(`- Secciones de menú encontradas: ${allSectionTitles.length}`);
  console.log(`- Elementos de navegación: ${allNavItems.length}`);
  console.log(`- Elementos con "Gestión": ${gestionElements.length}`);
  console.log(`- Elementos con "CoomÜnity": ${coomElements.length}`);
  console.log(`- Elementos colapsables: ${collapsibleCount}`);
  console.log(`- Enlaces con "Kanban": ${kanbanMatches.length}`);
  console.log(`- Acceso directo a Kanban: ${isOnKanbanPage ? 'Exitoso' : 'Fallido'}`);
});
