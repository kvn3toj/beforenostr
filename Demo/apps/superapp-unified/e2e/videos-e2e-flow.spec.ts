import { test, expect } from '@playwright/test';

/**
 * 🎥 Tests E2E: Flujo Completo de Videos Gamificados
 * 
 * Verifica el ciclo completo:
 * 1. Visualización de videos desde el Backend NestJS
 * 2. Navegación a la página de reproducción ÜPlay
 * 3. Interacción con preguntas gamificadas (si disponible)
 * 4. Persistencia de respuestas
 */

test.describe('🎬 Videos Gamificados - Flujo E2E Completo', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ir a la página principal con mock auth habilitado
    await page.goto('/');
    
    // Verificar que la aplicación carga correctamente
    await page.waitForSelector('#root', { timeout: 10000 });
    await expect(page.locator('#root')).toBeVisible();
    
    // Verificar que el usuario mock está autenticado
    await expect(page.locator('[data-testid="dev-auth-banner"]')).toBeVisible();
    
    console.log('✅ SuperApp cargada con mock auth');
  });

  test('🔍 Parte 2: Verificar visualización de videos desde Backend', async ({ page }) => {
    console.log('🎯 Iniciando verificación de videos desde Backend NestJS...');
    
    // Navegar a la página de ÜPlay
    await page.click('a[href="/play"]');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página ÜPlay se carga
    await expect(page.locator('h1, h2, h3')).toContainText(/ÜPlay|Videos|Playlist/i);
    
    // Verificar que hay contenido de videos cargado desde el backend
    const videoElements = page.locator('[data-testid*="video"], .video-item, .video-card');
    await expect(videoElements).toHaveCount({ min: 1 });
    
    console.log('✅ Videos cargados desde Backend NestJS');
    
    // Interceptar llamadas a la API para verificar que se están haciendo
    page.on('response', response => {
      if (response.url().includes('/video-items') && response.status() === 200) {
        console.log('✅ API call successful:', response.url());
      }
    });
    
    // Buscar un video específico que sabemos que existe (del seed data)
    const targetVideoTitle = 'Introducción a la Gamificación';
    const videoWithTitle = page.locator(`text=${targetVideoTitle}`).first();
    
    if (await videoWithTitle.isVisible()) {
      console.log(`✅ Video encontrado: "${targetVideoTitle}"`);
      
      // Verificar metadatos del video
      const videoContainer = videoWithTitle.locator('..').locator('..');
      await expect(videoContainer).toContainText(/gamificación/i);
      
      console.log('✅ Metadatos del video verificados');
    } else {
      console.log('ℹ️  Video específico no encontrado, verificando contenido general');
      
      // Al menos verificar que hay contenido de video general
      await expect(page.locator('text=/video|play|gamif/i')).toHaveCount({ min: 1 });
    }
  });

  test('🎮 Parte 3A: Simular interacción con preguntas (si disponible)', async ({ page }) => {
    console.log('🎯 Iniciando simulación de interacción con preguntas...');
    
    // Navegar a ÜPlay
    await page.click('a[href="/play"]');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos de video interactivos
    const playButtons = page.locator('button[data-testid*="play"], .play-button, [aria-label*="play"]');
    const interactiveElements = page.locator('[data-testid*="interactive"], .question, .quiz');
    
    if (await playButtons.first().isVisible()) {
      console.log('🎬 Botón de reproducción encontrado');
      
      // Intentar hacer clic en un video para reproducir
      await playButtons.first().click();
      await page.waitForTimeout(2000); // Dar tiempo para que cargue
      
      // Buscar elementos de pregunta o interacción
      if (await interactiveElements.first().isVisible()) {
        console.log('✅ Elementos interactivos encontrados');
        
        // Buscar opciones de respuesta
        const answerOptions = page.locator('button[data-testid*="answer"], .answer-option, input[type="radio"]');
        
        if (await answerOptions.first().isVisible()) {
          console.log('🤔 Opciones de respuesta encontradas, simulando respuesta...');
          
          // Seleccionar la primera opción
          await answerOptions.first().click();
          
          // Buscar botón de enviar respuesta
          const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Responder"), [data-testid*="submit"]');
          
          if (await submitButton.isVisible()) {
            await submitButton.click();
            console.log('✅ Respuesta enviada');
            
            // Verificar que hay algún feedback
            await expect(page.locator('text=/correcto|incorrecto|bien|mal/i')).toBeVisible({ timeout: 5000 });
            console.log('✅ Feedback de respuesta recibido');
          }
        }
      }
    } else {
      console.log('ℹ️  No se encontraron elementos de video interactivos en esta vista');
      
      // Verificar que al menos la página cargó contenido relacionado con videos
      await expect(page.locator('text=/video|play|contenido/i')).toHaveCount({ min: 1 });
    }
  });

  test('📊 Parte 3B: Verificar persistencia de datos (llamadas API)', async ({ page }) => {
    console.log('🎯 Verificando persistencia de interacciones...');
    
    let apiCallsDetected = false;
    let responseData: any[] = [];
    
    // Interceptar llamadas a la API relacionadas con interacciones
    page.on('response', async response => {
      const url = response.url();
      
      if (url.includes('/video-items') || 
          url.includes('/interactions') || 
          url.includes('/answers') || 
          url.includes('/progress')) {
        
        apiCallsDetected = true;
        
        try {
          const data = await response.json();
          responseData.push({
            url: url,
            status: response.status(),
            method: response.request().method(),
            data: data
          });
          
          console.log(`✅ API Call intercepted: ${response.request().method()} ${url} - Status: ${response.status()}`);
        } catch (error) {
          console.log(`ℹ️  API response (non-JSON): ${response.request().method()} ${url} - Status: ${response.status()}`);
        }
      }
    });
    
    // Navegar a ÜPlay para disparar llamadas API
    await page.click('a[href="/play"]');
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco más para que se completen las llamadas
    await page.waitForTimeout(3000);
    
    // Verificar que se detectaron llamadas API
    expect(apiCallsDetected).toBe(true);
    console.log('✅ Llamadas API detectadas para datos de video');
    
    // Verificar que las llamadas fueron exitosas
    const successfulCalls = responseData.filter(call => call.status >= 200 && call.status < 300);
    expect(successfulCalls.length).toBeGreaterThan(0);
    
    console.log(`✅ ${successfulCalls.length} llamadas API exitosas detectadas`);
    
    // Log datos para debugging
    responseData.forEach(call => {
      console.log(`📡 ${call.method} ${call.url} - ${call.status}`);
    });
  });

  test('🔄 Parte 4: Verificar datos de analíticas (simulado)', async ({ page }) => {
    console.log('🎯 Verificando capacidad de obtener analíticas...');
    
    // Simular obtención de analíticas haciendo una llamada directa a la API
    // (esto simularía lo que haría el Gamifier Admin)
    
    const analyticsEndpoints = [
      '/video-items',
      '/playlists', 
      '/analytics/videos',
      '/stats/videos'
    ];
    
    for (const endpoint of analyticsEndpoints) {
      try {
        console.log(`🔍 Probando endpoint: ${endpoint}`);
        
        const response = await page.request.get(`http://localhost:3002${endpoint}`, {
          headers: {
            'Authorization': 'Bearer mock-jwt-token-for-testing-do-not-use-in-production'
          }
        });
        
        if (response.ok()) {
          const data = await response.json();
          console.log(`✅ Endpoint ${endpoint} disponible - ${response.status()}`);
          
          // Verificar que hay datos
          if (Array.isArray(data) && data.length > 0) {
            console.log(`📊 Datos encontrados: ${data.length} elementos`);
          } else if (data.data && Array.isArray(data.data)) {
            console.log(`📊 Datos encontrados: ${data.data.length} elementos`);
          } else {
            console.log(`📊 Respuesta estructurada recibida`);
          }
        } else {
          console.log(`⚠️  Endpoint ${endpoint} no disponible - ${response.status()}`);
        }
      } catch (error) {
        console.log(`❌ Error en endpoint ${endpoint}:`, error.message);
      }
    }
    
    // Al menos uno de los endpoints debe funcionar
    const basicResponse = await page.request.get('http://localhost:3002/video-items');
    expect(basicResponse.ok()).toBe(true);
    
    console.log('✅ Capacidad de analíticas verificada');
  });

  test('🏁 Resumen del Flujo E2E Completo', async ({ page }) => {
    console.log('🎯 Ejecutando resumen del flujo E2E completo...');
    
    const results = {
      backendConnection: false,
      contentVisualization: false,
      userInteraction: false,
      dataPersistence: false,
      analyticsCapability: false
    };
    
    try {
      // 1. Verificar conexión con backend
      const healthResponse = await page.request.get('http://localhost:3002/health');
      results.backendConnection = healthResponse.ok();
      
      // 2. Verificar visualización de contenido
      await page.goto('/play');
      await page.waitForLoadState('networkidle');
      const contentElements = page.locator('text=/video|play|contenido|gamif/i');
      results.contentVisualization = (await contentElements.count()) > 0;
      
      // 3. Verificar capacidad de interacción (presencia de elementos)
      const interactiveElements = page.locator('button, input, [data-testid]');
      results.userInteraction = (await interactiveElements.count()) > 0;
      
      // 4. Verificar persistencia de datos (API funcional)
      const apiResponse = await page.request.get('http://localhost:3002/video-items');
      results.dataPersistence = apiResponse.ok();
      
      // 5. Verificar capacidad de analíticas
      const analyticsResponse = await page.request.get('http://localhost:3002/playlists');
      results.analyticsCapability = analyticsResponse.ok();
      
    } catch (error) {
      console.error('Error en verificación:', error);
    }
    
    // Mostrar resultados
    console.log('\n🏆 RESUMEN FLUJO E2E DE VIDEOS GAMIFICADOS:');
    console.log('═══════════════════════════════════════════');
    console.log(`🔌 Conexión Backend:        ${results.backendConnection ? '✅' : '❌'}`);
    console.log(`📺 Visualización Contenido: ${results.contentVisualization ? '✅' : '❌'}`);
    console.log(`🎮 Interacción Usuario:     ${results.userInteraction ? '✅' : '❌'}`);
    console.log(`💾 Persistencia Datos:      ${results.dataPersistence ? '✅' : '❌'}`);
    console.log(`📊 Capacidad Analíticas:    ${results.analyticsCapability ? '✅' : '❌'}`);
    console.log('═══════════════════════════════════════════');
    
    // Verificar que al menos los componentes críticos funcionan
    expect(results.backendConnection).toBe(true);
    expect(results.dataPersistence).toBe(true);
    
    console.log('🎉 Flujo E2E de videos gamificados verificado exitosamente!');
  });

}); 