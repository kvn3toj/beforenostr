import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface UniverseBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  showAurora?: boolean;
  showParticles?: boolean;
  showConstelations?: boolean;
  className?: string;
}

const UniverseBackground: React.FC<UniverseBackgroundProps> = ({
  intensity = 'medium',
  showAurora = true,
  showParticles = true,
  showConstelations = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);
  
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    twinkleDuration: number;
    delay: number;
    brightness: number;
  }>>([]);

  // 🌌 Generar partículas cósmicas
  useEffect(() => {
    const particleCount = intensity === 'low' ? 15 : intensity === 'medium' ? 25 : 40;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // Porcentaje
        y: Math.random() * 100,
        size: Math.random() * 3 + 1, // 1-4px
        duration: Math.random() * 10 + 15, // 15-25s
        delay: Math.random() * 20, // 0-20s delay
      });
    }
    
    setParticles(newParticles);
  }, [intensity]);

  // ⭐ Generar constelaciones
  useEffect(() => {
    if (!showConstelations) return;
    
    const starCount = intensity === 'low' ? 30 : intensity === 'medium' ? 50 : 80;
    const newStars = [];
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, // 0.5-2.5px
        twinkleDuration: Math.random() * 3 + 2, // 2-5s
        delay: Math.random() * 10, // 0-10s delay
        brightness: Math.random() * 0.6 + 0.2, // 0.2-0.8 opacity
      });
    }
    
    setStars(newStars);
  }, [showConstelations, intensity]);

  // 🌈 Renderizar aurora boreal
  const renderAurora = () => {
    if (!showAurora) return null;
    
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <Box
            key={`aurora-${index}`}
            className="aurora-layer"
            sx={{
              top: `${index * 15}%`,
              '--aurora-duration': `${12 + index * 2}s`,
              animationDelay: `${index * 4}s`,
              background: index === 0 
                ? 'linear-gradient(90deg, transparent, rgba(0, 255, 150, 0.08), rgba(0, 150, 255, 0.06), transparent)'
                : index === 1
                ? 'linear-gradient(90deg, transparent, rgba(255, 100, 255, 0.05), rgba(100, 200, 255, 0.04), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.03), rgba(200, 100, 255, 0.02), transparent)',
            }}
          />
        ))}
      </>
    );
  };

  // ✨ Renderizar partículas cósmicas
  const renderParticles = () => {
    if (!showParticles) return null;
    
    return particles.map((particle) => (
      <Box
        key={particle.id}
        className="cosmic-particle"
        sx={{
          left: `${particle.x}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          '--particle-duration': `${particle.duration}s`,
          animationDelay: `${particle.delay}s`,
          background: `radial-gradient(circle, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(0, 188, 212, 0.6) 50%, 
            transparent 100%
          )`,
          boxShadow: `0 0 ${particle.size * 2}px rgba(0, 188, 212, 0.4)`,
        }}
      />
    ));
  };

  // ⭐ Renderizar constelaciones
  const renderConstelations = () => {
    if (!showConstelations) return null;
    
    return stars.map((star) => (
      <Box
        key={star.id}
        className="constellation-star"
        sx={{
          position: 'absolute',
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          background: `radial-gradient(circle, 
            rgba(255, 255, 255, ${star.brightness}) 0%, 
            rgba(255, 255, 255, ${star.brightness * 0.5}) 50%, 
            transparent 100%
          )`,
          borderRadius: '50%',
          '--twinkle-duration': `${star.twinkleDuration}s`,
          '--twinkle-delay': `${star.delay}s`,
          boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, ${star.brightness * 0.3})`,
        }}
      />
    ));
  };

  // 🌀 Renderizar nebulosas de fondo
  const renderNebulae = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(255, 20, 147, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 20%, rgba(0, 191, 255, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 80%, rgba(50, 205, 50, 0.05) 0%, transparent 50%)
        `,
        animation: 'cosmic-background-rotation 120s linear infinite',
        opacity: intensity === 'low' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );

  // 🔮 Renderizar campos magnéticos
  const renderMagneticFields = () => (
    <>
      {[...Array(intensity === 'low' ? 2 : intensity === 'medium' ? 3 : 5)].map((_, index) => (
        <Box
          key={`magnetic-${index}`}
          className="magnetic-field"
          sx={{
            top: '50%',
            left: '50%',
            width: `${150 + index * 100}px`,
            height: `${150 + index * 100}px`,
            transform: 'translate(-50%, -50%)',
            '--magnetic-duration': `${6 + index * 2}s`,
            animationDelay: `${index * 1.5}s`,
            borderColor: `rgba(0, 188, 212, ${0.1 - index * 0.015})`,
            borderWidth: `${2 - index * 0.2}px`,
          }}
        />
      ))}
    </>
  );

  return (
    <Box
      ref={containerRef}
      className={`universe-background ${className}`}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        // 🌌 Fondo base cósmico
        background: `
          radial-gradient(ellipse at center, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.98) 50%, 
            rgba(0, 0, 0, 1) 100%
          )
        `,
      }}
    >
      {/* 🌀 Nebulosas de fondo */}
      {renderNebulae()}
      
      {/* 🌈 Aurora boreal */}
      {renderAurora()}
      
      {/* ⭐ Constelaciones */}
      {renderConstelations()}
      
      {/* ✨ Partículas cósmicas */}
      {renderParticles()}
      
      {/* 🔮 Campos magnéticos */}
      {renderMagneticFields()}
      
      {/* 💫 Overlay de luz dinámica */}
      <Box className="dynamic-light-overlay" />
    </Box>
  );
};

export default UniverseBackground; 