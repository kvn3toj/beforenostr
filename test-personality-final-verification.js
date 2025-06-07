const { chromium } = require('playwright');

async function testPersonalityFinalVerification() {
  console.log('🎯 Verificación final de funcionalidad de personalidades...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Configurar listeners para capturar errores de consola
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Error de consola:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Error de página:', error.message);
  });

  try {
    // 1. Navegación directa a personalidades
    console.log('📋 Navegando a página de personalidades...');
    await page.goto('http://localhost:3000/personalities');
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco para que los componentes se carguen
    await page.waitForTimeout(3000);
    
    // Verificar URL
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);
    
    if (!currentUrl.includes('/personalities')) {
      throw new Error('No se pudo navegar a la página de personalidades');
    }
    
    // 2. Verificar elementos básicos de la página
    console.log('\n🔍 Verificando elementos de la página...');
    
    // Buscar título de personalidades
    const hasTitle = await page.locator('text=Personalidades, text=MBTI').count() > 0;
    console.log(`📄 Título encontrado: ${hasTitle ? '✅' : '❌'}`);
    
    // Verificar que hay tarjetas en la página
    const cardCount = await page.locator('.MuiCard-root, [role="article"]').count();
    console.log(`🃏 Tarjetas detectadas: ${cardCount}`);
    
    // Verificar si hay un botón de asignar
    const hasAssignButton = await page.locator('button:has-text("Asignar"), button[aria-label*="asignar"]').count() > 0;
    console.log(`🔘 Botón de asignar encontrado: ${hasAssignButton ? '✅' : '❌'}`);
    
    // 3. Verificar datos de personalidades MBTI
    console.log('\n🎭 Verificando personalidades MBTI...');
    
    const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                       'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    let foundTypes = [];
    for (const type of mbtiTypes) {
      const typeExists = await page.locator(`text=${type}`).count() > 0;
      if (typeExists) {
        foundTypes.push(type);
      }
    }
    
    console.log(`✅ Tipos MBTI encontrados (${foundTypes.length}/16):`, foundTypes.slice(0, 8).join(', '), foundTypes.length > 8 ? '...' : '');
    
    // 4. Verificar elementos visuales específicos
    console.log('\n🎨 Verificando elementos visuales...');
    
    const avatarCount = await page.locator('.MuiAvatar-root').count();
    console.log(`👤 Avatares: ${avatarCount}`);
    
    const chipCount = await page.locator('.MuiChip-root').count();
    console.log(`🏷️ Chips: ${chipCount}`);
    
    const progressBarCount = await page.locator('.MuiLinearProgress-root').count();
    console.log(`📊 Barras de progreso: ${progressBarCount}`);
    
    // 5. Probar interacción con botón de asignar (si existe)
    if (hasAssignButton) {
      console.log('\n🎭 Probando modal de asignación...');
      
      try {
        // Buscar y hacer clic en el botón de asignar
        const assignButton = page.locator('button:has-text("Asignar")').first();
        await assignButton.click();
        
        // Esperar a que aparezca el modal
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
        console.log('✅ Modal de asignación abierto');
        
        // Verificar contenido del modal
        const modalTitle = await page.textContent('[role="dialog"] h2, [role="dialog"] .MuiDialogTitle-root').catch(() => 'Título no encontrado');
        console.log(`📋 Título del modal: ${modalTitle}`);
        
        // Cerrar modal
        await page.click('button:has-text("Cancelar")');
        console.log('✅ Modal cerrado');
        
      } catch (error) {
        console.log('⚠️ No se pudo probar el modal:', error.message);
      }
    }
    
    // 6. Captura de pantalla final
    console.log('\n📸 Capturando estado final...');
    await page.screenshot({ 
      path: `personality-final-verification-${Date.now()}.png`,
      fullPage: true 
    });
    console.log('✅ Captura guardada');
    
    // 7. Resumen final
    console.log('\n🎉 VERIFICACIÓN FINAL COMPLETADA');
    console.log('=' * 50);
    console.log(`✅ Página accesible: ${currentUrl.includes('/personalities')}`);
    console.log(`✅ Elementos básicos: ${hasTitle && cardCount > 0}`);
    console.log(`✅ Personalidades MBTI: ${foundTypes.length}/16`);
    console.log(`✅ Funcionalidad de asignación: ${hasAssignButton}`);
    console.log(`✅ Elementos visuales: ${avatarCount > 0 && chipCount > 0}`);
    
    if (foundTypes.length >= 8 && hasTitle && cardCount > 0) {
      console.log('\n🚀 IMPLEMENTACIÓN EXITOSA - La funcionalidad de personalidades está funcionando correctamente!');
    } else {
      console.log('\n⚠️ IMPLEMENTACIÓN PARCIAL - Algunos elementos pueden necesitar ajustes');
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    
    // Capturar screenshot de error
    await page.screenshot({ 
      path: `personality-verification-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot de error capturado');
  } finally {
    await browser.close();
  }
}

testPersonalityFinalVerification().catch(console.error); 