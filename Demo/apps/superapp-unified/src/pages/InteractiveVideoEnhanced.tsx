import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  Divider,
  Paper,
  Alert,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Import our enhanced components
import InteractiveVideoPlayerOverlay from '../components/modules/uplay/components/InteractiveVideoPlayerOverlay';
import EnhancedPlayerMetrics from '../components/modules/uplay/components/EnhancedPlayerMetrics';
import VideoPlayerNotifications from '../components/modules/uplay/components/VideoPlayerNotifications';
import { useInteractiveVideo } from '../hooks/useInteractiveVideo';

// Demo video with enhanced questions
const DEMO_VIDEO_URL = '/assets/videos/vid1.mp4'; // Usar video local para demo
const DEMO_VIDEO_ID = 'coomunity-philosophy-intro';

// Enhanced questions for the demo
const enhancedQuestions = [
  {
    id: 1,
    timestamp: 10,
    endTimestamp: 35,
    type: 'multiple-choice' as const,
    question: '¿Cuál es el principio fundamental de Ayni en CoomÜnity?',
    timeLimit: 25,
    difficulty: 'medium' as const,
    reward: { merits: 20, ondas: 8 },
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Reciprocidad y equilibrio energético',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'B',
        text: 'Competencia individual extrema',
        isCorrect: false,
      },
      {
        id: 'c',
        label: 'C',
        text: 'Acumulación ilimitada de recursos',
        isCorrect: false,
      },
      {
        id: 'd',
        label: 'D',
        text: 'Jerarquía social rígida',
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    timestamp: 50,
    endTimestamp: 70,
    type: 'true-false' as const,
    question:
      '¿Las Öndas representan energía vibracional positiva que se genera al contribuir al Bien Común?',
    timeLimit: 18,
    difficulty: 'easy' as const,
    reward: { merits: 15, ondas: 12 },
    options: [
      { id: 'true', label: 'V', text: 'Verdadero', isCorrect: true },
      { id: 'false', label: 'F', text: 'Falso', isCorrect: false },
    ],
  },
  {
    id: 3,
    timestamp: 90,
    endTimestamp: 110,
    type: 'quick-response' as const,
    question: 'En CoomÜnity, ¿qué significa priorizar el "Bien Común"?',
    timeLimit: 12,
    difficulty: 'hard' as const,
    reward: { merits: 35, ondas: 15 },
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'El beneficio colectivo prevalece sobre el individual',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'B',
        text: 'Maximizar las ganancias personales',
        isCorrect: false,
      },
      {
        id: 'c',
        label: 'C',
        text: 'Mantener neutralidad en todas las decisiones',
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    timestamp: 130,
    endTimestamp: 155,
    type: 'multiple-choice' as const,
    question: '¿Cómo contribuyen los Mëritos al ecosistema CoomÜnity?',
    timeLimit: 20,
    difficulty: 'medium' as const,
    reward: { merits: 25, ondas: 10 },
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Son una moneda que reconoce las contribuciones valiosas',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'B',
        text: 'Solo sirven para decorar el perfil',
        isCorrect: false,
      },
      {
        id: 'c',
        label: 'C',
        text: 'Se obtienen únicamente por tiempo conectado',
        isCorrect: false,
      },
      {
        id: 'd',
        label: 'D',
        text: 'No tienen ningún valor real',
        isCorrect: false,
      },
    ],
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InteractiveVideoEnhanced: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [levelUpData, setLevelUpData] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);

  // Use our enhanced hook
  const {
    metrics,
    questionsData,
    isLoading,
    error,
    handleQuestionAnswer,
    handleQuestionSkip,
    handleVideoComplete,
    progressToNextLevel,
    experienceForNextLevel,
    accuracyRate,
  } = useInteractiveVideo({
    videoId: DEMO_VIDEO_ID,
    userId: 'demo-user-123',
    enableAnalytics: true,
    onRewardEarned: (reward) => {
      addNotification({
        type: 'success',
        title: '¡Recompensa Obtenida!',
        message: `Has ganado ${reward.merits} Mëritos y ${reward.ondas} Öndas por tu excelente respuesta.`,
        reward,
      });
    },
    onLevelUp: (newLevel) => {
      setLevelUpData({
        isVisible: true,
        newLevel,
        previousLevel: newLevel - 1,
      });

      addNotification({
        type: 'achievement',
        title: 'Nuevo Nivel Alcanzado',
        message: `¡Felicidades! Has alcanzado el Nivel ${newLevel}. Tu dedicación al aprendizaje es admirable.`,
        achievement: {
          icon: '🎯',
          rarity: 'epic',
        },
        autoHide: false,
      });
    },
    onAchievementUnlocked: (achievement) => {
      const achievementData = {
        streak_master: {
          title: 'Maestro de Rachas',
          message: '5 respuestas consecutivas correctas. ¡Impresionante!',
          icon: '🔥',
          rarity: 'rare',
        },
        knowledge_seeker: {
          title: 'Buscador de Conocimiento',
          message: '10 preguntas respondidas correctamente.',
          icon: '📚',
          rarity: 'epic',
        },
        energy_collector: {
          title: 'Coleccionista de Energía',
          message: 'Has acumulado 100+ Öndas de energía positiva.',
          icon: '⚡',
          rarity: 'legendary',
        },
      }[achievement] || {
        title: 'Logro Desbloqueado',
        message: 'Has desbloqueado un nuevo logro.',
        icon: '🏆',
        rarity: 'common',
      };

      addNotification({
        type: 'achievement',
        title: achievementData.title,
        message: achievementData.message,
        achievement: {
          icon: achievementData.icon,
          rarity: achievementData.rarity as any,
        },
        autoHide: false,
      });
    },
  });

  const addNotification = useCallback((notification: any) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { ...notification, id }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleQuestionAnswerWithFeedback = useCallback(
    async (questionId: number, answerId: string) => {
      try {
        const result = await handleQuestionAnswer(questionId, answerId, 5); // 5 seconds taken

        if (result.isCorrect) {
          // Update streak data for animation
          setStreakData({
            current: metrics.currentStreak + 1,
            isNew: true,
          });

          // Reset streak animation after showing
          setTimeout(() => {
            setStreakData((prev: any) => ({ ...prev, isNew: false }));
          }, 3000);
        } else {
          addNotification({
            type: 'error',
            title: 'Respuesta Incorrecta',
            message: result.feedback,
            duration: 6000,
          });
        }
      } catch (error) {
        console.error('Error handling question answer:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Hubo un problema al procesar tu respuesta.',
        });
      }
    },
    [handleQuestionAnswer, addNotification, metrics.currentStreak]
  );

  const handleVideoCompleteWithFeedback = useCallback(() => {
    handleVideoComplete(180); // 3 minutes duration

    addNotification({
      type: 'success',
      title: '¡Video Completado!',
      message: `Has completado exitosamente el video sobre la filosofía CoomÜnity. ¡Tu conocimiento sigue creciendo!`,
      duration: 8000,
    });

    // Check for completion achievements
    if (accuracyRate >= 80) {
      addNotification({
        type: 'achievement',
        title: 'Estudiante Ejemplar',
        message: `Completaste el video con ${accuracyRate.toFixed(1)}% de precisión. ¡Excelente trabajo!`,
        achievement: {
          icon: '🎓',
          rarity: 'epic',
        },
        autoHide: false,
      });
    }
  }, [handleVideoComplete, addNotification, accuracyRate]);

  // Demo data initialization
  useEffect(() => {
    // Welcome notification
    setTimeout(() => {
      addNotification({
        type: 'info',
        title: '¡Bienvenido al Reproductor Interactivo!',
        message:
          'Responde las preguntas durante el video para ganar Mëritos y Öndas.',
        duration: 6000,
      });
    }, 2000);
  }, [addNotification]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Modo Demo Activo
          </Typography>
          <Typography>
            La conexión con el backend no está disponible, pero puedes explorar
            todas las funcionalidades del reproductor interactivo en modo demo.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              p: 4,
            }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  Reproductor Interactivo Mejorado
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Explora la filosofía CoomÜnity a través de preguntas fugaces y
                  gana recompensas por tu participación activa.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<SchoolIcon />}
                    label="Aprendizaje Gamificado"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<TrophyIcon />}
                    label="Recompensas Instantáneas"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<AnalyticsIcon />}
                    label="Métricas en Tiempo Real"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Funcionalidades Destacadas
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      ⏱️ Preguntas con límite de tiempo
                    </Typography>
                    <Typography variant="body2">
                      🎯 Feedback inmediato y recompensas
                    </Typography>
                    <Typography variant="body2">
                      ���� Métricas de compromiso avanzadas
                    </Typography>
                    <Typography variant="body2">
                      🔥 Sistema de rachas y logros
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Video Player */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <InteractiveVideoPlayerOverlay
                  videoUrl={DEMO_VIDEO_URL}
                  videoId={DEMO_VIDEO_ID}
                  questions={enhancedQuestions}
                  onQuestionAnswer={handleQuestionAnswerWithFeedback}
                  onVideoComplete={handleVideoCompleteWithFeedback}
                  onMetricsUpdate={() => {}} // Handled by the hook
                  isLandscape={false}
                  autoplay={false}
                  enableAnalytics={true}
                  userId="demo-user-123"
                />
              </CardContent>
            </Card>

            {/* Video Information */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Introducción a la Filosofía CoomÜnity
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Descubre los principios fundamentales que guían nuestra
                  comunidad: Ayni (reciprocidad), Bien Común, cooperación, y
                  cómo las Öndas representan la energía positiva que generamos
                  juntos. Este video interactivo te permitirá aprender
                  participando activamente y ganando recompensas por tu
                  compromiso.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab
                      label="Información"
                      icon={<InfoIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="Preguntas"
                      icon={<SchoolIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="Logros"
                      icon={<TrophyIcon />}
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>

                <TabPanel value={currentTab} index={0}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Conceptos Clave:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Ayni:</strong> Principio de reciprocidad y
                        equilibrio energético
                        <br />• <strong>Mëritos:</strong> Moneda del ecosistema
                        que reconoce contribuciones
                        <br />• <strong>Öndas:</strong> Energía vibracional
                        positiva
                        <br />• <strong>Bien Común:</strong> Beneficio colectivo
                        sobre el individual
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Instrucciones:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Durante la reproducción aparecerán preguntas temporales.
                        Responde rápidamente para ganar más recompensas. Las
                        preguntas tienen tiempo límite y diferentes niveles de
                        dificultad.
                      </Typography>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Preguntas del Video ({enhancedQuestions.length})
                  </Typography>
                  <Stack spacing={2}>
                    {enhancedQuestions.map((question, index) => (
                      <Paper
                        key={question.id}
                        sx={{
                          p: 2,
                          border: '1px solid #e2e8f0',
                          borderRadius: 2,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            Pregunta {index + 1} ({question.timestamp}s)
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={question.difficulty}
                              size="small"
                              color={
                                question.difficulty === 'hard'
                                  ? 'error'
                                  : question.difficulty === 'medium'
                                    ? 'warning'
                                    : 'success'
                              }
                            />
                            <Chip
                              label={`${question.timeLimit}s`}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {question.question}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Recompensa: {question.reward?.merits} Mëritos +{' '}
                          {question.reward?.ondas} Öndas
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Logros Disponibles
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      {
                        title: 'Primera Respuesta',
                        description: 'Responde tu primera pregunta',
                        icon: '🎯',
                        rarity: 'common',
                      },
                      {
                        title: 'Maestro de Rachas',
                        description: '5 respuestas consecutivas correctas',
                        icon: '🔥',
                        rarity: 'rare',
                      },
                      {
                        title: 'Buscador de Conocimiento',
                        description: '10 preguntas respondidas correctamente',
                        icon: '📚',
                        rarity: 'epic',
                      },
                      {
                        title: 'Coleccionista de Energía',
                        description: 'Acumula 100+ Öndas',
                        icon: '⚡',
                        rarity: 'legendary',
                      },
                    ].map((achievement, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {achievement.icon}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {achievement.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {achievement.description}
                          </Typography>
                          <Chip
                            label={achievement.rarity}
                            size="small"
                            sx={{
                              bgcolor:
                                achievement.rarity === 'legendary'
                                  ? '#f59e0b'
                                  : achievement.rarity === 'epic'
                                    ? '#8b5cf6'
                                    : achievement.rarity === 'rare'
                                      ? '#3b82f6'
                                      : '#10b981',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>

          {/* Metrics Panel */}
          <Grid item xs={12} lg={4}>
            <Fade in={!isLoading}>
              <Box>
                <EnhancedPlayerMetrics
                  metrics={metrics}
                  progressToNextLevel={progressToNextLevel}
                  experienceForNextLevel={experienceForNextLevel}
                  accuracyRate={accuracyRate}
                  sessionStartTime={sessionStartTime}
                  showAnimations={true}
                  onMetricClick={(metric) => {
                    addNotification({
                      type: 'info',
                      title: 'Información de Métrica',
                      message: `Has hecho clic en ${metric}. Las métricas se actualizan en tiempo real basándose en tu participación.`,
                    });
                  }}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              ¿Listo para la Experiencia Completa?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Únete a CoomÜnity y participa en la construcción del Bien Común a
              través del aprendizaje gamificado.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#10b981',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f8fafc',
                  },
                }}
                onClick={() => {
                  addNotification({
                    type: 'success',
                    title: '¡Excelente Decisión!',
                    message:
                      'Tu viaje de aprendizaje en CoomÜnity está por comenzar.',
                  });
                }}
              >
                Comenzar mi Viaje
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<InfoIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Conocer Más
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* Notification System */}
      <VideoPlayerNotifications
        notifications={notifications}
        onDismissNotification={dismissNotification}
        levelUpData={levelUpData}
        streakData={streakData}
        position="top"
        maxNotifications={3}
      />
    </Box>
  );
};

export default InteractiveVideoEnhanced;
