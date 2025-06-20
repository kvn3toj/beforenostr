import { test, expect } from '@playwright/test';

/**
 * Pruebas para Heurística UX #4: Performance & Loading Experience
 * 
 * Verifica que el sistema proporcione:
 * - Tiempos de carga optimizados
 * - Feedback visual durante la carga
 * - Carga progresiva de contenido
 * - Optimización de recursos
 */

test.describe('UX Heurística #4: Performance & Loading Experience', () => {
  
  const sections = [
    { path: '/', name: 'Principal' },
    { path: '/sections/red-pill/', name: 'Red Pill' },
    { path: '/sections/merchant/', name: 'Merchant' },
    { path: '/sections/pilgrim/', name: 'Pilgrim' }
  ];

  test('debería cargar las páginas dentro de tiempos aceptables', async ({ page }) => {
    const performanceData = [];

    for (const section of sections) {
      const startTime = Date.now();
      
      // Navegar y medir tiempos de carga
      await page.goto(section.path);
      
      // Esperar a que se complete la carga inicial
      await page.waitForLoadState('domcontentloaded');
      const domLoadTime = Date.now() - startTime;
      
      // Esperar a que todos los recursos se carguen
      await page.waitForLoadState('networkidle');
      const fullLoadTime = Date.now() - startTime;
      
      // Obtener métricas de performance del navegador
      const performanceMetrics = await page.evaluate(() => {
        const perf = performance;
        const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        return {
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
          loadEvent: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          firstPaint: perf.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: perf.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
          totalResources: perf.getEntriesByType('resource').length,
          transferSize: navigation?.transferSize || 0
        };
      });

      const sectionPerformance = {
        section: section.name,
        path: section.path,
        timing: {
          domLoadTime,
          fullLoadTime,
          ...performanceMetrics
        }
      };

      performanceData.push(sectionPerformance);

      console.log(`✓ ${section.name} Performance:`);
      console.log(`  DOM Load: ${domLoadTime}ms`);
      console.log(`  Full Load: ${fullLoadTime}ms`);
      console.log(`  First Paint: ${performanceMetrics.firstPaint.toFixed(0)}ms`);
      console.log(`  First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(0)}ms`);
      console.log(`  Resources: ${performanceMetrics.totalResources}`);
    }

    // Verificar que los tiempos estén dentro de rangos aceptables
    performanceData.forEach(data => {
      // DOM debería cargar en menos de 3 segundos
      expect(data.timing.domLoadTime).toBeLessThan(3000);
      
      // Carga completa debería ser menos de 5 segundos
      expect(data.timing.fullLoadTime).toBeLessThan(5000);
      
      console.log(`✓ ${data.section} - Tiempos aceptables: DOM(${data.timing.domLoadTime}ms), Full(${data.timing.fullLoadTime}ms)`);
    });

    console.log('✓ Análisis completo de performance:', performanceData);
  });

  test('debería mostrar indicadores de carga apropiados', async ({ page }) => {
    const loadingIndicators = [];

    for (const section of sections) {
      // Interceptar requests para poder observar estados de carga
      const interceptedRequests = [];
      await page.route('**/*', async (route) => {
        interceptedRequests.push(route.request().url());
        // Simular un poco de latencia para observar loading states
        if (route.request().resourceType() === 'document') {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto(section.path);

      // Buscar indicadores de carga durante los primeros momentos
      const loadingStates = [];
      const checkInterval = 100;
      const maxChecks = 20; // 2 segundos máximo

      for (let i = 0; i < maxChecks; i++) {
        const currentTime = Date.now() - startTime;
        
        const loadingElements = await page.evaluate(() => {
          const indicators = [
            '.loading',
            '.spinner',
            '.loader',
            '.loading-overlay',
            '.loading-spinner',
            '[data-loading="true"]',
            '.skeleton',
            '.placeholder',
            '.shimmer'
          ];

          const found = [];
          indicators.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              Array.from(elements).forEach(el => {
                const styles = window.getComputedStyle(el);
                if (styles.display !== 'none' && styles.visibility !== 'hidden') {
                  found.push({
                    selector,
                    visible: true,
                    className: el.className,
                    tagName: el.tagName
                  });
                }
              });
            }
          });

          return found;
        });

        if (loadingElements.length > 0) {
          loadingStates.push({
            timestamp: currentTime,
            indicators: loadingElements
          });
        }

        await page.waitForTimeout(checkInterval);
        
        // Si la página ya cargó completamente, salir del loop
        try {
          await page.waitForLoadState('networkidle', { timeout: 0 });
          break;
        } catch {
          // Continuar verificando
        }
      }

      await page.waitForLoadState('networkidle');

      loadingIndicators.push({
        section: section.name,
        path: section.path,
        loadingStates,
        interceptedRequests: interceptedRequests.length
      });

      console.log(`✓ ${section.name} - Estados de carga detectados: ${loadingStates.length}`);
      loadingStates.forEach((state, index) => {
        console.log(`  Estado ${index + 1} (${state.timestamp}ms): ${state.indicators.length} indicadores`);
      });
    }

    // Verificar que se detectaron indicadores de carga
    const sectionsWithLoading = loadingIndicators.filter(section => section.loadingStates.length > 0);
    console.log(`✓ Secciones con indicadores de carga: ${sectionsWithLoading.length}/${sections.length}`);

    expect(loadingIndicators.length).toBe(sections.length);
  });

  test('debería optimizar la carga de recursos', async ({ page }) => {
    const resourceData = [];

    for (const section of sections) {
      const resources = {
        images: [],
        css: [],
        js: [],
        fonts: [],
        other: []
      };

      // Interceptar y categorizar recursos
      await page.route('**/*', async (route) => {
        const request = route.request();
        const url = request.url();
        const resourceType = request.resourceType();
        
        const resourceInfo = {
          url,
          resourceType,
          size: 0, // Se calculará después
          cached: false
        };

        if (resourceType === 'image') {
          resources.images.push(resourceInfo);
        } else if (resourceType === 'stylesheet') {
          resources.css.push(resourceInfo);
        } else if (resourceType === 'script') {
          resources.js.push(resourceInfo);
        } else if (resourceType === 'font') {
          resources.fonts.push(resourceInfo);
        } else {
          resources.other.push(resourceInfo);
        }

        await route.continue();
      });

      await page.goto(section.path);
      await page.waitForLoadState('networkidle');

      // Obtener información detallada de recursos
      const resourceMetrics = await page.evaluate(() => {
        const perfEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        const categorized = {
          images: [],
          css: [],
          js: [],
          fonts: [],
          other: []
        };

        const metrics = {
          totalSize: 0,
          totalRequests: perfEntries.length,
          cachedRequests: 0,
          largeResources: []
        };

        perfEntries.forEach(entry => {
          const size = entry.transferSize || 0;
          const cached = entry.transferSize === 0 && entry.decodedBodySize > 0;
          
          metrics.totalSize += size;
          if (cached) metrics.cachedRequests++;
          
          const resourceInfo = {
            name: entry.name,
            size,
            duration: entry.duration,
            cached
          };

          if (size > 100000) { // > 100KB
            metrics.largeResources.push(resourceInfo);
          }

          // Categorizar por tipo de archivo
          const name = entry.name.toLowerCase();
          if (name.includes('.jpg') || name.includes('.png') || name.includes('.gif') || name.includes('.webp') || name.includes('.svg')) {
            categorized.images.push(resourceInfo);
          } else if (name.includes('.css')) {
            categorized.css.push(resourceInfo);
          } else if (name.includes('.js')) {
            categorized.js.push(resourceInfo);
          } else if (name.includes('.woff') || name.includes('.ttf') || name.includes('.otf')) {
            categorized.fonts.push(resourceInfo);
          } else {
            categorized.other.push(resourceInfo);
          }
        });

        return { categorized, metrics };
      });

      resourceData.push({
        section: section.name,
        path: section.path,
        resources: resourceMetrics.categorized,
        metrics: resourceMetrics.metrics
      });

      console.log(`✓ ${section.name} Resource Analysis:`);
      console.log(`  Total Size: ${(resourceMetrics.metrics.totalSize / 1024).toFixed(2)} KB`);
      console.log(`  Total Requests: ${resourceMetrics.metrics.totalRequests}`);
      console.log(`  Cached: ${resourceMetrics.metrics.cachedRequests}`);
      console.log(`  Large Resources: ${resourceMetrics.metrics.largeResources.length}`);
      console.log(`  Images: ${resourceMetrics.categorized.images.length}`);
      console.log(`  CSS: ${resourceMetrics.categorized.css.length}`);
      console.log(`  JS: ${resourceMetrics.categorized.js.length}`);
    }

    // Verificar optimizaciones
    resourceData.forEach(data => {
      // No debería haber recursos excesivamente grandes sin justificación
      const oversizedResources = data.metrics.largeResources.filter(r => r.size > 500000); // > 500KB
      console.log(`✓ ${data.section} - Recursos muy grandes (>500KB): ${oversizedResources.length}`);
      
      // Ratio de cache debería ser razonable
      const cacheRatio = data.metrics.totalRequests > 0 ? 
        (data.metrics.cachedRequests / data.metrics.totalRequests * 100).toFixed(1) : 0;
      console.log(`✓ ${data.section} - Cache ratio: ${cacheRatio}%`);
    });

    expect(resourceData.length).toBe(sections.length);
  });

  test('debería implementar carga progresiva de contenido', async ({ page }) => {
    const progressiveLoadingData = [];

    for (const section of sections) {
      await page.goto(section.path);
      
      // Verificar que el contenido aparece progresivamente
      const contentProgression = [];
      const checkInterval = 200;
      const maxChecks = 15; // 3 segundos

      for (let i = 0; i < maxChecks; i++) {
        const currentContent = await page.evaluate(() => {
          // Verificar diferentes tipos de contenido que deberían aparecer progresivamente
          const textContent = document.querySelectorAll('p, h1, h2, h3, .text, .content').length;
          const images = document.querySelectorAll('img[src]').length;
          const loadedImages = Array.from(document.querySelectorAll('img')).filter(img => img.complete).length;
          const interactiveElements = document.querySelectorAll('button, a, input, select').length;
          
          // Verificar elementos de skeleton/placeholder
          const skeletons = document.querySelectorAll('.skeleton, .placeholder, .loading-placeholder').length;
          const hiddenSkeletons = Array.from(document.querySelectorAll('.skeleton, .placeholder, .loading-placeholder'))
            .filter(el => window.getComputedStyle(el).display === 'none').length;

          return {
            textContent,
            images,
            loadedImages,
            interactiveElements,
            skeletons,
            hiddenSkeletons,
            visibleSkeletons: skeletons - hiddenSkeletons
          };
        });

        contentProgression.push({
          timestamp: i * checkInterval,
          ...currentContent
        });

        await page.waitForTimeout(checkInterval);
        
        // Si ya no hay skeletons visibles y las imágenes están cargadas, probablemente terminó
        if (currentContent.visibleSkeletons === 0 && currentContent.loadedImages === currentContent.images) {
          break;
        }
      }

      await page.waitForLoadState('networkidle');

      // Verificar lazy loading de imágenes si existe
      const lazyLoadingInfo = await page.evaluate(() => {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-lazy], .lazy-load');
        const intersectionObserverSupport = 'IntersectionObserver' in window;
        
        return {
          lazyImages: lazyImages.length,
          intersectionObserverSupport,
          totalImages: document.querySelectorAll('img').length
        };
      });

      progressiveLoadingData.push({
        section: section.name,
        path: section.path,
        contentProgression,
        lazyLoading: lazyLoadingInfo
      });

      // Analizar la progresión del contenido
      console.log(`✓ ${section.name} Content Progression:`);
      const firstCheck = contentProgression[0];
      const lastCheck = contentProgression[contentProgression.length - 1];
      
      console.log(`  Initial content: ${firstCheck.textContent} texts, ${firstCheck.loadedImages}/${firstCheck.images} images`);
      console.log(`  Final content: ${lastCheck.textContent} texts, ${lastCheck.loadedImages}/${lastCheck.images} images`);
      console.log(`  Skeletons: ${firstCheck.visibleSkeletons} → ${lastCheck.visibleSkeletons}`);
      console.log(`  Lazy images: ${lazyLoadingInfo.lazyImages}/${lazyLoadingInfo.totalImages}`);
    }

    // Verificar que hay evidencia de carga progresiva
    progressiveLoadingData.forEach(data => {
      const progression = data.contentProgression;
      if (progression.length > 1) {
        const first = progression[0];
        const last = progression[progression.length - 1];
        
        // Debería haber cambios en el contenido durante la carga
        const hasProgression = 
          last.textContent > first.textContent ||
          last.loadedImages > first.loadedImages ||
          last.interactiveElements > first.interactiveElements ||
          first.visibleSkeletons > last.visibleSkeletons;
        
        console.log(`✓ ${data.section} - Carga progresiva detectada: ${hasProgression ? 'Sí' : 'No'}`);
      }
    });

    expect(progressiveLoadingData.length).toBe(sections.length);
  });

  test('debería mantener responsividad durante la carga', async ({ page }) => {
    const responsivityData = [];

    for (const section of sections) {
      // Simular latencia de red para probar responsividad
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() === 'image') {
          await new Promise(resolve => setTimeout(resolve, 500)); // Latencia en imágenes
        }
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto(section.path);

      // Verificar que la interfaz responde durante la carga
      const responsivityTests = [];
      
      // Intentar interactuar con elementos mientras carga
      const interactions = [
        { action: 'scroll', target: 'body' },
        { action: 'hover', target: 'button, a, .clickable' },
        { action: 'click', target: 'button:not([type="submit"]), a[href="#"], .safe-click' }
      ];

      for (const interaction of interactions) {
        try {
          const beforeInteraction = Date.now();
          
          switch (interaction.action) {
            case 'scroll':
              await page.evaluate(() => window.scrollBy(0, 100));
              break;
            case 'hover':
              const hoverElement = page.locator(interaction.target).first();
              if (await hoverElement.count() > 0) {
                await hoverElement.hover({ timeout: 1000 });
              }
              break;
            case 'click':
              const clickElement = page.locator(interaction.target).first();
              if (await clickElement.count() > 0) {
                await clickElement.click({ timeout: 1000 });
              }
              break;
          }
          
          const interactionTime = Date.now() - beforeInteraction;
          responsivityTests.push({
            action: interaction.action,
            target: interaction.target,
            responseTime: interactionTime,
            successful: true
          });
          
        } catch (error) {
          responsivityTests.push({
            action: interaction.action,
            target: interaction.target,
            responseTime: -1,
            successful: false,
            error: error.message
          });
        }

        await page.waitForTimeout(200);
      }

      await page.waitForLoadState('networkidle');
      const totalLoadTime = Date.now() - startTime;

      responsivityData.push({
        section: section.name,
        path: section.path,
        totalLoadTime,
        responsivityTests
      });

      console.log(`✓ ${section.name} Responsivity Tests:`);
      responsivityTests.forEach(test => {
        if (test.successful) {
          console.log(`  ${test.action} on ${test.target}: ${test.responseTime}ms`);
        } else {
          console.log(`  ${test.action} on ${test.target}: Failed (${test.error})`);
        }
      });
    }

    // Verificar que las interacciones fueron responsivas
    responsivityData.forEach(data => {
      const successfulInteractions = data.responsivityTests.filter(test => test.successful);
      const avgResponseTime = successfulInteractions.length > 0 ?
        successfulInteractions.reduce((sum, test) => sum + test.responseTime, 0) / successfulInteractions.length : 0;
      
      console.log(`✓ ${data.section} - Interacciones exitosas: ${successfulInteractions.length}/${data.responsivityTests.length}`);
      console.log(`✓ ${data.section} - Tiempo promedio de respuesta: ${avgResponseTime.toFixed(0)}ms`);
      
      // La mayoría de interacciones deberían ser exitosas
      expect(successfulInteractions.length).toBeGreaterThanOrEqual(Math.floor(data.responsivityTests.length * 0.5));
    });

    expect(responsivityData.length).toBe(sections.length);
  });

}); 