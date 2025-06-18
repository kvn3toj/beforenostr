const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * 🧪 FASE 3.4 - TESTING DE ACCESIBILIDAD CON LECTORES DE PANTALLA
 * 
 * Este script automatiza la validación de compatibilidad con lectores de pantalla
 * del Gamifier Admin Frontend, verificando elementos críticos para tecnologías asistivas.
 */

async function testScreenReaderCompatibility() {
  console.log('🎯 Iniciando Testing de Compatibilidad con Lectores de Pantalla...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    args: ['--force-prefers-reduced-motion'] // Simular preferencias de accesibilidad
  });
  
  const context = await browser.newContext({
    // Simular configuraciones de accesibilidad
    reducedMotion: 'reduce',
    forcedColors: 'none'
  });
  
  const page = await context.newPage();
  
  // Configurar listeners para capturar información de accesibilidad
  const accessibilityIssues = [];
  const ariaAnnouncements = [];
  
  // Capturar errores de consola relacionados con accesibilidad
  page.on('console', msg => {
    if (msg.text().includes('aria') || msg.text().includes('accessibility')) {
      console.log('🔊 Accessibility Console:', msg.text());
      ariaAnnouncements.push(msg.text());
    }
  });

  const results = {
    loginFlow: {},
    navigation: {},
    userManagement: {},
    formInteractions: {},
    tableNavigation: {},
    modalInteractions: {},
    liveRegions: {},
    keyboardNavigation: {},
    ariaImplementation: {},
    screenReaderOptimization: {}
  };

  try {
    console.log('📋 FASE 1: TESTING DE FLUJO DE LOGIN\n');
    
    // 1. TESTING DE FLUJO DE LOGIN
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    console.log('🔍 Verificando estructura semántica de login...');
    
    // Verificar landmarks y estructura semántica
    const loginLandmarks = await page.evaluate(() => {
      const landmarks = [];
      
      // Verificar main landmark
      const main = document.querySelector('main, [role="main"]');
      if (main) landmarks.push({ type: 'main', found: true });
      
      // Verificar form landmark
      const form = document.querySelector('form, [role="form"]');
      if (form) landmarks.push({ type: 'form', found: true });
      
      // Verificar heading structure
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({ tag: h.tagName, text: h.textContent.trim() }));
      
      return { landmarks, headings };
    });
    
    results.loginFlow.landmarks = loginLandmarks;
    console.log('✅ Landmarks encontrados:', loginLandmarks.landmarks.length);
    
    // Verificar campos de formulario y sus labels
    const formAccessibility = await page.evaluate(() => {
      const fields = [];
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const field = {
          type: input.type || input.tagName.toLowerCase(),
          id: input.id,
          hasLabel: false,
          labelText: '',
          hasAriaLabel: !!input.getAttribute('aria-label'),
          ariaLabelText: input.getAttribute('aria-label'),
          hasAriaDescribedby: !!input.getAttribute('aria-describedby'),
          ariaDescribedby: input.getAttribute('aria-describedby'),
          required: input.required,
          hasAriaRequired: input.getAttribute('aria-required') === 'true'
        };
        
        // Buscar label asociado
        if (input.id) {
          const label = document.querySelector(`label[for="${input.id}"]`);
          if (label) {
            field.hasLabel = true;
            field.labelText = label.textContent.trim();
          }
        }
        
        // Buscar label padre
        const parentLabel = input.closest('label');
        if (parentLabel && !field.hasLabel) {
          field.hasLabel = true;
          field.labelText = parentLabel.textContent.trim();
        }
        
        fields.push(field);
      });
      
      return fields;
    });
    
    results.loginFlow.formFields = formAccessibility;
    console.log('✅ Campos de formulario analizados:', formAccessibility.length);
    
    // Verificar botones y sus aria-labels
    const buttonAccessibility = await page.evaluate(() => {
      const buttons = [];
      const buttonElements = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
      
      buttonElements.forEach(btn => {
        const button = {
          text: btn.textContent.trim(),
          type: btn.type || 'button',
          hasAriaLabel: !!btn.getAttribute('aria-label'),
          ariaLabel: btn.getAttribute('aria-label'),
          hasAriaDescribedby: !!btn.getAttribute('aria-describedby'),
          disabled: btn.disabled,
          hasAriaDisabled: btn.getAttribute('aria-disabled') === 'true',
          role: btn.getAttribute('role'),
          tabIndex: btn.tabIndex
        };
        
        buttons.push(button);
      });
      
      return buttons;
    });
    
    results.loginFlow.buttons = buttonAccessibility;
    console.log('✅ Botones analizados:', buttonAccessibility.length);
    
    // Realizar login para continuar con las pruebas
    console.log('🔐 Realizando login...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    console.log('\n📋 FASE 2: TESTING DE NAVEGACIÓN PRINCIPAL\n');
    
    // 2. TESTING DE NAVEGACIÓN PRINCIPAL
    console.log('🔍 Verificando skip links...');
    
    // Verificar skip links
    const skipLinks = await page.evaluate(() => {
      const skipElements = document.querySelectorAll('a[href^="#"], [class*="skip"]');
      return Array.from(skipElements).map(link => ({
        text: link.textContent.trim(),
        href: link.href,
        visible: getComputedStyle(link).display !== 'none',
        focusable: link.tabIndex >= 0
      }));
    });
    
    results.navigation.skipLinks = skipLinks;
    console.log('✅ Skip links encontrados:', skipLinks.length);
    
    // Verificar navegación principal y landmarks
    const mainNavigation = await page.evaluate(() => {
      const nav = document.querySelector('nav, [role="navigation"]');
      if (!nav) return { found: false };
      
      const navItems = Array.from(nav.querySelectorAll('a, button, [role="menuitem"]'))
        .map(item => ({
          text: item.textContent.trim(),
          href: item.href || null,
          role: item.getAttribute('role'),
          ariaCurrent: item.getAttribute('aria-current'),
          ariaExpanded: item.getAttribute('aria-expanded')
        }));
      
      return {
        found: true,
        hasAriaLabel: !!nav.getAttribute('aria-label'),
        ariaLabel: nav.getAttribute('aria-label'),
        itemCount: navItems.length,
        items: navItems
      };
    });
    
    results.navigation.mainNav = mainNavigation;
    console.log('✅ Navegación principal analizada');
    
    console.log('\n📋 FASE 3: TESTING DE GESTIÓN DE USUARIOS\n');
    
    // 3. TESTING DE GESTIÓN DE USUARIOS
    await page.goto('http://localhost:3333/users');
    await page.waitForLoadState('networkidle');
    
    console.log('🔍 Verificando tabla de usuarios...');
    
    // Verificar estructura de tabla accesible
    const tableAccessibility = await page.evaluate(() => {
      const table = document.querySelector('table, [role="table"]');
      if (!table) return { found: false };
      
      const headers = Array.from(table.querySelectorAll('th, [role="columnheader"]'))
        .map(th => ({
          text: th.textContent.trim(),
          scope: th.getAttribute('scope'),
          role: th.getAttribute('role'),
          ariaSortable: th.getAttribute('aria-sort'),
          hasButton: !!th.querySelector('button')
        }));
      
      const rows = table.querySelectorAll('tr, [role="row"]').length;
      const cells = table.querySelectorAll('td, [role="gridcell"]').length;
      
      return {
        found: true,
        hasCaption: !!table.querySelector('caption'),
        captionText: table.querySelector('caption')?.textContent.trim(),
        hasAriaLabel: !!table.getAttribute('aria-label'),
        ariaLabel: table.getAttribute('aria-label'),
        hasAriaDescribedby: !!table.getAttribute('aria-describedby'),
        headerCount: headers.length,
        headers,
        rowCount: rows,
        cellCount: cells,
        role: table.getAttribute('role')
      };
    });
    
    results.userManagement.table = tableAccessibility;
    console.log('✅ Tabla de usuarios analizada');
    
    // Verificar botones de acción en la tabla
    const tableActions = await page.evaluate(() => {
      const actionButtons = document.querySelectorAll('table button, [role="table"] button');
      return Array.from(actionButtons).map(btn => ({
        text: btn.textContent.trim(),
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title'),
        hasIcon: !!btn.querySelector('svg, [class*="icon"]'),
        disabled: btn.disabled
      }));
    });
    
    results.userManagement.actionButtons = tableActions;
    console.log('✅ Botones de acción analizados:', tableActions.length);
    
    console.log('\n📋 FASE 4: TESTING DE INTERACCIONES DE FORMULARIO\n');
    
    // 4. TESTING DE FORMULARIOS (intentar abrir modal de creación)
    const createButton = await page.locator('button:has-text("Crear"), button:has-text("Añadir"), button:has-text("Nuevo")').first();
    if (await createButton.isVisible()) {
      console.log('🔍 Abriendo formulario de creación...');
      await createButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar modal y gestión de foco
      const modalAccessibility = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], .MuiDialog-root, [aria-modal="true"]');
        if (!modal) return { found: false };
        
        return {
          found: true,
          hasRole: modal.getAttribute('role') === 'dialog',
          hasAriaModal: modal.getAttribute('aria-modal') === 'true',
          hasAriaLabel: !!modal.getAttribute('aria-label'),
          ariaLabel: modal.getAttribute('aria-label'),
          hasAriaLabelledby: !!modal.getAttribute('aria-labelledby'),
          ariaLabelledby: modal.getAttribute('aria-labelledby'),
          hasFocusableElements: modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length > 0
        };
      });
      
      results.modalInteractions = modalAccessibility;
      console.log('✅ Modal analizado');
      
      // Cerrar modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    
    console.log('\n📋 FASE 5: TESTING DE LIVE REGIONS\n');
    
    // 5. TESTING DE LIVE REGIONS
    console.log('🔍 Verificando live regions...');
    
    const liveRegions = await page.evaluate(() => {
      const regions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
      return Array.from(regions).map(region => ({
        ariaLive: region.getAttribute('aria-live'),
        role: region.getAttribute('role'),
        ariaAtomic: region.getAttribute('aria-atomic'),
        ariaRelevant: region.getAttribute('aria-relevant'),
        content: region.textContent.trim(),
        visible: getComputedStyle(region).display !== 'none'
      }));
    });
    
    results.liveRegions.regions = liveRegions;
    console.log('✅ Live regions encontradas:', liveRegions.length);
    
    console.log('\n📋 FASE 6: TESTING DE NAVEGACIÓN POR TECLADO\n');
    
    // 6. TESTING DE NAVEGACIÓN POR TECLADO
    console.log('🔍 Verificando orden de tabulación...');
    
    // Verificar elementos focusables y orden de tabulación
    const focusableElements = await page.evaluate(() => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[role="button"]:not([aria-disabled="true"])',
        '[role="link"]',
        '[role="menuitem"]'
      ];
      
      const elements = document.querySelectorAll(focusableSelectors.join(', '));
      return Array.from(elements).map((el, index) => ({
        index,
        tagName: el.tagName.toLowerCase(),
        type: el.type || null,
        role: el.getAttribute('role'),
        tabIndex: el.tabIndex,
        ariaLabel: el.getAttribute('aria-label'),
        text: el.textContent.trim().substring(0, 50),
        hasVisibleFocus: false // Se verificará durante la navegación
      }));
    });
    
    results.keyboardNavigation.focusableElements = focusableElements;
    console.log('✅ Elementos focusables encontrados:', focusableElements.length);
    
    // Simular navegación por teclado
    console.log('⌨️ Simulando navegación por teclado...');
    let tabCount = 0;
    const maxTabs = Math.min(10, focusableElements.length); // Limitar para evitar bucles infinitos
    
    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');
      tabCount++;
      await page.waitForTimeout(200);
      
      // Verificar elemento actualmente enfocado
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        return {
          tagName: focused.tagName.toLowerCase(),
          text: focused.textContent.trim().substring(0, 30),
          ariaLabel: focused.getAttribute('aria-label'),
          role: focused.getAttribute('role')
        };
      });
      
      console.log(`  Tab ${i + 1}: ${focusedElement.tagName} - "${focusedElement.text || focusedElement.ariaLabel}"`);
    }
    
    results.keyboardNavigation.tabSequence = tabCount;
    console.log('✅ Navegación por teclado completada');
    
    console.log('\n📋 FASE 7: TESTING DE IMPLEMENTACIÓN ARIA\n');
    
    // 7. VERIFICACIÓN COMPLETA DE ARIA
    console.log('🔍 Verificando implementación ARIA...');
    
    const ariaImplementation = await page.evaluate(() => {
      const stats = {
        elementsWithAriaLabel: document.querySelectorAll('[aria-label]').length,
        elementsWithAriaLabelledby: document.querySelectorAll('[aria-labelledby]').length,
        elementsWithAriaDescribedby: document.querySelectorAll('[aria-describedby]').length,
        elementsWithRole: document.querySelectorAll('[role]').length,
        liveRegions: document.querySelectorAll('[aria-live]').length,
        hiddenElements: document.querySelectorAll('[aria-hidden="true"]').length,
        expandableElements: document.querySelectorAll('[aria-expanded]').length,
        requiredFields: document.querySelectorAll('[aria-required="true"], [required]').length
      };
      
      // Verificar problemas comunes
      const issues = [];
      
      // Botones sin texto o aria-label
      const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttonsWithoutLabel.forEach(btn => {
        if (!btn.textContent.trim()) {
          issues.push({
            type: 'button_without_label',
            element: btn.tagName.toLowerCase(),
            message: 'Botón sin texto ni aria-label'
          });
        }
      });
      
      // Imágenes sin alt
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      issues.push(...Array.from(imagesWithoutAlt).map(img => ({
        type: 'image_without_alt',
        element: 'img',
        src: img.src,
        message: 'Imagen sin atributo alt'
      })));
      
      // Campos de formulario sin label
      const fieldsWithoutLabel = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])');
      Array.from(fieldsWithoutLabel).forEach(field => {
        const hasLabel = document.querySelector(`label[for="${field.id}"]`) || field.closest('label');
        if (!hasLabel) {
          issues.push({
            type: 'field_without_label',
            element: field.tagName.toLowerCase(),
            type_attr: field.type,
            message: 'Campo sin label asociado'
          });
        }
      });
      
      return { stats, issues };
    });
    
    results.ariaImplementation = ariaImplementation;
    console.log('✅ Implementación ARIA analizada');
    console.log(`   - Elementos con aria-label: ${ariaImplementation.stats.elementsWithAriaLabel}`);
    console.log(`   - Live regions: ${ariaImplementation.stats.liveRegions}`);
    console.log(`   - Problemas encontrados: ${ariaImplementation.issues.length}`);
    
    // Capturar screenshot final
    await page.screenshot({ 
      path: `accessibility-screen-reader-test-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('\n📊 GENERANDO REPORTE DE RESULTADOS...\n');
    
    // Calcular puntuación general
    const scoring = calculateAccessibilityScore(results);
    
    // Mostrar resumen de resultados
    displayResults(results, scoring);
    
    // Guardar reporte detallado
    const reportData = {
      timestamp: new Date().toISOString(),
      testType: 'screen_reader_compatibility',
      results,
      scoring,
      recommendations: generateRecommendations(results)
    };
    
    fs.writeFileSync(
      `accessibility-screen-reader-report-${Date.now()}.json`,
      JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n🎉 Testing de Compatibilidad con Lectores de Pantalla Completado!');
    
  } catch (error) {
    console.error('❌ Error durante el testing:', error);
    await page.screenshot({ 
      path: `accessibility-screen-reader-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

function calculateAccessibilityScore(results) {
  let totalScore = 0;
  let maxScore = 0;
  const scores = {};
  
  // Login Flow (20 puntos)
  maxScore += 20;
  let loginScore = 0;
  if (results.loginFlow.landmarks?.landmarks?.length > 0) loginScore += 5;
  if (results.loginFlow.formFields?.every(field => field.hasLabel || field.hasAriaLabel)) loginScore += 10;
  if (results.loginFlow.buttons?.every(btn => btn.text || btn.hasAriaLabel)) loginScore += 5;
  scores.loginFlow = loginScore;
  totalScore += loginScore;
  
  // Navigation (15 puntos)
  maxScore += 15;
  let navScore = 0;
  if (results.navigation.skipLinks?.length > 0) navScore += 5;
  if (results.navigation.mainNav?.found) navScore += 10;
  scores.navigation = navScore;
  totalScore += navScore;
  
  // Table Accessibility (20 puntos)
  maxScore += 20;
  let tableScore = 0;
  if (results.userManagement.table?.found) {
    if (results.userManagement.table.hasAriaLabel || results.userManagement.table.hasCaption) tableScore += 5;
    if (results.userManagement.table.headers?.every(h => h.scope)) tableScore += 10;
    if (results.userManagement.actionButtons?.every(btn => btn.ariaLabel || btn.text)) tableScore += 5;
  }
  scores.tableAccessibility = tableScore;
  totalScore += tableScore;
  
  // Live Regions (15 puntos)
  maxScore += 15;
  let liveScore = 0;
  if (results.liveRegions.regions?.length > 0) liveScore += 15;
  scores.liveRegions = liveScore;
  totalScore += liveScore;
  
  // Keyboard Navigation (15 puntos)
  maxScore += 15;
  let keyboardScore = 0;
  if (results.keyboardNavigation.focusableElements?.length > 0) keyboardScore += 10;
  if (results.keyboardNavigation.tabSequence > 0) keyboardScore += 5;
  scores.keyboardNavigation = keyboardScore;
  totalScore += keyboardScore;
  
  // ARIA Implementation (15 puntos)
  maxScore += 15;
  let ariaScore = 0;
  if (results.ariaImplementation.stats?.elementsWithAriaLabel > 0) ariaScore += 5;
  if (results.ariaImplementation.stats?.liveRegions > 0) ariaScore += 5;
  if (results.ariaImplementation.issues?.length === 0) ariaScore += 5;
  scores.ariaImplementation = ariaScore;
  totalScore += ariaScore;
  
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  return {
    totalScore,
    maxScore,
    percentage,
    scores,
    grade: getGrade(percentage)
  };
}

function getGrade(percentage) {
  if (percentage >= 90) return 'EXCELENTE';
  if (percentage >= 80) return 'BUENO';
  if (percentage >= 70) return 'ACEPTABLE';
  if (percentage >= 60) return 'NECESITA MEJORAS';
  return 'CRÍTICO';
}

function displayResults(results, scoring) {
  console.log('🎯 RESULTADOS DEL TESTING DE LECTORES DE PANTALLA\n');
  
  console.log('📊 PUNTUACIÓN GENERAL:');
  console.log(`   🎯 Puntuación Total: ${scoring.totalScore}/${scoring.maxScore} (${scoring.percentage}%)`);
  console.log(`   📈 Calificación: ${scoring.grade}\n`);
  
  console.log('📋 DESGLOSE POR CATEGORÍAS:');
  console.log(`   🔐 Login Flow: ${scoring.scores.loginFlow}/20`);
  console.log(`   🧭 Navigation: ${scoring.scores.navigation}/15`);
  console.log(`   📊 Table Accessibility: ${scoring.scores.tableAccessibility}/20`);
  console.log(`   📢 Live Regions: ${scoring.scores.liveRegions}/15`);
  console.log(`   ⌨️ Keyboard Navigation: ${scoring.scores.keyboardNavigation}/15`);
  console.log(`   🏷️ ARIA Implementation: ${scoring.scores.ariaImplementation}/15\n`);
  
  console.log('🔍 HALLAZGOS CLAVE:');
  
  if (results.loginFlow.formFields) {
    const fieldsWithoutLabels = results.loginFlow.formFields.filter(f => !f.hasLabel && !f.hasAriaLabel);
    if (fieldsWithoutLabels.length > 0) {
      console.log(`   ⚠️ ${fieldsWithoutLabels.length} campos sin etiquetas en login`);
    } else {
      console.log('   ✅ Todos los campos de login tienen etiquetas');
    }
  }
  
  if (results.navigation.skipLinks) {
    console.log(`   🔗 ${results.navigation.skipLinks.length} skip links encontrados`);
  }
  
  if (results.userManagement.table?.found) {
    console.log('   ✅ Tabla de usuarios encontrada y analizada');
  }
  
  if (results.liveRegions.regions) {
    console.log(`   📢 ${results.liveRegions.regions.length} live regions implementadas`);
  }
  
  if (results.ariaImplementation.issues) {
    console.log(`   🐛 ${results.ariaImplementation.issues.length} problemas de ARIA encontrados`);
  }
  
  console.log('\n');
}

function generateRecommendations(results) {
  const recommendations = [];
  
  // Recomendaciones basadas en los resultados
  if (results.ariaImplementation.issues?.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'ARIA Implementation',
      issue: `${results.ariaImplementation.issues.length} problemas de ARIA encontrados`,
      solution: 'Revisar y corregir elementos sin etiquetas apropiadas'
    });
  }
  
  if (!results.navigation.skipLinks?.length) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Navigation',
      issue: 'No se encontraron skip links',
      solution: 'Implementar skip links para navegación rápida'
    });
  }
  
  if (!results.liveRegions.regions?.length) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Live Regions',
      issue: 'No se encontraron live regions',
      solution: 'Implementar live regions para anuncios dinámicos'
    });
  }
  
  return recommendations;
}

// Ejecutar el testing
testScreenReaderCompatibility().catch(console.error); 