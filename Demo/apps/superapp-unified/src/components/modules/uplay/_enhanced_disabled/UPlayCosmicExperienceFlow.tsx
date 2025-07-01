/**
 * 🎨 ZENO GUARDIAN - UX & COSMIC EXPERIENCE ORCHESTRATION
 *
 * Sistema supremo de orquestación de experiencias para ÜPlay que guía
 * a los usuarios a través de transformaciones cósmicas conscientes:
 *
 * - Onboarding Cosmic Journey (Pilgrim Experience)
 * - Discovery Path Orchestration (Five Elements Progression)
 * - Mastery Flow Management (Achievement-driven Growth)
 * - Philosophy Integration UX (Reciprocidad, Bien Común, Metanöia)
 * - Adaptive Experience Based on User Consciousness Level
 * - Cosmic Transitions & Micro-moments
 * - Gamified Learning Journey Optimization
 *
 * Target: Transformación consciente, engagement supremo, crecimiento guiado
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Fade,
  Zoom,
  Collapse,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  AutoAwesome,
  School,
  Star,
  EmojiEvents,
  Lightbulb,
  Psychology,
  SelfImprovement,
  Celebration,
  Diamond,
  Whatshot,
  Waves,
  Terrain,
  Air,
  FlashOn,
} from '@mui/icons-material';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// Guardian Integrations
import {
  CosmicInteractionButton,
  FIVE_ELEMENTS_COSMIC_THEME,
  useHapticFeedback
} from './UPlayCosmicMicroInteractions';
import { useCosmicContext } from './UPlayCosmicIntegrator';

// Context Integration
import { useAuth } from '../../../../contexts/AuthContext';

// ===== 🌟 EXPERIENCE FLOW TYPES ===== //
type ConsciousnessLevel = 'seeker' | 'explorer' | 'practitioner' | 'integrator' | 'master';
type ElementType = 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
type JourneyStage = 'awakening' | 'discovery' | 'integration' | 'mastery' | 'transcendence';

interface ExperienceStep {
  id: string;
  title: string;
  description: string;
  element: ElementType;
  consciousnessLevel: ConsciousnessLevel;
  duration: number; // in minutes
  rewards: {
    meritos: number;
    ondas: number;
    consciousness: number;
  };
  prerequisites: string[];
  content: {
    type: 'video' | 'interaction' | 'reflection' | 'practice' | 'assessment';
    data: any;
  };
  philosophy: {
    principle: 'Reciprocidad' | 'Bien Común' | 'Metanöia' | 'Reciprocidad' | 'Cooperación';
    teaching: string;
    practice: string;
  };
}

interface UserJourney {
  currentStage: JourneyStage;
  currentElement: ElementType;
  consciousnessLevel: ConsciousnessLevel;
  completedSteps: string[];
  currentStep: string | null;
  progress: {
    overall: number;
    byElement: Record<ElementType, number>;
    byPrinciple: Record<string, number>;
  };
  achievements: {
    unlocked: string[];
    inProgress: Array<{ id: string; progress: number }>;
  };
  preferences: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    pacePreference: 'slow' | 'moderate' | 'fast';
    philosophyAlignment: number; // 0-100
  };
}

interface CosmicExperienceFlowProps {
  children?: ReactNode;
  onJourneyProgress?: (journey: UserJourney) => void;
  onStepComplete?: (step: ExperienceStep) => void;
  initialJourney?: Partial<UserJourney>;
}

// ===== 🎯 COSMIC EXPERIENCE DATA ===== //
const COSMIC_JOURNEY_STEPS: ExperienceStep[] = [
  // 🔥 FUEGO - Awakening & Action
  {
    id: 'fuego_awakening',
    title: 'Despertar del Fuego Interior',
    description: 'Descubre la chispa de transformación que vive en ti',
    element: 'fuego',
    consciousnessLevel: 'seeker',
    duration: 8,
    rewards: { meritos: 50, ondas: 25, consciousness: 10 },
    prerequisites: [],
    content: {
      type: 'video',
      data: { videoId: 'cosmic_fuego_intro', interactiveElements: 3 }
    },
    philosophy: {
      principle: 'Metanöia',
      teaching: 'La transformación comienza con la decisión consciente de cambiar',
      practice: 'Reflexiona sobre qué deseas transformar en tu vida'
    }
  },
  {
    id: 'fuego_action',
    title: 'Primeros Pasos de Acción Consciente',
    description: 'Convierte tu inspiración en acciones concretas',
    element: 'fuego',
    consciousnessLevel: 'explorer',
    duration: 12,
    rewards: { meritos: 75, ondas: 35, consciousness: 15 },
    prerequisites: ['fuego_awakening'],
    content: {
      type: 'practice',
      data: { challenges: ['daily_reflection', 'conscious_choice', 'action_plan'] }
    },
    philosophy: {
      principle: 'Bien Común',
      teaching: 'Nuestras acciones conscientes benefician a toda la comunidad',
      practice: 'Realiza una acción que beneficie a alguien más'
    }
  },

  // 💧 AGUA - Flow & Adaptation
  {
    id: 'agua_fluidity',
    title: 'Fluidez y Adaptabilidad Consciente',
    description: 'Aprende a fluir con los cambios como el agua',
    element: 'agua',
    consciousnessLevel: 'explorer',
    duration: 10,
    rewards: { meritos: 60, ondas: 40, consciousness: 12 },
    prerequisites: ['fuego_action'],
    content: {
      type: 'interaction',
      data: { simulationType: 'adaptation_challenges', scenarios: 5 }
    },
    philosophy: {
      principle: 'Reciprocidad',
      teaching: 'La reciprocidad fluye naturalmente cuando nos adaptamos conscientemente',
      practice: 'Practica dar y recibir en equilibrio perfecto'
    }
  },

  // 🌍 TIERRA - Foundation & Stability
  {
    id: 'tierra_foundation',
    title: 'Construcción de Bases Sólidas',
    description: 'Establece fundamentos conscientes para tu crecimiento',
    element: 'tierra',
    consciousnessLevel: 'practitioner',
    duration: 15,
    rewards: { meritos: 100, ondas: 50, consciousness: 20 },
    prerequisites: ['agua_fluidity'],
    content: {
      type: 'assessment',
      data: { evaluationType: 'values_alignment', criteriaCount: 8 }
    },
    philosophy: {
      principle: 'Cooperación',
      teaching: 'Las bases sólidas se construyen en cooperación con otros',
      practice: 'Identifica tus valores fundamentales y vive según ellos'
    }
  },

  // 🌬️ AIRE - Communication & Vision
  {
    id: 'aire_communication',
    title: 'Comunicación Consciente y Visión Clara',
    description: 'Desarrolla claridad en tu visión y comunicación',
    element: 'aire',
    consciousnessLevel: 'practitioner',
    duration: 13,
    rewards: { meritos: 85, ondas: 60, consciousness: 18 },
    prerequisites: ['tierra_foundation'],
    content: {
      type: 'interaction',
      data: { communicationType: 'conscious_dialogue', exercises: 4 }
    },
    philosophy: {
      principle: 'Reciprocidad',
      teaching: 'La comunicación consciente crea puentes de entendimiento',
      practice: 'Practica escucha activa y comunicación empática'
    }
  },

  // ✨ ÉTER - Integration & Transcendence
  {
    id: 'eter_integration',
    title: 'Integración Cósmica de Elementos',
    description: 'Unifica todos los elementos en tu ser consciente',
    element: 'eter',
    consciousnessLevel: 'integrator',
    duration: 20,
    rewards: { meritos: 150, ondas: 100, consciousness: 30 },
    prerequisites: ['aire_communication'],
    content: {
      type: 'reflection',
      data: { meditationType: 'cosmic_integration', phases: 5 }
    },
    philosophy: {
      principle: 'Metanöia',
      teaching: 'La verdadera transformación integra todos los aspectos del ser',
      practice: 'Medita en la unidad de todos los elementos en ti'
    }
  },

  {
    id: 'eter_mastery',
    title: 'Maestría Cósmica y Servicio',
    description: 'Comparte tu sabiduría al servicio del Bien Común',
    element: 'eter',
    consciousnessLevel: 'master',
    duration: 25,
    rewards: { meritos: 200, ondas: 150, consciousness: 50 },
    prerequisites: ['eter_integration'],
    content: {
      type: 'practice',
      data: { serviceType: 'teaching_others', commitmentLevel: 'advanced' }
    },
    philosophy: {
      principle: 'Bien Común',
      teaching: 'La maestría se manifiesta en el servicio desinteresado',
      practice: 'Guía a otros en su propio viaje de transformación'
    }
  }
];

// ===== 🎨 STYLED COMPONENTS ===== //
const CosmicJourneyContainer = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: `linear-gradient(135deg,
    ${alpha(theme.palette.primary.main, 0.05)},
    ${alpha(theme.palette.secondary.main, 0.08)})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: 'hidden',
}));

const ElementCard = styled(Card)<{ element: ElementType; isActive: boolean }>(({ theme, element, isActive }) => ({
  background: isActive
    ? `linear-gradient(135deg,
        ${FIVE_ELEMENTS_COSMIC_THEME[element].primary}20,
        ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary}15)`
    : `rgba(128, 128, 128, 0.05)`,
  border: `2px solid ${isActive
    ? FIVE_ELEMENTS_COSMIC_THEME[element].accent
    : 'rgba(128, 128, 128, 0.2)'}`,
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: isActive
      ? `0 20px 40px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`
      : '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const ProgressRing = styled(Box)<{ progress: number; element: ElementType }>(({ progress, element }) => ({
  position: 'relative',
  width: '120px',
  height: '120px',

  '& .progress-circle': {
    transform: 'rotate(-90deg)',
  },

  '& .progress-bar': {
    stroke: FIVE_ELEMENTS_COSMIC_THEME[element].primary,
    strokeLinecap: 'round',
    strokeDasharray: `${2 * Math.PI * 45}`,
    strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
    transition: 'stroke-dashoffset 1s ease-out',
  },
}));

// ===== 🌌 EXPERIENCE CONTEXT ===== //
const CosmicExperienceContext = createContext<{
  journey: UserJourney;
  availableSteps: ExperienceStep[];
  currentStep: ExperienceStep | null;
  actions: {
    completeStep: (stepId: string) => void;
    selectStep: (stepId: string) => void;
    updatePreferences: (preferences: Partial<UserJourney['preferences']>) => void;
  };
} | null>(null);

export const useCosmicExperience = () => {
  const context = useContext(CosmicExperienceContext);
  if (!context) {
    throw new Error('useCosmicExperience must be used within UPlayCosmicExperienceFlow');
  }
  return context;
};

// ===== 🧭 JOURNEY MANAGEMENT HOOKS ===== //
const useJourneyManager = (initialJourney?: Partial<UserJourney>) => {
  const [journey, setJourney] = useState<UserJourney>(() => ({
    currentStage: 'awakening',
    currentElement: 'fuego',
    consciousnessLevel: 'seeker',
    completedSteps: [],
    currentStep: null,
    progress: {
      overall: 0,
      byElement: {
        fuego: 0,
        agua: 0,
        tierra: 0,
        aire: 0,
        eter: 0,
      },
      byPrinciple: {
        'Reciprocidad': 0,
        'Bien Común': 0,
        'Metanöia': 0,
        'Reciprocidad': 0,
        'Cooperación': 0,
      },
    },
    achievements: {
      unlocked: [],
      inProgress: [],
    },
    preferences: {
      learningStyle: 'visual',
      pacePreference: 'moderate',
      philosophyAlignment: 50,
    },
    ...initialJourney,
  }));

  const completeStep = useCallback((stepId: string) => {
    const step = COSMIC_JOURNEY_STEPS.find(s => s.id === stepId);
    if (!step) return;

    setJourney(prev => {
      const newCompletedSteps = [...prev.completedSteps, stepId];
      const newProgress = { ...prev.progress };

      // Update element progress
      newProgress.byElement[step.element] += 100 / COSMIC_JOURNEY_STEPS.filter(s => s.element === step.element).length;

      // Update principle progress
      newProgress.byPrinciple[step.philosophy.principle] += 20;

      // Update overall progress
      newProgress.overall = (newCompletedSteps.length / COSMIC_JOURNEY_STEPS.length) * 100;

      // Determine new consciousness level
      let newConsciousnessLevel = prev.consciousnessLevel;
      if (newProgress.overall >= 80) newConsciousnessLevel = 'master';
      else if (newProgress.overall >= 60) newConsciousnessLevel = 'integrator';
      else if (newProgress.overall >= 40) newConsciousnessLevel = 'practitioner';
      else if (newProgress.overall >= 20) newConsciousnessLevel = 'explorer';

      // Determine new stage
      let newStage = prev.currentStage;
      if (newProgress.overall >= 80) newStage = 'transcendence';
      else if (newProgress.overall >= 60) newStage = 'mastery';
      else if (newProgress.overall >= 40) newStage = 'integration';
      else if (newProgress.overall >= 20) newStage = 'discovery';

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: null,
        progress: newProgress,
        consciousnessLevel: newConsciousnessLevel,
        currentStage: newStage,
      };
    });
  }, []);

  const selectStep = useCallback((stepId: string) => {
    setJourney(prev => ({
      ...prev,
      currentStep: stepId,
    }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserJourney['preferences']>) => {
    setJourney(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  }, []);

  return {
    journey,
    actions: {
      completeStep,
      selectStep,
      updatePreferences,
    },
  };
};

// ===== 🎯 STEP COMPONENTS ===== //
const CosmicStepCard: React.FC<{
  step: ExperienceStep;
  isAvailable: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}> = ({ step, isAvailable, isCompleted, isCurrent, onSelect }) => {
  const { triggerHapticFeedback } = useHapticFeedback();
  const theme = useTheme();

  const elementIcons = {
    fuego: <Whatshot />,
    agua: <Waves />,
    tierra: <Terrain />,
    aire: <Air />,
    eter: <AutoAwesome />,
  };

  const handleClick = useCallback(() => {
    if (isAvailable) {
      triggerHapticFeedback('medium');
      onSelect();
    }
  }, [isAvailable, onSelect, triggerHapticFeedback]);

  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.02, y: -2 } : {}}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
    >
      <ElementCard
        element={step.element}
        isActive={isCurrent}
        onClick={handleClick}
        sx={{
          opacity: isAvailable ? 1 : 0.5,
          cursor: isAvailable ? 'pointer' : 'not-allowed',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Element Icon & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: FIVE_ELEMENTS_COSMIC_THEME[step.element].primary,
              }}
            >
              {elementIcons[step.element]}
              <Typography variant="h6" fontWeight="bold">
                {step.element.charAt(0).toUpperCase() + step.element.slice(1)}
              </Typography>
            </Box>

            {isCompleted && (
              <Box
                sx={{
                  background: FIVE_ELEMENTS_COSMIC_THEME[step.element].primary,
                  color: 'white',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star sx={{ fontSize: '1rem' }} />
              </Box>
            )}
          </Box>

          {/* Step Title & Description */}
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {step.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {step.description}
          </Typography>

          {/* Philosophy Section */}
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: alpha(FIVE_ELEMENTS_COSMIC_THEME[step.element].primary, 0.1) }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🧘 {step.philosophy.principle}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
              {step.philosophy.teaching}
            </Typography>
          </Box>

          {/* Rewards & Duration */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption">
                💎 {step.rewards.meritos}
              </Typography>
              <Typography variant="caption">
                ⚡ {step.rewards.ondas}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {step.duration} min
            </Typography>
          </Box>
        </CardContent>
      </ElementCard>
    </motion.div>
  );
};

