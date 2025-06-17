import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccountBalance,
  SwapHoriz,
  Group,
  EmojiNature,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLetsEducation } from '../contexts/LetsEducationContext';
import LetsOnboardingWizard from '../components/modules/marketplace/components/lets-humanized/onboarding/LetsOnboardingWizard';

const LetsPageSimple: React.FC = () => {
  const { user } = useAuth();
  const { state } = useLetsEducation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estado del onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState(!state.hasCompletedOnboarding);

  // Mock stats - en producción vendrían del backend
  const letsStats = {
    totalTransactions: 1247,
    activeUsers: 89,
    totalUnitsCirculating: 3456,
    ayniIndex: 0.87,
  };

  return (
    <>
      {/* Wizard de Onboarding LETS */}
      <LetsOnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
        data-testid="lets-onboarding-wizard"
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Hero Section */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative background elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(40px)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  filter: 'blur(30px)',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  🔄 Sistema LETS CoomÜnity
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  Local Exchange Trading System - Economía Colaborativa basada en Ayni
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                  Intercambia productos, servicios y conocimientos usando Ünits, nuestra moneda local 
                  que promueve la reciprocidad y el bien común en la comunidad.
                </Typography>
                
                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                  <Chip
                    label="💰 Sin Intereses"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    label="🤝 Basado en Confianza"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    label="⚖️ Principio Ayni"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    label="🌱 Economía Circular"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {/* Principios LETS */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🎯 Principios del Sistema LETS
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBalance sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Crédito Mutuo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sin necesidad de dinero tradicional
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <SwapHoriz sx={{ color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Intercambio Directo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Productos, servicios y conocimientos
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Group sx={{ color: 'success.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Comunidad Local
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fortalece la economía local
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmojiNature sx={{ color: 'info.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Sustentabilidad
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reduce el impacto ambiental
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Card>
          </Box>
        </Fade>

        {/* Estado del Onboarding - Debug */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔍 Estado del Sistema LETS
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
          <Typography variant="body2">
            Paso actual: {state.currentStep}
          </Typography>
        </Card>
      </Container>
    </>
  );
};

export default LetsPageSimple; 