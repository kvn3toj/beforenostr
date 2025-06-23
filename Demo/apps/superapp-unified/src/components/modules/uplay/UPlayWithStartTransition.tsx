import React, { useState, useTransition, useCallback, useMemo, Suspense } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  Skeleton,
  Grid,
  useTheme,
  alpha,
  Tooltip,
  Collapse,
  Tabs,
  Tab,
} from '@mui/material';

// Icons
import {
  PlayArrow,
  Pause,
  School,
  VideoLibrary,
  TrendingUp,
  Speed,
  HighQuality,
  CheckCircle,
  Star,
  Lightbulb,
  Timer,
  ChevronLeft,
  ChevronRight,
  Refresh,
} from '@mui/icons-material';

// Cosmic Design System
import { UniversalComponent } from '../../universal/UniversalComponent';

// Components optimizados
import { OptimizedUPlayWizard } from './components/OptimizedUPlayWizard';
import { OptimizedVideoTransitions } from './components/OptimizedVideoTransitions';

// ===== 🎯 TIPOS Y INTERFACES ===== //
interface UPlayTransitionState {
  isTabChanging: boolean;
  isContentLoading: boolean;
  isVideoChanging: boolean;
  isWizardTransitioning: boolean;
  currentAction: string | null;
}

interface UPlayEnhancedProps {
  initialTab?: number;
  enableTransitionOptimizations?: boolean;
  showPerformanceMetrics?: boolean;
  cosmicEffects?: boolean;
  onVideoComplete?: (videoId: string) => void;
  onWizardComplete?: () => void;
}

// ===== 🎮 SIMULACIÓN DE DATOS ===== //
const mockPerformanceMetrics = {
  transitionsCount: 0,
  averageTransitionTime: 0,
  totalLoadTime: 0,
  userEngagement: 95,
  smoothnessScore: 98,
};

