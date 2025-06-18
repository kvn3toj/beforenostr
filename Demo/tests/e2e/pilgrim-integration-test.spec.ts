import { test, expect } from '@playwright/test';

test.describe('Pilgrim Integration Test - Experiencia de Video Interactivo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3333');
  });

  test('Pilgrim está completamente integrado', async ({ page }) => {
    // 1. Navegar a Pilgrim
    await page.click('text=Pilgrim');
    await page.waitForSelector('h1:has-text("Pilgrim Journey")');

    // 2. Verificar elementos principales del reproductor
    await expect(page.locator('h1')).toContainText('Pilgrim Journey');
    await expect(page.locator('text=Experiencia gamificada de desarrollo personal')).toBeVisible();

    // 3. Verificar chips de información del reproductor
    await expect(page.locator('text=Reproductor Vimeo')).toBeVisible();
    await expect(page.locator('text=4 Botones Flotantes')).toBeVisible();
    await expect(page.locator('text=Experiencia Interactiva')).toBeVisible();

    // 4. Verificar reproductor de video placeholder
    await expect(page.locator('text=CoomÜnity Pilgrim Experience')).toBeVisible();
    await expect(page.locator('text=Video ID: 383005433')).toBeVisible();
    await expect(page.locator('text=Reproductor personalizado CoomÜnity')).toBeVisible();

    // 5. Verificar análisis del reproductor
    await expect(page.locator('text=🔍 Análisis del Reproductor')).toBeVisible();
    await expect(page.locator('text=Reproductor Vimeo integrado')).toBeVisible();
    await expect(page.locator('text=Botones flotantes hexagonales')).toBeVisible();
    await expect(page.locator('text=Overlays interactivos')).toBeVisible();
    await expect(page.locator('text=Elementos interactivos')).toBeVisible();

    // 6. Verificar navegación flotante simulada
    await expect(page.locator('text=🎯 Navegación Flotante')).toBeVisible();
    await expect(page.locator('text=Cinema')).toBeVisible();
    await expect(page.locator('text=Plaza')).toBeVisible();
    await expect(page.locator('text=Aldea')).toBeVisible();

    // 7. Verificar descripciones de las secciones
    await expect(page.locator('text=Experiencias audiovisuales inmersivas')).toBeVisible();
    await expect(page.locator('text=Intercambio y marketplace')).toBeVisible();
    await expect(page.locator('text=Comunidad y conexiones')).toBeVisible();

    // 8. Verificar botón flotante principal
    const floatingButton = page.locator('[data-testid="fab"]').or(page.locator('button[aria-label*="floating"]')).or(page.locator('button:has([data-testid="SportsEsportsIcon"])')).first();
    await expect(floatingButton).toBeVisible();

    // 9. Probar interacción con botón flotante
    await floatingButton.click();
    
    // 10. Verificar que aparecen los mini botones flotantes
    await page.waitForTimeout(500); // Esperar animación
    const miniButtons = page.locator('button[size="small"]').or(page.locator('button:has([data-testid="MovieCreationIcon"])'));
    await expect(miniButtons.first()).toBeVisible();

    // 11. Probar overlay de Cinema
    await page.click('text=Cinema');
    await page.waitForSelector('text=Sección Cinema');
    await expect(page.locator('text=Sección Cinema')).toBeVisible();
    await expect(page.locator('text=🎭 Cinema')).toBeVisible();
    await expect(page.locator('text=Overlay Interactivo')).toBeVisible();
    
    // Cerrar overlay
    await page.click('[aria-label="close"]').or(page.locator('button:has([data-testid="CloseIcon"])')).first();

    // 12. Probar overlay de Plaza
    await page.click('text=Plaza');
    await page.waitForSelector('text=Sección Plaza');
    await expect(page.locator('text=Sección Plaza')).toBeVisible();
    await expect(page.locator('text=🎭 Plaza')).toBeVisible();
    
    // Cerrar overlay
    await page.click('[aria-label="close"]').or(page.locator('button:has([data-testid="CloseIcon"])')).first();

    // 13. Probar overlay de Aldea
    await page.click('text=Aldea');
    await page.waitForSelector('text=Sección Aldea');
    await expect(page.locator('text=Sección Aldea')).toBeVisible();
    await expect(page.locator('text=🎭 Aldea')).toBeVisible();
    
    // Cerrar overlay
    await page.click('[aria-label="close"]').or(page.locator('button:has([data-testid="CloseIcon"])')).first();
  });

  test('Verificar que no hay indicadores de desarrollo', async ({ page }) => {
    await page.click('text=Pilgrim');
    await page.waitForSelector('h1:has-text("Pilgrim Journey")');

    // Verificar que NO aparecen indicadores de desarrollo
    await expect(page.locator('text=en desarrollo')).not.toBeVisible();
    await expect(page.locator('text=pendiente')).not.toBeVisible();
    await expect(page.locator('text=próximamente')).not.toBeVisible();
  });

  test('Verificar datos del análisis extraído integrados', async ({ page }) => {
    await page.click('text=Pilgrim');
    await page.waitForSelector('h1:has-text("Pilgrim Journey")');

    // Datos específicos del análisis de coomunity_pilgrim_demo
    await expect(page.locator('text=Reproductor con 4 botones flotantes hexagonales')).toBeVisible();
    await expect(page.locator('text=2 overlays interactivos')).toBeVisible();
    await expect(page.locator('text=navegación inmersiva entre Cinema, Plaza y Aldea')).toBeVisible();
    
    // Conteos del análisis
    await expect(page.locator('text=Cantidad: 1')).toBeVisible(); // Reproductor Vimeo
    await expect(page.locator('text=Cantidad: 4')).toBeVisible(); // Botones flotantes
    await expect(page.locator('text=Cantidad: 2')).toBeVisible(); // Overlays
    await expect(page.locator('text=Cantidad: 5')).toBeVisible(); // Elementos interactivos
  });

  test('Verificar funcionalidad de botones flotantes', async ({ page }) => {
    await page.click('text=Pilgrim');
    await page.waitForSelector('h1:has-text("Pilgrim Journey")');

    // Encontrar el botón flotante principal
    const floatingButton = page.locator('button:has([data-testid="SportsEsportsIcon"])').first();
    
    // Click para abrir menú flotante
    await floatingButton.click();
    await page.waitForTimeout(300);

    // Verificar que los mini botones aparecen con animación
    const cinemaButton = page.locator('button:has([data-testid="MovieCreationIcon"])').first();
    const plazaButton = page.locator('button:has([data-testid="ShoppingCartIcon"])').first();
    const aldeaButton = page.locator('button:has([data-testid="GroupIcon"])').first();

    await expect(cinemaButton).toBeVisible();
    await expect(plazaButton).toBeVisible();
    await expect(aldeaButton).toBeVisible();

    // Probar funcionalidad de cada mini botón
    await cinemaButton.click();
    await expect(page.locator('text=Sección Cinema')).toBeVisible();
    await page.keyboard.press('Escape');

    // Reabrir menú para probar siguiente botón
    await floatingButton.click();
    await page.waitForTimeout(300);
    await plazaButton.click();
    await expect(page.locator('text=Sección Plaza')).toBeVisible();
    await page.keyboard.press('Escape');

    // Reabrir menú para probar último botón
    await floatingButton.click();
    await page.waitForTimeout(300);
    await aldeaButton.click();
    await expect(page.locator('text=Sección Aldea')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Verificar cambio en el contenido comparado con estado anterior', async ({ page }) => {
    await page.click('text=Pilgrim');
    await page.waitForSelector('h1:has-text("Pilgrim Journey")');

    // Contar elementos para verificar el aumento de contenido
    const content = await page.textContent('main');
    const contentLength = content?.length || 0;

    // El contenido anterior era muy básico (~287 caracteres)
    // El nuevo debe ser significativamente mayor (>2000 caracteres)
    expect(contentLength).toBeGreaterThan(2000);

    // Verificar elementos clave que confirman la integración
    const keyElements = [
      'CoomÜnity Pilgrim Experience',
      'Video ID: 383005433',
      'Análisis del Reproductor',
      'Navegación Flotante',
      'Overlay Interactivo',
      'Experiencias audiovisuales inmersivas',
      'Intercambio y marketplace',
      'Comunidad y conexiones'
    ];

    for (const element of keyElements) {
      await expect(page.locator(`text=${element}`)).toBeVisible();
    }
  });
}); 