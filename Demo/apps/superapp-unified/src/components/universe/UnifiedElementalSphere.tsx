// 🌟 CoomÜnity SuperApp - Esfera Elemental Unificada
// Componente reutilizable para todas las representaciones de elementos

import React, { useEffect, useState, useMemo } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ElementType, 
  ElementalConfiguration, 
  UNIFIED_ELEMENTAL_CONFIG,
  ElementalUtils 
} from './ElementalSystem';

export interface OrbitalPosition {
  x: number;
  y: number;
  z: number;
  harmony: number;
}

export interface InteractionState {
  isHovered: boolean;
  isActive: boolean;
  isResonating: boolean;
  interactionLevel: number;
}

export interface UnifiedElementalSphereProps {
  element: ElementType;
  size?: 'small' | 'medium' | 'large' | 'cosmic';
  position?: OrbitalPosition;
  interactionState?: InteractionState;
  showTrail?: boolean;
  showParticles?: boolean;
  onElementClick?: (element: ElementType) => void;
  onElementHover?: (element: ElementType, hovered: boolean) => void;
  animationSpeed?: number;
  glowIntensity?: number;
  className?: string;
}

const SIZE_CONFIGS = {
  small: { diameter: 40, trail: 20, particles: 3 },
  medium: { diameter: 60, trail: 30, particles: 5 },
  large: { diameter: 80, trail: 40, particles: 8 },
  cosmic: { diameter: 120, trail: 60, particles: 12 },
};

