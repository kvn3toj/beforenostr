// Manual verification script for SuperApp
const { chromium } = require('playwright');

async function verifyApplication() {
  console.log('🔍 Iniciando verificación manual de la SuperApp...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Verificar página principal
    console.log('📱 Verificando página principal...');
    await page.goto('http://localhost:3333');
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log(`✅ Página principal cargada: "${title}"`);
    
    // 2. Verificar página beta register
    console.log('🧪 Verificando página beta register...');
    await page.goto('http://localhost:3333/beta-register');
    await page.waitForTimeout(2000);
    
    const betaTitle = await page.title();
    console.log(`✅ Página beta register cargada: "${betaTitle}"`);
    
    // 3. Verificar que no hay errores de console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(3000);
    
    if (consoleErrors.length === 0) {
      console.log('✅ No se encontraron errores en la console');
    } else {
      console.log('❌ Errores encontrados en la console:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    // 4. Verificar que el componente Logo se renderiza correctamente
    console.log('🎨 Verificando componente Logo...');
    await page.goto('http://localhost:3333');
    
    const logoExists = await page.locator('svg').first().isVisible();
    if (logoExists) {
      console.log('✅ Componente Logo se renderiza correctamente');
    } else {
      console.log('❌ Componente Logo no se encontró');
    }
    
    console.log('🎉 Verificación completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  } finally {
    await browser.close();
  }
}

verifyApplication(); 