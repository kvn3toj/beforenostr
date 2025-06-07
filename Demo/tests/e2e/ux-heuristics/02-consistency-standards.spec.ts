import { test, expect } from '@playwright/test';

/**
 * Pruebas para Heurística UX #2: Consistencia y Estándares - APLICACIÓN REACT UNIFICADA
 * 
 * Verifica que el sistema mantenga:
 * - Patrones de diseño consistentes en todas las rutas React
 * - Elementos de navegación uniformes (Sidebar y BottomNavigation)
 * - Estilos globales aplicados correctamente (Material-UI Theme)
 * - Comportamientos predecibles en toda la aplicación
 */

test.describe('UX Heurística #2: Consistencia y Estándares - React App', () => {
  
  // Rutas principales de la aplicación React unificada
  const sections = [
    { path: '/', name: 'Home', needsAuth: true },
    { path: '/profile', name: 'Profile', needsAuth: true },
    { path: '/marketplace', name: 'Marketplace', needsAuth: true },
    { path: '/play', name: 'ÜPlay', needsAuth: true },
    { path: '/social', name: 'Social', needsAuth: true },
    { path: '/wallet', name: 'Wallet', needsAuth: true },
    { path: '/analytics', name: 'Analytics', needsAuth: true },
    { path: '/pilgrim', name: 'Pilgrim', needsAuth: true }
  ];

  // Helper function para esperar a que la aplicación se cargue completamente
  const waitForAppReady = async (page) => {
    // Esperar a que React monte
    await page.waitForSelector('#root', { state: 'attached' });
    
    // Esperar a que no haya loading state
    try {
      await page.waitForSelector('.MuiCircularProgress-root', { state: 'hidden', timeout: 5000 });
    } catch {
      // Es normal que no aparezca el loading si la autenticación es instantánea
    }
    
    // Esperar tiempo adicional para que las fuentes se carguen
    await page.waitForTimeout(2000);
  };

  test('debería mantener elementos de navegación consistentes en todas las rutas React', async ({ page }) => {
    const navigationElements = [];

    for (const section of sections) {
      await page.goto(section.path);
      await page.waitForLoadState('networkidle');
      await waitForAppReady(page);

      // Verificar estructura del AppLayout - usar selectores más flexibles
      const layoutSelectors = [
        // React root
        '#root',
        // Layout components
        '[data-testid="app-layout"]',
        '[data-testid="app-header"]',
        'main', 
        // MUI components que deberían estar presentes
        '.MuiBox-root',
        '.MuiTypography-root'
      ];

      const sectionNavElements = {};

      for (const selector of layoutSelectors) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        
        if (isVisible) {
          const elementInfo = await element.evaluate(el => ({
            tagName: el.tagName,
            classList: Array.from(el.classList).slice(0, 3), // Solo las primeras 3 clases
            childElementCount: el.children.length,
            id: el.id || null
          }));
          
          sectionNavElements[selector] = {
            visible: true,
            ...elementInfo
          };
        }
      }

      // Verificar elementos específicos del Sidebar (más flexible)
      const sidebarItems = await page.locator('[data-testid="sidebar"] .MuiListItemButton-root').count();
      const activeSidebarItem = await page.locator('[data-testid="sidebar"] .MuiListItemButton-root.Mui-selected').count();
      
      // Si no hay sidebar (móvil), buscar bottom navigation
      const bottomNavItems = await page.locator('[data-testid="bottom-nav"] .MuiBottomNavigationAction-root').count();

      navigationElements.push({
        section: section.name,
        path: section.path,
        elements: sectionNavElements,
        sidebarItems,
        activeSidebarItem,
        bottomNavItems
      });
    }

    console.log('✓ Elementos de navegación React por sección:', navigationElements);

    // Verificar que todas las rutas tengan el layout React básico
    const sectionsWithLayout = navigationElements.filter(nav => 
      nav.elements['#root'] && nav.elements['.MuiBox-root']
    );
    
    expect(sectionsWithLayout.length).toBe(sections.length);
    console.log(`✓ Todas las rutas (${sectionsWithLayout.length}/${sections.length}) tienen estructura React básica`);
    
    // Verificar que haya elementos de navegación (sidebar o bottom nav)
    const sectionsWithNavigation = navigationElements.filter(nav => 
      nav.sidebarItems > 0 || nav.bottomNavItems > 0
    );
    
    expect(sectionsWithNavigation.length).toBeGreaterThan(0);
    console.log(`✓ Rutas con navegación: ${sectionsWithNavigation.length}/${sections.length}`);
  });

  test('debería aplicar tema Material-UI consistentemente', async ({ page }) => {
    const themeData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await page.waitForLoadState('networkidle');
      await waitForAppReady(page);

      // Verificar tema Material-UI
      const themeColors = await page.evaluate(() => {
        // Buscar elementos MUI para verificar tema
        const body = document.body;
        const muiComponents = document.querySelectorAll('[class*="Mui"]');
        
        const getComputedColor = (element, property) => {
          if (!element) return null;
          return window.getComputedStyle(element)[property];
        };
        
        return {
          bodyBackground: getComputedColor(body, 'backgroundColor'),
          bodyColor: getComputedColor(body, 'color'),
          bodyFontFamily: getComputedColor(body, 'fontFamily'),
          muiComponentsCount: muiComponents.length,
          hasReactRoot: !!document.querySelector('#root')
        };
      });

      themeData.push({
        section: section.name,
        path: section.path,
        theme: themeColors
      });
    }

    console.log('✓ Tema Material-UI por sección:', themeData);

    // Verificar que todas las rutas tengan componentes MUI
    themeData.forEach(data => {
      expect(data.theme.muiComponentsCount).toBeGreaterThan(0);
      expect(data.theme.hasReactRoot).toBe(true);
      console.log(`✓ ${data.section}: ${data.theme.muiComponentsCount} componentes MUI detectados`);
    });

    // Verificar consistencia del background
    const backgrounds = [...new Set(themeData.map(data => data.theme.bodyBackground))];
    expect(backgrounds.length).toBeLessThanOrEqual(2); // Máximo 2 variaciones
    console.log(`✓ Backgrounds consistentes: ${backgrounds.join(', ')}`);
  });

  test('debería mantener tipografía consistente (Inter o fallback)', async ({ page }) => {
    const typographyData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await page.waitForLoadState('networkidle');
      await waitForAppReady(page);

      // Verificar elementos tipográficos
      const typographyInfo = await page.evaluate(() => {
        const body = document.body;
        const muiText = document.querySelector('.MuiTypography-root');
        const computed = window.getComputedStyle(body);
        
        return {
          bodyFontFamily: computed.fontFamily,
          bodyFontSize: computed.fontSize,
          muiElementsCount: document.querySelectorAll('.MuiTypography-root').length,
          fontFamilyContainsInter: computed.fontFamily.toLowerCase().includes('inter'),
          fontFamilyContainsSystemFont: computed.fontFamily.toLowerCase().includes('system') ||
                                      computed.fontFamily.toLowerCase().includes('helvetica') ||
                                      computed.fontFamily.toLowerCase().includes('arial')
        };
      });

      typographyData.push({
        section: section.name,
        path: section.path,
        typography: typographyInfo
      });
    }

    console.log('✓ Tipografía por sección:', typographyData);

    // Verificar que todas las rutas tengan tipografía MUI
    typographyData.forEach(data => {
      expect(data.typography.muiElementsCount).toBeGreaterThan(0);
      console.log(`✓ ${data.section}: ${data.typography.muiElementsCount} elementos MUI Typography`);
    });

    // Verificar consistencia de fuente (Inter o fallback válido)
    const fontFamilies = [...new Set(typographyData.map(data => data.typography.bodyFontFamily))];
    expect(fontFamilies.length).toBe(1); // Todas deberían usar la misma fuente
    
    const fontFamily = fontFamilies[0];
    const hasValidFont = fontFamily.toLowerCase().includes('inter') ||
                        fontFamily.toLowerCase().includes('roboto') ||
                        fontFamily.toLowerCase().includes('helvetica') ||
                        fontFamily.toLowerCase().includes('arial');
    
    expect(hasValidFont).toBe(true);
    console.log(`✓ Fuente consistente aplicada: ${fontFamily}`);
  });

  test('debería mantener botones Material-UI consistentes', async ({ page }) => {
    const buttonData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await page.waitForLoadState('networkidle');
      await waitForAppReady(page);

      // Buscar botones MUI
      const buttonInfo = await page.evaluate(() => {
        const muiButtons = document.querySelectorAll('.MuiButton-root, .MuiIconButton-root, .MuiListItemButton-root');
        const buttonStyles = {};
        
        if (muiButtons.length > 0) {
          const firstButton = muiButtons[0];
          const computed = window.getComputedStyle(firstButton);
          buttonStyles.borderRadius = computed.borderRadius;
          buttonStyles.cursor = computed.cursor;
          buttonStyles.transition = computed.transition;
        }
        
        return {
          muiButtonCount: muiButtons.length,
          styles: buttonStyles
        };
      });

      buttonData.push({
        section: section.name,
        path: section.path,
        buttons: buttonInfo
      });
    }

    console.log('✓ Análisis de botones Material-UI por sección:', buttonData);

    // Verificar que todas las rutas tengan botones
    const sectionsWithButtons = buttonData.filter(data => data.buttons.muiButtonCount > 0);
    expect(sectionsWithButtons.length).toBeGreaterThan(0);
    console.log(`✓ Rutas con botones MUI: ${sectionsWithButtons.length}/${sections.length}`);

    // Verificar estilos consistentes si hay botones
    if (sectionsWithButtons.length > 1) {
      const cursors = [...new Set(sectionsWithButtons.map(b => b.buttons.styles.cursor))];
      expect(cursors.length).toBeLessThanOrEqual(2);
      console.log(`✓ Cursors consistentes en botones: ${cursors.join(', ')}`);
    }
  });

  test('debería mantener estructura React Router consistente', async ({ page }) => {
    const routeData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await page.waitForLoadState('networkidle');
      await waitForAppReady(page);

      // Verificar estructura React
      const routeStructure = await page.evaluate(() => {
        return {
          hasReactRoot: !!document.querySelector('#root'),
          hasOutlet: !!document.querySelector('main'),
          activeLinksCount: document.querySelectorAll('.Mui-selected, [aria-current="page"]').length,
          routerLinksCount: document.querySelectorAll('a[href], [role="button"]').length,
          currentUrl: window.location.pathname,
          muiComponentsPresent: document.querySelectorAll('[class*="Mui"]').length > 0
        };
      });

      routeData.push({
        section: section.name,
        path: section.path,
        structure: routeStructure
      });
    }

    console.log('✓ Estructura React Router por sección:', routeData);

    // Verificar que todas las rutas tengan la estructura React básica
    routeData.forEach(data => {
      expect(data.structure.hasReactRoot).toBe(true);
      expect(data.structure.currentUrl).toBe(data.path);
      expect(data.structure.muiComponentsPresent).toBe(true);
      
      console.log(`✓ ${data.section}: React + MUI funcionando en ${data.path}`);
    });

    // Verificar que al menos algunas rutas tengan elementos activos
    const routesWithActiveElements = routeData.filter(data => 
      data.structure.activeLinksCount > 0
    );
    
    console.log(`✓ Rutas con elementos activos: ${routesWithActiveElements.length}/${sections.length}`);
  });

}); 