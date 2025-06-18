const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Verificando aplicación...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capturar logs de consola
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Capturar errores
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  try {
    console.log('🌐 Navegando a http://localhost:2222...');
    await page.goto('http://localhost:2222', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('✅ Página cargada');
    
    // Verificar título
    const title = await page.title();
    console.log('📋 Título:', title);
    
    // Verificar si hay elementos básicos
    const bodyText = await page.textContent('body');
    console.log('📄 Contenido encontrado:', bodyText ? 'Sí' : 'No');
    
    // Mostrar logs de consola
    if (logs.length > 0) {
      console.log('\n📝 Logs de consola:');
      logs.forEach(log => console.log('  ', log));
    }
    
    // Mostrar errores
    if (errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      errors.forEach(error => console.log('  ', error));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  await browser.close();
  console.log('✅ Verificación completada');
})(); 