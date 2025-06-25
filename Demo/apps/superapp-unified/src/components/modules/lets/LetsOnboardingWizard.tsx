import React, { useState, useEffect, startTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Avatar,
  LinearProgress,
  Alert,
  Fade,
  Zoom,
  Grow,
  IconButton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Handshake as HandshakeIcon,
  Groups as GroupsIcon,
  EmojiEvents as EmojiEventsIcon,
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  practicalExample: string;
  userAction?: 'none' | 'practice' | 'setup';
  completionMessage: string;
}

interface LetsOnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a una nueva forma de intercambiar! 🌟',
    subtitle: 'Imagina un mundo donde tu tiempo y habilidades valen lo mismo que las de todos',
    explanation: `En CoomÜnity creemos que todos tenemos algo valioso que ofrecer.
                  LETS es nuestro sistema para intercambiar de manera justa y equilibrada.`,
    practicalExample: `Ejemplo: María enseña guitarra 1 hora y recibe 1 Ünit.
                       Carlos cocina para 4 personas 1 hora y recibe 1 Ünit.
                       ¡Ambos contribuyen igual al Bien Común!`,
    userAction: 'none',
    completionMessage: '¡Genial! Ya entiendes el principio básico de equidad en CoomÜnity'
  },
  {
    id: 'units_concept',
    title: '¿Qué son las Ünits? 💫',
    subtitle: 'Tu moneda de reciprocidad en CoomÜnity',
    explanation: `Las Ünits representan tu contribución a la comunidad.
                  No son dinero tradicional, son una forma de reconocer
                  el valor que aportas y recibir valor a cambio.`,
    practicalExample: `1 Ünit = 1 hora de tu tiempo dedicado
                       • Enseñar una habilidad: +1 Ünit
                       • Aprender algo nuevo: -1 Ünit
                       • El equilibrio perfecto es dar y recibir por igual`,
    userAction: 'practice',
    completionMessage: '¡Perfecto! Ahora entiendes cómo funcionan las Ünits'
  },
  {
    id: 'wallet_simple',
    title: 'Tu Wallet: Tu historia de contribución 📖',
    subtitle: 'Aquí vive tu impacto en la comunidad',
    explanation: `Tu wallet no es solo números, es tu historia de cómo
                  has contribuido al Bien Común y cómo la comunidad
                  te ha apoyado.`,
    practicalExample: `Saldo positivo: Has dado más de lo que has recibido
                       Saldo negativo: La comunidad te está apoyando
                       ¡Ambos son valiosos y necesarios!`,
    userAction: 'setup',
    completionMessage: '¡Excelente! Tu wallet está listo para tu primera contribución'
  },
  {
    id: 'trust_community',
    title: 'Confianza: El corazón de CoomÜnity ❤️',
    subtitle: 'Construyes confianza siendo auténtico y cumpliendo tu palabra',
    explanation: `La confianza no se compra, se construye con cada interacción.
                  Cuando cumples tus compromisos y ayudas genuinamente,
                  la comunidad lo reconoce.`,
    practicalExample: `Alta confianza: Acceso a más oportunidades
                       Baja confianza: La comunidad te ayuda a crecer
                       ¡Todos empezamos desde cero y crecemos juntos!`,
    userAction: 'practice',
    completionMessage: '¡Maravilloso! Entiendes que la confianza se construye paso a paso'
  },
  {
    id: 'first_exchange',
    title: '¡Tu primer intercambio! 🎉',
    subtitle: 'Practica con un intercambio seguro y guiado',
    explanation: `Te ayudamos a hacer tu primer intercambio con un mentor
                  de la comunidad. Sin presión, solo para que veas
                  lo fácil y gratificante que es.`,
    practicalExample: `Intercambio de práctica sugerido:
                       • Comparte una habilidad simple (15 min)
                       • Recibe feedback de la comunidad
                       • Gana tus primeras Ünits
                       • ¡Celebra tu primer paso hacia el Bien Común!`,
    userAction: 'practice',
    completionMessage: '¡Estás listo para tu primer intercambio real! 🚀'
  }
];

// Componente de animación para visualizar conceptos
const UnitsFlowAnimation: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 120,
      my: 2,
    }}
  >
    <Zoom in timeout={1000}>
      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
        👩‍🏫
      </Avatar>
    </Zoom>
    <Grow in timeout={1500}>
      <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
        <Typography variant="h6" color="primary.main">
          1 hora
        </Typography>
        <Typography variant="h6" sx={{ mx: 1 }}>
          =
        </Typography>
        <Typography variant="h6" color="secondary.main">
          1 Ünit
        </Typography>
      </Box>
    </Grow>
    <Zoom in timeout={2000}>
      <Avatar sx={{ bgcolor: 'secondary.main', ml: 2 }}>
        👨‍🍳
      </Avatar>
    </Zoom>
  </Box>
);

