/**
 * 🔍 SOCIAL FEED DEBUG TEST
 * 
 * Test de debug para capturar logs de consola y entender qué está pasando
 * con la integración del feed social.
 */

import { test, expect } from '@playwright/test';

test.describe('🔍 Feed Social - Debug', () => {
  
  test('🔍 Debug: Capturar logs y verificar datos del feed social', async ({ page }) => {
    console.log('🎯 Iniciando debug del feed social...');
    
    // Capturar logs de consola
    const consoleLogs: string[] = [];
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      consoleLogs.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });
    
    // Capturar errores de red
    const networkErrors: string[] = [];
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });
    
    // Navegación directa a la SuperApp
    await page.goto('/login');
    
    // Autenticación con credenciales reales del archivo de seed
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que se complete el login
    await page.waitForURL('/', { timeout: 15000 });
    console.log('✅ Login completado exitosamente');
    
    // Navegar al módulo social
    await page.goto('/social');
    await page.waitForSelector('h1, h2, h3, h4, h5, h6, [data-testid*="social"], [data-testid*="feed"]', { timeout: 15000 });
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(5000);
    
    // Capturar el HTML de la página para debug
    const pageContent = await page.content();
    console.log('📄 Contenido de la página capturado');
    
    // Buscar elementos específicos
    const postElements = await page.locator('[data-testid*="post"], .post, .publication, .social-post').count();
    console.log(`📊 Elementos de posts encontrados: ${postElements}`);
    
    // Buscar texto específico en toda la página
    const pageText = await page.textContent('body');
    const hasGamifierText = pageText?.includes('Gamifier');
    const hasGamificationText = pageText?.includes('gamificación');
    
    console.log(`🔍 Texto 'Gamifier' encontrado: ${hasGamifierText}`);
    console.log(`🔍 Texto 'gamificación' encontrado: ${hasGamificationText}`);
    
    // Verificar si hay elementos de carga
    const loadingElements = await page.locator('[data-testid*="loading"], .loading, .skeleton').count();
    console.log(`⏳ Elementos de carga encontrados: ${loadingElements}`);
    
    // Verificar si hay mensajes de error
    const errorElements = await page.locator('[data-testid*="error"], .error, .alert').count();
    console.log(`❌ Elementos de error encontrados: ${errorElements}`);
    
    // Imprimir logs de consola
    console.log('📝 Logs de consola:');
    consoleLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log}`);
    });
    
    // Imprimir errores de consola
    if (consoleErrors.length > 0) {
      console.log('❌ Errores de consola:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Imprimir errores de red
    if (networkErrors.length > 0) {
      console.log('🌐 Errores de red:');
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Verificar llamadas a la API
    const apiCalls = consoleLogs.filter(log => 
      log.includes('/social/publications') || 
      log.includes('social') ||
      log.includes('API') ||
      log.includes('fetch')
    );
    
    console.log('🔗 Llamadas API relacionadas:');
    apiCalls.forEach((call, index) => {
      console.log(`  ${index + 1}. ${call}`);
    });
    
    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-social-feed.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug-social-feed.png');
    
    console.log('✅ Debug completado');
  });
}); 