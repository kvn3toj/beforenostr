const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Script de Auditoría Inicial de Accesibilidad - Gamifier Admin Frontend
 * 
 * Este script realiza una auditoría automatizada de accesibilidad en las páginas
 * principales del Gamifier Admin Frontend siguiendo la Heurística 5: Accesibilidad
 */

async function auditAccessibility() {
  console.log('🔍 === AUDITORÍA INICIAL DE ACCESIBILIDAD - GAMIFIER ADMIN ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Configurar captura de errores de consola
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🚨 Error de JavaScript:', msg.text());
    }
  });

  try {
    const auditResults = [];
    
    // === 1. AUDITORÍA DE PÁGINA DE LOGIN ===
    console.log('📋 1. AUDITANDO PÁGINA DE LOGIN...\n');
    
    await page.goto('http://localhost:2222/login');
    await page.waitForLoadState('networkidle');
    
    const loginAudit = await auditPage(page, 'Login');
    auditResults.push(loginAudit);
    
    // === 2. REALIZAR LOGIN PARA AUDITAR PÁGINAS INTERNAS ===
    console.log('🔑 2. REALIZANDO LOGIN...\n');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForURL('**/');
      console.log('✅ Login exitoso\n');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso (verificado por URL)\n');
      } else {
        throw new Error('Login falló');
      }
    }
    
    // === 3. AUDITORÍA DE PÁGINAS PRINCIPALES ===
    const pagesToAudit = [
      { url: 'http://localhost:2222/', name: 'Dashboard' },
      { url: 'http://localhost:2222/users', name: 'Users' },
      { url: 'http://localhost:2222/roles', name: 'Roles' },
      { url: 'http://localhost:2222/items', name: 'Items' },
      { url: 'http://localhost:2222/mundos', name: 'Mundos' }
    ];
    
    for (const pageInfo of pagesToAudit) {
      console.log(`📋 3.${pagesToAudit.indexOf(pageInfo) + 1}. AUDITANDO PÁGINA ${pageInfo.name.toUpperCase()}...\n`);
      
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      const pageAudit = await auditPage(page, pageInfo.name);
      auditResults.push(pageAudit);
    }
    
    // === 4. AUDITORÍA DE NAVEGACIÓN POR TECLADO ===
    console.log('⌨️  4. AUDITANDO NAVEGACIÓN POR TECLADO...\n');
    
    await page.goto('http://localhost:2222/');
    await page.waitForLoadState('networkidle');
    
    const keyboardAudit = await auditKeyboardNavigation(page);
    auditResults.push(keyboardAudit);
    
    // === 5. GENERAR REPORTE ===
    console.log('📊 5. GENERANDO REPORTE DE ACCESIBILIDAD...\n');
    
    const report = generateAccessibilityReport(auditResults);
    
    // Guardar reporte
    const timestamp = Date.now();
    fs.writeFileSync(`accessibility-audit-${timestamp}.md`, report);
    
    console.log(`📄 Reporte guardado en: accessibility-audit-${timestamp}.md\n`);
    console.log('🎉 AUDITORÍA COMPLETADA EXITOSAMENTE\n');
    
    // Capturar screenshot final
    await page.screenshot({ 
      path: `accessibility-audit-${timestamp}.png`,
      fullPage: true 
    });

  } catch (error) {
    console.error('❌ Error durante la auditoría:', error);
    
    await page.screenshot({ 
      path: `accessibility-audit-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

/**
 * Audita una página específica en busca de problemas de accesibilidad
 */
async function auditPage(page, pageName) {
  const audit = {
    page: pageName,
    url: page.url(),
    issues: [],
    score: 0,
    details: {}
  };
  
  console.log(`   🔍 Auditando: ${pageName} (${page.url()})`);
  
  try {
    // === VERIFICAR TÍTULO DE PÁGINA ===
    const title = await page.title();
    console.log(`   📄 Título de página: "${title}"`);
    
    if (!title || title.trim() === '') {
      audit.issues.push('⚠️  CRÍTICO: La página no tiene título');
    } else if (title === 'Vite + React + TS') {
      audit.issues.push('⚠️  ADVERTENCIA: Título de página por defecto de Vite');
    } else {
      console.log('   ✅ Título de página presente');
    }
    
    // === VERIFICAR ETIQUETAS DE FORMULARIOS ===
    const inputs = await page.locator('input, textarea, select').all();
    console.log(`   📝 Campos de formulario encontrados: ${inputs.length}`);
    
    let unlabeledInputs = 0;
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        if (label === 0 && !ariaLabel && !ariaLabelledBy) {
          unlabeledInputs++;
        }
      } else if (!ariaLabel && !ariaLabelledBy) {
        unlabeledInputs++;
      }
    }
    
    if (unlabeledInputs > 0) {
      audit.issues.push(`⚠️  ADVERTENCIA: ${unlabeledInputs} campos sin etiqueta apropiada`);
    } else if (inputs.length > 0) {
      console.log('   ✅ Todos los campos tienen etiquetas apropiadas');
    }
    
    // === VERIFICAR BOTONES ACCESIBLES ===
    const buttons = await page.locator('button, [role="button"]').all();
    console.log(`   🔘 Botones encontrados: ${buttons.length}`);
    
    let inaccessibleButtons = 0;
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      if ((!text || text.trim() === '') && !ariaLabel) {
        inaccessibleButtons++;
      }
    }
    
    if (inaccessibleButtons > 0) {
      audit.issues.push(`⚠️  ADVERTENCIA: ${inaccessibleButtons} botones sin texto o aria-label`);
    } else if (buttons.length > 0) {
      console.log('   ✅ Todos los botones tienen texto o aria-label');
    }
    
    // === VERIFICAR IMÁGENES SIN ALT ===
    const images = await page.locator('img').all();
    console.log(`   🖼️  Imágenes encontradas: ${images.length}`);
    
    let imagesWithoutAlt = 0;
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt === null) {
        imagesWithoutAlt++;
      }
    }
    
    if (imagesWithoutAlt > 0) {
      audit.issues.push(`⚠️  ADVERTENCIA: ${imagesWithoutAlt} imágenes sin atributo alt`);
    } else if (images.length > 0) {
      console.log('   ✅ Todas las imágenes tienen atributo alt');
    }
    
    // === VERIFICAR ESTRUCTURA SEMÁNTICA ===
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`   📑 Encabezados encontrados: ${headings.length}`);
    
    const h1Count = await page.locator('h1').count();
    if (h1Count === 0) {
      audit.issues.push('⚠️  ADVERTENCIA: La página no tiene encabezado H1');
    } else if (h1Count > 1) {
      audit.issues.push('⚠️  ADVERTENCIA: La página tiene múltiples H1');
    } else {
      console.log('   ✅ Estructura de encabezados correcta');
    }
    
    // === VERIFICAR LANDMARKS ===
    const main = await page.locator('main').count();
    const nav = await page.locator('nav').count();
    const header = await page.locator('header').count();
    
    console.log(`   🏛️  Landmarks: main(${main}), nav(${nav}), header(${header})`);
    
    if (main === 0) {
      audit.issues.push('⚠️  SUGERENCIA: Considerar añadir elemento <main>');
    }
    
    // === CALCULAR PUNTUACIÓN ===
    audit.score = Math.max(0, 100 - (audit.issues.length * 15));
    audit.details = {
      title,
      inputCount: inputs.length,
      buttonCount: buttons.length,
      imageCount: images.length,
      headingCount: headings.length,
      landmarks: { main, nav, header }
    };
    
    console.log(`   📊 Puntuación de accesibilidad: ${audit.score}/100`);
    console.log(`   ❌ Problemas encontrados: ${audit.issues.length}\n`);
    
  } catch (error) {
    console.error(`   ❌ Error auditando ${pageName}:`, error.message);
    audit.issues.push(`ERROR: ${error.message}`);
  }
  
  return audit;
}

/**
 * Audita la navegación por teclado
 */
async function auditKeyboardNavigation(page) {
  const audit = {
    page: 'Navegación por Teclado',
    url: page.url(),
    issues: [],
    score: 0,
    details: {}
  };
  
  console.log('   ⌨️  Auditando navegación por teclado...');
  
  try {
    // Obtener todos los elementos interactivos
    const interactiveElements = await page.locator(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ).all();
    
    console.log(`   📋 Elementos interactivos encontrados: ${interactiveElements.length}`);
    
    let tabIndex = 0;
    let elementsWithoutFocus = 0;
    
    // Simular navegación por Tab
    for (let i = 0; i < Math.min(10, interactiveElements.length); i++) {
      await page.keyboard.press('Tab');
      tabIndex++;
      
      // Verificar si hay un elemento enfocado
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        if (focused && focused !== document.body) {
          const styles = window.getComputedStyle(focused);
          return {
            tagName: focused.tagName,
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow
          };
        }
        return null;
      });
      
      if (!focusedElement) {
        elementsWithoutFocus++;
      } else {
        // Verificar si el elemento tiene indicación visual de foco
        const hasVisibleFocus = (
          focusedElement.outline !== 'none' ||
          focusedElement.outlineWidth !== '0px' ||
          focusedElement.boxShadow !== 'none'
        );
        
        if (!hasVisibleFocus) {
          elementsWithoutFocus++;
        }
      }
    }
    
    if (elementsWithoutFocus > 0) {
      audit.issues.push(`⚠️  ADVERTENCIA: ${elementsWithoutFocus} elementos sin indicador visual de foco`);
    } else {
      console.log('   ✅ Navegación por teclado funcional');
    }
    
    audit.details = {
      interactiveElements: interactiveElements.length,
      testedElements: Math.min(10, interactiveElements.length),
      elementsWithoutFocus
    };
    
    audit.score = Math.max(0, 100 - (elementsWithoutFocus * 20));
    
    console.log(`   📊 Puntuación de navegación por teclado: ${audit.score}/100\n`);
    
  } catch (error) {
    console.error('   ❌ Error en auditoría de teclado:', error.message);
    audit.issues.push(`ERROR: ${error.message}`);
  }
  
  return audit;
}

/**
 * Genera un reporte de accesibilidad en formato Markdown
 */
function generateAccessibilityReport(auditResults) {
  const totalScore = Math.round(
    auditResults.reduce((sum, audit) => sum + audit.score, 0) / auditResults.length
  );
  
  const totalIssues = auditResults.reduce((sum, audit) => sum + audit.issues.length, 0);
  
  let report = `# 🔍 Reporte de Auditoría de Accesibilidad - Gamifier Admin

## 📊 Resumen Ejecutivo

- **Puntuación Global**: ${totalScore}/100
- **Páginas Auditadas**: ${auditResults.length}
- **Problemas Totales Encontrados**: ${totalIssues}
- **Fecha**: ${new Date().toLocaleString()}

## 🎯 Estado General

`;

  if (totalScore >= 90) {
    report += '✅ **EXCELENTE**: La accesibilidad está en muy buen estado con problemas menores.\n\n';
  } else if (totalScore >= 70) {
    report += '⚠️ **BUENO**: La accesibilidad es aceptable pero requiere mejoras.\n\n';
  } else if (totalScore >= 50) {
    report += '🔶 **REGULAR**: Se requieren mejoras significativas en accesibilidad.\n\n';
  } else {
    report += '🚨 **CRÍTICO**: Se requieren mejoras urgentes en accesibilidad.\n\n';
  }

  report += '## 📋 Detalles por Página\n\n';
  
  auditResults.forEach((audit, index) => {
    report += `### ${index + 1}. ${audit.page}\n\n`;
    report += `- **URL**: ${audit.url}\n`;
    report += `- **Puntuación**: ${audit.score}/100\n`;
    report += `- **Problemas**: ${audit.issues.length}\n\n`;
    
    if (audit.issues.length > 0) {
      report += '**Problemas Encontrados:**\n\n';
      audit.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    }
    
    if (audit.details) {
      report += '**Detalles Técnicos:**\n\n';
      Object.entries(audit.details).forEach(([key, value]) => {
        report += `- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
      });
      report += '\n';
    }
  });
  
  report += `## 🎯 Recomendaciones Prioritarias

### 1. Problemas Críticos a Resolver

`;

  const criticalIssues = auditResults
    .flatMap(audit => audit.issues)
    .filter(issue => issue.includes('CRÍTICO'));
    
  if (criticalIssues.length > 0) {
    criticalIssues.forEach(issue => {
      report += `- ${issue}\n`;
    });
  } else {
    report += '✅ No se encontraron problemas críticos.\n';
  }

  report += `
### 2. Mejoras Recomendadas

- Implementar indicadores visuales de foco más prominentes
- Asegurar que todos los campos de formulario tengan etiquetas apropiadas
- Verificar el contraste de colores en todos los elementos
- Añadir landmarks semánticos (main, nav, header, footer)
- Implementar navegación por teclado completa

### 3. Próximos Pasos

1. **Inmediato**: Resolver problemas críticos identificados
2. **Corto Plazo**: Implementar mejoras de navegación por teclado
3. **Mediano Plazo**: Optimizar estructura semántica y landmarks
4. **Largo Plazo**: Realizar pruebas con usuarios con discapacidades

---

**Nota**: Este reporte fue generado automáticamente. Se recomienda realizar pruebas manuales adicionales y usar herramientas especializadas como axe-core o Lighthouse para una evaluación más completa.
`;

  return report;
}

// Ejecutar auditoría
auditAccessibility().catch(console.error); 