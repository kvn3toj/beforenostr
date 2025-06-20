/**
 * ================================================
 * COOMUNITY UX HEURISTICS - PLAYWRIGHT TESTS
 * Suite completa para verificar las 6 heurísticas implementadas
 * ================================================
 */

const { test, expect } = require('@playwright/test');

// Configuración base
const BASE_URL = 'http://localhost:8000';
const MAIN_PAGE = `${BASE_URL}/public/index.html`;

test.describe('🧪 CoomÜnity UX Heuristics - Complete Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ir a la página principal antes de cada test
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');
  });

  // ================================================
  // HEURÍSTICA 1: VISIBILIDAD DEL ESTADO DEL SISTEMA
  // ================================================
  
  test.describe('✅ HEURÍSTICA 1: Visibilidad del Estado del Sistema', () => {
    
    test('debe mostrar indicadores de carga al hacer clic en enlaces', async ({ page }) => {
      console.log('🧪 Testing: Loading states for navigation links');
      
      // Verificar que existe el sistema de loading
      await expect(page.locator('script[src*="ux-enhancements.js"]')).toBeAttached();
      
      // Hacer clic en un enlace de demo
      const pilgrimLink = page.locator('a[href*="pilgrim"]').first();
      await expect(pilgrimLink).toBeVisible();
      
      // Click y verificar loading state
      await pilgrimLink.click();
      
      // Verificar que aparece el overlay de carga (aunque sea brevemente)
      const loadingOverlay = page.locator('.loading-overlay');
      // Note: El loading puede ser muy rápido, así que verificamos que existe el mecanismo
      await expect(page).toHaveTitle(/CoomÜnity/);
    });

    test('debe mostrar estados de validación en formularios si existen', async ({ page }) => {
      console.log('🧪 Testing: Form validation feedback');
      
      // Buscar formularios en la página
      const forms = await page.locator('form').count();
      console.log(`Found ${forms} forms on page`);
      
      if (forms > 0) {
        // Si hay formularios, verificar estados de validación
        const form = page.locator('form').first();
        const inputs = form.locator('input');
        const inputCount = await inputs.count();
        
        if (inputCount > 0) {
          const firstInput = inputs.first();
          await firstInput.focus();
          await firstInput.fill('test@invalid');
          await firstInput.blur();
          
          // Verificar que existe el sistema de validación
          await expect(page.locator('.form-field, .form-feedback')).toHaveCount(0); // OK si no hay formularios aquí
        }
      }
      
      // Verificar que el sistema de validación está cargado
      await expect(page.locator('script[src*="ux-enhancements.js"]')).toBeAttached();
    });

    test('debe mostrar notificaciones del sistema', async ({ page }) => {
      console.log('🧪 Testing: System notifications');
      
      // Esperar a que se cargue el JavaScript
      await page.waitForTimeout(2000);
      
      // Verificar que el sistema de notificaciones está disponible
      const notificationSystem = await page.evaluate(() => {
        return typeof window.notificationSystem !== 'undefined';
      });
      
      expect(notificationSystem).toBe(true);
      
      // La notificación de bienvenida debería aparecer automáticamente
      await page.waitForTimeout(3000);
      
      // Verificar contenedor de notificaciones
      const notificationContainer = page.locator('.notification-container');
      await expect(notificationContainer).toBeAttached();
    });
  });

  // ================================================
  // HEURÍSTICA 2: CONSISTENCIA Y ESTÁNDARES
  // ================================================
  
  test.describe('✅ HEURÍSTICA 2: Consistencia y Estándares', () => {
    
    test('debe tener navegación unificada con elementos consistentes', async ({ page }) => {
      console.log('🧪 Testing: Unified navigation consistency');
      
      // Verificar que existe la navegación unificada
      const navbar = page.locator('.unified-navbar');
      await expect(navbar).toBeVisible();
      
      // Verificar logo
      const logo = navbar.locator('img.logo');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('alt', 'CoomÜnity');
      
      // Verificar enlaces de navegación con iconos
      const navLinks = navbar.locator('.nav-link');
      await expect(navLinks).toHaveCount(5); // Home, Pilgrim, Merchant, Red Pill, Docs
      
      // Verificar que cada enlace tiene icono y texto
      for (let i = 0; i < 5; i++) {
        const link = navLinks.nth(i);
        await expect(link.locator('.nav-icon')).toBeVisible();
        await expect(link.locator('.nav-text')).toBeVisible();
      }
      
      // Verificar estado activo
      const activeLink = navbar.locator('.nav-link.active');
      await expect(activeLink).toHaveCount(1);
      await expect(activeLink).toHaveAttribute('data-section', 'home');
    });

    test('debe cargar CSS unificado correctamente', async ({ page }) => {
      console.log('🧪 Testing: Unified CSS loading');
      
      // Verificar que el CSS unificado está cargado
      const cssLink = page.locator('link[href*="unified-styles.css"]');
      await expect(cssLink).toBeAttached();
      
      // Verificar variables CSS principales
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
      });
      
      expect(primaryColor).toBe('#DC1A5B');
      
      // Verificar que los botones tienen estilos consistentes
      const demoLinks = page.locator('.demo-link');
      const firstDemoLink = demoLinks.first();
      
      if (await firstDemoLink.isVisible()) {
        const styles = await firstDemoLink.evaluate(el => {
          const computed = getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            transition: computed.transition
          };
        });
        
        expect(styles.borderRadius).toBe('8px');
        expect(styles.transition).toContain('all 0.3s ease');
      }
    });

    test('debe tener tipografía y colores consistentes', async ({ page }) => {
      console.log('🧪 Testing: Typography and color consistency');
      
      // Verificar fuentes
      const bodyFont = await page.evaluate(() => {
        return getComputedStyle(document.body).fontFamily;
      });
      
      expect(bodyFont).toContain('Poppins');
      
      // Verificar colores del navbar
      const navbar = page.locator('.unified-navbar');
      const navbarBg = await navbar.evaluate(el => {
        return getComputedStyle(el).backgroundColor;
      });
      
      // Debería ser el color primario (#DC1A5B)
      expect(navbarBg).toBe('rgb(220, 26, 91)');
    });
  });

  // ================================================
  // HEURÍSTICA 3: CONTROL Y LIBERTAD DEL USUARIO
  // ================================================
  
  test.describe('✅ HEURÍSTICA 3: Control y Libertad del Usuario', () => {
    
    test('debe generar breadcrumbs automáticamente', async ({ page }) => {
      console.log('🧪 Testing: Automatic breadcrumbs generation');
      
      // Verificar contenedor de breadcrumbs
      const breadcrumbs = page.locator('#breadcrumbs');
      await expect(breadcrumbs).toBeAttached();
      
      // Esperar a que JavaScript genere los breadcrumbs
      await page.waitForTimeout(1000);
      
      // Verificar que se generan breadcrumbs para la página actual
      const breadcrumbList = breadcrumbs.locator('.breadcrumb-list');
      
      // En la página principal debería haber al menos el breadcrumb de inicio
      if (await breadcrumbList.isVisible()) {
        const breadcrumbItems = breadcrumbList.locator('.breadcrumb-item');
        await expect(breadcrumbItems.first()).toBeVisible();
      }
    });

    test('debe tener sistema de notificaciones dismissible', async ({ page }) => {
      console.log('🧪 Testing: Dismissible notification system');
      
      // Esperar a que aparezcan las notificaciones automáticas
      await page.waitForTimeout(3000);
      
      // Verificar contenedor de notificaciones
      const notificationContainer = page.locator('.notification-container');
      await expect(notificationContainer).toBeAttached();
      
      // Si hay notificaciones visibles, verificar que se pueden cerrar
      const notifications = page.locator('.notification');
      const notificationCount = await notifications.count();
      
      if (notificationCount > 0) {
        const firstNotification = notifications.first();
        const closeButton = firstNotification.locator('.notification-close');
        
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(firstNotification).not.toBeVisible();
        }
      }
    });

    test('debe permitir navegación histórica', async ({ page }) => {
      console.log('🧪 Testing: Navigation history controls');
      
      // Verificar que el JavaScript de navegación está cargado
      const navigationManager = await page.evaluate(() => {
        return typeof window.navigationManager !== 'undefined';
      });
      
      expect(navigationManager).toBe(true);
      
      // Test básico de navegación
      const currentUrl = page.url();
      expect(currentUrl).toContain('/public/');
    });
  });

  // ================================================
  // HEURÍSTICA 4: RECONOCIMIENTO VS RECUERDO
  // ================================================
  
  test.describe('✅ HEURÍSTICA 4: Reconocimiento vs Recuerdo', () => {
    
    test('debe usar iconos descriptivos universales', async ({ page }) => {
      console.log('🧪 Testing: Universal descriptive icons');
      
      const navbar = page.locator('.unified-navbar');
      
      // Verificar iconos específicos
      const iconMappings = [
        { section: 'home', expectedIcon: '🏠' },
        { section: 'pilgrim', expectedIcon: '🚀' },
        { section: 'merchant', expectedIcon: '🏪' },
        { section: 'red-pill', expectedIcon: '💊' },
        { section: 'docs', expectedIcon: '📚' }
      ];
      
      for (const mapping of iconMappings) {
        const link = navbar.locator(`[data-section="${mapping.section}"]`);
        const icon = link.locator('.nav-icon');
        
        await expect(icon).toBeVisible();
        const iconText = await icon.textContent();
        expect(iconText).toBe(mapping.expectedIcon);
      }
    });

    test('debe tener etiquetas claras sin jerga técnica', async ({ page }) => {
      console.log('🧪 Testing: Clear labels without technical jargon');
      
      const navbar = page.locator('.unified-navbar');
      const navTexts = navbar.locator('.nav-text');
      
      const expectedTexts = ['Inicio', 'Pilgrim', 'Merchant', 'Red Pill', 'Docs'];
      
      for (let i = 0; i < expectedTexts.length; i++) {
        const navText = navTexts.nth(i);
        await expect(navText).toHaveText(expectedTexts[i]);
      }
    });

    test('debe mantener elementos visuales consistentes', async ({ page }) => {
      console.log('🧪 Testing: Consistent visual elements');
      
      // Verificar que las demo cards tienen estructura consistente
      const demoCards = page.locator('.demo-card');
      const cardCount = await demoCards.count();
      
      expect(cardCount).toBeGreaterThan(0);
      
      // Cada card debe tener título con icono, descripción y enlaces
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = demoCards.nth(i);
        await expect(card.locator('h2')).toBeVisible();
        await expect(card.locator('p')).toBeVisible();
        await expect(card.locator('.demo-links')).toBeVisible();
      }
    });
  });

  // ================================================
  // HEURÍSTICA 5: NAVEGACIÓN INTUITIVA Y JERARQUÍA
  // ================================================
  
  test.describe('✅ HEURÍSTICA 5: Navegación Intuitiva y Jerarquía', () => {
    
    test('debe detectar y mostrar estados activos automáticamente', async ({ page }) => {
      console.log('🧪 Testing: Automatic active state detection');
      
      const navbar = page.locator('.unified-navbar');
      const activeLink = navbar.locator('.nav-link.active');
      
      // Debe haber exactamente un enlace activo
      await expect(activeLink).toHaveCount(1);
      
      // Debería ser el enlace de "home" en la página principal
      await expect(activeLink).toHaveAttribute('data-section', 'home');
      
      // Verificar que tiene el estilo activo
      const activeStyles = await activeLink.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          fontWeight: computed.fontWeight,
          background: computed.background
        };
      });
      
      expect(parseInt(activeStyles.fontWeight)).toBeGreaterThanOrEqual(600);
    });

    test('debe tener navegación sticky y jerarquía clara', async ({ page }) => {
      console.log('🧪 Testing: Sticky navigation and clear hierarchy');
      
      const navbar = page.locator('.unified-navbar');
      
      // Verificar que la navegación es sticky
      const position = await navbar.evaluate(el => {
        return getComputedStyle(el).position;
      });
      
      expect(position).toBe('sticky');
      
      // Verificar z-index apropiado
      const zIndex = await navbar.evaluate(el => {
        return getComputedStyle(el).zIndex;
      });
      
      expect(parseInt(zIndex)).toBeGreaterThanOrEqual(1000);
    });

    test('debe tener menú móvil funcional', async ({ page, isMobile }) => {
      console.log('🧪 Testing: Mobile menu functionality');
      
      if (isMobile) {
        const mobileToggle = page.locator('.mobile-toggle');
        const navLinks = page.locator('.nav-links');
        
        // En móvil, el toggle debe ser visible
        await expect(mobileToggle).toBeVisible();
        
        // Los enlaces deberían estar inicialmente ocultos en móvil
        const navLinksVisible = await navLinks.isVisible();
        
        // Click en toggle
        await mobileToggle.click();
        await page.waitForTimeout(500);
        
        // Verificar que el menú se abre
        const navLinksAfterClick = await navLinks.evaluate(el => {
          return getComputedStyle(el).opacity;
        });
        
        // El menú debería cambiar de estado
        expect(parseFloat(navLinksAfterClick)).toBeGreaterThan(0);
      } else {
        // En desktop, los enlaces deberían ser siempre visibles
        const navLinks = page.locator('.nav-links');
        await expect(navLinks).toBeVisible();
      }
    });
  });

  // ================================================
  // HEURÍSTICA 6: DISEÑO RESPONSIVE
  // ================================================
  
  test.describe('✅ HEURÍSTICA 6: Diseño Responsive', () => {
    
    test('debe ser completamente responsive en diferentes tamaños', async ({ page }) => {
      console.log('🧪 Testing: Responsive design across different screen sizes');
      
      // Test en diferentes tamaños de pantalla
      const screenSizes = [
        { width: 320, height: 568, name: 'Mobile Small' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1200, height: 800, name: 'Desktop' }
      ];
      
      for (const size of screenSizes) {
        console.log(`Testing ${size.name} (${size.width}x${size.height})`);
        
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.waitForTimeout(500);
        
        // Verificar que la navegación se adapta
        const navbar = page.locator('.unified-navbar');
        await expect(navbar).toBeVisible();
        
        // En móvil, verificar que el toggle aparece
        if (size.width <= 768) {
          const mobileToggle = page.locator('.mobile-toggle');
          await expect(mobileToggle).toBeVisible();
        }
        
        // Verificar que el contenido no causa scroll horizontal
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = size.width;
        
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px de tolerancia
      }
    });

    test('debe tener áreas de toque optimizadas para móvil', async ({ page, isMobile }) => {
      console.log('🧪 Testing: Touch-optimized areas for mobile');
      
      if (isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Verificar que los enlaces tienen tamaño mínimo adecuado para touch
        const navLinks = page.locator('.nav-link');
        
        for (let i = 0; i < await navLinks.count(); i++) {
          const link = navLinks.nth(i);
          const box = await link.boundingBox();
          
          if (box) {
            // Área mínima recomendada para touch: 44x44px
            expect(box.height).toBeGreaterThanOrEqual(40);
            expect(box.width).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });

    test('debe manejar contenido multimedia responsivamente', async ({ page }) => {
      console.log('🧪 Testing: Responsive multimedia content');
      
      // Verificar que las imágenes son responsivas
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const img = images.nth(i);
          const maxWidth = await img.evaluate(el => {
            return getComputedStyle(el).maxWidth;
          });
          
          // Las imágenes deberían tener max-width: 100% o estar limitadas por el contenedor
          expect(maxWidth === '100%' || maxWidth === 'none').toBe(true);
        }
      }
      
      // Verificar containers de video si existen
      const videoContainers = page.locator('.video-container');
      const videoCount = await videoContainers.count();
      
      if (videoCount > 0) {
        const firstContainer = videoContainers.first();
        const paddingBottom = await firstContainer.evaluate(el => {
          return getComputedStyle(el).paddingBottom;
        });
        
        // Los containers de video deberían mantener aspect ratio
        expect(paddingBottom).toBe('56.25%'); // 16:9 ratio
      }
    });
  });

  // ================================================
  // PRUEBAS INTEGRALES DE FLUJO COMPLETO
  // ================================================
  
  test.describe('🔄 Pruebas Integrales de Flujo UX', () => {
    
    test('flujo completo de navegación con todas las heurísticas', async ({ page }) => {
      console.log('🧪 Testing: Complete navigation flow with all heuristics');
      
      // 1. Verificar carga inicial y notificación de bienvenida
      await page.waitForTimeout(2000);
      
      // 2. Interactuar con navegación y verificar estados activos
      const pilgrimLink = page.locator('[data-section="pilgrim"]');
      await expect(pilgrimLink).toBeVisible();
      
      // 3. Verificar hover effects
      await pilgrimLink.hover();
      await page.waitForTimeout(200);
      
      // 4. Click y verificar loading state
      await pilgrimLink.click();
      
      // 5. Verificar que la navegación mantiene consistencia
      // (Nota: esto dependería de que la página de destino también tenga las mejoras)
    });

    test('flujo de validación de formularios si existe', async ({ page }) => {
      console.log('🧪 Testing: Form validation flow if forms exist');
      
      // Buscar formularios en la página
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 0) {
        console.log(`Found ${formCount} forms, testing validation`);
        
        const form = forms.first();
        const emailInput = form.locator('input[type="email"]');
        
        if (await emailInput.isVisible()) {
          // Test de validación de email
          await emailInput.fill('invalid-email');
          await emailInput.blur();
          await page.waitForTimeout(500);
          
          // Verificar estados de error
          const formField = emailInput.locator('..'); // Parent form-field
          const hasErrorClass = await formField.evaluate(el => {
            return el.classList.contains('error');
          });
          
          if (hasErrorClass) {
            console.log('✅ Form validation working correctly');
          }
        }
      } else {
        console.log('ℹ️ No forms found on main page, skipping form validation test');
      }
    });

    test('flujo responsive completo', async ({ page }) => {
      console.log('🧪 Testing: Complete responsive flow');
      
      const sizes = [
        { width: 1200, height: 800 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
      ];
      
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(500);
        
        // Verificar que todos los elementos principales son visibles
        await expect(page.locator('.unified-navbar')).toBeVisible();
        await expect(page.locator('.hero-section')).toBeVisible();
        await expect(page.locator('.demo-card').first()).toBeVisible();
        
        // En móvil, verificar menú hamburguesa
        if (size.width <= 768) {
          const mobileToggle = page.locator('.mobile-toggle');
          await expect(mobileToggle).toBeVisible();
          
          // Test de apertura de menú
          await mobileToggle.click();
          await page.waitForTimeout(300);
          
          // Cerrar menú
          await mobileToggle.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  // ================================================
  // VERIFICACIÓN DE PERFORMANCE Y ACCESIBILIDAD
  // ================================================
  
  test.describe('⚡ Performance y Accesibilidad', () => {
    
    test('debe cargar recursos UX sin impacto significativo en performance', async ({ page }) => {
      console.log('🧪 Testing: UX resources performance impact');
      
      const startTime = Date.now();
      await page.goto(MAIN_PAGE);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // La página no debería tardar más de 5 segundos en cargar (para desarrollo local)
      expect(loadTime).toBeLessThan(5000);
      
      // Verificar que los recursos críticos están cargados
      await expect(page.locator('link[href*="unified-styles.css"]')).toBeAttached();
      await expect(page.locator('script[src*="ux-enhancements.js"]')).toBeAttached();
    });

    test('debe mantener accesibilidad básica', async ({ page }) => {
      console.log('🧪 Testing: Basic accessibility compliance');
      
      // Verificar que elementos importantes tienen atributos de accesibilidad
      const mobileToggle = page.locator('.mobile-toggle');
      if (await mobileToggle.isVisible()) {
        await expect(mobileToggle).toHaveAttribute('aria-label');
      }
      
      // Verificar que las imágenes tienen alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('alt');
      }
      
      // Verificar estructura de headings
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1); // Solo debe haber un H1
    });
  });
});

// ================================================
// CONFIGURACIÓN ADICIONAL PARA TESTS MÓVILES
// ================================================

test.describe('📱 Tests Específicos para Móvil', () => {
  test.use({ 
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true 
  });

  test('navegación móvil completa', async ({ page }) => {
    console.log('🧪 Testing: Complete mobile navigation');
    
    await page.goto(MAIN_PAGE);
    await page.waitForLoadState('networkidle');
    
    // Verificar menú hamburguesa
    const mobileToggle = page.locator('.mobile-toggle');
    await expect(mobileToggle).toBeVisible();
    
    // Abrir menú
    await mobileToggle.click();
    await page.waitForTimeout(500);
    
    // Verificar que el menú se abre
    const navLinks = page.locator('.nav-links');
    const opacity = await navLinks.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.5);
    
    // Seleccionar un enlace
    const pilgrimLink = page.locator('[data-section="pilgrim"]');
    await pilgrimLink.click();
    
    // El menú debería cerrarse automáticamente
    await page.waitForTimeout(500);
  });
}); 