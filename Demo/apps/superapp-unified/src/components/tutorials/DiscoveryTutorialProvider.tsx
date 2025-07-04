import React, { useState, useContext, createContext, useCallback, useEffect, useTransition } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  Grid,
  StepConnector,
  StepIconProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  PlayArrow as StartIcon,
  CheckCircle as CheckIcon,
  Lightbulb as TipIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Check,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useGuardianColors } from '../theme/GuardianColorProvider';

// 🎨 EXPORTACIÓN GLOBAL para compatibilidad con colorSystem legacy
// Esta definición está disponible para importación desde otros componentes si es necesario
export const createColorSystemFromPalette = (palette: any) => ({
  primary: palette.primary,
  secondary: palette.secondary,
  accent: palette.accent,
  mystic: palette.mystic,
  ether: palette.mystic, // ether se mapea a mystic
  bgPrimary: palette.background,
  neutral: palette.neutral
});

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
            description: 'Descubre el Gamified Match Place: tu espacio de intercambio basado en Reciprocidad',
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
        content: 'El Marketplace de CoomÜnity no es como cualquier tienda online. Está basado en el principio de RECIPROCIDAD balanceada, donde cada intercambio debe beneficiar a ambas partes y al Bien Común.',
        type: 'info',
        tips: [
          'Reciprocidad significa "hoy por ti, mañana por mí" - intercambio perfecto',
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
        content: 'Para tu primera compra, busca productos de bajo riesgo (10-50 Lükas) de vendedores con buenos Mëritos. Lee las descripciones cuidadosamente, verifica la política de Reciprocidad del vendedor, y no olvides calificar después de recibir.',
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
        content: 'Para vender necesitas: completar tu perfil con skills y experiencia, subir tu primer producto/servicio con fotos y descripción detallada, solicitar validación inicial de 3 miembros, y mantener un ratio Reciprocidad balanceado.',
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
    title: '👥 Discovery Social & Comunidad',
    description: 'Descubre la filosofía comunitaria de CoomÜnity y los círculos de confianza',
    category: 'social',
    difficulty: 'intermediate',
    estimatedTime: '12-15 minutos',
    completionRewards: {
      ondas: 30,
      meritos: 6,
      description: 'Has aprendido los fundamentos de la comunidad CoomÜnity. ¡Ahora puedes construir círculos de confianza!'
    },
    steps: [
      {
        id: 'social-bien-comun',
        title: '🌍 Filosofía del Bien Común',
        content: 'En CoomÜnity, el Bien Común es nuestro norte. Cada acción social debe beneficiar no solo a los individuos, sino a toda la comunidad. Esto significa priorizar la colaboración sobre la competencia.',
        type: 'info',
        component: 'SocialMain',
        tips: [
          'El Bien Común se manifiesta cuando ayudamos a otros sin esperar nada a cambio',
          'Cada interacción social debe nutrir la abundancia colectiva',
          'La prosperidad individual está conectada con la prosperidad comunitaria',
          'Practicamos la escucha empática y la comunicación no violenta'
        ],
        actionButton: {
          text: '🤝 Explorar Comunidad',
          url: '/social'
        }
      },
      {
        id: 'social-circulos-confianza',
        title: '🔗 Círculos de Confianza',
        content: 'Los círculos de confianza son la base de la comunidad CoomÜnity. Se forman a través de interacciones genuinas, validaciones mutuas y contribuciones consistentes al Bien Común.',
        type: 'success',
        tips: [
          'La confianza se construye con acciones pequeñas y consistentes',
          'Cada miembro puede validar a otros a través del Trust Voting',
          'Los círculos se expanden orgánicamente basados en afinidad y valores',
          'La confianza se mide en Mëritos ganados por contribuciones reales'
        ],
        actionButton: {
          text: '🗳️ Explorar Trust Voting',
          action: () => console.log('Navegando a sistema de Trust Voting')
        }
      },
      {
        id: 'social-comunicacion-consciente',
        title: '💬 Comunicación Consciente',
        content: 'En CoomÜnity practicamos la comunicación consciente: escucha empática, expresión auténtica, y construcción de puentes en lugar de muros. Cada conversación es una oportunidad de co-crear.',
        type: 'interactive',
        tips: [
          'Escuchamos para comprender, no para responder o juzgar',
          'Expresamos nuestras necesidades sin atacar a otros',
          'Buscamos puntos de conexión antes que diferencias',
          'Celebramos la diversidad de perspectivas como riqueza colectiva',
          'Usamos "yo" en lugar de "tú" para expresar nuestros sentimientos'
        ],
        actionButton: {
          text: '💬 Iniciar Conversación',
          url: '/social?tab=messages'
        }
      },
      {
        id: 'social-trust-voting',
        title: '🗳️ Trust Voting y Mëritos Sociales',
        content: 'El Trust Voting es nuestro sistema de validación peer-to-peer. Los miembros se validan mutuamente basándose en contribuciones reales al Bien Común, generando Mëritos que reflejan la confianza de la comunidad.',
        type: 'tip',
        tips: [
          'Votas por miembros que han contribuido genuinamente al Bien Común',
          'Cada voto otorga Mëritos al receptor y al votante',
          'Los Mëritos reflejan tu reputación y confiabilidad en la comunidad',
          'El sistema previene manipulación a través de algoritmos de consenso',
          'La validación debe basarse en evidencia concreta, no en popularidad'
        ],
        actionButton: {
          text: '⚖️ Participar en Votación',
          action: () => console.log('Abriendo sistema de Trust Voting')
        }
      },
      {
        id: 'social-colaboracion-proyectos',
        title: '🤝 Colaboración en Proyectos',
        content: 'Los proyectos colaborativos son el corazón de CoomÜnity. Desde proyectos locales hasta iniciativas globales, cada colaboración fortalece el tejido comunitario y genera valor para el Bien Común.',
        type: 'success',
        tips: [
          'Únete a proyectos que resuenen con tu propósito y habilidades',
          'Inicia proyectos que aborden necesidades reales de tu comunidad',
          'La diversidad de talentos enriquece cada proyecto colaborativo',
          'Cada proyecto exitoso genera Mëritos para todos los participantes',
          'Documenta y comparte los aprendizajes para futuras colaboraciones'
        ],
        actionButton: {
          text: '🚀 Ver Proyectos Activos',
          url: '/social?tab=projects'
        }
      },
      {
        id: 'social-construccion-local',
        title: '🏘️ Construcción de Comunidad Local',
        content: 'CoomÜnity se manifiesta también en lo local. Facilitamos la conexión entre vecinos, la creación de redes de apoyo mutuo, y el fortalecimiento de las economías locales a través de intercambios justos.',
        type: 'info',
        tips: [
          'Conecta con miembros de tu área geográfica',
          'Organiza encuentros locales y eventos comunitarios',
          'Apoya negocios y emprendimientos de tu zona',
          'Crea redes de intercambio de recursos y conocimientos',
          'Participa en iniciativas de mejoramiento del espacio común'
        ],
        actionButton: {
          text: '📍 Encontrar Comunidad Local',
          url: '/social?filter=local'
        }
      },
      {
        id: 'social-impacto-transformacion',
        title: '🌟 Impacto Social y Transformación',
        content: '¡Felicitaciones! Ahora comprendes cómo CoomÜnity transforma las relaciones humanas. Al practicar estos principios, contribuyes a crear un mundo más colaborativo, justo y abundante para todos.',
        type: 'success',
        component: 'SocialMain',
        tips: [
          'Cada acción social consciente crea ondas de transformación',
          'Tu crecimiento personal es inseparable del crecimiento comunitario',
          'Los principios que aprendes aquí se extienden a toda tu vida',
          'Eres parte de un movimiento global hacia la cooperación consciente',
          'Comparte estos aprendizajes con otros para multiplicar el impacto'
        ],
        actionButton: {
          text: '🎯 Completar Tutorial',
          action: () => console.log('Tutorial Social Discovery completado exitosamente')
        }
      }
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
        content: '¡Bienvenido a tu wallet CoomÜnity! Aquí gestionas todos tus recursos: Lükas, TOINS, Mëritos y tu balance Reciprocidad. Es el corazón financiero de tu experiencia en la plataforma.',
        type: 'info',
        component: 'WalletMain',
        tips: [
          'Tu wallet es seguro y está protegido por blockchain',
          'Todas las transacciones siguen el principio de Reciprocidad (reciprocidad)',
          'Puedes verificar tu historial completo en cualquier momento'
        ],
        actionButton: {
          text: '👀 Abrir Mi Wallet',
          url: '/wallet'
        }
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
        ],
        actionButton: {
          text: '📊 Ver Balance TOINS',
          action: () => console.log('Mostrando balance específico de TOINS')
        }
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
        ],
        actionButton: {
          text: '🚀 Explorar Oportunidades',
          url: '/social'
        }
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
        id: 'reciprocidad-integration',
        title: '🔄 TOINS y el Principio de Reciprocidad',
        content: 'Las TOINS están profundamente integradas con el principio de Reciprocidad. Cada TOIN representa un compromiso con dar y recibir en equilibrio consciente.',
        type: 'tip',
        tips: [
          'Al gastar TOINS, considera cómo estás contribuyendo al ecosistema',
          'Al recibir TOINS, reflexiona sobre el valor que has aportado',
          'El flujo de TOINS debe mantener el equilibrio de Reciprocidad',
          'Las TOINS conectan tu prosperidad con la del colectivo'
        ],
        actionButton: {
                      text: '⚖️ Evaluar Mi Balance de Reciprocidad',
            action: () => console.log('Evaluando balance personal de Reciprocidad')
        }
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
          'Mantén el equilibrio de Reciprocidad en todas tus transacciones',
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

