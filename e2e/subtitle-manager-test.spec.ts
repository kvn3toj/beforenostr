import { test, expect } from '@playwright/test';

test.describe('Subtitle Manager - Version Anterior', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      console.error('Page error:', error.message);
    });

    // Login como administrador
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Navegar a configuración de video
    await page.goto('/items/1/config');
    await page.waitForTimeout(2000);
    
    // Hacer clic en la pestaña de subtítulos
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    await page.waitForTimeout(1000);
  });

  test('should display subtitle manager with previous version layout', async ({ page }) => {
    // Verificar que el título principal esté presente
    await expect(page.getByRole('heading', { name: /subtitle manager|administrador de subtítulos/i })).toBeVisible();
    
    // Verificar que el formulario de upload esté en un Paper (versión anterior)
    const uploadForm = page.locator('[data-testid="subtitle-upload-form"], .MuiPaper-root').first();
    await expect(uploadForm).toBeVisible();
    
    // Verificar que el título del formulario esté presente
    await expect(page.getByRole('heading', { name: /upload new subtitle|subir nuevo subtítulo/i })).toBeVisible();
    
    // Verificar que el selector de idioma esté presente
    await expect(page.getByRole('combobox', { name: /idioma|language/i })).toBeVisible();
    
    // Verificar que el botón de seleccionar archivo esté presente
    await expect(page.getByText(/seleccionar archivo|cargar archivo/i)).toBeVisible();
    
    // Verificar que haya un divider separando las secciones (versión anterior)
    const divider = page.locator('.MuiDivider-root');
    await expect(divider).toBeVisible();
    
    // Verificar la sección de subtítulos existentes
    await expect(page.getByRole('heading', { name: /subtítulos existentes|existing subtitles/i })).toBeVisible();
    
    console.log('✅ Subtitle Manager versión anterior funcionando correctamente');
  });

  test('should show empty state for subtitles', async ({ page }) => {
    // Verificar que se muestre el mensaje de estado vacío
    const emptyMessage = page.getByText(/no hay subtítulos|no subtitles|subtitle_list_empty/i);
    await expect(emptyMessage).toBeVisible();
    
    console.log('✅ Estado vacío de subtítulos mostrado correctamente');
  });

  test('should have upload form elements working', async ({ page }) => {
    // Verificar que el selector de idioma funcione
    await page.getByRole('combobox', { name: /idioma|language/i }).click();
    await expect(page.getByRole('option', { name: /español|english/i }).first()).toBeVisible();
    
    // Cerrar el selector
    await page.keyboard.press('Escape');
    
    // Verificar que el botón de upload esté deshabilitado inicialmente
    const uploadButton = page.getByRole('button', { name: /upload|subir/i });
    await expect(uploadButton).toBeDisabled();
    
    console.log('✅ Elementos del formulario de upload funcionando correctamente');
  });
}); 