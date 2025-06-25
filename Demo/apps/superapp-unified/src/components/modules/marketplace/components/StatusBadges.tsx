import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { WorkspacePremium, TrendingUp, FlashOn, Schedule, PlayArrow, Handshake, Star, VerifiedUser, Nature } from '@mui/icons-material';
import { Typography } from '@mui/material';

export interface StatusBadgesProps {
  featured: boolean;
  trending: boolean;
  discount?: number;
  is24Hours: boolean;
  isUrgent: boolean;
  hasVideo: boolean;
  size: 'small' | 'medium' | 'large';
  ayniScore?: number;
  meritos?: number;
  isSustainable?: boolean;
  isEmprendedorConfiable?: boolean;
}

const StatusBadges: React.FC<StatusBadgesProps> = ({
  featured,
  trending,
  discount,
  is24Hours,
  isUrgent,
  hasVideo,
  size,
  ayniScore,
  meritos,
  isSustainable,
  isEmprendedorConfiable,
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
        {typeof ayniScore === 'number' && ayniScore >= 80 && (
          <Tooltip title="Ayni+: Este producto promueve la reciprocidad y el Bien Común. Cada intercambio suma Öndas positivas.">
            <Chip
              icon={<Handshake />}
              label="Ayni+"
              size={badgeSize}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #81C784)',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Tooltip>
        )}
        {typeof meritos === 'number' && meritos >= 10 && (
          <Tooltip title="Mëritos+: El vendedor ha contribuido al Bien Común y ha ganado Mëritos por su servicio.">
            <Chip
              icon={<Star />}
              label="Mëritos+"
              size={badgeSize}
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FFB300)',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Tooltip>
        )}
        {isSustainable && (
          <Tooltip title="Sostenible: Este producto o servicio minimiza su huella ecológica y promueve la regeneración.">
            <Chip
              icon={<Nature />}
              label="Sostenible"
              size={badgeSize}
              sx={{
                background: 'linear-gradient(45deg, #388E3C, #A5D6A7)',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Tooltip>
        )}
        {isEmprendedorConfiable && (
          <Tooltip title="Emprendedor Confiable: Vendedor verificado por la comunidad, reconocido por su ética y confianza.">
            <Chip
              icon={<VerifiedUser />}
              label="Emprendedor Confiable"
              size={badgeSize}
              sx={{
                background: 'linear-gradient(45deg, #1976D2, #64B5F6)',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Tooltip>
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
