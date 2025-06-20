import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';
import { BuilderIOHelpers, ENV } from '../../lib/environment';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 🏗️ Builder.io Status Component
 * 
 * Muestra información útil cuando la app está ejecutándose en Builder.io
 * Solo visible en modo desarrollo y Builder.io
 */
export const BuilderIOStatus: React.FC = () => {
  const { user, isBuilderIOMode } = useAuth();

  // Solo mostrar en Builder.io y desarrollo
  if (!isBuilderIOMode || ENV.isProduction) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        p: 2,
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        border: '1px solid rgba(25, 118, 210, 0.3)',
        borderRadius: 2,
        zIndex: 9999,
        minWidth: 280,
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Chip
          label="Builder.io Mode"
          color="primary"
          size="small"
          variant="outlined"
        />
        <Chip
          label="Admin Auto-Login"
          color="success"
          size="small"
          variant="filled"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" mb={1}>
        🏗️ <strong>Builder.io Development Mode</strong>
      </Typography>

      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="caption" color="text.secondary">
          <strong>Usuario:</strong> {user?.full_name || 'Administrator'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>Rol:</strong> {user?.role}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>Puerto:</strong> {window.location.port}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>API:</strong> {ENV.apiBaseUrl}
        </Typography>
      </Box>

      <Typography variant="caption" color="primary" mt={1} display="block">
        ✅ Autenticación deshabilitada - Admin siempre activo
      </Typography>
    </Paper>
  );
};

export default BuilderIOStatus; 