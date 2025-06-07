const { chromium } = require('playwright');

async function debugLoginPage() {
  console.log('🔍 Debuggeando página de login...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Navegando a http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    console.log('2. Capturando contenido de la página...');
    const title = await page.title();
    console.log('Título de página:', title);
    
    // Capturar screenshot
    await page.screenshot({ path: `debug-login-page-${Date.now()}.png`, fullPage: true });
    console.log('Screenshot guardado');
    
    // Buscar todos los inputs
    const inputs = await page.$$eval('input', inputs => 
      inputs.map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder,
        className: input.className
      }))
    );
    
    console.log('Inputs encontrados:', inputs);
    
    // Buscar botones
    const buttons = await page.$$eval('button', buttons => 
      buttons.map(button => ({
        type: button.type,
        textContent: button.textContent,
        className: button.className
      }))
    );
    
    console.log('Botones encontrados:', buttons);
    
    // Buscar formularios
    const forms = await page.$$eval('form', forms => 
      forms.map(form => ({
        action: form.action,
        method: form.method
      }))
    );
    
    console.log('Formularios encontrados:', forms);

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
    await page.screenshot({ 
      path: `debug-login-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

debugLoginPage().catch(console.error); 