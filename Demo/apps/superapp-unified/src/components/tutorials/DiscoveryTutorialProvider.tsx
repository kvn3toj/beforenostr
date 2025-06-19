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
  Chip,
  Alert,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  PlayArrow as StartIcon,
  CheckCircle as CheckIcon,
  Lightbulb as TipIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// 🎓 Tipos para los tutoriales
interface TutorialStep {
  id: string;
  title: string;
  content: string;
  component?: string;
  action?: string;
  highlightSelector?: string;
  type?: 'info' | 'warning' | 'success' | 'tip' | 'interactive';
  tips?: string[];
  actionButton?: {
    text: string;
    url?: string;
    action?: () => void;
  };
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
  completionRewards?: {
    ondas: number;
    meritos: number;
    description: string;
  };
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

// 🎯 TUTORIALES DISCOVERY EXPANDIDOS PROFUNDAMENTE
const DISCOVERY_TUTORIALS: Tutorial[] = [
  {
    id: 'marketplace-discovery',
    title: '🛒 Discovery Marketplace (GMP)',
    description: 'Descubre el Gamified Match Place: tu espacio de intercambio basado en Ayni',
    category: 'marketplace',
    difficulty: 'beginner',
    estimatedTime: '12-15 minutos',
    completionRewards: {
      ondas: 25,
      meritos: 5,
      description: 'Has completado tu primer paso hacia convertirte en Emprendedor Confiable'
    },
    steps: [
      {
        id: 'marketplace-philosophy',
        title: '🌟 Filosofía del Marketplace',
        content: 'El Marketplace de CoomÜnity no es como cualquier tienda online. Está basado en el principio andino de AYNI (reciprocidad balanceada), donde cada intercambio debe beneficiar a ambas partes y al Bien Común.',
        type: 'info',
        tips: [
          'Ayni significa "hoy por ti, mañana por mí" - reciprocidad perfecta',
          'Cada transacción genera Mëritos para ambas partes',
          'Los precios se miden en Lükas, no en dinero tradicional'
        ]
      },
      {
        id: 'marketplace-types',
        title: '🏪 Tipos de Intercambio',
        content: 'En el GMP puedes intercambiar: PRODUCTOS físicos (artesanías, orgánicos, arte), SERVICIOS profesionales (consultoría, diseño, desarrollo), EXPERIENCIAS transformacionales (talleres, retiros, mentorías) y CONOCIMIENTO especializado (cursos, coaching, healing).',
        type: 'success',
        tips: [
          'Productos: Items tangibles que puedes tocar y enviar',
          'Servicios: Tu tiempo y habilidades aplicadas',
          'Experiencias: Momentos únicos de transformación',
          'Conocimiento: Sabiduría que puede cambiar vidas'
        ]
      },
      {
        id: 'marketplace-navigation',
        title: '🧭 Navegación Inteligente',
        content: 'Aprende a navegar el marketplace de manera eficiente usando filtros por categoría, rango de Lükas, nivel de confianza del vendedor, y proximidad geográfica.',
        highlightSelector: '.marketplace-nav',
        type: 'interactive',
        actionButton: {
          text: 'Explorar Categorías',
          url: '/marketplace'
        }
      },
      {
        id: 'marketplace-trust-system',
        title: '🤝 Sistema de Confianza',
        content: 'La confianza en CoomÜnity se construye through: Mëritos acumulados, validaciones de otros miembros, historial de transacciones exitosas, y status de "Emprendedor Confiable" otorgado por la comunidad.',
        type: 'warning',
        tips: [
          'Revisa SIEMPRE los Mëritos del vendedor antes de comprar',
          'Lee los comentarios de otros compradores',
          'Los Emprendedores Confiables tienen un sello especial',
          'Tu primera compra genera más Mëritos si es exitosa'
        ]
      },
      {
        id: 'marketplace-lukas-economy',
        title: '💰 Economía de Lükas',
        content: 'Los Lükas son la moneda de CoomÜnity. Los ganas completando videos en ÜPlay (10-50 por video), participando en Trust Voting (5 por voto), haciendo transacciones exitosas (2-5% de comisión), y contribuyendo a la comunidad.',
        type: 'tip',
        tips: [
          'Empieza con videos ÜPlay para ganar tus primeros Lükas',
          'Los precios van desde 10 Lükas (items pequeños) hasta 1000+ (servicios premium)',
          'Cada Lüka gastado debe generar valor real en tu vida',
          'Reinvierte tus ganancias para hacer crecer el ecosistema'
        ]
      },
      {
        id: 'marketplace-first-purchase',
        title: '🛍️ Tu Primera Compra',
        content: 'Para tu primera compra, busca productos de bajo riesgo (10-50 Lükas) de vendedores con buenos Mëritos. Lee las descripciones cuidadosamente, verifica la política de Ayni del vendedor, y no olvides calificar después de recibir.',
        type: 'interactive',
        actionButton: {
          text: 'Ver Productos Recomendados'
        },
        tips: [
          'Comienza con productos digitales para entrega inmediata',
          'Pregunta al vendedor si tienes dudas ANTES de comprar',
          'Guarda evidencia de la transacción',
          'Califica honestamente para ayudar a otros'
        ]
      },
      {
        id: 'marketplace-becoming-seller',
        title: '🚀 Convertirse en Vendedor',
        content: 'Para vender necesitas: completar tu perfil con skills y experiencia, subir tu primer producto/servicio con fotos y descripción detallada, solicitar validación inicial de 3 miembros, y mantener un ratio Ayni balanceado.',
        type: 'success',
        tips: [
          'Tu primer producto debe resolver un problema real',
          'Fotografías de calidad aumentan la confianza',
          'Describe BENEFICIOS, no solo características',
          'Responde preguntas rápidamente para generar confianza'
        ]
      },
      {
        id: 'marketplace-community-impact',
        title: '🌍 Impacto en la Comunidad',
        content: 'Cada intercambio en el marketplace contribuye al Bien Común: genera empleos dignos, reduce la dependencia del sistema económico tradicional, fortalece comunidades locales, y creates círculos virtuosos de abundancia.',
        type: 'info',
        tips: [
          'Prioriza vendedores de tu región cuando sea posible',
          'Comparte productos que te gustaron en redes sociales',
          'Invita artesanos locales a unirse al marketplace',
          'Participa en ferias y eventos de intercambio'
        ]
      }
    ]
  },
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
    title: '💰 Discovery Wallet & TOINS',
    description: 'Domina el sistema dual de monedas: Lükas y TOINS',
    category: 'wallet',
    difficulty: 'intermediate',
    estimatedTime: '12-15 minutos',
    completionRewards: {
      ondas: 35,
      meritos: 8,
      description: 'Has dominado el sistema monetario dual de CoomÜnity. ¡Ahora puedes usar tanto Lükas como TOINS con confianza!'
    },
    steps: [
      {
        id: 'wallet-intro',
        title: 'Tu Wallet CoomÜnity',
        content: '¡Bienvenido a tu wallet CoomÜnity! Aquí gestionas todos tus recursos: Lükas, TOINS, Mëritos y tu balance Ayni. Es el corazón financiero de tu experiencia en la plataforma.',
        type: 'info',
        component: 'WalletMain',
        tips: [
          'Tu wallet es seguro y está protegido por blockchain',
          'Todas las transacciones siguen el principio de Ayni (reciprocidad)',
          'Puedes verificar tu historial completo en cualquier momento'
        ]
      },
      {
        id: 'lukas-explanation',
        title: '🌟 Lükas: La Moneda Principal',
        content: 'Los Lükas son la moneda principal de CoomÜnity, inspirada en la filosofía del Bien Común. Se ganan contribuyendo valor a la comunidad y se usan para intercambios cotidianos.',
        type: 'success',
        tips: [
          'Ganas Lükas completando videos interactivos en ÜPlay',
          'Recibes Lükas por ayudar a otros miembros de la comunidad',
          'Los Lükas representan tu contribución al Bien Común',
          'Se pueden usar en el Marketplace para productos y servicios'
        ],
        actionButton: {
          text: '💰 Ver Balance de Lükas',
          action: () => console.log('Navegando a balance de Lükas')
        }
      },
      {
        id: 'toins-introduction',
        title: '🪙 TOINS: La Moneda Complementaria',
        content: 'Las TOINS son la moneda complementaria que enriquece el ecosistema económico de CoomÜnity. Funcionan junto a los Lükas para crear un sistema monetario más resiliente y justo.',
        type: 'tip',
        tips: [
          'TOINS significa "Tokens de Intercambio Nutritivo Sostenible"',
          'Se obtienen a través de intercambios especiales y colaboraciones profundas',
          'Representan valor agregado y contribuciones extraordinarias',
          'Permiten acceso a experiencias y productos premium'
        ]
      },
      {
        id: 'dual-currency-system',
        title: '⚖️ Sistema Dual: Lükas + TOINS',
        content: 'El sistema dual de monedas crea un ecosistema económico más robusto. Mientras los Lükas cubren intercambios cotidianos, las TOINS facilitan transacciones especiales y colaboraciones profundas.',
        type: 'info',
        tips: [
          'Algunos productos aceptan solo Lükas, otros solo TOINS, algunos ambos',
          'Las TOINS tienen mayor valor para experiencias transformadoras',
          'El ratio Lükas:TOINS puede variar según la oferta y demanda',
          'Ambas monedas siguen los principios de economía colaborativa'
        ],
        actionButton: {
          text: '📊 Ver Conversión Lükas/TOINS',
          action: () => console.log('Mostrando tabla de conversión')
        }
      },
      {
        id: 'earning-toins',
        title: '🌱 Cómo Ganar TOINS',
        content: 'Las TOINS se ganan a través de contribuciones especiales que van más allá de lo cotidiano. Son recompensas por impacto extraordinario en la comunidad.',
        type: 'interactive',
        tips: [
          'Facilitar conexiones entre miembros (matchmaking consciente)',
          'Crear contenido educativo que transforme vidas',
          'Liderar proyectos colaborativos del Bien Común',
          'Mentorear a nuevos miembros durante su onboarding',
          'Resolver conflictos comunitarios con sabiduría',
          'Innovar en soluciones para la plataforma'
        ]
      },
      {
        id: 'using-toins',
        title: '✨ Usando TOINS Sabiamente',
        content: 'Las TOINS te dan acceso a experiencias transformadoras, productos premium y oportunidades de crecimiento personal y comunitario que van más allá del intercambio cotidiano.',
        type: 'success',
        tips: [
          'Retiros de mindfulness y crecimiento personal',
          'Sesiones de coaching uno-a-uno con mentores',
          'Acceso anticipado a nuevas funcionalidades',
          'Productos artesanales únicos de la comunidad',
          'Experiencias inmersivas en la naturaleza',
          'Cursos avanzados de desarrollo personal'
        ],
        actionButton: {
          text: '🛒 Explorar Productos Premium',
          action: () => console.log('Navegando a marketplace premium')
        }
      },
      {
        id: 'ayni-integration',
        title: '🔄 TOINS y el Principio Ayni',
        content: 'Las TOINS están profundamente integradas con el principio Ayni de reciprocidad. Cada TOIN representa un compromiso con dar y recibir en equilibrio consciente.',
        type: 'tip',
        tips: [
          'Al gastar TOINS, considera cómo estás contribuyendo al ecosistema',
          'Al recibir TOINS, reflexiona sobre el valor que has aportado',
          'El flujo de TOINS debe mantener el equilibrio Ayni',
          'Las TOINS conectan tu prosperidad con la del colectivo'
        ]
      },
      {
        id: 'wallet-mastery',
        title: '🎓 Maestría del Wallet',
        content: '¡Felicitaciones! Ahora comprendes el sistema monetario dual de CoomÜnity. Usar Lükas y TOINS conscientemente te convierte en un participante avanzado del ecosistema.',
        type: 'success',
        component: 'WalletMain',
        tips: [
          'Revisa regularmente tus balances y transacciones',
          'Planifica tus intercambios considerando ambas monedas',
          'Usa TOINS para experiencias que generen crecimiento',
          'Mantén el equilibrio Ayni en todas tus transacciones',
          'Comparte tu conocimiento con nuevos miembros'
        ],
        actionButton: {
          text: '🎯 Completar Tutorial',
          action: () => console.log('Tutorial de TOINS completado exitosamente')
        }
      }
    ],
  },
];

