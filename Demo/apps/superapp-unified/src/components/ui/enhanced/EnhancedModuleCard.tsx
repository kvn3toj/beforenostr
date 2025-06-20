import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { PlayArrow, Star, TrendingUp, Group } from '@mui/icons-material';

interface EnhancedModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  stats?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const EnhancedModuleCard: React.FC<EnhancedModuleCardProps> = ({
  title,
  description,
  icon,
  color,
  stats = [],
  isActive = false,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`
        module-card-enhanced 
        home-card-hover 
        gradient-overlay-hover 
        smooth-transition
        ${isActive ? '' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      sx={{
        position: 'relative',
        background: color,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--home-card-border-radius)',
        overflow: 'hidden',
        '&:hover': {
          '& .module-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .module-stats': {
            transform: 'translateY(-2px)',
          }
        }
      }}
    >
      {/* Floating Action Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2
        }}
      >
        <IconButton
                        className="interactive-scale enhanced-focus"
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <PlayArrow sx={{ color: 'white', fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Active Status Indicator */}
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2
          }}
        >
          <Chip
            label="ACTIVO"
            size="small"
                          className=""
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          />
        </Box>
      )}

      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Icon and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            className="module-icon smooth-transition"
            sx={{
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            className="coomunity-h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 3,
            lineHeight: 1.5,
            flex: 1
          }}
        >
          {description}
        </Typography>

        {/* Stats */}
        {stats.length > 0 && (
          <Box
            className="module-stats smooth-transition"
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                className="interactive-scale"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.5,
                  backdropFilter: 'blur(4px)'
                }}
              >
                {stat.icon && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stat.icon}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem'
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Hover Effect Line */}
        <Box
          className="metrics-relationship-line"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleCard; 