export const UnifiedElementalSphere: React.FC<UnifiedElementalSphereProps> = ({
  element,
  size = 'medium',
  position,
  interactionState = {
    isHovered: false,
    isActive: false,
    isResonating: false,
    interactionLevel: 0.5
  },
  showTrail = true,
  showParticles = true,
  onElementClick,
  onElementHover,
  animationSpeed = 1.0,
  glowIntensity = 1.0,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [trailPoints, setTrailPoints] = useState<OrbitalPosition[]>([]);
  
  const config: ElementalConfiguration = UNIFIED_ELEMENTAL_CONFIG[element];
  const sizeConfig = SIZE_CONFIGS[size];

  // 🎨 Efectos visuales dinámicos
  const visualEffects = useMemo(() => {
    const baseIntensity = interactionState.interactionLevel * glowIntensity;
    const pulseIntensity = Math.sin(currentTime * config.physics.pulseFrequency) * 0.3 + 0.7;
    
    return {
      glowIntensity: baseIntensity * pulseIntensity,
      scaleMultiplier: interactionState.isHovered ? 1.2 : (interactionState.isActive ? 1.1 : 1.0),
      rotationSpeed: config.orbital.rotationSpeed * animationSpeed,
      resonanceEffect: interactionState.isResonating ? 1.4 : 1.0,
    };
  }, [currentTime, config, interactionState, glowIntensity, animationSpeed]);

  // ⏰ Animación temporal
  useEffect(() => {
    const animationFrame = () => {
      setCurrentTime(Date.now() / 1000);
      
      if (showTrail && position) {
        setTrailPoints(prev => {
          const newTrail = [position, ...prev.slice(0, sizeConfig.trail - 1)];
          return newTrail;
        });
      }
    };

    const interval = setInterval(animationFrame, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [position, showTrail, sizeConfig.trail]);

  // 🎯 Manejo de eventos
  const handleClick = () => {
    if (onElementClick) {
      onElementClick(element);
    }
  };

  const handleMouseEnter = () => {
    if (onElementHover) {
      onElementHover(element, true);
    }
  };

  const handleMouseLeave = () => {
    if (onElementHover) {
      onElementHover(element, false);
    }
  };

  // 🌈 Generación de partículas
  const particleElements = useMemo(() => {
    if (!showParticles) return [];
    
    return Array.from({ length: sizeConfig.particles }, (_, index) => {
      const angle = (index / sizeConfig.particles) * Math.PI * 2;
      const distance = sizeConfig.diameter * 0.6;
      const particleTime = currentTime + index * 0.5;
      
      return {
        id: index,
        x: Math.cos(angle + particleTime * 0.5) * distance,
        y: Math.sin(angle + particleTime * 0.5) * distance,
        opacity: (Math.sin(particleTime * 2) + 1) / 2,
        scale: 0.3 + (Math.cos(particleTime * 1.5) + 1) / 4,
      };
    });
  }, [showParticles, sizeConfig, currentTime]);

  return (
    <Box
      className={`unified-elemental-sphere ${className}`}
      sx={{
        position: 'absolute',
        left: position?.x || 0,
        top: position?.y || 0,
        transform: `translateZ(${position?.z || 0}px)`,
        width: sizeConfig.diameter,
        height: sizeConfig.diameter,
        pointerEvents: 'auto',
      }}
    >
      {/* 🌟 Trail de Movimiento */}
      <AnimatePresence>
        {showTrail && trailPoints.map((point, index) => (
          <motion.div
            key={`trail-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: (1 - index / trailPoints.length) * 0.6,
              scale: 1 - index * 0.05,
            }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'absolute',
              left: point.x - sizeConfig.diameter / 2,
              top: point.y - sizeConfig.diameter / 2,
              width: sizeConfig.diameter * 0.3,
              height: sizeConfig.diameter * 0.3,
              borderRadius: '50%',
              background: config.visuals.trailColor,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ✨ Partículas Orbitales */}
      <AnimatePresence>
        {particleElements.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity * visualEffects.resonanceEffect,
              scale: particle.scale,
            }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: config.visuals.particleColor,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* 🌍 Esfera Principal */}
      <Tooltip 
        title={`${config.name} ${config.symbol} - Resonancia: ${config.interaction.resonance}`}
        placement="top"
      >
        <IconButton
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            width: '100%',
            height: '100%',
            padding: 0,
            borderRadius: '50%',
            background: config.visuals.gradient,
            border: `2px solid ${config.visuals.primaryColor}`,
            boxShadow: `
              0 0 ${20 * visualEffects.glowIntensity}px ${config.visuals.glowColor},
              inset 0 0 ${10 * visualEffects.glowIntensity}px rgba(255, 255, 255, 0.3),
              0 ${5 * visualEffects.scaleMultiplier}px ${15 * visualEffects.scaleMultiplier}px ${config.visuals.shadowColor}
            `,
            transform: `
              scale(${visualEffects.scaleMultiplier}) 
              rotateZ(${currentTime * visualEffects.rotationSpeed * 50}deg)
            `,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: onElementClick ? 'pointer' : 'default',
            
            '&:hover': {
              transform: `
                scale(${visualEffects.scaleMultiplier * 1.1}) 
                rotateZ(${currentTime * visualEffects.rotationSpeed * 50}deg)
              `,
              boxShadow: `
                0 0 ${30 * visualEffects.glowIntensity}px ${config.visuals.glowColor},
                inset 0 0 ${15 * visualEffects.glowIntensity}px rgba(255, 255, 255, 0.4),
                0 ${8 * visualEffects.scaleMultiplier}px ${20 * visualEffects.scaleMultiplier}px ${config.visuals.shadowColor}
              `,
            },

            '&:active': {
              transform: `
                scale(${visualEffects.scaleMultiplier * 0.95}) 
                rotateZ(${currentTime * visualEffects.rotationSpeed * 50}deg)
              `,
            },
          }}
        >
          {/* 🔥 Símbolo del Elemento */}
          <Box
            sx={{
              fontSize: size === 'cosmic' ? '3rem' : size === 'large' ? '2rem' : size === 'medium' ? '1.5rem' : '1rem',
              filter: `drop-shadow(0 0 ${10 * visualEffects.glowIntensity}px ${config.visuals.glowColor})`,
              transform: `rotateZ(-${currentTime * visualEffects.rotationSpeed * 50}deg)`, // Contra-rotación para mantener símbolo estable
            }}
          >
            {config.symbol}
          </Box>
        </IconButton>
      </Tooltip>

      {/* 🌊 Efecto de Resonancia */}
      <AnimatePresence>
        {interactionState.isResonating && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: sizeConfig.diameter * 2,
              height: sizeConfig.diameter * 2,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `3px solid ${config.visuals.primaryColor}`,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default UnifiedElementalSphere; 