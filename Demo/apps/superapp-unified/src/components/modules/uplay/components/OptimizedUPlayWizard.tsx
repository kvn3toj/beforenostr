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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';

// Icons
import {
  PlayArrow,
  SkipNext,
  CheckCircle,
  Star,
  Lightbulb,
  Quiz,
  TrendingUp,
  Speed,
  ChevronLeft,
  ChevronRight,
  Pause,
  FastForward,
} from '@mui/icons-material';

// Cosmic Design System
import { UniversalComponent } from '../../../universal/UniversalComponent';

// ===== 🎯 TIPOS Y INTERFACES ===== //
interface WizardStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  videoId?: string;
  questionsCount?: number;
  estimatedDuration: number; // en minutos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rewards: {
    meritos: number;
    ondas: number;
  };
  prerequisites?: string[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface TransitionState {
  isStepChanging: boolean;
  isVideoLoading: boolean;
  isContentPreloading: boolean;
  currentlyLoading: string | null;
}

interface OptimizedUPlayWizardProps {
  initialStep?: number;
  onStepComplete?: (stepId: string) => void;
  onWizardComplete?: () => void;
  showProgressIndicator?: boolean;
  enablePreloading?: boolean;
  cosmicEffects?: boolean;
}

// ===== 🎬 MOCK DATA PARA DEMOSTRACIÓN ===== //
const mockWizardSteps: WizardStep[] = [
  {
    id: 'intro',
    title: 'Bienvenida a ÜPlay',
    description: 'Descubre el poder del aprendizaje gamificado',
    content: (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          🌟 ¡Bienvenido al GPL!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Gamified Play List: Tu nueva experiencia de aprendizaje interactivo
        </Typography>
        <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
          <Grid item xs={4}>
            <Chip icon={<Star />} label="Mëritos" color="primary" />
          </Grid>
          <Grid item xs={4}>
            <Chip icon={<Lightbulb />} label="Öndas" color="secondary" />
          </Grid>
          <Grid item xs={4}>
            <Chip icon={<TrendingUp />} label="Progreso" color="success" />
          </Grid>
        </Grid>
      </Box>
    ),
    estimatedDuration: 2,
    difficulty: 'beginner',
    rewards: { meritos: 25, ondas: 15 },
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 'fundamentals',
    title: 'Fundamentos de Gamificación',
    description: 'Aprende los principios básicos del aprendizaje gamificado',
    content: (
      <Box sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          📚 Conceptos Fundamentales
        </Typography>
        <Typography variant="body1" paragraph>
          La gamificación en el aprendizaje combina elementos de juego con contenido educativo
          para crear experiencias más atractivas y efectivas.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Dato curioso:</strong> Los estudiantes retienen 90% más información cuando
          el aprendizaje incluye elementos interactivos.
        </Alert>
      </Box>
    ),
    videoId: 'gamification-intro',
    questionsCount: 5,
    estimatedDuration: 8,
    difficulty: 'beginner',
    rewards: { meritos: 50, ondas: 30 },
    prerequisites: ['intro'],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 'interactive-elements',
    title: 'Elementos Interactivos',
    description: 'Explora preguntas, desafíos y mecánicas de juego',
    content: (
      <Box sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          🎮 Mecánicas Interactivas
        </Typography>
        <Typography variant="body1" paragraph>
          Los elementos interactivos incluyen preguntas de múltiple opción, desafíos temporales,
          y sistemas de recompensas que mantienen tu motivación alta.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip icon={<Quiz />} label="Preguntas Dinámicas" variant="outlined" />
          <Chip icon={<Speed />} label="Desafíos Temporales" variant="outlined" />
          <Chip icon={<CheckCircle />} label="Logros Desbloqueables" variant="outlined" />
        </Box>
      </Box>
    ),
    videoId: 'interactive-demo',
    questionsCount: 8,
    estimatedDuration: 12,
    difficulty: 'intermediate',
    rewards: { meritos: 75, ondas: 45 },
    prerequisites: ['fundamentals'],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 'advanced-strategies',
    title: 'Estrategias Avanzadas',
    description: 'Domina técnicas avanzadas de aprendizaje adaptativo',
    content: (
      <Box sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          🚀 Estrategias Maestras
        </Typography>
        <Typography variant="body1" paragraph>
          Aprende a utilizar técnicas avanzadas como el aprendizaje adaptativo,
          la repetición espaciada y los desafíos colaborativos.
        </Typography>
        <Alert severity="success" sx={{ mb: 2 }}>
          <strong>Nivel Master:</strong> Dominar estas técnicas te convertirá en un
          aprendiz de élite en la comunidad CoomÜnity.
        </Alert>
      </Box>
    ),
    videoId: 'advanced-techniques',
    questionsCount: 12,
    estimatedDuration: 15,
    difficulty: 'advanced',
    rewards: { meritos: 150, ondas: 100 },
    prerequisites: ['interactive-elements'],
    isCompleted: false,
    isUnlocked: false,
  },
];

// ===== 🧠 COMPONENTE PRINCIPAL ===== //
export const OptimizedUPlayWizard: React.FC<OptimizedUPlayWizardProps> = ({
  initialStep = 0,
  onStepComplete,
  onWizardComplete,
  showProgressIndicator = true,
  enablePreloading = true,
  cosmicEffects = true,
}) => {
  const theme = useTheme();

  // 🔄 ESTADO DEL WIZARD
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [wizardSteps, setWizardSteps] = useState(mockWizardSteps);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // 🚀 REACT 18 STARTTRANSITION PARA UX OPTIMIZADA
  const [isPending, startTransition] = useTransition();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isStepChanging: false,
    isVideoLoading: false,
    isContentPreloading: false,
    currentlyLoading: null,
  });

  // 🎯 DATOS COMPUTADOS
  const currentStep = useMemo(() => wizardSteps[currentStepIndex], [wizardSteps, currentStepIndex]);
  const totalSteps = wizardSteps.length;
  const progressPercentage = useMemo(() =>
    ((currentStepIndex + 1) / totalSteps) * 100,
    [currentStepIndex, totalSteps]
  );

  // 🔄 FUNCIONES DE NAVEGACIÓN OPTIMIZADAS
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      // Mostrar indicador inmediatamente
      setTransitionState(prev => ({
        ...prev,
        isStepChanging: true,
        currentlyLoading: `Cargando paso ${currentStepIndex + 2}...`
      }));

      startTransition(() => {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);

        // Desbloquear el siguiente paso si existe
        if (nextIndex < totalSteps) {
          setWizardSteps(prev => prev.map((step, index) =>
            index === nextIndex ? { ...step, isUnlocked: true } : step
          ));
        }

        // Precargar contenido del paso siguiente si está habilitado
        if (enablePreloading && nextIndex + 1 < totalSteps) {
          setTransitionState(prev => ({
            ...prev,
            isContentPreloading: true
          }));

          // Simular precarga de contenido
          setTimeout(() => {
            setTransitionState(prev => ({
              ...prev,
              isContentPreloading: false
            }));
          }, 500);
        }

        // Resetear indicadores después de la transición
        setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            isStepChanging: false,
            currentlyLoading: null
          }));
        }, 400);
      });
    }
  }, [currentStepIndex, totalSteps, enablePreloading]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setTransitionState(prev => ({
        ...prev,
        isStepChanging: true,
        currentlyLoading: `Regresando al paso ${currentStepIndex}...`
      }));

      startTransition(() => {
        setCurrentStepIndex(prev => prev - 1);

        setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            isStepChanging: false,
            currentlyLoading: null
          }));
        }, 300);
      });
    }
  }, [currentStepIndex]);

  const completeCurrentStep = useCallback(() => {
    if (currentStep) {
      setTransitionState(prev => ({
        ...prev,
        currentlyLoading: 'Guardando progreso...'
      }));

      startTransition(() => {
        // Marcar paso como completado
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));

        // Actualizar estado del paso
        setWizardSteps(prev => prev.map(step =>
          step.id === currentStep.id ? { ...step, isCompleted: true } : step
        ));

        // Callback de finalización de paso
        onStepComplete?.(currentStep.id);

        // Si es el último paso, completar wizard
        if (currentStepIndex === totalSteps - 1) {
          onWizardComplete?.();
        }

        setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            currentlyLoading: null
          }));
        }, 800);
      });
    }
  }, [currentStep, currentStepIndex, totalSteps, onStepComplete, onWizardComplete]);

  // 🎬 FUNCIÓN PARA CARGAR VIDEO (CON STARTTRANSITION)
  const loadVideo = useCallback((videoId: string) => {
    setTransitionState(prev => ({
      ...prev,
      isVideoLoading: true,
      currentlyLoading: `Cargando video ${videoId}...`
    }));

    startTransition(() => {
      // Simular carga de video
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isVideoLoading: false,
          currentlyLoading: null
        }));
        console.log(`🎬 Video ${videoId} cargado con startTransition`);
      }, 1200);
    });
  }, []);

  // 🎨 COMPONENTE DE CARGA OPTIMIZADO
  const LoadingPlaceholder = () => (
    <Fade in={true} timeout={300}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress
          size={60}
          sx={{
            color: cosmicEffects ? 'primary.main' : '#6366f1',
            mb: 2
          }}
        />
        <Typography variant="h6" color="text.secondary">
          {transitionState.currentlyLoading || 'Cargando contenido...'}
        </Typography>
        {enablePreloading && transitionState.isContentPreloading && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Precargando siguiente paso para una experiencia fluida
          </Typography>
        )}
      </Box>
    </Fade>
  );

  // 📊 INDICADOR DE PROGRESO GLOBAL
  const ProgressIndicator = () => (
    showProgressIndicator && (
      <UniversalComponent
        element="aire"
        variant="surface"
        sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Progreso del Wizard ÜPlay
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentStepIndex + 1} de {totalSteps} pasos
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: cosmicEffects
                  ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {wizardSteps.map((step, index) => (
              <Chip
                key={step.id}
                label={index + 1}
                size="small"
                variant={index === currentStepIndex ? "filled" : "outlined"}
                color={
                  completedSteps.has(step.id) ? "success" :
                  index === currentStepIndex ? "primary" :
                  "default"
                }
                icon={
                  completedSteps.has(step.id) ? <CheckCircle /> :
                  index === currentStepIndex ? <PlayArrow /> :
                  undefined
                }
                sx={{
                  transition: 'all 0.3s ease',
                  opacity: transitionState.isStepChanging && index !== currentStepIndex ? 0.6 : 1,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Indicador de transición activa */}
        {(isPending || transitionState.isStepChanging) && (
          <LinearProgress
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
            }}
          />
        )}
      </UniversalComponent>
    )
  );

  // 🎯 RENDERIZADO DEL PASO ACTUAL
  const StepContent = () => {
    if (!currentStep) {
      return <LoadingPlaceholder />;
    }

    return (
      <Fade
        in={!transitionState.isStepChanging}
        timeout={400}
        unmountOnExit
      >
        <UniversalComponent
          element="fuego"
          variant="card"
          cosmic={cosmicEffects}
          sx={{ minHeight: 400 }}
        >
          <Box sx={{ p: 3 }}>
            {/* Header del paso */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {currentStep.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {currentStep.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={`${currentStep.estimatedDuration} min`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={currentStep.difficulty}
                  size="small"
                  color={
                    currentStep.difficulty === 'beginner' ? 'success' :
                    currentStep.difficulty === 'intermediate' ? 'warning' : 'error'
                  }
                />
                {currentStep.questionsCount && (
                  <Chip
                    icon={<Quiz />}
                    label={`${currentStep.questionsCount} preguntas`}
                    size="small"
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={<Star />}
                  label={`${currentStep.rewards.meritos} Mëritos`}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>

            {/* Contenido del paso */}
            <Suspense fallback={<LoadingPlaceholder />}>
              {transitionState.isVideoLoading ? (
                <LoadingPlaceholder />
              ) : (
                <Zoom in={!transitionState.isStepChanging} timeout={300}>
                  <Box>
                    {currentStep.content}

                    {/* Botón de reproducir video si existe */}
                    {currentStep.videoId && (
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayArrow />}
                          onClick={() => loadVideo(currentStep.videoId!)}
                          disabled={transitionState.isVideoLoading}
                          sx={{
                            background: cosmicEffects
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : undefined,
                            px: 4,
                            py: 1.5,
                          }}
                        >
                          {transitionState.isVideoLoading ? 'Cargando...' : 'Reproducir Video'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Zoom>
              )}
            </Suspense>
          </Box>
        </UniversalComponent>
      </Fade>
    );
  };

  // 🎮 CONTROLES DE NAVEGACIÓN
  const NavigationControls = () => (
    <UniversalComponent
      element="tierra"
      variant="surface"
      sx={{ mt: 3, p: 2 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ChevronLeft />}
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0 || transitionState.isStepChanging}
          sx={{ opacity: transitionState.isStepChanging ? 0.6 : 1 }}
        >
          Anterior
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {!completedSteps.has(currentStep?.id || '') && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={completeCurrentStep}
              disabled={isPending}
            >
              Completar Paso
            </Button>
          )}

          <Button
            variant="contained"
            endIcon={<ChevronRight />}
            onClick={goToNextStep}
            disabled={
              currentStepIndex === totalSteps - 1 ||
              transitionState.isStepChanging ||
              !currentStep?.isUnlocked
            }
            sx={{
              background: cosmicEffects
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : undefined,
              opacity: transitionState.isStepChanging ? 0.6 : 1
            }}
          >
            {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Box>
      </Box>

      {/* Indicador de estado de transición */}
      {transitionState.currentlyLoading && (
        <Alert
          severity="info"
          sx={{ mt: 2, borderRadius: 2 }}
          icon={<CircularProgress size={20} />}
        >
          {transitionState.currentlyLoading}
        </Alert>
      )}
    </UniversalComponent>
  );

  // 🎨 RENDERIZADO PRINCIPAL
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <ProgressIndicator />
      <StepContent />
      <NavigationControls />

      {/* Indicador de precarga en segundo plano */}
      {transitionState.isContentPreloading && (
        <Alert
          severity="info"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1300,
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Precargando siguiente contenido...
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default OptimizedUPlayWizard;
