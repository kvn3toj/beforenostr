import React from 'react';

interface ElementalConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  affinity?: number;
  show?: boolean;
}

const ElementalConnection: React.FC<ElementalConnectionProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = '#fff',
  affinity = 1,
  show = true,
}) => {
  if (!show) return null;
  // Curva de Bezier para arco
  const cx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
  const cy = (y1 + y2) / 2 + (x1 - x2) * 0.18;
  const path = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  return (
    <svg style={{position:'absolute',left:0,top:0,pointerEvents:'none',zIndex:1,width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0.7 + 0.3 * affinity} />
          <stop offset="100%" stopColor={color} stopOpacity={0.2 + 0.2 * affinity} />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke="url(#connection-gradient)"
        strokeWidth={2.5 + 2 * affinity}
        fill="none"
        strokeDasharray="12 8"
        strokeDashoffset={0}
        style={{
          filter: `drop-shadow(0 0 8px ${color}88)`,
          animation: 'connection-dash 1.2s linear infinite',
        }}
      />
      <style>{`
        @keyframes connection-dash {
          to { stroke-dashoffset: 40; }
        }
      `}</style>
    </svg>
  );
};

export default ElementalConnection; 