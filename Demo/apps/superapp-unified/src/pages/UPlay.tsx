import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  Badge,
  useTheme,
  Icon,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  PlayArrow,
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
  TrendingUp,
  Diamond,
  Bolt,
  Star,
  AutoAwesome,
  ArrowUpward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// ⚜️ GUARDIAN AGENTS INTEGRATION - COSMIC TRANSFORMATION SYSTEM
import { UPlayCosmicIntegrator } from '../components/modules/uplay/enhanced/UPlayCosmicIntegrator';
import { UPlayCosmicExperienceFlow } from '../components/modules/uplay/enhanced/UPlayCosmicExperienceFlow';
import { UPlayCosmicDocumentation } from '../components/modules/uplay/enhanced/UPlayCosmicDocumentation';

// Component Imports
import UPlayEnhancedDashboard from '../components/modules/uplay/UPlayEnhancedDashboard';
import UPlayAdvancedVideoPlayer from '../components/modules/uplay/UPlayAdvancedVideoPlayer';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// Contexts & Hooks
import { useAuth } from '../contexts/AuthContext';
import { useDynamicTheme } from '../context/DynamicThemeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  // Add data-testid for the first tab (Dashboard) that contains UPlayEnhancedDashboard
  const testId = index === 0 ? 'uplay-dashboard-tab' : undefined;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
      data-testid={testId}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

