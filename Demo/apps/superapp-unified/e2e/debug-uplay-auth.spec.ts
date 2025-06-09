import { test, expect } from '@playwright/test';

test.describe('DEBUG: ÜPlay con Autenticación Real', () => {
  test('DIAGNÓSTICO COMPLETO: verificar aplicación paso a paso', async ({ page }) => {
    console.log('=== INICIANDO DIAGNÓSTICO PASO A PASO ===');
    
    // Paso 1: Ir a la página principal
    console.log('Paso 1: Navegando a la página principal...');
    await page.goto('/');
    await page.waitForTimeout(3000); // Dar tiempo para que cargue
    
    // Verificar si redirige a login o muestra contenido
    const currentUrl = page.url();
    console.log('URL actual después de navegar a /:', currentUrl);
    
    // Paso 2: Verificar qué elementos aparecen en la página
    console.log('Paso 2: Verificando elementos en la página...');
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        hasRoot: !!document.getElementById('root'),
        hasLoginForm: !!document.querySelector('#email'),
        hasMockBanner: !!document.querySelector('[data-testid="dev-mock-banner"]'),
        hasUPlayText: document.body.innerText.includes('ÜPlay'),
        bodyText: document.body.innerText.substring(0, 500) // Primeros 500 caracteres
      };
    });
    
    console.log('Contenido de la página:', pageContent);
    
    // Paso 3: Si hay formulario de login, intentar login
    if (pageContent.hasLoginForm) {
      console.log('Paso 3: Detectado formulario de login, realizando login...');
      await page.fill('#email', 'test@coomunity.com');
      await page.fill('#password', 'test123');
      await page.click('button:has-text("Iniciar Sesión")');
      
      // Esperar a que el login procese
      await page.waitForTimeout(5000);
      
      const loginResult = await page.evaluate(() => ({
        currentURL: window.location.href,
        hasToken: !!localStorage.getItem('coomunity_token'),
        hasUser: !!localStorage.getItem('coomunity_user'),
        tokenPreview: localStorage.getItem('coomunity_token')?.substring(0, 30) + '...'
      }));
      
      console.log('Resultado del login:', loginResult);
    } else {
      console.log('Paso 3: No se detectó formulario de login, verificando autenticación automática...');
      const autoAuthResult = await page.evaluate(() => ({
        currentURL: window.location.href,
        hasToken: !!localStorage.getItem('coomunity_token'),
        hasUser: !!localStorage.getItem('coomunity_user')
      }));
      
      console.log('Estado de autenticación automática:', autoAuthResult);
    }
    
    // Paso 4: Intentar navegar a ÜPlay
    console.log('Paso 4: Navegando a /play...');
    await page.goto('/play');
    await page.waitForTimeout(5000);
    
    const playPageContent = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return {
        currentURL: window.location.href,
        title: document.title,
        hasUPlayInHeadings: headings.some(h => h.textContent?.includes('ÜPlay')),
        allHeadings: headings.map(h => h.textContent),
        bodyText: document.body.innerText.substring(0, 1000),
        hasUPlayInBody: document.body.innerText.includes('ÜPlay'),
        hasErrorText: document.body.innerText.includes('Error') || document.body.innerText.includes('error')
      };
    });
    
    console.log('Contenido de la página /play:', playPageContent);
    
    // Paso 5: Verificar llamadas de red
    console.log('Paso 5: Verificando llamadas de red...');
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });
    
    await page.waitForTimeout(3000);
    console.log('Llamadas al backend detectadas:', networkRequests);
    
    // Paso 6: Verificar errores en consola
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('Errores en consola:', consoleLogs);
    
    // Paso 7: Verificar si existe navegación a ÜPlay desde el dashboard
    console.log('Paso 7: Buscando navegación a ÜPlay...');
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    const navigationElements = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const uplayElements = links.filter(el => 
        el.textContent?.includes('ÜPlay') || 
        el.textContent?.includes('UPlay') || 
        el.textContent?.includes('Play')
      );
      
      return {
        totalLinks: links.length,
        uplayElementsCount: uplayElements.length,
        uplayElementsText: uplayElements.map(el => el.textContent),
        uplayElementsHref: uplayElements.map(el => el.getAttribute('href'))
      };
    });
    
    console.log('Elementos de navegación encontrados:', navigationElements);
    
    // Tomar screenshot final
    await page.screenshot({ path: 'debug-complete-diagnosis.png', fullPage: true });
    
    // Test para verificar aspectos específicos
    console.log('=== RESUMEN DEL DIAGNÓSTICO ===');
    console.log('1. ¿Hay formulario de login?', pageContent.hasLoginForm);
    console.log('2. ¿Login exitoso?', await page.evaluate(() => !!localStorage.getItem('coomunity_token')));
    console.log('3. ¿Página /play accesible?', playPageContent.currentURL.includes('/play'));
    console.log('4. ¿Contenido de ÜPlay presente?', playPageContent.hasUPlayInBody);
    console.log('5. ¿Hay errores?', consoleLogs.length > 0);
    
    // Este test siempre pasa, es solo para diagnóstico
    expect(true).toBe(true);
  });
}); 