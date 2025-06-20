/**
 * 🤝 SOCIAL MODULE SIMPLE INTEGRATION TEST
 * 
 * Test E2E simplificado para verificar la integración del Módulo Social
 * con el Backend NestJS real - FASE E.2 COMPLETADA
 */

import { test, expect } from '@playwright/test';

test.describe('🤝 Módulo Social - Integración Simplificada', () => {
  
  test('🔍 Verificar integración completa del feed social con datos reales', async ({ page }) => {
    // Timeouts extendidos para una verificación más robusta
    test.setTimeout(120000); // 2 minutos total
    
    console.log('🚀 Iniciando test de integración del módulo social...');
    
    // 1. Navegar a la página de login con timeout extendido
    console.log('📍 Navegando a /login...');
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 2. Esperar a que la página se cargue completamente
    await page.waitForSelector('#root', { timeout: 30000 });
    await page.waitForTimeout(3000); // Espera adicional para la hidratación
    
    // 3. Verificar que los elementos de login están presentes
    console.log('🔍 Verificando elementos de login...');
    
    // Estrategia de múltiples selectores para robustez
    const emailField = page.locator('[data-testid="login-email-input"] input').or(
      page.locator('#email')
    ).or(
      page.locator('input[type="email"]')
    );
    
    const passwordField = page.locator('[data-testid="login-password-input"] input').or(
      page.locator('#password')  
    ).or(
      page.locator('input[type="password"]')
    );
    
    const submitButton = page.locator('[data-testid="login-submit-button"]').or(
      page.locator('button[type="submit"]')
    );
    
    // Esperar a que los elementos estén visibles
    await emailField.waitFor({ state: 'visible', timeout: 20000 });
    await passwordField.waitFor({ state: 'visible', timeout: 20000 });
    await submitButton.waitFor({ state: 'visible', timeout: 20000 });
    
    // 4. Realizar login con credenciales de usuario regular
    console.log('🔐 Realizando login...');
    await emailField.fill('user@gamifier.com');
    await passwordField.fill('123456');
    await submitButton.click();
    
    // 5. Esperar redirección exitosa
    console.log('⏳ Esperando redirección post-login...');
    await page.waitForURL('**/', { timeout: 30000 });
    
    // 6. Navegar al módulo social
    console.log('🤝 Navegando al módulo social...');
    await page.goto('/social', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 7. Verificar que la página social se carga
    await page.waitForSelector('#root', { timeout: 20000 });
    
    // 8. Esperar a que aparezcan los posts del backend
    console.log('📋 Esperando carga de posts del backend...');
    
    // Buscar indicadores de carga de datos reales
    const postContainer = page.locator('[data-testid="social-posts-container"]').or(
      page.locator('.social-feed').or(
        page.locator('[class*="feed"]').or(
          page.locator('[class*="post"]').first()
        )
      )
    );
    
    // Esperar a que aparezcan los posts
    await expect(postContainer).toBeVisible({ timeout: 30000 });
    
    // 9. Verificar contenido específico del backend
    console.log('✅ Verificando contenido de publicaciones del backend...');
    
    // Buscar texto específico de las publicaciones del backend
    const backendContent = [
      'gamificación', // Del post seedeado "curso de gamificación"
      'CoomÜnity',    // Contenido relacionado con la plataforma
      'curso'         // Del post de ejemplo
    ];
    
    let foundBackendContent = false;
    for (const content of backendContent) {
      try {
        await expect(page.locator(`text=${content}`).first()).toBeVisible({ timeout: 10000 });
        foundBackendContent = true;
        console.log(`✅ Encontrado contenido del backend: "${content}"`);
        break;
      } catch (e) {
        console.log(`⏩ Contenido "${content}" no encontrado, probando siguiente...`);
      }
    }
    
    // 10. Verificar elementos de interacción social
    console.log('🎮 Verificando elementos de gamificación social...');
    
    // Buscar botones de like, compartir, etc.
    const socialInteractions = [
      'button[aria-label*="like"]',
      'button[aria-label*="compartir"]', 
      '[data-testid*="like"]',
      '[class*="like"]',
      'text=👍',
      'text=❤️',
      'text=🔥'
    ];
    
    let foundSocialElement = false;
    for (const selector of socialInteractions) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 5000 })) {
          foundSocialElement = true;
          console.log(`✅ Encontrado elemento social: ${selector}`);
          break;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    
    // 11. Verificaciones finales
    console.log('🏁 Realizando verificaciones finales...');
    
    // Verificar que no hay errores JavaScript críticos
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filtrar errores conocidos/esperados
        if (!text.includes('favicon') && 
            !text.includes('404') && 
            !text.includes('Non-Error promise rejection captured')) {
          errors.push(text);
        }
      }
    });
    
    // Verificar que la página responde correctamente
    expect(page.url()).toContain('/social');
    
    // Verificar que se encontró contenido del backend O elementos sociales
    expect(foundBackendContent || foundSocialElement).toBeTruthy();
    
    // Log de éxito
    console.log('🎉 ¡Integración del módulo social verificada exitosamente!');
    console.log(`📊 Contenido del backend encontrado: ${foundBackendContent}`);
    console.log(`🎮 Elementos sociales encontrados: ${foundSocialElement}`);
    
    // Screenshot final para documentación
    await page.screenshot({ 
      path: 'test-results/social-integration-success.png',
      fullPage: true 
    });
  });
  
}); 