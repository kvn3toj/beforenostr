import { useState, useCallback } from 'react';

export const useAdvancedHover = () => {
  const [hoverState, setHoverState] = useState({
    isHovered: false,
    mousePosition: { x: 0, y: 0 },
  });

  const handleMouseEnter = useCallback(() => {
    setHoverState((prev) => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverState((prev) => ({ ...prev, isHovered: false }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState((prev) => ({
      ...prev,
      mousePosition: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  }, []);

  return { hoverState, handleMouseEnter, handleMouseLeave, handleMouseMove };
};

