import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Fade,
  Slide,
  useTheme,
  alpha,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Handshake as HandshakeIcon,
  EmojiEvents as EmojiEventsIcon,
  Timer as TimerIcon,
  SwapHoriz as SwapHorizIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useLetsEducation } from '../../../../../../contexts/LetsEducationContext';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

interface LetsOnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  example: string;
  visualDemo: React.ComponentType;
  icon: React.ComponentType;
  color: string;
  achievement?: string;
}

// ============================================================================
// COMPONENTES DE ANIMACIÓN (PLACEHOLDERS MEJORADOS)
// ============================================================================

const TimeEqualsValueAnimation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
      }}
    >
      <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
        <TimerIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="primary" textAlign="center">
        1 Hora de Trabajo = 1 LETS
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip label="60 min" color="primary" variant="outlined" />
        <SwapHorizIcon color="primary" />
        <Chip label="1 LETS" color="secondary" />
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        El tiempo es la unidad de valor universal
      </Typography>
    </Box>
  );
};

const UnitsFlowAnimation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.info.main, 0.1)})`,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.success.main, 0.3)}`,
      }}
    >
      <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64 }}>
        <TrendingUpIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="success.main" textAlign="center">
        Flujo de Unidades LETS
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box textAlign="center">
          <Avatar sx={{ bgcolor: 'info.main', mb: 1 }}>A</Avatar>
          <Typography variant="caption">Proveedor</Typography>
        </Box>
        <ArrowForwardIcon color="success" />
        <Chip label="5 LETS" color="success" />
        <ArrowForwardIcon color="success" />
        <Box textAlign="center">
          <Avatar sx={{ bgcolor: 'warning.main', mb: 1 }}>B</Avatar>
          <Typography variant="caption">Cliente</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Las unidades fluyen de quien ofrece a quien recibe
      </Typography>
    </Box>
  );
};

const CommunityNetworkAnimation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.error.main, 0.1)})`,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
      }}
    >
      <Avatar sx={{ bgcolor: 'warning.main', width: 64, height: 64 }}>
        <PeopleIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="warning.main" textAlign="center">
        Red de Comunidad
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['👨‍🍳', '👩‍🏫', '👨‍🔧', '👩‍⚕️', '👨‍🌾'].map((emoji, index) => (
          <Avatar key={index} sx={{ bgcolor: `hsl(${index * 72}, 70%, 60%)` }}>
            {emoji}
          </Avatar>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Cada persona aporta sus habilidades únicas
      </Typography>
    </Box>
  );
};

const TrustSystemAnimation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.info.main, 0.3)}`,
      }}
    >
      <Avatar sx={{ bgcolor: 'info.main', width: 64, height: 64 }}>
        <HandshakeIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="info.main" textAlign="center">
        Sistema de Confianza
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box textAlign="center">
          <Box
            sx={{ display: 'flex', gap: 0.5, mb: 1, justifyContent: 'center' }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} sx={{ color: 'gold', fontSize: 20 }} />
            ))}
          </Box>
          <Typography variant="caption">Reputación</Typography>
        </Box>
        <FavoriteIcon color="error" />
        <Typography variant="h6" color="success.main">
          Confianza
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        La confianza se construye con cada intercambio exitoso
      </Typography>
    </Box>
  );
};

const LocalEconomyAnimation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.success.main, 0.1)})`,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.secondary.main, 0.3)}`,
      }}
    >
      <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64 }}>
        <AccountBalanceIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="secondary.main" textAlign="center">
        Economía Local Fortalecida
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip label="Local" color="secondary" variant="outlined" />
        <Typography variant="h6">+</Typography>
        <Chip label="Sostenible" color="success" variant="outlined" />
        <Typography variant="h6">=</Typography>
        <Chip label="Próspero" color="primary" />
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Fortalecemos nuestra comunidad local
      </Typography>
    </Box>
  );
};

