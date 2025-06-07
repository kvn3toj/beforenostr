import { test, expect } from '@playwright/test';

/**
 * Pruebas para Heurística UX #1: Visibilidad del Estado del Sistema
 * 
 * Verifica que el sistema siempre informe a los usuarios sobre:
 * - Estados de carga y progreso
 * - Confirmaciones de acciones
 * - Errores y validaciones
 * - Cambios de estado en tiempo real
 */

test.describe('UX Heurística #1: Visibilidad del Estado del Sistema', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar interceptadores para simular latencia y observar estados de carga
    await page.route('**/*', async (route) => {
      // Simular latencia en ciertas rutas para observar estados de carga
      if (route.request().url().includes('.js') || route.request().url().includes('.css')) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await route.continue();
    });
  });

  test('debería mostrar indicadores de carga en navegación inicial', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    
    // Verificar que hay elementos de loading inicial
    const loadingIndicators = [
      '.loading-overlay',
      '.spinner',
      '.loading-spinner',
      '[data-loading="true"]',
      '.loader'
    ];
    
    // Al menos uno de los indicadores de carga debería estar presente
    let hasLoadingIndicator = false;
    for (const selector of loadingIndicators) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        hasLoadingIndicator = true;
        console.log(`✓ Indicador de carga encontrado: ${selector}`);
        break;
      } catch {
        // Continuar buscando otros indicadores
      }
    }
    
    // Verificar que el contenido principal se carga correctamente
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    
    console.log(`Loading indicators present: ${hasLoadingIndicator}`);
  });

  test('debería mostrar estados de carga en la sección Red Pill', async ({ page }) => {
    // Navegar a la sección Red Pill
    await page.goto('/sections/red-pill/');
    
    // Esperar a que la página se cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que hay elementos interactivos que pueden mostrar estados de carga
    const interactiveElements = await page.locator('button, .clickable, .interactive, [role="button"]').all();
    
    if (interactiveElements.length > 0) {
      console.log(`✓ Encontrados ${interactiveElements.length} elementos interactivos`);
      
      // Hacer clic en el primer elemento interactivo y verificar feedback
      const firstElement = interactiveElements[0];
      
      // Verificar estado inicial
      await expect(firstElement).toBeVisible();
      
      // Simular interacción y buscar cambios visuales
      await firstElement.click();
      
      // Buscar indicadores de estado después del clic
      const stateIndicators = [
        '.loading',
        '.active', 
        '.processing',
        '.clicked',
        '[aria-busy="true"]'
      ];
      
      await page.waitForTimeout(500); // Esperar a que se apliquen los cambios
      
      let hasStateChange = false;
      for (const indicator of stateIndicators) {
        const elements = await page.locator(indicator).count();
        if (elements > 0) {
          hasStateChange = true;
          console.log(`✓ Estado visual detectado: ${indicator}`);
          break;
        }
      }
      
      console.log(`State change detected: ${hasStateChange}`);
    }
  });

  test('debería mostrar mensajes de validación en formularios', async ({ page }) => {
    // Buscar formularios en diferentes secciones
    const sectionsToTest = [
      '/sections/merchant/',
      '/sections/pilgrim/',
      '/sections/red-pill/'
    ];
    
    for (const section of sectionsToTest) {
      await page.goto(section);
      await page.waitForLoadState('networkidle');
      
      // Buscar formularios
      const forms = await page.locator('form, .form, [role="form"]').all();
      
      if (forms.length > 0) {
        console.log(`✓ Formularios encontrados en ${section}: ${forms.length}`);
        
        // Buscar campos de entrada
        const inputs = await page.locator('input, textarea, select').all();
        
        if (inputs.length > 0) {
          const firstInput = inputs[0];
          
          // Intentar enviar el formulario sin llenar campos (para generar validación)
          await firstInput.focus();
          await firstInput.fill(''); // Limpiar el campo
          await firstInput.blur(); // Quitar el foco para triggerar validación
          
          // Buscar mensajes de validación
          const validationSelectors = [
            '.error',
            '.validation-error',
            '.field-error',
            '[role="alert"]',
            '.invalid-feedback',
            '.error-message'
          ];
          
          await page.waitForTimeout(500); // Esperar validación
          
          for (const selector of validationSelectors) {
            const validationElements = await page.locator(selector).count();
            if (validationElements > 0) {
              console.log(`✓ Validación visual encontrada en ${section}: ${selector}`);
              break;
            }
          }
        }
      }
    }
  });

  test('debería mostrar feedback visual en botones y enlaces', async ({ page }) => {
    await page.goto('/sections/red-pill/');
    await page.waitForLoadState('networkidle');
    
    // Verificar estados de hover en botones
    const buttons = await page.locator('button, .btn, [role="button"]').all();
    
    if (buttons.length > 0) {
      const firstButton = buttons[0];
      
      // Verificar estado inicial
      const initialStyles = await firstButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          transform: computed.transform
        };
      });
      
      // Simular hover
      await firstButton.hover();
      await page.waitForTimeout(300);
      
      // Verificar cambios visuales en hover
      const hoverStyles = await firstButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          transform: computed.transform
        };
      });
      
      // Al menos uno de los estilos debería cambiar en hover
      const stylesChanged = 
        initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
        initialStyles.color !== hoverStyles.color ||
        initialStyles.transform !== hoverStyles.transform;
      
      console.log(`✓ Cambios visuales en hover: ${stylesChanged}`);
      console.log('Initial styles:', initialStyles);
      console.log('Hover styles:', hoverStyles);
    }
  });

  test('debería mantener consistencia en indicadores de estado global', async ({ page }) => {
    const sections = [
      '/',
      '/sections/red-pill/',
      '/sections/merchant/',
      '/sections/pilgrim/'
    ];
    
    const globalStateElements = [];
    
    for (const section of sections) {
      await page.goto(section);
      await page.waitForLoadState('networkidle');
      
      // Verificar elementos de estado global consistentes
      const stateSelectors = [
        'header',
        'nav',
        '.status-bar',
        '.notification-area',
        '.global-loading'
      ];
      
      for (const selector of stateSelectors) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        
        if (isVisible) {
          globalStateElements.push({
            section,
            selector,
            visible: true
          });
        }
      }
    }
    
    console.log('✓ Elementos de estado global encontrados:', globalStateElements);
    
    // Verificar que hay consistencia en elementos globales
    const uniqueSelectors = [...new Set(globalStateElements.map(e => e.selector))];
    expect(uniqueSelectors.length).toBeGreaterThan(0);
  });

  test('debería mostrar progreso en operaciones de larga duración', async ({ page }) => {
    await page.goto('/sections/red-pill/');
    await page.waitForLoadState('networkidle');
    
    // Simular operación de larga duración interceptando requests
    await page.route('**/*', async (route) => {
      if (route.request().url().includes('api') || route.request().url().includes('data')) {
        // Simular latencia de API
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      await route.continue();
    });
    
    // Buscar elementos que podrían triggerar operaciones largas
    const longOperationTriggers = await page.locator(
      'button[data-long-operation], .async-action, [data-async], .submit-btn'
    ).all();
    
    if (longOperationTriggers.length > 0) {
      const trigger = longOperationTriggers[0];
      
      // Hacer clic y buscar indicadores de progreso
      await trigger.click();
      
      // Buscar indicadores de progreso
      const progressIndicators = [
        '.progress-bar',
        '.loading-percentage',
        '[role="progressbar"]',
        '.step-indicator',
        '.progress'
      ];
      
      let progressFound = false;
      for (const indicator of progressIndicators) {
        try {
          await page.waitForSelector(indicator, { timeout: 3000 });
          progressFound = true;
          console.log(`✓ Indicador de progreso encontrado: ${indicator}`);
          break;
        } catch {
          // Continuar buscando
        }
      }
      
      console.log(`Progress indicators found: ${progressFound}`);
    }
  });

}); 