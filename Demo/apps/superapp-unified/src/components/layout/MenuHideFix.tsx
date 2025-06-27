import React, { useEffect } from 'react';

/**
 * 🔧 MenuHideFix - Componente para solucionar el problema del menú que no se esconde
 *
 * Este componente:
 * 1. Aplica CSS para forzar que los menús móviles se comporten correctamente
 * 2. Gestiona z-index para evitar superposición de elementos
 * 3. Asegura que el contenido principal tenga el espacio correcto
 */
export const MenuHideFix: React.FC = () => {
  useEffect(() => {
    // 🎯 Aplicar estilos CSS para corregir problemas de navegación
    const style = document.createElement('style');
    style.textContent = `
      /* 🔧 Fix para Drawer/Menu que no se esconde correctamente */
      .MuiDrawer-paper {
        z-index: 1200 !important;
      }

      .MuiDrawer-modal {
        z-index: 1200 !important;
      }

      /* 🔧 Fix para AppBar en mobile */
      .MuiAppBar-root {
        z-index: 1300 !important;
      }

      /* 🔧 Asegurar que el backdrop se cierre correctamente */
      .MuiBackdrop-root {
        z-index: 1100 !important;
      }

      /* 🔧 Fix para el contenido principal */
      main {
        position: relative;
        z-index: 1;
        overflow-x: hidden;
      }

      /* 🔧 Fix específico para navegación bottom en mobile */
      .conscious-nav {
        z-index: 1000 !important;
      }

      /* 🔧 Fix para elementos flotantes */
      .MuiFab-root {
        z-index: 1050 !important;
      }

      /* 🔧 Fix para menús desplegables */
      .MuiMenu-paper {
        z-index: 1350 !important;
      }

      /* 🔧 Fix para tooltips */
      .MuiTooltip-popper {
        z-index: 1400 !important;
      }

      /* 🔧 Fix para snackbars/toasts */
      .Toastify__toast-container {
        z-index: 1500 !important;
      }

      /* 🔧 Fix general para overlay issues */
      body {
        overflow-x: hidden;
      }

      /* 🔧 Fix para evitar scroll horizontal en contenido */
      #root {
        overflow-x: hidden;
        min-height: 100vh;
      }

      /* 🔧 Fix específico para casos donde el drawer no se cierra */
      .MuiDrawer-paperAnchorLeft.MuiDrawer-paperTemporary {
        transform: translateX(-100%) !important;
        transition: transform 225ms cubic-bezier(0.0, 0, 0.2, 1) !important;
      }

      .MuiDrawer-paperAnchorLeft.MuiDrawer-paperTemporary.MuiPaper-root {
        transform: translateX(-100%) !important;
      }

      /* 🔧 Fix cuando el drawer está abierto */
      .MuiDrawer-root .MuiDrawer-paperAnchorLeft.MuiDrawer-paperTemporary[style*="visibility: visible"] {
        transform: translateX(0) !important;
      }

      /* 🔧 Fix para video players que puedan interferir */
      video {
        position: relative;
        z-index: auto;
      }

      /* 🔧 Fix para iframes que puedan interferir */
      iframe {
        position: relative;
        z-index: auto;
      }
    `;

    document.head.appendChild(style);

    // 🧹 Cleanup cuando el componente se desmonte
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    // 🔧 Función para manejar clics en el backdrop
    const handleBackdropClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target?.classList.contains('MuiBackdrop-root')) {
        // Forzar cierre de todos los drawers abiertos
        const openDrawers = document.querySelectorAll('.MuiDrawer-paperTemporary[style*="visibility: visible"]');
        openDrawers.forEach(drawer => {
          const backdrop = drawer.parentElement?.querySelector('.MuiBackdrop-root') as HTMLElement;
          if (backdrop) {
            backdrop.click();
          }
        });
      }
    };

    // 🔧 Función para manejar tecla Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Forzar cierre de todos los drawers abiertos
        const openDrawers = document.querySelectorAll('.MuiDrawer-paperTemporary[style*="visibility: visible"]');
        openDrawers.forEach(drawer => {
          const backdrop = drawer.parentElement?.querySelector('.MuiBackdrop-root') as HTMLElement;
          if (backdrop) {
            backdrop.click();
          }
        });
      }
    };

    document.addEventListener('click', handleBackdropClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleBackdropClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // 🔧 Observer para detectar cuando hay problemas de overlays
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;

          // Detectar si hay un drawer que debería estar cerrado pero está visible
          if (target.classList.contains('MuiDrawer-paperTemporary')) {
            const style = target.getAttribute('style') || '';
            const hasVisibility = style.includes('visibility: visible');
            const hasTransform = style.includes('transform');

            // Si está visible pero no tiene transform correcto, aplicar fix
            if (hasVisibility && hasTransform && !style.includes('translateX(0')) {
              console.log('🔧 MenuHideFix: Detectado drawer problemático, aplicando fix...');
              target.style.transform = 'translateX(-100%)';
              target.style.visibility = 'hidden';
            }
          }
        }
      });
    });

    // Observar cambios en todo el documento
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Este componente solo aplica fixes, no renderiza nada
};
