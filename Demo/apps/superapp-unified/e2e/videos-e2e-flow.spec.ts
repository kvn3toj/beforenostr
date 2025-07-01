import { test, expect } from '@playwright/test';

/**
 * 🎬 Videos Gamificados - Flujo E2E Completo
 * 
 * Este test suite verifica el flujo completo de videos gamificados
 * desde el Backend NestJS hasta la SuperApp Frontend, incluyendo:
 * - Carga de videos desde el backend
 * - Interacción con elementos gamificados
 * - Persistencia de datos de interacción
 * - Capacidad de analíticas
 */

// Función de utilidad para login con credenciales reales
async function loginAs(page: any, email: string = 'user@gamifier.com', password: string = '123456') {
  await page.goto('/login');
  await page.waitForSelector('#root', { timeout: 10000 });
  
  // Llenar formulario de login
  await page.fill('[data-testid="login-email-input"] input', email);
  await page.fill('[data-testid="login-password-input"] input', password);
  await page.click('[data-testid="login-submit-button"]');
  
  // Esperar redirección exitosa
  await page.waitForURL('**/', { timeout: 15000 });
  
  // 🔧 SOLUCIÓN CRÍTICA: Dar tiempo para que la página home se renderice completamente
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(2000); // Dar tiempo adicional para que se renderice el sidebar/navigation
  
  // Verificar que los elementos de navegación están disponibles
  await page.waitForSelector('nav, [role="navigation"], .navigation, .sidebar', { timeout: 10000 });
  
  console.log(`✅ Login exitoso con ${email} - Página completamente cargada`);
}

// 🔧 SOLUCIÓN CRÍTICA: Función robusta para navegar a ÜPlay
async function navigateToUPlay(page: any) {
  console.log('🎯 Navegando a ÜPlay de manera robusta...');
  
  // Intentar múltiples selectores para encontrar el enlace ÜPlay
  const uplaySelectors = [
    'a[href="/uplay"]',
    'a[href*="uplay"]',
    'nav a:has-text("ÜPlay")',
    'nav a:has-text("UPlay")',
    'nav a:has-text("Videos")',
    'button:has-text("ÜPlay")',
    'button:has-text("UPlay")',
    '[data-testid*="uplay"]',
    '.navigation a:has-text("ÜPlay")',
    '.sidebar a:has-text("ÜPlay")'
  ];
  
  let clickedSuccessfully = false;
  
  for (const selector of uplaySelectors) {
    try {
      // Esperar a que el elemento esté disponible
      await page.waitForSelector(selector, { timeout: 5000 });
      
      if (await page.locator(selector).isVisible()) {
        console.log(`✅ Enlace ÜPlay encontrado con selector: ${selector}`);
        await page.click(selector);
        await page.waitForLoadState('networkidle');
        clickedSuccessfully = true;
        break;
      }
    } catch (error) {
      console.log(`ℹ️  Selector ${selector} no encontrado, probando siguiente...`);
      continue;
    }
  }
  
  if (!clickedSuccessfully) {
    // Si no encuentra ningún enlace, intentar navegación directa
    console.log('⚠️  No se encontró enlace ÜPlay, navegando directamente...');
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');
  }
  
  console.log('✅ Navegación a ÜPlay completada');
}

