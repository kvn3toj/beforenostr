import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, useTheme, Fade } from '@mui/material';
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
  return (
    <Fade in={true} timeout={1000}>
      <div className="cosmic-header" data-testid="cosmic-container">
        <Container maxWidth="xl" className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-2 text-gradient-cosmic">
                ÜPlay
              </h1>
              <p className="text-lg md:text-xl font-medium text-medium-contrast">
                Gamified Play List - Experiencia de Aprendizaje Interactiva
              </p>

              {/* 🛡️ Guardian Conscious Learning State */}
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
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-4 py-2">
                <div className="text-sm text-medium-contrast">Estado</div>
                <div className="font-bold text-gradient-blue">En Línea</div>
              </div>
              <button data-testid="cosmic-play-button" aria-label="Iniciar experiencia cósmica principal" className="p-2 rounded-full bg-blue-500 text-white shadow-lg">
                <PlayArrow />
              </button>
            </div>
          </div>
        </Container>
      </div>
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
    showAyniLearning,
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
      showAyniLearning(
        'Entrando al espacio de aprendizaje colaborativo. Aquí practicamos el Ayni: dar y recibir conocimiento en equilibrio.'
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

    // Delay to ensure smooth page load and only initialize once
    const timer = setTimeout(initializeSession, 1500);
    return () => {
      clearTimeout(timer);
      isSessionInitialized = true; // Prevent re-initialization on cleanup
    };
  }, []); // Empty dependency array to run only once on mount

  // 🧘 Metacognitive reflection trigger
  useEffect(() => {
    if (learningState.sessionProgress > 0 && learningState.sessionProgress % 25 === 0) {
      showMetacognition(
        `Has progresado ${learningState.sessionProgress}% en tu sesión. Tómate un momento para reflexionar sobre lo que has aprendido y cómo lo puedes aplicar.`
      );
    }
  }, [learningState.sessionProgress, showMetacognition]);

  return (
    <div data-testid="uplay-page" className="min-h-screen">
      {/* ✅ Header Section */}
      <UPlayHeader learningState={learningState} />

      <Container maxWidth="xl" className="py-4 md:py-8">
        {/* ✅ Tabs Navigation */}
        <Fade in={true} timeout={1200}>
          <div className="tab-container-advanced">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`${
                  activeTab === index ? 'tab-active' : 'tab-inactive'
                } flex items-center relative`}
                aria-label={`Navegación a ${tab.label}`}
              >
                <tab.icon sx={{ fontSize: 20 }} />
                {tab.label}
                {tab.notifications && (
                  <span className="tab-badge">
                    {tab.notifications}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Fade>

        {/* ✅ Tab Content */}
        <Box sx={{ mt: 3 }}>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} value={activeTab} index={index}>
              <div className="section-background-blue animate-fade-in">
                {tab.component}
              </div>
            </TabPanel>
          ))}
        </Box>
      </Container>

      {/* 🛡️ Guardian Conscious Feedback System */}
      {feedbacks.map((feedback, index) => (
        <ConsciousUPlayFeedback
          key={feedback.id || `feedback-${index}`}
          feedback={feedback}
          onDismiss={() => dismissFeedback(index)}
          variant="detailed"
        />
      ))}
    </div>
  );
};

export default UPlay;
