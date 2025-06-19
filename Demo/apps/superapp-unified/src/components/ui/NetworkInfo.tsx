import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';
import { WifiIcon, ComputerIcon } from '@mui/icons-material';
import { useNetworkDetection } from '../../hooks/useNetworkDetection';

/**
 * 🌐 Componente de Información de Red
 * Muestra el estado actual de conexión y URLs disponibles
 */
export const NetworkInfo: React.FC = () => {
  const { isNetworkAccess, currentHost, apiBaseUrl, displayUrl } = useNetworkDetection();

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        minWidth: 280,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {isNetworkAccess ? (
          <WifiIcon color="success" fontSize="small" />
        ) : (
          <ComputerIcon color="primary" fontSize="small" />
        )}
        <Typography variant="subtitle2" fontWeight="bold">
          {isNetworkAccess ? '🌐 Acceso de Red' : '🏠 Localhost'}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Frontend:
          </Typography>
          <Chip
            label={displayUrl}
            size="small"
            color={isNetworkAccess ? "success" : "primary"}
            sx={{ ml: 1 }}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Backend:
          </Typography>
          <Chip
            label={apiBaseUrl.replace('http://', '')}
            size="small"
            color={isNetworkAccess ? "success" : "primary"}
            sx={{ ml: 1 }}
          />
        </Box>

        {isNetworkAccess && (
          <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
            ✅ Otros dispositivos pueden acceder en la red local
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default NetworkInfo;
