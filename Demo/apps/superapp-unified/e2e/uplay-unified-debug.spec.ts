/**
 * 🔍 ÜPlay Unified System - Debug Test
 * 
 * Test simplificado para debuggear problemas específicos del sistema unificado
 */

import { test, expect, Page } from '@playwright/test';

test.describe('ÜPlay Unified System - Debug', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Login con credenciales de ADMIN
    console.log('🔐 Iniciando login con credenciales de admin...');
    await page.goto('/login');
    await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 10000 });
    
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección al home
    console.log('⏳ Esperando redirección al home...');
    await page.waitForURL('**/', { timeout: 20000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    console.log('✅ Login completado, usuario en home');
  });

  test('🔍 Debug: Verificar qué se renderiza en modo gamificado', async () => {
    console.log('🔍 Navegando directamente a /uplay-gamified...');
    
    // Navegar directamente a la ruta
    await page.goto('/uplay-gamified');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Tomar screenshot para ver qué se renderiza
    await page.screenshot({ path: 'debug-gamified-mode.png', fullPage: true });
    
    // Verificar que la página cargó
    const pageContent = await page.textContent('body');
    console.log('📄 Contenido de la página (primeros 500 caracteres):');
    console.log(pageContent?.substring(0, 500));
    
    // Buscar cualquier texto relacionado con ÜPlay
    const uplayTexts = [
      'ÜPlay',
      'Gamificado',
      'Mëritos',
      'Öndas',
      'Video',
      'Reproductor'
    ];
    
    for (const text of uplayTexts) {
      const isVisible = await page.locator(`text=${text}`).first().isVisible().catch(() => false);
      console.log(`🔍 Texto "${text}": ${isVisible ? '✅ Visible' : '❌ No visible'}`);
    }
    
    // Verificar si hay errores en la consola
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    // Esperar un poco más para capturar errores
    await page.waitForTimeout(2000);
    
    if (logs.length > 0) {
      console.log('🚨 Errores de consola encontrados:');
      logs.forEach(log => console.log(log));
    } else {
      console.log('✅ No hay errores de consola');
    }
    
    // Verificar que al menos algo de ÜPlay se renderizó
    const hasUPlayContent = await page.locator('text=ÜPlay').first().isVisible().catch(() => false);
    expect(hasUPlayContent).toBe(true);
  });
}); 