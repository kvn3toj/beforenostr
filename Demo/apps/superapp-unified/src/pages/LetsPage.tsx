import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Tabs,
  Tab,
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
  TrendingUp,
  Group,
  LocalOffer,
  School,
  EmojiNature,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLetsEducation } from '../contexts/LetsEducationContext';
import UnitsWallet from '../components/modules/marketplace/components/UnitsWallet';
import { LetsListings } from '../components/modules/marketplace/components/LetsListings';
import LetsDashboard from '../components/modules/marketplace/components/LetsDashboard';
import LetsOnboardingWizard from '../components/modules/lets/LetsOnboardingWizard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lets-tabpanel-${index}`}
      aria-labelledby={`lets-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const LetsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { user } = useAuth();
  const { state } = useLetsEducation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estado del onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState(!state.hasCompletedOnboarding);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Mock stats - en producción vendrían del backend
  const letsStats = {
    totalTransactions: 1247,
    activeUsers: 89,
    totalUnitsCirculating: 3456,
    ayniIndex: 0.87,
  };

  return (
    <>
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

              <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid size={{xs:12,md:8}}>
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
                  
                  <Stack direction="row" spacing={2} flexWrap="wrap">
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
                </Grid>

                <Grid size={{xs:12,md:4}}>
                  <Grid container spacing={2}>
                    <Grid size={{xs:6}}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                          {letsStats.totalTransactions}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Intercambios Realizados
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                          {letsStats.activeUsers}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Usuarios Activos
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                          {letsStats.totalUnitsCirculating}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Ünits en Circulación
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                          {(letsStats.ayniIndex * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Índice Ayni
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Fade>

        {/* Wallet Section - Always visible */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{xs:12,md:6}}>
                <UnitsWallet userId={user?.id || ''} />
              </Grid>
              <Grid size={{xs:12,md:6}}>
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
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Tabs Navigation */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isMobile ? 'fullWidth' : 'standard'}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 60,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                },
              }}
            >
              <Tab
                label="🏪 Marketplace LETS"
                icon={<LocalOffer />}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab
                label="📊 Dashboard"
                icon={<TrendingUp />}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab
                label="🎓 Intercambio de Conocimiento"
                icon={<School />}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            </Tabs>
          </Box>
        </Fade>

        {/* Tab Panels */}
        <TabPanel value={currentTab} index={0}>
          <LetsListings />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <LetsDashboard userId={user?.id} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Hub de Intercambio de Conocimiento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comparte y aprende habilidades dentro de las Comunidades de Práctica usando el sistema LETS.
            </Typography>
            <Button variant="outlined" disabled>
              Próximamente en Fase 3
            </Button>
          </Card>
        </TabPanel>
      </Container>
    </>
  );
};

export default LetsPage; 