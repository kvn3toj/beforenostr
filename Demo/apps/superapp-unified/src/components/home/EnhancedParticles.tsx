import React, { useEffect, useState, useCallback } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  color: string;
  type: 'sparkle' | 'orbit' | 'flow' | 'glow' | 'pulse';
  lifespan: number;
  age: number;
}

interface EnhancedParticlesProps {
  type: 'sparkle' | 'orbit' | 'flow' | 'glow' | 'pulse';
  count?: number;
  colors?: string[];
  containerRef?: React.RefObject<HTMLElement>;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  className?: string;
}

export const EnhancedParticles: React.FC<EnhancedParticlesProps> = ({
  type = 'sparkle',
  count = 15,
  colors = ['#4FC3F7', '#8BC34A', '#FFD54F', '#FF8A65'],
  intensity = 'medium',
  interactive = true,
  className = '',
}) => {
  const theme = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [animationFrame, setAnimationFrame] = useState(0);

  // 🎯 Configuración por tipo de partícula
  const particleConfig = {
    sparkle: {
      baseSpeed: 0.5,
      sizeRange: [2, 8],
      lifespanRange: [3000, 6000],
      movement: 'random',
    },
    orbit: {
      baseSpeed: 1.2,
      sizeRange: [3, 12],
      lifespanRange: [5000, 8000],
      movement: 'circular',
    },
    flow: {
      baseSpeed: 0.8,
      sizeRange: [4, 10],
      lifespanRange: [4000, 7000],
      movement: 'wave',
    },
    glow: {
      baseSpeed: 0.3,
      sizeRange: [6, 16],
      lifespanRange: [6000, 10000],
      movement: 'pulse',
    },
    pulse: {
      baseSpeed: 1.0,
      sizeRange: [3, 14],
      lifespanRange: [2000, 4000],
      movement: 'radial',
    },
  };

  const config = particleConfig[type];

  // 🎯 Función para generar partícula (ORDEN #1 - Sin dependencias complejas)
  const createParticle = useCallback(
    (x?: number, y?: number): Particle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const [minSize, maxSize] = config.sizeRange;
      const [minLife, maxLife] = config.lifespanRange;

      return {
        id: `particle-${Date.now()}-${Math.random()}`,
        x: x ?? Math.random() * 100,
        y: y ?? Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.8 + 0.2,
        speed:
          config.baseSpeed *
          (intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1),
        direction: Math.random() * Math.PI * 2,
        color,
        type,
        lifespan: Math.random() * (maxLife - minLife) + minLife,
        age: 0,
      };
    },
    [colors, config, intensity, type]
  );

  // 🎯 Inicializar partículas (ORDEN #2 - Depende de createParticle)
  const initializeParticles = useCallback(() => {
    const newParticles = Array.from({ length: count }, () => createParticle());
    setParticles(newParticles);
  }, [count, createParticle]);

  // 🔄 Actualizar partículas (ORDEN #3 - Depende de createParticle)
  const updateParticles = useCallback(() => {
    setParticles((prevParticles) => {
      return prevParticles
        .map((particle) => {
          let newX = particle.x;
          let newY = particle.y;
          let newDirection = particle.direction;
          const newAge = particle.age + 16; // ~60fps

          // Cálculos de movimiento según el tipo
          switch (config.movement) {
            case 'random':
              newX += Math.cos(particle.direction) * particle.speed;
              newY += Math.sin(particle.direction) * particle.speed;
              if (Math.random() < 0.05) {
                newDirection += (Math.random() - 0.5) * 0.5;
              }
              break;

            case 'circular':
              const centerX = interactive ? mousePos.x : 50;
              const centerY = interactive ? mousePos.y : 50;
              const radius = 20 + Math.sin(newAge * 0.001) * 10;
              const angle = newAge * 0.002 + particle.id.length;
              newX = centerX + Math.cos(angle) * radius;
              newY = centerY + Math.sin(angle) * radius;
              break;

            case 'wave':
              newX += particle.speed;
              newY += Math.sin(newX * 0.1 + newAge * 0.002) * 2;
              break;

            case 'pulse':
              const pulseIntensity = Math.sin(newAge * 0.003) * 0.5 + 0.5;
              newX +=
                Math.cos(particle.direction) * particle.speed * pulseIntensity;
              newY +=
                Math.sin(particle.direction) * particle.speed * pulseIntensity;
              break;

            case 'radial':
              const mouseInfluence = interactive ? 0.1 : 0;
              const targetX = interactive ? mousePos.x : 50;
              const targetY = interactive ? mousePos.y : 50;
              const dx = targetX - particle.x;
              const dy = targetY - particle.y;
              newX +=
                dx * mouseInfluence +
                Math.cos(particle.direction) * particle.speed;
              newY +=
                dy * mouseInfluence +
                Math.sin(particle.direction) * particle.speed;
              break;
          }

          // Límites de pantalla con wrap-around
          if (newX < 0) newX = 100;
          if (newX > 100) newX = 0;
          if (newY < 0) newY = 100;
          if (newY > 100) newY = 0;

          // Calcular opacidad basada en edad
          const ageRatio = newAge / particle.lifespan;
          const newOpacity = particle.opacity * (1 - ageRatio * 0.7);

          return {
            ...particle,
            x: newX,
            y: newY,
            direction: newDirection,
            age: newAge,
            opacity: Math.max(0.1, newOpacity),
          };
        })
        .filter((particle) => particle.age < particle.lifespan);
    });
  }, [config.movement, interactive, mousePos]);

  // 🎯 Agregar nuevas partículas para mantener el count
  const maintainParticleCount = useCallback(() => {
    setParticles((prevParticles) => {
      const currentCount = prevParticles.length;
      if (currentCount < count) {
        const newParticles = Array.from({ length: count - currentCount }, () =>
          createParticle()
        );
        return [...prevParticles, ...newParticles];
      }
      return prevParticles;
    });
  }, [count, createParticle]);

  // 🎯 Efecto de inicialización
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  // 🔄 Bucle de animación
  useEffect(() => {
    const animationLoop = () => {
      updateParticles();
      maintainParticleCount();
      setAnimationFrame((prev) => prev + 1);
    };

    const intervalId = setInterval(animationLoop, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [updateParticles, maintainParticleCount]);

  // 🖱️ Tracking del mouse para interactividad
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up EnhancedParticles');
    };
  }, []);

  // 🎨 Renderizar partículas con efectos específicos
  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none' as const,
      zIndex: 1,
    };

    switch (particle.type) {
      case 'sparkle':
        return (
          <Box
            key={particle.id}
            sx={{
              ...baseStyle,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${alpha(particle.color, 0.6)}`,
              animation: `sparkle-twinkle 2s ease-in-out infinite`,
              animationDelay: `${particle.age * 0.001}s`,
            }}
          />
        );

      case 'orbit':
        return (
          <Box
            key={particle.id}
            sx={{
              ...baseStyle,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${particle.color} 0%, ${alpha(particle.color, 0.3)} 100%)`,
              opacity: particle.opacity,
              border: `2px solid ${alpha(particle.color, 0.4)}`,
              boxShadow: `0 0 ${particle.size}px ${alpha(particle.color, 0.8)}`,
            }}
          />
        );

      case 'flow':
        return (
          <Box
            key={particle.id}
            sx={{
              ...baseStyle,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${particle.color} 0%, transparent 60%)`,
              opacity: particle.opacity,
              filter: 'blur(1px)',
              transform: `translate(-50%, -50%) scale(${Math.sin(particle.age * 0.002) * 0.3 + 0.7})`,
            }}
          />
        );

      case 'glow':
        return (
          <Box
            key={particle.id}
            sx={{
              ...baseStyle,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(particle.color, 0.8)} 0%, ${alpha(particle.color, 0.2)} 50%, transparent 80%)`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 3}px ${alpha(particle.color, 0.6)}, 0 0 ${particle.size * 6}px ${alpha(particle.color, 0.3)}`,
              animation: `glow-pulse 3s ease-in-out infinite`,
              animationDelay: `${particle.age * 0.001}s`,
            }}
          />
        );

      case 'pulse':
        const pulseScale = Math.sin(particle.age * 0.005) * 0.4 + 0.8;
        return (
          <Box
            key={particle.id}
            sx={{
              ...baseStyle,
              borderRadius: '50%',
              background: particle.color,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) scale(${pulseScale})`,
              boxShadow: `0 0 ${particle.size * pulseScale * 2}px ${alpha(particle.color, 0.5)}`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      className={`enhanced-particles enhanced-particles-${type} ${className}`}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 0,
      }}
    >
      {particles.map(renderParticle)}

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
        @keyframes sparkle-twinkle {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.5);
          }
        }

        @keyframes float-sparkle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-orbit {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(180deg);
          }
        }

        @keyframes float-flow {
          0%,
          100% {
            transform: translateY(0px) scaleX(1);
          }
          50% {
            transform: translateY(-6px) scaleX(1.2);
          }
        }

        @keyframes float-glow {
          0%,
          100% {
            transform: translateY(0px);
            filter: brightness(1);
          }
          50% {
            transform: translateY(-4px);
            filter: brightness(1.3);
          }
        }

        @keyframes float-pulse {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.1);
          }
        }
      `}</style>
    </Box>
  );
};

export default EnhancedParticles;
