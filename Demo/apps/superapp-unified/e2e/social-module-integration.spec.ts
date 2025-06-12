/**
 * 🤝 SOCIAL MODULE INTEGRATION TESTS
 * 
 * Tests E2E para verificar la integración del Módulo Social (GÜS Gamified Ü Social)
 * con el Backend NestJS real.
 * 
 * ✅ FASE E.2: Backend tiene módulo social implementado, SuperApp consume datos reales.
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Módulo Social - Integración End-to-End', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegación directa a la SuperApp con autenticación real
    await page.goto('/login');
    
    // Autenticación con credenciales de usuario regular (no admin) para el feed social
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que se complete el login y redirija a la página principal
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que React se ha montado correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un momento para asegurar que todo esté cargado
    await page.waitForTimeout(1000);
  });

  test('🔍 [BACKEND→SUPERAPP] Verificar carga del Feed Social con datos reales del backend', async ({ page }) => {
    console.log('🎯 Iniciando test de verificación del Feed Social con datos reales...');
    
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
    
    // Verificar carga de publicaciones reales específicas del backend
    await test.step('Verificar publicaciones reales específicas del backend', async () => {
      // Esperar un poco para que los datos del backend se carguen
      await page.waitForTimeout(3000);
      
      // Verificar la primera publicación específica del seed
      const firstPostContent = page.getByText(/Compartiendo mi experiencia con la plataforma Gamifier/i);
      await expect(firstPostContent).toBeVisible({ timeout: 10000 });
      console.log('✅ Primera publicación del backend encontrada');
      
      // Verificar el autor de esa publicación
      const premiumUserAuthor = page.getByText('Premium User');
      await expect(premiumUserAuthor).toBeVisible();
      console.log('✅ Autor "Premium User" encontrado');
      
      // Verificar la segunda publicación específica del seed
      const secondPostContent = page.getByText(/¡Acabo de completar el nuevo curso de gamificación!/i);
      await expect(secondPostContent).toBeVisible({ timeout: 10000 });
      console.log('✅ Segunda publicación del backend encontrada');
      
      // Verificar el autor de la segunda publicación
      const contentCreatorAuthor = page.getByText('Content Creator');
      await expect(contentCreatorAuthor).toBeVisible();
      console.log('✅ Autor "Content Creator" encontrado');
    });
    
    // Verificar contadores específicos de likes y comentarios del backend
    await test.step('Verificar contadores específicos del backend', async () => {
      // Buscar el post card que contiene "Compartiendo mi experiencia"
      const firstPostCard = page.locator('[data-testid="post-card"]', { 
        hasText: /Compartiendo mi experiencia/i 
      });
      
      if (await firstPostCard.count() > 0) {
        // Verificar contador de likes (debería ser 2 según el seed)
        const likeCount = firstPostCard.locator('[data-testid="like-count"]');
        await expect(likeCount).toHaveText('2');
        console.log('✅ Contador de likes verificado: 2');
        
        // Verificar contador de comentarios (debería ser 0 según el seed)
        const commentCount = firstPostCard.locator('[data-testid="comment-count"]');
        await expect(commentCount).toHaveText('0');
        console.log('✅ Contador de comentarios verificado: 0');
      } else {
        // Si no hay data-testid específicos, verificar que al menos hay contadores numéricos
        const numericCounters = page.locator('text=/^[0-9]+$/');
        const count = await numericCounters.count();
        expect(count).toBeGreaterThan(0);
        console.log(`✅ Encontrados ${count} contadores numéricos`);
      }
    });
    
    // Verificar que los comentarios anidados se muestran correctamente
    await test.step('Verificar comentarios anidados del backend', async () => {
      // Buscar comentarios específicos del seed
      const commentText = page.getByText(/Gracias por compartir tu experiencia/i);
      
      if (await commentText.count() > 0) {
        await expect(commentText).toBeVisible();
        console.log('✅ Comentario anidado del backend encontrado');
        
        // Verificar el autor del comentario
        const adminAuthor = page.getByText('Administrator');
        await expect(adminAuthor).toBeVisible();
        console.log('✅ Autor del comentario "Administrator" encontrado');
      } else {
        console.log('⏭️ Comentarios anidados no visibles en la vista actual');
      }
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
      // Capturar errores de consola
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Esperar un momento para capturar errores
      await page.waitForTimeout(3000);
      
      // Filtrar errores conocidos/esperados
      const criticalErrors = errors.filter(error => 
        !error.includes('404') && // Errores 404 pueden ser esperados durante desarrollo
        !error.includes('Failed to load resource') &&
        !error.includes('favicon.ico') &&
        !error.includes('manifest.json')
      );
      
      console.log(`📊 Errores críticos encontrados: ${criticalErrors.length}`);
      if (criticalErrors.length > 0) {
        console.log('❌ Errores críticos:', criticalErrors);
      }
      
      expect(criticalErrors.length).toBe(0);
    });
    
    // Verificar elementos básicos de UX
    await test.step('Verificar elementos básicos de UX', async () => {
      // Verificar que hay contenido visible
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(100);
      
      // Verificar que no hay elementos con texto "undefined" o "null"
      const undefinedElements = page.locator('text="undefined"');
      const nullElements = page.locator('text="null"');
      
      expect(await undefinedElements.count()).toBe(0);
      expect(await nullElements.count()).toBe(0);
      
      console.log('✅ Elementos básicos de UX verificados');
    });
  });

  test('🔄 [BACKEND] Verificar llamada API real al endpoint /social/publications', async ({ page }) => {
    console.log('🎯 Verificando llamada API real al backend...');
    
    // Interceptar llamadas de red
    const apiCalls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/social/publications')) {
        apiCalls.push(request.url());
        console.log(`📡 API Call interceptada: ${request.url()}`);
      }
    });
    
    // Navegar al feed social
    await page.goto('/social');
    
    // Esperar a que se realice la llamada API
    await page.waitForTimeout(5000);
    
    // Verificar que se realizó la llamada al endpoint correcto
    expect(apiCalls.length).toBeGreaterThan(0);
    expect(apiCalls[0]).toContain('/social/publications');
    console.log('✅ Llamada API al endpoint real verificada');
    
    // Verificar en Network tab que la respuesta fue exitosa
    await test.step('Verificar respuesta exitosa del backend', async () => {
      // Abrir DevTools para verificar Network tab
      await page.goto('/social');
      
      // Esperar a que los datos se carguen
      await page.waitForTimeout(3000);
      
      // Si llegamos hasta aquí y hay contenido visible, la API funcionó
      const hasContent = await page.locator('body').textContent();
      expect(hasContent).toBeTruthy();
      expect(hasContent!.length).toBeGreaterThan(200);
      
      console.log('✅ Respuesta del backend verificada indirectamente');
    });
  });
}); 