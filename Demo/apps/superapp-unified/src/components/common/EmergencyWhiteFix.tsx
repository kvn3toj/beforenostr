/**
 * 🚨 Emergency White Fix
 * Corrección inmediata y agresiva de fondos negros persistentes
 */

import { useEffect } from 'react';

export const EmergencyWhiteFix: React.FC = () => {
  useEffect(() => {
    const emergencyFix = () => {
      console.log(
        '🚨 Aplicando corrección de emergencia para fondos negros...'
      );

      // 1. Forzar TODOS los elementos con fondos específicos
      const problematicBackgrounds = [
        'rgb(41, 37, 36)',
        'rgb(55, 65, 81)',
        'rgb(31, 41, 55)',
        'rgb(17, 24, 39)',
        'rgb(87, 83, 78)',
        'rgb(68, 64, 60)',
      ];

      problematicBackgrounds.forEach((bgColor) => {
        const elements = document.querySelectorAll(
          `[style*="backgroundColor: ${bgColor}"]`
        );
        const elementsAlt = document.querySelectorAll(
          `[style*="background-color: ${bgColor}"]`
        );

        [...elements, ...elementsAlt].forEach((element) => {
          if (element instanceof HTMLElement) {
            // Forzar estilo directamente
            element.style.setProperty(
              'background-color',
              '#ffffff',
              'important'
            );
            element.style.setProperty('background', '#ffffff', 'important');
            element.style.setProperty('color', '#1f2937', 'important');
            element.style.setProperty(
              'border',
              '2px solid #22c55e',
              'important'
            );
            element.style.setProperty('border-radius', '16px', 'important');
            element.style.setProperty(
              'box-shadow',
              '0 4px 12px rgba(34, 197, 94, 0.15)',
              'important'
            );

            console.log(`✅ Corregido elemento con fondo ${bgColor}:`, element);

            // Corregir textos dentro del elemento
            const textElements = element.querySelectorAll('*');
            textElements.forEach((textEl) => {
              if (textEl instanceof HTMLElement) {
                textEl.style.setProperty('color', '#1f2937', 'important');
              }
            });
          }
        });
      });

      // 2. Eliminar outlines problemáticos
      const outlineElements = document.querySelectorAll(
        '[style*="outline: rgb(99, 102, 241)"]'
      );
      outlineElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.setProperty('outline', 'none', 'important');
          element.style.setProperty(
            'outline-color',
            'transparent',
            'important'
          );
          console.log('✅ Eliminado outline problemático:', element);
        }
      });

      // 3. Buscar y corregir por contenido (métricas específicas)
      const metricsPattern = /^[0-9]+[+]?$|^[0-9]+\.?[0-9]*[K]?$/;
      const spans = document.querySelectorAll('span');

      spans.forEach((span) => {
        if (span.textContent && metricsPattern.test(span.textContent.trim())) {
          const parentCard = span.closest('div[style*="backgroundColor"]');
          if (parentCard instanceof HTMLElement) {
            parentCard.style.setProperty(
              'background-color',
              '#ffffff',
              'important'
            );
            parentCard.style.setProperty('background', '#ffffff', 'important');
            parentCard.style.setProperty(
              'border',
              '2px solid #22c55e',
              'important'
            );
            console.log('✅ Corregida card de métrica:', parentCard);
          }
        }
      });

      // 4. Corrección por clases conocidas
      const knownProblematicClasses = [
        '.MuiPaper-root',
        '.MuiCard-root',
        '[data-testid*="card"]',
        '[data-testid*="metric"]',
      ];

      knownProblematicClasses.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element instanceof HTMLElement) {
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;

            // Si tiene un fondo oscuro, corregirlo
            if (
              bgColor.includes('41, 37, 36') ||
              bgColor.includes('55, 65, 81') ||
              bgColor.includes('31, 41, 55')
            ) {
              element.style.setProperty(
                'background-color',
                '#ffffff',
                'important'
              );
              element.style.setProperty('background', '#ffffff', 'important');
              element.style.setProperty('color', '#1f2937', 'important');
              console.log(`✅ Corregido ${selector}:`, element);
            }
          }
        });
      });

      console.log('🚨 Corrección de emergencia completada');
    };

    // Aplicar corrección inmediatamente
    emergencyFix();

    // Aplicar corrección después de un breve delay
    setTimeout(emergencyFix, 100);
    setTimeout(emergencyFix, 500);
    setTimeout(emergencyFix, 1000);

    // Observer agresivo para cambios dinámicos
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const target = mutation.target as HTMLElement;
          if (
            target.style.backgroundColor?.includes('41, 37, 36') ||
            target.style.backgroundColor?.includes('55, 65, 81') ||
            target.style.backgroundColor?.includes('31, 41, 55')
          ) {
            needsFix = true;
          }
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const hasProblematicBg =
              node.style.backgroundColor?.includes('41, 37, 36') ||
              node.style.backgroundColor?.includes('55, 65, 81') ||
              node.style.backgroundColor?.includes('31, 41, 55');
            if (hasProblematicBg) {
              needsFix = true;
            }
          }
        });
      });

      if (needsFix) {
        setTimeout(emergencyFix, 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Corrección periódica agresiva
    const intervalId = setInterval(emergencyFix, 1000);

    // Corrección en eventos específicos
    const events = ['load', 'DOMContentLoaded', 'resize', 'focus'];
    events.forEach((event) => {
      window.addEventListener(event, emergencyFix);
    });

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      events.forEach((event) => {
        window.removeEventListener(event, emergencyFix);
      });
    };
  }, []);

  return null;
};

export default EmergencyWhiteFix;
