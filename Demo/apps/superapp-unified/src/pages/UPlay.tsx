import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, Fade, Paper, Typography, IconButton, useTheme } from '@mui/material';
import {
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
  PlayArrow,
} from '@mui/icons-material';

// ✅ UPlay Core Components (solo los esenciales)
import { UPlayGamifiedDashboard as UPlayEnhancedDashboard } from '../components/modules/uplay/UPlayGamifiedDashboard';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// 🛡️ Guardian Conscious Components
import {
  ConsciousUPlayFeedback,
  useConsciousUPlayFeedback,
  type ConsciousUPlayFeedbackData
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

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
      <Paper elevation={0} sx={{
        background: theme.palette.background.default,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        mb: 3,
        p: { xs: 2, md: 3 },
      }}>
        <Container maxWidth="xl">
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" gap={3} py={1}>
            <Box textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h3" fontWeight="600" sx={{
                mb: 0.5,
                color: theme.palette.primary.main,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}>
                ÜPlay
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                Gamified Play List - Experiencia de Aprendizaje Interactiva
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <LearningLevelChip
                  level={learningState.level}
                  progress={learningState.sessionProgress}
                  size="small"
                  data-testid="learning-level-indicator"
                />
                <ConsciousStateChip
                  state={learningState.consciousState}
                  intensity={2}
                  size="small"
                  data-testid="conscious-state-indicator"
                />
                <LearningModeChip
                  mode={learningState.mode}
                  active={learningState.currentModule !== ''}
                  size="small"
                  data-testid="learning-mode-indicator"
                />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Paper elevation={0} sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                background: 'rgba(92, 36, 131, 0.02)',
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Typography variant="caption" color={theme.palette.text.disabled}>Estado</Typography>
                <Typography variant="subtitle2" fontWeight="500" color={theme.palette.primary.main}>En Línea</Typography>
              </Paper>
              <IconButton
                data-testid="cosmic-play-button"
                aria-label="Iniciar experiencia cósmica principal"
                sx={{
                  bgcolor: 'rgba(92, 36, 131, 0.04)',
                  color: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: 'rgba(92, 36, 131, 0.08)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <PlayArrow />
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
    id: 'dashboard'
  },
  {
    label: 'Videoteca',
    icon: VideoLibrary,
    component: <UPlayInteractiveLibrary />,
    notifications: 5,
    id: 'library'
  },
  {
    label: 'Logros',
    icon: EmojiEvents,
    component: <UPlayAchievementSystem />,
    id: 'achievements'
  },
  {
    label: 'Salas de Estudio',
    icon: Groups,
    component: <UPlayStudyRooms />,
    id: 'studyrooms'
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

    setLearningState(prev => ({ ...prev, currentModule: newTabName }));

    // Provide conscious feedback for navigation
    if (newValue !== previousTab) {
      showLearningFlow(
        `Navegando hacia ${newTabName} - Manteniendo el flujo de aprendizaje consciente`,
        learningState.sessionProgress
      );
    }

    // Special feedback for collaboration (Study Rooms)
    if (newValue === 3) { // Study Rooms tab
      showReciprocidadLearning(
        'Entrando al espacio de aprendizaje colaborativo. Aquí practicamos el Reciprocidad: dar y recibir conocimiento en equilibrio.'
      );
    }

    // Special feedback for achievements
    if (newValue === 2) { // Achievements tab
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
    const timer = setTimeout(initializeSession, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [showWisdomIntegration]);

  // Handle dismissal of feedback with index parameter
  const handleDismissFeedback = (index: number) => {
    dismissFeedback(index);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        pb: 10,
      }}
      data-testid="uplay-page"
    >
      {/* Header */}
      <UPlayHeader learningState={learningState} />

      {/* Navigation Tabs */}
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="UPlay navigation tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 56,
              '& .MuiTabs-flexContainer': {
                borderBottom: 'none',
              },
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 56,
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                fontWeight: 500,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                },
                '&:hover': {
                  color: theme.palette.primary.main,
                  opacity: 0.8,
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                icon={<tab.icon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />}
                iconPosition="start"
                label={tab.label}
                id={`uplay-tab-${index}`}
                aria-controls={`uplay-tabpanel-${index}`}
                data-testid={`uplay-tab-${tab.id}`}
                sx={{
                  textTransform: 'none',
                  px: { xs: 1.5, md: 2.5 },
                  py: 1.5,
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {tabs.map((tab, index) => (
          <TabPanel key={tab.id} value={activeTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Container>

      {/* Conscious Feedback System */}
      <ConsciousUPlayFeedback
        feedbacks={feedbacks}
        onDismiss={handleDismissFeedback}
      />
    </Box>
  );
};

export default UPlay;
