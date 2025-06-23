import { useState } from 'react';

interface HoverState {
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

/**
 * Hook para gestionar estados de hover avanzados, incluyendo la posición del ratón.
 * @returns {object} - Estado y manejadores de eventos del ratón.
 */
export const useAdvancedHover = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isHovered: false,
    mousePosition: { x: 0, y: 0 },
  });

  const handleMouseEnter = () =>
    setHoverState((prev) => ({ ...prev, isHovered: true }));

  const handleMouseLeave = () =>
    setHoverState((prev) => ({ ...prev, isHovered: false }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState((prev) => ({
      ...prev,
      mousePosition: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  };

  return { hoverState, handleMouseEnter, handleMouseLeave, handleMouseMove };
};
