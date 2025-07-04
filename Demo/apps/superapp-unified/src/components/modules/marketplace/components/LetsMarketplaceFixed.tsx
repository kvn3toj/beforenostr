/**
 * 🏪 LETS Marketplace - Versión Corregida
 *
 * Marketplace basado en Ünits donde los usuarios pueden intercambiar
 * productos y servicios usando el sistema LETS (Local Exchange Trading System)
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  WalletIcon,
} from '@mui/icons-material';

// Importaciones básicas que sabemos que funcionan
import { useAuth } from '../../../../contexts/AuthContext';
import { useLetsEducation } from '../../../../contexts/LetsEducationContext';

// Importación del onboarding wizard
import LetsOnboardingWizard from './lets-humanized/onboarding/LetsOnboardingWizard';

const LetsMarketplaceFixed: React.FC = () => {
  const { user } = useAuth();
  const { state } = useLetsEducation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!state.hasCompletedOnboarding);

  // Componente para mostrar el wallet del usuario
  const WalletSummary = () => (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ color: 'white' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              💰 Mi Wallet LETS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              0 Ünits
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Límite de crédito: 100 Ünits
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

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

        {/* Wallet Summary */}
        <WalletSummary />

        {/* Contenido principal */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ¡Bienvenido al LETS Marketplace!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Aquí puedes intercambiar productos y servicios usando Ünits.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{ mt: 2 }}
            >
              Crear Listing
            </Button>

            {showCreateDialog && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  Funcionalidad de crear listing en desarrollo...
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowCreateDialog(false)}
                  sx={{ mt: 1 }}
                >
                  Cerrar
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Debug info */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estado del Onboarding
            </Typography>
            <Typography variant="body2">
              Usuario: {user?.email || 'No autenticado'}
            </Typography>
            <Typography variant="body2">
              Onboarding completado: {state.hasCompletedOnboarding ? 'Sí' : 'No'}
            </Typography>
            <Typography variant="body2">
              Mostrar wizard: {showOnboarding ? 'Sí' : 'No'}
            </Typography>
            <Typography variant="body2">
              Nivel de usuario: {state.userLevel}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default LetsMarketplaceFixed;
