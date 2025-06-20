import React from 'react';
import Box from '@mui/material/Box';

const UniversalCosmicBackground: React.FC = () => {
  return (
    <Box
      className="universal-cosmic-background"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10, // Muy atrás para no interferir
        pointerEvents: 'none',
        overflow: 'hidden',
        // 🌌 FONDO CÓSMICO UNIVERSAL MÁS INTENSO
        background: `
          linear-gradient(45deg,
            rgba(255, 107, 53, 0.08) 0%,
            rgba(102, 187, 106, 0.12) 25%,
            rgba(0, 188, 212, 0.06) 50%,
            rgba(255, 213, 79, 0.08) 75%,
            rgba(255, 107, 53, 0.08) 100%
          ),
          radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.06) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(102, 187, 106, 0.08) 0%, transparent 70%),
          radial-gradient(circle at 50% 80%, rgba(0, 188, 212, 0.05) 0%, transparent 65%),
          radial-gradient(circle at 10% 90%, rgba(255, 213, 79, 0.06) 0%, transparent 55%),
          radial-gradient(circle at 90% 10%, rgba(255, 107, 53, 0.05) 0%, transparent 60%),
          radial-gradient(circle at 60% 20%, rgba(102, 187, 106, 0.06) 0%, transparent 70%)
        `,
        // 🔄 ROTACIÓN LENTA EN SENTIDO CONTRARIO A LAS MANECILLAS DEL RELOJ
        animation: 'universal-cosmic-rotation 240s linear infinite reverse',
        transformOrigin: 'center center',
      }}
    >
      {/* 🌟 CAMPO ESTELAR UNIVERSAL */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={`universal-star-${i}`}
          sx={{
            position: 'absolute',
            width: Math.random() * 2 + 0.5 + 'px',
            height: Math.random() * 2 + 0.5 + 'px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `universal-twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255, 255, 255, 0.6)`,
          }}
        />
      ))}

      {/* ✨ NEBULOSAS UNIVERSALES */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`universal-nebula-${i}`}
          sx={{
            position: 'absolute',
            width: Math.random() * 300 + 200 + 'px',
            height: Math.random() * 300 + 200 + 'px',
            background: `radial-gradient(circle,
              ${['rgba(255, 107, 53, 0.02)', 'rgba(102, 187, 106, 0.025)', 'rgba(0, 188, 212, 0.015)', 'rgba(255, 213, 79, 0.02)'][i % 4]} 0%,
              transparent 70%
            )`,
            borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `universal-nebula-drift ${Math.random() * 40 + 60}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 20}s`,
            transform: `scale(${Math.random() * 0.5 + 0.8})`,
          }}
        />
      ))}

      {/* 🌊 ONDAS CÓSMICAS SUTILES */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vmax',
          height: '200vmax',
          transform: 'translate(-50%, -50%)',
          background: `
            conic-gradient(from 0deg,
              transparent 0deg,
              rgba(255, 107, 53, 0.008) 90deg,
              transparent 180deg,
              rgba(102, 187, 106, 0.008) 270deg,
              transparent 360deg
            )
          `,
          animation: 'universal-cosmic-waves 240s linear infinite',
          borderRadius: '50%',
        }}
      />
    </Box>
  );
};

export default UniversalCosmicBackground;
