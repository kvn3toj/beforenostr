import React from 'react';

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  cx: Math.random() * 100,
  cy: Math.random() * 100,
  r: Math.random() * 0.5 + 0.3,
  opacity: Math.random() * 0.5 + 0.5,
}));

const planets = [
  { cx: 15, cy: 80, r: 3, color: '#7ecfff', glow: '#b3e5fc' },
  { cx: 80, cy: 20, r: 2.2, color: '#b388ff', glow: '#e1bee7' },
  { cx: 60, cy: 60, r: 1.5, color: '#ffd54f', glow: '#fff9c4' },
];

const emeralds = [
  { points: '5,95 7,92 9,95 7,98', color: '#00e676', glow: '#b9f6ca' },
  { points: '90,10 92,7 94,10 92,13', color: '#00e676', glow: '#b9f6ca' },
];

const CosmicBackground: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      zIndex: 0,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 60% 20%, #2e1a47 60%, #0d133d 100%)',
      transition: 'background 1s',
    }}
  >
    <svg
      width="100vw"
      height="100vh"
      viewBox="0 0 100 100"
      style={{ position: 'absolute', width: '100vw', height: '100vh', left: 0, top: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stars */}
      {stars.map((star) => (
        <circle
          key={star.id}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#fff"
          opacity={star.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${star.opacity};${star.opacity * 0.5};${star.opacity}`}
            dur={`${1.5 + Math.random()}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* Planets */}
      {planets.map((planet, i) => (
        <g key={i}>
          <circle
            cx={planet.cx}
            cy={planet.cy}
            r={planet.r}
            fill={planet.color}
            filter={`url(#glow${i})`}
            opacity="0.8"
          />
          <filter id={`glow${i}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </g>
      ))}
      {/* Emeralds */}
      {emeralds.map((em, i) => (
        <polygon
          key={i}
          points={em.points}
          fill={em.color}
          opacity="0.8"
          stroke={em.glow}
          strokeWidth="0.3"
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </polygon>
      ))}
      {/* Constellation lines */}
      <polyline points="10,10 20,20 30,10 40,25 50,15" stroke="#fff" strokeWidth="0.15" opacity="0.5" fill="none" />
      <polyline points="60,80 65,70 70,80 75,75 80,85" stroke="#fff" strokeWidth="0.12" opacity="0.4" fill="none" />
      {/* Tree silhouette */}
      <path d="M 50 100 Q 52 90 50 80 Q 48 90 50 100" stroke="#4caf50" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M 50 80 Q 51 75 49 70 Q 50 75 50 80" stroke="#388e3c" strokeWidth="0.3" fill="none" opacity="0.4" />
      {/* Roots */}
      <path d="M 50 100 Q 48 105 46 110" stroke="#795548" strokeWidth="0.2" fill="none" opacity="0.3" />
      <path d="M 50 100 Q 52 105 54 110" stroke="#795548" strokeWidth="0.2" fill="none" opacity="0.3" />
      {/* Cave silhouette */}
      <ellipse cx="20" cy="98" rx="3" ry="1.2" fill="#222" opacity="0.4" />
      <ellipse cx="80" cy="98" rx="2.5" ry="1" fill="#222" opacity="0.3" />
    </svg>
  </div>
);

export default CosmicBackground;
