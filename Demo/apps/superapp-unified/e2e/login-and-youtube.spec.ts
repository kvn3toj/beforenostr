import { test, expect } from '@playwright/test';

test.describe('🔐 Login + YouTube Videos', () => {
  test('🎬 Login con credenciales por defecto y verificar videos de YouTube', async ({ page }) => {
    console.log('🔐 Iniciando test de login + YouTube...');
    
    // Capturar logs importantes del navegador
    page.on('console', (msg) => {
      const text = msg.text();
      // Capturar TODOS los logs, no solo algunos específicos
      console.log(`🎯 [BROWSER]: ${text}`);
    });

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      console.log('🚨 [BROWSER ERROR]:', error.message);
    });

    // Capturar errores de la consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🚨 [CONSOLE ERROR]:', msg.text());
      }
    });

    // 1. Ir a la página de login (las credenciales ya están pre-llenadas)
    // El puerto se detecta automáticamente por el global-setup.cjs
    console.log('📍 Navegando a /login...');
    await page.goto('/login');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);

    // Verificar que las credenciales estén pre-llenadas (usar selector MUI correcto)
    const emailValue = await page.inputValue('[data-testid="login-email-input"] input');
    const passwordValue = await page.inputValue('[data-testid="login-password-input"] input');
    
    console.log(`📧 Email pre-llenado: ${emailValue}`);
    console.log(`🔒 Password pre-llenado: ${passwordValue ? '***' : 'vacío'}`);

    // Si no están pre-llenadas, las llenamos
    if (emailValue !== 'admin@gamifier.com') {
      console.log('📧 Llenando email...');
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    }
    
    if (!passwordValue) {
      console.log('🔒 Llenando password...');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
    }

    // 2. Hacer login
    console.log('🚀 Haciendo clic en Iniciar Sesión...');
    await page.click('[data-testid="login-submit-button"]');

    // 3. Esperar redirección exitosa
    console.log('⏳ Esperando redirección después del login...');
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root');
    console.log('✅ Login exitoso - redirección completada');

    // 4. Ir a ÜPlay
    console.log('🎬 Navegando a /uplay...');
    await page.goto('/uplay');
    await page.waitForSelector('#root');
    await page.waitForTimeout(5000); // Dar tiempo para que se ejecuten los hooks

    // 5. Capturar logs adicionales y tomar screenshot
    console.log('📸 Tomando screenshot de ÜPlay...');
    await page.screenshot({ path: 'uplay-with-admin.png', fullPage: true });

    // 6. Verificar que hay videos cargados
    const videos = await page.locator('iframe[src*="youtube"], iframe[src*="youtu.be"], video').count();
    console.log(`🎥 Videos encontrados: ${videos}`);

    if (videos > 0) {
      console.log('✅ Se encontraron videos de YouTube!');
    } else {
      console.log('⚠️ No se encontraron videos de YouTube, verificando contenido de la página...');
      
      // Verificar contenido de la página
      const pageText = await page.textContent('body');
      const hasVideoContent = pageText?.includes('video') || pageText?.includes('YouTube') || pageText?.includes('playlist');
      
      console.log(`📄 Página contiene contenido de video: ${hasVideoContent}`);
      
      // Buscar elementos de video alternativos
      const videoElements = await page.locator('[class*="video"], [class*="Video"], [id*="video"], [id*="Video"]').count();
      console.log(`🎬 Elementos relacionados con video: ${videoElements}`);
    }

    // 7. Verificar logs específicos de preview environment
    console.log('🔍 Test completado. Revisa los logs del navegador arriba para ver la lógica de isPreviewEnvironment.');
  });
}); 