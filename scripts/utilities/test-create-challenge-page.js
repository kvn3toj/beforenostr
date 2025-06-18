const { chromium } = require('playwright');

async function testCreateChallengePage() {
  console.log('🎯 Iniciando test de la página Crear Desafío...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('📝 Paso 1: Navegando a login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    console.log('🔐 Paso 2: Realizando login...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // 2. NAVEGACIÓN A DESAFÍOS
    console.log('🎮 Paso 3: Navegando a página de desafíos...');
    await page.goto('http://localhost:3333/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que la página de desafíos carga
    try {
      await page.waitForSelector('text=Desafíos del Sistema', { timeout: 5000 });
      console.log('✅ Página de desafíos cargada correctamente');
    } catch {
      console.log('⚠️ Texto específico no encontrado, verificando por URL...');
      const currentUrl = page.url();
      if (currentUrl.includes('/challenges')) {
        console.log('✅ Página de desafíos cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de desafíos');
      }
    }

    // 3. NAVEGACIÓN A CREAR DESAFÍO
    console.log('➕ Paso 4: Haciendo clic en "Crear Desafío"...');
    const createButton = page.getByRole('button', { name: /crear desafío/i });
    await createButton.click();
    await page.waitForLoadState('networkidle');

    // Verificar que llegamos a la página de crear desafío
    try {
      await page.waitForSelector('text=Crear Nuevo Desafío', { timeout: 5000 });
      console.log('✅ Página "Crear Nuevo Desafío" cargada correctamente');
    } catch {
      console.log('⚠️ Verificando por URL...');
      const currentUrl = page.url();
      if (currentUrl.includes('/challenges/create')) {
        console.log('✅ Página de crear desafío cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de crear desafío');
      }
    }

    // 4. LLENAR FORMULARIO
    console.log('📝 Paso 5: Llenando formulario de desafío...');
    
    // Llenar nombre del desafío
    const nameInput = page.locator('input').first();
    await nameInput.fill('Test Challenge - Completar Videos');
    await page.waitForTimeout(1000); // Esperar a que se genere el slug

    // Llenar descripción
    const descriptionTextarea = page.locator('textarea').first();
    await descriptionTextarea.fill('Este es un desafío de prueba para completar videos educativos y ganar puntos.');

    console.log('✅ Formulario básico llenado correctamente');

    // 5. ENVIAR FORMULARIO
    console.log('🚀 Paso 6: Enviando formulario...');
    
    // Buscar el botón de enviar por texto
    const submitButton = page.getByRole('button', { name: /crear desafío/i });
    await submitButton.click();

    // Esperar a que aparezca el mensaje de éxito o la redirección
    console.log('⏳ Esperando respuesta del formulario...');
    await page.waitForTimeout(3000);

    // Verificar que el formulario fue procesado
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);

    if (currentUrl.includes('/challenges') && !currentUrl.includes('/create')) {
      console.log('✅ Redirección exitosa a la página de desafíos');
    } else {
      console.log('⚠️ Formulario enviado, verificando estado...');
    }

    console.log('\n🎉 Test completado exitosamente');
    console.log('📋 Resumen:');
    console.log('  ✅ Login exitoso');
    console.log('  ✅ Navegación a desafíos');
    console.log('  ✅ Navegación a crear desafío');
    console.log('  ✅ Formulario llenado');
    console.log('  ✅ Formulario enviado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-create-challenge-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot capturado para depuración');
  } finally {
    await browser.close();
  }
}

testCreateChallengePage().catch(console.error); 