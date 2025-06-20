import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // 🚀 Con autenticación persistente, solo necesitamos navegar a la página
  // El usuario ya está autenticado como admin globalmente
  console.log('🚀 Navegando con autenticación persistente...');
  
  // Navegar directamente a la página principal - la sesión ya está activa
  await page.goto('/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  
  // Verificar que la aplicación cargó (sin necesidad de verificar mock banner)
  await page.waitForSelector('#root', { timeout: 20000 });
  
  // Esperar a que la aplicación esté completamente cargada
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  console.log('✅ Navegación con autenticación persistente completada');
}); 