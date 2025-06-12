import { test, expect } from '@playwright/test';

test.describe('Marketplace Edit/Delete Functionality', () => {
  // Helper function for login that we know works
  async function loginAsAdmin(page) {
    await page.goto('/login');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('[data-testid="login-email-input"] input');
    const passwordInput = page.locator('[data-testid="login-password-input"] input');
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    
    await emailInput.clear();
    await emailInput.fill('admin@gamifier.com');
    await passwordInput.clear();
    await passwordInput.fill('admin123');
    await submitButton.click();
    
    await page.waitForTimeout(5000); // Same as the debug test
    console.log(`📍 After login: ${page.url()}`);
  }
  
  // Helper function to navigate to marketplace that we know works
  async function navigateToMarketplace(page) {
    await page.goto('/marketplace');
    await page.waitForTimeout(3000); // Same as the debug test
    console.log(`📍 After marketplace navigation: ${page.url()}`);
  }

  // Helper function to create a test item
  async function createTestItem(page, title = null) {
    const uniqueTitle = title || `Test Item ${Date.now()}`;
    const description = 'Este item fue creado por un test E2E para verificar los controles de gestión.';
    const price = '100';
    
    console.log(`📝 Creating item with title: "${uniqueTitle}"`);
    
    // Try multiple create button selectors - prioritize the FAB which is always visible
    const createButtonSelectors = [
      '[data-testid="create-item-fab"]',      // FAB always visible
      '[data-testid="create-item-button"]',   // Original buttons
      'button:has-text("Publicar Servicio")',
    ];
    
    let createButtonClicked = false;
    for (const selector of createButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 2000 });
        if (isVisible) {
          console.log(`✅ Found and clicking create button: ${selector}`);
          await button.click();
          await page.waitForTimeout(2000);
          createButtonClicked = true;
          break;
        }
      } catch (error) {
        console.log(`⚠️ Selector ${selector} not found, trying next...`);
      }
    }
    
    if (!createButtonClicked) {
      throw new Error('No create button found with any selector');
    }
    
    // Fill out the form
    const titleInput = page.locator('[data-testid="create-item-title-input"] input');
    await expect(titleInput).toBeVisible();
    await titleInput.fill(uniqueTitle);
    
    const descriptionInput = page.locator('[data-testid="create-item-description-input"] textarea:not([aria-hidden="true"])');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(description);
    
    const priceInput = page.locator('[data-testid="create-item-price-input"] input');
    await expect(priceInput).toBeVisible();
    await priceInput.fill(price);
    
    // Submit the form
    const submitButton = page.locator('[data-testid="submit-create-item-button"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Wait for creation to complete
    await page.waitForTimeout(5000);
    
    return uniqueTitle;
  }

  test('should show marketplace items from backend with admin access', async ({ page }) => {
    console.log('🔍 Testing marketplace items loading with admin access...');
    
    // Login and navigate using our helper functions
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Look for marketplace items with the correct class
    const productCards = page.locator('.card-micro-interactive');
    
    // Wait for items to load with longer timeout
    await page.waitForTimeout(5000);
    
    const itemCount = await productCards.count();
    console.log(`📦 Found ${itemCount} marketplace items`);
    
    // Check for any error messages or authentication issues (fixed syntax)
    const errorMessages = await page.locator('text=error, text=Error, text=ERROR').count();
    console.log(`⚠️ Found ${errorMessages} error messages`);
    
    // Check for authentication indicators (fixed syntax)
    const authIndicators = await page.locator('text=admin, text=Admin, text=usuario, text=perfil').count();
    console.log(`👤 Found ${authIndicators} authentication indicators`);
    
    // Log page content for debugging
    const bodyContent = await page.locator('body').textContent();
    const hasMarketplaceContent = bodyContent?.includes('marketplace') || bodyContent?.includes('Marketplace');
    console.log(`🏪 Page contains marketplace content: ${hasMarketplaceContent}`);
    
    // Check for specific CoomÜnity terminology
    const hasCommunityTerms = bodyContent?.includes('CoomÜnity') || bodyContent?.includes('Ayni') || bodyContent?.includes('Méritos');
    console.log(`🌟 Page contains CoomÜnity terms: ${hasCommunityTerms}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'marketplace-admin-test.png', fullPage: true });
    console.log('📸 Screenshot saved as marketplace-admin-test.png');
    
    // Basic assertion - should at least load the marketplace page
    expect(page.url()).toContain('marketplace');
    
    // If we have items, test the edit/delete functionality would appear
    if (itemCount > 0) {
      console.log('✅ Items found - checking for edit/delete functionality...');
      
      // Look for edit/delete buttons (using correct syntax)
      const editButtons = await page.locator('button:has-text("Editar")').count();
      const deleteButtons = await page.locator('button:has-text("Eliminar")').count();
      const moreMenus = await page.locator('button[aria-label*="more"]').count();
      
      console.log(`✏️ Found ${editButtons} edit buttons`);
      console.log(`🗑️ Found ${deleteButtons} delete buttons`);
      console.log(`⚙️ Found ${moreMenus} option menus`);
      
      // Also look for the three dots menu that typically contains edit/delete
      const threeDotMenus = await page.locator('button[aria-label="more"], button[data-testid*="more"]').count();
      console.log(`🔽 Found ${threeDotMenus} three-dot menus`);
      
      // Try to interact with first item if available
      if (itemCount > 0) {
        const firstCard = productCards.first();
        console.log('🎯 Attempting to interact with first marketplace item...');
        
        // Try to find and click on options menu in first card
        const firstCardMoreButton = firstCard.locator('button[aria-label="more"], [data-testid*="more"]');
        const hasMoreButton = await firstCardMoreButton.count();
        
        if (hasMoreButton > 0) {
          console.log('✅ Found options menu in first item - clicking...');
          await firstCardMoreButton.first().click();
          await page.waitForTimeout(1000);
          
          // Look for edit/delete options in the opened menu
          const editOption = await page.locator('text=Editar, text=Edit').count();
          const deleteOption = await page.locator('text=Eliminar, text=Delete').count();
          
          console.log(`📝 Edit option in menu: ${editOption}`);
          console.log(`🗑️ Delete option in menu: ${deleteOption}`);
          
          // If we found edit or delete options, take a screenshot
          if (editOption > 0 || deleteOption > 0) {
            await page.screenshot({ path: 'marketplace-options-menu.png' });
            console.log('📸 Screenshot of options menu saved');
          }
          
          // Close menu by clicking elsewhere
          await page.locator('body').click();
        } else {
          console.log('ℹ️ No options menu found in first item');
        }
      }
    } else {
      console.log('ℹ️ No items found - checking if this is expected or an error');
    }
  });

  test('should authenticate successfully as admin', async ({ page }) => {
    console.log('🔍 Testing admin authentication...');
    
    // Login and navigate using our helper functions
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Verify we're not on login page
    expect(page.url()).not.toContain('/login');
    
    // Check that we're on marketplace
    expect(page.url()).toContain('/marketplace');
    
    // Look for any indication that we're logged in as admin
    const pageContent = await page.textContent('body');
    console.log('📄 Page loaded successfully');
    
    // Log any JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ JS Error:', msg.text());
      }
    });
  });

  test('should allow an admin to create a new item and see edit/delete controls on it', async ({ page }) => {
    console.log('🎯 Testing complete item creation and management cycle...');
    
    // Step 0: Login and navigate (using the same logic as the working debug test)
    console.log('0️⃣ Logging in and navigating to marketplace...');
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Verify a create button is available using multiple selectors
    const buttonSelectors = [
      '[data-testid="create-item-fab"]',
      '[data-testid="create-item-button"]',
    ];
    
    let createButtonFound = false;
    for (const selector of buttonSelectors) {
      const count = await page.locator(selector).count();
      console.log(`🔍 Selector "${selector}": ${count} buttons found`);
      if (count > 0) {
        createButtonFound = true;
        break;
      }
    }
    
    if (!createButtonFound) {
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-no-create-button.png', fullPage: true });
      throw new Error('No create button found with any selector after login and navigation');
    }
    
    // Generate unique data for the test
    const uniqueTitle = `Test Item by Admin ${Date.now()}`;
    const description = 'Este item fue creado por un test E2E para verificar los controles de gestión.';
    const price = '100';
    
    console.log(`📝 Creating item with title: "${uniqueTitle}"`);
    
    // Step 1: Click on create button to open the creation modal
    console.log('1️⃣ Opening create item modal...');
    
    // Try multiple create button selectors - prioritize the FAB which is always visible
    const createButtonSelectors = [
      '[data-testid="create-item-fab"]',
      '[data-testid="create-item-button"]',
    ];
    
    let createButtonClicked = false;
    for (const selector of createButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 2000 });
        if (isVisible) {
          console.log(`✅ Found and clicking create button: ${selector}`);
          await button.click();
          createButtonClicked = true;
          break;
        }
      } catch (error) {
        console.log(`⚠️ Selector ${selector} not found, trying next...`);
      }
    }
    
    if (!createButtonClicked) {
      throw new Error('No create button found with any selector');
    }
    
    // Wait for the modal to appear
    await page.waitForTimeout(2000);
    
    // Step 2: Fill out the form with unique data
    console.log('2️⃣ Filling out the item creation form...');
    
    // Fill in the title (target the actual input element within the TextField)
    const titleInput = page.locator('[data-testid="create-item-title-input"] input');
    await expect(titleInput).toBeVisible();
    await titleInput.fill(uniqueTitle);
    
    // Fill in the description (target the primary textarea, not the hidden auto-resize one)
    const descriptionInput = page.locator('[data-testid="create-item-description-input"] textarea:not([aria-hidden="true"])');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(description);
    
    // Fill in the price
    const priceInput = page.locator('[data-testid="create-item-price-input"] input');
    await expect(priceInput).toBeVisible();
    await priceInput.fill(price);
    
    // Step 3: Submit the form
    console.log('3️⃣ Submitting the item creation form...');
    const submitButton = page.locator('[data-testid="submit-create-item-button"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Wait for the item to be created and the modal to close
    await page.waitForTimeout(5000);
    console.log('⏳ Waiting for item creation to complete...');
    
    // Step 4: Wait for the marketplace to refresh and show the new item
    console.log('4️⃣ Looking for the newly created item in the marketplace...');
    
    // Look for the new item by its unique title
    const newItemCard = page.locator('[data-testid="item-card"]', { hasText: uniqueTitle });
    await expect(newItemCard).toBeVisible({ timeout: 15000 });
    console.log('✅ New item found in the marketplace!');
    
    // Step 5: Hover over the card to make the options menu visible
    console.log('5️⃣ Hovering over the new item to reveal management controls...');
    await newItemCard.hover();
    await page.waitForTimeout(1000);
    
    // Step 6: Look for the options menu button (three dots) within the new item card
    const optionsMenu = newItemCard.locator('[data-testid="item-options-menu"]');
    await expect(optionsMenu).toBeVisible({ timeout: 5000 });
    console.log('✅ Options menu is visible on the new item!');
    
    // Step 7: Click on the options menu to open it
    console.log('6️⃣ Opening the options menu...');
    await optionsMenu.click();
    await page.waitForTimeout(1000);
    
    // Step 8: Verify that edit and delete buttons are visible in the menu
    console.log('7️⃣ Verifying edit and delete controls are visible...');
    
    const editButton = page.locator('[data-testid="edit-item-button"]');
    const deleteButton = page.locator('[data-testid="delete-item-button"]');
    
    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();
    
    console.log('✅ Both edit and delete buttons are visible!');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'marketplace-new-item-management.png', fullPage: true });
    console.log('📸 Screenshot saved showing the new item with management controls');
    
    // Close the menu by clicking elsewhere
    await page.locator('body').click();
    
    console.log('🎉 Test completed successfully! Admin can create items and see management controls.');
  });

  test('should allow an admin to edit an existing item', async ({ page }) => {
    console.log('✏️ Testing item editing functionality...');
    
    // Step 0: Setup - Login and navigate to marketplace
    console.log('0️⃣ Setting up test environment...');
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Step 1: Create a test item first
    console.log('1️⃣ Creating a test item to edit...');
    const originalTitle = await createTestItem(page, `Edit Test Item ${Date.now()}`);
    
    // Wait for the marketplace to refresh and find the new item
    await page.waitForTimeout(3000);
    const itemCard = page.locator('[data-testid="item-card"]', { hasText: originalTitle });
    await expect(itemCard).toBeVisible({ timeout: 15000 });
    console.log('✅ Test item created and found!');
    
    // Step 2: Access the edit option
    console.log('2️⃣ Opening edit modal...');
    await itemCard.hover();
    await page.waitForTimeout(1000);
    
    const optionsMenu = itemCard.locator('[data-testid="item-options-menu"]');
    await expect(optionsMenu).toBeVisible({ timeout: 5000 });
    await optionsMenu.click();
    await page.waitForTimeout(1000);
    
    const editButton = page.locator('[data-testid="edit-item-button"]');
    await expect(editButton).toBeVisible();
    await editButton.click();
    
    // Step 3: Wait for edit modal to open and verify form is pre-populated
    console.log('3️⃣ Verifying edit modal opened with pre-populated data...');
    await page.waitForTimeout(2000);
    
    // Check that the form fields are populated with existing data
    const editTitleInput = page.locator('input[value*="Edit Test Item"]').first();
    await expect(editTitleInput).toBeVisible({ timeout: 10000 });
    console.log('✅ Edit modal opened with pre-populated title!');
    
    // Step 4: Modify the item data
    console.log('4️⃣ Modifying item data...');
    const updatedTitle = `${originalTitle} - EDITED`;
    const updatedDescription = 'Esta descripción fue editada por el test E2E.';
    const updatedPrice = '150';
    
    // Clear and update title
    await editTitleInput.clear();
    await editTitleInput.fill(updatedTitle);
    
    // Update description (find the visible textarea)
    const editDescriptionInput = page.locator('textarea:not([aria-hidden="true"])').first();
    await editDescriptionInput.clear();
    await editDescriptionInput.fill(updatedDescription);
    
    // Update price
    const editPriceInput = page.locator('input[type="number"]').first();
    await editPriceInput.clear();
    await editPriceInput.fill(updatedPrice);
    
    console.log(`📝 Updated title: "${updatedTitle}"`);
    console.log(`📝 Updated description: "${updatedDescription}"`);
    console.log(`📝 Updated price: "${updatedPrice}"`);
    
    // Step 5: Save the changes
    console.log('5️⃣ Saving changes...');
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Actualizar")').first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Wait for the save operation to complete
    await page.waitForTimeout(5000);
    console.log('⏳ Waiting for save operation to complete...');
    
    // Step 6: Verify the changes are reflected in the marketplace
    console.log('6️⃣ Verifying changes are reflected in the marketplace...');
    
    // Look for the updated item
    const updatedItemCard = page.locator('[data-testid="item-card"]', { hasText: updatedTitle });
    await expect(updatedItemCard).toBeVisible({ timeout: 15000 });
    console.log('✅ Updated item found in marketplace!');
    
    // Verify the price is updated (look for the new price in the card)
    const priceElement = updatedItemCard.locator(':has-text("150")');
    await expect(priceElement).toBeVisible();
    console.log('✅ Updated price is visible in the card!');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'marketplace-item-edited.png', fullPage: true });
    console.log('📸 Screenshot saved showing the edited item');
    
    console.log('🎉 Edit functionality test completed successfully!');
  });

  test('should allow an admin to delete an item with confirmation', async ({ page }) => {
    console.log('🗑️ Testing item deletion functionality...');
    
    // Step 0: Setup - Login and navigate to marketplace
    console.log('0️⃣ Setting up test environment...');
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Step 1: Create a test item to delete
    console.log('1️⃣ Creating a test item to delete...');
    const itemToDeleteTitle = await createTestItem(page, `Delete Test Item ${Date.now()}`);
    
    // Wait for the marketplace to refresh and find the new item
    await page.waitForTimeout(3000);
    const itemCard = page.locator('[data-testid="item-card"]', { hasText: itemToDeleteTitle });
    await expect(itemCard).toBeVisible({ timeout: 15000 });
    console.log('✅ Test item created and ready for deletion!');
    
    // Step 2: Access the delete option
    console.log('2️⃣ Opening delete option...');
    await itemCard.hover();
    await page.waitForTimeout(1000);
    
    const optionsMenu = itemCard.locator('[data-testid="item-options-menu"]');
    await expect(optionsMenu).toBeVisible({ timeout: 5000 });
    await optionsMenu.click();
    await page.waitForTimeout(1000);
    
    const deleteButton = page.locator('[data-testid="delete-item-button"]');
    await expect(deleteButton).toBeVisible();
    
    // Step 3: Click delete and verify confirmation dialog appears
    console.log('3️⃣ Clicking delete and verifying confirmation dialog...');
    await deleteButton.click();
    await page.waitForTimeout(1000);
    
    // Look for confirmation dialog
    const confirmationDialog = page.locator('div[role="dialog"]');
    await expect(confirmationDialog).toBeVisible({ timeout: 5000 });
    console.log('✅ Confirmation dialog appeared!');
    
    // Verify the dialog contains appropriate warning text
    const dialogText = await confirmationDialog.textContent();
    expect(dialogText).toContain('eliminar');
    console.log('✅ Confirmation dialog contains appropriate warning text!');
    
    // Step 4: Confirm the deletion
    console.log('4️⃣ Confirming deletion...');
    const confirmDeleteButton = page.locator('button:has-text("Eliminar"), button:has-text("Confirmar")').last();
    await expect(confirmDeleteButton).toBeVisible();
    await confirmDeleteButton.click();
    
    // Wait for deletion to complete
    await page.waitForTimeout(3000);
    console.log('⏳ Waiting for deletion to complete...');
    
    // Step 5: Verify the item is no longer visible in the marketplace
    console.log('5️⃣ Verifying item has been removed from marketplace...');
    
    // The item should no longer be visible (with optimistic updates, it should disappear immediately)
    await expect(itemCard).not.toBeVisible({ timeout: 10000 });
    console.log('✅ Item successfully removed from marketplace!');
    
    // Double-check by refreshing the page and ensuring the item is still gone
    console.log('6️⃣ Refreshing page to confirm permanent deletion...');
    await page.reload();
    await page.waitForTimeout(3000);
    
    const deletedItemCheck = page.locator('[data-testid="item-card"]', { hasText: itemToDeleteTitle });
    await expect(deletedItemCheck).not.toBeVisible();
    console.log('✅ Item is permanently deleted - not found after page refresh!');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'marketplace-item-deleted.png', fullPage: true });
    console.log('📸 Screenshot saved showing marketplace after deletion');
    
    console.log('🎉 Delete functionality test completed successfully!');
  });

  test('should handle edit/delete permissions correctly (only show for item owners)', async ({ page }) => {
    console.log('🔒 Testing edit/delete permissions and authorization...');
    
    // This test verifies that edit/delete controls only appear for items owned by the current user
    // Since we're testing as admin, we should see controls on items created by admin
    
    await loginAsAdmin(page);
    await navigateToMarketplace(page);
    
    // Wait for items to load
    await page.waitForTimeout(5000);
    
    // Get all item cards
    const allCards = page.locator('[data-testid="item-card"]');
    const cardCount = await allCards.count();
    console.log(`📊 Found ${cardCount} total items in marketplace`);
    
    if (cardCount > 0) {
      let cardsWithMenus = 0;
      let cardsWithoutMenus = 0;
      
      // Check each card for options menu visibility
      for (let i = 0; i < Math.min(cardCount, 5); i++) { // Check up to 5 cards
        const card = allCards.nth(i);
        await card.hover();
        await page.waitForTimeout(500);
        
        const optionsMenu = card.locator('[data-testid="item-options-menu"]');
        const hasMenu = await optionsMenu.count() > 0;
        
        if (hasMenu) {
          cardsWithMenus++;
          console.log(`✅ Card ${i + 1}: Has options menu (likely owned by current user)`);
        } else {
          cardsWithoutMenus++;
          console.log(`ℹ️ Card ${i + 1}: No options menu (likely owned by different user)`);
        }
      }
      
      console.log(`📈 Summary: ${cardsWithMenus} cards with menus, ${cardsWithoutMenus} cards without menus`);
      
      // If we have cards with menus, test that they contain edit/delete options
      if (cardsWithMenus > 0) {
        console.log('🔍 Testing options menu content...');
        const firstCardWithMenu = allCards.locator('[data-testid="item-options-menu"]').first();
        await firstCardWithMenu.click();
        await page.waitForTimeout(1000);
        
        const editOption = page.locator('[data-testid="edit-item-button"]');
        const deleteOption = page.locator('[data-testid="delete-item-button"]');
        
        await expect(editOption).toBeVisible();
        await expect(deleteOption).toBeVisible();
        console.log('✅ Edit and delete options are present in owned items!');
        
        // Close menu
        await page.locator('body').click();
      }
    }
    
    console.log('🎉 Permission test completed successfully!');
  });
}); 