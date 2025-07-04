import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../playwright/.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  console.log('🔑 Setting up persistent authentication...');

  // Navegar a la página de login
  await page.goto('/login');
  await page.waitForSelector('#root');

  // Llenar credenciales del usuario de prueba verificadas (según Regla 2.7)
  await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
  await page.fill('[data-testid="login-password-input"] input', '123456');

  // Hacer clic en login
  await page.click('[data-testid="login-submit-button"]');

  // Esperar redirección exitosa a la página principal
  await page.waitForURL('**/', { timeout: 15000 });

  // Verificar que el usuario está autenticado usando múltiples estrategias
  // Estrategia 1: Buscar elementos comunes del dashboard
  const dashboardElements = [
    page.locator('text=CoomÜnity'),
    page.locator('text=Marketplace'),
    page.locator('text=ÜPlay'),
    page.locator('[data-testid="user-menu"]'),
    page.locator('.MuiAppBar-root'),
    page.locator('nav')
  ];

  let elementFound = false;
  for (const element of dashboardElements) {
    try {
      await expect(element).toBeVisible({ timeout: 3000 });
      console.log('✅ Dashboard element found:', await element.textContent().catch(() => 'element'));
      elementFound = true;
      break;
    } catch (e) {
      // Continuar con el siguiente elemento
    }
  }

  if (!elementFound) {
    // Estrategia 2: Verificar que no estamos en la página de login
    const loginForm = page.locator('[data-testid="login-email-input"]');
    const isLoginVisible = await loginForm.isVisible().catch(() => false);
    if (isLoginVisible) {
      throw new Error('Still on login page - authentication failed');
    }
    console.log('✅ Not on login page - authentication likely successful');
  }

  // Esperar un momento adicional para asegurar que el localStorage se complete
  await page.waitForTimeout(2000);

  // Verificar que tenemos el token de autenticación
  const authToken = await page.evaluate(() => localStorage.getItem('COOMUNITY_AUTH_TOKEN'));
  const userData = await page.evaluate(() => localStorage.getItem('COOMUNITY_USER_DATA'));

  console.log('🔍 Auth Token exists:', !!authToken);
  console.log('🔍 User Data exists:', !!userData);

  if (!authToken || !userData) {
    throw new Error('Authentication failed: Missing localStorage data');
  }

  // Guardar el estado de autenticación
  await page.context().storageState({ path: authFile });

  console.log('✅ Authentication state saved to:', authFile);
});
