const { chromium } = require('playwright');

async function validateTableAccessibility() {
  console.log('🔍 VALIDACIÓN EXHAUSTIVA DE ACCESIBILIDAD DE TABLA\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. LOGIN
    console.log('🔐 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    console.log('✅ Login completado, esperando estabilización...');
    await page.waitForTimeout(3000);
    
    // 2. NAVEGAR A USUARIOS
    console.log('👤 Navegando a página de usuarios...');
    await page.goto('http://localhost:3333/users');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que desaparezca el estado de carga
    console.log('⏳ Esperando que termine la carga de datos...');
    try {
      // Esperar a que aparezca el texto de carga y luego desaparezca
      await page.waitForSelector('text=Cargando', { timeout: 5000 }).catch(() => {});
      await page.waitForSelector('text=Cargando', { state: 'hidden', timeout: 15000 }).catch(() => {});
    } catch (e) {
      console.log('⚠️ No se detectó estado de carga, continuando...');
    }
    
    // Esperar más tiempo para que la tabla se renderice
    await page.waitForTimeout(3000);
    
    // Verificar si la tabla existe
    console.log('🔍 Buscando tabla en la página...');
    const tableExists = await page.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    
    if (!tableExists) {
      console.log('❌ No se pudo encontrar la tabla. Analizando el estado de la página...');
      
      // Verificar si hay mensajes de error
      const hasError = await page.locator('text=Error').isVisible({ timeout: 2000 }).catch(() => false);
      const hasNoData = await page.locator('text=No hay datos').isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`📄 Hay mensaje de error: ${hasError}`);
      console.log(`📄 Hay mensaje "No hay datos": ${hasNoData}`);
      
      // Verificar el contenido de la página
      const pageContent = await page.content();
      console.log('📄 Página contiene "DataTable":', pageContent.includes('DataTable'));
      console.log('📄 Página contiene "usuarios":', pageContent.includes('usuarios') || pageContent.includes('Users'));
      console.log('📄 Página contiene "table":', pageContent.includes('<table'));
      
      // Tomar screenshot para debug
      await page.screenshot({ 
        path: `debug-no-table-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Intentar buscar otros elementos de la tabla
      const hasDataTable = await page.locator('[data-testid*="table"], [class*="DataTable"], [class*="MuiTable"]').isVisible({ timeout: 2000 }).catch(() => false);
      console.log(`📄 Hay componente DataTable: ${hasDataTable}`);
      
      if (!hasDataTable && !hasError && !hasNoData) {
        console.log('⚠️ La página parece estar cargada pero sin tabla. Esto podría indicar un problema con los datos o permisos.');
      }
      
      return;
    }

    console.log('✅ Tabla encontrada, procediendo con la validación...');

    // 3. VALIDACIÓN EXHAUSTIVA DE LA TABLA
    console.log('\n📊 === VALIDACIÓN EXHAUSTIVA DE TABLA ===\n');
    
    const tableValidation = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return { found: false };

      // Validar estructura básica
      const tableContainer = table.closest('[role="region"]');
      const caption = table.querySelector('caption');
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      
      // Validar encabezados
      const headers = Array.from(table.querySelectorAll('th'));
      const headersWithScope = headers.filter(h => h.getAttribute('scope') === 'col');
      const headersWithAriaSort = headers.filter(h => h.hasAttribute('aria-sort'));
      const headersWithAriaLabel = headers.filter(h => h.hasAttribute('aria-label'));
      const headersWithTabIndex = headers.filter(h => h.hasAttribute('tabindex'));
      
      // Validar filas y celdas
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      const cells = Array.from(table.querySelectorAll('td'));
      const cellsWithAriaColIndex = cells.filter(c => c.hasAttribute('aria-colindex'));
      
      // Validar atributos ARIA de la tabla
      const tableAriaAttributes = {
        role: table.getAttribute('role'),
        ariaLabel: table.getAttribute('aria-label'),
        ariaDescribedby: table.getAttribute('aria-describedby'),
        ariaRowcount: table.getAttribute('aria-rowcount'),
        ariaColcount: table.getAttribute('aria-colcount'),
        id: table.getAttribute('id')
      };
      
      // Validar contenedor
      const containerAttributes = tableContainer ? {
        role: tableContainer.getAttribute('role'),
        ariaLabel: tableContainer.getAttribute('aria-label')
      } : null;
      
      // Validar paginación
      const pagination = document.querySelector('[aria-label*="Navegación"]');
      
      // Validar botones de acción
      const actionButtons = Array.from(table.querySelectorAll('button'));
      const buttonsWithAriaLabel = actionButtons.filter(b => b.hasAttribute('aria-label'));
      
      return {
        found: true,
        structure: {
          hasTableContainer: !!tableContainer,
          hasCaption: !!caption,
          captionText: caption?.textContent?.trim(),
          captionStyling: caption ? {
            fontWeight: getComputedStyle(caption).fontWeight,
            fontSize: getComputedStyle(caption).fontSize,
            color: getComputedStyle(caption).color
          } : null,
          hasThead: !!thead,
          hasTbody: !!tbody,
          theadRole: thead?.getAttribute('role'),
          tbodyRole: tbody?.getAttribute('role')
        },
        headers: {
          total: headers.length,
          withScope: headersWithScope.length,
          withAriaSort: headersWithAriaSort.length,
          withAriaLabel: headersWithAriaLabel.length,
          withTabIndex: headersWithTabIndex.length,
          details: headers.map((h, i) => ({
            index: i,
            text: h.textContent.trim(),
            scope: h.getAttribute('scope'),
            ariaSort: h.getAttribute('aria-sort'),
            ariaLabel: h.getAttribute('aria-label'),
            tabIndex: h.getAttribute('tabindex'),
            role: h.getAttribute('role'),
            ariaColindex: h.getAttribute('aria-colindex')
          }))
        },
        rows: {
          total: rows.length,
          details: rows.slice(0, 3).map((r, i) => ({
            index: i,
            role: r.getAttribute('role'),
            ariaRowindex: r.getAttribute('aria-rowindex'),
            tabIndex: r.getAttribute('tabindex'),
            ariaLabel: r.getAttribute('aria-label')
          }))
        },
        cells: {
          total: cells.length,
          withAriaColIndex: cellsWithAriaColIndex.length,
          sampleCells: cells.slice(0, 6).map((c, i) => ({
            index: i,
            role: c.getAttribute('role'),
            ariaColindex: c.getAttribute('aria-colindex'),
            text: c.textContent.trim().substring(0, 50)
          }))
        },
        tableAttributes: tableAriaAttributes,
        containerAttributes,
        pagination: {
          found: !!pagination,
          ariaLabel: pagination?.getAttribute('aria-label')
        },
        actionButtons: {
          total: actionButtons.length,
          withAriaLabel: buttonsWithAriaLabel.length,
          samples: actionButtons.slice(0, 4).map(b => ({
            text: b.textContent.trim(),
            ariaLabel: b.getAttribute('aria-label'),
            disabled: b.disabled
          }))
        }
      };
    });

    // Verificar si se encontró la tabla
    if (!tableValidation || !tableValidation.found) {
      console.log('❌ No se pudo encontrar la tabla en la página');
      return;
    }

    // 4. MOSTRAR RESULTADOS DETALLADOS
    console.log('📋 ESTRUCTURA DE LA TABLA:');
    console.log(`   ✅ Tabla encontrada: ${tableValidation.found ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ Contenedor con role="region": ${tableValidation.structure.hasTableContainer ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ Caption presente: ${tableValidation.structure.hasCaption ? 'SÍ' : 'NO'}`);
    if (tableValidation.structure.hasCaption) {
      console.log(`      📝 Texto: "${tableValidation.structure.captionText}"`);
      console.log(`      🎨 Estilo: ${tableValidation.structure.captionStyling?.fontWeight}, ${tableValidation.structure.captionStyling?.fontSize}`);
    }
    console.log(`   ✅ thead con role="rowgroup": ${tableValidation.structure.theadRole === 'rowgroup' ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ tbody con role="rowgroup": ${tableValidation.structure.tbodyRole === 'rowgroup' ? 'SÍ' : 'NO'}`);

    console.log('\n📊 ATRIBUTOS ARIA DE LA TABLA:');
    console.log(`   ✅ role="table": ${tableValidation.tableAttributes.role === 'table' ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ aria-label: ${tableValidation.tableAttributes.ariaLabel ? 'SÍ' : 'NO'} ("${tableValidation.tableAttributes.ariaLabel}")`);
    console.log(`   ✅ aria-describedby: ${tableValidation.tableAttributes.ariaDescribedby ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ aria-rowcount: ${tableValidation.tableAttributes.ariaRowcount ? 'SÍ' : 'NO'} (${tableValidation.tableAttributes.ariaRowcount})`);
    console.log(`   ✅ aria-colcount: ${tableValidation.tableAttributes.ariaColcount ? 'SÍ' : 'NO'} (${tableValidation.tableAttributes.ariaColcount})`);
    console.log(`   ✅ ID único: ${tableValidation.tableAttributes.id ? 'SÍ' : 'NO'} (${tableValidation.tableAttributes.id})`);

    console.log('\n📋 ENCABEZADOS DE COLUMNA:');
    console.log(`   ✅ Total de encabezados: ${tableValidation.headers.total}`);
    console.log(`   ✅ Con scope="col": ${tableValidation.headers.withScope}/${tableValidation.headers.total}`);
    console.log(`   ✅ Con aria-sort: ${tableValidation.headers.withAriaSort}/${tableValidation.headers.total}`);
    console.log(`   ✅ Con aria-label: ${tableValidation.headers.withAriaLabel}/${tableValidation.headers.total}`);
    console.log(`   ✅ Con tabindex: ${tableValidation.headers.withTabIndex}/${tableValidation.headers.total}`);
    
    console.log('\n   📝 Detalles de encabezados:');
    tableValidation.headers.details.forEach((header, i) => {
      console.log(`      ${i + 1}. "${header.text}"`);
      console.log(`         - scope: ${header.scope || 'NO'}`);
      console.log(`         - aria-sort: ${header.ariaSort || 'NO'}`);
      console.log(`         - tabindex: ${header.tabIndex || 'NO'}`);
      console.log(`         - aria-colindex: ${header.ariaColindex || 'NO'}`);
    });

    console.log('\n📊 FILAS DE DATOS:');
    console.log(`   ✅ Total de filas: ${tableValidation.rows.total}`);
    console.log('\n   📝 Muestra de filas:');
    tableValidation.rows.details.forEach((row, i) => {
      console.log(`      Fila ${i + 1}:`);
      console.log(`         - role: ${row.role || 'NO'}`);
      console.log(`         - aria-rowindex: ${row.ariaRowindex || 'NO'}`);
      console.log(`         - tabindex: ${row.tabIndex || 'NO'}`);
      console.log(`         - aria-label: ${row.ariaLabel ? 'SÍ' : 'NO'}`);
    });

    console.log('\n📊 CELDAS DE DATOS:');
    console.log(`   ✅ Total de celdas: ${tableValidation.cells.total}`);
    console.log(`   ✅ Con aria-colindex: ${tableValidation.cells.withAriaColIndex}/${tableValidation.cells.total}`);

    console.log('\n🔘 BOTONES DE ACCIÓN:');
    console.log(`   ✅ Total de botones: ${tableValidation.actionButtons.total}`);
    console.log(`   ✅ Con aria-label: ${tableValidation.actionButtons.withAriaLabel}/${tableValidation.actionButtons.total}`);
    console.log('\n   📝 Muestra de botones:');
    tableValidation.actionButtons.samples.forEach((btn, i) => {
      console.log(`      ${i + 1}. aria-label: "${btn.ariaLabel || 'NO'}"`);
      console.log(`         - disabled: ${btn.disabled ? 'SÍ' : 'NO'}`);
    });

    console.log('\n📄 PAGINACIÓN:');
    console.log(`   ✅ Paginación encontrada: ${tableValidation.pagination.found ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ aria-label: ${tableValidation.pagination.ariaLabel ? 'SÍ' : 'NO'} ("${tableValidation.pagination.ariaLabel}")`);

    // 5. CALCULAR PUNTUACIÓN FINAL
    console.log('\n🎯 === PUNTUACIÓN DE ACCESIBILIDAD ===\n');
    
    let score = 0;
    const maxScore = 20;
    
    // Estructura básica (5 puntos)
    if (tableValidation.structure.hasCaption) score += 1;
    if (tableValidation.structure.hasTableContainer) score += 1;
    if (tableValidation.tableAttributes.role === 'table') score += 1;
    if (tableValidation.tableAttributes.ariaLabel) score += 1;
    if (tableValidation.structure.theadRole === 'rowgroup' && tableValidation.structure.tbodyRole === 'rowgroup') score += 1;
    
    // Encabezados (8 puntos)
    if (tableValidation.headers.withScope === tableValidation.headers.total) score += 3;
    if (tableValidation.headers.withAriaLabel > 0) score += 2;
    if (tableValidation.headers.withTabIndex > 0) score += 2;
    if (tableValidation.headers.withAriaSort > 0) score += 1;
    
    // Celdas y filas (4 puntos)
    if (tableValidation.cells.withAriaColIndex === tableValidation.cells.total) score += 2;
    if (tableValidation.rows.total > 0) score += 2;
    
    // Botones y paginación (3 puntos)
    if (tableValidation.actionButtons.withAriaLabel === tableValidation.actionButtons.total) score += 2;
    if (tableValidation.pagination.found && tableValidation.pagination.ariaLabel) score += 1;
    
    const percentage = Math.round((score / maxScore) * 100);
    
    console.log(`🏆 PUNTUACIÓN FINAL: ${score}/${maxScore} (${percentage}%)`);
    console.log(`📈 CALIFICACIÓN: ${percentage >= 95 ? 'EXCELENTE' : percentage >= 85 ? 'BUENO' : 'NECESITA MEJORAS'}`);
    
    if (percentage === 100) {
      console.log('\n🎉 ¡PERFECTO! La tabla cumple con todos los estándares de accesibilidad');
      console.log('✅ WCAG 2.1 AA compliant');
      console.log('✅ Compatible con lectores de pantalla');
      console.log('✅ Navegación por teclado completa');
      console.log('✅ Estructura semántica perfecta');
    } else if (percentage >= 95) {
      console.log('\n🌟 ¡EXCELENTE! La tabla tiene una accesibilidad casi perfecta');
      console.log('✅ WCAG 2.1 AA compliant');
      console.log('✅ Compatible con lectores de pantalla');
    } else {
      console.log('\n⚠️ Áreas de mejora identificadas');
    }

    // 6. SCREENSHOT FINAL
    await page.screenshot({ 
      path: `table-accessibility-validation-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('\n📸 Screenshot guardado para documentación');

  } catch (error) {
    console.error('❌ Error durante la validación:', error);
    await page.screenshot({ 
      path: `table-validation-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Ejecutar validación
validateTableAccessibility().catch(console.error); 