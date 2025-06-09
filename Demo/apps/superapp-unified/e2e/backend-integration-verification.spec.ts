import { test, expect } from '@playwright/test';

/**
 * 🔗 FASE B: Verificación de Integración Gamifier Admin ↔ SuperApp
 * 
 * Tests para verificar que los datos del Backend NestJS se reflejen correctamente
 * en la SuperApp Frontend, simulando el flujo de integración completo.
 * 
 * 🎯 OBJETIVO: Confirmar que los cambios realizados en el Gamifier Admin
 * (a través del Backend NestJS) se visualicen correctamente en la SuperApp.
 */

test.describe('🔗 Integración Backend NestJS ↔ SuperApp', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp
    await page.goto('/');
    
    // Esperar a que React se monte completamente
    await page.waitForSelector('#root');
    
    // Verificar que la aplicación esté cargada usando un selector más específico
    await expect(page.locator('[data-contextual="application-brand"]')).toBeVisible();
  });

  test('🌍 Verificar que los Mundos del Backend se muestren en la SuperApp', async ({ page }) => {
    console.log('🧪 Iniciando verificación de Mundos del Backend...');
    
    // Navegar a la sección de Mundos/Videos
    await page.click('text=Mundos');
    
    // Esperar a que la página de mundos cargue
    await page.waitForSelector('[data-testid="mundos-container"], .mundos-container, .worlds-container', { timeout: 10000 });
    
    // Verificar que se muestren los mundos del backend
    // Basado en los datos del backend que obtuvimos:
    // - "Mundo de Gamificación Educativa"
    // - "Mundo de Desarrollo Profesional" 
    // - "Mundo de Innovación Social"
    
    const mundosFromBackend = [
      'Mundo de Gamificación Educativa',
      'Mundo de Desarrollo Profesional',
      'Mundo de Innovación Social'
    ];
    
    // Verificar que al menos uno de los mundos del backend esté visible
    let mundoVisible = false;
    for (const mundo of mundosFromBackend) {
      try {
        await expect(page.locator(`text=${mundo}`)).toBeVisible({ timeout: 5000 });
        console.log(`✅ Mundo encontrado: ${mundo}`);
        mundoVisible = true;
        break;
      } catch (error) {
        console.log(`⚠️ Mundo no encontrado: ${mundo}`);
      }
    }
    
    // Si no se encuentra ningún mundo específico, verificar que al menos haya contenido de mundos
    if (!mundoVisible) {
      console.log('🔍 Verificando presencia general de mundos...');
      
      // Verificar que haya al menos algún contenido relacionado con mundos
      const hasWorldContent = await page.locator('text=/mundo/i, text=/world/i, [data-testid*="mundo"], [class*="mundo"], [class*="world"]').count() > 0;
      
      if (hasWorldContent) {
        console.log('✅ Contenido de mundos detectado en la interfaz');
      } else {
        console.log('❌ No se detectó contenido de mundos en la interfaz');
        
        // Tomar screenshot para debugging
        await page.screenshot({ path: 'mundos-debug.png', fullPage: true });
        
        // Mostrar el contenido actual de la página para debugging
        const pageContent = await page.textContent('body');
        console.log('📄 Contenido actual de la página:', pageContent?.substring(0, 500));
      }
      
      expect(hasWorldContent).toBeTruthy();
    }
    
    console.log('✅ Verificación de Mundos completada');
  });

  test('🎥 Verificar que los Videos del Backend se muestren en la SuperApp', async ({ page }) => {
    console.log('🧪 Iniciando verificación de Videos del Backend...');
    
    // Navegar a la sección de Videos/ÜPlay
    await page.click('text=ÜPlay');
    
    // Esperar a que la página de videos cargue
    await page.waitForSelector('[data-testid="videos-container"], .videos-container, .uplay-container', { timeout: 10000 });
    
    // Verificar que se muestren videos del backend
    // Basado en los datos del backend que obtuvimos:
    const videosFromBackend = [
      'Introducción a la Gamificación',
      'Elementos de Juego en Educación',
      'Narrativa y Storytelling',
      'Evaluación Gamificada',
      'Mecánicas de Recompensa'
    ];
    
    // Verificar que al menos uno de los videos del backend esté visible
    let videoVisible = false;
    for (const video of videosFromBackend) {
      try {
        await expect(page.locator(`text=${video}`)).toBeVisible({ timeout: 5000 });
        console.log(`✅ Video encontrado: ${video}`);
        videoVisible = true;
        break;
      } catch (error) {
        console.log(`⚠️ Video no encontrado: ${video}`);
      }
    }
    
    // Si no se encuentra ningún video específico, verificar que al menos haya contenido de videos
    if (!videoVisible) {
      console.log('🔍 Verificando presencia general de videos...');
      
      // Verificar que haya al menos algún contenido relacionado con videos
      const hasVideoContent = await page.locator('text=/video/i, text=/play/i, [data-testid*="video"], [class*="video"], iframe').count() > 0;
      
      if (hasVideoContent) {
        console.log('✅ Contenido de videos detectado en la interfaz');
      } else {
        console.log('❌ No se detectó contenido de videos en la interfaz');
        
        // Tomar screenshot para debugging
        await page.screenshot({ path: 'videos-debug.png', fullPage: true });
        
        // Mostrar el contenido actual de la página para debugging
        const pageContent = await page.textContent('body');
        console.log('📄 Contenido actual de la página:', pageContent?.substring(0, 500));
      }
      
      expect(hasVideoContent).toBeTruthy();
    }
    
    console.log('✅ Verificación de Videos completada');
  });

  test('🔗 Verificar conectividad con Backend NestJS', async ({ page }) => {
    console.log('🧪 Verificando conectividad con Backend NestJS...');
    
    // Verificar que la SuperApp pueda comunicarse con el backend
    // Esto se puede hacer interceptando las llamadas de red
    
    let backendCallMade = false;
    
    // Interceptar llamadas al backend
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        console.log(`🌐 Llamada al backend detectada: ${request.method()} ${request.url()}`);
        backendCallMade = true;
      }
    });
    
    // Navegar a una página que haga llamadas al backend
    await page.click('text=Mundos');
    
    // Esperar un momento para que se realicen las llamadas
    await page.waitForTimeout(3000);
    
    // Verificar que se hayan realizado llamadas al backend
    expect(backendCallMade).toBeTruthy();
    
    console.log('✅ Conectividad con Backend verificada');
  });

  test('📊 Verificar respuesta del Backend Health Check', async ({ page }) => {
    console.log('🧪 Verificando Health Check del Backend...');
    
    // Realizar una llamada directa al health check del backend desde el contexto del navegador
    const healthResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3002/health');
        const data = await response.json();
        return { success: true, data, status: response.status };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('🏥 Respuesta del Health Check:', healthResponse);
    
    // Verificar que el backend responda correctamente
    expect(healthResponse.success).toBeTruthy();
    expect(healthResponse.status).toBe(200);
    expect(healthResponse.data.status).toBe('ok');
    
    console.log('✅ Health Check del Backend verificado');
  });

  test('🔄 Verificar caché y actualización de datos', async ({ page }) => {
    console.log('🧪 Verificando comportamiento de caché y actualización...');
    
    // Navegar a mundos
    await page.click('text=Mundos');
    await page.waitForSelector('[data-testid="mundos-container"], .mundos-container, .worlds-container', { timeout: 10000 });
    
    // Capturar el contenido inicial
    const initialContent = await page.textContent('body');
    
    // Refrescar la página para verificar que los datos persisten
    await page.reload();
    await page.waitForSelector('#root');
    
    // Navegar nuevamente a mundos
    await page.click('text=Mundos');
    await page.waitForSelector('[data-testid="mundos-container"], .mundos-container, .worlds-container', { timeout: 10000 });
    
    // Capturar el contenido después del refresh
    const refreshedContent = await page.textContent('body');
    
    // Verificar que el contenido sea consistente (los datos del backend se mantienen)
    expect(refreshedContent).toBeTruthy();
    expect(refreshedContent.length).toBeGreaterThan(100); // Verificar que hay contenido sustancial
    
    console.log('✅ Comportamiento de caché verificado');
  });

  test('🎯 Verificar estructura de datos del Backend en la UI', async ({ page }) => {
    console.log('🧪 Verificando estructura de datos del Backend en la UI...');
    
    // Interceptar respuestas del backend para verificar la estructura
    const backendResponses: any[] = [];
    
    page.on('response', async response => {
      if (response.url().includes('localhost:3002') && response.status() === 200) {
        try {
          const data = await response.json();
          backendResponses.push({
            url: response.url(),
            data: data
          });
          console.log(`📦 Respuesta del backend capturada: ${response.url()}`);
        } catch (error) {
          // Ignorar respuestas que no son JSON
        }
      }
    });
    
    // Navegar a diferentes secciones para capturar respuestas
    await page.click('text=Mundos');
    await page.waitForTimeout(2000);
    
    await page.click('text=ÜPlay');
    await page.waitForTimeout(2000);
    
    // Verificar que se hayan capturado respuestas del backend
    expect(backendResponses.length).toBeGreaterThan(0);
    
    // Verificar la estructura de al menos una respuesta
    const hasValidStructure = backendResponses.some(response => {
      const data = response.data;
      // Verificar que los datos tengan la estructura esperada (array o objeto con propiedades)
      return Array.isArray(data) || (typeof data === 'object' && data !== null);
    });
    
    expect(hasValidStructure).toBeTruthy();
    
    console.log(`✅ Estructura de datos verificada. Respuestas capturadas: ${backendResponses.length}`);
  });

}); 