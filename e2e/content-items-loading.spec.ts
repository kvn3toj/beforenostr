import { test, expect } from '@playwright/test';

test.describe('Gamifier Admin Frontend - Content Items Loading', () => {
  const ADMIN_EMAIL = 'admin@gamifier.com';
  const ADMIN_PASSWORD = 'admin123';
  const FRONTEND_URL = 'http://localhost:3000';
  const BACKEND_BASE_URL = 'http://localhost:3002';

  test('should correctly load and display content items', async ({ page }) => {
    // Configurar listeners para capturar errores de red y consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 CONSOLE ERROR:', msg.text());
      }
    });

    page.on('response', response => {
      if (!response.ok()) {
        console.log('🔴 NETWORK ERROR:', response.status(), response.url());
      }
    });

    await page.goto(FRONTEND_URL);
    console.log('📱 Navegando al frontend...');

    // 1. Intentar iniciar sesión como administrador
    console.log('🔐 Iniciando sesión como administrador...');
    
    // Buscar campos de login
    const emailField = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    const passwordField = page.locator('input[name="password"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")');

    await emailField.fill(ADMIN_EMAIL);
    await passwordField.fill(ADMIN_PASSWORD);
    await submitButton.click();

    // Esperar a que la navegación post-login se complete
    await page.waitForLoadState('networkidle');
    console.log('✅ Login completado, esperando navegación...');

    // 2. Navegar a la sección de Content Items
    console.log('📋 Buscando navegación a Content Items...');
    
    // Buscar múltiples formas de navegar a items/content
    const itemsLink = page.locator('text="Items", text="Content", text="Videos", a[href*="items"], a[href*="content"]').first();
    
    if (await itemsLink.isVisible()) {
      await itemsLink.click();
      console.log('🔗 Navegando mediante link de Items/Content...');
    } else {
      // Intentar navegación directa si no encontramos el link
      await page.goto(`${FRONTEND_URL}/items`);
      console.log('🔗 Navegación directa a /items...');
    }

    await page.waitForLoadState('networkidle');

    // 3. **Confirmar el error observado en la imagen**
    console.log('🔍 Verificando si existe el error "Error loading content items"...');
    
    const errorMessageLocator = page.locator('text="Error loading content items"');
    const cannotGetLocator = page.locator('text*="Cannot GET"');
    const apiErrorLocator = page.locator('text*="/content/items/test"');

    // Tomar screenshot del estado actual
    await page.screenshot({ path: 'debug-content-items-error.png', fullPage: true });
    console.log('📸 Screenshot guardado: debug-content-items-error.png');

    // Verificar si vemos el error específico
    const hasErrorMessage = await errorMessageLocator.isVisible();
    const hasCannotGet = await cannotGetLocator.isVisible();
    const hasApiError = await apiErrorLocator.isVisible();

    console.log('📊 Estado de errores:');
    console.log('  - "Error loading content items":', hasErrorMessage);
    console.log('  - "Cannot GET":', hasCannotGet);
    console.log('  - "/content/items/test":', hasApiError);

    if (hasErrorMessage || hasCannotGet || hasApiError) {
      console.log('❌ CONFIRMADO: Error detectado en la carga de content items');
      console.log('🔧 DIAGNÓSTICO: El frontend está llamando a una ruta incorrecta');
      console.log('📡 Backend correcto: GET /video-items');
      console.log('📡 Frontend actual: GET /content/items/test (INCORRECTO)');
      
      // Intentar llamar directamente al backend correcto para verificar que funciona
      const backendResponse = await page.request.get(`${BACKEND_BASE_URL}/video-items`);
      console.log('✅ Verificación backend directo:', backendResponse.status());
      
      if (backendResponse.ok()) {
        const data = await backendResponse.json();
        console.log('📊 Backend responde correctamente con', data.length || 0, 'items');
      }
    } else {
      console.log('✅ No se detectaron errores - verificando contenido cargado...');
      
      // Buscar indicadores de contenido cargado exitosamente
      const contentTable = page.locator('table, .content-grid, .video-list');
      const videoItems = page.locator('text*="Cómo conocer tu propósito", text*="video", text*="TED"');
      
      const hasContent = await contentTable.isVisible();
      const hasVideoItems = await videoItems.first().isVisible();
      
      console.log('📊 Estado del contenido:');
      console.log('  - Tabla/Grid visible:', hasContent);
      console.log('  - Video items visible:', hasVideoItems);
      
      if (hasContent || hasVideoItems) {
        console.log('🎉 ÉXITO: Content items cargados correctamente');
      } else {
        console.log('⚠️  ADVERTENCIA: No se detectaron errores ni contenido - estado incierto');
      }
    }

    // Obtener el HTML de la página para análisis manual si es necesario
    const pageContent = await page.content();
    console.log('📄 Contenido de página capturado para análisis (longitud:', pageContent.length, 'caracteres)');
  });
}); 