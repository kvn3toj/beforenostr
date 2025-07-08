import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Fade,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Chip,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
  PlayArrow,
  BrightnessHigh,
  School,
  Extension,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// ✅ UPlay Core Components (solo los esenciales)
import { UPlayGamifiedDashboard as UPlayEnhancedDashboard } from '../components/modules/uplay/UPlayGamifiedDashboard';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// 🛡️ Guardian Conscious Components
import {
  ConsciousUPlayFeedback,
  useConsciousUPlayFeedback,
  type ConsciousUPlayFeedbackData,
} from '../components/modules/uplay/components/ConsciousUPlayFeedback';
import {
  LearningLevelChip,
  ConsciousStateChip,
  LearningModeChip,
} from '../components/modules/uplay/components/ConsciousUPlayChips';

// Styles
import '../styles/uplay-advanced.css';

// ✅ Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
    >
      {value === index && (
        <Fade in={true} timeout={600}>
          <Box sx={{ pt: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
};

// Keyframes para la animación de pulso
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(92, 36, 131, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(92, 36, 131, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(92, 36, 131, 0);
  }
`;

// ✅ Simple Header Component
interface UPlayHeaderProps {
  learningState: {
    level: 'beginner' | 'intermediate' | 'advanced' | 'mastery';
    consciousState: 'dormant' | 'awakening' | 'aware' | 'enlightened';
    mode: 'passive' | 'interactive' | 'immersive' | 'collaborative';
    sessionProgress: number;
    currentModule: string;
  };
}

const UPlayHeader: React.FC<UPlayHeaderProps> = ({ learningState }) => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={800}>
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
          p: { xs: 2, md: 3 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle, rgba(92, 36, 131, 0.05) 0%, rgba(92, 36, 131, 0) 40%)`,
            animation: 'rotate 20s linear infinite',
          },
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            gap={3}
          >
            <Box textAlign={{ xs: 'center', md: 'left' }}>
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  mb: 0.5,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-1px',
                }}
              >
                ÜPlay
              </Typography>
              <Typography
                variant="h6"
                color={theme.palette.text.secondary}
                sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, fontWeight: 400 }}
              >
                Gamified Play List
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
                mt: { xs: 2, md: 0 },
              }}
            >
              {/* Insignias de estado */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Chip
                  icon={<School />}
                  label={learningState.level}
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                  data-testid="learning-level-indicator"
                  aria-label={`Nivel de aprendizaje actual: ${learningState.level}`}
                />
                <Chip
                  icon={<BrightnessHigh />}
                  label={learningState.consciousState}
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    fontWeight: 500,
                  }}
                  data-testid="conscious-state-indicator"
                  aria-label={`Estado de conciencia actual: ${learningState.consciousState}`}
                />
                <Chip
                  icon={<Extension />}
                  label={learningState.mode}
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: 'info.main',
                    color: 'info.main',
                    fontWeight: 500,
                  }}
                  data-testid="learning-mode-indicator"
                  aria-label={`Modo de aprendizaje actual: ${learningState.mode}`}
                />
              </Box>

              <IconButton
                data-testid="cosmic-play-button"
                aria-label="Iniciar experiencia cósmica principal"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 56,
                  height: 56,
                  animation: `${pulseAnimation} 2s infinite`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Paper>
    </Fade>
  );
};

// ✅ Tab Configuration
const tabs = [
  {
    label: 'Dashboard',
    icon: Dashboard,
    component: <UPlayEnhancedDashboard />,
    id: 'dashboard',
  },
  {
    label: 'Videoteca',
    icon: VideoLibrary,
    component: <UPlayInteractiveLibrary />,
    notifications: 5,
    id: 'library',
  },
  {
    label: 'Logros',
    icon: EmojiEvents,
    component: <UPlayAchievementSystem />,
    id: 'achievements',
  },
  {
    label: 'Salas de Estudio',
    icon: Groups,
    component: <UPlayStudyRooms />,
    id: 'studyrooms',
  },
];

