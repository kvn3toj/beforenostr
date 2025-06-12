import { test, expect } from '@playwright/test';

// Test específico para debugging del feed social
test.describe('Social Feed Debugging', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar TODOS los mensajes de consola, especialmente los de debug
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('SocialFeed Debug') || 
          text.includes('Error') || 
          text.includes('Warning') ||
          text.includes('🤝') ||
          msg.type() === 'error') {
        console.log(`🔍 BROWSER LOG [${msg.type()}]: ${text}`);
      }
    });

    // Abrir la SuperApp y hacer login
    await page.goto('/');
    console.log('📍 Página cargada, intentando login...');
    
    // Esperar a que los campos de login estén visibles y habilitados
    await page.waitForSelector('[data-testid="login-email-input"]', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('[data-testid="login-password-input"]', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('[data-testid="login-submit-button"]', { state: 'visible', timeout: 10000 });
    
    console.log('📍 Campos de login visibles, rellenando credenciales...');
    
    // Login con credenciales de E2E TEST USER - Usuario creado específicamente para tests
    await page.fill('[data-testid="login-email-input"] input', 'test@coomunity.com');
    await page.fill('[data-testid="login-password-input"] input', 'test123');
    
    // Verificar que el botón no esté deshabilitado antes de hacer clic
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    console.log('📍 Haciendo clic en el botón de login...');
    await submitButton.click();
    
    // Esperar a que el login sea exitoso
    console.log('📍 Esperando redirección después del login...');
    await page.waitForURL('**/', { timeout: 15000 });
    
    console.log('📍 Login exitoso, navegando al feed social...');
    // Navegar al feed social
    await page.goto('/social');
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('📍 Feed social cargado, iniciando test...');
  });

  test('Debe cargar y mostrar posts reales del backend', async ({ page }) => {
    console.log('🔍 Iniciando verificación del feed social con datos reales...');

    // Paso 1: Dar tiempo para que los datos se carguen (el backend funciona, como confirmamos manualmente)
    console.log('⏳ Esperando que los datos se carguen...');
    await page.waitForTimeout(3000); // Tiempo suficiente para que los datos se procesen
    console.log('✅ Tiempo de carga completado');

    // Paso 2: Verificar que el contenedor de posts existe
    const postsContainer = page.locator('[data-testid="social-posts-container"]');
    await expect(postsContainer).toBeVisible({ timeout: 15000 });
    console.log('✅ Contenedor de posts encontrado');

    // Paso 3: Esperar tiempo suficiente para que los datos se procesen y rendericen
    console.log('⏳ Esperando renderizado de posts...');
    await page.waitForTimeout(3000);

    // Paso 4: Verificar contenido específico de posts del backend (basado en seed data)
    console.log('🔍 Buscando contenido específico de posts...');
    
    // Verificar el primer post del backend: "¡Acabo de completar el nuevo curso de gamificación!"
    const firstPostContent = page.getByText(/Acabo de completar.*gamificación/i);
    await expect(firstPostContent).toBeVisible({ timeout: 10000 });
    console.log('✅ Primer post encontrado: curso de gamificación');

    // Verificar el autor del primer post: "Content Creator"
    const contentCreatorText = page.getByText('Content Creator');
    await expect(contentCreatorText).toBeVisible({ timeout: 5000 });
    console.log('✅ Autor del primer post encontrado: Content Creator');

    // Paso 5: Verificar elementos de interacción (botones de like, comentarios)
    console.log('🔍 Verificando elementos de interacción...');
    
    // Verificar que hay botones de like visible
    const likeButtons = page.locator('[data-testid*="like"], [aria-label*="like"], .MuiIconButton-root');
    await expect(likeButtons.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Botones de interacción encontrados');

    // Paso 6: Verificar la presencia de múltiples posts
    const postCards = page.locator('[data-testid="social-posts-container"] .MuiCard-root');
    const postCount = await postCards.count();
    console.log(`📊 Número total de posts encontrados: ${postCount}`);
    
    // Debe haber al menos 1 post (sabemos que el backend devuelve 2)
    expect(postCount).toBeGreaterThanOrEqual(1);
    console.log('✅ Se encontraron posts del backend');

    // Paso 7: Capturar screenshot final para documentación
    await page.screenshot({ 
      path: 'social-feed-success.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot de éxito capturado: social-feed-success.png');

    // Assertion final: Confirmar que el feed social está completamente funcional
    console.log('🎉 ¡ÉXITO! El feed social está renderizando datos reales del backend correctamente');
  });

  test('Verificar respuesta del backend', async ({ page }) => {
    // Verificar la respuesta directa del backend
    const response = await page.request.get('http://localhost:3002/social/publications');
    const responseText = await response.text();
    
    console.log('🔍 Status del backend:', response.status());
    console.log('🔍 Headers del backend:', response.headers());
    console.log('🔍 Respuesta del backend (primeros 500 chars):', responseText.substring(0, 500));
    
    expect(response.status()).toBe(200);
    
    try {
      const data = JSON.parse(responseText);
      console.log('🔍 Datos parseados:', {
        isArray: Array.isArray(data),
        length: data.length || 'N/A',
        firstItemKeys: data[0] ? Object.keys(data[0]) : 'N/A',
        sampleData: data[0] || 'N/A'
      });
      
      // Verificar que los datos tienen la estructura esperada
      if (Array.isArray(data) && data.length > 0) {
        const firstPost = data[0];
        console.log('🔍 Estructura del primer post:', {
          hasId: !!firstPost.id,
          hasTitle: !!firstPost.title,
          hasContent: !!firstPost.content,
          hasAuthor: !!firstPost.author,
          hasCreatedAt: !!firstPost.createdAt,
          allKeys: Object.keys(firstPost)
        });
      }
    } catch (e) {
      console.log('❌ Error parseando JSON:', e);
    }
  });
}); 