import { test, expect } from '@playwright/test';

test.describe('🛒 Fase A.6: Verificación del Módulo Marketplace (GMP Gamified Match Place)', () => {
  
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

  test('🛒 A.6.1: Verificar Navegación y Carga Inicial del Marketplace', async ({ page }) => {
    console.log('\n🎯 [A.6.1] Iniciando verificación de navegación y carga inicial del Marketplace...');

    // Navegar directamente al marketplace
    await page.goto('/marketplace');
    
    // Verificar el título principal
    const mainTitle = page.locator('h4:has-text("Marketplace")');
    await expect(mainTitle).toBeVisible({ timeout: 10000 });
    
    // Verificar el subtítulo descriptivo
    const subtitle = page.locator('text=Tienda virtual y intercambio de productos/servicios');
    await expect(subtitle).toBeVisible();

    console.log('✅ [A.6.1] Navegación y carga inicial verificada correctamente');
  });

  test('🛒 A.6.2: Verificar Estadísticas del Marketplace', async ({ page }) => {
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

    console.log('✅ [A.6.2] Estadísticas del Marketplace verificadas correctamente');
  });

  test('🛒 A.6.3: Verificar Listado de Items', async ({ page }) => {
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

    console.log('✅ [A.6.3] Listado de items verificado correctamente');
  });

  test('🛒 A.6.4: Verificar Información del Sistema', async ({ page }) => {
    console.log('\n🎯 [A.6.4] Iniciando verificación de información del sistema...');

    await page.goto('/marketplace');

    // Verificar la sección de "Sistema de Marketplace"
    const systemTitle = page.locator('h6:has-text("Sistema de Marketplace")');
    await expect(systemTitle).toBeVisible({ timeout: 10000 });

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

    console.log('✅ [A.6.4] Información del sistema verificada correctamente');
  });

}); 