// ============================================================================
// DEFINICIÓN DE PASOS DEL ONBOARDING
// ============================================================================

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a LETS!',
    subtitle: 'Local Exchange Trading System',
    explanation:
      'LETS es un sistema de intercambio local que permite a las comunidades comerciar servicios y productos usando una moneda local basada en tiempo.',
    example:
      'Imagina poder intercambiar una hora de jardinería por una hora de clases de idiomas, ¡sin dinero tradicional!',
    visualDemo: TimeEqualsValueAnimation,
    icon: SchoolIcon,
    color: '#1976d2',
    achievement: 'first_step',
  },
  {
    id: 'time_value',
    title: 'El Tiempo como Valor',
    subtitle: 'Una hora = Una unidad LETS',
    explanation:
      'En LETS, el tiempo es la unidad de valor fundamental. Una hora de trabajo de cualquier persona vale lo mismo, sin importar el tipo de trabajo.',
    example:
      'Una hora de limpieza = Una hora de consultoría = Una hora de cocina = 1 LETS',
    visualDemo: UnitsFlowAnimation,
    icon: TimerIcon,
    color: '#388e3c',
    achievement: 'time_concept',
  },
  {
    id: 'community',
    title: 'Comunidad Colaborativa',
    subtitle: 'Todos contribuyen, todos se benefician',
    explanation:
      'LETS funciona porque cada miembro de la comunidad ofrece sus habilidades y recibe lo que necesita de otros miembros.',
    example:
      'María ofrece clases de piano, Juan repara bicicletas, Ana cultiva vegetales. ¡Todos intercambian entre sí!',
    visualDemo: CommunityNetworkAnimation,
    icon: PeopleIcon,
    color: '#f57c00',
    achievement: 'community_spirit',
  },
  {
    id: 'trust',
    title: 'Sistema de Confianza',
    subtitle: 'La reputación es clave',
    explanation:
      'La confianza se construye a través de intercambios exitosos. Cada transacción completada aumenta tu reputación en la comunidad.',
    example:
      'Después de 10 intercambios exitosos, otros miembros confiarán más en tus servicios.',
    visualDemo: TrustSystemAnimation,
    icon: HandshakeIcon,
    color: '#7b1fa2',
    achievement: 'trust_builder',
  },
  {
    id: 'local_economy',
    title: 'Fortaleciendo lo Local',
    subtitle: 'Economía sostenible y resiliente',
    explanation:
      'LETS fortalece la economía local manteniendo el valor dentro de la comunidad y reduciendo la dependencia del dinero tradicional.',
    example:
      'En lugar de contratar servicios externos, la comunidad se autoabastece y prospera junta.',
    visualDemo: LocalEconomyAnimation,
    icon: AccountBalanceIcon,
    color: '#d32f2f',
    achievement: 'local_champion',
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const LetsOnboardingWizard: React.FC<LetsOnboardingWizardProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const theme = useTheme();
  const { completeOnboarding, addAchievement } = useLetsEducation();
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
    'left'
  );

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setSlideDirection('left');
      setCurrentStep((prev) => prev + 1);

      // Agregar logro del paso actual
      if (currentStepData.achievement) {
        addAchievement(currentStepData.achievement);
      }
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setSlideDirection('right');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Completar onboarding en el contexto
    completeOnboarding();

    // Agregar logro de completar onboarding
    addAchievement('onboarding_completed');

    // Agregar logro del último paso si existe
    if (currentStepData.achievement) {
      addAchievement(currentStepData.achievement);
    }

    // Llamar callback de completado
    onComplete();
  };

  const handleStepClick = (stepIndex: number) => {
    setSlideDirection(stepIndex > currentStep ? 'left' : 'right');
    setCurrentStep(stepIndex);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const VisualDemoComponent = currentStepData?.visualDemo;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.05)} 0%,
            ${alpha(theme.palette.secondary.main, 0.05)} 50%,
            ${alpha(theme.palette.success.main, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Header con progreso */}
        <Box
          sx={{
            position: 'relative',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            p: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: alpha('white', 0.1),
              '&:hover': { bgcolor: alpha('white', 0.2) },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Descubre LETS
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 3 }}>
              Sistema de Intercambio Local - Tu puerta a una economía
              colaborativa
            </Typography>

            {/* Progreso */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">
                  Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
                </Typography>
                <Typography variant="body2">
                  {Math.round(
                    ((currentStep + 1) / ONBOARDING_STEPS.length) * 100
                  )}
                  %
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((currentStep + 1) / ONBOARDING_STEPS.length) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha('white', 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={currentStep}
              sx={{
                '& .MuiStepLabel-root': { color: 'white' },
                '& .MuiStepIcon-root': {
                  color: alpha('white', 0.3),
                  '&.Mui-active': { color: 'white' },
                  '&.Mui-completed': { color: alpha('white', 0.8) },
                },
                '& .MuiStepConnector-line': {
                  borderColor: alpha('white', 0.3),
                },
              }}
            >
              {ONBOARDING_STEPS.map((step, index) => (
                <Step key={step.id}>
                  <StepLabel
                    onClick={() => handleStepClick(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {step.title}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>

        {/* Contenido principal */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            minHeight: 'calc(100vh - 300px)',
          }}
        >
          <Slide
            direction={slideDirection}
            in={true}
            key={currentStep}
            timeout={500}
          >
            <Card
              sx={{
                maxWidth: 900,
                width: '100%',
                boxShadow: theme.shadows[8],
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      bgcolor:
                        currentStepData?.color || theme.palette.primary.main,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    {currentStepData?.icon && (
                      <currentStepData.icon sx={{ fontSize: 40 }} />
                    )}
                  </Avatar>

                  <Typography variant="h3" gutterBottom fontWeight="bold">
                    {currentStepData?.title}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontStyle: 'italic' }}
                  >
                    {currentStepData?.subtitle}
                  </Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Explicación */}
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    textAlign: 'center',
                    mb: 4,
                  }}
                >
                  {currentStepData?.explanation}
                </Typography>

                {/* Demostración visual */}
                {VisualDemoComponent && (
                  <Fade in={true} timeout={800}>
                    <Box sx={{ mb: 4 }}>
                      <VisualDemoComponent />
                    </Box>
                  </Fade>
                )}

                {/* Ejemplo */}
                <Card
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    mb: 4,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="info.main"
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      💡 Ejemplo práctico:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {currentStepData?.example}
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Slide>
        </Box>

        {/* Footer con botones */}
        <Box
          sx={{
            p: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Button
              onClick={handleBack}
              disabled={isFirstStep}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="large"
            >
              Anterior
            </Button>

            <Button
              onClick={handleSkip}
              variant="text"
              color="inherit"
              sx={{ opacity: 0.7 }}
            >
              Saltar tutorial
            </Button>

            <Button
              onClick={handleNext}
              endIcon={isLastStep ? <EmojiEventsIcon /> : <ArrowForwardIcon />}
              variant="contained"
              size="large"
              sx={{
                bgcolor: currentStepData?.color || theme.palette.primary.main,
                '&:hover': {
                  bgcolor: alpha(
                    currentStepData?.color || theme.palette.primary.main,
                    0.8
                  ),
                },
              }}
            >
              {isLastStep ? '¡Comenzar!' : 'Siguiente'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LetsOnboardingWizard;
