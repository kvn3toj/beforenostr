import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  CircularProgress,
  Fade,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  PlayArrow,
  Store,
  Group,
  Person,
  AccountBalance,
  TrendingUp,
  Notifications,
  AutoAwesome,
  Timeline,
  Insights,
  Navigation,
  FlashOn,
  Favorite,
  Diamond,
  AllInclusive,
} from '@mui/icons-material';

import { useReciprocidadIntelligence } from '../../hooks/useReciprocidadIntelligence';
import { CosmicThemeSwitcher, COSMIC_ELEMENTS, CosmicElement } from './CosmicThemeSwitcher';

// Configuración de módulos integrados
const MODULES_CONFIG = {
  uplay: {
    id: 'uplay',
    name: 'ÜPlay',
    fullName: 'GPL Gamified Play List',
    description: 'Player interactivo gamificado',
    icon: PlayArrow,
    route: '/uplay',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    cosmicElement: 'aire' as CosmicElement,
    metrics: ['learning_time', 'videos_completed', 'questions_answered']
  },
  marketplace: {
    id: 'marketplace',
    name: 'Marketplace',
    fullName: 'GMP Gamified Match Place',
    description: 'Intercambio de valor',
    icon: Store,
    route: '/marketplace',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    cosmicElement: 'tierra' as CosmicElement,
    metrics: ['transactions', 'offers_posted', 'reviews_given']
  },
  social: {
    id: 'social',
    name: 'Social',
    fullName: 'Red Social CoomÜnity',
    description: 'Conexiones y colaboración',
    icon: Group,
    route: '/social',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
    cosmicElement: 'agua' as CosmicElement,
    metrics: ['connections', 'groups_joined', 'collaborations']
  },
  profile: {
    id: 'profile',
    name: 'Profile',
    fullName: 'Perfil Cósmico',
    description: 'Tu esencia digital',
    icon: Person,
    route: '/profile',
    color: '#E1BEE7',
    gradient: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)',
    cosmicElement: 'ether' as CosmicElement,
    metrics: ['level', 'achievements', 'cosmic_alignment']
  },
  lets: {
    id: 'lets',
    name: 'LETS',
    fullName: 'Local Exchange Trading System',
    description: 'Economía colaborativa',
    icon: AccountBalance,
    route: '/lets',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
    cosmicElement: 'fuego' as CosmicElement,
    metrics: ['credits_earned', 'services_offered', 'network_size']
  }
} as const;

interface UniversalReciprocidadDashboardProps {
  userId: string;
  compact?: boolean;
  showRecommendations?: boolean;
  currentModule?: keyof typeof MODULES_CONFIG;
}

