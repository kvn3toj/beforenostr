import React from 'react';
import { useAdvancedHover } from '../../hooks/ui/useAdvancedHover';

interface InteractiveCardProps {
  children: React.ReactNode;
}

/**
 * Un componente contenedor que aplica efectos 3D y de spotlight al hacer hover,
 * utilizando el hook useAdvancedHover.
 */
export const InteractiveCard: React.FC<InteractiveCardProps> = ({ children }) => {
  const { hoverState, handleMouseEnter, handleMouseLeave, handleMouseMove } = useAdvancedHover();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        transformStyle: 'preserve-3d', // Necesario para la rotación 3D
        transform: hoverState.isHovered
          ? `perspective(1000px) rotateX(${(hoverState.mousePosition.y - 150) * 0.05}deg) rotateY(${(hoverState.mousePosition.x - 150) * 0.05}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      }}
    >
      {/* Spotlight effect following mouse */}
      {hoverState.isHovered && (
        <div
          className="absolute pointer-events-none bg-gradient-radial from-blue-400/20 to-transparent"
          style={{
            width: "300px", // Aumentado para un efecto más suave
            height: "300px",
            left: hoverState.mousePosition.x - 150,
            top: hoverState.mousePosition.y - 150,
            borderRadius: "50%",
            transition: 'opacity 0.3s',
            opacity: 0.5,
          }}
        />
      )}
      {children}
    </div>
  );
};
