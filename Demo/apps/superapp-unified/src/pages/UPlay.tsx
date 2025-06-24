import React, { useState, useEffect, useMemo } from 'react';
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
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

// Enhanced UPlay Header with Advanced Corporate Styling
const UPlayHeader = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [animate, setAnimate] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // 🎯 Enhanced user stats with more variety
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

  // 🎨 Enhanced metrics with different card types
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
      type: 'magenta',
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
        {/* 🎨 Advanced Header with Enhanced Contrast */}
        <div className="header-uplay-advanced">
          <div className="p-6">
            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-30">
                <AutoAwesome sx={{ fontSize: 20 }} />
                <span className="font-semibold text-white">ÜPlay - GPL Gamified Play List</span>
              </div>
            </div>

            {/* Main Title with Enhanced Contrast */}
            <Typography
              variant={isMobile ? "h4" : "h3"}
              className="header-text-enhanced mb-3"
            >
              Plataforma Interactiva de Aprendizaje Gamificado
            </Typography>

            {/* Subtitle with Enhanced Contrast */}
            <Typography
              variant="h6"
              className="header-subtitle-enhanced mb-4"
            >
              Experimenta el poder del aprendizaje gamificado con la filosofía CoomÜnity
            </Typography>
          </div>
        </div>

        {/* 🎨 Enhanced Metrics Cards with Improved Proportions */}
        <div className="section-background-blue spacing-section">
          <Typography variant="h5" className="text-gradient-blue mb-4 text-center font-black">
            📊 Dashboard de Progreso Personal
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
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
                  } group cursor-pointer spacing-component`}
                  whileHover={{ y: -2, scale: 1.01 }}
                  onMouseEnter={() => setHoveredMetric(metric.key)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  {/* Enhanced Icon with Better Proportions */}
                  <div className={`icon-container-base icon-container-${metric.type} group-hover:scale-105 transition-transform duration-300`}>
                    <metric.icon className="text-white" sx={{ fontSize: 24 }} />
                  </div>

                  {/* Value with enhanced typography */}
                  <div className="spacing-element">
                    <span className="text-3xl font-black text-gradient-blue">
                      {metric.value}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="text-sm font-semibold text-gray-700 spacing-element">{metric.label}</p>

                  {/* Trend indicator */}
                  <div className={`flex items-center gap-2 ${
                    metric.type === 'blue' ? 'text-blue-600' :
                    metric.type === 'purple' ? 'text-purple-600' :
                    'text-pink-600'
                  }`}>
                    <ArrowUpward sx={{ fontSize: 16 }} />
                    <span className="text-sm font-medium">{metric.trend}</span>
                  </div>

                  {/* Hover effect line */}
                  <div className="hover-line" />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* 🎨 Enhanced Progress Section with Better Proportions */}
        <div className="progress-card overflow-hidden spacing-section">
          {/* Header with corporate gradient */}
          <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-4 -m-6 mb-4">
            <h3 className="text-lg font-bold mb-2">🎯 Progreso Semanal CoomÜnity</h3>
            <p className="text-white text-opacity-85 text-sm">Construyendo el Bien Común a través del aprendizaje</p>
          </div>

          {/* Progress content with improved proportions */}
          <div className="space-y-4">
            {/* Circular progress with enhanced design and better size */}
            <div className="flex items-center justify-center">
              <div className="progress-circle-container relative">
                <svg className="progress-circle-svg" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--uplay-gray-200)"
                    strokeWidth="2"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${userStats.progress}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${userStats.progress}, 100` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--uplay-green)" />
                      <stop offset="50%" stopColor="var(--uplay-blue)" />
                      <stop offset="100%" stopColor="var(--uplay-purple)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="progress-circle-content">
                  <div className="text-center">
                    <div className="progress-circle-percentage">
                      {userStats.progress}%
                    </div>
                    <div className="progress-circle-fraction">
                      {userStats.weeklyProgress}/{userStats.weeklyGoal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly days with enhanced styling and better proportions */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Progreso Semanal</span>
                <span className="text-gradient-green font-medium">
                  {userStats.weeklyProgress} de {userStats.weeklyGoal} videos
                </span>
              </div>

              <div className="flex gap-2">
                {progressDays.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className={`w-full h-2.5 rounded-full mb-2 origin-bottom ${
                        day.completed
                          ? 'bg-gradient-to-t from-green-500 to-blue-500 shadow-md'
                          : 'bg-gray-200'
                      }`}
                    />
                    <span className={`text-xs font-medium ${
                      day.completed ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button with Better Proportions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <button className="btn-base-uplay btn-primary-uplay text-sm">
                <PlayArrow sx={{ mr: 1, fontSize: 20 }} />
                Continuar Aventura del Conocimiento
              </button>
            </Box>
          </div>
        </div>
      </div>
    </Fade>
  );
};

const tabs = [
  { label: 'Dashboard', icon: Dashboard, component: <UPlayEnhancedDashboard /> },
  { label: 'Videoteca', icon: VideoLibrary, component: <UPlayInteractiveLibrary />, notifications: 5 },
  { label: 'Logros', icon: EmojiEvents, component: <UPlayAchievementSystem /> },
  { label: 'Salas de Estudio', icon: Groups, component: <UPlayStudyRooms /> },
];

const UPlay: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" className="py-4 md:py-8">
      {/* Enhanced Header with Advanced Corporate Styling */}
      <UPlayHeader />

      {/* 🎨 Advanced Corporate Tabs Navigation */}
      <Fade in={true} timeout={1200}>
        <div className="tab-container-advanced">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`${
                  activeTab === index ? 'tab-active' : 'tab-inactive'
                } flex items-center relative`}
              >
                <tab.icon sx={{ fontSize: 20, mr: 1 }} />
                {tab.label}
                {tab.notifications && (
                  <span className="tab-badge">
                    {tab.notifications}
                  </span>
                )}
              </button>
            ))}
          </Box>
        </div>
      </Fade>

      {/* 🎨 Enhanced Tab Content with Background Context */}
      <Box sx={{ mt: 2 }}>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <div className={`${
              index === 0 ? 'section-background-blue' :
              index === 1 ? 'section-background-purple' :
              index === 2 ? 'section-background-blue' :
              'section-background-purple'
            } content-overlay`}>
              {tab.component}
            </div>
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default UPlay;
