import React from 'react';
import { Container, Box } from '@mui/material';
import { CosmicBrainQuickTest } from '../../components/admin/CosmicBrainQuickTest';

/**
 * 🧪 COSMIC BRAIN QUICK TEST PAGE
 *
 * Página de prueba rápida para verificar la integración
 * del AI Cosmic Brain Dashboard con el backend NestJS.
 */

const CosmicBrainQuickTestPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <CosmicBrainQuickTest />
      </Box>
    </Container>
  );
};

export default CosmicBrainQuickTestPage;