const CosmicProgressDashboard: React.FC<{ journey: UserJourney }> = ({ journey }) => {
  const elements: ElementType[] = ['fuego', 'agua', 'tierra', 'aire', 'eter'];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        🌌 Viaje de Transformación Cósmica
      </Typography>

      <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 3 }}>
        Nivel de Consciencia: {journey.consciousnessLevel} • Etapa: {journey.currentStage}
      </Typography>

      {/* Overall Progress */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Progreso General: {Math.round(journey.progress.overall)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={journey.progress.overall}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha('#000', 0.1),
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        />
      </Box>

      {/* Element Progress Rings */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        {elements.map((element) => (
          <Box key={element} sx={{ textAlign: 'center' }}>
            <ProgressRing progress={journey.progress.byElement[element]} element={element}>
              <svg width="120" height="120" className="progress-circle">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  className="progress-bar"
                />
              </svg>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ color: FIVE_ELEMENTS_COSMIC_THEME[element].primary, mb: 0.5 }}>
                  {element === 'fuego' && <Whatshot />}
                  {element === 'agua' && <Waves />}
                  {element === 'tierra' && <Terrain />}
                  {element === 'aire' && <Air />}
                  {element === 'eter' && <AutoAwesome />}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {Math.round(journey.progress.byElement[element])}%
                </Typography>
              </Box>
            </ProgressRing>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, textTransform: 'capitalize' }}>
              {element}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ===== 🚀 MAIN COMPONENT ===== //
export const UPlayCosmicExperienceFlow: React.FC<CosmicExperienceFlowProps> = ({
  children,
  onJourneyProgress,
  onStepComplete,
  initialJourney,
}) => {
  const { journey, actions } = useJourneyManager(initialJourney);
  const { user } = useAuth();
  const cosmicContext = useCosmicContext();

  // Get available steps based on prerequisites
  const availableSteps = useMemo(() => {
    return COSMIC_JOURNEY_STEPS.filter(step =>
      step.prerequisites.every(prereq => journey.completedSteps.includes(prereq))
    );
  }, [journey.completedSteps]);

  const currentStep = useMemo(() => {
    return journey.currentStep ? COSMIC_JOURNEY_STEPS.find(s => s.id === journey.currentStep) : null;
  }, [journey.currentStep]);

  // Handle step completion
  const handleStepComplete = useCallback((stepId: string) => {
    const step = COSMIC_JOURNEY_STEPS.find(s => s.id === stepId);
    if (step) {
      actions.completeStep(stepId);
      onStepComplete?.(step);

      // Trigger cosmic event
      cosmicContext.eventBus.emit({
        type: 'achievement',
        source: 'ZENO',
        data: { stepId, step, userId: user?.id },
        priority: 'high',
      });
    }
  }, [actions, onStepComplete, cosmicContext.eventBus, user?.id]);

  // Progress callback
  useEffect(() => {
    onJourneyProgress?.(journey);
  }, [journey, onJourneyProgress]);

  // Context value
  const contextValue = useMemo(() => ({
    journey,
    availableSteps,
    currentStep,
    actions: {
      ...actions,
      completeStep: handleStepComplete,
    },
  }), [journey, availableSteps, currentStep, actions, handleStepComplete]);

  return (
    <CosmicExperienceContext.Provider value={contextValue}>
      <CosmicJourneyContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Progress Dashboard */}
        <CosmicProgressDashboard journey={journey} />

        {/* Available Steps Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
          {COSMIC_JOURNEY_STEPS.map((step) => (
            <CosmicStepCard
              key={step.id}
              step={step}
              isAvailable={availableSteps.some(s => s.id === step.id)}
              isCompleted={journey.completedSteps.includes(step.id)}
              isCurrent={journey.currentStep === step.id}
              onSelect={() => actions.selectStep(step.id)}
            />
          ))}
        </Box>

        {/* Current Step Detail */}
        <AnimatePresence>
          {currentStep && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{
                background: `linear-gradient(135deg,
                  ${FIVE_ELEMENTS_COSMIC_THEME[currentStep.element].primary}10,
                  ${FIVE_ELEMENTS_COSMIC_THEME[currentStep.element].secondary}05)`,
                border: `2px solid ${FIVE_ELEMENTS_COSMIC_THEME[currentStep.element].accent}`,
                borderRadius: '16px',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    {currentStep.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {currentStep.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      🧘 Práctica Filosófica
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{currentStep.philosophy.principle}:</strong> {currentStep.philosophy.teaching}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {currentStep.philosophy.practice}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <CosmicInteractionButton
                      element={currentStep.element}
                      onClick={() => handleStepComplete(currentStep.id)}
                      tooltip="Completar esta experiencia de transformación"
                    >
                      <Celebration />
                      <Typography variant="button">
                        Completar Experiencia
                      </Typography>
                    </CosmicInteractionButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children Content */}
        {children && (
          <Box sx={{ mt: 4 }}>
            {children}
          </Box>
        )}
      </CosmicJourneyContainer>
    </CosmicExperienceContext.Provider>
  );
};

export default UPlayCosmicExperienceFlow;