// ===== 🧠 COMPONENTE PRINCIPAL ===== //
export const UPlayWithStartTransition: React.FC<UPlayEnhancedProps> = ({
  initialTab = 0,
  enableTransitionOptimizations = true,
  showPerformanceMetrics = true,
  cosmicEffects = true,
  onVideoComplete,
  onWizardComplete,
}) => {
  const theme = useTheme();

  // 🔄 ESTADO DEL COMPONENTE
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [selectedVideoId, setSelectedVideoId] = useState('uplay-demo-video');
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);

  // 🚀 REACT 18 STARTTRANSITION PARA UX OPTIMIZADA
  const [isPending, startTransition] = useTransition();
  const [transitionState, setTransitionState] = useState<UPlayTransitionState>({
    isTabChanging: false,
    isContentLoading: false,
    isVideoChanging: false,
    isWizardTransitioning: false,
    currentAction: null,
  });

  // 🎯 FUNCIONES DE NAVEGACIÓN OPTIMIZADAS
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    if (!enableTransitionOptimizations) {
      setCurrentTab(newValue);
      return;
    }

    // Mostrar indicador inmediatamente
    setTransitionState(prev => ({
      ...prev,
      isTabChanging: true,
      currentAction: `Cargando ${getTabName(newValue)}...`
    }));

    // Incrementar contador de transiciones
    setPerformanceMetrics(prev => ({
      ...prev,
      transitionsCount: prev.transitionsCount + 1,
    }));

    const startTime = performance.now();

    startTransition(() => {
      setCurrentTab(newValue);

      // Simular tiempo de carga del contenido
      setTimeout(() => {
        const endTime = performance.now();
        const transitionTime = endTime - startTime;

        // Actualizar métricas de rendimiento
        setPerformanceMetrics(prev => ({
          ...prev,
          averageTransitionTime: (prev.averageTransitionTime + transitionTime) / 2,
          totalLoadTime: prev.totalLoadTime + transitionTime,
        }));

        setTransitionState(prev => ({
          ...prev,
          isTabChanging: false,
          currentAction: null
        }));
      }, 300);
    });
  }, [enableTransitionOptimizations]);

  const handleVideoChange = useCallback((videoId: string) => {
    if (!enableTransitionOptimizations) {
      setSelectedVideoId(videoId);
      return;
    }

    setTransitionState(prev => ({
      ...prev,
      isVideoChanging: true,
      currentAction: `Cambiando a video ${videoId}...`
    }));

    startTransition(() => {
      setSelectedVideoId(videoId);

      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isVideoChanging: false,
          currentAction: null
        }));
      }, 800);
    });
  }, [enableTransitionOptimizations]);

  const refreshContent = useCallback(() => {
    setTransitionState(prev => ({
      ...prev,
      isContentLoading: true,
      currentAction: 'Actualizando contenido...'
    }));

    startTransition(() => {
      // Simular actualización de contenido
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isContentLoading: false,
          currentAction: null
        }));

        // Resetear métricas
        setPerformanceMetrics(mockPerformanceMetrics);
      }, 1200);
    });
  }, []);

  // 🎯 FUNCIONES AUXILIARES
  const getTabName = useCallback((tabIndex: number) => {
    const tabNames = ['Wizard Interactivo', 'Reproductor Optimizado', 'Métricas de Rendimiento'];
    return tabNames[tabIndex] || 'Contenido';
  }, []);

  // 📊 MÉTRICAS DE RENDIMIENTO COMPUTADAS
  const performanceScore = useMemo(() => {
    const baseScore = 100;
    const transitionPenalty = Math.max(0, (performanceMetrics.averageTransitionTime - 300) / 10);
    return Math.max(70, baseScore - transitionPenalty);
  }, [performanceMetrics.averageTransitionTime]);

  // 🎨 COMPONENTE DE INDICADOR DE TRANSICIÓN GLOBAL
  const GlobalTransitionIndicator = () => (
    <>
      {/* Barra de progreso global */}
      {(isPending || Object.values(transitionState).some(Boolean)) && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            height: 3,
            '& .MuiLinearProgress-bar': {
              background: cosmicEffects
                ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            },
          }}
        />
      )}

      {/* Indicador de acción actual */}
      {transitionState.currentAction && (
        <Fade in={true} timeout={200}>
          <Alert
            severity="info"
            sx={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 1500,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
            icon={<CircularProgress size={20} />}
          >
            <Typography variant="body2">
              {transitionState.currentAction}
            </Typography>
          </Alert>
        </Fade>
      )}
    </>
  );

  // 📊 PANEL DE MÉTRICAS DE RENDIMIENTO
  const PerformanceMetricsPanel = () => (
    showPerformanceMetrics && (
      <UniversalComponent
        element="agua"
        variant="surface"
        sx={{ mb: 3, position: 'relative' }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              🚀 Métricas de Rendimiento StartTransition
            </Typography>
            <Tooltip title="Actualizar métricas">
              <IconButton
                size="small"
                onClick={refreshContent}
                disabled={transitionState.isContentLoading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {performanceMetrics.transitionsCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Transiciones
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} md={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {Math.round(performanceMetrics.averageTransitionTime)}ms
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiempo Promedio
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} md={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {performanceMetrics.userEngagement}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Engagement
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} md={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: performanceScore >= 90 ? 'success.main' :
                           performanceScore >= 75 ? 'warning.main' : 'error.main'
                  }}
                  fontWeight="bold"
                >
                  {Math.round(performanceScore)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score UX
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fluidez de Transiciones
            </Typography>
            <LinearProgress
              variant="determinate"
              value={performanceMetrics.smoothnessScore}
              sx={{
                height: 6,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                  transition: 'transform 0.5s ease',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {performanceMetrics.smoothnessScore}% de suavidad percibida
            </Typography>
          </Box>
        </Box>
      </UniversalComponent>
    )
  );

  // 🎮 CONTROLES DE DEMOSTRACIÓN
  const DemoControls = () => (
    <UniversalComponent
      element="fuego"
      variant="card"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎛️ Controles de Demostración
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={() => handleVideoChange('demo-video-advanced')}
            disabled={transitionState.isVideoChanging}
          >
            Cambiar Video
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<Speed />}
            onClick={() => {
              // Simular múltiples transiciones rápidas
              for (let i = 0; i < 3; i++) {
                setTimeout(() => handleTabChange({} as any, (currentTab + 1) % 3), i * 500);
              }
            }}
            disabled={transitionState.isTabChanging}
          >
            Test Múltiples Transiciones
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshContent}
            disabled={transitionState.isContentLoading}
          >
            Refresh Contenido
          </Button>

          <Chip
            icon={enableTransitionOptimizations ? <CheckCircle /> : <Pause />}
            label={enableTransitionOptimizations ? "Optimizaciones ON" : "Optimizaciones OFF"}
            color={enableTransitionOptimizations ? "success" : "default"}
            size="small"
          />
        </Box>
      </Box>
    </UniversalComponent>
  );

  // 🎨 RENDERIZADO DE CONTENIDO POR TAB
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Fade in={!transitionState.isTabChanging} timeout={400}>
            <Box>
              <OptimizedUPlayWizard
                initialStep={0}
                onStepComplete={(stepId) => {
                  console.log(`✅ Paso completado: ${stepId}`);
                  setPerformanceMetrics(prev => ({
                    ...prev,
                    userEngagement: Math.min(100, prev.userEngagement + 2),
                  }));
                }}
                onWizardComplete={() => {
                  console.log('🎉 Wizard completado!');
                  onWizardComplete?.();
                }}
                showProgressIndicator={true}
                enablePreloading={true}
                cosmicEffects={cosmicEffects}
              />
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={!transitionState.isTabChanging} timeout={400}>
            <Box>
              <OptimizedVideoTransitions
                videoId={selectedVideoId}
                onVideoComplete={(videoId) => {
                  console.log(`🎬 Video completado: ${videoId}`);
                  onVideoComplete?.(videoId);
                  setPerformanceMetrics(prev => ({
                    ...prev,
                    userEngagement: Math.min(100, prev.userEngagement + 5),
                  }));
                }}
                showTransitionIndicators={true}
                enableSmartPreloading={true}
                cosmicEffects={cosmicEffects}
              />
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={!transitionState.isTabChanging} timeout={400}>
            <Box>
              <UniversalComponent element="tierra" variant="card">
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    📊 Análisis de Rendimiento Detallado
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Beneficios de startTransition
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ✅ UI responsiva durante cargas pesadas
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ✅ Transiciones fluidas entre estados
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ✅ Mejor experiencia de usuario percibida
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ✅ Prevención de bloqueos de interfaz
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Implementación en ÜPlay
                      </Typography>
                      <Box>
                        <Chip
                          icon={<School />}
                          label="Navegación de Wizard"
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                        <Chip
                          icon={<VideoLibrary />}
                          label="Carga de Videos"
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                        <Chip
                          icon={<TrendingUp />}
                          label="Cambios de Calidad"
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                        <Chip
                          icon={<Timer />}
                          label="Navegación Temporal"
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </UniversalComponent>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  // 🎨 RENDERIZADO PRINCIPAL
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Indicador de transición global */}
      <GlobalTransitionIndicator />

      {/* Header */}
      <UniversalComponent
        element="aire"
        variant="surface"
        sx={{ mb: 3, position: 'relative' }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚀 ÜPlay con StartTransition Optimizado
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Demostración de React 18 startTransition para mejorar la UX en el wizard de ÜPlay.
            Observa cómo las transiciones se mantienen fluidas incluso durante operaciones pesadas.
          </Typography>
        </Box>
      </UniversalComponent>

      {/* Métricas de rendimiento */}
      <PerformanceMetricsPanel />

      {/* Controles de demostración */}
      <DemoControls />

      {/* Navegación por tabs */}
      <UniversalComponent
        element="agua"
        variant="surface"
        sx={{ mb: 3 }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              opacity: transitionState.isTabChanging ? 0.7 : 1,
            },
            '& .Mui-selected': {
              transform: transitionState.isTabChanging ? 'scale(0.95)' : 'scale(1)',
            }
          }}
        >
          <Tab
            icon={<School />}
            label="Wizard Interactivo"
            iconPosition="start"
          />
          <Tab
            icon={<VideoLibrary />}
            label="Reproductor Optimizado"
            iconPosition="start"
          />
          <Tab
            icon={<TrendingUp />}
            label="Métricas"
            iconPosition="start"
          />
        </Tabs>
      </UniversalComponent>

      {/* Contenido del tab actual */}
      <Suspense
        fallback={
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando contenido optimizado...
            </Typography>
          </Box>
        }
      >
        {renderTabContent()}
      </Suspense>
    </Box>
  );
};

export default UPlayWithStartTransition;
