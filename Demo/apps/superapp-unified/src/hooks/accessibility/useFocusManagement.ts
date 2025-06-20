import { useRef, useCallback, useEffect, RefObject } from 'react';

interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
}

interface UseFocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  skipLinks?: boolean;
  announceChanges?: boolean;
}

export const useFocusManagement = (options: UseFocusManagementOptions = {}) => {
  const {
    trapFocus = false,
    restoreFocus = true,
    skipLinks = true,
    announceChanges = true,
  } = options;

  // Refs for focus management
  const lastFocusedElementRef = useRef<FocusableElement | null>(null);
  const focusTrapRef = useRef<HTMLElement | null>(null);
  const skipLinkRef = useRef<HTMLAnchorElement | null>(null);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Get all focusable elements within a container
  const getFocusableElements = useCallback((container: HTMLElement): FocusableElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'video[controls]',
      'audio[controls]',
    ].join(', ');

    const elements = container.querySelectorAll(focusableSelectors) as NodeListOf<FocusableElement>;
    return Array.from(elements).filter(element => {
      // Check if element is visible and not hidden
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      );
    });
  }, []);

  // Store the currently focused element
  const storeFocus = useCallback(() => {
    const activeElement = document.activeElement as FocusableElement;
    if (activeElement && activeElement !== document.body) {
      lastFocusedElementRef.current = activeElement;
    }
  }, []);

  // Restore focus to the previously focused element
  const restoreFocusToStored = useCallback(() => {
    if (restoreFocus && lastFocusedElementRef.current) {
      try {
        lastFocusedElementRef.current.focus();
        lastFocusedElementRef.current = null;
      } catch (error) {
        console.warn('Failed to restore focus:', error);
      }
    }
  }, [restoreFocus]);

  // Focus the first focusable element in a container
  const focusFirst = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Focus the last focusable element in a container
  const focusLast = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Trap focus within a container
  const trapFocusInContainer = useCallback((container: HTMLElement) => {
    if (!trapFocus) return;

    focusTrapRef.current = container;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement as FocusableElement;

      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (currentElement === firstElement || !focusableElements.includes(currentElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (currentElement === lastElement || !focusableElements.includes(currentElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus the first element initially
    focusFirst(container);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      focusTrapRef.current = null;
    };
  }, [trapFocus, getFocusableElements, focusFirst]);

  // Release focus trap
  const releaseFocusTrap = useCallback(() => {
    if (focusTrapRef.current) {
      focusTrapRef.current = null;
    }
  }, []);

  // Create skip link for keyboard navigation
  const createSkipLink = useCallback((targetId: string, label: string = 'Saltar al contenido principal') => {
    if (!skipLinks) return null;

    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = label;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;

    // Show skip link on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    // Handle skip link activation
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        announceToScreenReader(`Navegado a ${label}`);
      }
    });

    skipLinkRef.current = skipLink;
    return skipLink;
  }, [skipLinks]);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges) return;

    if (!announcementRef.current) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcement);
      announcementRef.current = announcement;
    }

    // Clear previous message and set new one
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);
  }, [announceChanges]);

  // Keyboard navigation handler for video player
  const createKeyboardHandler = useCallback((handlers: {
    onPlayPause?: () => void;
    onSeekForward?: (seconds?: number) => void;
    onSeekBackward?: (seconds?: number) => void;
    onVolumeUp?: () => void;
    onVolumeDown?: () => void;
    onMute?: () => void;
    onFullscreen?: () => void;
    onEscape?: () => void;
    onQuestionSelect?: (optionIndex: number) => void;
    onQuestionSubmit?: () => void;
    onQuestionSkip?: () => void;
  }) => {
    return (event: KeyboardEvent) => {
      const { key, shiftKey, ctrlKey, altKey } = event;

      // Prevent default for handled keys
      const handledKeys = [' ', 'k', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'm', 'f', 'Escape', 'Enter'];
      if (handledKeys.includes(key) || /^[1-4]$/.test(key)) {
        event.preventDefault();
      }

      switch (key) {
        case ' ':
        case 'k':
          handlers.onPlayPause?.();
          announceToScreenReader('Reproducción alternada');
          break;

        case 'ArrowLeft':
          const backwardSeconds = shiftKey ? 30 : ctrlKey ? 5 : 10;
          handlers.onSeekBackward?.(backwardSeconds);
          announceToScreenReader(`Retrocedido ${backwardSeconds} segundos`);
          break;

        case 'ArrowRight':
          const forwardSeconds = shiftKey ? 30 : ctrlKey ? 5 : 10;
          handlers.onSeekForward?.(forwardSeconds);
          announceToScreenReader(`Avanzado ${forwardSeconds} segundos`);
          break;

        case 'ArrowUp':
          handlers.onVolumeUp?.();
          announceToScreenReader('Volumen aumentado');
          break;

        case 'ArrowDown':
          handlers.onVolumeDown?.();
          announceToScreenReader('Volumen disminuido');
          break;

        case 'm':
          handlers.onMute?.();
          announceToScreenReader('Audio silenciado/activado');
          break;

        case 'f':
          handlers.onFullscreen?.();
          announceToScreenReader('Pantalla completa alternada');
          break;

        case 'Escape':
          handlers.onEscape?.();
          announceToScreenReader('Acción cancelada');
          break;

        case 'Enter':
          handlers.onQuestionSubmit?.();
          break;

        case '1':
        case '2':
        case '3':
        case '4':
          const optionIndex = parseInt(key) - 1;
          handlers.onQuestionSelect?.(optionIndex);
          announceToScreenReader(`Opción ${key} seleccionada`);
          break;

        case 's':
          if (ctrlKey) {
            event.preventDefault();
            handlers.onQuestionSkip?.();
            announceToScreenReader('Pregunta saltada');
          }
          break;
      }
    };
  }, [announceToScreenReader]);

  // Focus management for modals/overlays
  const manageFocusForModal = useCallback((modalElement: HTMLElement, isOpen: boolean) => {
    if (isOpen) {
      storeFocus();
      const cleanup = trapFocusInContainer(modalElement);
      announceToScreenReader('Modal abierto', 'assertive');
      return cleanup;
    } else {
      releaseFocusTrap();
      restoreFocusToStored();
      announceToScreenReader('Modal cerrado');
    }
  }, [storeFocus, trapFocusInContainer, releaseFocusTrap, restoreFocusToStored, announceToScreenReader]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up announcement element
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
      
      // Clean up skip link
      if (skipLinkRef.current && skipLinkRef.current.parentNode) {
        skipLinkRef.current.parentNode.removeChild(skipLinkRef.current);
      }
    };
  }, []);

  return {
    // Focus management
    storeFocus,
    restoreFocusToStored,
    focusFirst,
    focusLast,
    
    // Focus trapping
    trapFocusInContainer,
    releaseFocusTrap,
    manageFocusForModal,
    
    // Skip links
    createSkipLink,
    
    // Screen reader announcements
    announceToScreenReader,
    
    // Keyboard navigation
    createKeyboardHandler,
    
    // Utility functions
    getFocusableElements,
    
    // Refs for external access
    refs: {
      lastFocusedElement: lastFocusedElementRef,
      focusTrap: focusTrapRef,
      skipLink: skipLinkRef,
      announcement: announcementRef,
    },
  };
};

export default useFocusManagement; 