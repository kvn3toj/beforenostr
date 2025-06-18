const { chromium } = require('playwright');

async function testVideoConfigPages() {
  console.log('🎯 Iniciando test de configuración de videos...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Configurar captura de errores
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`🔴 Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', (error) => {
    console.log(`🔴 Page Error: ${error.message}`);
  });

  try {
    // 1. LOGIN
    console.log('🔐 === PASO 1: LOGIN COMO ADMINISTRADOR ===');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/');
    console.log('✅ Login completado\n');

    // 2. VERIFICAR PÁGINA DE ITEMS
    console.log('📋 === PASO 2: NAVEGANDO A PÁGINA DE ITEMS ===');
    await page.goto('http://localhost:3333/items');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Verificar que hay videos listados
    const videoRows = await page.locator('table tbody tr, .MuiDataGrid-row').count();
    console.log(`🎬 Videos encontrados: ${videoRows}`);
    
    if (videoRows === 0) {
      console.log('❌ No hay videos en la lista');
      await page.screenshot({ path: 'debug-no-videos.png', fullPage: true });
      return;
    }
    
    await page.screenshot({ path: 'debug-items-list.png', fullPage: true });

    // 3. NAVEGACIÓN A CONFIGURACIÓN DE VIDEO ESPECÍFICO
    console.log('\n🛠️ === PASO 3: NAVEGANDO A CONFIGURACIÓN DE VIDEO ===');
    
    const testVideoId = 39; // Sabemos que este video tiene datos
    console.log(`📍 Navegando a /items/${testVideoId}/config...`);
    
    await page.goto(`http://localhost:3333/items/${testVideoId}/config`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    const configUrl = page.url();
    console.log(`📍 URL final de configuración: ${configUrl}`);
    
    // Verificar si llegamos a la página correcta
    if (configUrl.includes('/login')) {
      console.log('❌ Redirigido a login - problema de autenticación');
      return;
    }
    
    // 4. VERIFICAR ELEMENTOS DE CONFIGURACIÓN
    console.log('\n🔍 === PASO 4: VERIFICANDO ELEMENTOS DE CONFIGURACIÓN ===');
    
    // Buscar tabs o secciones de configuración
    const hasTabs = await page.locator('[role="tablist"], .MuiTabs-root, .tab, [data-tabs]').count() > 0;
    const hasSubtitleSection = await page.locator('text=/subtitle|subtítulo/i').count() > 0;
    const hasQuestionSection = await page.locator('text=/question|pregunta/i').count() > 0;
    const hasPermissionSection = await page.locator('text=/permission|permiso|access|acceso/i').count() > 0;
    
    console.log(`📊 Tabs encontrados: ${hasTabs}`);
    console.log(`📝 Sección de subtítulos: ${hasSubtitleSection}`);
    console.log(`❓ Sección de preguntas: ${hasQuestionSection}`);
    console.log(`🔒 Sección de permisos: ${hasPermissionSection}`);
    
    await page.screenshot({ path: 'debug-video-config-main.png', fullPage: true });

    // 5. PROBAR TABS SI EXISTEN
    if (hasTabs) {
      console.log('\n📑 === PASO 5: PROBANDO TABS DE CONFIGURACIÓN ===');
      
      const tabs = await page.locator('[role="tab"], .MuiTab-root, .tab-button').all();
      console.log(`🔢 Número de tabs encontrados: ${tabs.length}`);
      
      for (let i = 0; i < Math.min(tabs.length, 4); i++) {
        try {
          const tabText = await tabs[i].textContent();
          console.log(`\n🔸 Haciendo clic en tab ${i + 1}: "${tabText}"`);
          
          await tabs[i].click();
          await page.waitForTimeout(2000);
          
          const currentContent = await page.locator('main, .content, .tab-content').textContent();
          console.log(`   📄 Contenido disponible: ${currentContent ? 'SÍ' : 'NO'}`);
          console.log(`   📏 Longitud del contenido: ${currentContent?.length || 0} caracteres`);
          
          await page.screenshot({ 
            path: `debug-video-config-tab-${i + 1}.png`, 
            fullPage: true 
          });
          
        } catch (error) {
          console.log(`   ❌ Error al hacer clic en tab ${i + 1}: ${error.message}`);
        }
      }
    }

    // 6. VERIFICAR DATOS ESPECÍFICOS
    console.log('\n📊 === PASO 6: VERIFICANDO DATOS ESPECÍFICOS ===');
    
    // Buscar formularios o tablas de datos
    const hasDataTable = await page.locator('table, .MuiDataGrid-root, .data-table').count() > 0;
    const hasForm = await page.locator('form, .form, input, textarea').count() > 0;
    const hasCreateButton = await page.locator('button:has-text("Create"), button:has-text("Crear"), button:has-text("Add"), button:has-text("Añadir")').count() > 0;
    
    console.log(`📋 Tabla de datos: ${hasDataTable}`);
    console.log(`📝 Formularios: ${hasForm}`);
    console.log(`➕ Botón de crear: ${hasCreateButton}`);

    // 7. PROBAR FUNCIONALIDAD ESPECÍFICA SI ESTÁ DISPONIBLE
    if (hasCreateButton) {
      console.log('\n➕ === PASO 7: PROBANDO FUNCIONALIDAD DE CREACIÓN ===');
      
      try {
        const createButton = await page.locator('button:has-text("Create"), button:has-text("Crear"), button:has-text("Add"), button:has-text("Añadir")').first();
        console.log('🖱️ Haciendo clic en botón de crear...');
        
        await createButton.click();
        await page.waitForTimeout(2000);
        
        const hasModal = await page.locator('.modal, .dialog, .MuiDialog-root, .popup').count() > 0;
        const hasFormFields = await page.locator('input, textarea, select').count() > 0;
        
        console.log(`📱 Modal/Dialog abierto: ${hasModal}`);
        console.log(`📝 Campos de formulario: ${hasFormFields}`);
        
        await page.screenshot({ path: 'debug-create-functionality.png', fullPage: true });
        
      } catch (error) {
        console.log(`❌ Error al probar funcionalidad de creación: ${error.message}`);
      }
    }

    console.log('\n✅ ===== VERIFICACIÓN DE CONFIGURACIÓN DE VIDEO COMPLETADA =====');
    console.log('📸 Screenshots generados para análisis visual');
    
  } catch (error) {
    console.error('❌ ERROR DURANTE LA VERIFICACIÓN:', error.message);
    
    await page.screenshot({ 
      path: `debug-video-config-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    throw error;
  } finally {
    await browser.close();
  }
}

testVideoConfigPages().catch(console.error); 