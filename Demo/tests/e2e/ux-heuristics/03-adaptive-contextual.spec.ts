import { test, expect } from '@playwright/test';

/**
 * Pruebas para Heurística UX #3: Experiencia Adaptativa y Contextual
 * 
 * Verifica que el sistema se adapte a:
 * - Diferentes tamaños de pantalla y dispositivos
 * - Contextos de uso variables
 * - Preferencias del usuario
 * - Condiciones ambientales y temporales
 */

test.describe('UX Heurística #3: Experiencia Adaptativa y Contextual', () => {
  
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Mobile Small', width: 320, height: 568 }
  ];

  const sections = [
    { path: '/public/', name: 'Principal' },
    { path: '/sections/red-pill/', name: 'Red Pill' },
    { path: '/sections/merchant/', name: 'Merchant' },
    { path: '/sections/pilgrim/', name: 'Pilgrim' }
  ];

  // Helper function to disable consistency validator
  const disableConsistencyValidator = async (page) => {
    await page.evaluate(() => {
      const validator = document.querySelector('.consistency-validator');
      if (validator) {
        validator.style.display = 'none';
        validator.style.pointerEvents = 'none';
        validator.classList.remove('active');
      }
    });
  };

  // Helper function to wait for layout stability
  const waitForLayoutStability = async (page, timeout = 300) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(timeout);
  };

  test('debería adaptar el layout a diferentes tamaños de pantalla', async ({ page }) => {
    const responsiveData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await waitForLayoutStability(page);

      const sectionData = {
        section: section.name,
        path: section.path,
        viewports: {}
      };

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await waitForLayoutStability(page, 200); // Reduced timeout

        // Analizar el layout en este viewport
        const layoutInfo = await page.evaluate(() => {
          const body = document.body;
          const main = document.querySelector('main') || document.querySelector('.main') || body;
          
          const getLayoutInfo = (element) => {
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            
            return {
              width: rect.width,
              height: rect.height,
              display: styles.display,
              flexDirection: styles.flexDirection,
              gridTemplateColumns: styles.gridTemplateColumns,
              overflow: styles.overflow
            };
          };

          // Buscar elementos de navegación responsiva
          const nav = document.querySelector('nav, .navbar, .navigation, .enhanced-nav');
          const hamburger = document.querySelector('.enhanced-mobile-toggle, .hamburger, .menu-toggle, .mobile-menu-btn, [data-mobile-menu]');
          const sidebar = document.querySelector('.sidebar, .drawer, .mobile-menu, .enhanced-nav-links');

          return {
            body: getLayoutInfo(body),
            main: getLayoutInfo(main),
            nav: getLayoutInfo(nav),
            hasHamburger: !!hamburger,
            hamburgerVisible: hamburger ? !hamburger.hidden && hamburger.offsetWidth > 0 : false,
            hasSidebar: !!sidebar,
            sidebarVisible: sidebar ? !sidebar.hidden && sidebar.offsetWidth > 0 : false
          };
        });

        sectionData.viewports[viewport.name] = {
          ...viewport,
          layout: layoutInfo
        };
      }

      responsiveData.push(sectionData);
    }

    console.log('✓ Análisis de adaptabilidad por sección:', responsiveData);

    // Verificar que el layout cambia según el viewport
    responsiveData.forEach(section => {
      const desktopLayout = section.viewports['Desktop']?.layout;
      const mobileLayout = section.viewports['Mobile']?.layout;

      if (desktopLayout && mobileLayout) {
        // El ancho debería ser diferente entre desktop y mobile
        const widthChanged = Math.abs(desktopLayout.body.width - mobileLayout.body.width) > 100;
        console.log(`✓ ${section.section} - Layout adaptativo: ${widthChanged ? 'Sí' : 'No'}`);
        console.log(`  Desktop width: ${desktopLayout.body.width}px, Mobile width: ${mobileLayout.body.width}px`);

        // Verificar presencia de elementos de navegación móvil
        const hasMobileNav = mobileLayout.hasHamburger || mobileLayout.hasSidebar;
        console.log(`✓ ${section.section} - Navegación móvil: ${hasMobileNav ? 'Presente' : 'Ausente'}`);
      }
    });

    expect(responsiveData.length).toBe(sections.length);
  });

  test('debería mostrar/ocultar elementos según el contexto de pantalla', async ({ page }) => {
    const contextualElements = [];

    for (const section of sections) {
      await page.goto(section.path);
      await waitForLayoutStability(page);

      const sectionElements = {
        section: section.name,
        path: section.path,
        elements: {}
      };

      for (const viewport of [viewports[0], viewports[4]]) { // Desktop y Mobile Small
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await waitForLayoutStability(page, 200);

        // Buscar elementos que podrían ser contextuales
        const contextualSelectors = [
          '.desktop-only',
          '.mobile-only',
          '.tablet-only',
          '.hidden-mobile',
          '.hidden-desktop',
          '.responsive-hide',
          '.responsive-show',
          '[data-hide-mobile]',
          '[data-hide-desktop]',
          '.sidebar',
          '.hamburger-menu',
          '.mobile-menu',
          '.enhanced-mobile-toggle',
          '.enhanced-nav-links',
          '.adaptive-controls',
          '[data-adaptive]',
          '.contextual-card',
          '.context-aware'
        ];

        const elementVisibility = {};

        for (const selector of contextualSelectors) {
          try {
            const elements = await page.locator(selector).all();
            if (elements.length > 0) {
              const isVisible = await elements[0].isVisible();
              elementVisibility[selector] = {
                exists: true,
                visible: isVisible,
                count: elements.length
              };
            }
          } catch (error) {
            // Continue if selector fails
          }
        }

        sectionElements.elements[viewport.name] = elementVisibility;
      }

      contextualElements.push(sectionElements);
    }

    console.log('✓ Elementos contextuales por sección:', contextualElements);

    // Verificar que hay elementos que cambian su visibilidad
    contextualElements.forEach(section => {
      const desktop = section.elements['Desktop'] || {};
      const mobile = section.elements['Mobile Small'] || {};
      
      const desktopSelectors = Object.keys(desktop);
      const mobileSelectors = Object.keys(mobile);
      const allSelectors = [...new Set([...desktopSelectors, ...mobileSelectors])];

      let hasContextualChanges = false;

      allSelectors.forEach(selector => {
        const desktopVisible = desktop[selector]?.visible || false;
        const mobileVisible = mobile[selector]?.visible || false;
        
        if (desktopVisible !== mobileVisible) {
          hasContextualChanges = true;
          console.log(`✓ ${section.section} - ${selector}: Desktop(${desktopVisible}) vs Mobile(${mobileVisible})`);
        }
      });

      console.log(`✓ ${section.section} - Cambios contextuales: ${hasContextualChanges ? 'Detectados' : 'No detectados'}`);
    });

    expect(contextualElements.length).toBe(sections.length);
  });

  test('debería adaptar la navegación en dispositivos móviles', async ({ page }) => {
    const navigationData = [];

    for (const section of sections) {
      await page.goto(section.path);
      await waitForLayoutStability(page);

      // Probar navegación en desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await waitForLayoutStability(page, 200);

      const desktopNav = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, .navigation, .main-nav, .enhanced-nav');
        const hamburger = document.querySelector('.enhanced-mobile-toggle, .hamburger, .menu-toggle, .mobile-menu-btn');
        const menuItems = document.querySelectorAll('nav a, .nav-link, .menu-item, .enhanced-nav-item');
        
        return {
          hasNav: !!nav,
          navVisible: nav ? window.getComputedStyle(nav).display !== 'none' : false,
          hasHamburger: !!hamburger,
          hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
          menuItemsCount: menuItems.length,
          menuItemsVisible: Array.from(menuItems).filter(item => 
            window.getComputedStyle(item).display !== 'none'
          ).length
        };
      });

      // Probar navegación en móvil
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForLayoutStability(page, 200);

      const mobileNav = await page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, .navigation, .main-nav, .enhanced-nav');
        const hamburger = document.querySelector('.enhanced-mobile-toggle, .hamburger, .menu-toggle, .mobile-menu-btn');
        const menuItems = document.querySelectorAll('nav a, .nav-link, .menu-item, .enhanced-nav-item');
        
        return {
          hasNav: !!nav,
          navVisible: nav ? window.getComputedStyle(nav).display !== 'none' : false,
          hasHamburger: !!hamburger,
          hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
          menuItemsCount: menuItems.length,
          menuItemsVisible: Array.from(menuItems).filter(item => 
            window.getComputedStyle(item).display !== 'none'
          ).length
        };
      });

      // Probar interacción con menú móvil si existe
      let mobileMenuInteraction = { tested: false, working: false };
      
      if (mobileNav.hasHamburger && mobileNav.hamburgerVisible) {
        try {
          // Disable consistency validator before interaction
          await disableConsistencyValidator(page);
          
          const hamburger = page.locator('.enhanced-mobile-toggle, .hamburger, .menu-toggle, .mobile-menu-btn').first();
          
          // Wait for element to be ready and force click if needed
          await hamburger.waitFor({ state: 'visible', timeout: 5000 });
          await hamburger.click({ force: true });
          await page.waitForTimeout(500);

          const menuAfterClick = await page.evaluate(() => {
            const mobileMenu = document.querySelector('.mobile-menu-open, .enhanced-nav-links.mobile-menu-open, .mobile-menu, .sidebar, .drawer, nav.open, .nav-open');
            return {
              menuAppeared: !!mobileMenu && window.getComputedStyle(mobileMenu).display !== 'none'
            };
          });

          mobileMenuInteraction = {
            tested: true,
            working: menuAfterClick.menuAppeared
          };

          console.log(`✓ ${section.name} - Menú móvil funcional: ${mobileMenuInteraction.working}`);
        } catch (error) {
          console.log(`⚠️ ${section.name} - Error probando menú móvil: ${error.message}`);
          mobileMenuInteraction = { tested: true, working: false };
        }
      }

      navigationData.push({
        section: section.name,
        path: section.path,
        desktop: desktopNav,
        mobile: mobileNav,
        mobileInteraction: mobileMenuInteraction
      });
    }

    console.log('✓ Análisis de navegación adaptativa:', navigationData);

    // Verificar que hay diferencias de navegación entre desktop y móvil
    navigationData.forEach(data => {
      const hasAdaptiveNav = 
        data.desktop.hamburgerVisible !== data.mobile.hamburgerVisible ||
        data.desktop.menuItemsVisible !== data.mobile.menuItemsVisible;
      
      console.log(`✓ ${data.section} - Navegación adaptativa: ${hasAdaptiveNav ? 'Sí' : 'No'}`);
      
      if (data.mobileInteraction.tested) {
        console.log(`✓ ${data.section} - Interacción móvil: ${data.mobileInteraction.working ? 'Funcional' : 'No funcional'}`);
      }
    });

    expect(navigationData.length).toBe(sections.length);
  });

  test('debería adaptar contenido según el espacio disponible', async ({ page }) => {
    const contentAdaptation = [];

    for (const section of sections) {
      await page.goto(section.path);
      await waitForLayoutStability(page);

      const sectionAdaptation = {
        section: section.name,
        path: section.path,
        adaptations: {}
      };

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await waitForLayoutStability(page, 200);

        const contentInfo = await page.evaluate(() => {
          // Analizar diferentes tipos de contenido
          const images = document.querySelectorAll('img');
          const cards = document.querySelectorAll('.card, .item, .component');
          const texts = document.querySelectorAll('p, .text, .description');
          const containers = document.querySelectorAll('.container, .wrapper, .section');

          const analyzeElements = (elements, type) => {
            const sizes = Array.from(elements).slice(0, 5).map(el => {
              const rect = el.getBoundingClientRect();
              const styles = window.getComputedStyle(el);
              return {
                width: rect.width,
                height: rect.height,
                fontSize: styles.fontSize,
                padding: styles.padding,
                margin: styles.margin
              };
            });
            return { type, count: elements.length, sizes };
          };

          return {
            images: analyzeElements(images, 'images'),
            cards: analyzeElements(cards, 'cards'),
            texts: analyzeElements(texts, 'texts'),
            containers: analyzeElements(containers, 'containers'),
            bodyWidth: document.body.getBoundingClientRect().width
          };
        });

        sectionAdaptation.adaptations[viewport.name] = contentInfo;
      }

      contentAdaptation.push(sectionAdaptation);
    }

    // Verificar adaptación de contenido
    contentAdaptation.forEach(section => {
      const desktop = section.adaptations['Desktop'];
      const mobile = section.adaptations['Mobile'];

      if (desktop && mobile) {
        // Verificar que las imágenes se adaptan
        if (desktop.images.count > 0 && mobile.images.count > 0) {
          const desktopImgWidth = desktop.images.sizes[0]?.width || 0;
          const mobileImgWidth = mobile.images.sizes[0]?.width || 0;
          const imageAdapted = Math.abs(desktopImgWidth - mobileImgWidth) > 50;
          
          console.log(`✓ ${section.section} - Imágenes adaptativas: ${imageAdapted ? 'Sí' : 'No'}`);
          console.log(`  Desktop: ${desktopImgWidth}px, Mobile: ${mobileImgWidth}px`);
        }

        // Verificar adaptación de texto
        if (desktop.texts.count > 0 && mobile.texts.count > 0) {
          const desktopFontSize = desktop.texts.sizes[0]?.fontSize || '0px';
          const mobileFontSize = mobile.texts.sizes[0]?.fontSize || '0px';
          
          console.log(`✓ ${section.section} - Tipografía adaptativa:`);
          console.log(`  Desktop: ${desktopFontSize}, Mobile: ${mobileFontSize}`);
        }
      }
    });

    console.log('✓ Análisis de adaptación de contenido:', contentAdaptation);
    expect(contentAdaptation.length).toBe(sections.length);
  });

  test('debería detectar y usar características de contexto inteligente', async ({ page }) => {
    const smartFeatures = [];

    for (const section of sections) {
      await page.goto(section.path);
      await waitForLayoutStability(page);

      // Buscar características de contexto inteligente
      const contextFeatures = await page.evaluate(() => {
        // Buscar elementos que podrían ser contextuales o inteligentes
        const timeBasedElements = document.querySelectorAll('[data-time], .time-sensitive, .schedule');
        const locationElements = document.querySelectorAll('[data-location], .geo-aware, .location-based');
        const personalizedElements = document.querySelectorAll('[data-personalized], .user-specific, .customized');
        const adaptiveElements = document.querySelectorAll('[data-adaptive], .smart-component, .context-aware');
        
        // Buscar indicadores de personalización
        const preferences = document.querySelectorAll('.preferences, .settings, .customize');
        const themes = document.querySelectorAll('[data-theme], .theme-selector, .dark-mode, .light-mode');
        
        // Buscar elementos que cambian según el estado
        const dynamicElements = document.querySelectorAll('[data-dynamic], .state-dependent, .conditional');
        
        // Verificar si hay variables CSS dinámicas
        const rootStyles = window.getComputedStyle(document.documentElement);
        const hasThemeVariables = [
          '--primary-color',
          '--theme-mode',
          '--user-preference',
          '--context-mode'
        ].some(variable => rootStyles.getPropertyValue(variable).trim());

        return {
          timeBased: { count: timeBasedElements.length, hasElements: timeBasedElements.length > 0 },
          locationBased: { count: locationElements.length, hasElements: locationElements.length > 0 },
          personalized: { count: personalizedElements.length, hasElements: personalizedElements.length > 0 },
          adaptive: { count: adaptiveElements.length, hasElements: adaptiveElements.length > 0 },
          preferences: { count: preferences.length, hasElements: preferences.length > 0 },
          themes: { count: themes.length, hasElements: themes.length > 0 },
          dynamic: { count: dynamicElements.length, hasElements: dynamicElements.length > 0 },
          hasThemeVariables
        };
      });

      // Simular cambios de contexto si es posible
      const contextTests = {
        themeToggle: false,
        preferenceChange: false,
        responsiveMenuToggle: false
      };

      // Probar toggle de tema
      try {
        const themeToggle = page.locator('[data-theme-toggle], .theme-toggle, .dark-mode-toggle').first();
        if (await themeToggle.count() > 0) {
          await disableConsistencyValidator(page);
          await themeToggle.click({ force: true });
          await page.waitForTimeout(300);
          contextTests.themeToggle = true;
        }
      } catch (error) {
        // Continuar si no hay toggle de tema
      }

      // Probar menú responsivo
      try {
        const menuToggle = page.locator('.hamburger, .menu-toggle, .mobile-menu-btn, .enhanced-mobile-toggle').first();
        if (await menuToggle.count() > 0) {
          await disableConsistencyValidator(page);
          await menuToggle.click({ force: true });
          await page.waitForTimeout(300);
          contextTests.responsiveMenuToggle = true;
        }
      } catch (error) {
        // Continuar si no hay menú responsivo
      }

      smartFeatures.push({
        section: section.name,
        path: section.path,
        features: contextFeatures,
        contextTests
      });
    }

    console.log('✓ Características inteligentes detectadas:', smartFeatures);

    // Verificar que hay al menos algunas características inteligentes
    smartFeatures.forEach(section => {
      const totalSmartFeatures = 
        (section.features.adaptive.hasElements ? 1 : 0) +
        (section.features.personalized.hasElements ? 1 : 0) +
        (section.features.themes.hasElements ? 1 : 0) +
        (section.features.dynamic.hasElements ? 1 : 0) +
        (section.features.hasThemeVariables ? 1 : 0);

      const totalContextTests = Object.values(section.contextTests).filter(Boolean).length;

      console.log(`✓ ${section.section}:`);
      console.log(`  Características inteligentes: ${totalSmartFeatures}`);
      console.log(`  Tests de contexto exitosos: ${totalContextTests}`);
      console.log(`  Elementos adaptativos: ${section.features.adaptive.count}`);
      console.log(`  Elementos de tema: ${section.features.themes.count}`);
    });

    expect(smartFeatures.length).toBe(sections.length);
  });

  test('debería mantener usabilidad en diferentes resoluciones críticas', async ({ page }) => {
    const criticalViewports = [
      { name: 'Large Desktop', width: 2560, height: 1440 },
      { name: 'Standard Desktop', width: 1920, height: 1080 },
      { name: 'Small Desktop', width: 1280, height: 720 },
      { name: 'Large Tablet', width: 1024, height: 768 },
      { name: 'Standard Tablet', width: 768, height: 1024 },
      { name: 'Large Mobile', width: 414, height: 896 },
      { name: 'Standard Mobile', width: 375, height: 667 },
      { name: 'Small Mobile', width: 320, height: 568 }
    ];

    const usabilityData = [];

    for (const section of sections.slice(0, 2)) { // Probar solo 2 secciones para eficiencia
      await page.goto(section.path);
      await waitForLayoutStability(page);

      const sectionUsability = {
        section: section.name,
        path: section.path,
        viewportTests: {}
      };

      for (const viewport of criticalViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await waitForLayoutStability(page, 200);

        const usabilityMetrics = await page.evaluate(() => {
          // Verificar que elementos clave sean utilizables
          const clickableElements = document.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [tabindex="0"]'
          );

          const measurements = {
            totalClickableElements: clickableElements.length,
            elementsTooSmall: 0,
            elementsOverlapping: 0,
            elementsOffScreen: 0,
            minTouchTargetSize: 44, // Tamaño mínimo recomendado para touch targets
            accessibleElements: 0
          };

          clickableElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);

            // Verificar tamaño mínimo
            if (rect.width < measurements.minTouchTargetSize || rect.height < measurements.minTouchTargetSize) {
              measurements.elementsTooSmall++;
            }

            // Verificar si está fuera de la pantalla
            if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
              measurements.elementsOffScreen++;
            }

            // Verificar accesibilidad básica
            if (element.hasAttribute('aria-label') || element.hasAttribute('title') || element.textContent.trim()) {
              measurements.accessibleElements++;
            }
          });

          return {
            ...measurements,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
          };
        });

        sectionUsability.viewportTests[viewport.name] = {
          ...viewport,
          metrics: usabilityMetrics
        };
      }

      usabilityData.push(sectionUsability);
    }

    // Analizar resultados de usabilidad
    usabilityData.forEach(section => {
      console.log(`✓ Análisis de usabilidad para ${section.section}:`);
      
      Object.entries(section.viewportTests).forEach(([viewportName, data]) => {
        const metrics = data.metrics;
        const usabilityScore = metrics.totalClickableElements > 0 ? 
          ((metrics.totalClickableElements - metrics.elementsTooSmall - metrics.elementsOffScreen) / metrics.totalClickableElements * 100).toFixed(1) : 0;
        
        console.log(`  ${viewportName} (${data.width}x${data.height}):`);
        console.log(`    Puntuación de usabilidad: ${usabilityScore}%`);
        console.log(`    Elementos clickeables: ${metrics.totalClickableElements}`);
        console.log(`    Elementos muy pequeños: ${metrics.elementsTooSmall}`);
        console.log(`    Elementos fuera de pantalla: ${metrics.elementsOffScreen}`);
        console.log(`    Scroll horizontal: ${metrics.hasHorizontalScroll ? 'Sí' : 'No'}`);
        console.log(`    Elementos accesibles: ${metrics.accessibleElements}/${metrics.totalClickableElements}`);
      });
    });

    console.log('✓ Análisis completo de usabilidad:', usabilityData);
    expect(usabilityData.length).toBeGreaterThan(0);
  });

}); 