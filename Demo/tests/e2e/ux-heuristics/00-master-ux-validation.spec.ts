import { test, expect } from '@playwright/test';

/**
 * Suite Maestra de Validación UX - CoomÜnity Platform
 * 
 * Este archivo orquesta la validación completa de todas las heurísticas UX/UI
 * implementadas en el sistema CoomÜnity, proporcionando un reporte integral
 * del estado de la experiencia de usuario.
 */

test.describe('🧪 CoomÜnity - Validación Maestra UX Heuristics', () => {
  
  const sections = [
    { path: '/', name: 'Principal', priority: 'critical' },
    { path: '/marketplace', name: 'Marketplace', priority: 'high' },
    { path: '/social', name: 'Social', priority: 'high' },
    { path: '/pilgrim', name: 'Pilgrim', priority: 'medium' }
  ];

  const heuristics = [
    { id: 1, name: 'Visibilidad del Estado del Sistema', weight: 20 },
    { id: 2, name: 'Consistencia y Estándares', weight: 25 },
    { id: 3, name: 'Experiencia Adaptativa y Contextual', weight: 20 },
    { id: 4, name: 'Performance & Loading Experience', weight: 15 },
    { id: 5, name: 'Control y Libertad del Usuario', weight: 10 },
    { id: 6, name: 'Navegación Intuitiva y Jerarquía', weight: 10 }
  ];

  test('🎯 Evaluación Integral de UX Heuristics', async ({ page }) => {
    const masterReport = {
      timestamp: new Date().toISOString(),
      sections: [],
      overallScore: 0,
      heuristicScores: {},
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalIssues: [],
        recommendations: []
      }
    };

    // Evaluar cada sección
    for (const section of sections) {
      console.log(`\n🔍 Evaluando sección: ${section.name} (${section.priority})`);
      
      await page.goto(section.path);
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Esperar a que termine la carga del dashboard si estamos en la página principal
      if (section.path === '/') {
        try {
          await page.waitForSelector('[data-testid="dashboard-loading"]', { state: 'visible', timeout: 2000 });
          await page.waitForSelector('[data-testid="dashboard-loading"]', { state: 'detached', timeout: 5000 });
        } catch (error) {
          // Si no hay spinner de carga o ya terminó, continuar
          console.log('Dashboard loading spinner not found or already finished');
        }
        // Esperar explícitamente a que aparezca contenido específico de la página Home
        try {
          await page.waitForSelector('.welcome-greeting', { timeout: 3000 });
          await page.waitForSelector('.dashboard-grid', { timeout: 3000 });
          console.log('Home page content found');
          // Forzar un scroll para asegurar que el contenido esté completamente renderizado
          await page.evaluate(() => window.scrollTo(0, 100));
          await page.waitForTimeout(1000);
          await page.evaluate(() => window.scrollTo(0, 0));
        } catch (error) {
          console.log('Home page content not found within timeout');
        }
        // Esperar un poco más para asegurar que el contenido esté completamente renderizado
        await page.waitForTimeout(500);
      }

      const sectionEvaluation = await evaluateSection(page, section);
      masterReport.sections.push(sectionEvaluation);
      
      console.log(`✅ ${section.name} completado - Score: ${sectionEvaluation.overallScore.toFixed(1)}%`);
    }

    // Calcular puntuaciones generales
    masterReport.overallScore = calculateOverallScore(masterReport.sections);
    masterReport.heuristicScores = calculateHeuristicScores(masterReport.sections);
    masterReport.summary = generateSummary(masterReport.sections);

    // Generar reporte final
    generateFinalReport(masterReport);

    // Verificaciones críticas
    expect(masterReport.overallScore).toBeGreaterThan(70); // Score mínimo aceptable
    expect(masterReport.summary.criticalIssues.length).toBeLessThan(5); // Max 5 issues críticos
    
    console.log(`\n🎉 Evaluación UX completada - Score General: ${masterReport.overallScore.toFixed(1)}%`);
  });

  // Función para evaluar una sección individual
  async function evaluateSection(page: any, section: any) {
    const evaluation = {
      section: section.name,
      path: section.path,
      priority: section.priority,
      timestamp: new Date().toISOString(),
      heuristics: {},
      overallScore: 0,
      issues: [],
      strengths: []
    };

    // Heurística 1: Visibilidad del Estado del Sistema
    evaluation.heuristics['visibility'] = await evaluateVisibility(page);
    
    // Heurística 2: Consistencia y Estándares
    evaluation.heuristics['consistency'] = await evaluateConsistency(page);
    
    // Heurística 3: Experiencia Adaptativa
    evaluation.heuristics['adaptive'] = await evaluateAdaptive(page);
    
    // Heurística 4: Performance
    evaluation.heuristics['performance'] = await evaluatePerformance(page);
    
    // Heurística 5: Control del Usuario
    evaluation.heuristics['userControl'] = await evaluateUserControl(page);
    
    // Heurística 6: Navegación
    evaluation.heuristics['navigation'] = await evaluateNavigation(page);

    // Calcular score de la sección
    evaluation.overallScore = Object.values(evaluation.heuristics)
      .reduce((sum: number, h: any) => sum + h.score, 0) / Object.keys(evaluation.heuristics).length;

    // Debug logging específico para Marketplace
    if (section.name === 'Marketplace') {
      console.log('\n🔍 DEBUG MARKETPLACE SECTION:');
      Object.entries(evaluation.heuristics).forEach(([key, heuristic]: [string, any]) => {
        console.log(`📊 ${heuristic.heuristic}: ${heuristic.score}%`);
        heuristic.tests.forEach((test: any) => {
          const status = test.passed ? '✅' : '❌';
          console.log(`  ${status} ${test.name}: ${test.details}`);
        });
      });
      console.log(`📈 Marketplace Overall Score: ${evaluation.overallScore.toFixed(1)}%\n`);
    }

    return evaluation;
  }

  // Evaluación de Visibilidad del Estado del Sistema
  async function evaluateVisibility(page: any) {
    const tests = [];
    let score = 0;

    try {
      // Test 1: Indicadores de carga
      const loadingIndicators = await page.locator('.loading, .spinner, .loader, [data-loading]').count();
      const hasLoadingFeedback = loadingIndicators > 0;
      tests.push({
        name: 'Indicadores de carga',
        passed: hasLoadingFeedback,
        details: `Encontrados ${loadingIndicators} indicadores`
      });
      if (hasLoadingFeedback) score += 25;

      // Test 2: Feedback en interacciones
      const interactiveElements = await page.locator('button, a, [role="button"]').count();
      const hasInteractiveFeedback = interactiveElements > 0;
      tests.push({
        name: 'Elementos interactivos',
        passed: hasInteractiveFeedback,
        details: `${interactiveElements} elementos interactivos encontrados`
      });
      if (hasInteractiveFeedback) score += 25;

      // Test 3: Mensajes de estado
      const statusElements = await page.locator('.status, .message, .alert, [role="alert"]').count();
      tests.push({
        name: 'Mensajes de estado',
        passed: statusElements > 0,
        details: `${statusElements} elementos de estado`
      });
      if (statusElements > 0) score += 25;

      // Test 4: Estados visuales
      const visualStates = await page.evaluate(() => {
        // Buscar elementos interactivos específicos primero
        const interactiveSelectors = [
          'button',
          'a',
          '[role="button"]',
          '.MuiButton-root',
          '.MuiIconButton-root',
          '.MuiFab-root',
          'input[type="button"]',
          'input[type="submit"]'
        ];
        
        let hasHover = 0;
        
        // Buscar elementos interactivos específicos
        for (const selector of interactiveSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const styles = window.getComputedStyle(el);
            if (styles.cursor === 'pointer') {
              hasHover++;
              break; // Solo necesitamos encontrar uno
            }
          }
          if (hasHover > 0) break;
        }
        
        // Si no encontramos elementos interactivos específicos, buscar en el body
        if (hasHover === 0) {
          const body = document.body;
          if (body) {
            const bodyElements = body.querySelectorAll('*');
            for (let i = 0; i < Math.min(bodyElements.length, 50); i++) {
              const el = bodyElements[i];
              const styles = window.getComputedStyle(el);
              if (styles.cursor === 'pointer') {
                hasHover++;
                break;
              }
            }
          }
        }
        
        return { hasHover: hasHover > 0 };
      });
      tests.push({
        name: 'Estados visuales',
        passed: visualStates.hasHover,
        details: 'Cursor pointer detectado en elementos'
      });
      if (visualStates.hasHover) score += 25;

    } catch (error) {
      console.error('Error evaluating visibility:', error);
    }

    return {
      heuristic: 'Visibilidad del Estado del Sistema',
      score,
      tests,
      maxScore: 100
    };
  }

  // Evaluación de Consistencia y Estándares
  async function evaluateConsistency(page: any) {
    const tests = [];
    let score = 0;

    try {
      // Test 1: Elementos de navegación consistentes
      const navElements = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, .navigation');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        return {
          hasNav: !!nav,
          hasHeader: !!header,
          hasFooter: !!footer,
          navClasses: nav ? Array.from(nav.classList) : [],
          headerClasses: header ? Array.from(header.classList) : []
        };
      });

      tests.push({
        name: 'Estructura de navegación',
        passed: navElements.hasNav || navElements.hasHeader,
        details: `Nav: ${navElements.hasNav}, Header: ${navElements.hasHeader}, Footer: ${navElements.hasFooter}`
      });
      if (navElements.hasNav || navElements.hasHeader) score += 30;

      // Test 2: Consistencia tipográfica
      const typography = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        const p = document.querySelector('p');
        
        const getFont = (el: Element | null) => {
          if (!el) return null;
          const styles = window.getComputedStyle(el);
          return {
            family: styles.fontFamily,
            size: styles.fontSize,
            weight: styles.fontWeight
          };
        };

        return {
          h1Font: getFont(h1),
          h2Font: getFont(h2),
          pFont: getFont(p)
        };
      });

      const hasConsistentFonts = typography.h1Font && typography.pFont && 
        typography.h1Font.family === typography.pFont.family;
      
      tests.push({
        name: 'Consistencia tipográfica',
        passed: hasConsistentFonts,
        details: 'Familias de fuente consistentes entre elementos'
      });
      if (hasConsistentFonts) score += 35;

      // Test 3: Patrones de botones
      const buttonConsistency = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        if (buttons.length === 0) return { consistent: false, count: 0 };

        const firstButton = buttons[0];
        const firstStyles = window.getComputedStyle(firstButton);
        const borderRadius = firstStyles.borderRadius;
        const padding = firstStyles.padding;

        let consistent = true;
        for (let i = 1; i < Math.min(buttons.length, 5); i++) {
          const styles = window.getComputedStyle(buttons[i]);
          if (styles.borderRadius !== borderRadius) {
            consistent = false;
            break;
          }
        }

        return { consistent, count: buttons.length, borderRadius, padding };
      });

      tests.push({
        name: 'Consistencia de botones',
        passed: buttonConsistency.consistent,
        details: `${buttonConsistency.count} botones, border-radius consistente: ${buttonConsistency.consistent}`
      });
      if (buttonConsistency.consistent) score += 35;

    } catch (error) {
      console.error('Error evaluating consistency:', error);
    }

    return {
      heuristic: 'Consistencia y Estándares',
      score,
      tests,
      maxScore: 100
    };
  }

  // Evaluación de Experiencia Adaptativa
  async function evaluateAdaptive(page: any) {
    const tests = [];
    let score = 0;

    try {
      // Test 1: Responsividad básica
      const originalViewport = page.viewportSize();
      
      // Probar en móvil
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const mobileLayout = await page.evaluate(() => {
        const body = document.body;
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        return {
          bodyWidth: body.offsetWidth,
          hasHorizontalScroll,
          viewportWidth: window.innerWidth
        };
      });

      const isResponsive = !mobileLayout.hasHorizontalScroll && mobileLayout.bodyWidth <= 375;
      
      tests.push({
        name: 'Diseño responsivo',
        passed: isResponsive,
        details: `Ancho: ${mobileLayout.bodyWidth}px, Scroll horizontal: ${mobileLayout.hasHorizontalScroll}`
      });
      if (isResponsive) score += 40;

      // Restaurar viewport original
      if (originalViewport) {
        await page.setViewportSize(originalViewport);
        await page.waitForTimeout(500);
      }

      // Test 2: Navegación móvil
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileNav = await page.evaluate(() => {
        const hamburger = document.querySelector('.hamburger, .menu-toggle, .mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu, .sidebar');
        
        return {
          hasHamburger: !!hamburger,
          hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
          hasMobileMenu: !!mobileMenu
        };
      });

      tests.push({
        name: 'Navegación móvil',
        passed: mobileNav.hasHamburger || mobileNav.hasMobileMenu,
        details: `Hamburger: ${mobileNav.hasHamburger}, Menú móvil: ${mobileNav.hasMobileMenu}`
      });
      if (mobileNav.hasHamburger || mobileNav.hasMobileMenu) score += 30;

      // Test 3: Elementos contextuales
      const contextualElements = await page.locator(
        '.mobile-only, .desktop-only, .hidden-mobile, .hidden-desktop, [data-responsive]'
      ).count();
      
      tests.push({
        name: 'Elementos contextuales',
        passed: contextualElements > 0,
        details: `${contextualElements} elementos con clases responsive`
      });
      if (contextualElements > 0) score += 30;

      // Restaurar viewport
      if (originalViewport) {
        await page.setViewportSize(originalViewport);
      }

    } catch (error) {
      console.error('Error evaluating adaptive:', error);
    }

    return {
      heuristic: 'Experiencia Adaptativa y Contextual',
      score,
      tests,
      maxScore: 100
    };
  }

  // Evaluación de Performance
  async function evaluatePerformance(page: any) {
    const tests = [];
    let score = 0;

    try {
      const startTime = Date.now();
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      const domLoadTime = Date.now() - startTime;

      await page.waitForLoadState('networkidle');
      const fullLoadTime = Date.now() - startTime;

      // Test 1: Tiempo de carga DOM
      const domLoadAcceptable = domLoadTime < 3000;
      tests.push({
        name: 'Tiempo de carga DOM',
        passed: domLoadAcceptable,
        details: `${domLoadTime}ms (target: <3000ms)`
      });
      if (domLoadAcceptable) score += 40;

      // Test 2: Tiempo de carga completa
      const fullLoadAcceptable = fullLoadTime < 5000;
      tests.push({
        name: 'Tiempo de carga completa',
        passed: fullLoadAcceptable,
        details: `${fullLoadTime}ms (target: <5000ms)`
      });
      if (fullLoadAcceptable) score += 30;

      // Test 3: Recursos optimizados
      const resourceMetrics = await page.evaluate(() => {
        const perfEntries = performance.getEntriesByType('resource');
        const totalSize = perfEntries.reduce((sum, entry: any) => sum + (entry.transferSize || 0), 0);
        const largeResources = perfEntries.filter((entry: any) => (entry.transferSize || 0) > 500000);
        
        return {
          totalRequests: perfEntries.length,
          totalSize: totalSize,
          largeResources: largeResources.length
        };
      });

      const resourcesOptimized = resourceMetrics.largeResources < 3;
      tests.push({
        name: 'Optimización de recursos',
        passed: resourcesOptimized,
        details: `${resourceMetrics.largeResources} recursos >500KB, Total: ${(resourceMetrics.totalSize / 1024).toFixed(2)}KB`
      });
      if (resourcesOptimized) score += 30;

    } catch (error) {
      console.error('Error evaluating performance:', error);
    }

    return {
      heuristic: 'Performance & Loading Experience',
      score,
      tests,
      maxScore: 100
    };
  }

  // Evaluación de Control del Usuario
  async function evaluateUserControl(page: any) {
    const tests = [];
    let score = 0;

    try {
      // Test 1: Elementos interactivos
      const interactiveCount = await page.locator('button, a, input, select, textarea, [tabindex], [role="button"]').count();
      const hasInteractiveElements = interactiveCount > 0;
      
      tests.push({
        name: 'Elementos interactivos',
        passed: hasInteractiveElements,
        details: `${interactiveCount} elementos interactivos`
      });
      if (hasInteractiveElements) score += 50;

      // Test 2: Accesibilidad básica
      const accessibilityFeatures = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let withAriaLabel = 0;
        let withTitle = 0;
        let withTabIndex = 0;

        interactiveElements.forEach(el => {
          if (el.hasAttribute('aria-label')) withAriaLabel++;
          if (el.hasAttribute('title')) withTitle++;
          if (el.hasAttribute('tabindex')) withTabIndex++;
        });

        return {
          total: interactiveElements.length,
          withAriaLabel,
          withTitle,
          withTabIndex
        };
      });

      const accessibilityRatio = accessibilityFeatures.total > 0 ? 
        (accessibilityFeatures.withAriaLabel + accessibilityFeatures.withTitle) / accessibilityFeatures.total : 0;

      tests.push({
        name: 'Características de accesibilidad',
        passed: accessibilityRatio > 0.3,
        details: `${(accessibilityRatio * 100).toFixed(1)}% elementos con labels/titles`
      });
      if (accessibilityRatio > 0.3) score += 50;

    } catch (error) {
      console.error('Error evaluating user control:', error);
    }

    return {
      heuristic: 'Control y Libertad del Usuario',
      score,
      tests,
      maxScore: 100
    };
  }

  // Evaluación de Navegación
  async function evaluateNavigation(page: any) {
    const tests = [];
    let score = 0;

    try {
      // Test 1: Estructura de navegación
      const navStructure = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navigation, .navbar');
        const breadcrumbs = document.querySelector('.breadcrumb, .breadcrumbs');
        const menuItems = document.querySelectorAll('nav a, .nav-link, .menu-item a');
        
        return {
          hasNav: !!nav,
          hasBreadcrumbs: !!breadcrumbs,
          menuItemsCount: menuItems.length,
          navText: nav ? nav.textContent?.trim().length || 0 : 0
        };
      });

      tests.push({
        name: 'Estructura de navegación',
        passed: navStructure.hasNav && navStructure.menuItemsCount > 0,
        details: `Nav presente: ${navStructure.hasNav}, Enlaces: ${navStructure.menuItemsCount}`
      });
      if (navStructure.hasNav && navStructure.menuItemsCount > 0) score += 60;

      // Test 2: Jerarquía visual
      const visualHierarchy = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const h1Count = document.querySelectorAll('h1').length;
        
        // Debugging adicional: buscar elementos con component="h1"
        const componentH1s = document.querySelectorAll('[component="h1"]');
        
        const fontSizes = Array.from(headings).map(h => {
          const size = parseFloat(window.getComputedStyle(h).fontSize);
          return { tag: h.tagName, size };
        });

        // Debug info para identificar el problema
        const currentURL = window.location.pathname;
        const headingDetails = Array.from(headings).map(h => ({
          tag: h.tagName,
          text: h.textContent?.trim().substring(0, 50) || '',
          component: h.getAttribute('component') || 'none',
          visible: h.offsetHeight > 0 && h.offsetWidth > 0
        }));
        
        const componentH1Details = Array.from(componentH1s).map(h => ({
          tag: h.tagName,
          text: h.textContent?.trim().substring(0, 50) || '',
          component: h.getAttribute('component') || 'none',
          visible: h.offsetHeight > 0 && h.offsetWidth > 0
        }));

        return {
          totalHeadings: headings.length,
          h1Count,
          componentH1Count: componentH1s.length,
          fontSizes,
          hasProperHierarchy: h1Count === 1 && headings.length > 1,
          debug: {
            currentURL,
            headingDetails,
            componentH1Details,
            bodyHTML: document.body.innerHTML.length
          }
        };
      });

      const debugInfo = `URL: ${visualHierarchy.debug.currentURL}, Headings: ${JSON.stringify(visualHierarchy.debug.headingDetails)}, ComponentH1s: ${JSON.stringify(visualHierarchy.debug.componentH1Details)}, BodyLength: ${visualHierarchy.debug.bodyHTML}`;

      tests.push({
        name: 'Jerarquía visual',
        passed: visualHierarchy.hasProperHierarchy,
        details: `${visualHierarchy.totalHeadings} headings, ${visualHierarchy.h1Count} H1, ${visualHierarchy.componentH1Count} componentH1. ${debugInfo}`
      });
      if (visualHierarchy.hasProperHierarchy) score += 40;

    } catch (error) {
      console.error('Error evaluating navigation:', error);
    }

    return {
      heuristic: 'Navegación Intuitiva y Jerarquía',
      score,
      tests,
      maxScore: 100
    };
  }

  // Funciones auxiliares para cálculos y reportes
  function calculateOverallScore(sections: any[]) {
    const totalScore = sections.reduce((sum, section) => sum + section.overallScore, 0);
    return sections.length > 0 ? totalScore / sections.length : 0;
  }

  function calculateHeuristicScores(sections: any[]) {
    const heuristicScores: any = {};
    const heuristicNames = ['visibility', 'consistency', 'adaptive', 'performance', 'userControl', 'navigation'];
    
    heuristicNames.forEach(heuristic => {
      const scores = sections.map(section => section.heuristics[heuristic]?.score || 0);
      heuristicScores[heuristic] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });
    
    return heuristicScores;
  }

  function generateSummary(sections: any[]) {
    let totalTests = 0;
    let passedTests = 0;
    const criticalIssues: string[] = [];
    const recommendations: string[] = [];

    sections.forEach(section => {
      Object.values(section.heuristics).forEach((heuristic: any) => {
        heuristic.tests.forEach((test: any) => {
          totalTests++;
          if (test.passed) passedTests++;
          else if (section.priority === 'critical') {
            criticalIssues.push(`${section.name}: ${test.name} - ${test.details}`);
          }
        });
      });
    });

    // Generar recomendaciones basadas en scores bajos
    sections.forEach(section => {
      Object.entries(section.heuristics).forEach(([key, heuristic]: [string, any]) => {
        if (heuristic.score < 70) {
          recommendations.push(`Mejorar ${heuristic.heuristic} en sección ${section.name} (Score: ${heuristic.score}%)`);
        }
      });
    });

    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      criticalIssues,
      recommendations
    };
  }

  function generateFinalReport(report: any) {
    console.log('\n' + '='.repeat(80));
    console.log('🏆 REPORTE FINAL - VALIDACIÓN UX HEURISTICS COOMUNITY');
    console.log('='.repeat(80));
    console.log(`⏰ Timestamp: ${report.timestamp}`);
    console.log(`📊 Score General: ${report.overallScore.toFixed(1)}%`);
    console.log(`✅ Tests Pasados: ${report.summary.passedTests}/${report.summary.totalTests}`);
    console.log(`❌ Tests Fallidos: ${report.summary.failedTests}`);
    console.log(`🚨 Issues Críticos: ${report.summary.criticalIssues.length}`);
    
    console.log('\n📈 SCORES POR HEURÍSTICA:');
    Object.entries(report.heuristicScores).forEach(([key, score]: [string, any]) => {
      const emoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
      console.log(`${emoji} ${key}: ${score.toFixed(1)}%`);
    });

    console.log('\n📋 SCORES POR SECCIÓN:');
    report.sections.forEach((section: any) => {
      const emoji = section.overallScore >= 80 ? '🟢' : section.overallScore >= 60 ? '🟡' : '🔴';
      console.log(`${emoji} ${section.name} (${section.priority}): ${section.overallScore.toFixed(1)}%`);
    });

    if (report.summary.criticalIssues.length > 0) {
      console.log('\n🚨 ISSUES CRÍTICOS:');
      report.summary.criticalIssues.forEach((issue: string, index: number) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    if (report.summary.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      report.summary.recommendations.slice(0, 5).forEach((rec: string, index: number) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log('\n' + '='.repeat(80));
  }

}); 