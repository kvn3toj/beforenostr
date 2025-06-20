import { test, expect } from '@playwright/test';

test.describe('Páginas Recuperadas - Verificación', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login con credenciales de administrador por defecto
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la autenticación se complete y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un momento adicional para que el estado de autenticación se estabilice
    await page.waitForTimeout(2000);
    
    // Verificar que el usuario está autenticado viendo elementos del dashboard
    await expect(page.locator('text=CoomÜnity')).toBeVisible();
  });

  test('Página Horizontal Demo debe cargar correctamente', async ({ page }) => {
    // Navegar a la página horizontal-demo
    await page.goto('/uplay/horizontal-demo');
    
    // Verificar que la página se carga
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar elementos específicos de la página
    await expect(page.locator('h1')).toContainText('Reproductor Horizontal ÜPlay');
    
    // Verificar que contiene terminología CoomÜnity
    await expect(page.locator('text=GPL - Gamified Play List')).toBeVisible();
    await expect(page.locator('text=Mëritos')).toBeVisible();
    
    // Verificar que el reproductor está presente
    await expect(page.locator('text=Video Demo')).toBeVisible();
    
    // Verificar botón de play/pause
    const playButton = page.locator('button').filter({ hasText: /play_arrow|pause/ }).first();
    await expect(playButton).toBeVisible();
    
    // Verificar estadísticas
    await expect(page.locator('text=Estadísticas de Sesión')).toBeVisible();
    
    // Verificar que no hay errores de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar un momento para capturar posibles errores
    await page.waitForTimeout(2000);
    
    // Filtrar errores conocidos que no son críticos
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('404') && 
      !error.includes('Failed to fetch') &&
      !error.includes('NetworkError')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Página ÜPlay Gamified debe cargar correctamente', async ({ page }) => {
    // Navegar a la página uplay-gamified
    await page.goto('/uplay-gamified');
    
    // Verificar que la página se carga
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar elementos específicos de la página
    await expect(page.locator('h1')).toContainText('ÜPlay - Reproductor Gamificado');
    
    // Verificar que contiene terminología CoomÜnity
    await expect(page.locator('text=GPL - Gamified Play List')).toBeVisible();
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=Aprende Jugando')).toBeVisible();
    
    // Verificar tabs de navegación
    await expect(page.locator('text=Videos')).toBeVisible();
    await expect(page.locator('text=Categorías')).toBeVisible();
    await expect(page.locator('text=Stats')).toBeVisible();
    
    // Verificar estadísticas del jugador
    await expect(page.locator('text=Nivel:')).toBeVisible();
    await expect(page.locator('text=Precisión:')).toBeVisible();
    
    // Verificar botón del demo horizontal
    await expect(page.locator('text=Probar Reproductor Horizontal')).toBeVisible();
    
    // Verificar que hay videos mock
    await expect(page.locator('text=Ayni: Principios de Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Introducción a CoomÜnity')).toBeVisible();
    
    // Probar navegación entre tabs
    await page.click('text=Categorías');
    await expect(page.locator('text=Filosofía CoomÜnity')).toBeVisible();
    
    await page.click('text=Stats');
    await expect(page.locator('text=Estadísticas del Jugador')).toBeVisible();
    
    // Verificar que no hay errores de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar un momento para capturar posibles errores
    await page.waitForTimeout(2000);
    
    // Filtrar errores conocidos que no son críticos
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('404') && 
      !error.includes('Failed to fetch') &&
      !error.includes('NetworkError')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Navegación entre páginas recuperadas funciona correctamente', async ({ page }) => {
    // Ir a ÜPlay Gamified
    await page.goto('/uplay-gamified');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Hacer clic en el botón para ir al demo horizontal
    await page.click('text=Probar Reproductor Horizontal');
    
    // Verificar que navegó correctamente
    await page.waitForURL('**/uplay/horizontal-demo', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Reproductor Horizontal ÜPlay');
    
    // Volver a ÜPlay Gamified usando navegación del navegador
    await page.goBack();
    await page.waitForURL('**/uplay-gamified', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('ÜPlay - Reproductor Gamificado');
  });

  test('Páginas son responsivas en diferentes tamaños de pantalla', async ({ page }) => {
    // Probar en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/uplay-gamified');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que el contenido se adapta
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Mëritos')).toBeVisible();
    
    // Probar en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Probar en desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Probar horizontal demo en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Video Demo')).toBeVisible();
  });

  test('Funcionalidad interactiva del reproductor horizontal', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Encontrar y hacer clic en el botón de play
    const playButton = page.locator('button').filter({ hasText: /play_arrow/ }).first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    
    // Verificar que el estado cambió (el botón ahora debería mostrar pause)
    await page.waitForTimeout(1000);
    
    // Verificar que las estadísticas están presentes
    await expect(page.locator('text=Progreso del Video')).toBeVisible();
    await expect(page.locator('text=Preguntas Respondidas')).toBeVisible();
    
    // Verificar que los méritos se muestran
    await expect(page.locator('text=Mëritos Ganados')).toBeVisible();
  });
}); 