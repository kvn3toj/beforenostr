/**
 * 🍃 Autumn Visual Enhancer
 * Componente que aplica mejoras visuales automáticamente a elementos específicos
 * Corrige fondos oscuros y añade identidad verde otoñal
 */

import { useEffect } from 'react';

export const AutumnVisualEnhancer: React.FC = () => {
  useEffect(() => {
    // Función para aplicar clases de mejora visual
    const applyVisualEnhancements = () => {
      // 🎯 Targeting específico de cards de métricas principales
      const metricsCards = document.querySelectorAll(
        'div[style*="backgroundColor: rgb(41, 37, 36)"]'
      );
      metricsCards.forEach((card) => {
        if (card instanceof HTMLElement) {
          card.classList.add(
            'metric-card-green',
            'force-white-bg',
            'force-green-border',
            'force-green-shadow'
          );

          // Buscar números grandes en la card
          const numbers = card.querySelectorAll('span[style*="fontSize"]');
          numbers.forEach((num) => {
            if (num instanceof HTMLElement) {
              num.classList.add('metric-number');
            }
          });

          // Buscar labels en la card
          const labels = card.querySelectorAll('span:not([style*="fontSize"])');
          labels.forEach((label) => {
            if (label instanceof HTMLElement) {
              label.classList.add('metric-label');
            }
          });
        }
      });

      // 🎯 Cards de módulos (Sostenibilidad, Educación, etc.)
      const moduleCards = document.querySelectorAll(
        'div[style*="backgroundColor: rgb(55, 65, 81)"], div[style*="backgroundColor: rgb(31, 41, 55)"]'
      );
      moduleCards.forEach((card, index) => {
        if (card instanceof HTMLElement) {
          card.classList.add(
            'autumn-card-enhanced',
            'force-white-bg',
            'force-green-border'
          );

          // Aplicar temas específicos basados en contenido
          const cardText = card.textContent?.toLowerCase() || '';

          if (
            cardText.includes('sostenibilidad') ||
            cardText.includes('sustainability')
          ) {
            card.classList.add('module-card-sustainability');
          } else if (
            cardText.includes('educación') ||
            cardText.includes('education')
          ) {
            card.classList.add('module-card-education');
          } else if (
            cardText.includes('bienestar') ||
            cardText.includes('wellness') ||
            cardText.includes('salud')
          ) {
            card.classList.add('module-card-wellness');
          }
        }
      });

      // 🎯 Eliminar outlines azules/morados problemáticos
      const elementsWithPurpleOutline = document.querySelectorAll(
        '[style*="outline: rgb(99, 102, 241)"], [style*="outlineColor: rgb(99, 102, 241)"]'
      );
      elementsWithPurpleOutline.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.outline = 'none';
          element.style.outlineColor = 'transparent';
        }
      });

      // 🎯 Header enhancement
      const headers = document.querySelectorAll(
        'header, nav[role="banner"], [data-testid*="header"]'
      );
      headers.forEach((header) => {
        if (header instanceof HTMLElement) {
          header.classList.add('autumn-header-enhanced');
        }
      });

      // 🎯 Sidebar enhancement
      const sidebars = document.querySelectorAll(
        'aside, nav[role="navigation"], [data-testid*="sidebar"], .MuiDrawer-paper'
      );
      sidebars.forEach((sidebar) => {
        if (sidebar instanceof HTMLElement) {
          sidebar.classList.add('autumn-sidebar-enhanced');
        }
      });

      // 🎯 Botones principales
      const primaryButtons = document.querySelectorAll(
        'button[style*="background"], .MuiButton-containedPrimary'
      );
      primaryButtons.forEach((button) => {
        if (button instanceof HTMLElement) {
          const buttonText = button.textContent?.toLowerCase() || '';
          if (
            buttonText.includes('crear') ||
            buttonText.includes('guardar') ||
            buttonText.includes('enviar')
          ) {
            button.classList.add('autumn-button-green-primary');
          }
        }
      });

      // 🎯 Aplicar animaciones sutiles
      const enhancedCards = document.querySelectorAll(
        '.autumn-card-enhanced, .metric-card-green'
      );
      enhancedCards.forEach((card, index) => {
        if (card instanceof HTMLElement) {
          // Añadir animación con delay escalonado
          setTimeout(() => {
            card.classList.add('autumn-leaf-growth');
          }, index * 100);
        }
      });
    };

    // Aplicar mejoras inmediatamente
    applyVisualEnhancements();

    // Aplicar mejoras después de que se cargue el contenido dinámico
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Verificar si el nodo añadido contiene elementos que necesitan mejoras
            const hasProblematicBg =
              node.style.backgroundColor === 'rgb(41, 37, 36)' ||
              node.style.backgroundColor === 'rgb(55, 65, 81)' ||
              node.style.backgroundColor === 'rgb(31, 41, 55)';

            const hasProblematicOutline =
              node.style.outline?.includes('rgb(99, 102, 241)') ||
              node.style.outlineColor?.includes('rgb(99, 102, 241)');

            if (hasProblematicBg || hasProblematicOutline) {
              shouldReapply = true;
            }
          }
        });
      });

      if (shouldReapply) {
        setTimeout(applyVisualEnhancements, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Reaplizar en intervalos para elementos muy persistentes
    const intervalId = setInterval(applyVisualEnhancements, 2000);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return null; // Este componente no renderiza nada, solo aplica mejoras
};

export default AutumnVisualEnhancer;
