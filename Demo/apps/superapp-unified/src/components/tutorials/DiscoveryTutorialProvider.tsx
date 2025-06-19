import React, { useState, useContext, createContext, useCallback, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  IconButton,
  Fade,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon,
  School as SchoolIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';

// 🎓 Tipos para los tutoriales
interface TutorialStep {
  id: string;
  title: string;
  content: string;
  component?: string;
  action?: string;
  highlightSelector?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'marketplace' | 'social' | 'uplay' | 'wallet' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
  prerequisites?: string[];
}

interface TutorialContextType {
  currentTutorial: Tutorial | null;
  isActive: boolean;
  currentStep: number;
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  closeTutorial: () => void;
  availableTutorials: Tutorial[];
}

const TutorialContext = createContext<TutorialContextType | null>(null);

// 🎯 TUTORIALES DISCOVERY PREDEFINIDOS
const DISCOVERY_TUTORIALS: Tutorial[] = [
  {
    id: 'console-discovery',
    title: '🎛️ Discovery Console CoomÜnity',
    description: 'Aprende a usar la consola de desarrollo y herramientas avanzadas',
    category: 'advanced',
    difficulty: 'intermediate',
    estimatedTime: '10-15 minutos',
    steps: [
      {
        id: 'console-intro',
        title: 'Introducción a la Consola',
        content: 'La consola de desarrollo de CoomÜnity te permite acceder a herramientas avanzadas y datos en tiempo real.',
        component: 'DevConsole',
      },
      {
        id: 'console-commands',
        title: 'Comandos Básicos',
        content: 'Aprende los comandos esenciales para navegar y obtener información del sistema.',
        action: 'open-console',
      },
    ],
  },
  {
    id: 'marketplace-discovery',
    title: '🛒 Discovery Marketplace',
    description: 'Descubre cómo funciona el marketplace colaborativo de CoomÜnity',
    category: 'marketplace',
    difficulty: 'beginner',
    estimatedTime: '8-12 minutos',
    steps: [
      {
        id: 'marketplace-intro',
        title: 'Bienvenido al Marketplace',
        content: 'El Marketplace de CoomÜnity es un espacio de intercambio basado en principios de Ayni.',
        component: 'MarketplaceMain',
      },
      {
        id: 'marketplace-navigation',
        title: 'Navegación',
        content: 'Aprende a navegar entre productos y servicios de manera eficiente.',
        highlightSelector: '.marketplace-nav',
      },
    ],
  },
  {
    id: 'social-discovery',
    title: '👥 Discovery Social',
    description: 'Explora las funcionalidades sociales y de comunidad',
    category: 'social',
    difficulty: 'beginner',
    estimatedTime: '6-10 minutos',
    steps: [
      {
        id: 'social-intro',
        title: 'Comunidad CoomÜnity',
        content: 'Descubre cómo conectar con otros miembros y formar círculos de confianza.',
        component: 'SocialMain',
      },
    ],
  },
  {
    id: 'uplay-discovery',
    title: '🎮 Discovery ÜPlay',
    description: 'Aprende a usar el reproductor gamificado interactivo',
    category: 'uplay',
    difficulty: 'beginner',
    estimatedTime: '7-12 minutos',
    steps: [
      {
        id: 'uplay-intro',
        title: 'ÜPlay Gamificado',
        content: 'ÜPlay es tu reproductor de video interactivo con elementos de gamificación.',
        component: 'UPlayMain',
      },
    ],
  },
  {
    id: 'wallet-discovery',
    title: '💰 Discovery Wallet',
    description: 'Gestiona tus Lükas y balance Ayni',
    category: 'wallet',
    difficulty: 'beginner',
    estimatedTime: '5-8 minutos',
    steps: [
      {
        id: 'wallet-intro',
        title: 'Tu Wallet CoomÜnity',
        content: 'Aprende a gestionar tus Lükas, Mëritos y balance Ayni.',
        component: 'WalletMain',
      },
    ],
  },
];

export const DiscoveryTutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startTutorial = useCallback((tutorialId: string) => {
    const tutorial = DISCOVERY_TUTORIALS.find(t => t.id === tutorialId);
    if (tutorial) {
      setCurrentTutorial(tutorial);
      setCurrentStep(0);
      setIsActive(true);
      
      // Guardar progreso en localStorage
      localStorage.setItem('coomunity-last-tutorial', tutorialId);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentTutorial && currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentTutorial, currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const closeTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentTutorial(null);
    setCurrentStep(0);
  }, []);

  // Auto-mostrar tutorial de onboarding para nuevos usuarios
  useEffect(() => {
    const hasSeenTutorials = localStorage.getItem('coomunity-tutorials-seen');
    if (!hasSeenTutorials) {
      // Mostrar tutorial después de 2 segundos
      const timer = setTimeout(() => {
        startTutorial('marketplace-discovery');
        localStorage.setItem('coomunity-tutorials-seen', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [startTutorial]);

  const contextValue: TutorialContextType = {
    currentTutorial,
    isActive,
    currentStep,
    startTutorial,
    nextStep,
    previousStep,
    closeTutorial,
    availableTutorials: DISCOVERY_TUTORIALS,
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
      
      {/* Dialog del Tutorial */}
      {currentTutorial && (
        <Dialog
          open={isActive}
          onClose={closeTutorial}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'visible'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            pb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon />
              <Typography variant="h6" component="span">
                {currentTutorial.title}
              </Typography>
            </Box>
            <IconButton onClick={closeTutorial} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
                {currentTutorial.steps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'white !important' } }}>
                      {step.title}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Fade in key={currentStep}>
                <Card sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      {currentTutorial.steps[currentStep]?.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {currentTutorial.steps[currentStep]?.content}
                    </Typography>
                    
                    {currentTutorial.steps[currentStep]?.component && (
                      <Chip 
                        label={`Componente: ${currentTutorial.steps[currentStep].component}`}
                        size="small"
                        sx={{ mt: 2, color: 'white', borderColor: 'white' }}
                        variant="outlined"
                      />
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button
              onClick={previousStep}
              disabled={currentStep === 0}
              startIcon={<BackIcon />}
              sx={{ color: 'white' }}
            >
              Anterior
            </Button>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {currentStep + 1} de {currentTutorial.steps.length}
            </Typography>
            
            {currentStep < currentTutorial.steps.length - 1 ? (
              <Button
                onClick={nextStep}
                endIcon={<NextIcon />}
                variant="contained"
                sx={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.3)' }
                }}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={closeTutorial}
                variant="contained"
                sx={{ 
                  background: '#4caf50',
                  color: 'white',
                  '&:hover': { background: '#45a049' }
                }}
              >
                ¡Completado!
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </TutorialContext.Provider>
  );
};

export const useDiscoveryTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useDiscoveryTutorial must be used within DiscoveryTutorialProvider');
  }
  return context;
};

export default DiscoveryTutorialProvider;
