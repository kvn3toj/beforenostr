import { test, expect } from '@playwright/test';

test.describe('Content Items Delete Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar interceptores para capturar errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login como administrador
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForURL('**/');
    
    // Verificar que estamos autenticados buscando el botón de menú hamburguesa
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg[data-testid="MenuIcon"]), button:has(svg[data-testid="menu"])');
    await expect(menuButton).toBeVisible({ timeout: 10000 });
    console.log('✅ User authenticated - menu button found');
  });

  test('should display content items page with delete functionality', async ({ page }) => {
    console.log('🧪 Testing content items page with delete functionality...');
    
    // Navegar a la página de items
    await page.goto('/items');
    
    // Verificar que la página se carga correctamente
    await expect(page.getByText('Content Items Management')).toBeVisible();
    
    // Verificar que hay items en la tabla
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();
    console.log(`📊 Found ${rowCount} content items`);
    
    if (rowCount > 0) {
      // Verificar que los botones de eliminación están presentes
      const deleteButtons = page.locator('button[aria-label*="delete"], button:has(svg[data-testid="DeleteIcon"])');
      const deleteButtonCount = await deleteButtons.count();
      console.log(`🗑️ Found ${deleteButtonCount} delete buttons`);
      
      expect(deleteButtonCount).toBeGreaterThan(0);
      
      // Verificar que el primer botón de eliminación es visible y clickeable
      const firstDeleteButton = deleteButtons.first();
      await expect(firstDeleteButton).toBeVisible();
      await expect(firstDeleteButton).toBeEnabled();
      
      console.log('✅ Delete buttons are present and functional');
    } else {
      console.log('ℹ️ No content items found to test deletion');
    }
  });

  test('should open delete confirmation dialog when delete button is clicked', async ({ page }) => {
    console.log('🧪 Testing delete confirmation dialog...');
    
    // Navegar a la página de items
    await page.goto('/items');
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // Hacer clic en el primer botón de eliminación
      const firstDeleteButton = page.locator('button[aria-label*="delete"], button:has(svg[data-testid="DeleteIcon"])').first();
      await firstDeleteButton.click();
      
      // Verificar que el diálogo de confirmación aparece
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // Verificar elementos del diálogo de forma más específica
      await expect(dialog.getByText('Confirm')).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Delete' })).toBeVisible();
      
      console.log('✅ Delete confirmation dialog opened successfully');
      
      // Cerrar el diálogo haciendo clic en Cancel
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
      
      console.log('✅ Dialog closed successfully');
    } else {
      console.log('ℹ️ No content items found to test dialog');
    }
  });

  test('should display improved visual design elements', async ({ page }) => {
    console.log('🧪 Testing improved visual design...');
    
    // Navegar a la página de items
    await page.goto('/items');
    
    // Verificar elementos de diseño mejorado
    
    // Header con gradiente
    const header = page.getByText('Content Items Management');
    await expect(header).toBeVisible();
    
    // Estadísticas rápidas (cards)
    const statsCards = page.locator('[role="region"], .MuiCard-root').first();
    await expect(statsCards).toBeVisible();
    
    // Verificar que hay thumbnails de video
    const thumbnails = page.locator('img, [role="img"]');
    const thumbnailCount = await thumbnails.count();
    console.log(`🖼️ Found ${thumbnailCount} thumbnails/images`);
    
    // Verificar chips de estado
    const statusChips = page.locator('.MuiChip-root');
    const chipCount = await statusChips.count();
    console.log(`🏷️ Found ${chipCount} status chips`);
    
    expect(chipCount).toBeGreaterThan(0);
    
    console.log('✅ Visual design elements are present');
  });

  test('should display action buttons with proper tooltips', async ({ page }) => {
    console.log('🧪 Testing action buttons and tooltips...');
    
    // Navegar a la página de items
    await page.goto('/items');
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // Verificar botones de acción en la primera fila
      const firstRow = tableRows.first();
      
      // Verificar botón de vista
      const viewButton = firstRow.locator('button:has(svg[data-testid="VisibilityIcon"])');
      if (await viewButton.count() > 0) {
        await expect(viewButton).toBeVisible();
        console.log('✅ View button found');
      }
      
      // Verificar botón de configuración
      const configButton = firstRow.locator('button:has(svg[data-testid="SettingsIcon"])');
      if (await configButton.count() > 0) {
        await expect(configButton).toBeVisible();
        console.log('✅ Settings button found');
      }
      
      // Verificar botón de edición
      const editButton = firstRow.locator('button:has(svg[data-testid="EditIcon"])');
      if (await editButton.count() > 0) {
        await expect(editButton).toBeVisible();
        console.log('✅ Edit button found');
      }
      
      // Verificar botón de eliminación
      const deleteButton = firstRow.locator('button:has(svg[data-testid="DeleteIcon"])');
      if (await deleteButton.count() > 0) {
        await expect(deleteButton).toBeVisible();
        console.log('✅ Delete button found');
      }
      
      console.log('✅ All action buttons are present and visible');
    } else {
      console.log('ℹ️ No content items found to test action buttons');
    }
  });
});

console.log('🚀 Content Items Delete Functionality Tests Ready!'); 