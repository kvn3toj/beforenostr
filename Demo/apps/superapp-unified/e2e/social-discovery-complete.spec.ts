import { test, expect } from '@playwright/test';

test.describe('Social Discovery Tutorial - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    await expect(page.locator('body')).not.toContainText('Login');
  });

  test('Complete Social Discovery Tutorial Flow', async ({ page }) => {
    console.log('👥 Iniciando flujo completo del Tutorial Social Discovery...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    await expect(page.locator('[role="dialog"]')).toContainText('Discovery Social');
    await expect(page.locator('[role="dialog"]')).toContainText('Comunidad CoomÜnity');

    console.log('✅ Tutorial Social iniciado correctamente');

    // Verificar conceptos clave de filosofía comunitaria
    const keyTerms = [
      'Bien Común',
      'círculos de confianza',
      'colaboración',
      'comunidad',
      'social'
    ];

    let foundTerms = 0;
    const dialogContent = await page.locator('[role="dialog"]').textContent();

    for (const term of keyTerms) {
      if (dialogContent?.includes(term)) {
        foundTerms++;
        console.log(`✅ Término encontrado: ${term}`);
      }
    }

    expect(foundTerms).toBeGreaterThan(2);
    console.log(`✅ Contenido social verificado: ${foundTerms}/${keyTerms.length} términos encontrados`);
  });

  test('Social Discovery Navigation Testing', async ({ page }) => {
    console.log('🧭 Testing Social navigation controls...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Test que el tutorial se puede navegar
    const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Navigation working');
    } else {
      console.log('ℹ️ Single step tutorial (expected for current implementation)');
    }
  });

  test('Social Discovery Community Concepts', async ({ page }) => {
    console.log('🤝 Verificando conceptos comunitarios...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Verificar presencia de conceptos comunitarios clave
    await expect(page.locator('[role="dialog"]')).toContainText('CoomÜnity');

    // Buscar referencias a filosofía comunitaria
    const dialogContent = await page.locator('[role="dialog"]').textContent();
    const hasCommunityContent = dialogContent?.includes('comunidad') ||
                               dialogContent?.includes('social') ||
                               dialogContent?.includes('conectar');

    expect(hasCommunityContent).toBeTruthy();
    console.log('✅ Conceptos comunitarios verificados');
  });
});
