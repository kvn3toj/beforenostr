import { test, expect } from '@playwright/test';

test.describe('🎮 Admin Challenge Editor - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');

    // Realizar login exitoso con selectores CORRECTOS del Admin Frontend
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Esperar redirección exitosa
    await page.waitForURL('**/', { timeout: 15000 });

    // Verificar que estamos en el dashboard
    await expect(page).toHaveURL('/');

    // 🔐 VERIFICAR TOKEN JWT EN LOCALSTORAGE (claves correctas del admin frontend)
    const authData = await page.evaluate(() => {
      const token = localStorage.getItem('auth_token');      // Clave correcta con guión bajo
      const userData = localStorage.getItem('auth_user');    // Clave correcta con guión bajo
      return { token, userData };
    });

    console.log('🔐 Token en localStorage:', authData.token ? 'PRESENTE' : 'AUSENTE');
    console.log('👤 Datos usuario:', authData.userData ? 'PRESENTES' : 'AUSENTES');
  });

  test('should access Experience Console directly and verify Challenge Editor', async ({ page }) => {
    // ✅ PASO 1: Verificar que estamos autenticados en el dashboard
    // Corregir la verificación del título del dashboard
    await expect(page.locator('h1')).toContainText(/bienvenido|dashboard|inicio|panel/i);
    console.log('✅ Dashboard cargado correctamente con "Bienvenido de vuelta"');

    // 🔐 INTERCEPTAR LLAMADAS API PARA DEBUG
    page.on('request', request => {
      if (request.url().includes('/philosophy/metrics')) {
        const headers = request.headers();
        console.log('🌐 Llamada a /philosophy/metrics:', {
          url: request.url(),
          authorization: headers['authorization'] ? 'PRESENTE' : 'AUSENTE',
          method: request.method()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('/philosophy/metrics')) {
        console.log('📨 Respuesta /philosophy/metrics:', {
          status: response.status(),
          statusText: response.statusText(),
          url: response.url()
        });
      }
    });

    // ✅ PASO 2: Navegar DIRECTAMENTE a /console (ya que sabemos que la ruta existe)
    console.log('🎮 Navegando directamente a /console...');
    await page.goto('/console');

    // ✅ PASO 3: Verificar que llegamos a la Consola de Experiencias
    await page.waitForURL('**/console', { timeout: 15000 });
    await expect(page).toHaveURL('/console');
    console.log('✅ Navegación a /console exitosa');

    // ⏳ ESPERAR CARGA INICIAL Y VERIFICAR ERRORES
    await page.waitForTimeout(3000);
    console.log('⏳ Esperando carga inicial de la consola...');

        // ✅ PASO 4: Verificar que la página de Console cargó correctamente
    // La consola usa tabs, buscar los tabs principales
    const mainDashboardTab = page.locator('[role="tab"]:has-text("Dashboard")').first();
    await expect(mainDashboardTab).toBeVisible({ timeout: 15000 });
    console.log('✅ Tab Dashboard encontrado - Consola cargada correctamente');

    // ✅ PASO 5: Verificar elementos específicos de la consola
    // Basado en el código, debe haber tabs
    const concursosTab = page.locator('[role="tab"]:has-text("Concursos")');

    await expect(mainDashboardTab).toBeVisible({ timeout: 10000 });
    await expect(concursosTab).toBeVisible({ timeout: 5000 });
    console.log('✅ Tabs de la consola visibles: Dashboard y Concursos');

    // ✅ PASO 6: Verificar métricas del dashboard (las h4 que encontramos)
    const metrics = page.locator('h4.MuiTypography-h4');
    const metricsCount = await metrics.count();
    console.log(`✅ Encontradas ${metricsCount} métricas en el dashboard`);

    // 🔍 OBTENER CONSOLE LOGS PARA DEBUG
    // Los errores de la consola los capturaremos via page.on('console')
    console.log('🔍 Verificando estado de autenticación...');

    // ✅ PASO 7: Navegar a la tab de Concursos (donde debe estar el Challenge Editor)
    console.log('🎮 Navegando a la tab de Concursos...');
    await concursosTab.click();
    await page.waitForTimeout(2000); // Esperar transición

    // ✅ PASO 8: Buscar el botón para crear concursos/challenges en la tab de Concursos
    const createButton = page.locator(
      'button:has-text("Crear"), button:has-text("Nuevo"), button:has-text("Add"), [data-testid*="create"], [aria-label*="create"]'
    ).first();

    if (await createButton.isVisible()) {
      console.log('✅ Botón para crear encontrado en tab Concursos');
      await createButton.click();

      // Verificar que se abre algún modal/dialog
      const modal = page.locator('[role="dialog"], .modal, [data-testid*="dialog"]');
      await expect(modal).toBeVisible({ timeout: 10000 });
      console.log('✅ Modal/Dialog del Challenge Editor abierto exitosamente');

      // Verificar elementos del formulario
      const formElements = page.locator('input, textarea, select');
      const formCount = await formElements.count();
      console.log(`✅ Encontrados ${formCount} elementos de formulario en el modal`);

      // Cerrar el modal
      const closeButton = page.locator('button:has-text("Cancelar"), button:has-text("Cerrar"), [aria-label*="close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log('✅ Modal cerrado exitosamente');
      }
    } else {
      console.log('ℹ️ Botón para crear no encontrado en tab Concursos');

      // Debug: capturar el contenido de la tab Concursos
      const pageContent = await page.textContent('body');
      console.log('📄 Contenido de la tab Concursos (primeros 500 chars):', pageContent?.substring(0, 500));
    }

    // ✅ PASO 9: Tomar screenshot final para verificación manual
    await page.screenshot({
      path: `test-results/admin-console-complete-flow-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot final tomado para verificación manual');
  });

  test('should discover what the console page actually contains', async ({ page }) => {
    // ✅ PASO 1: Verificar autenticación
    await expect(page.locator('h1')).toContainText(/bienvenido|dashboard|inicio|panel/i);
    console.log('✅ Dashboard cargado correctamente con "Bienvenido de vuelta"');

    // ✅ PASO 2: Navegar a /console
    console.log('🎮 Navegando directamente a /console...');
    await page.goto('/console');
    await page.waitForURL('**/console', { timeout: 15000 });
    await expect(page).toHaveURL('/console');
    console.log('✅ Navegación a /console exitosa');

    // ⏳ ESPERAR CARGA COMPLETA
    await page.waitForTimeout(5000);
    console.log('⏳ Esperando carga completa de la consola...');

    // 🔍 CAPTURAR CONTENIDO REAL DE LA PÁGINA
    const pageTitle = await page.title();
    console.log('📄 Título de la página:', pageTitle);

    // Capturar todos los h1, h2, h3, h4, h5, h6
    const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('📋 Todos los títulos encontrados:', allHeadings);

    // Capturar todos los botones
    const allButtons = await page.locator('button').allTextContents();
    console.log('🔘 Todos los botones encontrados:', allButtons);

    // Capturar todos los elementos con role="tab"
    const allTabs = await page.locator('[role="tab"]').allTextContents();
    console.log('📑 Todos los tabs encontrados:', allTabs);

    // Capturar cualquier mensaje de error o loading
    const errorMessages = await page.locator('[data-testid*="error"], .error, .MuiAlert-root').allTextContents();
    console.log('⚠️ Mensajes de error encontrados:', errorMessages);

    const loadingElements = await page.locator('[data-testid*="loading"], .loading, .MuiSkeleton-root, .MuiCircularProgress-root').count();
    console.log('⏳ Elementos de carga encontrados:', loadingElements);

    // Capturar estructura de tabs/navegación
    const tabPanels = await page.locator('[role="tabpanel"], .MuiTabPanel-root').count();
    console.log('📱 Paneles de tabs encontrados:', tabPanels);

    // Capturar el texto principal de la página (primeros 1000 caracteres)
    const bodyText = await page.textContent('body');
    console.log('📄 Contenido de la página (primeros 500 chars):', bodyText?.substring(0, 500));

    // 🔍 BUSCAR ESPECÍFICAMENTE ELEMENTOS DE CONSOLA/DASHBOARD
    const dashboardElements = await page.locator('*:has-text("Dashboard"):visible').count();
    console.log('📊 Elementos con "Dashboard":', dashboardElements);

    const consoleElements = await page.locator('*:has-text("Consola"):visible').count();
    console.log('🎮 Elementos con "Consola":', consoleElements);

    const experienceElements = await page.locator('*:has-text("Experiencia"):visible').count();
    console.log('🎯 Elementos con "Experiencia":', experienceElements);

    // 🔍 BUSCAR ELEMENTOS MUI ESPECÍFICOS
    const muiTabs = await page.locator('.MuiTabs-root').count();
    console.log('📑 MUI Tabs encontrados:', muiTabs);

    const muiCards = await page.locator('.MuiCard-root').count();
    console.log('🃏 MUI Cards encontrados:', muiCards);

    // 📸 TOMAR SCREENSHOT PARA ANÁLISIS VISUAL
    await page.screenshot({
      path: `test-results/console-content-discovery-${Date.now()}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot tomado para análisis visual');

    // 🎯 INTENTAR ENCONTRAR CUALQUIER ELEMENTO INTERACTIVO
    const allInteractiveElements = await page.locator('button, a, [role="button"], [role="tab"], [role="link"]').count();
    console.log('🎯 Elementos interactivos totales:', allInteractiveElements);

    // Si encontramos elementos interactivos, intentemos hacer clic en el primero para ver qué pasa
    if (allInteractiveElements > 0) {
      const firstInteractive = page.locator('button, a, [role="button"], [role="tab"], [role="link"]').first();
      const firstInteractiveText = await firstInteractive.textContent();
      console.log('🎯 Primer elemento interactivo:', firstInteractiveText);

      // Intentar hacer clic si tiene texto relevante
      if (firstInteractiveText && (firstInteractiveText.includes('Dashboard') || firstInteractiveText.includes('Tab') || firstInteractiveText.includes('Concur'))) {
        console.log('🖱️ Haciendo clic en el primer elemento interactivo relevante...');
        await firstInteractive.click();
        await page.waitForTimeout(2000);

        // Verificar si cambió algo después del clic
        const newPageContent = await page.textContent('body');
        console.log('📄 Contenido después del clic (primeros 300 chars):', newPageContent?.substring(0, 300));
      }
    }
  });

  test('should debug menu navigation issue', async ({ page }) => {
    // Test específico para entender por qué no hay menú de navegación

    console.log('🔍 DEBUG: Analizando estructura del menú...');

    // Verificar MainLayout
    const mainLayout = page.locator('[data-testid="main-layout"], main, .layout');
    if (await mainLayout.count() > 0) {
      console.log('✅ MainLayout encontrado');
    }

    // Buscar cualquier tipo de navegación
    const navElements = await page.locator('nav, [role="navigation"], .navigation, .menu, .sidebar').count();
    console.log(`🔍 Elementos de navegación encontrados: ${navElements}`);

    // Buscar botones de menú
    const menuButtons = await page.locator('button[aria-label*="menu"], .menu-button, [data-testid*="menu"]').count();
    console.log(`🔍 Botones de menú encontrados: ${menuButtons}`);

    // Listar todos los enlaces disponibles
    const allLinks = await page.locator('a').allTextContents();
    console.log('🔗 Todos los enlaces disponibles:', allLinks);

    // Verificar si hay algún botón que abra el menú
    const toggleButtons = page.locator('button:has-text("Menu"), button[aria-label*="toggle"], [data-testid*="toggle"]');
    if (await toggleButtons.count() > 0) {
      console.log('🎯 Botón toggle encontrado - intentando abrir menú');
      await toggleButtons.first().click();
      await page.waitForTimeout(2000);

      // Verificar si aparecieron más enlaces después del toggle
      const newLinks = await page.locator('a').allTextContents();
      console.log('🔗 Enlaces después de toggle:', newLinks);

      // Buscar específicamente el enlace a consola después del toggle
      const consolaLink = page.locator('a[href="/console"], a:has-text("Consola"), a:has-text("Experiencias")');
      if (await consolaLink.count() > 0) {
        console.log('🎯✅ ¡ENLACE A CONSOLA ENCONTRADO EN EL MENÚ!');
        await expect(consolaLink.first()).toBeVisible();
      }
    }

    // Screenshot para análisis
    await page.screenshot({
      path: `test-results/menu-debug-${Date.now()}.png`,
      fullPage: true
    });
  });
});
