import React from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ConsciousProgressOrbProps {
  currentLevel: string;
  nextLevel: string;
  progress: number; // 0-100
  meritos: number;
}

/**
 * 🧿 CONSCIOUS PROGRESS ORB - MINIMALIST
 * ======================================
 *
 * Orbe simplificado que muestra el progreso consciente del usuario:
 * - Nivel actual de consciencia
 * - Progreso hacia el siguiente nivel
 * - Méritos acumulados
 *
 * Filosofía: "El progreso verdadero no se mide en velocidad
 * sino en la profundidad de la transformación consciente"
 */
const ConsciousProgressOrb: React.FC<ConsciousProgressOrbProps> = ({
  currentLevel,
  nextLevel,
  progress,
  meritos
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 🎯 PROGRESO CIRCULAR */}
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={50}
          thickness={4}
          sx={{
            color: theme.palette.divider,
            position: 'absolute',
          }}
        />
        <CircularProgress
          variant="determinate"
          value={progress}
          size={50}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </Box>

      {/* 📊 INFORMACIÓN DEL NIVEL */}
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          fontSize: '0.75rem',
          textAlign: 'center',
          mb: 0.5
        }}
      >
        {currentLevel}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '0.65rem',
          textAlign: 'center'
        }}
      >
        → {nextLevel}
      </Typography>

      {/* 💎 MÉRITOS */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 6,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          px: 0.5,
          py: 0.25,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.6rem'
          }}
        >
          {meritos} méritos
        </Typography>
      </Box>
    </Paper>
  );
};

export default ConsciousProgressOrb;
