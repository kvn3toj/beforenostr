import React from 'react';
import '../../styles/solar-system-svg.css';

interface ElementalSphereProps {
  type: 'fuego' | 'agua' | 'tierra' | 'aire';
  size?: number;
  color?: string;
  texture?: 'waves' | 'cracks' | 'flames' | 'mist';
  trailColor?: string;
  isSelected?: boolean;
  onHover?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const textureSVG: Record<string, JSX.Element> = {
  waves: (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{position:'absolute',left:0,top:0}}>
      <path d="M0 20 Q10 10 20 20 T40 20" stroke="#fff5" strokeWidth="2" fill="none" />
      <path d="M0 30 Q10 20 20 30 T40 30" stroke="#fff3" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  cracks: (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{position:'absolute',left:0,top:0}}>
      <path d="M20 0 L20 40 M10 10 L30 30 M30 10 L10 30" stroke="#fff4" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  flames: (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{position:'absolute',left:0,top:0}}>
      <path d="M20 40 Q25 25 20 10 Q15 25 20 40" stroke="#fff7" strokeWidth="2" fill="none" />
    </svg>
  ),
  mist: (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{position:'absolute',left:0,top:0}}>
      <ellipse cx="20" cy="20" rx="16" ry="6" fill="#fff2" />
      <ellipse cx="20" cy="28" rx="12" ry="4" fill="#fff3" />
    </svg>
  ),
};

const ElementalSphere: React.FC<ElementalSphereProps> = ({
  type,
  size = 48,
  color = '#fff',
  texture = 'waves',
  trailColor = 'rgba(255,255,255,0.18)',
  isSelected = false,
  onHover,
  onClick,
  style = {},
}) => {
  // Validate and sanitize size to prevent NaN values
  const validSize = Number.isFinite(size) && size > 0 ? size : 48;

  return (
    <div
      className={`elemental-sphere ${isSelected ? 'selected' : ''}`}
      style={{
        width: validSize,
        height: validSize,
        background: `radial-gradient(circle at 60% 30%, #fff 0%, ${color} 70%, #222 100%)`,
        borderRadius: '50%',
        boxShadow: `0 0 16px 4px ${color}55, 0 2px 12px #0008`,
        position: 'absolute',
        zIndex: 2,
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {/* Glow */}
      <div
        className="elemental-sphere-glow"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: validSize * 1.5,
          height: validSize * 1.5,
          background: `radial-gradient(circle, ${color}33 0%, transparent 80%)`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {/* Textura SVG */}
      <div style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:3}}>
        {textureSVG[texture]}
      </div>
      {/* Highlight */}
      <div
        className="elemental-sphere-highlight"
        style={{
          position: 'absolute',
          left: '20%',
          top: '18%',
          width: validSize * 0.32,
          height: validSize * 0.18,
          background: 'linear-gradient(120deg, #fff8 0%, #fff2 100%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          opacity: 0.7,
          zIndex: 4,
        }}
      />
      {/* Trail orbital (simulado como sombra) */}
      <div
        className="elemental-sphere-trail"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: validSize * 2.2,
          height: validSize * 0.22,
          background: `radial-gradient(ellipse at center, ${trailColor} 0%, transparent 80%)`,
          transform: 'translate(-50%, 0) scaleY(0.7)',
          filter: 'blur(2.5px)',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default ElementalSphere;
