import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🧠 HOOK PARA COMPORTAMIENTOS INTUITIVOS
 * Maneja micro-interacciones, animaciones de entrada y feedback visual inteligente
 */

interface IntuitiveConfig {
  enableHoverEffects?: boolean;
  enableRippleEffect?: boolean;
  enableProgressiveReveal?: boolean;
  enableSmartFocus?: boolean;
  hoverDelay?: number;
  revealThreshold?: number;
}

interface IntuitiveState {
  isHovered: boolean;
  isFocused: boolean;
  isVisible: boolean;
  isPressed: boolean;
  hasAnimated: boolean;
  ripplePosition: { x: number; y: number } | null;
}

export const useIntuitiveBehavior = (config: IntuitiveConfig = {}) => {
  const {
    enableHoverEffects = true,
    enableRippleEffect = true,
    enableProgressiveReveal = true,
    enableSmartFocus = true,
    hoverDelay = 100,
    revealThreshold = 0.1,
  } = config;

  const [state, setState] = useState<IntuitiveState>({
    isHovered: false,
    isFocused: false,
    isVisible: false,
    isPressed: false,
    hasAnimated: false,
    ripplePosition: null,
  });

  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 👁️ Observador de intersección para revelar progresivo
  useEffect(() => {
    if (!enableProgressiveReveal || !elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setState((prev) => {
          if (entry.isIntersecting && !prev.hasAnimated) {
            return {
              ...prev,
              isVisible: true,
              hasAnimated: true,
            };
          }
          return prev;
        });
      },
      {
        threshold: revealThreshold,
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableProgressiveReveal, revealThreshold]);

  // 🖱️ Handlers de hover inteligente
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      if (!enableHoverEffects) return;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, isHovered: true }));
      }, hoverDelay);
    },
    [enableHoverEffects, hoverDelay]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setState((prev) => ({ ...prev, isHovered: false }));
  }, []);

  // 👆 Handler de touch/click con ripple effect
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!enableRippleEffect) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setState((prev) => ({
        ...prev,
        isPressed: true,
        ripplePosition: { x, y },
      }));

      // Limpiar el ripple después de la animación
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isPressed: false,
          ripplePosition: null,
        }));
      }, 300);
    },
    [enableRippleEffect]
  );

  // ⌨️ Handlers de foco inteligente
  const handleFocus = useCallback(() => {
    if (!enableSmartFocus) return;
    setState((prev) => ({ ...prev, isFocused: true }));
  }, [enableSmartFocus]);

  const handleBlur = useCallback(() => {
    setState((prev) => ({ ...prev, isFocused: false }));
  }, []);

  // 🎨 Generador de estilos dinámicos
  const getIntuitiveStyles = useCallback(() => {
    const baseStyles: React.CSSProperties = {
      transition: 'all 0.382s cubic-bezier(0.25, 0.8, 0.25, 1)',
      transform: 'translateZ(0)', // Activar aceleración GPU
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    };

    const hoverStyles: React.CSSProperties = state.isHovered
      ? {
          transform: 'translateY(-2px) scale(1.03)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          filter: 'brightness(1.05)',
        }
      : {};

    const focusStyles: React.CSSProperties = state.isFocused
      ? {
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(0, 188, 212, 0.3)',
        }
      : {};

    const pressedStyles: React.CSSProperties = state.isPressed
      ? {
          transform: 'translateY(0px) scale(0.98)',
          transitionDuration: '0.146s',
        }
      : {};

    return {
      ...baseStyles,
      ...hoverStyles,
      ...focusStyles,
      ...pressedStyles,
    };
  }, [state.isHovered, state.isFocused, state.isPressed]);

  // 🎯 Función helper para aplicar clases CSS intuitivas
  const getIntuitiveClasses = useCallback(
    (baseClasses: string = '') => {
      const classes = [baseClasses];

      if (enableProgressiveReveal) {
        classes.push('intuitive-reveal');
        if (state.isVisible) classes.push('visible');
      }

      if (enableHoverEffects) {
        classes.push('intuitive-clickable');
      }

      if (state.isHovered) classes.push('hovered');
      if (state.isFocused) classes.push('focused');
      if (state.isPressed) classes.push('pressed');

      return classes.filter(Boolean).join(' ');
    },
    [enableProgressiveReveal, enableHoverEffects, state]
  );

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    // Estados
    ...state,

    // Refs
    elementRef,

    // Event handlers
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onPointerDown: handlePointerDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },

    // Utilidades de estilo
    getIntuitiveStyles,
    getIntuitiveClasses,

    // Helpers
    triggerCustomAnimation: (animationName: string, duration: number = 600) => {
      if (elementRef.current) {
        elementRef.current.style.animation = `${animationName} ${duration}ms ease-out`;
        setTimeout(() => {
          if (elementRef.current) {
            elementRef.current.style.animation = '';
          }
        }, duration);
      }
    },

    forceReveal: () => {
      setState((prev) => ({ ...prev, isVisible: true, hasAnimated: true }));
    },

    reset: () => {
      setState({
        isHovered: false,
        isFocused: false,
        isVisible: false,
        isPressed: false,
        hasAnimated: false,
        ripplePosition: null,
      });
    },
  };
};

export default useIntuitiveBehavior;
