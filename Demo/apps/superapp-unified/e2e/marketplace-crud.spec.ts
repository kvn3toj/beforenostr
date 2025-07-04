import { test, expect } from '@playwright/test';

test.describe('Marketplace CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Set large desktop viewport to ensure we get the desktop view with FAB
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to the app
    await page.goto('/');
    
    // Wait for React to mount
    await page.waitForSelector('#root');
    
    // Debug: Check initial state
    const initialUrl = page.url();
    console.log('🔍 Initial URL:', initialUrl);
    
    // Check if we're already logged in or need to login
    if (initialUrl.includes('/login')) {
      console.log('🔐 Need to login...');
      
      // Login as admin
      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');
      
      // Wait for any navigation to complete
      await page.waitForTimeout(3000);
      
      const postLoginUrl = page.url();
      console.log('🔍 Post-login URL:', postLoginUrl);
      
      // Check localStorage for token
      const token = await page.evaluate(() => localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('accessToken'));
      console.log('🔑 Token found in localStorage:', !!token);
      if (token) {
        console.log('🔑 Token preview:', token.substring(0, 50) + '...');
      }
      
      // Check if we're actually logged in by looking at page content
      const bodyText = await page.textContent('body');
      const hasLoginForm = bodyText?.includes('Iniciar Sesión') || bodyText?.includes('Email') && bodyText?.includes('Contraseña');
      console.log('🔍 Still showing login form?', hasLoginForm);
      
      // If still on login page, wait a bit more
      if (postLoginUrl.includes('/login')) {
        console.log('⏳ Still on login page, waiting for redirect...');
        await page.waitForTimeout(5000);
        
        const finalLoginUrl = page.url();
        console.log('🔍 Final login URL after wait:', finalLoginUrl);
        
        // If still on login, something is wrong
        if (finalLoginUrl.includes('/login')) {
          // Check for error messages
          const errorMessages = await page.locator('.MuiAlert-root, .error, [role="alert"]').count();
          if (errorMessages > 0) {
            const errorText = await page.locator('.MuiAlert-root, .error, [role="alert"]').first().textContent();
            console.log('❌ Login error found:', errorText);
          } else {
            console.log('❌ Login failed but no error message visible');
          }
        }
      }
    } else {
      console.log('✅ Already logged in');
    }
    
    // Now navigate to marketplace
    console.log('🏪 Navigating to marketplace...');
    await page.goto('/marketplace');
    
    // Wait for navigation to complete
    await page.waitForTimeout(3000);
    const marketplaceUrl = page.url();
    console.log('🔍 Marketplace URL:', marketplaceUrl);
    
    // If we're redirected back to login, there's an auth issue
    if (marketplaceUrl.includes('/login')) {
      console.log('❌ Redirected back to login - auth token likely invalid');
      
      // Check token again
      const tokenAfterRedirect = await page.evaluate(() => localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('accessToken'));
      console.log('🔑 Token after redirect:', !!tokenAfterRedirect);
      
      throw new Error('Authentication failed - redirected back to login page');
    }
    
    // Wait for marketplace to load - try different selectors
    try {
      await page.waitForSelector('[data-testid="marketplace-main"]', { timeout: 5000 });
      console.log('✅ Marketplace main component found');
    } catch {
      console.log('❌ marketplace-main not found, waiting for body');
      await page.waitForSelector('body', { timeout: 10000 });
    }
    
    await page.waitForTimeout(5000); // Allow more time for data to load
    
    // Debug: Take a screenshot to see what's being rendered
    await page.screenshot({ path: 'debug-marketplace-before-test.png', fullPage: true });
    
    // Debug: Check if we're in mobile or desktop view
    const isMobileView = await page.evaluate(() => {
      return window.innerWidth < 1280; // Material UI md breakpoint
    });
    console.log('📱 Is mobile view?', isMobileView);
    
    // Debug: Check for marketplace items
    const itemCount = await page.locator('[data-testid="item-card"]').count();
    console.log('📦 Item cards found:', itemCount);
    
    // Debug: Check for FAB
    const fabExists = await page.locator('[data-testid="create-item-fab"]').count();
    console.log('🎯 FAB elements found:', fabExists);
    
    // Debug: Check for marketplace title
    const hasMarketTitle = await page.textContent('body');
    console.log('📄 Page contains "ÜMarket":', hasMarketTitle?.includes('ÜMarket') || false);
  });

  test('should show create FAB when user has permission', async ({ page }) => {
    // Verify we're on the correct page
    expect(page.url()).toContain('/marketplace');
    
    // Debug: Log page content before assertion
    const bodyText = await page.textContent('body');
    console.log('📄 Page contains "ÜMarket":', bodyText?.includes('ÜMarket') || false);
    
    // Verify the create FAB is visible for admin user
    const createFab = page.locator('[data-testid="create-item-fab"]');
    
    // Wait a bit more for dynamic content
    await page.waitForTimeout(2000);
    
    // If FAB is not visible, try to find it in mobile view FAB
    const fabCount = await createFab.count();
    if (fabCount === 0) {
      console.log('🔍 No desktop FAB found, checking mobile view...');
      const mobileFab = page.locator('[data-testid="mobile-create-fab"]');
      const mobileFabCount = await mobileFab.count();
      console.log('📱 Mobile FAB count:', mobileFabCount);
      
      // Also check for any buttons containing "crear" or "Crear"
      const createButtons = await page.locator('button:has-text("Crear"), button:has-text("crear"), button:has-text("Publicar"), button:has-text("Ofrecer")').count();
      console.log('🔍 Create buttons found:', createButtons);
    }
    
    await expect(createFab).toBeVisible({ timeout: 10000 });
  });

  test('should display marketplace items correctly', async ({ page }) => {
    // Verify we're on the correct page
    expect(page.url()).toContain('/marketplace');
    
    // Wait for items to load (reduced timeout)
    await page.waitForTimeout(1000);
    
    // Debug: Check if marketplace component is loaded
    const marketplaceMain = page.locator('[data-testid="marketplace-main"]');
    const marketplaceExists = await marketplaceMain.count();
    console.log('🏪 Marketplace main component found:', marketplaceExists);
    
    // Debug: Check for loading states
    const loadingSpinners = await page.locator('.MuiCircularProgress-root').count();
    console.log('⏳ Loading spinners found:', loadingSpinners);
    
    // Debug: Check for error messages
    const errorAlerts = await page.locator('.MuiAlert-root').count();
    console.log('❌ Error alerts found:', errorAlerts);
    if (errorAlerts > 0) {
      const errorText = await page.locator('.MuiAlert-root').first().textContent();
      console.log('❌ Error message:', errorText);
    }
    
    // Verify that marketplace items are displayed
    const itemCards = page.locator('[data-testid="item-card"]');
    const itemCount = await itemCards.count();
    
    console.log('📦 Total item cards found:', itemCount);
    
    // Debug: If no items, check what's in the main content area
    if (itemCount === 0) {
      const mainContent = await page.textContent('.MuiContainer-root');
      console.log('📄 Main content preview:', mainContent?.substring(0, 500));
      
      // Also check for any text mentioning items or products
      const itemTexts = await page.locator('text=item, text=producto, text=servicio').count();
      console.log('🔍 Item-related text found:', itemTexts);
    }
    
    // Should have at least some items from seed data
    expect(itemCount).toBeGreaterThan(0);
    
    // Verify first item has expected elements
    if (itemCount > 0) {
      const firstItem = itemCards.first();
      await expect(firstItem).toBeVisible();
      
      // Basic item elements should be present
      await expect(firstItem.locator('.MuiCardContent-root')).toBeVisible();
    }
  });

  test('should allow an admin to perform the full CRUD cycle on their own item', async ({ page }) => {
    // Verify we're on the correct page
    expect(page.url()).toContain('/marketplace');
    
    // Generate unique title to avoid collisions
    const uniqueTitle = `Test CRUD Item ${Date.now()}`;
    const originalPrice = '150';
    const updatedPrice = '200';

    // Wait for everything to load (reduced timeout)
    await page.waitForTimeout(1000);

    // ====== STEP 1: CREATE ITEM ======
    console.log('🔹 Step 1: Creating new item...');
    
    // Take a screenshot before trying to click FAB
    await page.screenshot({ path: 'debug-before-fab-click.png', fullPage: true });
    
    // Try to find the FAB
    const createFab = page.locator('[data-testid="create-item-fab"]');
    const fabExists = await createFab.count();
    
    if (fabExists === 0) {
      console.log('❌ FAB not found, taking debug screenshot...');
      await page.screenshot({ path: 'debug-no-fab-found.png', fullPage: true });
      
      // List all elements with data-testid
      const allTestIds = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-testid]');
        return Array.from(elements).map(el => el.getAttribute('data-testid'));
      });
      console.log('🔍 All data-testids found:', allTestIds);
      
      // Check if there are alternative create buttons
      const alternativeButtons = await page.locator('button:has-text("Crear"), button:has-text("Publicar"), button:has-text("Ofrecer")').count();
      console.log('🔍 Alternative create buttons found:', alternativeButtons);
    }
    
    // Click the Create Item FAB
    await page.click('[data-testid="create-item-fab"]');
    
    // Wait for create modal to open
    await page.waitForSelector('[data-testid="create-item-modal"]');
    
    // Fill the form
    await page.fill('[data-testid="item-title-input"]', uniqueTitle);
    await page.fill('[data-testid="item-description-input"]', 'Item de prueba para verificación E2E del CRUD completo');
    await page.fill('[data-testid="item-price-input"]', originalPrice);
    
    // Select type (assuming first option is valid)
    await page.click('[data-testid="item-type-select"]');
    await page.click('[data-testid="item-type-option"]:first-child');
    
    // Submit the form
    await page.click('[data-testid="create-item-submit"]');
    
    // Wait for modal to close and success notification
    await page.waitForSelector('[data-testid="create-item-modal"]', { state: 'detached', timeout: 10000 });
    
    // Verify the new item appears in the list
    const newItemCard = page.locator('[data-testid="item-card"]', { hasText: uniqueTitle });
    await expect(newItemCard).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Step 1 completed: Item created successfully');

    // ====== STEP 2: VERIFY AUTHORIZATION CONTROLS ======
    console.log('🔹 Step 2: Verifying authorization controls...');
    
    // Verify edit and delete buttons ARE visible for our own item
    // First, we need to trigger the menu to show the buttons
    const itemOptionsMenu = newItemCard.locator('[data-testid="item-options-menu"]');
    await itemOptionsMenu.click();
    
    const editButtonOwnItem = page.locator('[data-testid="edit-item-button"]');
    const deleteButtonOwnItem = page.locator('[data-testid="delete-item-button"]');
    
    await expect(editButtonOwnItem).toBeVisible();
    await expect(deleteButtonOwnItem).toBeVisible();
    
    // Close the menu
    await page.click('body'); // Click outside to close menu
    
    // Find an item from another user (from seed data) - look for one that doesn't have our test title
    const otherUserItemCard = page.locator('[data-testid="item-card"]').filter({ 
      hasNotText: uniqueTitle 
    }).first();
    
    if (await otherUserItemCard.count() > 0) {
      // Try to find the options menu for other user's item - it should not exist
      const otherItemOptionsMenu = otherUserItemCard.locator('[data-testid="item-options-menu"]');
      await expect(otherItemOptionsMenu).not.toBeVisible();
    }
    
    console.log('✅ Step 2 completed: Authorization controls verified');

    // ====== STEP 3: EDIT ITEM ======
    console.log('🔹 Step 3: Editing the item...');
    
    // Click the options menu again to access edit
    await newItemCard.locator('[data-testid="item-options-menu"]').click();
    
    // Click edit button on our item
    await editButtonOwnItem.click();
    
    // Wait for edit modal to open
    await page.waitForSelector('[data-testid="edit-item-modal"]');
    
    // Modify the price
    await page.fill('[data-testid="item-price-input"]', updatedPrice);
    
    // Submit the edit
    await page.click('[data-testid="edit-item-submit"]');
    
    // Wait for modal to close
    await page.waitForSelector('[data-testid="edit-item-modal"]', { state: 'detached', timeout: 10000 });
    
    // Verify the updated price is visible in the card
    await expect(newItemCard).toContainText(updatedPrice);
    
    console.log('✅ Step 3 completed: Item edited successfully');

    // ====== STEP 4: DELETE ITEM ======
    console.log('🔹 Step 4: Deleting the item...');
    
    // Set up dialog handler to accept confirmation
    page.on('dialog', dialog => dialog.accept());
    
    // Click the options menu again to access delete
    await newItemCard.locator('[data-testid="item-options-menu"]').click();
    
    // Click delete button
    await deleteButtonOwnItem.click();
    
    // Wait for the item to disappear from the list (optimistic update)
    await expect(newItemCard).not.toBeVisible({ timeout: 10000 });
    
    console.log('✅ Step 4 completed: Item deleted successfully');
    
    console.log('🎉 Full CRUD cycle completed successfully!');
  });
}); 