import React, { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  className?: string;
}

/**
 * FocusTrap Component
 * 
 * Manages focus within a container, typically used for modals and dialogs.
 * Prevents focus from escaping the container and provides keyboard navigation support.
 * 
 * Features:
 * - Traps focus within the component
 * - Supports Escape key to exit
 * - Restores focus to the triggering element
 * - Configurable initial focus element
 * 
 * @param children - Content to render within the focus trap
 * @param active - Whether the focus trap is active
 * @param restoreFocus - Whether to restore focus when trap is deactivated
 * @param initialFocus - Ref to element that should receive initial focus
 * @param className - Additional CSS classes
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  restoreFocus = true,
  initialFocus,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];

    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'input[type="submit"]:not([disabled])',
      'input[type="button"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(selector))
      .filter((element) => {
        const htmlElement = element as HTMLElement;
        return htmlElement.offsetWidth > 0 && htmlElement.offsetHeight > 0;
      }) as HTMLElement[];
  };

  // Handle Tab key navigation
  const handleTabKey = (event: KeyboardEvent) => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!active) return;

    switch (event.key) {
      case 'Tab':
        handleTabKey(event);
        break;
      case 'Escape':
        // Allow parent components to handle escape
        // This should be handled by the modal/dialog component
        break;
    }
  };

  // Set initial focus
  const setInitialFocus = () => {
    if (!active) return;

    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  // Store previous active element and set initial focus
  useEffect(() => {
    if (active) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Set initial focus after a small delay to ensure DOM is ready
      const timeoutId = setTimeout(setInitialFocus, 10);
      
      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore focus to previous element
        if (restoreFocus && previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [active, restoreFocus]);

  // Update focus when initialFocus changes
  useEffect(() => {
    if (active && initialFocus?.current) {
      initialFocus.current.focus();
    }
  }, [active, initialFocus]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      role="dialog"
      {...(active && { 'aria-modal': true })}
    >
      {children}
    </div>
  );
}; 