// ✅ Enhanced UPlay Header with Corporate Styling
const UPlayHeader = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [animate, setAnimate] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // 🎯 Enhanced user stats with corporate data
  const userStats = useMemo(() => ({
    meritos: 340,
    ondas: 125,
    logrosDesbloqueados: 12,
    nextLevel: 'Maestro del Conocimiento',
    progress: 78,
    streak: 7,
    weeklyGoal: 5,
    weeklyProgress: 3,
    totalVideos: 23,
    completedChallenges: 15,
    studyHours: 48,
    socialInteractions: 156,
    currentStreak: 12,
    bestStreak: 28
  }), []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // 🎨 Corporate metrics with official brand colors
  const metrics = [
    {
      label: 'Mëritos Totales',
      value: userStats.meritos,
      icon: Diamond,
      type: 'blue',
      trend: '+23 esta semana',
      key: 'meritos'
    },
    {
      label: 'Öndas Activas',
      value: userStats.ondas,
      icon: Bolt,
      type: 'purple',
      trend: '+8 hoy',
      key: 'ondas'
    },
    {
      label: 'Logros Desbloqueados',
      value: userStats.logrosDesbloqueados,
      icon: EmojiEvents,
      type: 'navy',
      trend: '2 nuevos',
      key: 'logros'
    }
  ];

  const progressDays = [
    { label: 'L', completed: true },
    { label: 'M', completed: true },
    { label: 'X', completed: true },
    { label: 'J', completed: false },
    { label: 'V', completed: false },
    { label: 'S', completed: false },
    { label: 'D', completed: false }
  ];

  return (
    <Fade in={animate} timeout={800}>
      <div className="main-background-advanced">
        {/* ✅ Corporate Header with Brand Identity */}
        <div className="header-uplay-advanced">
          <Container maxWidth="xl">
            <div className="px-6 py-6">
              {/* Corporate Header Badge */}
              <div className="header-badge">
                <AutoAwesome sx={{ fontSize: 20 }} />
                <span>ÜPlay - GPL Gamified Play List</span>
              </div>

              {/* Main Title with Corporate Typography */}
              <Typography
                variant={isMobile ? "h4" : "h3"}
                className="header-text-enhanced"
              >
                Plataforma Interactiva de Aprendizaje Gamificado
              </Typography>

              {/* Corporate Subtitle */}
              <Typography
                variant="h6"
                className="header-subtitle-enhanced"
              >
                Experimenta el poder del aprendizaje gamificado con la filosofía CoomÜnity
              </Typography>
            </div>
          </Container>
        </div>

        {/* ✅ Corporate Metrics Cards with Defined Frames */}
        <Container maxWidth="xl">
          <div className="section-background-blue spacing-section">
            <Typography variant="h5" className="text-gradient-blue mb-4 text-center font-black">
              📊 Dashboard de Progreso Personal
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {metrics.map((metric, index) => (
                <Grid key={metric.key} item xs={12} sm={6} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`${
                      metric.type === 'blue' ? 'metric-card' :
                      metric.type === 'purple' ? 'achievement-card' :
                      'activity-card'
                    } group cursor-pointer spacing-component interactive-lift`}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onMouseEnter={() => setHoveredMetric(metric.key)}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    {/* Corporate Icon with Brand Colors */}
                    <div className={`icon-container-base icon-container-${metric.type} group-hover:scale-105 transition-transform duration-300`}>
                      <metric.icon className="text-white" sx={{ fontSize: 24 }} />
                    </div>

                    {/* Value with Corporate Typography */}
                    <div className="spacing-element">
                      <span className="text-3xl font-black text-gradient-blue">
                        {metric.value}
                      </span>
                    </div>

                    {/* ✅ Label with Better Contrast */}
                    <p className="text-sm font-semibold text-dark-contrast spacing-element">
                      {metric.label}
                    </p>

                    {/* ✅ Trend Indicator with Better Contrast */}
                    <div className="flex items-center gap-2 text-uplay-blue">
                      <ArrowUpward sx={{ fontSize: 16 }} />
                      <span className="text-sm font-medium">{metric.trend}</span>
                    </div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </div>

          {/* ✅ Corporate Progress Section with Redesigned Layout */}
          <div className="progress-section spacing-section">
            {/* Corporate Progress Header */}
            <div className="progress-header">
              <h3 className="text-lg font-bold mb-2">
                🎯 Progreso Semanal CoomÜnity
              </h3>
              <p className="text-white text-opacity-90 text-sm">
                Construyendo el Bien Común a través del aprendizaje
              </p>
            </div>

            {/* Progress Content with Corporate Design */}
            <div className="p-6 space-y-6">
              {/* Corporate Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  {/* ✅ Better contrast for progress label */}
                  <span className="font-semibold text-dark-contrast">
                    Progreso hacia el siguiente nivel
                  </span>
                  <span className="text-gradient-blue font-bold text-lg">
                    {userStats.progress}%
                  </span>
                </div>

                <div className="progress-bar-advanced">
                  <motion.div
                    className="progress-fill-advanced"
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>

                {/* ✅ Better contrast for description */}
                <div className="text-sm text-medium-contrast text-center">
                  {userStats.weeklyProgress} de {userStats.weeklyGoal} videos completados esta semana
                </div>
              </div>

              {/* Corporate Weekly Progress Days */}
              <div className="space-y-3">
                {/* ✅ Better contrast for section title */}
                <h4 className="font-semibold text-dark-contrast text-center">
                  Progreso Semanal
                </h4>

                <div className="flex justify-center gap-3">
                  {progressDays.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className={`${
                        day.completed ? 'progress-day-completed' : 'progress-day-pending'
                      } interactive-scale`}
                    >
                      {day.label}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Corporate Action Button */}
              <div className="flex justify-center mt-6">
                <button className="btn-primary-uplay">
                  <PlayArrow sx={{ fontSize: 20 }} />
                  Continuar Aventura del Conocimiento
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Fade>
  );
};

// ✅ Corporate Tab Configuration
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

const UPlay: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [cosmicMode, setCosmicMode] = useState(true);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 🌌 COSMIC EVENT HANDLERS
  const handleCosmicEvent = useCallback((event: any) => {
    console.log('🌌 COSMIC EVENT:', event);
    // Here you can handle cosmic events from Guardian systems
  }, []);

  const handleJourneyProgress = useCallback((journey: any) => {
    console.log('🎯 JOURNEY PROGRESS:', journey);
    // Handle user journey progress updates
  }, []);

  const handleStepComplete = useCallback((step: any) => {
    console.log('✨ STEP COMPLETED:', step);
    // Handle step completion with animations/rewards
  }, []);

  return (
    <div data-testid="uplay-page" className="min-h-screen">
      {/* ⚜️ COSMIC GUARDIAN INTEGRATION WRAPPER */}
      <UPlayCosmicIntegrator
        config={{
          enableRealTimeSync: true,
          enableCrossGuardianCommunication: true,
          enablePhilosophyAlignment: true,
          enableCosmicEvents: true,
          performanceMode: 'cosmic',
        }}
        onCosmicEvent={handleCosmicEvent}
      >
        {/* 🎨 COSMIC EXPERIENCE FLOW ORCHESTRATION */}
        <UPlayCosmicExperienceFlow
          onJourneyProgress={handleJourneyProgress}
          onStepComplete={handleStepComplete}
          initialJourney={{
            currentStage: 'discovery',
            currentElement: 'fuego',
            consciousnessLevel: 'explorer',
          }}
        >
          {/* 📚 COSMIC DOCUMENTATION & WISDOM SYSTEM */}
          <UPlayCosmicDocumentation
            enableContextualHelp={true}
            enableProgressChronicles={true}
            enableWisdomSharing={true}
          >
            {/* ✅ ORIGINAL UPLAY CONTENT ENHANCED */}
            <div className="cosmic-enhanced-content">
              {/* ✅ Corporate Header Section */}
              <UPlayHeader />

              <Container maxWidth="xl" className="py-4 md:py-8">
        {/* ✅ Corporate Tabs Navigation */}
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

        {/* ✅ Corporate Tab Content with Background Context */}
        <Box sx={{ mt: 3 }}>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} value={activeTab} index={index}>
              <div className="section-background-blue animate-fade-in">
                {tab.component}
              </div>
            </TabPanel>
          ))}
        </Box>

        {/* ✅ Corporate Gallery Section with Better Contrast */}
        <Fade in={true} timeout={1500}>
          <div className="gallery-section spacing-section">
            <div className="gallery-header">
              <h3 className="text-xl font-bold">
                📚 Biblioteca de Contenido Gamificado
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sample Content Items with Corporate Styling */}
              {[
                { title: 'Fundamentos de Ayni', category: 'Filosofía', progress: 85 },
                { title: 'Economía Colaborativa', category: 'Bien Común', progress: 67 },
                { title: 'Metanöia Digital', category: 'Transformación', progress: 45 },
                { title: 'Reciprocidad en Acción', category: 'Práctica', progress: 92 },
                { title: 'Consciencia Planetaria', category: 'Evolución', progress: 34 },
                { title: 'Cooperación vs Competencia', category: 'Mindset', progress: 78 }
              ].map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="content-item interactive-lift"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {/* ✅ Better contrast for content titles */}
                      <h4 className="font-semibold text-uplay-primary mb-1">
                        {content.title}
                      </h4>
                      <span className="category-tag">
                        {content.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gradient-blue">
                        {content.progress}%
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar-advanced">
                    <div
                      className="progress-fill-advanced"
                      style={{ width: `${content.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <button className="btn-secondary-uplay text-sm px-4 py-2">
                      Continuar
                    </button>
                    {/* ✅ Better contrast for timestamp */}
                    <span className="text-xs text-uplay-muted">
                      Actualizado hoy
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Fade>
      </Container>
            </div>
          </UPlayCosmicDocumentation>
        </UPlayCosmicExperienceFlow>
      </UPlayCosmicIntegrator>
    </div>
  );
};

export default UPlay;
