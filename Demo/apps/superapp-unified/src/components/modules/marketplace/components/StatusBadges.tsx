import React from 'react';
import { Box, Chip } from '@mui/material';
import { WorkspacePremium, TrendingUp, FlashOn, Schedule, PlayArrow } from '@mui/icons-material';
import { Typography } from '@mui/material';

export interface StatusBadgesProps {
  featured: boolean;
  trending: boolean;
  discount?: number;
  is24Hours: boolean;
  isUrgent: boolean;
  hasVideo: boolean;
  size: 'small' | 'medium' | 'large';
}

const StatusBadges: React.FC<StatusBadgesProps> = ({
  featured,
  trending,
  discount,
  is24Hours,
  isUrgent,
  hasVideo,
  size,
}) => {
  const badgeSize = size === 'small' ? 'small' : 'medium';

  return (
    <>
      {/* Badges superiores izquierdos */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          zIndex: 2,
        }}
      >
        {featured && (
          <Chip
            icon={<WorkspacePremium />}
            label="Destacado"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
        {trending && (
          <Chip
            icon={<TrendingUp />}
            label="Tendencia"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
        {isUrgent && (
          <Chip
            icon={<FlashOn />}
            label="Urgente"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FF4444, #FF6666)',
              color: 'white',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
      </Box>

      {/* Badges superiores derechos */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 48, // Espacio para el botón de favorito
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          alignItems: 'flex-end',
          zIndex: 2,
        }}
      >
        {discount && (
          <Chip
            label={`-${discount}%`}
            size={badgeSize}
            sx={{
              backgroundColor: '#FF4444',
              color: 'white',
              fontWeight: 'bold',
              fontSize: size === 'small' ? '10px' : '12px',
            }}
          />
        )}
        {is24Hours && (
          <Chip
            icon={<Schedule />}
            label="24h"
            size={badgeSize}
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
      </Box>

      {/* Badge de video */}
      {hasVideo && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40, // Arriba del rating
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 2,
          }}
        >
          <PlayArrow sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="caption" color="white" fontWeight="bold">
            Video
          </Typography>
        </Box>
      )}
    </>
  );
};

export default StatusBadges;
