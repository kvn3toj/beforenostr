import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import {
  Psychology,
  Groups,
  LocalMall,
  Analytics,
  AutoAwesome,
  PlayArrow,
  CheckCircle,
  ArrowForward,
  Close,
  Favorite,
  Balance,
  TrendingUp,
  LocationOn,
  School
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Onboarding stages based on research best practices
const ONBOARDING_STAGES = [
  {
    id: 'welcome',
    title: 'Bienvenido a CoomÜnity',
    subtitle: 'Tu transformación personal hacia el Bien Común comienza aquí',
    icon: <AutoAwesome />,
    color: '#4CAF50'
  },
  {
    id: 'philosophy',
    title: 'Descubre Ayni',
    subtitle: 'Explora el principio de reciprocidad que transforma comunidades',
    icon: <Balance />,
    color: '#2196F3'
  },
  {
    id: 'personalization',
    title: 'Personaliza tu Experiencia',
    subtitle: 'Configura tu journey basado en tus valores y objetivos',
    icon: <Psychology />,
    color: '#FF9800'
  },
  {
    id: 'community',
    title: 'Conecta con tu Hub Local',
    subtitle: 'Encuentra personas afines en tu área geográfica',
    icon: <LocationOn />,
    color: '#9C27B0'
  },
  {
    id: 'first_value',
    title: 'Experimenta el Valor',
    subtitle: 'Completa tu primera acción y gana Öndas',
    icon: <TrendingUp />,
    color: '#F44336'
  }
];

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const theme = useTheme();
  const [currentStage, setCurrentStage] = useState(0);
  const [userSegment, setUserSegment] = useState<string>('');
  const [philosophyScore, setPhilosophyScore] = useState(0);
  const [localHubData, setLocalHubData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ondasEarned, setOndasEarned] = useState(0);

  const currentStageData = ONBOARDING_STAGES[currentStage];
  const progress = ((currentStage + 1) / ONBOARDING_STAGES.length) * 100;

  // Simulate API calls for personalization
  useEffect(() => {
    if (currentStage === 2) {
      // Simulate philosophy assessment
      setTimeout(() => {
        setPhilosophyScore(Math.floor(Math.random() * 30) + 70); // 70-100%
      }, 1500);
    }
    
    if (currentStage === 3) {
      // Simulate local hub data fetch
      setIsLoading(true);
      setTimeout(() => {
        setLocalHubData({
          hubName: 'CoomÜnity Madrid Centro',
          members: 47,
          activeProjects: 12,
          recentActivity: 'Taller de Economía Colaborativa - Mañana 19:00'
        });
        setIsLoading(false);
      }, 2000);
    }
  }, [currentStage]);

  const handleNext = () => {
    if (currentStage < ONBOARDING_STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  // Gamification: Award Öndas for completing stages
  const awardOndas = (amount: number) => {
    setOndasEarned(prev => prev + amount);
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: alpha(theme.palette.background.default, 0.95),
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card
          sx={{
            maxWidth: 800,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: theme.shadows[24]
          }}
        >
          {/* Header with Progress */}
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${currentStageData.color}20, ${currentStageData.color}10)`,
              borderBottom: `1px solid ${alpha(currentStageData.color, 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                {currentStage + 1} de {ONBOARDING_STAGES.length}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {ondasEarned > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Chip
                      icon={<AutoAwesome />}
                      label={`${ondasEarned} Öndas`}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  </motion.div>
                )}
                
                <IconButton onClick={handleSkip} size="small">
                  <Close />
                </IconButton>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(currentStageData.color, 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: currentStageData.color,
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Content Area */}
          <CardContent sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {renderStageContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Navigation Footer */}
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Button
              onClick={handlePrevious}
              disabled={currentStage === 0}
              variant="outlined"
              color="inherit"
            >
              Anterior
            </Button>

            <Stepper activeStep={currentStage} sx={{ flex: 1, mx: 3 }}>
              {ONBOARDING_STAGES.map((stage, index) => (
                <Step key={stage.id}>
                  <StepLabel
                    icon={
                      <motion.div
                        animate={{
                          scale: index === currentStage ? 1.2 : 1,
                          rotate: index <= currentStage ? 360 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: index <= currentStage ? stage.color : 'grey.300',
                            color: 'white',
                            fontSize: '1rem'
                          }}
                        >
                          {index <= currentStage ? <CheckCircle /> : stage.icon}
                        </Avatar>
                      </motion.div>
                    }
                  />
                </Step>
              ))}
            </Stepper>

            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: currentStageData.color,
                '&:hover': { bgcolor: alpha(currentStageData.color, 0.8) }
              }}
            >
              {currentStage === ONBOARDING_STAGES.length - 1 ? 'Comenzar' : 'Continuar'}
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );

  function renderStageContent() {
    switch (currentStage) {
      case 0:
        return <WelcomeStage onAwardOndas={awardOndas} />;
      case 1:
        return <PhilosophyStage onSegmentUser={setUserSegment} onAwardOndas={awardOndas} />;
      case 2:
        return <PersonalizationStage score={philosophyScore} segment={userSegment} onAwardOndas={awardOndas} />;
      case 3:
        return <CommunityStage hubData={localHubData} isLoading={isLoading} onAwardOndas={awardOndas} />;
      case 4:
        return <FirstValueStage ondasEarned={ondasEarned} onAwardOndas={awardOndas} />;
      default:
        return null;
    }
  }
};

