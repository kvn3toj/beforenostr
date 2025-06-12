import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Circle as CircleIcon } from '@mui/icons-material';

interface RealTimeStatusProps {
  activeUsers: number;
  searchesPerMinute: number;
  conversionRate: number;
  serverLoad: number;
}

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({
  activeUsers,
  searchesPerMinute,
  conversionRate,
  serverLoad,
}) => {
  const theme = useTheme();

  const getServerStatus = () => {
    if (serverLoad < 60)
      return { status: 'Óptimo', color: theme.palette.success.main };
    if (serverLoad < 80)
      return { status: 'Moderado', color: theme.palette.warning.main };
    return { status: 'Alto', color: theme.palette.error.main };
  };

  const serverStatus = getServerStatus();

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: alpha(theme.palette.grey[50], 0.8),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
          Estado en Tiempo Real
        </Typography>
        <Box display="flex" alignItems="center">
          <CircleIcon
            sx={{
              fontSize: 8,
              color: theme.palette.success.main,
              mr: 0.5,
              animation: 'pulse 2s infinite',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Activo
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Box textAlign="center" sx={{ minWidth: 80 }}>
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight={600}
            sx={{ fontSize: '1.25rem' }}
          >
            {activeUsers.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Usuarios
          </Typography>
        </Box>

        <Box textAlign="center" sx={{ minWidth: 80 }}>
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight={600}
            sx={{ fontSize: '1.25rem' }}
          >
            {searchesPerMinute}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Búsquedas/min
          </Typography>
        </Box>

        <Box textAlign="center" sx={{ minWidth: 80 }}>
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight={600}
            sx={{ fontSize: '1.25rem' }}
          >
            {conversionRate.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Conversión
          </Typography>
        </Box>

        <Box textAlign="center" sx={{ minWidth: 80 }}>
          <Chip
            label={`${serverLoad}% ${serverStatus.status}`}
            size="small"
            sx={{
              backgroundColor: alpha(serverStatus.color, 0.1),
              color: serverStatus.color,
              fontWeight: 600,
              fontSize: '0.75rem',
              border: `1px solid ${alpha(serverStatus.color, 0.2)}`,
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default RealTimeStatus;
