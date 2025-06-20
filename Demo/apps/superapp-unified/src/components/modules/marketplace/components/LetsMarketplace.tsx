/**
 * 🏪 LETS Marketplace - Sistema de Intercambio Local
 * 
 * Submódulo específico del Marketplace para intercambios locales
 * usando Ünits como moneda de intercambio (LETS - Local Exchange Trading System)
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import {
  Info as InfoIcon
} from '@mui/icons-material';

import { useLetsEducation } from '../../../../contexts/LetsEducationContext';
import LetsOnboardingWizard from './lets-humanized/onboarding/LetsOnboardingWizard';

const LetsMarketplace: React.FC = () => {
  const { state } = useLetsEducation();
  const [showOnboarding, setShowOnboarding] = useState(!state.hasCompletedOnboarding);

  return (
    <>
      {/* Wizard de Onboarding LETS */}
      <LetsOnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            LETS Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema de Intercambio Local basado en Ünits - Economía Colaborativa CoomÜnity
          </Typography>
        </Box>

        {/* Información sobre LETS */}
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ mb: 4 }}
        >
          <Typography variant="body2">
            <strong>LETS (Local Exchange Trading System)</strong> es un sistema de intercambio local 
            que utiliza <strong>Ünits</strong> como moneda complementaria. Aquí puedes intercambiar 
            servicios y productos con otros miembros de tu comunidad local.
          </Typography>
        </Alert>

        {/* Contenido principal */}
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              🚧 LETS Marketplace en Desarrollo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              El sistema de intercambio local LETS estará disponible próximamente.
              Mientras tanto, puedes explorar el Marketplace principal para intercambios con Lükas.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => window.location.href = '/marketplace'}
            >
              Ir al Marketplace Principal
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default LetsMarketplace; 