// Función helper para renderizar contenido con mejor formato
const renderStepContent = (step: TutorialStep) => {
  const getStepIcon = () => {
    switch (step.type) {
      case 'warning': return <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />;
      case 'success': return <CheckIcon sx={{ color: '#4caf50', mr: 1 }} />;
      case 'tip': return <TipIcon sx={{ color: '#2196f3', mr: 1 }} />;
      case 'interactive': return <StartIcon sx={{ color: '#9c27b0', mr: 1 }} />;
      default: return <InfoIcon sx={{ color: '#ffffff', mr: 1 }} />;
    }
  };

  const getAlertSeverity = () => {
    switch (step.type) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'tip': return 'info';
      default: return 'info';
    }
  };

  return (
    <Box>
      <Alert
        severity={getAlertSeverity()}
        icon={getStepIcon()}
        sx={{
          mb: 2,
          '& .MuiAlert-message': { width: '100%' },
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white'
        }}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          {step.content}
        </Typography>
      </Alert>

      {step.tips && step.tips.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontWeight: 600 }}>
            💡 Tips Clave:
          </Typography>
          <List dense>
            {step.tips.map((tip, index) => (
              <ListItem key={index} sx={{ py: 0.5, pl: 2 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Typography sx={{ color: '#ffd700', fontSize: '12px' }}>•</Typography>
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {tip}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {step.actionButton && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<StartIcon />}
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252, #ffeb3b)',
              }
            }}
          >
            {step.actionButton.text}
          </Button>
        </Box>
      )}

      {step.component && (
        <Chip
          label={`🎯 Enfoque: ${step.component}`}
          size="small"
          sx={{
            mt: 2,
            color: 'white',
            borderColor: 'white',
            background: 'rgba(255,255,255,0.1)'
          }}
          variant="outlined"
        />
      )}
    </Box>
  );
};

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
      localStorage.setItem(`coomunity-tutorial-${tutorialId}-started`, new Date().toISOString());
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
    if (currentTutorial && currentStep === currentTutorial.steps.length - 1) {
      // Tutorial completado
      localStorage.setItem(`coomunity-tutorial-${currentTutorial.id}-completed`, new Date().toISOString());

      // Simular recompensa (en implementación real, esto sería una llamada API)
      if (currentTutorial.completionRewards) {
        console.log('🎉 Tutorial completado!', currentTutorial.completionRewards);
      }
    }

    setIsActive(false);
    setCurrentTutorial(null);
    setCurrentStep(0);
  }, [currentTutorial, currentStep]);

  // Auto-mostrar tutorial de onboarding para nuevos usuarios
  useEffect(() => {
    const hasSeenTutorials = localStorage.getItem('coomunity-tutorials-seen');
    if (!hasSeenTutorials) {
      // Mostrar tutorial después de 3 segundos
      const timer = setTimeout(() => {
        startTutorial('marketplace-discovery');
        localStorage.setItem('coomunity-tutorials-seen', 'true');
      }, 3000);

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

  const currentStepData = currentTutorial?.steps[currentStep];
  const isLastStep = currentTutorial && currentStep === currentTutorial.steps.length - 1;

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}

      {/* Dialog del Tutorial Expandido */}
      {currentTutorial && (
        <Dialog
          open={isActive}
          onClose={closeTutorial}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'visible',
              minHeight: '70vh'
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  {currentTutorial.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
                  {currentTutorial.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={currentTutorial.difficulty}
                    size="small"
                    sx={{
                      background: currentTutorial.difficulty === 'beginner' ? '#4caf50' :
                                 currentTutorial.difficulty === 'intermediate' ? '#ff9800' : '#f44336',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={currentTutorial.estimatedTime}
                    size="small"
                    sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
            </Box>
            <IconButton onClick={closeTutorial} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
                {currentTutorial.steps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel sx={{
                      '& .MuiStepLabel-label': {
                        color: 'white !important',
                        fontSize: '0.9rem',
                        fontWeight: index === currentStep ? 600 : 400
                      },
                      '& .MuiStepIcon-root': {
                        color: 'rgba(255,255,255,0.5)',
                        '&.Mui-active': {
                          color: '#ffd700'
                        },
                        '&.Mui-completed': {
                          color: '#4caf50'
                        }
                      }
                    }}>
                      {step.title}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Fade in key={currentStep}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {currentStepData && renderStepContent(currentStepData)}
                  </CardContent>
                </Card>
              </Fade>

              {/* Información de recompensas en el último paso */}
              {isLastStep && currentTutorial.completionRewards && (
                <Card sx={{
                  mt: 3,
                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      🎉 ¡Recompensas por Completar!
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip
                        label={`+${currentTutorial.completionRewards.ondas} Öndas`}
                        sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                      />
                      <Chip
                        label={`+${currentTutorial.completionRewards.meritos} Mëritos`}
                        sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="body2">
                      {currentTutorial.completionRewards.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{
            justifyContent: 'space-between',
            p: 3,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <Button
              onClick={previousStep}
              disabled={currentStep === 0}
              startIcon={<BackIcon />}
              sx={{ color: 'white', opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              Anterior
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Paso {currentStep + 1} de {currentTutorial.steps.length}
              </Typography>
              <Box sx={{
                width: 100,
                height: 4,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: `${((currentStep + 1) / currentTutorial.steps.length) * 100}%`,
                  height: '100%',
                  background: '#ffd700',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>

            {!isLastStep ? (
              <Button
                onClick={nextStep}
                endIcon={<NextIcon />}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #ffd700, #ffeb3b)',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffc107, #ffeb3b)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={closeTutorial}
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049, #7cb342)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                ¡Completar Tutorial!
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