// ✅ Main UPlay Component
const UPlay: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // 🛡️ Guardian Conscious Feedback System
  const {
    feedbacks,
    dismissFeedback,
    showLearningFlow,
    showWisdomIntegration,
    showReciprocidadLearning,
    showCollectiveGrowth,
    showMetacognition,
  } = useConsciousUPlayFeedback();

  // 🧠 Learning State Management
  const [learningState, setLearningState] = useState({
    level: 'intermediate' as const,
    consciousState: 'aware' as const,
    mode: 'interactive' as const,
    sessionProgress: 67,
    currentModule: '',
  });

  // Handle tab change with conscious feedback
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const previousTab = activeTab;
    setActiveTab(newValue);

    // 🌟 Conscious navigation feedback
    const tabNames = ['Dashboard', 'Videoteca', 'Logros', 'Salas de Estudio'];
    const newTabName = tabNames[newValue];

    setLearningState((prev) => ({ ...prev, currentModule: newTabName }));

    // Provide conscious feedback for navigation
    if (newValue !== previousTab) {
      showLearningFlow(
        `Navegando hacia ${newTabName} - Manteniendo el flujo de aprendizaje consciente`,
        learningState.sessionProgress
      );
    }

    // Special feedback for collaboration (Study Rooms)
    if (newValue === 3) {
      // Study Rooms tab
      showReciprocidadLearning(
        'Entrando al espacio de aprendizaje colaborativo. Aquí practicamos el Reciprocidad: dar y recibir conocimiento en equilibrio.'
      );
    }

    // Special feedback for achievements
    if (newValue === 2) {
      // Achievements tab
      showCollectiveGrowth(
        'Tus logros contribuyen al crecimiento colectivo. Cada avance individual fortalece el Bien Común.'
      );
    }
  };

  // 🌟 Session initialization with conscious greeting
  useEffect(() => {
    let isSessionInitialized = false;

    const initializeSession = () => {
      if (!isSessionInitialized) {
        isSessionInitialized = true;
        showWisdomIntegration(
          'Tu mente está preparada para una experiencia de aprendizaje transformadora.',
          {
            meritos: 10,
            ondas: 5,
            wisdom_points: 3,
          }
        );
      }
    };

    // Initialize session after a small delay for better UX
    setTimeout(initializeSession, 500);

    return () => {
      isSessionInitialized = false;
    };
  }, []);

  const handleDismissFeedback = (index: number) => {
    dismissFeedback(index);
    showMetacognition(
      'Has procesado un insight. La metacognición es clave para la maestría.'
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <UPlayHeader learningState={learningState} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="UPlay Navigation Tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              minWidth: 0,
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                backgroundColor: 'rgba(92, 36, 131, 0.04)',
                borderRadius: '8px 8px 0 0',
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={
                tab.notifications ? (
                  <Badge
                    color="secondary"
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -5,
                        top: 5,
                      },
                    }}
                  >
                    {tab.label}
                  </Badge>
                ) : (
                  tab.label
                )
              }
              icon={<tab.icon />}
              iconPosition="start"
              id={`uplay-tab-${index}`}
              aria-controls={`uplay-tabpanel-${index}`}
              data-testid={`uplay-tab-${tab.id}`}
              disableRipple
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel key={tab.id} value={activeTab} index={index}>
          {tab.component}
        </TabPanel>
      ))}

      {/* 🛡️ Guardian Conscious Feedback Container */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 360,
        }}
        aria-label="Contenedor de retroalimentación consciente y notificaciones de aprendizaje"
        role="region"
        aria-live="polite"
      >
        {feedbacks.map((feedback, index) => (
          <ConsciousUPlayFeedback
            key={index}
            feedback={feedback}
            onDismiss={() => handleDismissFeedback(index)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default UPlay;
