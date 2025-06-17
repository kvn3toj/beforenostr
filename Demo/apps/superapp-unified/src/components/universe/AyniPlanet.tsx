import React from 'react';
import '../../styles/solar-system-svg.css';

interface AyniPlanetProps {
  size?: number;
  color?: string;
  haloColor?: string;
  pulse?: boolean;
  children?: React.ReactNode;
}

const AyniPlanet: React.FC<AyniPlanetProps> = ({
  size = 90,
  color = '#FFD700',
  haloColor = 'rgba(255, 215, 0, 0.45)',
  pulse = true,
  children,
}) => {
  return (
    <div
      className={`ayni-planet-wrapper`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
        zIndex: 2,
      }}
    >
      {/* Halo animado */}
      <div
        className={`ayni-planet-halo${pulse ? ' ayni-planet-halo-pulse' : ''}`}
        style={{
          width: size * 2.1,
          height: size * 2.1,
          background: `radial-gradient(circle, ${haloColor} 0%, transparent 80%)`,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      {/* Esfera central */}
      <div
        className="ayni-planet-core"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 60% 30%, #fff 0%, ${color} 70%, #bfa600 100%)`,
          borderRadius: '50%',
          boxShadow: `0 0 32px 8px ${haloColor}, 0 8px 32px #0008`,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Reflejo dinámico */}
        <div
          className="dynamic-light-overlay"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.04) 60%, transparent 100%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            animation: 'dynamic-light-sweep 3.5s linear infinite',
          }}
        />
        {children}
      </div>
      {/* Sombra */}
      <div
        className="ayni-planet-shadow"
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(100% - 10px)',
          width: size * 0.7,
          height: size * 0.22,
          background: 'radial-gradient(ellipse at center, #0006 0%, transparent 80%)',
          transform: 'translate(-50%, 0) scaleY(0.7)',
          filter: 'blur(2.5px)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AyniPlanet; 