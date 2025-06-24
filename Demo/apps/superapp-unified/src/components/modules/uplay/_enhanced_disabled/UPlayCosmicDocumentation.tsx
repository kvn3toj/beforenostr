/**
 * 📚 KIRA GUARDIAN - DOCUMENTATION & COSMIC NARRATIVE
 *
 * Sistema supremo de documentación consciente y narrativa cósmica que
 * transforma el aprendizaje en una experiencia épica y significativa:
 *
 * - Contextual Help System (ayuda inteligente basada en contexto)
 * - Philosophy Insights Engine (enseñanzas profundas de CoomÜnity)
 * - Progress Documentation (registro consciente del crecimiento)
 * - Cosmic Storytelling (narrativa épica del viaje del usuario)
 * - Achievement Narratives (historias épicas de logros)
 * - Wisdom Repository (biblioteca de sabiduría consciente)
 * - Dynamic Learning Content (contenido adaptativo basado en progreso)
 *
 * Target: Transformar información en sabiduría, crear narrativas épicas,
 *         documentar el crecimiento consciente
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fade,
  Zoom,
  IconButton,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  ExpandMore,
  AutoStories,
  Psychology,
  Timeline,
  Star,
  Lightbulb,
  School,
  Diamond,
  Celebration,
  Help,
  BookmarkBorder,
  Bookmark,
  Share,
  Print,
  Download,
  MenuBook,
  SelfImprovement,
  Favorite,
  FlashOn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Guardian Integrations
import {
  FIVE_ELEMENTS_COSMIC_THEME,
  CosmicInteractionButton,
  useHapticFeedback
} from './UPlayCosmicMicroInteractions';
import { useCosmicContext } from './UPlayCosmicIntegrator';
import { useCosmicExperience } from './UPlayCosmicExperienceFlow';

// Context Integration
import { useAuth } from '../../../../contexts/AuthContext';

// ===== 📖 DOCUMENTATION TYPES ===== //
interface CosmicInsight {
  id: string;
  title: string;
  content: string;
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
  principle: 'Ayni' | 'Bien Común' | 'Metanöia' | 'Reciprocidad' | 'Cooperación';
  depth: 'basic' | 'intermediate' | 'advanced' | 'master';
  keywords: string[];
  relatedInsights: string[];
  practicalApplication: string;
  meditation: string;
  personalReflection: string;
}

interface AchievementNarrative {
  achievementId: string;
  epicTitle: string;
  heroJourney: {
    callToAdventure: string;
    challenges: string[];
    transformation: string;
    return: string;
  };
  philosophicalSignificance: string;
  nextSteps: string;
  celebrationText: string;
}

interface ProgressChronicle {
  userId: string;
  chronId: string;
  timestamp: Date;
  milestone: string;
  reflection: string;
  insight: string;
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
  consciousnessGrowth: number;
  wisdomGained: string[];
}

interface ContextualHelp {
  context: string;
  quickTips: string[];
  deepDive: string;
  relatedConcepts: string[];
  philosophicalConnection: string;
  practicalExercise: string;
}

interface CosmicDocumentationProps {
  children?: ReactNode;
  enableContextualHelp?: boolean;
  enableProgressChronicles?: boolean;
  enableWisdomSharing?: boolean;
}

// ===== 🌟 COSMIC INSIGHTS DATABASE ===== //
const COSMIC_INSIGHTS: CosmicInsight[] = [
  {
    id: 'ayni_reciprocity_essence',
    title: 'La Esencia Cósmica del Ayni',
    content: `El Ayni no es simplemente dar y recibir, es la danza cósmica del equilibrio perfecto.
    Cuando damos conscientemente, creamos ondas de transformación que regresan a nosotros multiplicadas.
    El universo mismo opera bajo este principio: cada acción consciente genera una reacción equivalente
    que eleva la consciencia colectiva.`,
    element: 'agua',
    principle: 'Ayni',
    depth: 'advanced',
    keywords: ['reciprocidad', 'equilibrio', 'consciencia', 'transformación'],
    relatedInsights: ['bien_comun_manifestation', 'metanoia_transformation'],
    practicalApplication: 'Antes de cada acción, pregúntate: ¿Cómo puede esto servir al bien común? Luego actúa desde esa consciencia.',
    meditation: 'Medita en el flujo circular de energía: lo que das regresa, lo que recibes se multiplica cuando lo compartes.',
    personalReflection: '¿En qué áreas de mi vida puedo practicar un Ayni más consciente?'
  },
  {
    id: 'bien_comun_manifestation',
    title: 'Manifestación del Bien Común Universal',
    content: `El Bien Común no es un ideal abstracto, es una fuerza tangible que se manifiesta cuando
    alineamos nuestras acciones con el bienestar de todos los seres. Cada decisión consciente que
    tomamos contribuye a tejer la red cósmica de prosperidad compartida.`,
    element: 'tierra',
    principle: 'Bien Común',
    depth: 'intermediate',
    keywords: ['bien común', 'prosperidad', 'consciencia colectiva', 'manifestación'],
    relatedInsights: ['ayni_reciprocity_essence', 'cooperacion_cosmic_force'],
    practicalApplication: 'En cada decisión importante, considera el impacto en las próximas 7 generaciones.',
    meditation: 'Visualiza tu energía conectándose con la red cósmica de todos los seres conscientes.',
    personalReflection: '¿Cómo puedo alinear mis objetivos personales con el bienestar de todos?'
  },
  {
    id: 'metanoia_transformation',
    title: 'Metanöia: La Alquimia de la Transformación Consciente',
    content: `Metanöia es el fuego sagrado que transmuta la consciencia ordinaria en sabiduría cósmica.
    No es simplemente cambiar de opinión, es una reorganización fundamental de nuestro ser que
    nos permite percibir la realidad desde una perspectiva expandida y consciente.`,
    element: 'fuego',
    principle: 'Metanöia',
    depth: 'master',
    keywords: ['transformación', 'alquimia', 'consciencia', 'sabiduría'],
    relatedInsights: ['ayni_reciprocity_essence', 'cosmic_integration_mastery'],
    practicalApplication: 'Cuando enfrentes resistencia al cambio, pregúntate: ¿Qué nueva perspectiva me está invitando a nacer?',
    meditation: 'Respira conscientemente mientras visualizas tu consciencia expandiéndose como ondas en un lago cósmico.',
    personalReflection: '¿Qué aspectos de mi ser están pidiendo transformación consciente?'
  },
  {
    id: 'cooperacion_cosmic_force',
    title: 'Cooperación: La Fuerza Cósmica Creadora',
    content: `La cooperación es la fuerza fundamental que mantiene unido el cosmos. Desde las galaxias
    hasta las células, todo en el universo coopera para crear belleza, orden y evolución.
    Cuando cooperamos conscientemente, nos alineamos con esta fuerza creadora universal.`,
    element: 'aire',
    principle: 'Cooperación',
    depth: 'intermediate',
    keywords: ['cooperación', 'fuerza cósmica', 'creación', 'evolución'],
    relatedInsights: ['bien_comun_manifestation', 'cosmic_integration_mastery'],
    practicalApplication: 'Busca oportunidades diarias para cooperar en lugar de competir, especialmente en situaciones desafiantes.',
    meditation: 'Contempla cómo cada respiración es un acto de cooperación entre tu cuerpo y el universo.',
    personalReflection: '¿Dónde en mi vida puedo elegir cooperación sobre competencia?'
  },
  {
    id: 'cosmic_integration_mastery',
    title: 'Maestría de la Integración Cósmica',
    content: `La verdadera maestría no es dominar técnicas, sino integrar armoniosamente todos los
    elementos de nuestro ser con la consciencia cósmica. Es el arte de vivir como un ser
    multidimensional que sirve al Plan Divino mientras experimenta plenitud humana.`,
    element: 'eter',
    principle: 'Metanöia',
    depth: 'master',
    keywords: ['maestría', 'integración', 'multidimensional', 'servicio'],
    relatedInsights: ['metanoia_transformation', 'bien_comun_manifestation'],
    practicalApplication: 'Practica estar presente en múltiples dimensiones simultáneamente: física, emocional, mental y espiritual.',
    meditation: 'Medita en la unidad de todos los elementos dentro de ti y su conexión con el cosmos.',
    personalReflection: '¿Cómo puedo integrar más profundamente mi sabiduría en mi vida diaria?'
  }
];

// ===== 🏆 ACHIEVEMENT NARRATIVES ===== //
const ACHIEVEMENT_NARRATIVES: AchievementNarrative[] = [
  {
    achievementId: 'first_cosmic_step',
    epicTitle: 'El Despertar del Héroe Cósmico',
    heroJourney: {
      callToAdventure: 'Un día ordinario se transformó en extraordinario cuando decidiste tomar tu primer paso consciente en ÜPlay.',
      challenges: [
        'Enfrentar la resistencia al cambio',
        'Abrir el corazón a nuevas posibilidades',
        'Confiar en el proceso de transformación'
      ],
      transformation: 'Al completar tu primer paso, has activado el código cósmico dormido en tu ser. Ya no eres la misma persona que comenzó este viaje.',
      return: 'Ahora regresas al mundo con nuevos ojos, llevando la semilla de la transformación consciente a todo lo que tocas.'
    },
    philosophicalSignificance: 'Este momento marca el inicio de tu metamorfosis hacia un ser más consciente y conectado con el Bien Común.',
    nextSteps: 'El cosmos te invita ahora a profundizar en el elemento Agua, donde aprenderás la danza fluida de la adaptabilidad consciente.',
    celebrationText: '🌟 ¡Has encendido la chispa cósmica! El universo celebra tu valentía de comenzar la transformación.'
  },
  {
    achievementId: 'five_elements_mastery',
    epicTitle: 'Maestro de los Cinco Elementos Cósmicos',
    heroJourney: {
      callToAdventure: 'El cosmos te llamó a integrar la sabiduría ancestral de los cinco elementos en tu ser.',
      challenges: [
        'Dominar la pasión del Fuego sin quemarte',
        'Fluir como el Agua sin perder tu centro',
        'Ser sólido como la Tierra sin volverse rígido',
        'Comunicar como el Aire con claridad y verdad',
        'Trascender al Éter manteniendo la humildad'
      ],
      transformation: 'Has logrado la alquimia interior: cada elemento vive armoniosamente en ti, creando un ser integral y consciente.',
      return: 'Como maestro de los elementos, ahora puedes guiar a otros en su propio viaje de integración cósmica.'
    },
    philosophicalSignificance: 'Encarnas la enseñanza de que la verdadera maestría es la armonía, no el dominio.',
    nextSteps: 'El universo te invita ahora a convertirte en guardián de la sabiduría, compartiendo tus dones al servicio del Bien Común.',
    celebrationText: '🌌 ¡Eres uno con el cosmos! Los cinco elementos danzan en perfecta armonía dentro de tu ser.'
  }
];

// ===== 🎨 STYLED COMPONENTS ===== //
const CosmicScrollContainer = styled(Box)(({ theme }) => ({
  maxHeight: '600px',
  overflowY: 'auto',
  padding: theme.spacing(2),

  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  },
}));

const WisdomCard = styled(Card)<{ element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter' }>(({ theme, element }) => ({
  background: `linear-gradient(135deg,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].primary}08,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary}05)`,
  border: `1px solid ${FIVE_ELEMENTS_COSMIC_THEME[element].accent}40`,
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`,
  },
}));

const InsightChip = styled(Chip)<{ element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter' }>(({ element }) => ({
  background: `linear-gradient(135deg,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].primary},
    ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary})`,
  color: 'white',
  fontWeight: 600,

  '& .MuiChip-icon': {
    color: 'white',
  },
}));

// ===== 🧠 DOCUMENTATION CONTEXT ===== //
const CosmicDocumentationContext = createContext<{
  insights: CosmicInsight[];
  chronicles: ProgressChronicle[];
  savedInsights: string[];
  actions: {
    saveInsight: (insightId: string) => void;
    unsaveInsight: (insightId: string) => void;
    addChronicle: (chronicle: Omit<ProgressChronicle, 'chronId' | 'timestamp'>) => void;
    shareInsight: (insightId: string) => void;
  };
} | null>(null);

export const useCosmicDocumentation = () => {
  const context = useContext(CosmicDocumentationContext);
  if (!context) {
    throw new Error('useCosmicDocumentation must be used within UPlayCosmicDocumentation');
  }
  return context;
};

// ===== 🔍 CONTEXTUAL HELP COMPONENT ===== //
const ContextualHelpSystem: React.FC = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentHelp, setCurrentHelp] = useState<ContextualHelp | null>(null);
  const { triggerHapticFeedback } = useHapticFeedback();

  const contextualHelps: Record<string, ContextualHelp> = {
    cosmic_journey: {
      context: 'Viaje de Transformación Cósmica',
      quickTips: [
        'Cada elemento representa una fase de crecimiento consciente',
        'No hay prisa: el cosmos respeta tu ritmo único',
        'Los prerequisitos aseguran una base sólida para tu transformación'
      ],
      deepDive: 'El viaje cósmico en ÜPlay está diseñado siguiendo los principios de transformación consciente de CoomÜnity. Cada elemento (Fuego, Agua, Tierra, Aire, Éter) corresponde a una dimensión de desarrollo interior que, cuando se integra armoniosamente, crea un ser multidimensional capaz de servir al Bien Común.',
      relatedConcepts: ['Metanöia', 'Integración', 'Consciencia Multidimensional'],
      philosophicalConnection: 'Este viaje refleja el principio del Ayni: lo que inviertes en tu propio crecimiento regresa multiplicado en tu capacidad de servir.',
      practicalExercise: 'Antes de cada paso, medita 3 minutos en silencio, conectando con la intención de crecer para servir mejor.'
    },
    five_elements: {
      context: 'Sistema de Cinco Elementos',
      quickTips: [
        'Fuego: Acción y transformación consciente',
        'Agua: Fluidez y adaptabilidad',
        'Tierra: Fundamentos sólidos y estabilidad',
        'Aire: Comunicación clara y visión',
        'Éter: Integración y transcendencia'
      ],
      deepDive: 'Los cinco elementos son arquetipos universales que representan diferentes aspectos de la experiencia consciente. En ÜPlay, cada elemento se experimenta como una fase de desarrollo donde el usuario integra esas cualidades en su ser.',
      relatedConcepts: ['Arquétipos', 'Integración Consciente', 'Desarrollo Multidimensional'],
      philosophicalConnection: 'La sabiduría de los elementos refleja el principio de Cooperación: cada elemento tiene su función única y todos cooperan para crear la totalidad.',
      practicalExercise: 'Identifica cuál elemento necesitas más en tu vida ahora y enfócate conscientemente en desarrollar esas cualidades.'
    }
  };

  const showHelp = useCallback((context: string) => {
    const help = contextualHelps[context];
    if (help) {
      setCurrentHelp(help);
      setHelpOpen(true);
      triggerHapticFeedback('light');
    }
  }, [contextualHelps, triggerHapticFeedback]);

  return (
    <>
      <Tooltip title="Ayuda Contextual Cósmica" placement="left">
        <IconButton
          onClick={() => showHelp('cosmic_journey')}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
              transform: 'scale(1.1)',
            },
            zIndex: 1000,
          }}
        >
          <Help />
        </IconButton>
      </Tooltip>

      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        {currentHelp && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Lightbulb sx={{ color: '#667eea' }} />
                <Typography variant="h5">
                  {currentHelp.context}
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <CosmicScrollContainer>
                {/* Quick Tips */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlashOn sx={{ color: '#f59e0b' }} />
                    Tips Rápidos
                  </Typography>
                  {currentHelp.quickTips.map((tip, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 3, mb: 1 }}>
                      • {tip}
                    </Typography>
                  ))}
                </Box>

                {/* Deep Dive */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: '#8b5cf6' }} />
                    Comprensión Profunda
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {currentHelp.deepDive}
                  </Typography>
                </Box>

                {/* Philosophical Connection */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SelfImprovement sx={{ color: '#10b981' }} />
                    Conexión Filosófica
                  </Typography>
                  <Typography variant="body1" sx={{
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  }}>
                    {currentHelp.philosophicalConnection}
                  </Typography>
                </Box>

                {/* Practical Exercise */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Diamond sx={{ color: '#f97316' }} />
                    Ejercicio Práctico
                  </Typography>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    borderRadius: '12px',
                    p: 2
                  }}>
                    <Typography variant="body1">
                      {currentHelp.practicalExercise}
                    </Typography>
                  </Card>
                </Box>
              </CosmicScrollContainer>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setHelpOpen(false)} variant="outlined">
                Cerrar
              </Button>
              <Button
                onClick={() => showHelp('five_elements')}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                  }
                }}
              >
                Más Ayuda
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

