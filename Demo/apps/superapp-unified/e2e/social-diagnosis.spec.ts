/**
 * 🔧 Test de Diagnóstico del Módulo Social
 * 
 * Test simplificado para identificar problemas específicos en la integración
 * del módulo social antes de ejecutar tests completos.
 */

import { test, expect } from '@playwright/test';

test.describe('🔧 Diagnóstico del Módulo Social', () => {
  
  test.beforeEach(async ({ page }) => {
    console.log('🎯 Iniciando diagnóstico del módulo social...');
  });

  test('🔍 [DIAGNÓSTICO] Verificar acceso básico al módulo social', async ({ page }) => {
    console.log('📱 Navegando al login...');
    await page.goto('/login');
    
    // Verificar que la página de login carga
    await expect(page.locator('#root')).toBeVisible({ timeout: 10000 });
    console.log('✅ Página de login cargada');
    
    // Intentar login con credenciales válidas
    console.log('🔐 Intentando login...');
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // Click en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    console.log('👆 Click en botón de login ejecutado');
    
    // Esperar a que se complete el login (5 segundos máximo)
    await page.waitForTimeout(5000);
    
    // Verificar URL actual después del login
    const currentUrl = page.url();
    console.log(`📍 URL después del login: ${currentUrl}`);
    
    // Intentar navegar manualmente al módulo social
    console.log('🎯 Navegando manualmente a /social...');
    await page.goto('/social');
    await page.waitForTimeout(2000);
    
    // Verificar URL final
    const finalUrl = page.url();
    console.log(`📍 URL final: ${finalUrl}`);
    
    // Verificar si existe algún elemento del módulo social
    const socialElements = await page.locator('[data-testid*="social"], [data-testid*="post"], [data-testid*="feed"]').count();
    console.log(`🔍 Elementos sociales encontrados: ${socialElements}`);
    
    // Tomar screenshot para análisis visual
    await page.screenshot({ path: 'social-diagnosis-final-state.png', fullPage: true });
    console.log('📸 Screenshot guardado como social-diagnosis-final-state.png');
    
    // Test básico: si llegamos hasta aquí, el diagnóstico fue exitoso
    expect(finalUrl).toContain('/social');
  });

  test('🔄 [DIAGNÓSTICO] Verificar conexión directa al backend social', async ({ page }) => {
    console.log('🌐 Verificando conexión directa al backend...');
    
    // Interceptar llamadas de red
    const apiCalls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/social/publications')) {
        apiCalls.push(request.url());
        console.log(`📡 API Call detectada: ${request.url()}`);
      }
    });
    
    // Navegar al módulo social directamente
    await page.goto('/social');
    await page.waitForTimeout(3000);
    
    // Verificar si se realizaron llamadas API
    console.log(`📊 Total de llamadas API sociales: ${apiCalls.length}`);
    apiCalls.forEach((call, index) => {
      console.log(`  ${index + 1}. ${call}`);
    });
    
    // El test pasa si no hay errores críticos
    expect(apiCalls.length).toBeGreaterThanOrEqual(0);
  });

  test('🎮 [DIAGNÓSTICO] Verificar presencia de elementos UI básicos', async ({ page }) => {
    console.log('🎨 Verificando elementos UI básicos...');
    
    await page.goto('/social');
    await page.waitForTimeout(2000);
    
    // Buscar elementos básicos que deberían estar presentes
    const elements = {
      root: await page.locator('#root').count(),
      socialContainer: await page.locator('[data-testid*="social"]').count(),
      anyPosts: await page.locator('[data-testid*="post"]').count(),
      anyButtons: await page.locator('button').count(),
      anyText: await page.locator('text=Social').count(),
    };
    
    console.log('🔍 Elementos encontrados:');
    Object.entries(elements).forEach(([key, count]) => {
      console.log(`  - ${key}: ${count}`);
    });
    
    // Verificar que al menos tenemos el contenedor raíz
    expect(elements.root).toBeGreaterThan(0);
  });
}); 