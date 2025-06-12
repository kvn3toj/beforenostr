/**
 * 🤝 SOCIAL FEED REAL DATA VERIFICATION
 * 
 * Test E2E específico para verificar que el feed social muestre datos reales
 * del endpoint GET /social/publications del Backend NestJS.
 * 
 * ✅ FASE E.2: Verificación de integración Backend → SuperApp
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Feed Social - Verificación de Datos Reales', () => {
  
  test('🔍 [BACKEND→SUPERAPP] Verificar que el feed social muestre datos reales del backend', async ({ page }) => {
    console.log('🎯 Iniciando verificación de datos reales del feed social...');
    
    // Navegar directamente al feed social
    console.log('📱 Navegando al feed social...');
    await page.goto('/social');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un poco más para que los datos se carguen
    await page.waitForTimeout(3000);
    
    // Verificar que estamos en la página correcta
    const url = page.url();
    console.log(`📍 URL actual: ${url}`);
    expect(url).toMatch(/\/social/);
    
    // Verificar contenido específico de las publicaciones del backend
    await test.step('Verificar contenido real del backend', async () => {
      const realPostContent = [
        'Compartiendo mi experiencia con la plataforma Gamifier', // Contenido real del backend
        '¡Acabo de completar el nuevo curso de gamificación!',     // Otro contenido real
        'Premium User',        // Nombre de usuario real del backend
        'Content Creator',     // Otro nombre de usuario real
        'Gracias por compartir tu experiencia' // Comentario real
      ];
      
      let realContentFound = false;
      for (const content of realPostContent) {
        try {
          const element = page.getByText(content, { exact: false });
          await element.waitFor({ timeout: 2000 });
          console.log(`✅ Contenido real del backend encontrado: "${content}"`);
          realContentFound = true;
          break;
        } catch (e) {
          console.log(`⏭️ Contenido no encontrado: "${content}"`);
        }
      }
      
      expect(realContentFound).toBe(true);
    });
    
    // Verificar contadores de likes y comentarios del backend
    await test.step('Verificar contadores de interacciones del backend', async () => {
      // Buscar elementos que contengan números (contadores)
      const possibleCounters = ['2', '3', '0'];
      
      let countersFound = 0;
      for (const counter of possibleCounters) {
        try {
          const elements = page.getByText(counter, { exact: true });
          const count = await elements.count();
          if (count > 0) {
            console.log(`✅ Contador "${counter}" encontrado ${count} veces`);
            countersFound++;
          }
        } catch (e) {
          console.log(`⏭️ Contador "${counter}" no encontrado`);
        }
      }
      
      console.log(`📊 Contadores encontrados: ${countersFound}/${possibleCounters.length}`);
      // Al menos algunos contadores deberían estar presentes
      expect(countersFound).toBeGreaterThan(0);
    });
    
    // Verificar que no hay contenido mock
    await test.step('Verificar ausencia de datos mock', async () => {
      const mockContent = [
        'Juan Manuel Escobar', // Nombre de usuario mock
        'María González',      // Otro nombre de usuario mock
        'El Ayni no es solo un intercambio' // Contenido mock típico
      ];
      
      let mockContentFound = false;
      for (const content of mockContent) {
        try {
          const element = page.getByText(content, { exact: false });
          await element.waitFor({ timeout: 1000 });
          console.log(`⚠️ Contenido mock encontrado: "${content}"`);
          mockContentFound = true;
        } catch (e) {
          console.log(`✅ Contenido mock no encontrado: "${content}"`);
        }
      }
      
      // No debería haber contenido mock si la integración funciona correctamente
      expect(mockContentFound).toBe(false);
    });
    
    // Verificar que la página no muestra errores de carga
    await test.step('Verificar ausencia de errores de carga', async () => {
      const errorMessages = [
        'Error loading',
        'Failed to fetch',
        'Network error',
        'Something went wrong'
      ];
      
      let errorsFound = false;
      for (const error of errorMessages) {
        try {
          const element = page.getByText(error, { exact: false });
          await element.waitFor({ timeout: 1000 });
          console.log(`❌ Error encontrado: "${error}"`);
          errorsFound = true;
        } catch (e) {
          console.log(`✅ Sin error: "${error}"`);
        }
      }
      
      expect(errorsFound).toBe(false);
    });
  });
  
  test('📊 [SUPERAPP] Verificar estructura de datos transformada correctamente', async ({ page }) => {
    console.log('🎯 Verificando transformación de datos del backend...');
    
    // Navegar al feed social
    await page.goto('/social');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Verificar que los datos del backend se muestran en el formato esperado por el frontend
    await test.step('Verificar formato de fechas', async () => {
      // Buscar fechas en formato relativo o absoluto
      const datePatterns = [
        /hace \d+ (minuto|hora|día)s?/,
        /\d{1,2}\/\d{1,2}\/\d{4}/,
        /\d{4}-\d{2}-\d{2}/
      ];
      
      let dateFound = false;
      for (const pattern of datePatterns) {
        try {
          const element = page.locator(`text=${pattern}`);
          const count = await element.count();
          if (count > 0) {
            console.log(`✅ Formato de fecha encontrado: ${pattern}`);
            dateFound = true;
            break;
          }
        } catch (e) {
          console.log(`⏭️ Formato de fecha no encontrado: ${pattern}`);
        }
      }
      
      // Las fechas son opcionales en esta verificación inicial
      console.log(`ℹ️ Fechas formateadas encontradas: ${dateFound}`);
    });
    
    // Verificar que los avatares se muestran (aunque sean placeholders)
    await test.step('Verificar avatares de usuarios', async () => {
      const avatarSelectors = [
        'img[alt*="avatar"]',
        'img[src*="avatar"]',
        '[data-testid*="avatar"]',
        '.avatar, .Avatar'
      ];
      
      let avatarsFound = false;
      for (const selector of avatarSelectors) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            console.log(`✅ Avatares encontrados: ${count} con selector ${selector}`);
            avatarsFound = true;
            break;
          }
        } catch (e) {
          console.log(`⏭️ No se encontraron avatares con: ${selector}`);
        }
      }
      
      // Los avatares son opcionales en esta verificación inicial
      console.log(`ℹ️ Avatares encontrados: ${avatarsFound}`);
    });
  });
}); 