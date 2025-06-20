import { test, expect } from '@playwright/test';

/**
 * 🔗 FASE B: Verificación de Datos del Backend en la SuperApp
 * 
 * Tests específicos para verificar que los datos del Backend NestJS
 * se muestren correctamente en la interfaz de la SuperApp.
 */

test.describe('🔗 Datos del Backend en SuperApp', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp
    await page.goto('/');
    
    // Esperar a que React se monte completamente
    await page.waitForSelector('#root');
    
    // Verificar que la aplicación esté cargada
    await expect(page.locator('[data-contextual="application-brand"]')).toBeVisible();
  });

  test('🌐 Verificar llamadas al backend y respuestas', async ({ page }) => {
    console.log('🧪 Verificando llamadas al backend...');
    
    const backendCalls: string[] = [];
    const backendResponses: any[] = [];
    
    // Interceptar llamadas al backend
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        backendCalls.push(`${request.method()} ${request.url()}`);
        console.log(`🌐 Llamada: ${request.method()} ${request.url()}`);
      }
    });
    
    // Interceptar respuestas del backend
    page.on('response', async response => {
      if (response.url().includes('localhost:3002') && response.status() === 200) {
        try {
          const data = await response.json();
          backendResponses.push({
            url: response.url(),
            status: response.status(),
            data: data
          });
          console.log(`📦 Respuesta exitosa: ${response.url()}`);
        } catch (error) {
          // Ignorar respuestas que no son JSON
        }
      }
    });
    
    // Esperar un momento para que se realicen las llamadas automáticas
    await page.waitForTimeout(5000);
    
    // Verificar que se hayan realizado llamadas al backend
    expect(backendCalls.length).toBeGreaterThan(0);
    console.log(`✅ Total de llamadas al backend: ${backendCalls.length}`);
    
    // Verificar que se hayan recibido respuestas exitosas
    expect(backendResponses.length).toBeGreaterThan(0);
    console.log(`✅ Total de respuestas exitosas: ${backendResponses.length}`);
    
    // Mostrar algunas llamadas para debugging
    console.log('📋 Primeras 5 llamadas al backend:');
    backendCalls.slice(0, 5).forEach((call, index) => {
      console.log(`  ${index + 1}. ${call}`);
    });
  });

  test('🎥 Verificar endpoint de videos funciona', async ({ page }) => {
    console.log('🧪 Verificando endpoint de videos...');
    
    // Realizar llamada directa al endpoint de videos
    const videosResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3002/video-items');
        const data = await response.json();
        return { 
          success: true, 
          status: response.status, 
          dataLength: Array.isArray(data) ? data.length : 0,
          firstVideo: Array.isArray(data) && data.length > 0 ? data[0] : null
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('🎥 Respuesta de videos:', videosResponse);
    
    // Verificar que el endpoint responda correctamente
    expect(videosResponse.success).toBeTruthy();
    expect(videosResponse.status).toBe(200);
    expect(videosResponse.dataLength).toBeGreaterThan(0);
    
    // Verificar estructura del primer video
    if (videosResponse.firstVideo) {
      expect(videosResponse.firstVideo).toHaveProperty('id');
      expect(videosResponse.firstVideo).toHaveProperty('title');
      expect(videosResponse.firstVideo).toHaveProperty('url');
      console.log(`✅ Primer video: "${videosResponse.firstVideo.title}"`);
    }
  });

  test('🌍 Verificar endpoint de mundos funciona', async ({ page }) => {
    console.log('🧪 Verificando endpoint de mundos...');
    
    // Realizar llamada directa al endpoint de mundos
    const mundosResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3002/mundos');
        const data = await response.json();
        return { 
          success: true, 
          status: response.status, 
          dataLength: Array.isArray(data) ? data.length : 0,
          firstMundo: Array.isArray(data) && data.length > 0 ? data[0] : null
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('🌍 Respuesta de mundos:', mundosResponse);
    
    // Verificar que el endpoint responda correctamente
    expect(mundosResponse.success).toBeTruthy();
    expect(mundosResponse.status).toBe(200);
    expect(mundosResponse.dataLength).toBeGreaterThan(0);
    
    // Verificar estructura del primer mundo
    if (mundosResponse.firstMundo) {
      expect(mundosResponse.firstMundo).toHaveProperty('id');
      expect(mundosResponse.firstMundo).toHaveProperty('name');
      expect(mundosResponse.firstMundo).toHaveProperty('description');
      console.log(`✅ Primer mundo: "${mundosResponse.firstMundo.name}"`);
    }
  });

  test('🔍 Verificar navegación y contenido en la SuperApp', async ({ page }) => {
    console.log('🧪 Verificando navegación en la SuperApp...');
    
    // Verificar que hay elementos de navegación
    const navigationElements = await page.locator('nav, [role="navigation"], .navigation, .nav').count();
    console.log(`🧭 Elementos de navegación encontrados: ${navigationElements}`);
    
    // Verificar que hay contenido principal
    const mainContent = await page.locator('main, [role="main"], .main-content, .content').count();
    console.log(`📄 Elementos de contenido principal: ${mainContent}`);
    
    // Verificar que hay al menos algún contenido visible
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    
    console.log(`✅ Contenido de la página verificado (${bodyText!.length} caracteres)`);
  });

  test('📊 Verificar integración completa Backend ↔ SuperApp', async ({ page }) => {
    console.log('🧪 Verificando integración completa...');
    
    let backendCallsCount = 0;
    let successfulResponses = 0;
    const endpoints = new Set<string>();
    
    // Interceptar todas las interacciones con el backend
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        backendCallsCount++;
        const endpoint = new URL(request.url()).pathname;
        endpoints.add(endpoint);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('localhost:3002') && response.status() === 200) {
        successfulResponses++;
      }
    });
    
    // Esperar a que se realicen las llamadas automáticas
    await page.waitForTimeout(8000);
    
    // Verificar métricas de integración
    console.log(`📊 Métricas de integración:`);
    console.log(`   - Llamadas al backend: ${backendCallsCount}`);
    console.log(`   - Respuestas exitosas: ${successfulResponses}`);
    console.log(`   - Endpoints únicos: ${endpoints.size}`);
    console.log(`   - Endpoints: ${Array.from(endpoints).join(', ')}`);
    
    // Verificaciones de integración
    expect(backendCallsCount).toBeGreaterThan(0);
    expect(successfulResponses).toBeGreaterThan(0);
    expect(endpoints.size).toBeGreaterThan(0);
    
    // Verificar que al menos algunos endpoints críticos estén siendo llamados
    const endpointsList = Array.from(endpoints);
    const hasCriticalEndpoints = endpointsList.some(endpoint => 
      endpoint.includes('/health') || 
      endpoint.includes('/users') || 
      endpoint.includes('/notifications')
    );
    
    expect(hasCriticalEndpoints).toBeTruthy();
    
    console.log('✅ Integración Backend ↔ SuperApp verificada exitosamente');
  });

}); 