// Stage Components
const WelcomeStage: React.FC<{ onAwardOndas: (amount: number) => void }> = ({ onAwardOndas }) => {
  useEffect(() => {
    // Award welcome Öndas after 2 seconds
    const timer = setTimeout(() => onAwardOndas(5), 2000);
    return () => clearTimeout(timer);
  }, [onAwardOndas]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: 'primary.main',
            margin: '0 auto 24px',
            fontSize: '3rem'
          }}
        >
          <AutoAwesome />
        </Avatar>
      </motion.div>

      <Typography variant="h3" fontWeight="700" gutterBottom color="primary.main">
        ¡Bienvenido a CoomÜnity!
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
        Tu journey de transformación personal hacia el Bien Común comienza aquí. 
        Descubrirás cómo la reciprocidad puede cambiar tu vida y tu comunidad.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
            <Balance color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle2" fontWeight="600">Ayni</Typography>
            <Typography variant="caption" color="text.secondary">Reciprocidad</Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
            <Favorite color="secondary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle2" fontWeight="600">Bien Común</Typography>
            <Typography variant="caption" color="text.secondary">Colectivo &gt; Individual</Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
            <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle2" fontWeight="600">Metanöia</Typography>
            <Typography variant="caption" color="text.secondary">Transformación</Typography>
          </Card>
        </motion.div>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        Este proceso tomará solo 5 minutos y personalizará tu experiencia completamente.
      </Typography>
    </Box>
  );
};

