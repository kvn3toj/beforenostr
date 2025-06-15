import { Page, Locator, expect } from '@playwright/test';

/**
 * ✅ ESTRATEGIAS DE ESPERA ROBUSTAS PARA PLAYWRIGHT
 * Basado en las mejores prácticas de la documentación oficial
 * https://playwright.dev/docs/test-timeouts
 */

export class WaitStrategies {
  
  /**
   * Espera robusta para que un elemento sea visible con múltiples intentos
   */
  static async waitForElementVisible(
    page: Page, 
    selector: string, 
    options: { timeout?: number; retries?: number } = {}
  ): Promise<boolean> {
    const { timeout = 15000, retries = 3 } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 Intento ${attempt}/${retries}: Esperando elemento ${selector}`);
        
        await page.waitForSelector(selector, { timeout: timeout / retries });
        await expect(page.locator(selector)).toBeVisible({ timeout: 5000 });
        
        console.log(`✅ Elemento ${selector} visible en intento ${attempt}`);
        return true;
        
      } catch (error) {
        console.log(`⚠️ Intento ${attempt} fallido para ${selector}: ${error.message}`);
        
        if (attempt === retries) {
          // En el último intento, tomar screenshot para debugging
          await page.screenshot({ 
            path: `wait-failure-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
            fullPage: true 
          });
          throw error;
        }
        
        // Esperar un poco antes del siguiente intento
        await page.waitForTimeout(1000);
      }
    }
    
    return false;
  }

  /**
   * Espera robusta para navegación con verificación de carga completa
   */
  static async waitForNavigationComplete(
    page: Page, 
    url: string, 
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 30000 } = options;
    
    console.log(`🌐 Navegando a: ${url}`);
    
    // Navegar con timeout extendido
    await page.goto(url, { timeout });
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Esperar a que no haya requests pendientes
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Verificar que la página esté completamente cargada
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 });
    
    console.log(`✅ Navegación completa a: ${url}`);
  }

  /**
   * Espera robusta para llamadas de API con interceptación
   */
  static async waitForApiCall(
    page: Page, 
    urlPattern: string | RegExp, 
    options: { timeout?: number; method?: string } = {}
  ): Promise<boolean> {
    const { timeout = 20000, method = 'GET' } = options;
    
    return new Promise((resolve, reject) => {
      let apiCallDetected = false;
      
      const timeoutId = setTimeout(() => {
        if (!apiCallDetected) {
          reject(new Error(`Timeout: No se detectó llamada API a ${urlPattern} en ${timeout}ms`));
        }
      }, timeout);
      
      page.on('request', (request) => {
        const url = request.url();
        const requestMethod = request.method();
        
        const matchesPattern = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
          
        if (matchesPattern && requestMethod === method) {
          console.log(`🌐 API call detectada: ${requestMethod} ${url}`);
          apiCallDetected = true;
          clearTimeout(timeoutId);
          resolve(true);
        }
      });
    });
  }

  /**
   * Espera robusta para contenido dinámico con verificación de estabilidad
   */
  static async waitForStableContent(
    page: Page, 
    selector: string, 
    options: { timeout?: number; stabilityTime?: number } = {}
  ): Promise<void> {
    const { timeout = 20000, stabilityTime = 2000 } = options;
    
    console.log(`🔄 Esperando contenido estable en: ${selector}`);
    
    let lastContent = '';
    let stableStartTime = 0;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const currentContent = await page.textContent(selector);
        
        if (currentContent === lastContent && currentContent !== null && currentContent.length > 0) {
          if (stableStartTime === 0) {
            stableStartTime = Date.now();
          } else if (Date.now() - stableStartTime >= stabilityTime) {
            console.log(`✅ Contenido estable detectado en: ${selector}`);
            return;
          }
        } else {
          stableStartTime = 0;
          lastContent = currentContent || '';
        }
        
        await page.waitForTimeout(500);
        
      } catch (error) {
        // El elemento puede no existir aún, continuar esperando
        await page.waitForTimeout(500);
      }
    }
    
    throw new Error(`Timeout: Contenido no se estabilizó en ${selector} después de ${timeout}ms`);
  }

  /**
   * Espera robusta para autenticación con verificación de estado
   */
  static async waitForAuthentication(
    page: Page, 
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 30000 } = options;
    
    console.log('🔐 Verificando estado de autenticación...');
    
    // Verificar que el token existe en localStorage
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN') !== null;
    });
    
    if (!hasToken) {
      throw new Error('Token de autenticación no encontrado en localStorage');
    }
    
    // Esperar a que la UI refleje el estado autenticado
    await this.waitForElementVisible(page, '[data-testid="authenticated-content"], .authenticated, .user-menu', {
      timeout
    });
    
    console.log('✅ Autenticación verificada');
  }

  /**
   * Espera robusta para componentes de Material UI
   */
  static async waitForMuiComponent(
    page: Page, 
    componentSelector: string, 
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 15000 } = options;
    
    console.log(`🎨 Esperando componente Material UI: ${componentSelector}`);
    
    // Esperar a que el componente exista
    await page.waitForSelector(componentSelector, { timeout });
    
    // Esperar a que las clases de Material UI se apliquen
    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && element.className.includes('Mui');
      },
      componentSelector,
      { timeout: 5000 }
    );
    
    // Verificar que el componente esté completamente renderizado
    await expect(page.locator(componentSelector)).toBeVisible({ timeout: 5000 });
    
    console.log(`✅ Componente Material UI cargado: ${componentSelector}`);
  }

  /**
   * Manejo de errores con screenshots automáticos
   */
  static async handleTestError(
    page: Page, 
    error: Error, 
    testName: string
  ): Promise<void> {
    console.log(`❌ Error en test ${testName}: ${error.message}`);
    
    // Tomar screenshot
    const screenshotPath = `test-error-${testName.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Capturar logs de consola
    const logs = await page.evaluate(() => {
      return (window as any).capturedErrors || [];
    });
    
    console.log(`📸 Screenshot guardado: ${screenshotPath}`);
    console.log(`📋 Logs capturados: ${logs.length} errores`);
    
    // Re-lanzar el error original
    throw error;
  }
} 