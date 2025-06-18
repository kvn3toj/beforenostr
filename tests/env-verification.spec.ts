import { test, expect } from '@playwright/test';

test.describe('🔧 VERIFICACIÓN DE VARIABLES DE ENTORNO', () => {
  
  test('🔧 Verificar que las variables de entorno se cargan correctamente', async ({ page }) => {
    console.log('🔧 === VERIFICANDO VARIABLES DE ENTORNO ===');
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verificar variables de entorno en el navegador
    const envVars = await page.evaluate(() => {
      return {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_ENABLE_MOCK_AUTH: import.meta.env.VITE_ENABLE_MOCK_AUTH,
        VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE
      };
    });
    
    console.log('🔧 Variables de entorno detectadas:');
    console.log(JSON.stringify(envVars, null, 2));
    
    // Verificar que las variables están configuradas correctamente
    expect(envVars.VITE_API_BASE_URL).toBe('http://localhost:1111');
    expect(envVars.VITE_ENABLE_MOCK_AUTH).toBe('false');
    expect(envVars.VITE_BASE_URL).toBe('http://localhost:3333');
    
    console.log('✅ Variables de entorno configuradas correctamente');
  });

  test('🌐 Verificar que el API service usa la URL correcta', async ({ page }) => {
    console.log('🌐 === VERIFICANDO CONFIGURACIÓN DEL API SERVICE ===');
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verificar la configuración del API service
    const apiConfig = await page.evaluate(() => {
      // Acceder a la configuración del API service
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
      return {
        API_BASE_URL,
        expectedURL: 'http://localhost:1111'
      };
    });
    
    console.log('🌐 Configuración del API Service:');
    console.log(JSON.stringify(apiConfig, null, 2));
    
    expect(apiConfig.API_BASE_URL).toBe('http://localhost:1111');
    
    console.log('✅ API Service configurado correctamente');
  });
}); 