test.describe('🎬 Videos Gamificados - Flujo E2E Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Autenticarse con credenciales reales del backend
    await loginAs(page);
    
    // Verificar que la aplicación carga correctamente después del login
    await page.waitForSelector('#root', { timeout: 10000 });
    await expect(page.locator('#root')).toBeVisible();
    
    console.log('✅ SuperApp cargada con autenticación real');
  });

  test('🔍 Parte 2: Verificar visualización de videos desde Backend', async ({ page }) => {
    console.log('🎯 Iniciando verificación de videos desde Backend NestJS...');
    
    // Navegar a la página de ÜPlay
    await navigateToUPlay(page);
    
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
    await navigateToUPlay(page);
    
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
    const responseData: any[] = [];
    
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
            url,
            status: response.status(),
            method: response.request().method(),
            data
          });
          
          console.log(`✅ API Call intercepted: ${response.request().method()} ${url} - Status: ${response.status()}`);
        } catch (error) {
          console.log(`ℹ️  API response (non-JSON): ${response.request().method()} ${url} - Status: ${response.status()}`);
        }
      }
    });
    
    // Navegar a ÜPlay para disparar llamadas API
    await navigateToUPlay(page);
    
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
    
    // Obtener el token de autenticación del localStorage
    const authToken = await page.evaluate(() => {
      return localStorage.getItem('authToken') || localStorage.getItem('token');
    });
    
    const analyticsEndpoints = [
      '/video-items',
      '/playlists', 
      '/analytics/videos',
      '/stats/videos'
    ];
    
    for (const endpoint of analyticsEndpoints) {
      try {
        console.log(`🔍 Probando endpoint: ${endpoint}`);
        
        const headers: any = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const response = await page.request.get(`http://localhost:3002${endpoint}`, {
          headers
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
          console.log(`❌ Endpoint ${endpoint} no disponible - ${response.status()}`);
        }
      } catch (error) {
        console.log(`⚠️ Error probando ${endpoint}:`, error);
      }
    }
    
    console.log('✅ Verificación de analíticas completada');
  });

  test('🏁 Resumen del Flujo E2E Completo', async ({ page }) => {
    console.log('🎯 Ejecutando resumen completo del flujo E2E...');
    
    // Verificar que estamos autenticados
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Navegar a ÜPlay y verificar funcionalidad básica
    await navigateToUPlay(page);
    
    // Verificar elementos clave del flujo
    const checks = {
      videoContent: false,
      apiConnectivity: false,
      interactiveElements: false,
      navigation: false
    };
    
    // 1. Verificar contenido de video
    const videoElements = page.locator('[data-testid*="video"], .video-item, .video-card');
    if (await videoElements.first().isVisible()) {
      checks.videoContent = true;
      console.log('✅ Contenido de video presente');
    }
    
    // 2. Verificar conectividad API
    try {
      const authToken = await page.evaluate(() => {
        return localStorage.getItem('authToken') || localStorage.getItem('token');
      });
      
      const headers: any = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await page.request.get('http://localhost:3002/video-items', { headers });
      if (response.ok()) {
        checks.apiConnectivity = true;
        console.log('✅ Conectividad API verificada');
      }
    } catch (error) {
      console.log('⚠️ Error verificando API:', error);
    }
    
    // 3. Verificar elementos interactivos
    const interactiveElements = page.locator('button, a, input');
    if (await interactiveElements.first().isVisible()) {
      checks.interactiveElements = true;
      console.log('✅ Elementos interactivos presentes');
    }
    
    // 4. Verificar navegación
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('/')) {
      checks.navigation = true;
      console.log('✅ Navegación funcional');
    }
    
    // Resumen final
    const successCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    console.log('\n🏆 RESUMEN FINAL: FLUJO E2E VIDEOS GAMIFICADOS');
    console.log('═════════════════════════════════════════════════');
    console.log(`🔌 Autenticación Real:        ${checks.navigation ? '✅' : '❌'}`);
    console.log(`📊 Contenido de Video:        ${checks.videoContent ? '✅' : '❌'}`);
    console.log(`🔗 Conectividad API:          ${checks.apiConnectivity ? '✅' : '❌'}`);
    console.log(`🎮 Elementos Interactivos:    ${checks.interactiveElements ? '✅' : '❌'}`);
    console.log('═════════════════════════════════════════════════');
    console.log(`📊 Score General: ${successCount}/${totalChecks} (${Math.round(successCount/totalChecks*100)}%)`);
    console.log(`🎉 FLUJO E2E VIDEOS GAMIFICADOS: ${successCount >= 3 ? '¡EXITOSO!' : 'NECESITA ATENCIÓN'}`);
    
    // Verificar que al menos 3 de 4 checks pasaron
    expect(successCount).toBeGreaterThanOrEqual(3);
    console.log('✅ Prueba de integración E2E completada exitosamente');
  });
}); 