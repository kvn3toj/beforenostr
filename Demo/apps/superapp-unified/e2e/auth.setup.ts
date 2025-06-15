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
  
  // Llenar credenciales del administrador verificadas
  await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
  await page.fill('[data-testid="login-password-input"] input', 'admin123');
  
  // Hacer clic en login
  await page.click('[data-testid="login-submit-button"]');
  
  // Esperar redirección exitosa a la página principal
  await page.waitForURL('**/', { timeout: 15000 });
  
  // Verificar que el usuario está autenticado y el dashboard carga
  // Usar el brand logo que siempre está presente en el header
  await expect(page.locator('h6.brand-logo')).toBeVisible({ timeout: 10000 });
  
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