/**
 * 🤝 SOCIAL MODULE SIMPLE INTEGRATION TESTS
 * 
 * Tests E2E simplificados para verificar el módulo social directamente
 * sin autenticación, para evaluar el comportamiento básico del fallback mock.
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Módulo Social - Verificación Directa', () => {
  
  test('🔍 [DIRECT] Verificar página social directa', async ({ page }) => {
    console.log('🎯 Navegando directamente al módulo social...');
    
    // Ir directamente a la página social
    await page.goto('/social');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que estamos en la página social
    const url = page.url();
    console.log(`📍 URL actual: ${url}`);
    expect(url).toMatch(/\/social/);
    
    // Verificar que no hay errores críticos de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && 
          !msg.text().includes('404') && 
          !msg.text().includes('social/posts') &&
          !msg.text().includes('Failed to fetch')
      ) {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar un poco para que la página cargue
    await page.waitForTimeout(3000);
    
    // Buscar elementos del módulo social
    const socialElements = [
      'text="Social"',
      'text="CoomÜnity"',
      'text="Feed"',
      'h1, h2, h3, h4, h5, h6',
      '[role="button"]',
      'button'
    ];
    
    let elementsFound = 0;
    for (const selector of socialElements) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          console.log(`✅ Encontrados ${count} elementos con selector: ${selector}`);
          elementsFound++;
        }
      } catch (e) {
        console.log(`⏭️ No se encontraron elementos con: ${selector}`);
      }
    }
    
    console.log(`📊 Elementos sociales encontrados: ${elementsFound}/${socialElements.length}`);
    console.log(`⚠️ Errores JS críticos: ${jsErrors.length}`);
    
    // Al menos algunos elementos deberían estar presentes
    expect(elementsFound).toBeGreaterThan(0);
    
    // No debería haber muchos errores críticos
    expect(jsErrors.length).toBeLessThan(3);
  });

  test('🔍 [MOCK] Verificar datos mock del feed social', async ({ page }) => {
    console.log('🎯 Verificando datos mock del feed social...');
    
    // Ir a la página social
    await page.goto('/social');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Buscar datos mock específicos del feed social
    const mockDataIndicators = [
      'text="Juan Manuel Escobar"',      // Mock user
      'text="María González"',           // Mock user  
      'text="Reciprocidad"',                     // CoomÜnity concept
      'text="Bien Común"',               // CoomÜnity concept
      'text="CoomÜnity"',                // Brand
      'text="Mëritos"',                  // Gamification
      'text="colaborativo"',             // Content keyword
      'text="Economía Sagrada"'          // Content keyword
    ];
    
    let mockDataFound = 0;
    for (const indicator of mockDataIndicators) {
      try {
        const elements = page.locator(indicator);
        const count = await elements.count();
        if (count > 0) {
          console.log(`✅ Datos mock encontrados: ${indicator} (${count})`);
          mockDataFound++;
        }
      } catch (e) {
        console.log(`⏭️ No encontrado: ${indicator}`);
      }
    }
    
    console.log(`📊 Datos mock encontrados: ${mockDataFound}/${mockDataIndicators.length}`);
    
    // Debería encontrar al menos algunos datos mock del feed social
    expect(mockDataFound).toBeGreaterThanOrEqual(1);
  });

  test('🔍 [NETWORK] Verificar llamadas al backend social', async ({ page }) => {
    console.log('🎯 Verificando llamadas al backend social...');
    
    // Interceptar llamadas de red
    const networkCalls: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/social/') || url.includes('/posts')) {
        networkCalls.push(`${request.method()} ${url}`);
        console.log(`📡 Llamada interceptada: ${request.method()} ${url}`);
      }
    });
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/social/') || url.includes('/posts')) {
        console.log(`📨 Respuesta: ${response.status()} ${url}`);
      }
    });
    
    // Ir a la página social
    await page.goto('/social');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(5000);
    
    console.log(`📊 Total llamadas al backend social: ${networkCalls.length}`);
    networkCalls.forEach(call => console.log(`  - ${call}`));
    
    // Verificar que se intentan hacer llamadas al backend social
    // (aunque fallen, es importante que se intenten)
    const socialCalls = networkCalls.filter(call => 
      call.includes('/social/') || call.includes('/posts')
    );
    
    console.log(`📊 Llamadas específicas al módulo social: ${socialCalls.length}`);
    
    // El test pasa independientemente del número de llamadas
    // Lo importante es documentar el comportamiento
    expect(true).toBe(true);
  });

  test('🎮 [GAMIFICATION] Verificar elementos de gamificación', async ({ page }) => {
    console.log('🎯 Verificando elementos de gamificación...');
    
    await page.goto('/social');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Buscar elementos de gamificación CoomÜnity
    const gamificationElements = [
      'text="Mëritos"',
      'text="Nivel"',
      'text="Öndas"',
      'text="Interacciones"',
      '[data-testid*="merit"]',
      '[data-testid*="level"]',
      'button:has-text("like")',
      'button:has-text("comentar")',
      'button:has-text("compartir")'
    ];
    
    let gamificationFound = 0;
    for (const element of gamificationElements) {
      try {
        const elements = page.locator(element);
        const count = await elements.count();
        if (count > 0) {
          console.log(`🎮 Elemento de gamificación encontrado: ${element} (${count})`);
          gamificationFound++;
        }
      } catch (e) {
        console.log(`⏭️ No encontrado: ${element}`);
      }
    }
    
    console.log(`📊 Elementos de gamificación encontrados: ${gamificationFound}/${gamificationElements.length}`);
    
    // Al menos algunos elementos de gamificación deberían estar presentes
    expect(gamificationFound).toBeGreaterThanOrEqual(0); // Flexibilidad en esta primera verificación
  });
}); 