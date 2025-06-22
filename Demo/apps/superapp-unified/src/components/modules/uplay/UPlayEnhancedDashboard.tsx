import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  CircularProgress,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  TrendingUp,
  EmojiEvents,
  PlayArrow,
  School,
  Timeline,
  Star,
  Diamond,
  Bolt,
  AutoAwesome,
  Celebration,
  Whatshot,
  Group,
  VideoLibrary,
  Schedule,
  CheckCircle,
  LocalFireDepartment,
  QuestionAnswer,
} from '@mui/icons-material';

// Importar Revolutionary Widget
import { RevolutionaryWidget } from '../../../design-system/templates';

// Importar hooks y servicios
import { useVideos } from '../../../hooks/data/useVideoData';
import { useAuth } from '../../../contexts/AuthContext';

// Animaciones keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 188, 212, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 188, 212, 0.6); }
`;

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

/**
 * UPlayEnhancedDashboard Component
 * 
 * Dashboard mejorado del UPlay con:
 * ✨ Glassmorphism y efectos cósmicos
 * 📊 Métricas en tiempo real
 * 🎮 Progreso gamificado
 * 🏆 Sistema de logros visual
 * 📱 Diseño responsive avanzado
 * 🌟 Animaciones fluidas
 */

interface DashboardMetrics {
  totalVideos: number;
  completedVideos: number;
  totalMeritos: number;
  totalOndas: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  level: number;
  nextLevelProgress: number;
  achievements: number;
}

interface RecentActivity {
  id: string;
  type: 'video_completed' | 'achievement_unlocked' | 'level_up';
  title: string;
  description: string;
  timestamp: Date;
  rewards?: {
    meritos?: number;
    ondas?: number;
  };
}

const UPlayEnhancedDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  // Estados locales
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalVideos: 42,
    completedVideos: 18,
    totalMeritos: 340,
    totalOndas: 125,
    currentStreak: 7,
    weeklyGoal: 5,
    weeklyProgress: 3,
    level: 8,
    nextLevelProgress: 65,
    achievements: 12,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'video_completed',
      title: 'Video completado',
      description: 'Introducción a la Gamificación',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      rewards: { meritos: 25, ondas: 15 }
    },
    {
      id: '2',
      type: 'achievement_unlocked',
      title: 'Logro desbloqueado',
      description: 'Estudiante Dedicado - 7 días consecutivos',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'level_up',
      title: 'Subida de nivel',
      description: 'Has alcanzado el Nivel 8',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);

  // Datos de videos desde el backend
  const { data: videos, isLoading: videosLoading } = useVideos();

  // Componente para tarjeta de métrica con glassmorphism
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    progress?: number;
    animated?: boolean;
  }> = ({ title, value, subtitle, icon, color, progress, animated = false }) => (
    <Card
      sx={{
        background: alpha('#ffffff', 0.05),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 4,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        animation: animated ? `${floatAnimation} 3s ease-in-out infinite` : 'none',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px ${alpha(color, 0.4)}`,
          border: `1px solid ${alpha(color, 0.4)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
          zIndex: -1,
        }
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.2),
            color,
            width: 56,
            height: 56,
            boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
            animation: animated ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
          }}
        >
          {icon}
        </Avatar>
      </Box>
      
      {progress !== undefined && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(color, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
                boxShadow: `0 0 10px ${alpha(color, 0.5)}`,
              },
            }}
          />
        </Box>
      )}
    </Card>
  );

  // Componente para actividad reciente
  const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'video_completed':
          return <CheckCircle sx={{ color: '#4caf50' }} />;
        case 'achievement_unlocked':
          return <EmojiEvents sx={{ color: '#ff9800' }} />;
        case 'level_up':
          return <TrendingUp sx={{ color: '#2196f3' }} />;
        default:
          return <Star />;
      }
    };

    const formatTimeAgo = (date: Date) => {
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Hace unos minutos';
      if (diffInHours === 1) return 'Hace 1 hora';
      if (diffInHours < 24) return `Hace ${diffInHours} horas`;
      return 'Hace más de un día';
    };

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 3,
          background: alpha('#ffffff', 0.03),
          border: `1px solid ${alpha('#ffffff', 0.08)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: alpha('#ffffff', 0.06),
            transform: 'translateX(8px)',
          }
        }}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'transparent' }}>
          {getActivityIcon()}
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {activity.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activity.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatTimeAgo(activity.timestamp)}
          </Typography>
        </Box>
        {activity.rewards && (
          <Box display="flex" gap={1}>
            {activity.rewards.meritos && (
              <Chip
                icon={<Diamond sx={{ fontSize: '16px !important' }} />}
                label={`+${activity.rewards.meritos}`}
                size="small"
                sx={{ 
                  bgcolor: alpha('#9c27b0', 0.1),
                  color: '#9c27b0',
                  border: `1px solid ${alpha('#9c27b0', 0.3)}`,
                }}
              />
            )}
            {activity.rewards.ondas && (
              <Chip
                icon={<Bolt sx={{ fontSize: '16px !important' }} />}
                label={`+${activity.rewards.ondas}`}
                size="small"
                sx={{ 
                  bgcolor: alpha('#ff9800', 0.1),
                  color: '#ff9800',
                  border: `1px solid ${alpha('#ff9800', 0.3)}`,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    );
  };

  // 🎯 Datos mejorados con métricas gamificadas
  const dashboardData = useMemo(() => ({
    userStats: {
      meritos: 485,
      ondas: 1250,
      ayniLevel: 'Colaborador Equilibrado',
      nextLevel: 'Guardián del Bien Común',
      progress: 78,
      streak: 12,
      weeklyGoal: 85,
      completedToday: 3,
      totalVideos: 47,
      studyHours: 128
    },
    weeklyProgress: [
      { day: 'Lun', completed: 2, goal: 3 },
      { day: 'Mar', completed: 4, goal: 3 },
      { day: 'Mié', completed: 3, goal: 3 },
      { day: 'Jue', completed: 5, goal: 3 },
      { day: 'Vie', completed: 2, goal: 3 },
      { day: 'Sáb', completed: 1, goal: 2 },
      { day: 'Dom', completed: 0, goal: 2 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'video_completed',
        title: 'Introducción a la Gamificación',
        points: 50,
        time: '2h',
        icon: <PlayArrow />
      },
      {
        id: '2',
        type: 'achievement_unlocked',
        title: 'Desbloqueaste: Maestro del Conocimiento',
        points: 100,
        time: '3h',
        icon: <EmojiEvents />
      },
      {
        id: '3',
        type: 'social_interaction',
        title: 'Respondiste 5 preguntas correctamente',
        points: 25,
        time: '5h',
        icon: <QuestionAnswer />
      },
      {
        id: '4',
        type: 'study_session',
        title: 'Completaste sesión de estudio grupal',
        points: 75,
        time: '1d',
        icon: <Group />
      }
    ],
    quickActions: [
      { 
        label: 'Continuar Video', 
        icon: <PlayArrow />, 
        color: '#6366f1',
        description: 'Mecánicas de Recompensa - 15:30 min' 
      },
      { 
        label: 'Ver Logros', 
        icon: <EmojiEvents />, 
        color: '#fbbf24',
        description: '3 logros por desbloquear' 
      },
      { 
        label: 'Unirse a Sala', 
        icon: <Group />, 
        color: '#10b981',
        description: '5 compañeros conectados' 
      },
      { 
        label: 'Practicar', 
        icon: <AutoAwesome />, 
        color: '#a855f7',
        description: 'Preguntas interactivas' 
      }
    ]
  }), []);

  // 🎨 Métricas principales mejoradas
  const renderEnhancedMetrics = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        {
          title: 'Mëritos Totales',
          value: dashboardData.userStats.meritos,
          icon: <Diamond />,
          color: '#7c3aed',
          change: '+23 esta semana',
          key: 'meritos'
        },
        {
          title: 'Öndas Acumuladas',
          value: dashboardData.userStats.ondas,
          icon: <Bolt />,
          color: '#f59e0b',
          change: '+156 hoy',
          key: 'ondas'
        },
        {
          title: 'Racha Actual',
          value: `${dashboardData.userStats.streak} días`,
          icon: <LocalFireDepartment />,
          color: '#ef4444',
          change: 'Tu mejor racha',
          key: 'streak'
        },
        {
          title: 'Progreso Semanal',
          value: `${dashboardData.userStats.weeklyGoal}%`,
          icon: <TrendingUp />,
          color: '#10b981',
          change: '+15% vs semana pasada',
          key: 'progress'
        }
      ].map((metric, index) => (
        <Grid key={metric.key} item xs={12} sm={6} md={3}>
          <Zoom in={animate} timeout={800 + index * 150}>
            <Card
              className="uplay-metric-card"
              onMouseEnter={() => setHoveredCard(metric.key)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                transform: hoveredCard === metric.key ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '&:hover': {
                  boxShadow: `0 20px 40px ${alpha(metric.color, 0.3)}`
                }
              }}
            >
              {/* Gradiente superior */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${metric.color}, ${alpha(metric.color, 0.6)})`
                }}
              />
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(metric.color, 0.2)}, ${alpha(metric.color, 0.1)})`,
                      color: metric.color,
                      mr: 2,
                      boxShadow: `0 8px 16px ${alpha(metric.color, 0.2)}`
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" className="uplay-metric-value" sx={{ mb: 0.5 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="caption"
                  sx={{
                    color: metric.color,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <TrendingUp />
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  );

  // 🎨 Progreso semanal visual mejorado
  const renderWeeklyProgress = () => (
    <Fade in={animate} timeout={1200}>
      <Card className="uplay-glassmorphism" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Schedule />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Progreso de la Semana
            </Typography>
            <Chip
              label={`${dashboardData.userStats.weeklyGoal}% completado`}
              size="small"
              sx={{
                ml: 'auto',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {dashboardData.weeklyProgress.map((day, index) => (
              <Grid key={day.day} item xs={1.714}>
                <Slide in={animate} timeout={1000 + index * 100} direction="up">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {day.day}
                    </Typography>
                    <Box
                      sx={{
                        height: 60,
                        width: '100%',
                        background: alpha('#6366f1', 0.1),
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        border: `1px solid ${alpha('#6366f1', 0.2)}`
                      }}
                    >
                      <Box
                        className="uplay-progress-bar"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: `${Math.min((day.completed / day.goal) * 100, 100)}%`,
                          background: day.completed >= day.goal 
                            ? 'linear-gradient(180deg, #10b981, #059669)'
                            : 'linear-gradient(180deg, #6366f1, #4f46e5)',
                          borderRadius: '0 0 8px 8px',
                          transition: 'height 1s ease-out',
                          minHeight: day.completed > 0 ? '8px' : '0px'
                        }}
                      />
                      {day.completed >= day.goal && (
                        <CheckCircle
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: 20,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: 'block',
                        fontWeight: 600,
                        color: day.completed >= day.goal ? '#10b981' : 'text.secondary'
                      }}
                    >
                      {day.completed}/{day.goal}
                    </Typography>
                  </Box>
                </Slide>
              </Grid>
            ))}
          </Grid>

          {/* Meta semanal */}
          <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: alpha('#6366f1', 0.05) }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Meta Semanal: 20 videos completados
            </Typography>
            <LinearProgress
              variant="determinate"
              value={dashboardData.userStats.weeklyGoal}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              ¡Solo 3 videos más para completar tu meta! 🎯
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  // 🎨 Actividad reciente mejorada
  const renderRecentActivity = () => (
    <Fade in={animate} timeout={1400}>
      <Card className="uplay-glassmorphism">
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AutoAwesome />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Actividad Reciente
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'uplay-pulse 1.5s ease-in-out infinite'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                En vivo
              </Typography>
            </Box>
          </Box>

          <List sx={{ p: 0 }}>
            {dashboardData.recentActivity.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <Slide in={animate} timeout={1200 + index * 150} direction="left">
                  <ListItem
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha('#6366f1', 0.05),
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: 'transparent',
                          border: `2px solid ${alpha('#6366f1', 0.2)}`,
                          '& .MuiSvgIcon-root': {
                            fontSize: 20
                          }
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Chip
                            label={`+${activity.points} Mëritos`}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            component="span"
                            sx={{ display: 'inline' }}
                          >
                            hace {activity.time}
                          </Typography>
                        </span>
                      }
                    />
                  </ListItem>
                </Slide>
                {index < dashboardData.recentActivity.length - 1 && (
                  <Divider sx={{ opacity: 0.3 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Fade>
  );

  // 🎨 Acciones rápidas mejoradas
  const renderQuickActions = () => (
    <Fade in={animate} timeout={1600}>
      <Card className="uplay-glassmorphism">
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Acciones Rápidas
          </Typography>
          
          <Grid container spacing={2}>
            {dashboardData.quickActions.map((action, index) => (
              <Grid key={action.label} item xs={12} sm={6}>
                <Zoom in={animate} timeout={1400 + index * 100}>
                  <Button
                    className="uplay-card-enhanced"
                    fullWidth
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textAlign: 'left',
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${alpha(action.color, 0.1)}, ${alpha(action.color, 0.05)})`,
                      border: `1px solid ${alpha(action.color, 0.2)}`,
                      color: 'inherit',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(action.color, 0.2)}, ${alpha(action.color, 0.1)})`,
                        border: `1px solid ${alpha(action.color, 0.4)}`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: alpha(action.color, 0.2),
                          color: action.color,
                          mr: 2
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {action.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Button>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );

  const [animate, setAnimate] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Efectos de fondo */}
      <RevolutionaryWidget
        variant="secondary"
        cosmicIntensity="low"
        cosmicEffects={{
          enableGlow: false,
          enableParticles: false,
          enableAnimations: false
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.3
        }}
      />

      {/* Partículas flotantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            className="uplay-particle glow"
            sx={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </Box>

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header del Dashboard */}
        <Fade in={animate} timeout={600}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Tu Dashboard de Aprendizaje
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Nivel actual: <strong>{dashboardData.userStats.ayniLevel}</strong> • 
              Próximo: <strong>{dashboardData.userStats.nextLevel}</strong>
            </Typography>
          </Box>
        </Fade>

        {/* Métricas principales */}
        {renderEnhancedMetrics()}

        {/* Grid de contenido */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            {renderWeeklyProgress()}
          </Grid>
          <Grid item xs={12} lg={5}>
            {renderRecentActivity()}
          </Grid>
        </Grid>

        {/* Acciones rápidas */}
        <Box sx={{ mt: 3 }}>
          {renderQuickActions()}
        </Box>
      </Box>
    </Box>
  );
};

export default UPlayEnhancedDashboard; 