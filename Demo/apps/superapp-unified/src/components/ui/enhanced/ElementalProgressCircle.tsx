import React from 'react';
import { cn } from '../../../utils/styles';
import { ElementType, elementConfig, getElementAnimation } from '../../../hooks/home';

interface ElementalProgressCircleProps {
  element: ElementType;
  value: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export const ElementalProgressCircle: React.FC<ElementalProgressCircleProps> = ({
  element,
  value,
  size = 'md',
  animated = true,
  showTooltip = true,
  className,
}) => {
  const config = elementConfig[element];
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizeMap = {
    sm: 48,
    md: 64,
    lg: 80,
  };

  const svgSize = sizeMap[size];

  return (
    <div className={cn('relative group', className)}>
      <svg
        className={cn(
          'transform rotate-[-90deg] transition-transform duration-300',
          'group-hover:scale-110',
          animated && getElementAnimation(element)
        )}
        width={svgSize}
        height={svgSize}
        viewBox="0 0 80 80"
      >
        {/* Círculo de fondo */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={`${config.color}20`}
          strokeWidth="6"
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Círculo de progreso */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={config.color}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.1))',
          }}
        />
        
        {/* Glow effect */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={config.color}
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="opacity-50 transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${config.color}40)`,
          }}
        />
      </svg>

      {/* Ícono central */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'text-2xl transition-transform duration-300',
          'group-hover:scale-110',
          size === 'sm' && 'text-lg',
          size === 'lg' && 'text-3xl'
        )}
        style={{ color: config.color }}
      >
        {config.icon}
      </div>

      {/* Valor numérico */}
      <div
        className={cn(
          'absolute bottom-0 right-0 transform translate-x-1 translate-y-1',
          'bg-white rounded-full border-2 border-gray-100',
          'text-xs font-bold px-1.5 py-0.5 min-w-[24px] text-center',
          'shadow-sm transition-all duration-300',
          'group-hover:scale-110',
          size === 'sm' && 'text-[10px] px-1 py-0.5 min-w-[20px]',
          size === 'lg' && 'text-sm px-2 py-1 min-w-[28px]'
        )}
        style={{ color: config.color }}
      >
        {Math.round(value)}
      </div>

      {/* Tooltip con información */}
      {showTooltip && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            'bg-gray-900 text-white text-xs px-3 py-2 rounded-lg',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'whitespace-nowrap z-10 pointer-events-none',
            'shadow-lg border border-gray-700'
          )}
        >
          <div className="font-semibold">{config.name}: {Math.round(value)}%</div>
          <div className="text-gray-300 text-[10px] mt-1">{config.description}</div>
          <div className="text-gray-400 text-[10px] italic mt-1">{config.philosophy}</div>
          
          {/* Flecha del tooltip */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1f2937',
            }}
          />
        </div>
      )}
    </div>
  );
}; 