// Componente de progreso visual
const WalletStoryVisualization: React.FC<{ balance: number }> = ({ balance }) => (
  <Card
    sx={{
      mt: 2,
      background: balance >= 0
        ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
        : 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
      border: `2px solid ${balance >= 0 ? '#4caf50' : '#ff9800'}`,
    }}
  >
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h4" fontWeight="bold" color={balance >= 0 ? 'success.main' : 'warning.main'}>
        {balance >= 0 ? '+' : ''}{balance}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {balance >= 0
          ? '¡Has contribuido más de lo que has recibido!'
          : 'La comunidad te está apoyando'
        }
      </Typography>
    </CardContent>
  </Card>
);

export const LetsOnboardingWizard: React.FC<LetsOnboardingWizardProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [virtualWallet, setVirtualWallet] = useState(0);

  const currentStep = ONBOARDING_STEPS[activeStep];
  const isLastStep = activeStep === ONBOARDING_STEPS.length - 1;
  const progress = ((activeStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleCloseCelebration = () => {
    onComplete();
    onClose();
  };

  const handleNext = () => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(activeStep);
    setCompletedSteps(newCompletedSteps);

    startTransition(() => {
      if (isLastStep) {
        setShowCelebration(true);
      } else {
        setActiveStep(prev => prev + 1);
      }
    });
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSkip = () => {
    startTransition(() => {
      onClose();
    });
  };

  const handlePracticeAction = () => {
    if (currentStep.id === 'units_concept') {
      setVirtualWallet(1);
    } else if (currentStep.id === 'trust_community') {
      // Simular aumento de confianza
    }
    handleNext();
  };

  const renderStepContent = (step: OnboardingStep) => {
    switch (step.id) {
      case 'welcome':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <GroupsIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </Box>
            <Typography variant="body1" paragraph>
              {step.explanation}
            </Typography>
            <Alert severity="info" sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>💡 Ejemplo práctico:</strong><br />
                {step.practicalExample}
              </Typography>
            </Alert>
          </Box>
        );

      case 'units_concept':
        return (
          <Box>
            <UnitsFlowAnimation />
            <Typography variant="body1" paragraph>
              {step.explanation}
            </Typography>
            <Alert severity="success" sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>⚖️ Principio de Equidad:</strong><br />
                {step.practicalExample}
              </Typography>
            </Alert>
          </Box>
        );

      case 'wallet_simple':
        return (
          <Box>
            <Typography variant="body1" paragraph>
              {step.explanation}
            </Typography>
            <WalletStoryVisualization balance={virtualWallet} />
            <Alert severity="info" sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>🎯 Recuerda:</strong><br />
                {step.practicalExample}
              </Typography>
            </Alert>
          </Box>
        );

      case 'trust_community':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <FavoriteIcon sx={{ fontSize: 80, color: 'error.main' }} />
            </Box>
            <Typography variant="body1" paragraph>
              {step.explanation}
            </Typography>
            <Alert severity="warning" sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>🌱 Crecimiento Gradual:</strong><br />
                {step.practicalExample}
              </Typography>
            </Alert>
          </Box>
        );

      case 'first_exchange':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: 'warning.main' }} />
            </Box>
            <Typography variant="body1" paragraph>
              {step.explanation}
            </Typography>
            <Alert severity="success" sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>🚀 Tu primer paso:</strong><br />
                {step.practicalExample}
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  if (showCelebration) {
    return (
      <Dialog open fullWidth maxWidth="sm" onClose={handleCloseCelebration}>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <Zoom in>
            <EmojiEventsIcon sx={{ fontSize: 120, color: 'warning.main', mb: 2 }} />
          </Zoom>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            ¡Felicidades! 🎉
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Has completado tu introducción a LETS
          </Typography>
          <Typography variant="body1" paragraph>
            Ahora estás listo para comenzar tu viaje de intercambios
            y contribuir al Bien Común de CoomÜnity.
          </Typography>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseCelebration} variant="contained" size="large">
            ¡Comenzar a Explorar!
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 100%)',
        }
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Introducción a LETS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Paso {activeStep + 1} de {ONBOARDING_STEPS.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
              }
            }}
          />
        </Box>

        {/* Step Content */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {currentStep.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {currentStep.subtitle}
            </Typography>

            <Fade in key={activeStep}>
              <Box>
                {renderStepContent(currentStep)}
              </Box>
            </Fade>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
        >
          Anterior
        </Button>

        <Box>
          {currentStep.userAction === 'practice' ? (
            <Button
              onClick={handlePracticeAction}
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{ mr: 1 }}
            >
              Practicar
            </Button>
          ) : null}

          <Button
            onClick={handleNext}
            variant="contained"
            color={isLastStep ? 'success' : 'primary'}
          >
            {isLastStep ? '¡Completar!' : 'Siguiente'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LetsOnboardingWizard;
