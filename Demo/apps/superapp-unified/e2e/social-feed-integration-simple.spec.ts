/**
 * 🤝 SOCIAL FEED INTEGRATION - SIMPLE TEST
 * 
 * Test E2E simple para verificar que el feed social muestre datos reales
 * del endpoint GET /social/publications del Backend NestJS.
 * 
 * ✅ FASE E.2: Verificación de integración Backend → SuperApp (SIMPLE)
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Feed Social - Integración Simple', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegación directa a la SuperApp
    await page.goto('/login');
    
    // Autenticación con credenciales reales del archivo de seed
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que se complete el login y redirija a la página principal
    await page.waitForURL('/', { timeout: 15000 });
    
    // Verificar que React se ha montado correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un momento para asegurar que todo esté cargado
    await page.waitForTimeout(2000);
  });
  
  test('🔍 [BACKEND→SUPERAPP] Verificar que el feed social muestre datos reales', async ({ page }) => {
    console.log('🎯 Iniciando verificación simple del feed social...');
    
    // Navegar al módulo social
    console.log('📱 Navegando al módulo social...');
    await page.goto('/social');
    
    // Esperar a que la página del feed se cargue
    await page.waitForSelector('h1, h2, h3, h4, h5, h6, [data-testid*="social"], [data-testid*="feed"]', { timeout: 15000 });
    
    // Verificar que estamos en la página correcta
    const url = page.url();
    console.log(`📍 URL actual: ${url}`);
    expect(url).toMatch(/\/social/);
    
    // Buscar contenido específico que sabemos que existe en el backend
    await test.step('Verificar contenido de publicaciones reales', async () => {
      // Esperar a que aparezcan las publicaciones
      await page.waitForTimeout(3000);
      
      // Buscar texto específico de las publicaciones del seed
      const publicationTexts = [
        'Compartiendo mi experiencia con la plataforma Gamifier',
        '¡Acabo de completar el nuevo curso de gamificación! Muy recomendado 🎮'
      ];
      
      let foundPublications = 0;
      
      for (const text of publicationTexts) {
        try {
          await page.waitForSelector(`text="${text}"`, { timeout: 5000 });
          console.log(`✅ Encontrada publicación: "${text}"`);
          foundPublications++;
        } catch (error) {
          console.log(`⚠️  No se encontró publicación: "${text}"`);
        }
      }
      
      // Verificar que al menos una publicación real se muestre
      expect(foundPublications).toBeGreaterThan(0);
      console.log(`🎉 Se encontraron ${foundPublications} publicaciones reales del backend`);
    });
    
    // Verificar elementos de usuarios reales
    await test.step('Verificar usuarios reales en las publicaciones', async () => {
      const userNames = [
        'Premium User',
        'Content Creator',
        'Administrator'
      ];
      
      let foundUsers = 0;
      
      for (const userName of userNames) {
        try {
          await page.waitForSelector(`text="${userName}"`, { timeout: 3000 });
          console.log(`✅ Encontrado usuario: "${userName}"`);
          foundUsers++;
        } catch (error) {
          console.log(`⚠️  No se encontró usuario: "${userName}"`);
        }
      }
      
      // Verificar que al menos un usuario real se muestre
      expect(foundUsers).toBeGreaterThan(0);
      console.log(`🎉 Se encontraron ${foundUsers} usuarios reales del backend`);
    });
    
    console.log('✅ Verificación simple del feed social completada exitosamente');
  });
}); 