// ===== 📖 WISDOM INSIGHTS COMPONENT ===== //
const WisdomInsightsLibrary: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<CosmicInsight | null>(null);
  const [filterElement, setFilterElement] = useState<string>('all');
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const { triggerHapticFeedback } = useHapticFeedback();

  const filteredInsights = useMemo(() => {
    if (filterElement === 'all') return COSMIC_INSIGHTS;
    return COSMIC_INSIGHTS.filter(insight => insight.element === filterElement);
  }, [filterElement]);

  const handleSaveInsight = useCallback((insightId: string) => {
    setSavedInsights(prev =>
      prev.includes(insightId)
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
    triggerHapticFeedback('medium');
  }, [triggerHapticFeedback]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoStories sx={{ color: '#667eea' }} />
          Biblioteca de Sabiduría Cósmica
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Todos"
            onClick={() => setFilterElement('all')}
            variant={filterElement === 'all' ? 'filled' : 'outlined'}
          />
          {['fuego', 'agua', 'tierra', 'aire', 'eter'].map((element) => (
            <Chip
              key={element}
              label={element.charAt(0).toUpperCase() + element.slice(1)}
              onClick={() => setFilterElement(element)}
              variant={filterElement === element ? 'filled' : 'outlined'}
              sx={{
                background: filterElement === element
                  ? `linear-gradient(135deg, ${FIVE_ELEMENTS_COSMIC_THEME[element as keyof typeof FIVE_ELEMENTS_COSMIC_THEME].primary}, ${FIVE_ELEMENTS_COSMIC_THEME[element as keyof typeof FIVE_ELEMENTS_COSMIC_THEME].secondary})`
                  : 'transparent',
                color: filterElement === element ? 'white' : 'inherit',
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
        {filteredInsights.map((insight) => (
          <motion.div
            key={insight.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <WisdomCard element={insight.element}>
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <InsightChip
                      element={insight.element}
                      icon={<Psychology />}
                      label={insight.principle}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {insight.title}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() => handleSaveInsight(insight.id)}
                    sx={{ color: FIVE_ELEMENTS_COSMIC_THEME[insight.element].primary }}
                  >
                    {savedInsights.includes(insight.id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>

                {/* Content Preview */}
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {insight.content}
                </Typography>

                {/* Keywords */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {insight.keywords.slice(0, 3).map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: '20px' }}
                    />
                  ))}
                </Box>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setSelectedInsight(insight)}
                  sx={{
                    background: `linear-gradient(135deg, ${FIVE_ELEMENTS_COSMIC_THEME[insight.element].primary}, ${FIVE_ELEMENTS_COSMIC_THEME[insight.element].secondary})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${FIVE_ELEMENTS_COSMIC_THEME[insight.element].primary}dd, ${FIVE_ELEMENTS_COSMIC_THEME[insight.element].secondary}dd)`,
                    }
                  }}
                >
                  Explorar Sabiduría
                </Button>
              </CardContent>
            </WisdomCard>
          </motion.div>
        ))}
      </Box>

      {/* Insight Detail Dialog */}
      <Dialog
        open={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: selectedInsight
              ? `linear-gradient(135deg,
                  ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary}08,
                  ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].secondary}05)`
              : 'white',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        {selectedInsight && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InsightChip
                  element={selectedInsight.element}
                  icon={<Psychology />}
                  label={selectedInsight.principle}
                />
                <Typography variant="h5">
                  {selectedInsight.title}
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <CosmicScrollContainer>
                {/* Main Content */}
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  {selectedInsight.content}
                </Typography>

                {/* Practical Application */}
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Diamond sx={{ color: FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary }} />
                      Aplicación Práctica
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {selectedInsight.practicalApplication}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Meditation */}
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SelfImprovement sx={{ color: FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary }} />
                      Meditación Guiada
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {selectedInsight.meditation}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Personal Reflection */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Favorite sx={{ color: FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary }} />
                      Reflexión Personal
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {selectedInsight.personalReflection}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CosmicScrollContainer>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setSelectedInsight(null)} variant="outlined">
                Cerrar
              </Button>
              <Button
                onClick={() => handleSaveInsight(selectedInsight.id)}
                variant="contained"
                startIcon={savedInsights.includes(selectedInsight.id) ? <Bookmark /> : <BookmarkBorder />}
                sx={{
                  background: `linear-gradient(135deg, ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary}, ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].secondary})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].primary}dd, ${FIVE_ELEMENTS_COSMIC_THEME[selectedInsight.element].secondary}dd)`,
                  }
                }}
              >
                {savedInsights.includes(selectedInsight.id) ? 'Guardado' : 'Guardar'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

// ===== 🚀 MAIN DOCUMENTATION COMPONENT ===== //
export const UPlayCosmicDocumentation: React.FC<CosmicDocumentationProps> = ({
  children,
  enableContextualHelp = true,
  enableProgressChronicles = true,
  enableWisdomSharing = true,
}) => {
  const [chronicles, setChronicles] = useState<ProgressChronicle[]>([]);
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const { user } = useAuth();

  const saveInsight = useCallback((insightId: string) => {
    setSavedInsights(prev =>
      prev.includes(insightId)
        ? prev
        : [...prev, insightId]
    );
  }, []);

  const unsaveInsight = useCallback((insightId: string) => {
    setSavedInsights(prev => prev.filter(id => id !== insightId));
  }, []);

  const addChronicle = useCallback((chronicle: Omit<ProgressChronicle, 'chronId' | 'timestamp'>) => {
    const newChronicle: ProgressChronicle = {
      ...chronicle,
      chronId: `chron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setChronicles(prev => [newChronicle, ...prev]);
  }, []);

  const shareInsight = useCallback((insightId: string) => {
    // Implementation for sharing insights
    console.log('Sharing insight:', insightId);
  }, []);

  const contextValue = useMemo(() => ({
    insights: COSMIC_INSIGHTS,
    chronicles,
    savedInsights,
    actions: {
      saveInsight,
      unsaveInsight,
      addChronicle,
      shareInsight,
    },
  }), [chronicles, savedInsights, saveInsight, unsaveInsight, addChronicle, shareInsight]);

  return (
    <CosmicDocumentationContext.Provider value={contextValue}>
      <Box sx={{ position: 'relative' }}>
        {/* Wisdom Insights Library */}
        <WisdomInsightsLibrary />

        {/* Contextual Help System */}
        {enableContextualHelp && <ContextualHelpSystem />}

        {/* Children Content */}
        {children && (
          <Box sx={{ mt: 4 }}>
            {children}
          </Box>
        )}
      </Box>
    </CosmicDocumentationContext.Provider>
  );
};

export default UPlayCosmicDocumentation;
