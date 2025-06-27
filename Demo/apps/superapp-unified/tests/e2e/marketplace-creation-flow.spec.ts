import { test, expect } from '@playwright/test';

test.describe('Marketplace - Flujo Completo de Publicación', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar autenticación mock si es necesario
    await page.goto('/login');

    // Login con credenciales de test
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');

    // Esperar redirección exitosa
    await page.waitForURL('**/*', { timeout: 10000 });

    // Navegar al marketplace
    const menuButton = page.locator('[aria-label="Abrir menú principal"]');
    await expect(menuButton).toBeVisible({ timeout: 10000 });
    await menuButton.click();
    await page.click('text=Marketplace');
    await page.waitForURL('**/marketplace', { timeout: 10000 });
  });

  test('Debe abrir el modal de creación desde FAB desktop', async ({ page }) => {
    // Verificar que está en desktop y el FAB está visible
    await expect(page.locator('[data-testid="create-item-fab"]')).toBeVisible();

    // Hacer clic en el FAB
    await page.click('[data-testid="create-item-fab"]');

    // Verificar que el modal se abre
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();
    await expect(page.locator('text=Comparte tu oferta con la comunidad CoomÜnity')).toBeVisible();
  });

  test('Debe abrir el modal de creación desde SpeedDial mobile', async ({ page }) => {
    // Simular vista mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Buscar y hacer clic en el SpeedDial
    const speedDial = page.locator('[aria-label="Quick Actions"]');
    await expect(speedDial).toBeVisible();
    await speedDial.click();

    // Hacer clic en "Publicar Servicio"
    await page.click('text=Publicar Servicio');

    // Verificar que el modal se abre
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();
  });

  test('Debe crear un servicio completo exitosamente', async ({ page }) => {
    // Abrir modal de creación
    await page.click('[data-testid="create-item-fab"]');
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();

    // Llenar información básica
    await page.fill('input[placeholder*="Ej: Consultoría en Marketing Digital"]', 'Consultoría en Desarrollo Web');
    await page.fill('textarea[placeholder*="Describe detalladamente"]', 'Ofrezco servicios de desarrollo web con React, TypeScript y Node.js. Experiencia en aplicaciones modernas y escalables.');

    // Seleccionar tipo: Servicio (ya debería estar seleccionado por defecto)
    await page.click('text=Servicio');

    // Configurar precio
    await page.fill('input[type="number"]', '150');

    // Agregar tags
    await page.fill('input[placeholder="Agregar etiqueta..."]', 'desarrollo');
    await page.click('text=Agregar');

    await page.fill('input[placeholder="Agregar etiqueta..."]', 'react');
    await page.click('text=Agregar');

    // Verificar que los tags se agregaron
    await expect(page.locator('text=desarrollo')).toBeVisible();
    await expect(page.locator('text=react')).toBeVisible();

    // Agregar ubicación
    await page.fill('input[placeholder*="Ej: Bogotá, Colombia"]', 'Medellín, Colombia');

    // Verificar que el botón de crear está habilitado
    const createButton = page.locator('button:has-text("Crear Item")');
    await expect(createButton).toBeEnabled();

    // Crear el item
    await createButton.click();

    // Verificar mensaje de éxito
    await expect(page.locator('text=¡Item creado exitosamente!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Tu item ha sido publicado en CoomÜnity Marketplace')).toBeVisible();

    // El modal debe cerrarse automáticamente después del éxito
    await expect(page.locator('text=🌱 Crear Nuevo Item')).not.toBeVisible({ timeout: 3000 });
  });

  test('Debe crear un producto físico exitosamente', async ({ page }) => {
    await page.click('[data-testid="create-item-fab"]');
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();

    // Llenar datos del producto
    await page.fill('input[placeholder*="Ej: Consultoría en Marketing Digital"]', 'Café Orgánico Colombiano');
    await page.fill('textarea[placeholder*="Describe detalladamente"]', 'Café orgánico de origen directo de las montañas colombianas. Proceso artesanal sin químicos.');

    // Seleccionar tipo: Producto
    await page.click('text=Producto');

    // Configurar precio
    await page.fill('input[type="number"]', '25');

    // Agregar tags específicos para producto
    await page.fill('input[placeholder="Agregar etiqueta..."]', 'organico');
    await page.click('text=Agregar');

    await page.fill('input[placeholder="Agregar etiqueta..."]', 'cafe');
    await page.click('text=Agregar');

    // Agregar ubicación e imagen
    await page.fill('input[placeholder*="Ej: Bogotá, Colombia"]', 'Huila, Colombia');
    await page.fill('input[placeholder*="https://ejemplo.com/imagen.jpg"]', 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400');

    // Crear el producto
    await page.click('button:has-text("Crear Item")');

    // Verificar éxito
    await expect(page.locator('text=¡Item creado exitosamente!')).toBeVisible({ timeout: 5000 });
  });

  test('Debe validar campos obligatorios', async ({ page }) => {
    await page.click('[data-testid="create-item-fab"]');

    // Intentar crear sin llenar campos obligatorios
    const createButton = page.locator('button:has-text("Crear Item")');
    await expect(createButton).toBeDisabled();

    // Llenar solo el título (insuficiente)
    await page.fill('input[placeholder*="Ej: Consultoría en Marketing Digital"]', 'Test');
    await expect(createButton).toBeDisabled();

    // Agregar descripción corta (debería mostrar error)
    await page.fill('textarea[placeholder*="Describe detalladamente"]', 'Muy corta');
    await expect(page.locator('text=La descripción debe tener al menos 20 caracteres')).toBeVisible();

    // Descripción válida pero precio 0
    await page.fill('textarea[placeholder*="Describe detalladamente"]', 'Esta es una descripción suficientemente larga para el test');
    await page.fill('input[type="number"]', '0');
    await expect(createButton).toBeDisabled();

    // Precio válido - ahora debería estar habilitado
    await page.fill('input[type="number"]', '10');
    await expect(createButton).toBeEnabled();
  });

  test('Debe cerrar el modal correctamente', async ({ page }) => {
    await page.click('[data-testid="create-item-fab"]');
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();

    // Cerrar con X
    await page.click('button[aria-label="Close"]', { timeout: 5000 });
    await expect(page.locator('text=🌱 Crear Nuevo Item')).not.toBeVisible();

    // Abrir de nuevo y cerrar con Cancelar
    await page.click('[data-testid="create-item-fab"]');
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('text=🌱 Crear Nuevo Item')).not.toBeVisible();
  });

  test('Debe manejar errores de red graciosamente', async ({ page }) => {
    // Simular fallo de red
    await page.route('**/marketplace/items', route => {
      route.abort('failed');
    });

    await page.click('[data-testid="create-item-fab"]');

    // Llenar formulario válido
    await page.fill('input[placeholder*="Ej: Consultoría en Marketing Digital"]', 'Test con Error');
    await page.fill('textarea[placeholder*="Describe detalladamente"]', 'Esta es una descripción de prueba para simular error de red');
    await page.fill('input[type="number"]', '50');

    // Intentar crear
    await page.click('button:has-text("Crear Item")');

    // Verificar que muestra error
    await expect(page.locator('text=Error al crear el item')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Por favor intenta nuevamente')).toBeVisible();

    // El modal debe seguir abierto para permitir reintento
    await expect(page.locator('text=🌱 Crear Nuevo Item')).toBeVisible();
  });

  test('Debe funcionar con diferentes tipos de items', async ({ page }) => {
    const itemTypes = [
      { type: 'Servicio', description: 'Servicio de prueba' },
      { type: 'Producto', description: 'Producto de prueba' },
      { type: 'Experiencia', description: 'Experiencia de prueba' },
      { type: 'Intercambio', description: 'Intercambio de prueba' }
    ];

    for (const item of itemTypes) {
      await page.click('[data-testid="create-item-fab"]');

      await page.fill('input[placeholder*="Ej: Consultoría en Marketing Digital"]', `Test ${item.type}`);
      await page.fill('textarea[placeholder*="Describe detalladamente"]', `${item.description} con descripción suficientemente larga`);

      // Seleccionar tipo específico
      await page.click(`text=${item.type}`);

      await page.fill('input[type="number"]', '30');

      // Verificar que el botón está habilitado para cada tipo
      await expect(page.locator('button:has-text("Crear Item")')).toBeEnabled();

      // Cerrar modal para la siguiente iteración
      await page.click('button:has-text("Cancelar")');
    }
  });
});