const PhilosophyStage: React.FC<{
  onSegmentUser: (segment: string) => void;
  onAwardOndas: (amount: number) => void;
}> = ({ onSegmentUser, onAwardOndas }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'reciprocity',
      question: '¿Cómo prefieres intercambiar valor?',
      options: [
        { value: 'immediate', label: 'Intercambio inmediato y directo' },
        { value: 'balanced', label: 'Balance equilibrado a largo plazo' },
        { value: 'community', label: 'Contribución al bienestar comunitario' }
      ]
    },
    {
      id: 'collaboration',
      question: '¿Cuál es tu estilo de colaboración?',
      options: [
        { value: 'leader', label: 'Me gusta liderar e inspirar' },
        { value: 'supporter', label: 'Prefiero apoyar y facilitar' },
        { value: 'innovator', label: 'Aporto ideas creativas y soluciones' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...selectedAnswers, [questionId]: value };
    setSelectedAnswers(newAnswers);

    if (Object.keys(newAnswers).length === questions.length) {
      // Determine user segment based on answers
      let segment = 'balanced';
      if (newAnswers.reciprocity === 'community' && newAnswers.collaboration === 'leader') {
        segment = 'community_leader';
      } else if (newAnswers.reciprocity === 'immediate' && newAnswers.collaboration === 'innovator') {
        segment = 'entrepreneur';
      }

      setTimeout(() => {
        setShowResults(true);
        onSegmentUser(segment);
        onAwardOndas(10);
      }, 500);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="600" gutterBottom textAlign="center">
        Descubre tu Alineación con Ayni
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Responde estas preguntas para personalizar tu experiencia
      </Typography>

      <Stack spacing={4}>
        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {q.question}
              </Typography>

              <Stack spacing={2}>
                {q.options.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      onClick={() => handleAnswer(q.id, option.value)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedAnswers[q.id] === option.value 
                          ? '2px solid' 
                          : '1px solid',
                        borderColor: selectedAnswers[q.id] === option.value 
                          ? 'primary.main' 
                          : 'divider',
                        bgcolor: selectedAnswers[q.id] === option.value 
                          ? alpha(theme.palette.primary.main, 0.1) 
                          : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Typography variant="body1">
                        {option.label}
                      </Typography>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Stack>

      {showResults && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card sx={{ p: 3, mt: 4, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  ¡Assessment Completado!
                </Typography>
                <Typography variant="body2">
                  Has ganado 10 Öndas. Tu perfil está siendo personalizado.
                </Typography>
              </Box>
            </Box>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

const PersonalizationStage: React.FC<{
  score: number;
  segment: string;
  onAwardOndas: (amount: number) => void;
}> = ({ score, segment, onAwardOndas }) => {
  const [goals, setGoals] = useState<string[]>([]);

  const availableGoals = [
    'Desarrollar habilidades colaborativas',
    'Construir red profesional consciente',
    'Crear impacto local sostenible',
    'Generar ingresos alineados con valores',
    'Liderar proyectos comunitarios',
    'Aprender filosofías transformacionales'
  ];

  const handleGoalToggle = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
      if (goals.length === 2) { // Third goal selected
        onAwardOndas(8);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="600" gutterBottom textAlign="center">
        Personaliza tu Journey
      </Typography>

      {/* Philosophy Score Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #4CAF50, #2196F3)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'white' }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
              <Psychology sx={{ fontSize: 30 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600">
                Tu Alineación Filosófica
              </Typography>
              <Typography variant="h3" fontWeight="700">
                {score}%
              </Typography>
              <Typography variant="body2">
                Excelente alineación con los principios de Ayni
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>

      {/* Goal Selection */}
      <Typography variant="h6" gutterBottom>
        Selecciona tus objetivos principales (3 recomendados):
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {availableGoals.map((goal, index) => (
          <motion.div
            key={goal}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => handleGoalToggle(goal)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: goals.includes(goal) ? '2px solid' : '1px solid',
                borderColor: goals.includes(goal) ? 'primary.main' : 'divider',
                bgcolor: goals.includes(goal) 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {goals.includes(goal) && <CheckCircle color="primary" />}
                <Typography variant="body1">
                  {goal}
                </Typography>
              </Box>
            </Card>
          </motion.div>
        ))}
      </Stack>

      {goals.length >= 3 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card sx={{ p: 2, bgcolor: 'info.light' }}>
            <Typography variant="body2" color="info.contrastText">
              ¡Perfecto! Tu experiencia será personalizada basada en estos objetivos.
            </Typography>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

const CommunityStage: React.FC<{
  hubData: any;
  isLoading: boolean;
  onAwardOndas: (amount: number) => void;
}> = ({ hubData, isLoading, onAwardOndas }) => {
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinHub = () => {
    setHasJoined(true);
    onAwardOndas(15);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="600" gutterBottom textAlign="center">
        Conecta con tu Comunidad Local
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Hemos encontrado tu hub CoomÜnity más cercano
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <AutoAwesome sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          </motion.div>
          <Typography variant="body1">
            Buscando tu comunidad local...
          </Typography>
        </Box>
      ) : hubData && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ p: 4, background: 'linear-gradient(135deg, #9C27B0, #673AB7)' }}>
            <Box sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocationOn sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    {hubData.hubName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    A 2.3 km de tu ubicación
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="700">
                    {hubData.members}
                  </Typography>
                  <Typography variant="body2">Miembros</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="700">
                    {hubData.activeProjects}
                  </Typography>
                  <Typography variant="body2">Proyectos Activos</Typography>
                </Box>
              </Stack>

              <Card sx={{ p: 2, mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  Actividad Reciente:
                </Typography>
                <Typography variant="body2">
                  {hubData.recentActivity}
                </Typography>
              </Card>

              {!hasJoined ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinHub}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Únete a este Hub
                </Button>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card sx={{ p: 2, bgcolor: 'success.main', textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="600">
                      ¡Bienvenido al Hub!
                    </Typography>
                    <Typography variant="body2">
                      Has ganado 15 Öndas por unirte
                    </Typography>
                  </Card>
                </motion.div>
              )}
            </Box>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

const FirstValueStage: React.FC<{
  ondasEarned: number;
  onAwardOndas: (amount: number) => void;
}> = ({ ondasEarned, onAwardOndas }) => {
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [marketplaceBrowsed, setMarketplaceBrowsed] = useState(false);

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    onAwardOndas(20);
  };

  const handleMarketplaceBrowse = () => {
    setMarketplaceBrowsed(true);
    onAwardOndas(10);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="600" gutterBottom textAlign="center">
        Experimenta el Valor Inmediatamente
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Completa estas acciones para experimentar el poder de CoomÜnity
      </Typography>

      {/* Öndas Summary */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <AutoAwesome sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="700">
              {ondasEarned} Öndas
            </Typography>
            <Typography variant="h6">
              Ganadas durante tu onboarding
            </Typography>
          </Box>
        </Card>
      </motion.div>

      {/* Action Items */}
      <Stack spacing={3}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PlayArrow color="primary" sx={{ fontSize: 30 }} />
              <Typography variant="h6" fontWeight="600">
                Mira tu primer video ÜPlay
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              "Introducción a CoomÜnity" - 3 minutos
            </Typography>
            
            {!videoCompleted ? (
              <Button
                variant="contained"
                onClick={handleVideoComplete}
                startIcon={<PlayArrow />}
              >
                Ver Video (+20 Öndas)
              </Button>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Chip
                  icon={<CheckCircle />}
                  label="Video Completado"
                  color="success"
                  variant="filled"
                />
              </motion.div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LocalMall color="secondary" sx={{ fontSize: 30 }} />
              <Typography variant="h6" fontWeight="600">
                Explora el Marketplace Local
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Descubre productos y servicios de tu comunidad
            </Typography>
            
            {!marketplaceBrowsed ? (
              <Button
                variant="outlined"
                onClick={handleMarketplaceBrowse}
                startIcon={<LocalMall />}
              >
                Explorar Marketplace (+10 Öndas)
              </Button>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Chip
                  icon={<CheckCircle />}
                  label="Marketplace Explorado"
                  color="success"
                  variant="filled"
                />
              </motion.div>
            )}
          </Card>
        </motion.div>
      </Stack>

      {videoCompleted && marketplaceBrowsed && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card sx={{ p: 3, mt: 4, bgcolor: 'success.light', textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color="success.main">
              ¡Onboarding Completado!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Has ganado {ondasEarned} Öndas y estás listo para comenzar tu transformación
            </Typography>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default OnboardingFlow;