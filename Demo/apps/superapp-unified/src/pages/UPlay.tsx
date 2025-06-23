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

interface HeaderStatProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

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

// Enhanced UPlay Header with restored metrics
const UPlayHeader = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [animate, setAnimate] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // 🎯 Restored user stats from original version
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
    socialInteractions: 156
  }), []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      label: 'Mëritos Totales',
      value: userStats.meritos,
      icon: Diamond,
      type: 'blue',
      key: 'meritos'
    },
    {
      label: 'Öndas Activas',
      value: userStats.ondas,
      icon: Bolt,
      type: 'purple',
      key: 'ondas'
    },
    {
      label: 'Logros Desbloqueados',
      value: userStats.logrosDesbloqueados,
      icon: EmojiEvents,
      type: 'navy',
      key: 'logros'
    }
  ];

  return (
    <Fade in={animate} timeout={800}>
      <div className="uplay-header-corporate">
        <div className="uplay-header-badge">
          <AutoAwesome sx={{ fontSize: 20 }} />
          <span>ÜPlay - GPL Gamified Play List</span>
        </div>

        <Typography
          variant={isMobile ? "h4" : "h3"}
          className="uplay-header-title"
        >
          Plataforma Interactiva de Aprendizaje Gamificado
        </Typography>

        <Typography
          variant="h6"
          className="uplay-header-subtitle"
        >
          Experimenta el poder del aprendizaje gamificado con la filosofía CoomÜnity
        </Typography>

        {/* Corporate metrics cards */}
        <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
          {metrics.map((metric, index) => (
            <Grid key={metric.key} item xs={12} sm={6} md={4}>
              <div
                className={`uplay-metric-card-corporate type-${metric.type}`}
                onMouseEnter={() => setHoveredMetric(metric.key)}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  transform: hoveredMetric === metric.key ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <div className={`uplay-metric-icon-${metric.type}`}>
                  <metric.icon sx={{ fontSize: 28 }} />
                </div>
                <div className="uplay-metric-value">{metric.value}</div>
                <div className="uplay-metric-label">{metric.label}</div>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Enhanced progress section with corporate styling */}
        <div className="uplay-progress-section-corporate">
          <div className="uplay-progress-header-corporate">
            <div className="uplay-progress-header-title">
              Progreso Semanal CoomÜnity
            </div>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Construyendo el Bien Común a través del aprendizaje
            </Typography>
          </div>

          <div className="uplay-progress-content">
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Racha de la Semana:
              <span style={{ color: 'var(--uplay-blue)', fontWeight: 800, marginLeft: '8px' }}>
                {userStats.weeklyProgress} de {userStats.weeklyGoal} videos
              </span>
            </Typography>

            <div className="uplay-progress-bar-container">
              <div
                className="uplay-progress-bar-fill"
                style={{ width: `${(userStats.weeklyProgress / userStats.weeklyGoal) * 100}%` }}
              />
            </div>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <button className="uplay-btn-primary-corporate">
                <PlayArrow sx={{ mr: 1 }} />
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
      {/* Enhanced Header with restored functionality */}
      <UPlayHeader />

      {/* Corporate Tabs Navigation */}
      <Fade in={true} timeout={1200}>
        <div className="uplay-tabs-container-corporate">
          <Box sx={{ display: 'flex', gap: 1 }}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`uplay-tab-button-corporate ${activeTab === index ? 'active' : 'inactive'}`}
              >
                <tab.icon sx={{ fontSize: 20, mr: 1 }} />
                {tab.label}
                {tab.notifications && (
                  <Badge
                    badgeContent={tab.notifications}
                    className="uplay-tab-badge"
                    sx={{ ml: 1 }}
                  />
                )}
              </button>
            ))}
          </Box>
        </div>
      </Fade>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default UPlay;
