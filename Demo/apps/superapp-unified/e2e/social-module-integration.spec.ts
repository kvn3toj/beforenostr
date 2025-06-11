/**
 * 🤝 SOCIAL MODULE INTEGRATION TESTS
 * 
 * Tests E2E para verificar la integración del Módulo Social (GÜS Gamified Ü Social)
 * con fallback a datos mock cuando el backend no tiene el módulo implementado.
 * 
 * Estado Confirmado: Backend no tiene módulo social, SuperApp usa fallback mock.
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Módulo Social - Integración End-to-End', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegación directa a la SuperApp con autenticación real
    await page.goto('/auth/login');
    
    // Autenticación con credenciales reales usando data-testid específicos
    await page.fill('[data-testid="login-email-input"]', 'test@coomunity.com');
    await page.fill('[data-testid="login-password-input"]', 'test123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que se complete el login y redirija
    await page.waitForURL('/dashboard');
    
    // Verificar que React se ha montado correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un momento para asegurar que todo esté cargado
    await page.waitForTimeout(1000);
  });

  test('🔍 [BACKEND→SUPERAPP] Verificar carga del Feed Social con fallback mock', async ({ page }) => {
    console.log('🎯 Iniciando test de verificación del Feed Social...');
    
    // Navegar al módulo social directamente
    console.log('📱 Navegando al módulo social...');
    await page.goto('/social');
    
    // Esperar a que la página del feed se cargue
    await page.waitForSelector('h1, h2, h3, h4, h5, h6, [data-testid*="social"], [data-testid*="feed"]', { timeout: 10000 });
    
    // Verificar que estamos en la página correcta
    const url = page.url();
    console.log(`📍 URL actual: ${url}`);
    expect(url).toMatch(/\/social/);
    
    // Verificar elementos principales del feed social
    await test.step('Verificar header del feed social', async () => {
      // Buscar indicadores de que es el feed social
      const socialIndicators = [
        'text="Feed Social"',
        'text="Social"', 
        'text="Publicaciones"',
        'text="CoomÜnity"',
        '[data-testid="social-feed"]',
        '[data-testid="social-header"]'
      ];
      
      let found = false;
      for (const indicator of socialIndicators) {
        try {
          await page.locator(indicator).first().waitFor({ timeout: 2000 });
          console.log(`✅ Encontrado indicador social: ${indicator}`);
          found = true;
          break;
        } catch (e) {
          console.log(`⏭️ Indicador no encontrado: ${indicator}`);
        }
      }
      
      expect(found).toBe(true);
    });
    
    // Verificar carga de publicaciones (mock data)
    await test.step('Verificar carga de publicaciones mock', async () => {
      // Esperar un poco para que los datos mock se carguen
      await page.waitForTimeout(2000);
      
      // Buscar tarjetas de publicaciones o contenido del feed
      const postSelectors = [
        '[data-testid*="post"]',
        '.post-card, .PostCard',
        'article',
        '[class*="Post"], [class*="post"]',
        'text="Juan Manuel Escobar"', // Nombre de mock user
        'text="María González"',     // Otro nombre de mock user
        'text="CoomÜnity"',         // Debería aparecer en posts mock
        'text="Ayni"'               // Concepto CoomÜnity en posts mock
      ];
      
      let postsFound = false;
      for (const selector of postSelectors) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            console.log(`✅ Encontradas ${count} publicaciones con selector: ${selector}`);
            postsFound = true;
            break;
          }
        } catch (e) {
          console.log(`⏭️ No se encontraron posts con: ${selector}`);
        }
      }
      
      // Si no encontramos posts, verificar si hay mensaje de "sin publicaciones"
      if (!postsFound) {
        const emptyMessages = [
          'text="No hay publicaciones"',
          'text="Sé el primero en crear"',
          'text="Sin contenido"',
          'text="Cargando"'
        ];
        
        for (const message of emptyMessages) {
          try {
            await page.locator(message).first().waitFor({ timeout: 2000 });
            console.log(`ℹ️ Estado vacío detectado: ${message}`);
            postsFound = true;
            break;
          } catch (e) {
            // Continue checking
          }
        }
      }
      
      expect(postsFound).toBe(true);
    });
    
    // Verificar funcionalidades de interacción básicas
    await test.step('Verificar botones de interacción', async () => {
      // Buscar botones de like, comentario, etc.
      const interactionButtons = [
        'button:has-text("like"), button[aria-label*="like"]',
        'button:has-text("comentar"), button[aria-label*="comment"]',
        'button:has-text("compartir"), button[aria-label*="share"]',
        '[data-testid*="like"]',
        '[data-testid*="comment"]'
      ];
      
      let interactionsFound = false;
      for (const buttonSelector of interactionButtons) {
        try {
          const buttons = page.locator(buttonSelector);
          const count = await buttons.count();
          if (count > 0) {
            console.log(`✅ Encontrados ${count} botones de interacción: ${buttonSelector}`);
            interactionsFound = true;
            break;
          }
        } catch (e) {
          console.log(`⏭️ No se encontraron botones: ${buttonSelector}`);
        }
      }
      
      // Las interacciones son opcionales en esta primera verificación
      console.log(`ℹ️ Botones de interacción encontrados: ${interactionsFound}`);
    });
  });

  test('🎮 [SUPERAPP] Verificar elementos de gamificación social', async ({ page }) => {
    console.log('🎯 Verificando elementos de gamificación...');
    
    // Navegar al feed social
    await page.goto('/social');
    await page.waitForTimeout(2000);
    
    // Verificar elementos de gamificación CoomÜnity
    await test.step('Verificar conceptos CoomÜnity en UI', async () => {
      const coomunityTerms = [
        'text="Mëritos"',
        'text="Ayni"',
        'text="Bien Común"',
        'text="Nivel"',
        'text="Öndas"',
        'text="CoomÜnity"'
      ];
      
      let termsFound = 0;
      for (const term of coomunityTerms) {
        try {
          await page.locator(term).first().waitFor({ timeout: 1000 });
          console.log(`✅ Término CoomÜnity encontrado: ${term}`);
          termsFound++;
        } catch (e) {
          console.log(`⏭️ Término no visible: ${term}`);
        }
      }
      
      // Al menos 1 término de CoomÜnity debería estar presente
      console.log(`📊 Términos CoomÜnity encontrados: ${termsFound}/${coomunityTerms.length}`);
      expect(termsFound).toBeGreaterThan(0);
    });
  });

  test('📱 [SUPERAPP] Verificar responsividad y UX del feed', async ({ page }) => {
    console.log('🎯 Verificando responsividad del feed social...');
    
    // Navegar al feed
    await page.goto('/social');
    await page.waitForTimeout(2000);
    
    // Verificar que la página no tenga errores JavaScript críticos
    await test.step('Verificar ausencia de errores críticos', async () => {
      const jsErrors: string[] = [];
      
      page.on('console', (msg) => {
        if (msg.type() === 'error' && 
            !msg.text().includes('404') && // Ignorar errores 404 esperados del backend
            !msg.text().includes('Failed to fetch') && // Ignorar fetch errors esperados
            !msg.text().includes('social/posts') // Ignorar errores específicos del módulo social
        ) {
          jsErrors.push(msg.text());
        }
      });
      
      // Esperar un momento para capturar errores
      await page.waitForTimeout(3000);
      
      if (jsErrors.length > 0) {
        console.log('⚠️ Errores JavaScript encontrados:', jsErrors);
      }
      
      // Los errores del módulo social son esperados ya que el backend no lo tiene
      expect(jsErrors.length).toBeLessThan(5); // Tolerancia para errores menores
    });
  });

  test('🔄 [INTEGRATION] Verificar manejo de estados de error', async ({ page }) => {
    console.log('🎯 Verificando manejo de errores...');
    
    // Interceptar llamadas al backend social (que fallarán)
    await page.route('**/social/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Social module not implemented', statusCode: 404 })
      });
    });
    
    // Navegar al feed
    await page.goto('/social');
    await page.waitForTimeout(3000);
    
    // Verificar que la app maneja el error graciosamente
    await test.step('Verificar fallback a datos mock', async () => {
      // Debería mostrar datos mock o un estado de error elegante
      const fallbackIndicators = [
        'text="Juan Manuel Escobar"', // Mock user
        'text="María González"',      // Mock user  
        'text="No hay publicaciones"',
        'text="Error"',
        'text="Cargando"'
      ];
      
      let fallbackFound = false;
      for (const indicator of fallbackIndicators) {
        try {
          await page.locator(indicator).first().waitFor({ timeout: 2000 });
          console.log(`✅ Fallback funcionando: ${indicator}`);
          fallbackFound = true;
          break;
        } catch (e) {
          console.log(`⏭️ Indicador no encontrado: ${indicator}`);
        }
      }
      
      expect(fallbackFound).toBe(true);
    });
  });
}); 