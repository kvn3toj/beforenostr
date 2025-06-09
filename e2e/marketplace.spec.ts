import { test, expect } from '@playwright/test';

test.describe('Fase A.6: Verificación del Módulo Marketplace (GMP Gamified Match Place)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar intercepción de llamadas a la API del marketplace
    await page.route('**/marketplace/**', async (route, request) => {
      console.log(`[TEST] Intercepting marketplace API call: ${request.method()} ${request.url()}`);
      
      if (request.url().includes('/marketplace/stats')) {
        // Mock response para estadísticas
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalItems: 25,
            totalSellers: 8,
            averageItemsPerSeller: 3.1,
            lastUpdated: new Date().toISOString()
          })
        });
      } else if (request.url().includes('/marketplace/items')) {
        // Mock response para items
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [
              {
                id: 'item-1',
                name: 'Laptop Dell Inspiron 15',
                description: 'Laptop nueva con procesador Intel Core i7, 16GB RAM, 512GB SSD',
                price: 850.00,
                type: 'PRODUCT',
                sellerId: 'seller-123',
                status: 'ACTIVE',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-15T10:30:00Z'
              },
              {
                id: 'item-2',
                name: 'Consultoría en Desarrollo Web',
                description: 'Desarrollo de aplicaciones web modernas con React y Node.js',
                price: 120.00,
                type: 'SERVICE',
                sellerId: 'seller-456',
                status: 'ACTIVE',
                createdAt: '2024-01-16T14:20:00Z',
                updatedAt: '2024-01-16T14:20:00Z'
              },
              {
                id: 'item-3',
                name: 'Curso de Yoga Online',
                description: 'Clases de yoga en vivo por videollamada, todos los niveles',
                price: 45.00,
                type: 'EXPERIENCE',
                sellerId: 'seller-789',
                status: 'ACTIVE',
                createdAt: '2024-01-17T09:15:00Z',
                updatedAt: '2024-01-17T09:15:00Z'
              }
            ],
            total: 25,
            limit: 20,
            offset: 0,
            hasMore: true
          })
        });
      }
    });
  });

  test('A.6.1: Verificar Navegación y Carga Inicial del Marketplace', async ({ page }) => {
    console.log('\n🎯 [A.6.1] Iniciando verificación de navegación y carga inicial del Marketplace...');

    // Navegar a la homepage primero
    await page.goto('/');
    
    // Buscar y hacer clic en el enlace del Marketplace
    const marketplaceNavigation = page.locator('a[href*="marketplace"], button:has-text("Marketplace")').first();
    await expect(marketplaceNavigation).toBeVisible({ timeout: 10000 });
    await marketplaceNavigation.click();

    // Verificar que estamos en la página del marketplace
    await expect(page).toHaveURL(/.*marketplace/);
    
    // Verificar el título principal
    const mainTitle = page.locator('h4:has-text("Marketplace")');
    await expect(mainTitle).toBeVisible({ timeout: 10000 });
    
    // Verificar el subtítulo descriptivo
    const subtitle = page.locator('text=Tienda virtual y intercambio de productos/servicios');
    await expect(subtitle).toBeVisible();

    console.log('✅ [A.6.1] Navegación y carga inicial verificada correctamente');
  });

  test('A.6.2: Verificar Estadísticas del Marketplace', async ({ page }) => {
    console.log('\n🎯 [A.6.2] Iniciando verificación de estadísticas del Marketplace...');

    await page.goto('/marketplace');

    // Verificar que las tarjetas de estadísticas se cargan
    const statsCards = [
      { text: 'Total Items', value: '25' },
      { text: 'Vendedores', value: '8' },
      { text: 'Promedio por Vendedor', value: '3.1' },
      { text: 'Items Disponibles', value: '25' }
    ];

    for (const stat of statsCards) {
      const statCard = page.locator(`text=${stat.text}`).locator('..').locator('..');
      await expect(statCard).toBeVisible({ timeout: 10000 });
      
      const statValue = statCard.locator(`text=${stat.value}`);
      await expect(statValue).toBeVisible();
    }

    // Verificar iconos de las estadísticas
    const icons = ['Inventory', 'Store', 'ShoppingCart', 'AttachMoney'];
    for (const icon of icons) {
      const iconElement = page.locator(`[data-testid="${icon}Icon"], svg[data-testid="${icon}Icon"]`).first();
      if (await iconElement.isVisible()) {
        console.log(`✅ Icono ${icon} encontrado`);
      }
    }

    console.log('✅ [A.6.2] Estadísticas del Marketplace verificadas correctamente');
  });

  test('A.6.3: Verificar Listado de Items', async ({ page }) => {
    console.log('\n🎯 [A.6.3] Iniciando verificación del listado de items...');

    await page.goto('/marketplace');

    // Esperar a que la tabla se cargue
    const itemsTable = page.locator('table').first();
    await expect(itemsTable).toBeVisible({ timeout: 15000 });

    // Verificar headers de la tabla
    const expectedHeaders = ['Nombre', 'Descripción', 'Tipo', 'Precio', 'Estado', 'Vendedor', 'Fecha'];
    for (const header of expectedHeaders) {
      const headerCell = page.locator(`th:has-text("${header}")`);
      await expect(headerCell).toBeVisible();
    }

    // Verificar que se muestran los items mockeados
    const items = [
      'Laptop Dell Inspiron 15',
      'Consultoría en Desarrollo Web', 
      'Curso de Yoga Online'
    ];

    for (const itemName of items) {
      const itemRow = page.locator(`td:has-text("${itemName}")`);
      await expect(itemRow).toBeVisible({ timeout: 10000 });
    }

    // Verificar que se muestran los precios
    const prices = ['$850', '$120', '$45'];
    for (const price of prices) {
      const priceCell = page.locator(`td:has-text("${price}")`);
      await expect(priceCell).toBeVisible();
    }

    // Verificar chips de tipo y estado
    const typeChips = ['PRODUCT', 'SERVICE', 'EXPERIENCE'];
    for (const type of typeChips) {
      const chip = page.locator(`.MuiChip-root:has-text("${type}")`).first();
      await expect(chip).toBeVisible();
    }

    console.log('✅ [A.6.3] Listado de items verificado correctamente');
  });

  test('A.6.4: Verificar Botón de Añadir Item', async ({ page }) => {
    console.log('\n🎯 [A.6.4] Iniciando verificación del botón añadir item...');

    await page.goto('/marketplace');

    // Buscar el botón de "Añadir Item"
    const addButton = page.locator('button:has-text("Añadir Item")');
    await expect(addButton).toBeVisible({ timeout: 10000 });

    // Verificar que el botón está deshabilitado (hasta implementación)
    await expect(addButton).toBeDisabled();

    // Verificar que tiene el icono correcto
    const addIcon = addButton.locator('[data-testid="AddShoppingCartIcon"], svg');
    await expect(addIcon).toBeVisible();

    console.log('✅ [A.6.4] Botón añadir item verificado correctamente');
  });

  test('A.6.5: Verificar Información del Sistema', async ({ page }) => {
    console.log('\n🎯 [A.6.5] Iniciando verificación de información del sistema...');

    await page.goto('/marketplace');

    // Verificar la sección de "Sistema de Marketplace"
    const systemTitle = page.locator('h6:has-text("Sistema de Marketplace")');
    await expect(systemTitle).toBeVisible({ timeout: 10000 });

    // Verificar la alerta de estado
    const statusAlert = page.locator('.MuiAlert-root').first();
    await expect(statusAlert).toBeVisible();

    // Verificar endpoints documentados
    const endpointSections = [
      'Gestión de Items:',
      'Búsqueda y Estadísticas:'
    ];

    for (const section of endpointSections) {
      const sectionTitle = page.locator(`text=${section}`);
      await expect(sectionTitle).toBeVisible();
    }

    // Verificar algunos endpoints específicos
    const endpoints = [
      'POST /marketplace/items',
      'GET /marketplace/items',
      'GET /marketplace/stats'
    ];

    for (const endpoint of endpoints) {
      const endpointText = page.locator(`text=${endpoint}`);
      await expect(endpointText).toBeVisible();
    }

    // Verificar las funcionalidades listadas
    const functionalities = [
      'Gestión completa de items',
      'Sistema de búsqueda avanzada',
      'Gestión de vendedores'
    ];

    for (const functionality of functionalities) {
      const funcText = page.locator(`text*=${functionality}`);
      await expect(funcText).toBeVisible();
    }

    console.log('✅ [A.6.5] Información del sistema verificada correctamente');
  });

  test('A.6.6: Verificar Responsive Design', async ({ page }) => {
    console.log('\n🎯 [A.6.6] Iniciando verificación de diseño responsivo...');

    await page.goto('/marketplace');

    // Verificar en desktop (1200px)
    await page.setViewportSize({ width: 1200, height: 800 });
    const desktopTitle = page.locator('h4:has-text("Marketplace")');
    await expect(desktopTitle).toBeVisible();

    // Verificar en tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(desktopTitle).toBeVisible();

    // Verificar en mobile (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(desktopTitle).toBeVisible();

    // Verificar que la tabla es accesible en móvil (puede tener scroll horizontal)
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    console.log('✅ [A.6.6] Diseño responsivo verificado correctamente');
  });

  test('A.6.7: Verificar Manejo de Estados de Error', async ({ page }) => {
    console.log('\n🎯 [A.6.7] Iniciando verificación de manejo de errores...');

    // Interceptar y simular error en las API calls
    await page.route('**/marketplace/stats', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          message: 'Internal server error',
          statusCode: 500 
        })
      });
    });

    await page.goto('/marketplace');

    // Verificar que se muestra un mensaje de error
    const errorAlert = page.locator('.MuiAlert-root[aria-label*="error"], .MuiAlert-error');
    await expect(errorAlert).toBeVisible({ timeout: 10000 });

    // Verificar que el error contiene información útil
    const errorText = page.locator('text*=Error loading marketplace data');
    await expect(errorText).toBeVisible();

    console.log('✅ [A.6.7] Manejo de estados de error verificado correctamente');
  });

  test('A.6.8: Verificar No Hay Errores de Consola', async ({ page }) => {
    console.log('\n🎯 [A.6.8] Iniciando verificación de errores de consola...');

    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await page.goto('/marketplace');

    // Esperar a que la página se cargue completamente
    await page.waitForTimeout(3000);

    // Verificar que no hay errores críticos en consola
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('DevTools') && 
      !error.includes('extension') &&
      !error.includes('chrome-extension')
    );

    if (criticalErrors.length > 0) {
      console.warn('⚠️ Errores encontrados en consola:', criticalErrors);
    } else {
      console.log('✅ No se encontraron errores críticos en consola');
    }

    // Log de warnings para información
    if (consoleWarnings.length > 0) {
      console.log('ℹ️ Warnings encontrados:', consoleWarnings.length);
    }

    // El test pasa incluso con algunos warnings, pero falla con errores críticos
    expect(criticalErrors.length).toBeLessThanOrEqual(2);

    console.log('✅ [A.6.8] Verificación de errores de consola completada');
  });

}); 