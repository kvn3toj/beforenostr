import React from 'react';
import { Alert, AlertTitle, Chip, Box } from '@mui/material';
import { Science } from '@mui/icons-material';

/**
 * Banner para indicar que la aplicación está ejecutándose en modo Mock de Autenticación
 * Solo se muestra cuando VITE_ENABLE_MOCK_AUTH=true
 */
export const DevMockBanner: React.FC = () => {
  // Solo mostrar si el mock está habilitado
  if ((import.meta as any).env.VITE_ENABLE_MOCK_AUTH !== 'true') {
    return null;
  }

  return (
    <Alert 
      severity="info" 
      variant="filled"
      data-testid="dev-mock-banner"
      sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        borderRadius: 0,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <Science fontSize="small" />
        <AlertTitle sx={{ mb: 0, fontSize: '0.875rem', fontWeight: 600 }}>
          MODO DESARROLLO ACTIVO
        </AlertTitle>
        <Chip 
          label="Usuario Mock Autenticado" 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            fontSize: '0.75rem'
          }} 
        />
      </Box>
    </Alert>
  );
};

export default DevMockBanner; 