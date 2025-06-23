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

// Enhanced Header Stats Component with hover effects
const HeaderStat: React.FC<HeaderStatProps> = ({ icon, value, label, color, isHovered, onHover, onLeave }) => (
  <Zoom in={true} timeout={800}>
    <Card
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      sx={{
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: alpha('#ffffff', 0.05),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(color, 0.3)}`,
        '&:hover': {
          boxShadow: `0 0 25px ${alpha(color, 0.4)}`
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(color, 0.2)}, ${alpha(color, 0.1)})`,
            color,
            mb: 1,
            boxShadow: `0 0 15px ${alpha(color, 0.3)}`
          }}
        >
          <Icon component={icon} sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            mb: 0.5,
            background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  </Zoom>
);

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
      color: '#7c3aed',
      key: 'meritos'
    },
    {
      label: 'Öndas Activas',
      value: userStats.ondas,
      icon: Bolt,
      color: '#f59e0b',
      key: 'ondas'
    },
    {
      label: 'Logros Desbloqueados',
      value: userStats.logrosDesbloqueados,
      icon: EmojiEvents,
      color: '#10b981',
      key: 'logros'
    }
  ];

  return (
    <Fade in={animate} timeout={800}>
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg,
            ${alpha('#6366f1', 0.1)} 0%,
            ${alpha('#a855f7', 0.08)} 50%,
            ${alpha('#10b981', 0.06)} 100%)`,
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
          p: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 20%, ${alpha('#6366f1', 0.15)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${alpha('#a855f7', 0.12)} 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: 1
          }
        }}
      >
        <div className="relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AutoAwesome
                sx={{
                  fontSize: 40,
                  color: '#6366f1',
                  mr: 2,
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))'
                }}
              />
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                }}
              >
                ÜPlay - GPL Gamified Play List
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 3,
                opacity: 0.9
              }}
            >
              Plataforma Interactiva de Aprendizaje Gamificado
            </Typography>
          </motion.div>

          {/* Restored main metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {metrics.map((metric, index) => (
              <Grid key={metric.key} item xs={12} sm={6} md={4}>
                <HeaderStat
                  icon={metric.icon}
                  value={metric.value.toString()}
                  label={metric.label}
                  color={metric.color}
                  isHovered={hoveredMetric === metric.key}
                  onHover={() => setHoveredMetric(metric.key)}
                  onLeave={() => setHoveredMetric(null)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Weekly progress indicator */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg,
                ${alpha('#6366f1', 0.1)} 0%,
                ${alpha('#a855f7', 0.08)} 100%)`,
              border: `1px solid ${alpha('#6366f1', 0.2)}`,
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              Racha de la Semana: <strong style={{ color: '#10b981' }}>{userStats.weeklyProgress} de {userStats.weeklyGoal} videos</strong>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #10b981, #06d6a0)'
                }
              }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                  boxShadow: '0 12px 32px rgba(99, 102, 241, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Continuar Aventura
            </Button>
          </Box>
        </div>
      </Box>
    </Fade>
  );
};

const tabs = [
  { label: 'Dashboard', icon: <Dashboard />, component: <UPlayEnhancedDashboard /> },
  { label: 'Videoteca', icon: <VideoLibrary />, component: <UPlayInteractiveLibrary />, notifications: 5 },
  { label: 'Logros', icon: <EmojiEvents />, component: <UPlayAchievementSystem /> },
  { label: 'Salas de Estudio', icon: <Groups />, component: <UPlayStudyRooms /> },
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

      {/* Professional Tabs Navigation */}
      <Fade in={true} timeout={1200}>
        <Card
          sx={{
            background: alpha('#ffffff', 0.05),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            borderRadius: 4,
            mb: 3,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64,
                color: alpha(theme.palette.text.primary, 0.7),
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.notifications ? (
                  <Badge badgeContent={tab.notifications} color="secondary">
                    {tab.icon}
                  </Badge>
                ) : tab.icon}
                label={tab.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Card>
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
