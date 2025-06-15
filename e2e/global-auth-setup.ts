import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

/**
 * 🔐 GLOBAL AUTH SETUP - SESIÓN ADMIN PERSISTENTE
 * 
 * Esta configuración crea una sesión de admin que se reutiliza
 * en todos los tests, eliminando la necesidad de login repetitivo
 * y reduciendo timeouts significativamente.
 */

const authFile = path.join(__dirname, '../playwright/.auth/admin.json');

async function globalSetup(config: FullConfig) {
  console.log('🚀 Configurando autenticación global de admin...');
  
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔐 Ejecutando login de admin...');
    
    // Navegar a login con timeout extendido
    await page.goto(`${baseURL}/login`, { 
      timeout: 60000, 
      waitUntil: 'domcontentloaded' 
    });

    // Verificar que la página cargó correctamente
    await page.waitForSelector('#root', { timeout: 20000 });
    
    // Realizar login con credenciales admin verificadas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    // Click en submit y esperar redirección
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL('**/', { timeout: 15000 });
    
    console.log('✅ Login exitoso - Guardando estado de sesión...');
    
    // Guardar el estado de autenticación (cookies, localStorage, sessionStorage)
    await page.context().storageState({ path: authFile });
    
    console.log('💾 Estado de autenticación guardado en:', authFile);
    
  } catch (error) {
    console.error('❌ Error en setup de autenticación global:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 