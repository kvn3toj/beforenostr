import { test } from '@playwright/test';

/**
 * Test simple para capturar una imagen del menú para análisis
 */
test('Capturar imagen del menú para análisis', async ({ page }) => {
  // Configurar timeout
  test.setTimeout(30000);

  // Paso 1: Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  console.log('✅ Navegando a la página de login');

  // Tomar screenshot de la página de login
  await page.screenshot({ path: './test-results/01-login-page.png' });

  // Paso 2: Realizar el login
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
      await page.screenshot({ path: './test-results/02-login-error.png' });
      throw error2;
    }
  }

  // Paso 3: Esperar a que se complete la redirección
  await page.waitForURL('http://localhost:3000/**');
  console.log('✅ Login completado, redirección exitosa');

  // Paso 4: Tomar screenshot del dashboard
  await page.screenshot({ path: './test-results/03-dashboard.png' });

  // Paso 5: Tomar screenshot específico del menú lateral
  const menu = page.locator('nav').first();
  if (await menu.count() > 0) {
    await menu.screenshot({ path: './test-results/04-menu-lateral.png' });
    console.log('✅ Captura del menú lateral completada');
  } else {
    console.error('❌ No se encontró el menú lateral');
    // Intentar capturar toda la barra lateral
    const sidebar = page.locator('aside').first();
    if (await sidebar.count() > 0) {
      await sidebar.screenshot({ path: './test-results/04-sidebar.png' });
      console.log('✅ Captura de la barra lateral completada');
    }
  }

  // Paso 6: Intentar acceder directamente a la página del Kanban
  await page.goto('http://localhost:3000/cosmic-kanban');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './test-results/05-cosmic-kanban-page.png' });
  console.log('✅ Captura de la página del Kanban completada');
});
