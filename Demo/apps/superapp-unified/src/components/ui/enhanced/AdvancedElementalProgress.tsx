import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { Terrain, Air, Whatshot, Opacity } from '@mui/icons-material';

interface AdvancedElementalProgressProps {
  element: 'tierra' | 'agua' | 'fuego' | 'aire';
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const elementConfig = {
  tierra: {
    color: '#8B4513',
    lightColor: '#D2B48C',
    icon: Terrain,
    name: 'Tierra',
    description: 'Estabilidad y fundamentos sólidos'
  },
  agua: {
    color: '#4682B4',
    lightColor: '#87CEEB',
    icon: Opacity,
    name: 'Agua',
    description: 'Fluidez y adaptabilidad'
  },
  fuego: {
    color: '#FF6347',
    lightColor: '#FFA07A',
    icon: Whatshot,
    name: 'Fuego',
    description: 'Energía y transformación'
  },
  aire: {
    color: '#87CEEB',
    lightColor: '#E0F6FF',
    icon: Air,
    name: 'Aire',
    description: 'Claridad mental y comunicación'
  }
};

const sizeConfig = {
  sm: { size: 60, strokeWidth: 4, iconSize: 20 },
  md: { size: 80, strokeWidth: 6, iconSize: 24 },
  lg: { size: 100, strokeWidth: 8, iconSize: 28 }
};

export const AdvancedElementalProgress: React.FC<AdvancedElementalProgressProps> = ({
  element,
  progress,
  size = 'md',
  showLabel = true,
  showTooltip = true,
  animated = true,
  glowEffect = true,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const config = elementConfig[element];
  const sizeConf = sizeConfig[size];
  const IconComponent = config.icon;

  // Animate progress on mount
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const radius = (sizeConf.size - sizeConf.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const progressComponent = (
    <Box
      className={`
        elemental-progress-enhanced 
        ${glowEffect ? '' : ''}
        ${animated ? 'smooth-transition' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      {/* SVG Progress Circle */}
      <Box
        sx={{
          position: 'relative',
          width: sizeConf.size,
          height: sizeConf.size,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}
      >
        <svg
          width={sizeConf.size}
          height={sizeConf.size}
          style={{
            transform: 'rotate(-90deg)',
            filter: isHovered && glowEffect ? `drop-shadow(0 0 8px ${config.color}40)` : 'none'
          }}
        >
          {/* Background Circle */}
          <circle
            cx={sizeConf.size / 2}
            cy={sizeConf.size / 2}
            r={radius}
            stroke={`${config.color}20`}
            strokeWidth={sizeConf.strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <circle
            cx={sizeConf.size / 2}
            cy={sizeConf.size / 2}
            r={radius}
            stroke={config.color}
            strokeWidth={sizeConf.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: animated ? 'stroke-dashoffset 1s ease-in-out' : 'none',
              filter: `drop-shadow(0 0 4px ${config.color}60)`
            }}
          />
          
          {/* Glow Effect Circle */}
          {glowEffect && isHovered && (
            <circle
              cx={sizeConf.size / 2}
              cy={sizeConf.size / 2}
              r={radius + 2}
              stroke={config.lightColor}
              strokeWidth={2}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              opacity={0.6}
              className=""
            />
          )}
        </svg>

        {/* Center Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: sizeConf.iconSize + 8,
            height: sizeConf.iconSize + 8,
            borderRadius: '50%',
            backgroundColor: `${config.color}15`,
            backdropFilter: 'blur(4px)'
          }}
        >
          <IconComponent
            sx={{
              fontSize: sizeConf.iconSize,
              color: config.color,
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
          />
        </Box>

        {/* Progress Percentage */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            backgroundColor: config.color,
            color: 'white',
            borderRadius: '12px',
            px: 1,
            py: 0.25,
            fontSize: '0.7rem',
            fontWeight: 600,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            boxShadow: `0 2px 8px ${config.color}40`
          }}
        >
          {Math.round(animatedProgress)}%
        </Box>
      </Box>

      {/* Label */}
      {showLabel && (
        <Typography
          variant="caption"
          className="coomunity-caption"
          sx={{
            color: config.color,
            fontWeight: 600,
            fontSize: '0.75rem',
            textAlign: 'center',
            opacity: isHovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease'
          }}
        >
          {config.name}
        </Typography>
      )}
    </Box>
  );

  if (showTooltip) {
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {config.name}: {Math.round(progress)}%
            </Typography>
            <Typography variant="caption">
              {config.description}
            </Typography>
          </Box>
        }
        arrow
        placement="top"
      >
        {progressComponent}
      </Tooltip>
    );
  }

  return progressComponent;
};

export default AdvancedElementalProgress; 