/**
 * 🎓 LETS Onboarding Wizard - Educación Progresiva
 * 
 * Componente que guía a los usuarios nuevos a través de los conceptos LETS
 * de manera progresiva y humanizada, transformando conceptos técnicos en
 * experiencias emocionales y comprensibles.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  Alert,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  School,
  Handshake,
  AccountBalance,
  Favorite,
  StarBorder,
  Psychology,
  Groups,
  EmojiEvents,
  Close,
  ArrowForward,
  ArrowBack,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Animaciones para elementos visuales
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  practicalExample: string;
  visualDemo: React.ReactNode;
  userAction?: 'none' | 'practice' | 'setup';
  emotionalContext: string;
  coomunityPhilosophy: string;
}

interface LetsOnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId?: string;
}

// Componentes de animación visual
const TimeEqualsValueAnimation: React.FC = () => (
  <Box 
    display="flex" 
    alignItems="center" 
    justifyContent="center" 
    gap={2}
    sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      borderRadius: 2,
      animation: `${pulseAnimation} 3s ease-in-out infinite`
    }}
  >
    <Avatar sx={{ bgcolor: 'primary.main' }}>👨‍🏫</Avatar>
    <Typography variant="h6">1 hora</Typography>
    <Typography variant="h4" color="primary">=</Typography>
    <Typography variant="h6">1 Ünit</Typography>
    <Typography variant="h4" color="primary">=</Typography>
    <Avatar sx={{ bgcolor: 'secondary.main' }}>👩‍🍳</Avatar>
  </Box>
);

const UnitsFlowAnimation: React.FC = () => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    gap={2}
    sx={{ p: 3 }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Chip 
        label="Contribuyes" 
        color="success"
        sx={{ animation: `${floatAnimation} 2s ease-in-out infinite` }}
      />
      <Typography variant="h4" color="success.main">+1 Ünit</Typography>
    </Box>
    <Box display="flex" alignItems="center" gap={2}>
      <Chip 
        label="Recibes ayuda" 
        color="primary"
        sx={{ animation: `${floatAnimation} 2s ease-in-out infinite 0.5s` }}
      />
      <Typography variant="h4" color="primary.main">-1 Ünit</Typography>
    </Box>
    <Typography variant="caption" color="text.secondary" textAlign="center">
      ¡El equilibrio perfecto es dar y recibir por igual! ⚖️
    </Typography>
  </Box>
);

const WalletStoryAnimation: React.FC = () => (
  <Card sx={{ maxWidth: 300, mx: 'auto' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Tu Historia 📖</Typography>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Has ayudado:</Typography>
        <Typography variant="body2" color="success.main">+15 Ünits</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Has recibido:</Typography>
        <Typography variant="body2" color="primary.main">-12 Ünits</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" fontWeight="bold">
        <Typography variant="body2">Tu impacto:</Typography>
        <Typography variant="body2" color="text.primary">+3 Ünits</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        ¡Eres un gran contribuidor a la comunidad! 🌟
      </Typography>
    </CardContent>
  </Card>
);

const TrustBuildingAnimation: React.FC = () => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
    <Box display="flex" gap={1}>
      {[1, 2, 3, 4, 5].map((star, index) => (
        <StarBorder 
          key={star} 
          sx={{ 
            color: index < 4 ? 'warning.main' : 'grey.300',
            fontSize: 32,
            animation: index < 4 ? `${pulseAnimation} 1s ease-in-out infinite ${index * 0.2}s` : 'none'
          }} 
        />
      ))}
    </Box>
    <Typography variant="body2" textAlign="center">
      Tu confianza crece con cada buena acción 💛
    </Typography>
    <Typography variant="caption" color="text.secondary" textAlign="center">
      4 de 5 estrellas - ¡La comunidad confía en ti!
    </Typography>
  </Box>
);

const FirstExchangeDemo: React.FC = () => (
  <Box>
    <Alert 
      severity="success" 
      sx={{ mb: 2 }}
      icon={<EmojiEvents />}
    >
      ¡Tu primera experiencia será guiada y segura!
    </Alert>
    <Card sx={{ background: 'linear-gradient(45deg, #FFF3E0, #E8F5E8)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>🎯 Intercambio de Práctica</Typography>
        <Typography variant="body2" paragraph>
          Te conectaremos con un mentor experimentado para tu primer intercambio.
          Podrás compartir una habilidad simple por 15 minutos y recibir
          feedback valioso de la comunidad.
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip size="small" label="Sin presión" color="success" />
          <Chip size="small" label="Mentor dedicado" color="primary" />
          <Chip size="small" label="Feedback constructivo" color="secondary" />
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// Datos de los pasos del onboarding
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
    visualDemo: <TimeEqualsValueAnimation />,
    userAction: 'none',
    emotionalContext: 'Todos somos valiosos y tenemos algo único que aportar',
    coomunityPhilosophy: 'En CoomÜnity, el valor no se mide en dinero, sino en contribución al bienestar común'
  },
  {
    id: 'units_concept',
    title: '¿Qué son las Ünits? 💫',
    subtitle: 'Tu moneda de reciprocidad en CoomÜnity',
    explanation: `Las Ünits representan tu contribución a la comunidad.
                  No son dinero tradicional, son una forma de reconocer
                  el valor que aportas y recibir valor a cambio.`,
    practicalExample: `1 Ünit = 1 hora de tu tiempo dedicado
                       - Enseñar una habilidad: +1 Ünit
                       - Aprender algo nuevo: -1 Ünit
                       - El equilibrio perfecto es dar y recibir por igual`,
    visualDemo: <UnitsFlowAnimation />,
    userAction: 'practice',
    emotionalContext: 'Cada Ünit representa una historia de ayuda mutua y crecimiento',
    coomunityPhilosophy: 'Las Ünits honran el principio ancestral del Ayni: la reciprocidad sagrada'
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
    visualDemo: <WalletStoryAnimation />,
    userAction: 'setup',
    emotionalContext: 'Tu wallet cuenta la historia de tus conexiones humanas',
    coomunityPhilosophy: 'No hay deuda, solo apoyo mutuo en diferentes momentos de la vida'
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
    visualDemo: <TrustBuildingAnimation />,
    userAction: 'practice',
    emotionalContext: 'La confianza es el regalo más valioso que puedes dar y recibir',
    coomunityPhilosophy: 'La confianza se construye con autenticidad, se mantiene con coherencia'
  },
  {
    id: 'first_exchange',
    title: '¡Tu primer intercambio! 🎉',
    subtitle: 'Practica con un intercambio seguro y guiado',
    explanation: `Te ayudamos a hacer tu primer intercambio con un mentor
                  de la comunidad. Sin presión, solo para que veas
                  lo fácil y gratificante que es.`,
    practicalExample: `Intercambio de práctica sugerido:
                       - Comparte una habilidad simple (15 min)
                       - Recibe feedback de la comunidad
                       - Gana tus primeras Ünits
                       - ¡Celebra tu primer paso hacia el Bien Común!`,
    visualDemo: <FirstExchangeDemo />,
    userAction: 'practice',
    emotionalContext: 'Tu primer intercambio es el inicio de muchas conexiones hermosas',
    coomunityPhilosophy: 'Cada intercambio fortalece la red de reciprocidad y cuidado mutuo'
  }
];

export const LetsOnboardingWizard: React.FC<LetsOnboardingWizardProps> = ({
  open,
  onClose,
  onComplete,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = () => {
    // Marcar onboarding como completado
    localStorage.setItem('lets_onboarding_completed', 'true');
    localStorage.setItem('lets_onboarding_date', new Date().toISOString());
    
    onComplete();
    onClose();
  };

  const handlePracticeAction = () => {
    setUserProgress(prev => ({
      ...prev,
      [currentStepData.id]: true
    }));
    
    // Aquí se podría integrar con el sistema de práctica real
    console.log('🎯 Acción de práctica para:', currentStepData.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '70vh'
        }
      }}
    >
      {/* Header con progreso */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Guía LETS CoomÜnity
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            bgcolor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
            }
          }}
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Paso {currentStep + 1} de {totalSteps} - {Math.round(progressPercentage)}% completado
        </Typography>
      </Box>

      {/* Contenido principal */}
      <DialogContent sx={{ p: 4 }}>
        <Fade in={!isAnimating} timeout={300}>
          <Box>
            {/* Título y subtítulo */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {currentStepData.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                {currentStepData.subtitle}
              </Typography>
            </Box>

            {/* Demo visual */}
            <Box mb={4}>
              <Zoom in={!isAnimating} timeout={500}>
                <div>
                  {currentStepData.visualDemo}
                </div>
              </Zoom>
            </Box>

            {/* Explicación */}
            <Card sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.8)' }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  {currentStepData.explanation}
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Ejemplo práctico:</strong> {currentStepData.practicalExample}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Contexto emocional y filosofía */}
            <Box display="flex" gap={2} mb={3}>
              <Card sx={{ flex: 1, bgcolor: 'rgba(255,243,224,0.8)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Favorite color="secondary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Contexto Humano
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {currentStepData.emotionalContext}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, bgcolor: 'rgba(232,245,233,0.8)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Psychology color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Filosofía CoomÜnity
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {currentStepData.coomunityPhilosophy}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Acción del usuario */}
            {currentStepData.userAction === 'practice' && (
              <Card sx={{ bgcolor: 'rgba(227,242,253,0.8)', mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="between">
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        💪 ¡Practica este concepto!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Haz clic para explorar este concepto de manera interactiva
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={handlePracticeAction}
                      disabled={userProgress[currentStepData.id]}
                      sx={{ ml: 2 }}
                    >
                      {userProgress[currentStepData.id] ? 'Completado' : 'Practicar'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      </DialogContent>

      {/* Navegación */}
      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outlined"
        >
          Anterior
        </Button>

        <Box display="flex" gap={1}>
          {ONBOARDING_STEPS.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index <= currentStep ? 'primary.main' : 'grey.300',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>

        <Button
          endIcon={currentStep === totalSteps - 1 ? <CheckCircle /> : <ArrowForward />}
          onClick={handleNext}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            minWidth: 120
          }}
        >
          {currentStep === totalSteps - 1 ? 'Completar' : 'Siguiente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LetsOnboardingWizard; 