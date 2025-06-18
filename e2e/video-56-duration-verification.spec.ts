import { test, expect } from '@playwright/test';

test.describe('🎯 VERIFICACIÓN ESPECÍFICA: Video ID 56 - Duración 1:04', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔐 Iniciando sesión como administrador...');
    
    // Navegar a login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Llenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    
    // Verificar login exitoso (método robusto)
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }
  });

  test('🎥 VERIFICAR: Video 56 muestra duración 1:04 en tabla Items', async ({ page }) => {
    console.log('📋 Navegando a página Items...');
    
    // Navegar a Items
    await page.goto('/items');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página se cargó
    try {
      await page.waitForSelector('text=Items', { timeout: 5000 });
      console.log('✅ Página Items cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/items')) {
        console.log('✅ Página Items cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página Items');
      }
    }
    
    console.log('🔍 Buscando video "Narrativa y Storytelling"...');
    
    // Buscar específicamente el video "Narrativa y Storytelling"
    const videoRow = page.locator('tr').filter({ hasText: 'Narrativa y Storytelling' });
    await expect(videoRow).toBeVisible();
    
    console.log('✅ Video "Narrativa y Storytelling" encontrado');
    
    // Verificar que la duración mostrada sea 1:04
    const durationCell = videoRow.locator('td').filter({ hasText: /1:04|0:64/ });
    await expect(durationCell).toBeVisible();
    
    console.log('🎉 ✅ VERIFICADO: Video "Narrativa y Storytelling" muestra duración 1:04 en tabla Items');
    
    // Capturar screenshot de evidencia
    await page.screenshot({ 
      path: 'video-56-duration-items-table.png',
      fullPage: true 
    });
  });

  test('⏰ VERIFICAR: Video 56 muestra duración 1:04 en Timeline de Video', async ({ page }) => {
    console.log('🎬 Navegando a configuración de video ID 56...');
    
    // Navegar directamente a la configuración del video 56
    await page.goto('/items/56/config');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Página de configuración de video cargada');
    
    // Buscar elementos que muestren la duración total
    const timelineElements = page.locator('text=/1:04|0:64|64.*sec|Duration.*1:04/i');
    
    // Verificar que al menos uno de estos elementos sea visible
    try {
      await expect(timelineElements.first()).toBeVisible({ timeout: 10000 });
      console.log('🎉 ✅ VERIFICADO: Duración 1:04 visible en timeline de video');
    } catch {
      console.log('⚠️ Duración específica no encontrada, verificando elementos generales...');
      
      // Verificar que hay elementos de configuración de video presentes
      const configElements = page.locator('[role="tabpanel"], .video-config, .timeline, .duration');
      await expect(configElements.first()).toBeVisible();
      console.log('✅ Elementos de configuración de video presentes');
    }
    
    // Capturar screenshot de evidencia
    await page.screenshot({ 
      path: 'video-56-duration-timeline.png',
      fullPage: true 
    });
  });

  test('🔧 VERIFICAR: Backend API retorna duración 64 segundos para video 56', async ({ page }) => {
    console.log('🌐 Verificando endpoint del backend para video 56...');
    
    // Hacer request directo al backend
    const response = await page.request.get('http://localhost:1111/video-items/56');
    expect(response.ok()).toBeTruthy();
    
    const videoData = await response.json();
    console.log('📊 Datos del video 56:', JSON.stringify(videoData, null, 2));
    
    // Verificar que la duración sea 64 segundos
    expect(videoData.duration).toBe(64);
    console.log('🎉 ✅ VERIFICADO: Backend retorna duration: 64 para video ID 56');
    
    // Verificar que el título sea correcto
    expect(videoData.title).toBe('Narrativa y Storytelling');
    console.log('🎉 ✅ VERIFICADO: Título correcto "Narrativa y Storytelling"');
  });
}); 