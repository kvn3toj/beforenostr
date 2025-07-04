import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Fade,
} from '@mui/material';
import {
  Home as HomeIcon,
  Timeline as TimelineIcon,
  TrendingUp as ProgressIcon,
  EmojiEvents as AchievementsIcon,
  Lightbulb as TipsIcon,
  ArrowBack,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomerJourneyVisualization from '../components/modules/stages/CustomerJourneyVisualization';
import { OnboardingChecklist } from '../components/onboarding/OnboardingChecklist';
import { ProgressiveTooltips, getStageTooltips } from '../components/onboarding/ProgressiveTooltips';

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
      id={`customer-journey-tabpanel-${index}`}
      aria-labelledby={`customer-journey-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerJourney: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showTooltips, setShowTooltips] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  // Mock user stage - TODO: Obtener del backend
  const currentUserStage = 'BUYER';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStageSelect = (stage: string) => {
    console.log(`Stage seleccionado: ${stage}`);
    // Aquí podrías mostrar más detalles del stage o navegar a una vista específica
  };

  const handleChecklistItemComplete = (itemId: string, rewards: any) => {
    setCompletedItems(prev => [...prev, itemId]);
    console.log(`✅ Completado: ${itemId}`, rewards);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Dashboard
        </Link>
        <Typography color="text.primary" variant="body2">
          Customer Journey
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            🌟 Tu Viaje de Transformación
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}
          >
            Explora tu progreso a través de los stages del customer journey en CoomÜnity
            y descubre las próximas oportunidades de crecimiento
          </Typography>

          {/* Acciones Rápidas */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<TipsIcon />}
              onClick={() => setShowTooltips(true)}
              sx={{ borderRadius: 3 }}
            >
              Activar Guía
            </Button>
            <Button
              variant="outlined"
              startIcon={<AchievementsIcon />}
              onClick={() => setShowChecklist(true)}
              sx={{ borderRadius: 3 }}
            >
              Ver Checklist
            </Button>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 3 }}
            >
              Regresar
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="customer journey tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  minHeight: 64
                }
              }}
            >
              <Tab
                icon={<TimelineIcon />}
                label="Vista General del Journey"
                iconPosition="start"
              />
              <Tab
                icon={<ProgressIcon />}
                label="Progreso Detallado"
                iconPosition="start"
              />
              <Tab
                icon={<AchievementsIcon />}
                label="Logros y Recompensas"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab 1: Vista General del Journey */}
          <TabPanel value={activeTab} index={0}>
            <Fade in={activeTab === 0}>
              <Box>
                <CustomerJourneyVisualization
                  compact={false}
                  showDetails={true}
                  onStageSelect={handleStageSelect}
                />
              </Box>
            </Fade>
          </TabPanel>

          {/* Tab 2: Progreso Detallado */}
          <TabPanel value={activeTab} index={1}>
            <Fade in={activeTab === 1}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  📊 Análisis Detallado de Progreso
                </Typography>

                <Grid container spacing={3}>
                  {/* Métricas de Progreso */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🎯 Métricas de Stage Actual
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Stage: <strong>Buyer</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Progreso: <strong>65%</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tiempo en stage: <strong>5 días</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Próximo stage: <strong>Seeker</strong>
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Actividades Completadas:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            ✅ Explorar marketplace
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ✅ Completar perfil
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            🔄 Realizar primera compra
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ⏳ Calificar transacciones
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Próximos Pasos */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🚀 Próximos Pasos Recomendados
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Para avanzar a <strong>Seeker</strong>, necesitas:
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              • Completar 2 transacciones más (1/3)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Alcanzar 100 Méritos (75/100)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Acumular 200 Öndas (180/200)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Permanecer 7 días en Buyer (5/7)
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Acciones Sugeridas:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" color="primary.main">
                            🛍️ Explorar productos locales
                          </Typography>
                          <Typography variant="body2" color="primary.main">
                            🎥 Participar en ÜPlay para ganar Öndas
                          </Typography>
                          <Typography variant="body2" color="primary.main">
                            🤝 Conectar con la comunidad
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Gráfico de Progreso Histórico */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📈 Progreso Histórico
                        </Typography>
                        <Box
                          sx={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                            border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
                          }}
                        >
                          <Typography color="text.secondary">
                            📊 Gráfico de progreso histórico (próximamente)
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </TabPanel>

          {/* Tab 3: Logros y Recompensas */}
          <TabPanel value={activeTab} index={2}>
            <Fade in={activeTab === 2}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  🏆 Logros y Recompensas
                </Typography>

                <Grid container spacing={3}>
                  {/* Logros Recientes */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🌟 Logros Recientes
                        </Typography>
                        <Box sx={{ space: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>✅</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                ¡Primer Paso!
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Completaste tu perfil de CoomÜnity
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                +50 Öndas, +25 Méritos
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>🔍</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Explorador Curioso
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Exploraste el marketplace por primera vez
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                +30 Öndas
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>🎥</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Primer Video ÜPlay
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Completaste tu primer video interactivo
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                +40 Öndas, +10 Méritos
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Próximos Logros */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🎯 Próximos Logros Disponibles
                        </Typography>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}` }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>🛍️</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Primera Compra
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Realiza tu primera transacción
                              </Typography>
                              <Typography variant="caption" color="primary.main">
                                Recompensa: +100 Öndas, +50 Méritos
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.secondary.main, 0.3)}` }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>🤝</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Conexión Social
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Conecta con 3 miembros de la comunidad
                              </Typography>
                              <Typography variant="caption" color="secondary.main">
                                Recompensa: +75 Öndas, +25 Méritos
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: alpha(theme.palette.warning.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}` }}>
                            <Box sx={{ mr: 2, fontSize: 24 }}>⭐</Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Avance a Seeker
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Progresa al siguiente stage
                              </Typography>
                              <Typography variant="caption" color="warning.main">
                                Recompensa: +200 Öndas, +100 Méritos, Insignia Especial
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Estadísticas de Recompensas */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📊 Estadísticas de Recompensas
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="primary.main" fontWeight="bold">
                                180
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Öndas Totales
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                                75
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Méritos Totales
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="warning.main" fontWeight="bold">
                                3
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Logros Desbloqueados
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="success.main" fontWeight="bold">
                                5
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Días en Buyer
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </TabPanel>
        </Card>
      </motion.div>

      {/* Modales y Overlays */}
      <OnboardingChecklist
        isVisible={showChecklist}
        onClose={() => setShowChecklist(false)}
        userStage={currentUserStage}
        completedItems={completedItems}
        onItemComplete={handleChecklistItemComplete}
      />

      <ProgressiveTooltips
        isActive={showTooltips}
        steps={getStageTooltips(currentUserStage)}
        onComplete={() => setShowTooltips(false)}
        onSkip={() => setShowTooltips(false)}
        userStage={currentUserStage}
      />

      {/* Add test targets for tooltips */}
      <Box sx={{ display: 'none' }}>
        <div data-testid="dashboard-header">Dashboard Header</div>
        <div data-testid="uplay-nav-link">ÜPlay Link</div>
        <div data-testid="marketplace-nav-link">Marketplace Link</div>
        <div data-testid="social-nav-link">Social Link</div>
        <div data-testid="create-listing-button">Create Listing</div>
      </Box>
    </Container>
  );
};

export default CustomerJourney;
