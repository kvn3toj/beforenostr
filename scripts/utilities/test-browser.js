const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Iniciando Playwright...');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const page = await browser.newPage();
  console.log('📄 Página creada');
  
  // Esperar y mostrar errores de consola
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Error de consola:', msg.text());
    } else {
      console.log('📝 Consola:', msg.text());
    }
  });

  // Capturar errores de la página
  page.on('pageerror', error => {
    console.log('❌ Error de página:', error.message);
  });

  // Capturar fallos de recursos
  page.on('requestfailed', request => {
    console.log('❌ Fallo de petición:', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('🌐 Navegando a http://localhost:3001...');
    // Abrir la aplicación
    await page.goto('http://localhost:3001', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    console.log('✅ Navegación exitosa');
    
    // Verificar si la página se carga
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✅ Página cargada correctamente');
    } catch (error) {
      console.log('❌ Error cargando página:', error.message);
    }

    // Verificar si hay contenido básico
    try {
      await page.waitForSelector('body', { timeout: 5000 });
      console.log('✅ Body elemento encontrado');
      
      const title = await page.title();
      console.log('📋 Título de la página:', title);
      
      const url = page.url();
      console.log('🔗 URL actual:', url);
      
    } catch (error) {
      console.log('❌ Error verificando contenido:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Error en navegación:', error.message);
  }
  
  // No cerrar el navegador para mantenerlo abierto
  console.log('🌐 Navegador abierto en http://localhost:3001');
  console.log('💡 Presiona Ctrl+C para cerrar');
  
  // Mantener el proceso vivo
  await new Promise(() => {});
})().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
}); 