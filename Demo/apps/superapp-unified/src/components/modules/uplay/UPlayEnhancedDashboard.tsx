import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';

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

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Efectos de partículas flotantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: theme.palette.primary.main,
            animation: `${sparkleAnimation} 2s ease-in-out infinite`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: theme.palette.secondary.main,
            animation: `${sparkleAnimation} 3s ease-in-out infinite 1s`,
          }
        }}
      />

      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Métricas principales */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Mëritos Totales"
            value={metrics.totalMeritos}
            subtitle="Recompensas ganadas"
            icon={<Diamond />}
            color="#9c27b0"
            animated
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Öndas Activas"
            value={metrics.totalOndas}
            subtitle="Energía acumulada"
            icon={<Bolt />}
            color="#ff9800"
            animated
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Videos Completados"
            value={`${metrics.completedVideos}/${metrics.totalVideos}`}
            subtitle="Progreso de aprendizaje"
            icon={<VideoLibrary />}
            color="#4caf50"
            progress={Math.round((metrics.completedVideos / metrics.totalVideos) * 100)}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Nivel Actual"
            value={metrics.level}
            subtitle="Progreso al siguiente nivel"
            icon={<TrendingUp />}
            color="#2196f3"
            progress={metrics.nextLevelProgress}
          />
        </Grid>

        {/* Progreso semanal */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: alpha('#ffffff', 0.05),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              borderRadius: 4,
              p: 3,
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Meta Semanal de Aprendizaje
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metrics.weeklyProgress} de {metrics.weeklyGoal} videos completados esta semana
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: alpha('#4caf50', 0.2),
                  color: '#4caf50',
                  width: 48,
                  height: 48,
                }}
              >
                <Schedule />
              </Avatar>
            </Box>

            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Progreso Semanal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {Math.round((metrics.weeklyProgress / metrics.weeklyGoal) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(metrics.weeklyProgress / metrics.weeklyGoal) * 100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: alpha('#4caf50', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #4caf50, #81c784)',
                    boxShadow: '0 0 15px rgba(76, 175, 80, 0.5)',
                  },
                }}
              />
            </Box>

            <Grid container spacing={2}>
              {Array.from({ length: 7 }, (_, i) => {
                const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
                const isCompleted = i < metrics.weeklyProgress;
                const isToday = i === 2; // Simulando que hoy es miércoles
                
                return (
                  <Grid item key={i}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCompleted 
                          ? `linear-gradient(135deg, #4caf50, #81c784)`
                          : isToday
                          ? alpha('#2196f3', 0.2)
                          : alpha('#ffffff', 0.1),
                        border: isToday ? `2px solid #2196f3` : 'none',
                        color: isCompleted ? 'white' : 'text.secondary',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease',
                        boxShadow: isCompleted ? '0 4px 15px rgba(76, 175, 80, 0.4)' : 'none',
                        animation: isToday ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
                      }}
                    >
                      {isCompleted ? <CheckCircle sx={{ fontSize: 20 }} /> : dayNames[i]}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>

        {/* Actividad reciente */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: alpha('#ffffff', 0.05),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              borderRadius: 4,
              p: 3,
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Actividad Reciente
              </Typography>
              <Avatar
                sx={{
                  bgcolor: alpha('#ff9800', 0.2),
                  color: '#ff9800',
                  width: 40,
                  height: 40,
                }}
              >
                <Whatshot />
              </Avatar>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </Box>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: alpha('#ffffff', 0.2),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: alpha('#ffffff', 0.4),
                  background: alpha('#ffffff', 0.05),
                }
              }}
            >
              Ver toda la actividad
            </Button>
          </Card>
        </Grid>

        {/* Acciones rápidas */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: alpha('#ffffff', 0.05),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              borderRadius: 4,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Acciones Rápidas
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }
                  }}
                >
                  Continuar Aprendiendo
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmojiEvents />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderColor: alpha('#ff9800', 0.5),
                    color: '#ff9800',
                    '&:hover': {
                      borderColor: '#ff9800',
                      background: alpha('#ff9800', 0.1),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Ver Logros
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Group />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderColor: alpha('#9c27b0', 0.5),
                    color: '#9c27b0',
                    '&:hover': {
                      borderColor: '#9c27b0',
                      background: alpha('#9c27b0', 0.1),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Salas de Estudio
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderColor: alpha('#2196f3', 0.5),
                    color: '#2196f3',
                    '&:hover': {
                      borderColor: '#2196f3',
                      background: alpha('#2196f3', 0.1),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Descubrir Contenido
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UPlayEnhancedDashboard; 