// Estilos y componentes personalizados para el nuevo diseño
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.divider,
    borderLeftWidth: 2,
    marginLeft: '10px',
  },
}));

const CustomStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.divider,
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.palette.primary.main,
    }),
    '& .QontoStepIcon-completedIcon': {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 24,
    },
    '& .QontoStepIcon-circle': {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }),
);

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <CustomStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </CustomStepIconRoot>
  );
}

export const DiscoveryTutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  // 🎨 INTEGRACIÓN GUARDIAN COLORS para mejor contraste y legibilidad
  const { currentTheme, palette, getElementColor, getConceptColor } = useGuardianColors();

  // Helper para crear gradientes basados en la paleta actual
  const createGradient = (style: string) => {
    switch (style) {
      case 'cosmic':
        return `linear-gradient(135deg, ${palette.primary}, ${palette.mystic})`;
      case 'primary':
        return `linear-gradient(45deg, ${palette.primary}, ${palette.accent})`;
      case 'secondary':
        return `linear-gradient(45deg, ${palette.secondary}, ${palette.mystic})`;
      case 'reciprocidad':
        return `linear-gradient(135deg, ${getConceptColor('reciprocidad')}, ${palette.accent})`;
      default:
        return `linear-gradient(45deg, ${palette.primary}, ${palette.secondary})`;
    }
  };

  // Mapeo temporal para compatibilidad con colorSystem legacy
  const colorSystem = {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    mystic: palette.mystic,
    ether: palette.mystic, // ether se mapea a mystic
    bgPrimary: palette.background,
    neutral: palette.neutral
  };

  // Helper para getGradient legacy
  const getGradient = createGradient;

  const availableTutorials = DISCOVERY_TUTORIALS;

  const startTutorial = useCallback((tutorialId: string) => {
    const tutorialToStart = availableTutorials.find(t => t.id === tutorialId);
    if (tutorialToStart) {
      setCurrentTutorial(tutorialToStart);
      setCurrentStep(0);
      setIsActive(true);

      localStorage.setItem('coomunity-last-tutorial', tutorialId);
      localStorage.setItem(`coomunity-tutorial-${tutorialId}-started`, new Date().toISOString());

    } else {
      console.warn(`Tutorial with ID '${tutorialId}' not found.`);
    }
  }, [availableTutorials]);

  const closeTutorial = useCallback(() => {
    if (currentTutorial && currentStep === currentTutorial.steps.length - 1) {
      localStorage.setItem(`coomunity-tutorial-${currentTutorial.id}-completed`, new Date().toISOString());

      if (currentTutorial.completionRewards) {
        console.log('🎉 Tutorial completado!', currentTutorial.completionRewards);
      }
    }
    setIsActive(false);
    setCurrentTutorial(null);
    setCurrentStep(0);
  }, [currentTutorial, currentStep]);

  const nextStep = useCallback(() => {
    if (currentTutorial && currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      closeTutorial();
    }
  }, [currentTutorial, currentStep, closeTutorial]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    if (loading) return;

    const marketplaceTutorialId = 'marketplace-discovery';
    const hasCompletedMarketplaceTutorial = localStorage.getItem(`coomunity-tutorial-${marketplaceTutorialId}-completed`);

    if (isAuthenticated && location.pathname === '/marketplace' && !currentTutorial && !isActive && !hasCompletedMarketplaceTutorial) {
      startTransition(() => {
        startTutorial(marketplaceTutorialId);
      });
    }
  }, [isAuthenticated, location.pathname, startTutorial, loading]);

  useEffect(() => {
    const step = currentTutorial?.steps[currentStep];
    if (isActive && step?.actionButton?.url && location.pathname !== step.actionButton.url) {
      closeTutorial();
    }
  }, [isActive, currentTutorial, currentStep, location.pathname, closeTutorial]);

  const currentStepData = currentTutorial ? currentTutorial.steps[currentStep] : null;

  const renderStepContent = () => {
    if (!currentTutorial || !isActive) return null;
    const step = currentTutorial.steps[currentStep];

    const getStepIcon = () => {
      switch (step.type) {
        case 'tip': return <TipIcon color="secondary" />;
        case 'success': return <CheckIcon color="success" />;
        case 'warning': return <InfoIcon color="warning" />;
        default: return <InfoIcon color="primary" />;
      }
    };

    return (
      <Grid container sx={{ height: '100%' }}>
        {/* Panel Lateral */}
        <Grid item xs={12} md={4} sx={{
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          p: 3,
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {currentTutorial.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTutorial.description}
            </Typography>
          </Box>
          <Stepper
            activeStep={currentStep}
            orientation="vertical"
            connector={<CustomStepConnector />}
            sx={{ flexGrow: 1 }}
          >
            {currentTutorial.steps.map((s, index) => (
              <Step key={s.id}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: currentStep === index ? 600 : 400, color: currentStep === index ? 'primary.main' : 'text.secondary' }}
                  >
                    {s.title}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
           <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #e2e8f0' }}>
            <Chip
              icon={<SchoolIcon />}
              label={`${currentTutorial.difficulty} - ${currentTutorial.estimatedTime}`}
              variant="outlined"
            />
          </Box>
        </Grid>

        {/* Contenido Principal */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3, md: 4 }, position: 'relative' }}>
          <IconButton onClick={closeTutorial} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, mb: 3 }}>
             <Card elevation={0} sx={{ backgroundColor: 'transparent' }}>
               <CardContent>
                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                   {getStepIcon()}
                   <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: '#334155' }}>
                     {step.title}
                   </Typography>
                 </Box>
                 <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                   {step.content}
                 </Typography>

                 {step.tips && step.tips.length > 0 && (
                   <Box sx={{ mt: 3, p: 2, backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
                     <List dense>
                       {step.tips.map((tip, index) => (
                         <ListItem key={index}>
                           <ListItemIcon sx={{ minWidth: 32 }}>
                             <TipIcon fontSize="small" color="secondary" />
                           </ListItemIcon>
                           <ListItemText primary={<Typography variant="body2" color="#475569">{tip}</Typography>} />
                         </ListItem>
                       ))}
                     </List>
                   </Box>
                 )}

                 {step.actionButton && (
                   <Button
                     variant="contained"
                     color="primary"
                     onClick={() => handleActionButtonClick(step)}
                     sx={{ mt: 3, borderRadius: '99px', px: 3 }}
                   >
                     {step.actionButton.text}
                   </Button>
                 )}
               </CardContent>
             </Card>
          </Box>

          {/* Navegación */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button
              startIcon={<BackIcon />}
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            <Typography variant="caption" color="text.secondary">
              Paso {currentStep + 1} de {currentTutorial.steps.length}
            </Typography>
            <Button
              endIcon={currentStep === currentTutorial.steps.length - 1 ? <CheckIcon /> : <NextIcon />}
              onClick={nextStep}
              variant="contained"
            >
              {currentStep === currentTutorial.steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const handleActionButtonClick = (step: TutorialStep) => {
    if (step.actionButton?.url) {
      navigate(step.actionButton.url);
      closeTutorial();
    }
    if (step.actionButton?.action) {
      step.actionButton.action();
    }
  };

  const contextValue = {
    currentTutorial,
    isActive,
    currentStep,
    startTutorial,
    nextStep,
    previousStep,
    closeTutorial,
    availableTutorials
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={isActive}
        onClose={closeTutorial}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            maxHeight: { xs: '100%', sm: '90vh' },
            height: { xs: '100%', sm: 'auto' },
            borderRadius: { xs: 0, sm: '24px' },
            margin: { xs: 0 },
            overflow: 'hidden',
          }
        }}
      >
        {renderStepContent()}
      </Dialog>
    </TutorialContext.Provider>
  );
};

export const useDiscoveryTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useDiscoveryTutorial must be used within a DiscoveryTutorialProvider');
  }
  return context;
};

export default DiscoveryTutorialProvider;
