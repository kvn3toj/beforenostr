/**
 * 🎓 LETS Onboarding Component
 *
 * Guía educativa para nuevos usuarios del Sistema de Intercambio Local
 * Diseñado para hacer el concepto LETS accesible para el 95% de usuarios nuevos
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  Grid,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  School,
  AccountBalance,
  Handshake,
  TrendingUp,
  PlayArrow,
  Close,
  CheckCircle,
  Lightbulb,
  People,
  Spa as Eco // Nature/sustainability icon alternative
} from '@mui/icons-material';

interface LetsOnboardingProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId?: string;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: '¡Bienvenido al Sistema LETS! 🌱',
    description: 'Descubre una nueva forma de intercambiar valor basada en confianza y reciprocidad',
    icon: <Eco />,
    content: {
      type: 'welcome',
      points: [
        'LETS = Sistema de Intercambio Local (Local Exchange Trading System)',
        'Intercambia servicios y conocimientos sin dinero tradicional',
        'Basado en los principios de Ayni (reciprocidad) de CoomÜnity',
        'Construye confianza mientras ayudas a tu comunidad'
      ]
    }
  },
  {
    id: 'units',
    title: 'Conoce las Ünits 💰',
    description: 'Tu moneda comunitaria para intercambios justos',
    icon: <AccountBalance />,
    content: {
      type: 'units_explanation',
      concepts: [
        {
          term: 'Ünits',
          definition: 'Unidades de valor que representan tiempo y esfuerzo',
          example: '1 Ünit = aproximadamente 1 hora de trabajo o servicio'
        },
        {
          term: 'Balance',
          definition: 'Tus Ünits disponibles para intercambios',
          example: 'Puedes empezar con 0 y ganar Ünits ofreciendo servicios'
        },
        {
          term: 'Crédito',
          definition: 'Límite de Ünits que puedes deber temporalmente',
          example: 'Máximo -50 Ünits para usuarios nuevos'
        }
      ]
    }
  },
  {
    id: 'ayni',
    title: 'El Principio de Ayni ⚖️',
    description: 'Equilibrio entre dar y recibir',
    icon: <Handshake />,
    content: {
      type: 'ayni_balance',
      philosophy: 'Ayni es el principio andino de reciprocidad. En LETS, significa mantener un equilibrio saludable entre lo que ofreces y lo que recibes.',
      indicators: [
        {
          range: '0.8 - 1.2',
          status: 'Excelente',
          description: 'Balance perfecto entre dar y recibir',
          color: 'success'
        },
        {
          range: '< 0.8',
          status: 'Más ofrecer',
          description: 'Considera crear más listings de servicios',
          color: 'warning'
        },
        {
          range: '> 1.2',
          status: 'Más recibir',
          description: 'Explora servicios disponibles en la comunidad',
          color: 'info'
        }
      ]
    }
  },
  {
    id: 'trust',
    title: 'Sistema de Confianza ⭐',
    description: 'Construye tu reputación comunitaria',
    icon: <TrendingUp />,
    content: {
      type: 'trust_system',
      components: [
        {
          name: 'Calificaciones',
          description: 'Evalúa la calidad de servicios recibidos',
          impact: 'Afecta directamente el trust score del proveedor'
        },
        {
          name: 'Trust Score',
          description: 'Tu puntuación de confianza (0-100)',
          impact: 'Mayor score = más oportunidades de intercambio'
        },
        {
          name: 'Historial',
          description: 'Registro completo de tus transacciones',
          impact: 'Transparencia total para generar confianza'
        }
      ]
    }
  },
  {
    id: 'getting_started',
    title: '¡Comienza tu Viaje LETS! 🚀',
    description: 'Primeros pasos prácticos',
    icon: <PlayArrow />,
    content: {
      type: 'action_steps',
      steps: [
        {
          action: 'Explorar Marketplace',
          description: 'Ve qué servicios ofrecen otros miembros',
          buttonText: 'Ver Listings',
          priority: 1
        },
        {
          action: 'Crear tu primer Listing',
          description: 'Ofrece algo que sepas hacer bien',
          buttonText: 'Crear Listing',
          priority: 2
        },
        {
          action: 'Unirte a Intercambios de Conocimiento',
          description: 'Participa en sesiones educativas',
          buttonText: 'Ver Intercambios',
          priority: 3
        }
      ]
    }
  }
];

export const LetsOnboarding: React.FC<LetsOnboardingProps> = ({
  open,
  onClose,
  onComplete,
  userId
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar onboarding como completo
      onComplete();
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];

  const renderStepContent = () => {
    const { content } = currentStepData;

    switch (content.type) {
      case 'welcome':
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2
              }}
            >
              <Eco sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom color="primary">
              ¡Descubre el Poder del Intercambio Comunitario!
            </Typography>
            <Box sx={{ mt: 3 }}>
              {content.points.map((point: string, index: number) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                >
                  <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                  {point}
                </Typography>
              ))}
            </Box>
          </Box>
        );

      case 'units_explanation':
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              💡 Conceptos Clave de las Ünits
            </Typography>
            {content.concepts.map((concept: any, index: number) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <CardContent sx={{ pb: '16px !important' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {concept.term}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {concept.definition}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    💡 Ejemplo: {concept.example}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 'ayni_balance':
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
              {content.philosophy}
            </Typography>

            <Typography variant="h6" gutterBottom>
              📊 Indicadores de Balance Ayni
            </Typography>

            {content.indicators.map((indicator: any, index: number) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  border: `2px solid ${theme.palette[indicator.color].main}`,
                  bgcolor: alpha(theme.palette[indicator.color].main, 0.05)
                }}
              >
                <CardContent sx={{ pb: '16px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={indicator.range}
                      color={indicator.color}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="h6" color={`${indicator.color}.main`}>
                      {indicator.status}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {indicator.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 'trust_system':
        return (
          <Box sx={{ py: 2 }}>
            <Grid container spacing={2}>
              {content.components.map((component: any, index: number) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {component.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {component.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🎯 {component.impact}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'action_steps':
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🎯 Tus Próximos Pasos
            </Typography>
            {content.steps.map((step: any, index: number) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  background: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  position: 'relative'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'success.main',
                        mr: 2,
                        fontSize: '1rem'
                      }}
                    >
                      {step.priority}
                    </Avatar>
                    <Typography variant="h6" color="success.main">
                      {step.action}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    {step.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    {step.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      default:
        return null;
    }
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
          minHeight: '70vh'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header con progress */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary">
            Guía LETS CoomÜnity
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 3,
            height: 8,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }}
        />

        {/* Step indicator */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Paso {currentStep + 1} de {onboardingSteps.length}
        </Typography>

        {/* Content */}
        <DialogContent sx={{ px: 0, pt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                mr: 2,
                width: 56,
                height: 56
              }}
            >
              {currentStepData.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {currentStepData.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentStepData.description}
              </Typography>
            </Box>
          </Box>

          {renderStepContent()}
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ justifyContent: 'space-between', pt: 3 }}>
          <Button
            onClick={handleSkip}
            color="inherit"
          >
            Saltar Tutorial
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outlined"
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={currentStep === onboardingSteps.length - 1 ? <CheckCircle /> : <PlayArrow />}
            >
              {currentStep === onboardingSteps.length - 1 ? 'Completar' : 'Siguiente'}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LetsOnboarding;