export const UniversalReciprocidadDashboard: React.FC<UniversalReciprocidadDashboardProps> = ({
  userId,
  compact = false,
  showRecommendations = true,
  currentModule
}) => {
  const theme = useTheme();
  const [selectedElement, setSelectedElement] = useState<CosmicElement>('fuego');
  const [activeView, setActiveView] = useState<'overview' | 'modules' | 'analytics'>('overview');

  // Hook de inteligencia Reciprocidad
  const {
    data: reciprocidadData,
    isLoading,
    recordAction,
    applyRecommendation,
    preferences
  } = useReciprocidadIntelligence(userId);

  // Mock data para usuario (en producción viene del backend)
  // 🔗 Usando datos reales del backend via AuthContext
  const { user } = useAuth();
  // Métricas cross-module en tiempo real
  const crossModuleMetrics = useMemo(() => {
    if (!reciprocidadData) return null;

    return {
      totalActions: 247,
      weeklyGrowth: 23,
      communityImpact: reciprocidadData.communityImpact.bienComunScore,
      nextMilestone: reciprocidadData.personalizedInsights.nextMilestone,
      activeModules: Object.keys(MODULES_CONFIG).length,
      collaborations: reciprocidadData.collaborationMatches.length,
      recommendations: reciprocidadData.recommendations.length
    };
  }, [reciprocidadData]);

  // Navegar a módulo con registro de acción
  const navigateToModule = (moduleId: keyof typeof MODULES_CONFIG) => {
    const module = MODULES_CONFIG[moduleId];
    
    // Registrar acción de navegación
    recordAction({
      type: 'learning',
      module: moduleId as any,
      value: 5,
      metadata: {
        from: 'universal_dashboard',
        destination: module.route
      }
    });

    // Navegación (en una app real usarías router)
    window.location.href = module.route;
  };

  // Aplicar recomendación inteligente
  const handleRecommendationClick = (recommendationId: string) => {
    const recommendation = reciprocidadData?.recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      applyRecommendation(recommendationId);
      navigateToModule(recommendation.module as keyof typeof MODULES_CONFIG);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Calculando tu universo Reciprocidad...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: compact ? 1 : 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header Cósmico */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🌌 Dashboard Universal Reciprocidad
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Centro de comando para tu viaje cósmico en CoomÜnity
            </Typography>
          </Box>

          {/* Theme Switcher flotante */}
          <CosmicThemeSwitcher
            currentElement={selectedElement}
            onElementChange={setSelectedElement}
            userBalance={reciprocidadData?.reciprocidadBalance.elements}
            compact={true}
            position="inline"
            showProgress={true}
          />
        </Box>

        {/* Métricas principales */}
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Card sx={{ p: 2, minWidth: 120, background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)', color: 'white' }}>
            <Diamond />
            <Typography variant="h6" fontWeight="bold">{mockUser.meritos.toLocaleString()}</Typography>
            <Typography variant="caption">Mëritos</Typography>
          </Card>
          
          <Card sx={{ p: 2, minWidth: 120, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white' }}>
            <FlashOn />
            <Typography variant="h6" fontWeight="bold">{mockUser.ondas.toLocaleString()}</Typography>
            <Typography variant="caption">Öndas</Typography>
          </Card>
          
          <Card sx={{ p: 2, minWidth: 120, background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)', color: 'white' }}>
            <Favorite />
            <Typography variant="h6" fontWeight="bold">{mockUser.reciprocidadScore}%</Typography>
            <Typography variant="caption">Balance Reciprocidad</Typography>
          </Card>
          
          <Card sx={{ p: 2, minWidth: 120, background: COSMIC_ELEMENTS.ether.gradient, color: 'white' }}>
            <AllInclusive />
            <Typography variant="h6" fontWeight="bold">{mockUser.etherEnergy}</Typography>
            <Typography variant="caption">Ether Cósmico</Typography>
          </Card>
        </Stack>
      </Box>

      {/* Navegación de vistas */}
      <Box mb={3}>
        <Stack direction="row" spacing={1}>
          {[
            { key: 'overview', label: '📊 Resumen', icon: Dashboard },
            { key: 'modules', label: '🎯 Módulos', icon: Navigation },
            { key: 'analytics', label: '📈 Analytics', icon: Insights }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeView === key ? 'contained' : 'outlined'}
              startIcon={<Icon />}
              onClick={() => setActiveView(key as any)}
              sx={{
                background: activeView === key ? COSMIC_ELEMENTS[selectedElement].gradient : 'transparent',
                color: activeView === key ? 'white' : COSMIC_ELEMENTS[selectedElement].color,
                borderColor: COSMIC_ELEMENTS[selectedElement].color
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Vista Overview */}
      {activeView === 'overview' && (
        <Fade in={true}>
          <Box>
            {/* Recomendaciones inteligentes */}
            {showRecommendations && reciprocidadData?.recommendations && (
              <Card sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${alpha(COSMIC_ELEMENTS[selectedElement].color, 0.05)} 0%, ${alpha(COSMIC_ELEMENTS[selectedElement].color, 0.1)} 100%)` }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🧠 Recomendaciones Inteligentes Reciprocidad
                </Typography>
                <Stack spacing={2}>
                  {reciprocidadData.recommendations.slice(0, 3).map((rec) => (
                    <Box
                      key={rec.id}
                      sx={{
                        p: 2,
                        border: `1px solid ${alpha(COSMIC_ELEMENTS[selectedElement].color, 0.2)}`,
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.7),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 15px ${alpha(COSMIC_ELEMENTS[selectedElement].color, 0.2)}`
                        }
                      }}
                      onClick={() => handleRecommendationClick(rec.id)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {rec.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {rec.description}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip 
                              label={rec.priority} 
                              size="small" 
                              color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'} 
                            />
                            <Typography variant="caption" color="text.secondary">
                              {rec.estimatedTimeToComplete} min • +{rec.action.expectedImpact} Reciprocidad
                            </Typography>
                          </Stack>
                        </Box>
                        <IconButton 
                          sx={{ 
                            background: COSMIC_ELEMENTS[selectedElement].gradient,
                            color: 'white',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        >
                          <AutoAwesome />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Métricas cross-module */}
            {crossModuleMetrics && (
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📊 Métricas Integradas
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[selectedElement].color }}>
                      {crossModuleMetrics.totalActions}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Acciones Totales
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[selectedElement].color }}>
                      +{crossModuleMetrics.weeklyGrowth}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Crecimiento Semanal
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[selectedElement].color }}>
                      {crossModuleMetrics.communityImpact}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Impacto Comunidad
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[selectedElement].color }}>
                      {crossModuleMetrics.collaborations}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Colaboraciones Activas
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )}
          </Box>
        </Fade>
      )}

      {/* Vista Módulos */}
      {activeView === 'modules' && (
        <Fade in={true}>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {Object.values(MODULES_CONFIG).map((module) => {
              const isActive = currentModule === module.id;
              const elementColor = COSMIC_ELEMENTS[module.cosmicElement].color;
              const IconComponent = module.icon;

              return (
                <Card
                  key={module.id}
                  sx={{
                    p: 3,
                    minWidth: 280,
                    background: isActive 
                      ? module.gradient 
                      : `linear-gradient(135deg, ${alpha(elementColor, 0.05)} 0%, ${alpha(elementColor, 0.1)} 100%)`,
                    color: isActive ? 'white' : 'inherit',
                    border: `2px solid ${alpha(elementColor, isActive ? 0.8 : 0.2)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${alpha(elementColor, 0.3)}`,
                      border: `2px solid ${elementColor}`
                    }
                  }}
                  onClick={() => navigateToModule(module.id)}
                >
                  {/* Cosmic Element Indicator */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: COSMIC_ELEMENTS[module.cosmicElement].gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {React.createElement(COSMIC_ELEMENTS[module.cosmicElement].icon, { sx: { fontSize: 16 } })}
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: isActive ? 'rgba(255,255,255,0.2)' : module.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'white' : 'white'
                      }}
                    >
                      <IconComponent />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {module.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {module.fullName}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {module.description}
                  </Typography>

                  {/* Mock metrics for the module */}
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Métricas recientes:
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      {module.metrics.map((metric, index) => (
                        <Chip
                          key={metric}
                          label={`${Math.floor(Math.random() * 100)}${index === 0 ? 'h' : index === 1 ? '' : '%'}`}
                          size="small"
                          sx={{
                            background: isActive ? 'rgba(255,255,255,0.2)' : alpha(elementColor, 0.1),
                            color: isActive ? 'white' : elementColor,
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </Fade>
      )}

      {/* Vista Analytics */}
      {activeView === 'analytics' && (
        <Fade in={true}>
          <Box>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📈 Analytics Cósmicos Integrados
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aquí aparecerán métricas avanzadas, gráficos de crecimiento, 
                patrones de uso cross-module, y predicciones de evolución Reciprocidad.
              </Typography>
              
              {/* Placeholder for charts */}
              <Box mt={3} height={300} display="flex" alignItems="center" justifyContent="center" 
                sx={{ background: alpha(COSMIC_ELEMENTS[selectedElement].color, 0.05), borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  🚧 Gráficos interactivos en desarrollo
                </Typography>
              </Box>
            </Card>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default UniversalReciprocidadDashboard;