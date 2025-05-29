import { test, expect } from '@playwright/test';

test.describe('Subtitle Upload UI Exploration', () => {
  test.beforeEach(async ({ page }) => {
    // Realizar login
    console.log('🔐 Logging in as admin...');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
    
    console.log('✅ Login successful');
  });

  test('Explore subtitle upload UI structure', async ({ page }) => {
    console.log('🚀 Exploring subtitle upload UI...');

    // Navegar a la página de configuración de video
    await page.goto('/items/2/config');
    await page.waitForLoadState('networkidle');
    
    console.log('📄 Navigated to video config page');

    // Hacer clic en la pestaña de Subtítulos
    const subtitlesTab = page.locator('[role="tab"]').filter({ hasText: /subtítulos|subtitles/i });
    await expect(subtitlesTab).toBeVisible({ timeout: 10000 });
    await subtitlesTab.click();
    await page.waitForTimeout(2000);
    
    console.log('📝 Clicked on Subtitles tab');

    // Tomar screenshot inicial
    await page.screenshot({ path: 'debug-subtitle-ui-structure.png', fullPage: true });
    console.log('📸 Screenshot saved: debug-subtitle-ui-structure.png');

    // Explorar todos los elementos de formulario
    console.log('🔍 Exploring form elements...');
    
    // Buscar todos los inputs
    const allInputs = await page.locator('input').all();
    console.log(`📝 Found ${allInputs.length} input elements:`);
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      console.log(`  Input ${i + 1}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}"`);
    }

    // Buscar todos los selects y comboboxes
    const allSelects = await page.locator('select, [role="combobox"], [role="listbox"]').all();
    console.log(`📋 Found ${allSelects.length} select/combobox elements:`);
    for (let i = 0; i < allSelects.length; i++) {
      const select = allSelects[i];
      const role = await select.getAttribute('role');
      const ariaLabel = await select.getAttribute('aria-label');
      const text = await select.textContent();
      console.log(`  Select ${i + 1}: role="${role}", aria-label="${ariaLabel}", text="${text?.slice(0, 50)}..."`);
    }

    // Buscar todos los botones
    const allButtons = await page.locator('button').all();
    console.log(`🔘 Found ${allButtons.length} button elements:`);
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const type = await button.getAttribute('type');
      const disabled = await button.getAttribute('disabled');
      const text = await button.textContent();
      console.log(`  Button ${i + 1}: type="${type}", disabled="${disabled}", text="${text?.trim()}"`);
    }

    // Buscar elementos con texto relacionado a idioma
    console.log('🌐 Looking for language-related elements...');
    const languageElements = await page.locator('text=/idioma|language|español|english/i').all();
    console.log(`Found ${languageElements.length} language-related elements:`);
    for (let i = 0; i < languageElements.length; i++) {
      const element = languageElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const text = await element.textContent();
      console.log(`  Language element ${i + 1}: <${tagName}> "${text?.trim()}"`);
    }

    // Buscar elementos con texto relacionado a archivo
    console.log('📁 Looking for file-related elements...');
    const fileElements = await page.locator('text=/archivo|file|cargar|upload|subir/i').all();
    console.log(`Found ${fileElements.length} file-related elements:`);
    for (let i = 0; i < fileElements.length; i++) {
      const element = fileElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const text = await element.textContent();
      console.log(`  File element ${i + 1}: <${tagName}> "${text?.trim()}"`);
    }

    // Buscar labels
    console.log('🏷️ Looking for labels...');
    const allLabels = await page.locator('label').all();
    console.log(`Found ${allLabels.length} label elements:`);
    for (let i = 0; i < allLabels.length; i++) {
      const label = allLabels[i];
      const forAttr = await label.getAttribute('for');
      const text = await label.textContent();
      console.log(`  Label ${i + 1}: for="${forAttr}", text="${text?.trim()}"`);
    }

    console.log('🎉 UI exploration completed!');
    console.log('📸 Check debug-subtitle-ui-structure.png for visual reference');
  });
}); 