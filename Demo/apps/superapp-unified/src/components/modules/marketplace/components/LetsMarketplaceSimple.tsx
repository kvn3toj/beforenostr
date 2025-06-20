import React from 'react';
import { Container, Typography, Box } from '@mui/material';

/**
 * Versión simplificada del LetsMarketplace para diagnosticar problemas de importación
 */
const LetsMarketplaceSimple: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          LETS Marketplace
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sistema de Intercambio Local basado en Ünits
        </Typography>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1">
          ✅ El componente LetsMarketplace se está cargando correctamente.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Esta es una versión simplificada para diagnosticar problemas de importación.
        </Typography>
      </Box>
    </Container>
  );
};

export default LetsMarketplaceSimple; 