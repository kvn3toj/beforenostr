// Test básico para verificar que la funcionalidad de logout esté implementada
const { test, expect } = require('@playwright/test');

test('Verificar funcionalidad de cierre de sesión', async ({ page }) => {
  // Navegar a la aplicación
  await page.goto('http://localhost:2222');

  // Esperar a que la aplicación cargue
  await page.waitForSelector('[data-testid="app-header"]', { timeout: 10000 });

  // Buscar el botón de perfil
  const profileButton = page.locator('[aria-label="Perfil de usuario"]');
  await expect(profileButton).toBeVisible();

  // Hacer clic en el botón de perfil para abrir el menú
  await profileButton.click();

  // Esperar a que aparezca el menú desplegable
  await page.waitForSelector('#primary-search-account-menu', { timeout: 5000 });

  // Verificar que el menú esté visible
  const profileMenu = page.locator('#primary-search-account-menu');
  await expect(profileMenu).toBeVisible();

  // Verificar que la opción de "Cerrar Sesión" esté presente
  const logoutOption = page.locator('text=Cerrar Sesión');
  await expect(logoutOption).toBeVisible();

  // Verificar que el texto esté bien formateado
  await expect(logoutOption).toHaveText('Cerrar Sesión');

  // Verificar que haya otras opciones del menú
  const profileOption = page.locator('text=Ver Perfil');
  await expect(profileOption).toBeVisible();

  const settingsOption = page.locator('text=Configuración');
  await expect(settingsOption).toBeVisible();

  console.log(
    '✅ Todas las verificaciones del menú de perfil pasaron exitosamente'
  );

  // Hacer clic en "Cerrar Sesión"
  await logoutOption.click();

  // Verificar que el usuario sea redirigido a la página de login
  await page.waitForURL('**/login', { timeout: 10000 });

  // Verificar que estamos en la página de login
  await expect(page).toHaveURL(/.*\/login/);

  console.log('✅ Funcionalidad de cierre de sesión verificada exitosamente');
});

test('Verificar navegación a configuración', async ({ page }) => {
  // Navegar a la aplicación
  await page.goto('http://localhost:2222');

  // Esperar a que la aplicación cargue
  await page.waitForSelector('[data-testid="app-header"]', { timeout: 10000 });

  // Hacer clic en el botón de perfil
  const profileButton = page.locator('[aria-label="Perfil de usuario"]');
  await profileButton.click();

  // Esperar a que aparezca el menú
  await page.waitForSelector('#primary-search-account-menu', { timeout: 5000 });

  // Hacer clic en "Configuración"
  const settingsOption = page.locator('text=Configuración');
  await settingsOption.click();

  // Verificar que naveguemos a la página de configuración
  await page.waitForURL('**/settings', { timeout: 10000 });
  await expect(page).toHaveURL(/.*\/settings/);

  // Verificar que la página de configuración cargue correctamente
  const settingsTitle = page.locator('text=Configuración');
  await expect(settingsTitle).toBeVisible();

  console.log('✅ Navegación a configuración verificada exitosamente');
});
