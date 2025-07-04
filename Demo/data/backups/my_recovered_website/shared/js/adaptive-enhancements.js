/**
 * Adaptive Enhancements for CoomÜnity UX
 * Mejoras específicas para resolver problemas de usabilidad detectados en tests
 */

class AdaptiveEnhancementManager {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceClickableElements();
    this.fixMobileNavigation();
    this.improveElementVisibility();
    this.addAccessibilityEnhancements();
    this.setupResponsiveObserver();
  }

  /**
   * Mejora elementos clickeables que son muy pequeños
   */
  enhanceClickableElements() {
    const clickableSelectors = [
      'button', 'a', 'input[type="button"]', 'input[type="submit"]',
      '[role="button"]', '[tabindex="0"]', '.btn', '.button'
    ];

    clickableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        
        // Asegurar tamaño mínimo de 44px para touch targets
        if (rect.width < 44 || rect.height < 44) {
          element.style.minWidth = '44px';
          element.style.minHeight = '44px';
          element.style.display = element.style.display || 'inline-flex';
          element.style.alignItems = 'center';
          element.style.justifyContent = 'center';
          element.classList.add('enhanced-touch-target');
        }

        // Mejorar contraste y visibilidad
        if (!element.hasAttribute('aria-label') && !element.title && !element.textContent.trim()) {
          const context = this.getElementContext(element);
          element.setAttribute('aria-label', context || 'Interactive element');
        }
      });
    });
  }

  /**
   * Mejora la navegación móvil
   */
  fixMobileNavigation() {
    const hamburger = document.querySelector('.enhanced-mobile-toggle, .hamburger, .menu-toggle, .mobile-menu-btn');
    const navLinks = document.querySelector('.enhanced-nav-links');

    if (hamburger && navLinks) {
      // Asegurar que el hamburger sea visible en móvil
      hamburger.style.zIndex = '9999';
      hamburger.style.position = 'relative';
      
      // Mejorar la funcionalidad del menú móvil
      hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Deshabilitar consistency validator temporalmente
        const validator = document.querySelector('.consistency-validator');
        if (validator) {
          validator.style.pointerEvents = 'none';
          setTimeout(() => {
            validator.style.pointerEvents = '';
          }, 1000);
        }

        // Toggle del menú
        const isOpen = navLinks.classList.contains('mobile-menu-open');
        if (isOpen) {
          navLinks.classList.remove('mobile-menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        } else {
          navLinks.classList.add('mobile-menu-open');
          hamburger.setAttribute('aria-expanded', 'true');
        }
      });

      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('mobile-menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /**
   * Mejora la visibilidad de elementos fuera de pantalla
   */
  improveElementVisibility() {
    const elements = document.querySelectorAll('button, a, input, select, textarea');
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Si el elemento está fuera de la pantalla, ajustarlo
      if (rect.right < 0 || rect.left > viewport.width || 
          rect.bottom < 0 || rect.top > viewport.height) {
        
        // Intentar reposicionar si es posible
        const parent = element.closest('.container, .wrapper, .section, .nav');
        if (parent) {
          parent.style.overflow = 'visible';
          parent.style.position = 'relative';
        }

        // Marcar para debugging
        element.classList.add('off-screen-element');
      }
    });
  }

  /**
   * Añade mejoras de accesibilidad
   */
  addAccessibilityEnhancements() {
    // Mejorar elementos sin etiquetas accesibles
    const unlabeledElements = document.querySelectorAll('button:not([aria-label]):not([title]), a:not([aria-label]):not([title])');
    
    unlabeledElements.forEach(element => {
      if (!element.textContent.trim()) {
        const context = this.getElementContext(element);
        if (context) {
          element.setAttribute('aria-label', context);
        }
      }
    });

    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #007bff';
        element.style.outlineOffset = '2px';
      });

      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  /**
   * Configura observador para cambios responsivos
   */
  setupResponsiveObserver() {
    // Observer para cambios de viewport
    const resizeObserver = new ResizeObserver(entries => {
      this.handleViewportChange();
    });

    resizeObserver.observe(document.body);

    // Observer para cambios en el DOM
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.enhanceNewElement(node);
            }
          });
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Maneja cambios de viewport
   */
  handleViewportChange() {
    const isMobile = window.innerWidth <= 768;
    const hamburger = document.querySelector('.enhanced-mobile-toggle');
    const navLinks = document.querySelector('.enhanced-nav-links');

    if (hamburger && navLinks) {
      if (isMobile) {
        hamburger.style.display = 'block';
        navLinks.classList.add('mobile-nav');
      } else {
        hamburger.style.display = 'none';
        navLinks.classList.remove('mobile-nav', 'mobile-menu-open');
      }
    }

    // Re-evaluar elementos clickeables
    this.enhanceClickableElements();
  }

  /**
   * Mejora nuevos elementos añadidos al DOM
   */
  enhanceNewElement(element) {
    if (element.matches && element.matches('button, a, input, [role="button"]')) {
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        element.style.minWidth = '44px';
        element.style.minHeight = '44px';
        element.classList.add('enhanced-touch-target');
      }
    }
  }

  /**
   * Obtiene contexto de un elemento para accesibilidad
   */
  getElementContext(element) {
    // Buscar texto en elementos padre o hermanos
    const parent = element.parentElement;
    if (parent) {
      const label = parent.querySelector('label');
      if (label) return label.textContent.trim();

      const heading = parent.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) return heading.textContent.trim();

      const text = parent.textContent.trim();
      if (text && text.length < 50) return text;
    }

    // Buscar por clases o IDs descriptivos
    const className = element.className;
    if (className) {
      const descriptiveClass = className.split(' ').find(cls => 
        cls.includes('menu') || cls.includes('nav') || cls.includes('btn') || 
        cls.includes('toggle') || cls.includes('close') || cls.includes('open')
      );
      if (descriptiveClass) {
        return descriptiveClass.replace(/[-_]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
      }
    }

    return null;
  }
}

// CSS adicional para mejoras adaptativas
const adaptiveCSS = `
  .enhanced-touch-target {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .enhanced-touch-target:hover {
    transform: scale(1.05);
  }

  .enhanced-touch-target:active {
    transform: scale(0.95);
  }

  .off-screen-element {
    border: 2px dashed red !important;
    background: rgba(255, 0, 0, 0.1) !important;
  }

  @media (max-width: 768px) {
    .enhanced-mobile-toggle {
      display: block !important;
      z-index: 9999 !important;
      position: relative !important;
      min-width: 44px !important;
      min-height: 44px !important;
    }

    .enhanced-nav-links.mobile-nav {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9998;
      display: none;
    }

    .enhanced-nav-links.mobile-menu-open {
      display: block !important;
    }

    .enhanced-nav-links.mobile-nav .enhanced-nav-item {
      display: block;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      min-height: 44px;
      display: flex;
      align-items: center;
    }
  }

  /* Mejoras para elementos muy pequeños */
  button, a, input[type="button"], input[type="submit"], [role="button"] {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  /* Mejoras para scroll horizontal */
  .container, .wrapper, .section {
    max-width: 100%;
    overflow-x: auto;
  }

  /* Mejoras para elementos fuera de pantalla */
  @media (max-width: 768px) {
    * {
      max-width: 100vw;
      box-sizing: border-box;
    }
  }
`;

// Inyectar CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = adaptiveCSS;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AdaptiveEnhancementManager();
  });
} else {
  new AdaptiveEnhancementManager();
} 